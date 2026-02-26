import { Suspense } from "react";
import { translateModelNameToPersian } from "@/utils/helper";
import { ReqType } from "@/types/declarations/selectInp";
import { get } from "@/app/actions/virtual_tour/get";
import { FormEditVirtualTour } from "@/components/template/FormEditVirtualTour";

export default async function EditVirtualTourPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const tourGet: ReqType["main"]["virtual_tour"]["get"]["get"] = {
    _id: 1,
    name: 1,
    description: 1,
    status: 1,
  };

  const tourResponse = await get({
    set: { _id: id },
    get: tourGet,
  });

  const tourData = tourResponse.success ? tourResponse.body[0] : null;

  if (!tourData) {
    return (
      <div className="p-8 text-white">
        <div className="bg-red-900/30 p-4 rounded-md text-red-400 border border-red-700">
          تور مجازی مورد نظر یافت نشد!
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-white">
      <div className="flex items-start mb-6">
        <div className="bg-pink-600 w-1 h-8 ml-3 rounded-full"></div>
        <div>
          <h1 className="text-2xl md:text-3xl text-white font-bold">
            ویرایش {translateModelNameToPersian("virtual_tour")}
          </h1>
          <p className="text-gray-400 mt-2 text-sm">{tourData.name}</p>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-white">در حال بارگذاری...</div>}>
        <FormEditVirtualTour tourData={tourData} />
      </Suspense>
    </div>
  );
}
