import { cookies } from "next/headers";
import FormCreatePlace from "@/components/template/FormCreatePlace";
import { translateModelNameToPersian } from "@/utils/helper";

export default async function CreatePlace() {
  const token = (await cookies()).get("token");
  const lesanUrl = process.env.LESAN_URL
    ? process.env.LESAN_URL
    : "http://localhost:1382";

  return (
    <div className="relative min-h-full">
      <div className="mb-8">
        <div className="flex items-start">
          <div className="bg-blue-500 w-1 h-8 ml-3 rounded-full"></div>
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              ایجاد {translateModelNameToPersian("place")} جدید
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              اطلاعات مکان جدید را وارد کنید
            </p>
          </div>
        </div>
      </div>

      <FormCreatePlace token={token?.value} lesanUrl={lesanUrl} />
    </div>
  );
}
