import FormUpdatePlaceRelations from "@/components/template/FormUpdatePlaceRelations";
import { translateModelNameToPersian } from "@/utils/helper";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlaceRelations(props: PageProps) {
  const params = await props.params;
  const placeId = params.id;

  const token = (await cookies()).get("token");
  const lesanUrl = process.env.LESAN_URL
    ? process.env.LESAN_URL
    : "http://localhost:1382";

  return (
    <div className="relative min-h-full">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="bg-purple-500 w-1 h-8 ml-3 rounded-full"></div>
            <div>
              <h1 className="text-2xl md:text-3xl text-white font-bold">
                ویرایش روابط {translateModelNameToPersian("place")}
              </h1>
              <p className="text-gray-400 mt-2 text-sm">
                استان، شهر، دسته‌بندی، برچسب‌ها و تصاویر مکان را مدیریت کنید
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-1">
            <Link
              href={`/admin/places/edit/${placeId}`}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              ویرایش اطلاعات اصلی
            </Link>

            <Link
              href="/admin/places"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              بازگشت به لیست
            </Link>
          </div>
        </div>
      </div>

      <FormUpdatePlaceRelations
        placeId={placeId}
        token={token?.value}
        lesanUrl={lesanUrl}
      />
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `ویرایش روابط ${translateModelNameToPersian("place")} | نقشه شهر`,
  };
}
