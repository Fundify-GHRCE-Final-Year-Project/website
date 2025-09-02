// app/api/user/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const wallet = (body?.wallet || "").toString();

    if (!wallet) {
      return NextResponse.json({ error: "wallet is required" }, { status: 400 });
    }

    // upsert minimal record (create if not exists)
    const user = await User.findOneAndUpdate(
      { wallet },
      { $setOnInsert: { wallet }, $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json(user);
  } catch (err) {
    console.error("POST /api/user error:", err);
    return NextResponse.json({ error: "Create/Upsert failed" }, { status: 500 });
  }
}
