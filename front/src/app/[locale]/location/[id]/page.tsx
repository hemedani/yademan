// Purpose: Dynamic page for individual location details with map integration and user interactions

import { notFound } from "next/navigation";
import { Suspense } from "react";
import LocationHeader from "@/components/location/LocationHeader";
import LocationGallery from "@/components/location/LocationGallery";
import LocationInfo from "@/components/location/LocationInfo";
import LocationReviews from "@/components/location/LocationReviews";
import LocationMap from "@/components/location/LocationMap";
import RelatedLocations from "@/components/location/RelatedLocations";
import FavoriteButton from "@/components/location/FavoriteButton";
import ShareButton from "@/components/location/ShareButton";
import { getLocationById } from "@/lib/api/locations";

interface LocationPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: LocationPageProps) {
  const location = await getLocationById(params.id);

  if (!location) {
    return {
      title: "Location Not Found - Yademan",
    };
  }

  return {
    title: `${location.name} - Yademan`,
    description: location.description,
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const location = await getLocationById(params.id);

  if (!location) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <LocationHeader location={location} />

            <div className="flex items-center space-x-4">
              <FavoriteButton locationId={location.id} />
              <ShareButton location={location} />
            </div>

            <LocationGallery images={location.images} />
            <LocationInfo location={location} />

            <Suspense fallback={<div>Loading reviews...</div>}>
              <LocationReviews locationId={location.id} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <LocationMap
                latitude={location.latitude}
                longitude={location.longitude}
                name={location.name}
              />
            </div>

            <Suspense fallback={<div>Loading related locations...</div>}>
              <RelatedLocations
                currentLocationId={location.id}
                category={location.category}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
