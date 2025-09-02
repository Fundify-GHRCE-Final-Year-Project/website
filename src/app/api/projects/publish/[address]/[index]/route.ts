import { NextResponse } from "next/server";
import { ProjectModel } from "@/models/project";
import { title } from "process";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string; index: string }> }
) {
  try {
    // extract parmeters from request
    const { address, index } = await params;
    const body = await request.json();

    const project = ProjectModel.findOneAndUpdate(
      {
        owner: address,
        index: index,
      },
      {
        $set: {
          title: body.title,
          description: body.description,
          members: body.members,
        },
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        ok: true,
        data: project,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // if any error occurs, return 500
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        ok: false,
        error: "Error updating project metadata",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
