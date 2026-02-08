"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { get as getVirtualTour } from "@/app/actions/virtual_tour/get";
import { virtual_tourSchema } from "@/types/declarations/selectInp";
import { getLesanBaseUrl } from "@/services/api";
import { getImageUploadUrl } from "@/utils/imageUrl";

// Dynamically import PhotoSphereViewer to avoid SSR issues
const PhotoSphereViewer = dynamic(() => import("@/components/organisms/PhotoSphereViewer"), {
  ssr: false,
});

const VirtualTourPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const tourId = params.id as string;

  const [tour, setTour] = useState<virtual_tourSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tourLoaded, setTourLoaded] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getVirtualTour({
          set: {
            _id: tourId,
          },
          get: {
            _id: 1,
            name: 1,
            description: 1,
            status: 1,
            panorama: {
              _id: 1,
              name: 1,
              mimType: 1,
              size: 1,
              alt_text: 1,
            },
            place: {
              _id: 1,
              name: 1,
            },
            hotspots: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        });

        if (result.success) {
          const tourData = result.body[0];
          if (tourData) {
            setTour(tourData);
          } else {
            setError(t("virtualTour.noTours"));
          }
        } else {
          setError(result.body?.message || t("virtualTour.errorMessage"));
        }
      } catch (err) {
        console.error("Error loading virtual tour:", err);
        setError(t("virtualTour.errorMessage"));
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTour();
    }
  }, [tourId, t]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a00]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF007A]"></div>
          <p className="mt-4 text-white">{t("virtualTour.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a00]">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">{t("virtualTour.errorTitle")}</h2>
          <p className="text-[#a0a0a0] mb-6">{error || t("virtualTour.errorMessage")}</p>
          <button
            onClick={() => router.push(`/${locale || "en"}/`)}
            className="px-4 py-2 bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white rounded-md text-sm font-medium"
          >
            {t("Common.back")}
          </button>
        </div>
      </div>
    );
  }

  if (!tour.panorama?.name) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a00]">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">{t("virtualTour.errorTitle")}</h2>
          <p className="text-[#a0a0a0] mb-6">{t("virtualTour.missingPanorama")}</p>
          <button
            onClick={() => router.push(`/${locale || "en"}/`)}
            className="px-4 py-2 bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white rounded-md text-sm font-medium"
          >
            {t("Common.back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-[#1e1e1e]/80 backdrop-blur-sm rounded-xl p-4 border border-[#333] max-w-xs">
        <h1 className="text-xl font-bold text-white truncate">{tour.name}</h1>
        {tour.description && (
          <p className="text-[#a0a0a0] text-sm mt-2 line-clamp-2">{tour.description}</p>
        )}
        <div className="mt-2 text-xs text-[#a0a0a0]">
          {tour.place?.name && <span>{tour.place.name}</span>}
        </div>
      </div>

      <button
        onClick={() => router.push(`/${locale || "en"}/`)}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333] text-white hover:bg-[#2a2a2a] transition-colors shadow-lg"
        aria-label={t("Common.close")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[#FF007A]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <PhotoSphereViewer
        panoramaUrl={getImageUploadUrl(tour.panorama.name, "images")}
        height="100vh"
        width="100%"
        hotspots={(tour.hotspots || []).map((hotspot, index) => ({
          ...hotspot,
          id: `hotspot-${index}`,
        }))}
        onReady={() => setTourLoaded(true)}
      />

      {!tourLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a00]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF007A]"></div>
            <p className="mt-4 text-white">{t("virtualTour.loading")}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTourPage;
