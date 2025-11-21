import FormUpdatePlace from "@/components/template/FormUpdatePlace";
import { translateModelNameToPersian } from "@/utils/helper";
import { Metadata } from "next";

interface PageProps {
  params: { id: string };
}

/**
 * Edit Place page component
 */
export default function EditPlace({ params }: PageProps) {
  return (
    <div className="relative min-h-full">
      <div className="mb-8">
        <div className="flex items-start">
          <div className="bg-pink-500 w-1 h-8 ml-3 rounded-full"></div>
          <div>
            <h1 className="text-2xl md:text-3xl text-white font-bold">
              ویرایش {translateModelNameToPersian("place")}
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              اطلاعات مکان را ویرایش کنید
            </p>
          </div>
        </div>
      </div>

      <FormUpdatePlace placeId={params.id} />
    </div>
  );
}

/**
 * Generate metadata for the page
 */
export function generateMetadata({ params }: PageProps): Metadata {
  return {
    title: `ویرایش ${translateModelNameToPersian("place")} | نقشه شهر`,
  };
}
