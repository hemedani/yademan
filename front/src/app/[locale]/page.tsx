import { Suspense } from "react";
import MapSkeleton from "@/components/map/MapSkeleton";
import FilterPanel from "@/components/filters/FilterPanel";
import SearchBar from "@/components/search/SearchBar";
import LocationList from "@/components/location/LocationList";
import ClientMapWrapper from "@/components/ClientMapWrapper";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("HomePage");

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full max-w-none overflow-x-hidden flex flex-col">
      {/* Header with search - Mobile-first responsive */}
      <header className="bg-white shadow-sm border-b relative z-10 w-full">
        <div className="w-full px-4 py-3 sm:py-4">
          {/* Mobile: Stack title and search vertically */}
          <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            {/* Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center lg:text-right">
              {t("title")}
            </h1>

            {/* Search Bar - Full width on mobile, constrained on desktop */}
            <div className="w-full lg:flex-1 lg:max-w-2xl lg:mx-8">
              <SearchBar />
            </div>

            {/* User menu area - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
              {/* User menu will go here */}
            </div>
          </div>
        </div>
      </header>

      {/* Main content area - Mobile-first responsive layout */}
      <div className="flex-1 flex flex-col lg:flex-row relative w-full overflow-hidden">
        {/* Sidebar with filters and location list */}
        {/* Mobile: Full width, stacked above map */}
        {/* Desktop: Fixed width sidebar */}
        <aside className="w-full lg:w-96 bg-white border-b lg:border-r lg:border-b-0 overflow-hidden flex flex-col lg:h-[calc(100vh-8rem)]">
          {/* Filter Panel */}
          <div className="p-3 sm:p-4 border-b">
            <FilterPanel />
          </div>

          {/* Location List */}
          <div className="flex-1 overflow-y-auto lg:max-h-[calc(100vh-16rem)]">
            <LocationList />
          </div>
        </aside>

        {/* Map area - Mobile-first responsive */}
        {/* Mobile: Fixed height below sidebar */}
        {/* Desktop: Takes remaining width */}
        <main className="flex-1 relative h-64 sm:h-80 lg:h-[calc(100vh-8rem)] w-full">
          <Suspense fallback={<MapSkeleton className="w-full h-full" />}>
            <div className="w-full h-full">
              <ClientMapWrapper />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
