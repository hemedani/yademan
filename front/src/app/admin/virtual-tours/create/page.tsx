import { Suspense } from "react";
import { cookies } from "next/headers";
import { translateModelNameToPersian } from "@/utils/helper";
import { ReqType } from "@/types/declarations/selectInp";
import { gets } from "@/app/actions/place/gets";
import { FormCreateVirtualTour } from "@/components/template/FormCreateVirtualTour";

export default async function CreateVirtualTourPage() {
  const token = (await cookies()).get("token");

  // Fetch places for the dropdown
  const placesSet: ReqType["main"]["place"]["gets"]["set"] = {
    limit: 100, // Fetch up to 100 places
    page: 1,
    status: "active", // Only show active places
  };

  const placesGet: ReqType["main"]["place"]["gets"]["get"] = {
    data: {
      _id: 1,
      name: 1,
    },
    metadata: {
      total: 1,
      page: 1,
      limit: 1,
      pageCount: 1,
    },
  };

  const placesResponse = await gets({ set: placesSet, get: placesGet });
  const places = placesResponse.success
    ? placesResponse.body.data.map((place: any) => ({
        value: place._id,
        label: place.name,
      }))
    : [];

  return (
    <div className="p-4 text-white">
      <div className="flex items-start mb-6">
        <div className="bg-pink-600 w-1 h-8 ml-3 rounded-full"></div>
        <div>
          <h1 className="text-2xl md:text-3xl text-white font-bold">
            ایجاد {translateModelNameToPersian("virtual_tour")} جدید
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            فرم زیر را برای ایجاد تور مجازی جدید تکمیل کنید
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="p-8">در حال بارگذاری...</div>}>
        <FormCreateVirtualTour token={token?.value} places={places} />
      </Suspense>
    </div>
  );
}
