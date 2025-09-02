// app/api/users/[address]/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { ProjectModel } from "@/models/project";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    console.log(`API Route: GET /api/users/${address}/projects/count called`);
    const projects = await ProjectModel.find({
      owner: address,
    });
    console.log("at api:", projects.length);

    return NextResponse.json({
      ok: true,
      data: projects.length,
    });
  } catch (error) {
    console.error("API Route: Error fetching user projects:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to fetch projects",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
