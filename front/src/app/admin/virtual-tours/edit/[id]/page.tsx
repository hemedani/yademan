import { Suspense } from "react";
import { cookies } from "next/headers";
import { translateModelNameToPersian } from "@/utils/helper";
import { ReqType } from "@/types/declarations/selectInp";
import { gets } from "@/app/actions/place/gets";
import { get } from "@/app/actions/virtual_tour/get";
import { FormEditVirtualTour } from "@/components/template/FormEditVirtualTour";

export default async function EditVirtualTourPage({
  params,
}: {
  params: { id: string };
}) {
  const token = (await cookies()).get("token");
  const { id } = params;

  // Fetch the virtual tour data
  const tourGet: ReqType["main"]["virtual_tour"]["get"]["get"] = {
    _id: 1,
    name: 1,
    description: 1,
    status: 1,
    place: {
      _id: 1,
      name: 1,
    },
    panorama: {
      _id: 1,
      name: 1,
    },
  };

  const tourResponse = await get({
    set: { _id: id },
    get: tourGet,
  });

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

  const tourData = tourResponse.success ? tourResponse.body : null;

  if (!tourData) {
    return (
      <div className="p-8">
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          تور مجازی مورد نظر یافت نشد!
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-start mb-6">
        <div className="bg-blue-500 w-1 h-8 ml-3 rounded-full"></div>
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
            ویرایش {translateModelNameToPersian("virtual_tour")}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">{tourData.name}</p>
        </div>
      </div>

      <Suspense fallback={<div className="p-8">در حال بارگذاری...</div>}>
        <FormEditVirtualTour
          token={token?.value}
          places={places}
          tourData={tourData}
        />
      </Suspense>
    </div>
  );
}
