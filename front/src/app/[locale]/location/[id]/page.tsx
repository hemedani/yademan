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
import { get } from "@/app/actions/place/get";
import { gets } from "@/app/actions/place/gets";

interface LocationPageProps {
  params: Promise<{ id: string }>;
}

type Media = { _id: string; name: string };
type Ref = { _id: string; name: string };

type PlaceRow = {
  _id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  antiquity?: number | null;
  center?: { type: "Point"; coordinates: [number, number] } | null;
  address?: string | null;
  hoursOfOperation?: string | null;
  contact?: {
    phone?: string | null;
    website?: string | null;
    social?: string[] | null;
  } | null;
  province?: Ref | null;
  city?: Ref | null;
  category?: Ref | null;
  tags?: Ref[] | null;
  thumbnail?: Media | null;
  gallery?: Media[] | null;
  comments?:
    | {
        _id: string;
        text: string;
        rating?: number | null;
        status?: string | null;
        user?: { first_name?: string; last_name?: string } | null;
      }[]
    | null;
};

/**
 * `/uploads/images/<name>` through the same-origin proxy. A relative URL is
 * correct on both the server (markup) and the client, whereas an absolute
 * `LESAN_URL` would leak `127.0.0.1` into server-rendered pages.
 */
const mediaUrl = (media: Media): string =>
  `/api/image-proxy?path=${encodeURIComponent(`uploads/images/${media.name}`)}`;

const fetchPlace = async (id: string): Promise<PlaceRow | null> => {
  const result = await get({
    set: { _id: id },
    get: {
      _id: 1,
      name: 1,
      slug: 1,
      description: 1,
      antiquity: 1,
      center: 1,
      address: 1,
      hoursOfOperation: 1,
      contact: 1,
      province: { _id: 1, name: 1 },
      city: { _id: 1, name: 1 },
      category: { _id: 1, name: 1 },
      tags: { _id: 1, name: 1 },
      thumbnail: { _id: 1, name: 1 },
      gallery: { _id: 1, name: 1 },
      comments: {
        _id: 1,
        text: 1,
        rating: 1,
        status: 1,
        user: { _id: 1, first_name: 1, last_name: 1 },
      },
    } as never,
  });

  if (!result.success || !result.body) return null;

  // `place.get` answers with a list, unlike `event.get`.
  const rows = Array.isArray(result.body)
    ? (result.body as PlaceRow[])
    : [result.body as PlaceRow];

  return rows[0] ?? null;
};

export async function generateMetadata({ params }: LocationPageProps) {
  const { id } = await params;
  const place = await fetchPlace(id);

  if (!place) {
    return { title: "Location Not Found - Yademan" };
  }

  return {
    title: `${place.name} - Yademan`,
    description: place.description ?? undefined,
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { id } = await params;
  const place = await fetchPlace(id);

  if (!place) {
    notFound();
  }

  // Only approved comments are public; the rest are awaiting moderation.
  const reviews = (place.comments ?? []).filter(
    (comment) => !comment.status || comment.status === "approved",
  );

  const rated = reviews.filter(
    (comment) => typeof comment.rating === "number" && (comment.rating ?? 0) > 0,
  );
  const rating = rated.length
    ? rated.reduce((sum, comment) => sum + (comment.rating ?? 0), 0) / rated.length
    : 0;

  const images = [place.thumbnail, ...(place.gallery ?? [])]
    .filter((media): media is Media => Boolean(media?.name))
    .map(mediaUrl);

  const coordinates = place.center?.coordinates
    ? { lat: place.center.coordinates[1], lng: place.center.coordinates[0] }
    : undefined;

  // `join()` always yields a string, so `??` would never fall through — test
  // for an empty result instead.
  const fallbackAddress = [place.province?.name, place.city?.name]
    .filter(Boolean)
    .join("، ");
  const address = place.address || fallbackAddress || undefined;

  const historicalPeriod =
    typeof place.antiquity === "number" && place.antiquity > 0
      ? `${place.antiquity.toLocaleString("fa-IR")} سال`
      : undefined;

  // Siblings from the same province, excluding this place. Skipped entirely
  // when the place has no province: an empty filter would return the whole
  // catalogue instead of nothing.
  const relatedRows: (PlaceRow & { category?: Ref })[] = place.province?._id
    ? await gets({
        set: { page: 1, limit: 4, province: place.province._id },
        get: {
          data: {
            _id: 1,
            name: 1,
            category: { _id: 1, name: 1 },
            thumbnail: { _id: 1, name: 1 },
          },
        } as never,
      }).then((result) =>
        result.success && result.body
          ? ((result.body as { data?: (PlaceRow & { category?: Ref })[] }).data ?? [])
          : [],
      )
    : [];

  const related = relatedRows
    .filter((row) => row._id !== place._id)
    .slice(0, 4)
    .map((row) => ({
      id: row._id,
      title: row.name,
      category: row.category?.name,
      image: row.thumbnail?.name ? mediaUrl(row.thumbnail) : undefined,
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <LocationHeader
              title={place.name}
              category={place.category?.name}
              rating={rating}
              reviewCount={reviews.length}
              images={images}
              address={address}
              coordinates={coordinates}
            />

            <div className="flex items-center space-x-4">
              <FavoriteButton locationId={place._id} />
              <ShareButton
                title={place.name}
                description={place.description ?? ""}
              />
            </div>

            <LocationGallery images={images} title={place.name} />
            <LocationInfo
              description={place.description ?? undefined}
              category={place.category?.name}
              historicalPeriod={historicalPeriod}
              features={(place.tags ?? []).map((tag) => tag.name)}
              visitingHours={place.hoursOfOperation ?? undefined}
              website={place.contact?.website ?? undefined}
              phone={place.contact?.phone ?? undefined}
            />

            <Suspense fallback={<div>Loading reviews...</div>}>
              <LocationReviews
                reviews={reviews.map((comment) => ({
                  id: comment._id,
                  author:
                    [comment.user?.first_name, comment.user?.last_name]
                      .filter(Boolean)
                      .join(" ") || "کاربر مهمان",
                  text: comment.text,
                  rating: comment.rating ?? null,
                }))}
              />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {coordinates && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <LocationMap coordinates={coordinates} title={place.name} />
              </div>
            )}

            <Suspense fallback={<div>Loading related locations...</div>}>
              <RelatedLocations currentLocationId={place._id} locations={related} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
