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
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LocationPageProps) {
  const resolvedParams = await params;
  const location = await getLocationById(resolvedParams.id);

  if (!location) {
    return {
      title: "Location Not Found - Yademan",
    };
  }

  return {
    title: `${location.title} - Yademan`,
    description: location.description,
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const resolvedParams = await params;
  const location = await getLocationById(resolvedParams.id);

  if (!location) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <LocationHeader
              title={location.title}
              category={location.category}
              rating={location.rating}
              reviewCount={location.reviewCount}
              images={location.images}
              address={location.address}
              coordinates={location.coordinates}
            />

            <div className="flex items-center space-x-4">
              <FavoriteButton locationId={location.id} />
              <ShareButton
                title={location.title}
                description={location.description}
              />
            </div>

            <LocationGallery images={location.images} title={location.title} />
            <LocationInfo
              description={location.description}
              category={location.category}
              historicalPeriod={location.historicalPeriod}
              features={location.features}
              accessibility={location.accessibility}
              visitingHours={location.visitingHours}
              ticketPrice={location.ticketPrice}
              website={location.website}
              phone={location.phone}
            />

            <Suspense fallback={<div>Loading reviews...</div>}>
              <LocationReviews />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <LocationMap
                coordinates={location.coordinates}
                title={location.title}
              />
            </div>

            <Suspense fallback={<div>Loading related locations...</div>}>
              <RelatedLocations currentLocationId={location.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
