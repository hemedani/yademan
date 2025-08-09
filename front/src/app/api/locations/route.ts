// Purpose: Locations API route for fetching, creating, and managing location data

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
} from "@/lib/api/locations";
import { LocationFilters, CreateLocationData } from "@/types/location";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const filters: LocationFilters = {
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      bounds: searchParams.get("bounds") ? JSON.parse(searchParams.get("bounds")!) : undefined,
      limit: parseInt(searchParams.get("limit") || "50"),
      offset: parseInt(searchParams.get("offset") || "0"),
      sortBy: searchParams.get("sortBy") as "name" | "created_at" | "rating" || "name",
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" || "asc",
    };

    const result = await getLocations(filters);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      locations: result.data,
      total: result.total,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error("Locations GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const locationData: CreateLocationData = await request.json();

    // Validate required fields
    if (!locationData.name || !locationData.latitude || !locationData.longitude) {
      return NextResponse.json(
        { error: "Missing required fields: name, latitude, longitude" },
        { status: 400 }
      );
    }

    const result = await createLocation({
      ...locationData,
      createdBy: user.id,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Locations POST error:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }

    const result = await updateLocation(id, updateData, user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Not found" ? 404 : 403 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Locations PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteLocation(id, user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Not found" ? 404 : 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Locations DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}
