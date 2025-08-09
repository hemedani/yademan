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
    <div className="h-screen flex flex-col">
      {/* Header with search */}
      <header className="bg-white shadow-sm border-b z-50 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>
            <div className="flex items-center space-x-4">
              {/* User menu will go here */}
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex relative">
        {/* Sidebar with filters and location list */}
        <aside className="w-96 bg-white border-r overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <FilterPanel />
          </div>
          <div className="flex-1 overflow-y-auto">
            <LocationList />
          </div>
        </aside>

        {/* Map area */}
        <main className="flex-1 relative">
          <Suspense fallback={<MapSkeleton />}>
            <ClientMapWrapper />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
