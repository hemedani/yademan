import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReqType } from "@/types/declarations/selectInp";
import { get } from "@/app/actions/virtual_tour/get";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { translateModelNameToPersian } from "@/utils/helper";

const statusMap: Record<string, { label: string; className: string }> = {
  draft: {
    label: "پیش‌نویس",
    className: "bg-yellow-500/20 text-yellow-400 border border-yellow-600/40",
  },
  active: { label: "فعال", className: "bg-green-500/20 text-green-400 border border-green-600/40" },
  archived: {
    label: "بایگانی شده",
    className: "bg-gray-500/20 text-gray-400 border border-gray-600/40",
  },
};

export default async function ViewVirtualTourPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const tourGet: ReqType["main"]["virtual_tour"]["get"]["get"] = {
    _id: 1,
    name: 1,
    description: 1,
    status: 1,
    createdAt: 1,
    updatedAt: 1,
    place: {
      _id: 1,
      name: 1,
    },
    panorama: {
      _id: 1,
      name: 1,
    },
  };

  const tourResponse = await get({ set: { _id: id }, get: tourGet });
  const tour = tourResponse.success ? tourResponse.body[0] : null;

  if (!tour) notFound();

  const status = statusMap[tour.status] ?? statusMap["draft"];

  return (
    <div className="p-4 text-white">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-start">
          <div className="bg-pink-600 w-1 h-8 ml-3 rounded-full flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-2xl md:text-3xl text-white font-bold">
              {translateModelNameToPersian("virtual_tour")}
            </h1>
            <p className="text-gray-400 mt-1 text-sm">{tour.name}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/admin/virtual-tours"
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg border border-gray-600 transition-colors text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            بازگشت به لیست
          </Link>
          <Link
            href={`/admin/virtual-tours/edit/${tour._id}`}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-pink-500/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            ویرایش
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panorama preview */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
          <div className="p-4 border-b border-gray-700 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-pink-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-300 font-medium text-sm">تصویر پانوراما</span>
          </div>

          <div className="relative w-full h-72 md:h-96 bg-gray-900">
            {tour.panorama?.name ? (
              <Image
                src={getImageUploadUrl(tour.panorama.name, "images")}
                alt={tour.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                <span className="text-sm">تصویر پانوراما ثبت نشده</span>
              </div>
            )}
          </div>
        </div>

        {/* Meta info sidebar */}
        <div className="flex flex-col gap-6">
          {/* Details card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-gray-300 font-medium text-sm">اطلاعات تور</span>
            </div>

            <div className="p-4 space-y-4">
              {/* Name */}
              <div>
                <p className="text-xs text-gray-500 mb-1">نام تور</p>
                <p className="text-white font-medium">{tour.name}</p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-gray-500 mb-1">وضعیت</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              {/* Place */}
              {tour.place && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">مکان</p>
                  <p className="text-gray-200 text-sm">{tour.place.name}</p>
                </div>
              )}

              {/* Description */}
              {tour.description && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">توضیحات</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{tour.description}</p>
                </div>
              )}

              {/* Panorama file */}
              {tour.panorama?.name && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">فایل پانوراما</p>
                  <p className="text-gray-400 text-xs font-mono break-all">{tour.panorama.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-gray-300 font-medium text-sm">زمان‌بندی</span>
            </div>

            <div className="p-4 space-y-4">
              {tour.createdAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">تاریخ ایجاد</p>
                  <p className="text-gray-300 text-sm">
                    {new Date(tour.createdAt).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              {tour.updatedAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">آخرین بروزرسانی</p>
                  <p className="text-gray-300 text-sm">
                    {new Date(tour.updatedAt).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
