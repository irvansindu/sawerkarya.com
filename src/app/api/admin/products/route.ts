import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import products from "../../../../data/products.json";

const PRODUCTS_PATH = path.join(process.cwd(), "src", "data", "products.json");

function checkAuth(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const header = req.headers.get("x-admin-password") || "";
  return header === adminPassword;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as unknown;
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Body harus berupa array produk" }, { status: 400 });
    }

    await fs.promises.writeFile(PRODUCTS_PATH, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
