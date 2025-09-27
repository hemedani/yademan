// Purpose: Locations API route for fetching, creating, and managing location data

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/lib/api/locations";
import { CreateLocationRequest } from "@/lib/api/locations";
import { LocationsFilters } from "@/lib/api/locations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const filters: LocationsFilters = {
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      limit: parseInt(searchParams.get("limit") || "50"),
      page: parseInt(searchParams.get("page") || "1"),
      rating: searchParams.get("rating")
        ? parseInt(searchParams.get("rating")!)
        : undefined,
    };

    const result = await getLocations(filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Locations GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const locationData = await request.json();

    // Validate required fields
    if (
      !locationData.name ||
      !locationData.latitude ||
      !locationData.longitude
    ) {
      return NextResponse.json(
        { error: "Missing required fields: name, latitude, longitude" },
        { status: 400 },
      );
    }

    // Convert to CreateLocationRequest format
    const createRequest: CreateLocationRequest = {
      title: locationData.name,
      description: locationData.description || "",
      category: locationData.category || "",
      images: locationData.images || [],
      address: locationData.address || "",
      coordinates: {
        lat: locationData.latitude,
        lng: locationData.longitude,
      },
      historicalPeriod: locationData.historicalPeriod,
      features: locationData.features || [],
      accessibility: locationData.accessibility,
      visitingHours: locationData.visitingHours,
      ticketPrice: locationData.ticketPrice,
      website: locationData.website,
      phone: locationData.phone,
    };

    const result = await createLocation(createRequest);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Locations POST error:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 },
      );
    }

    const result = await updateLocation({ id, ...updateData });

    if (!result) {
      return NextResponse.json(
        { error: "Location not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Locations PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 },
      );
    }

    const result = await deleteLocation(id);

    if (!result) {
      return NextResponse.json(
        { error: "Location not found or delete failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Locations DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 },
    );
  }
}
