// app/api/users/[address]/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { ProjectModel } from '@/models/project';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    await dbConnect();
    
    const { address } = params;
    
    if (!address) {
      return NextResponse.json(
        { ok: false, error: 'Address is required' },
        { status: 400 }
      );
    }

    // Find all projects owned by this user
    const projects = await ProjectModel.find({
      owner: address.toLowerCase() // Case insensitive search
    }).sort({ timestamp: -1 });

    return NextResponse.json({
      ok: true,
      data: projects.map(project => project.toJSON())
    });

  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}