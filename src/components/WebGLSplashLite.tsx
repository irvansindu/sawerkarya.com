'use client';
import { useEffect, useRef } from 'react';

// Lightweight WebGL splash using ping-pong framebuffers (not full fluid sim)
// - Additive color blobs following cursor
// - Trail persistence via decay
// - Layered behind content (zIndex: 0)

export default function WebGLSplashLite() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return;
    const glx = gl as WebGLRenderingContext;
    const cnv = canvas as HTMLCanvasElement;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const rect = cnv.getBoundingClientRect();
      cnv.width = Math.floor(rect.width * dpr);
      cnv.height = Math.floor(rect.height * dpr);
      glx.viewport(0, 0, cnv.width, cnv.height);
      setupTargets();
    };

    const vertexSrc = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main(){
        vUv = aPos*0.5+0.5;
        gl_Position = vec4(aPos,0.0,1.0);
      }
    `;

    const fadeFrag = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform float uDecay;
      void main(){
        vec4 c = texture2D(uTex, vUv);
        gl_FragColor = c * uDecay;
      }
    `;

    const splatFrag = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec2 uPoint;
      uniform vec3 uColor;
      uniform float uRadius;
      void main(){
        vec2 p = vUv - uPoint;
        float d = dot(p,p);
        float a = exp(-d / (uRadius*uRadius));
        vec3 base = texture2D(uTex, vUv).rgb;
        gl_FragColor = vec4(base + uColor * a, 1.0);
      }
    `;

    const blitFrag = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      void main(){
        gl_FragColor = texture2D(uTex, vUv);
      }
    `;

    function compile(type: number, src: string){
      const s = glx.createShader(type)!;
      glx.shaderSource(s, src);
      glx.compileShader(s);
      return s;
    }
    function program(vsSrc: string, fsSrc: string){
      const p = glx.createProgram()!;
      const vs = compile(glx.VERTEX_SHADER, vsSrc);
      const fs = compile(glx.FRAGMENT_SHADER, fsSrc);
      glx.attachShader(p, vs); glx.attachShader(p, fs); glx.linkProgram(p);
      return p;
    }

    const quad = glx.createBuffer();
    glx.bindBuffer(glx.ARRAY_BUFFER, quad);
    glx.bufferData(glx.ARRAY_BUFFER, new Float32Array([
      -1,-1,  -1,1,  1,-1,  1,1
    ]), glx.STATIC_DRAW);

    const fadeProg = program(vertexSrc, fadeFrag);
    const splatProg = program(vertexSrc, splatFrag);
    const blitProg = program(vertexSrc, blitFrag);

    const bindQuad = (prog: WebGLProgram) => {
      glx.bindBuffer(glx.ARRAY_BUFFER, quad);
      const loc = glx.getAttribLocation(prog, 'aPos');
      glx.vertexAttribPointer(loc, 2, glx.FLOAT, false, 0, 0);
      glx.enableVertexAttribArray(loc);
    };

    // Ping-pong targets
    let fboA: WebGLFramebuffer | null = null;
    let fboB: WebGLFramebuffer | null = null;
    let texA: WebGLTexture | null = null;
    let texB: WebGLTexture | null = null;

    function makeTarget(){
      const tex = glx.createTexture()!;
      glx.bindTexture(glx.TEXTURE_2D, tex);
      glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MIN_FILTER, glx.LINEAR);
      glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MAG_FILTER, glx.LINEAR);
      glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_S, glx.CLAMP_TO_EDGE);
      glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_T, glx.CLAMP_TO_EDGE);
      glx.texImage2D(glx.TEXTURE_2D, 0, glx.RGBA, cnv.width, cnv.height, 0, glx.RGBA, glx.UNSIGNED_BYTE, null);
      const fbo = glx.createFramebuffer()!;
      glx.bindFramebuffer(glx.FRAMEBUFFER, fbo);
      glx.framebufferTexture2D(glx.FRAMEBUFFER, glx.COLOR_ATTACHMENT0, glx.TEXTURE_2D, tex, 0);
      return { tex, fbo };
    }

    function setupTargets(){
      const ta = makeTarget();
      const tb = makeTarget();
      fboA = ta.fbo; texA = ta.tex;
      fboB = tb.fbo; texB = tb.tex;
      // clear
      glx.bindFramebuffer(glx.FRAMEBUFFER, fboA);
      glx.clearColor(0,0,0,0);
      glx.clear(glx.COLOR_BUFFER_BIT);
      glx.bindFramebuffer(glx.FRAMEBUFFER, fboB);
      glx.clear(glx.COLOR_BUFFER_BIT);
      glx.bindFramebuffer(glx.FRAMEBUFFER, null);
    }

    resize();
    window.addEventListener('resize', resize);

    const pointer = { x: 0.5, y: 0.5, moved: false };
    const toUv = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - (clientY - rect.top) / rect.height;
      return { x, y };
    };
    const onMove = (e: MouseEvent) => { const u = toUv(e.clientX, e.clientY); pointer.x=u.x; pointer.y=u.y; pointer.moved = true; };
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if(!t) return; const u = toUv(t.clientX, t.clientY); pointer.x=u.x; pointer.y=u.y; pointer.moved=true; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    let hue = 0;
    const step = () => {
      if (!fboA || !fboB || !texA || !texB) return;
      // 1) fade A -> B
      glx.bindFramebuffer(glx.FRAMEBUFFER, fboB);
      glx.useProgram(fadeProg);
      bindQuad(fadeProg);
      const decayLoc = glx.getUniformLocation(fadeProg, 'uDecay');
      const texLoc0 = glx.getUniformLocation(fadeProg, 'uTex');
      glx.activeTexture(glx.TEXTURE0);
      glx.bindTexture(glx.TEXTURE_2D, texA);
      glx.uniform1i(texLoc0, 0);
      glx.uniform1f(decayLoc, 0.96);
      glx.drawArrays(glx.TRIANGLE_STRIP, 0, 4);

      // 2) splat on top (B -> B)
      glx.useProgram(splatProg);
      bindQuad(splatProg);
      const texLoc1 = glx.getUniformLocation(splatProg, 'uTex');
      const pointLoc = glx.getUniformLocation(splatProg, 'uPoint');
      const colorLoc = glx.getUniformLocation(splatProg, 'uColor');
      const radiusLoc = glx.getUniformLocation(splatProg, 'uRadius');
      glx.activeTexture(glx.TEXTURE0);
      glx.bindTexture(glx.TEXTURE_2D, texB);
      glx.uniform1i(texLoc1, 0);
      glx.uniform2f(pointLoc, pointer.x, pointer.y);
      hue = (hue + 2.0) % 360.0;
      const c = hslToRgb(hue/360, 0.95, 0.6);
      glx.uniform3f(colorLoc, c[0], c[1], c[2]);
      glx.uniform1f(radiusLoc, 0.08);
      if (pointer.moved) {
        glx.drawArrays(glx.TRIANGLE_STRIP, 0, 4);
        pointer.moved = false;
      }

      // swap: B -> A (copy)
      glx.bindFramebuffer(glx.FRAMEBUFFER, fboA);
      glx.useProgram(blitProg);
      bindQuad(blitProg);
      const texLoc2 = glx.getUniformLocation(blitProg, 'uTex');
      glx.activeTexture(glx.TEXTURE0);
      glx.bindTexture(glx.TEXTURE_2D, texB);
      glx.uniform1i(texLoc2, 0);
      glx.drawArrays(glx.TRIANGLE_STRIP, 0, 4);

      // 3) display to screen from A
      glx.bindFramebuffer(glx.FRAMEBUFFER, null);
      glx.useProgram(blitProg);
      bindQuad(blitProg);
      glx.activeTexture(glx.TEXTURE0);
      glx.bindTexture(glx.TEXTURE_2D, texA);
      glx.uniform1i(texLoc2, 0);
      glx.drawArrays(glx.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(step);
    };

    const raf = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', mixBlendMode: 'screen', opacity: 0.7 }} />
    </div>
  );
}

// Helpers
function hslToRgb(h: number, s: number, l: number){
  let r: number, g: number, b: number;
  if(s === 0){ r = g = b = l; }
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [r, g, b];
}
