// Purpose: Dynamic location API route for individual location operations (GET, PUT, DELETE)

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getLocationById,
  updateLocation,
  deleteLocation
} from "@/lib/api/locations";

interface RouteParams {
  params: { id: string };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const result = await getLocationById(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Not found" ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Location GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;
    const updateData = await request.json();

    const result = await updateLocation(id, updateData, user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Not found" ? 404 : 403 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Location PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    const result = await deleteLocation(id, user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Not found" ? 404 : 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Location DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}
