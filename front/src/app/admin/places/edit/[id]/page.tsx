import FormUpdatePlace from "@/components/template/FormUpdatePlace";
import { translateModelNameToPersian } from "@/utils/helper";

export default function EditPlace({ params }: { params: { id: string } }) {
  return (
    <div className="relative min-h-full">
      <div className="mb-8">
        <div className="flex items-start">
          <div className="bg-blue-500 w-1 h-8 ml-3 rounded-full"></div>
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              ویرایش {translateModelNameToPersian("place")}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              اطلاعات مکان را ویرایش کنید
            </p>
          </div>
        </div>
      </div>

      <FormUpdatePlace placeId={params.id} />
    </div>
  );
}
