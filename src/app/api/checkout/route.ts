import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Tripay checkout handler.
// Pastikan env berikut di-set di .env.local (jangan di-commit ke git!):
// - TRIPAY_API_KEY
// - TRIPAY_MERCHANT_CODE
// - TRIPAY_PRIVATE_KEY
// - TRIPAY_API_BASE (opsional, default sandbox)
// - TRIPAY_DEFAULT_METHOD (opsional, contoh: QRIS)
// - TRIPAY_CALLBACK_URL (opsional)
// - TRIPAY_RETURN_URL (opsional, base url untuk hasil pembayaran)

export async function POST(req: NextRequest) {
  try {
    const { productName, optionLabel, amount } = (await req.json()) as {
      productName?: string;
      optionLabel?: string;
      amount?: number;
    };

    if (!productName || !optionLabel || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const apiKey = process.env.TRIPAY_API_KEY;
    const merchantCode = process.env.TRIPAY_MERCHANT_CODE;
    const privateKey = process.env.TRIPAY_PRIVATE_KEY;
    const baseUrl = process.env.TRIPAY_API_BASE || "https://tripay.co.id/api-sandbox";
    const defaultMethod = process.env.TRIPAY_DEFAULT_METHOD || "QRIS";
    const callbackUrl = process.env.TRIPAY_CALLBACK_URL || "http://localhost:3000/api/tripay/callback";
    const returnUrlBase = process.env.TRIPAY_RETURN_URL || "http://localhost:3000/status";

    if (!apiKey || !merchantCode || !privateKey) {
      return NextResponse.json(
        { error: "Konfigurasi Tripay belum lengkap (TRIPAY_API_KEY / TRIPAY_MERCHANT_CODE / TRIPAY_PRIVATE_KEY)" },
        { status: 500 }
      );
    }

    const merchantRef = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    // signature = HMAC_SHA256(merchant_code + merchant_ref + amount, private_key)
    const signature = crypto
      .createHmac("sha256", privateKey)
      .update(merchantCode + merchantRef + String(amount))
      .digest("hex");

    const payload: Record<string, unknown> = {
      method: defaultMethod,
      merchant_ref: merchantRef,
      amount,
      customer_name: "Guest",
      customer_email: "guest@example.com",
      customer_phone: "081234567890",
      order_items: [
        {
          sku: `${productName}-${optionLabel}`,
          name: `${productName} ${optionLabel}`,
          price: amount,
          quantity: 1,
        },
      ],
      callback_url: callbackUrl,
      return_url: `${returnUrlBase.replace(/\/$/, "")}/${merchantRef}`,
      signature,
    };

    const resp = await fetch(`${baseUrl}/transaction/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok || !data) {
      return NextResponse.json({ error: "Tripay error", detail: data }, { status: resp.status || 500 });
    }

    // Sesuaikan dengan struktur response Tripay, biasanya data.checkout_url atau data.payment_url
    const checkoutUrl = data?.data?.checkout_url || data?.data?.payment_url || null;

    return NextResponse.json({ checkoutUrl, raw: data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
