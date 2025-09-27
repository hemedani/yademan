// Purpose: Dynamic location API route for individual location operations (GET, PUT, DELETE)

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getLocationById,
  updateLocation,
  deleteLocation,
} from "@/lib/api/locations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await getLocationById(id);

    if (!result) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Location GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const updateData = await request.json();

    const result = await updateLocation({ id, ...updateData });

    if (!result) {
      return NextResponse.json(
        { error: "Location not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Location PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const result = await deleteLocation(id);

    if (!result) {
      return NextResponse.json(
        { error: "Location not found or delete failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Location DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 },
    );
  }
}
