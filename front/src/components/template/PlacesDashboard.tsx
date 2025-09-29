"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteModal } from "./DeleteModal";
import { ModelName, ToastNotify, translateModelNameToPersian } from "@/utils/helper";
import Link from "next/link";

interface PlaceData {
  _id: string;
  name: string;
  description: string;
  address?: string;
  category?: {
    _id: string;
    name: string;
    color?: string;
  };
  status: "draft" | "active" | "archived";
  createdAt?: string;
  updatedAt?: string;
  center?: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface PlacesDashboardProps {
  data: PlaceData[];
  model: ModelName;
  remove: (_id: string, hardCascade: boolean) => Promise<any>;
  token?: string;
  lesanUrl?: string;
}

const formatPersianNumber = (num: number): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
};

const formatPersianDate = (dateString?: string): string => {
  if (!dateString) return "نامشخص";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "draft":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "archived":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "منتشر شده";
    case "draft":
      return "پیش‌نویس";
    case "archived":
      return "آرشیو شده";
    default:
      return "نامشخص";
  }
};

const PlacesDashboard: React.FC<PlacesDashboardProps> = ({
  data,
  model,
  remove,
}) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [hardCascade, setHardCascade] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const openDeleteModal = (place: PlaceData) => {
    setSelectedPlace(place);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedPlace(null);
    setHardCascade(false);
  };

  const confirmDelete = async () => {
    if (selectedPlace?._id) {
      setActionLoading(selectedPlace._id);
      const removedItem = await remove(selectedPlace._id, hardCascade);

      if (removedItem.success) {
        ToastNotify("success", `${translateModelNameToPersian(model)} با موفقیت حذف شد`);
      } else {
        ToastNotify("error", `مشکلی در حذف ${translateModelNameToPersian(model)} وجود دارد - ${removedItem.body.message}`);
      }

      router.refresh();
      setActionLoading(null);
    }
    closeDeleteModal();
  };

  return (
    <div className="mt-6">
      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-600"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span>نمایش شبکه‌ای</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              viewMode === "list"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-600"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span>نمایش لیستی</span>
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📍</div>
          <h3 className="text-xl font-bold text-slate-600 mb-2">
            هیچ {translateModelNameToPersian(model)} یافت نشد
          </h3>
          <p className="text-slate-500 mb-6">
            می‌توانید یک {translateModelNameToPersian(model)} جدید ایجاد کنید
          </p>
          <Link
            href="/admin/places/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ایجاد {translateModelNameToPersian(model)} جدید
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((place) => (
            <div
              key={place._id}
              className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 overflow-hidden ${
                actionLoading === place._id ? "opacity-60" : ""
              }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-800 text-lg line-clamp-1">
                    {place.name}
                  </h3>
                  <div className="relative group">
                    <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <Link
                        href={`/admin/places/edit/${place._id}`}
                        className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 rounded-t-lg block"
                      >
                        ویرایش
                      </Link>
                      <button
                        onClick={() => openDeleteModal(place)}
                        className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={actionLoading !== null}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>

                {place.category && (
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs mb-3"
                    style={{
                      backgroundColor: `${place.category.color || '#3B82F6'}20`,
                      color: place.category.color || '#3B82F6'
                    }}
                  >
                    {place.category.name}
                  </div>
                )}

                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {place.description || "بدون توضیحات"}
                </p>

                {place.address && (
                  <div className="flex items-start gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-slate-600 text-xs line-clamp-1">
                      {place.address}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs mt-4">
                  <span className="text-slate-500">
                    {formatPersianDate(place.updatedAt)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      place.status
                    )}`}
                  >
                    {getStatusText(place.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  نام
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  دسته‌بندی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  آدرس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  تاریخ بروزرسانی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.map((place) => (
                <tr
                  key={place._id}
                  className={`hover:bg-slate-50 ${
                    actionLoading === place._id ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {place.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {place.category ? (
                      <div
                        className="inline-block px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: `${place.category.color || '#3B82F6'}20`,
                          color: place.category.color || '#3B82F6',
                        }}
                      >
                        {place.category.name}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-500 line-clamp-1 max-w-xs">
                      {place.address || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(
                        place.status
                      )}`}
                    >
                      {getStatusText(place.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatPersianDate(place.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-reverse space-x-2">
                      <Link
                        href={`/admin/places/edit/${place._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        ویرایش
                      </Link>
                      <button
                        onClick={() => openDeleteModal(place)}
                        className="text-red-600 hover:text-red-900"
                        disabled={actionLoading !== null}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedPlace && (
        <DeleteModal
          isVisible
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
          message={`آیا مطمئن هستید که می‌خواهید "${selectedPlace.name}" را حذف کنید؟ این عمل قابل بازگشت نیست.`}
          isHardCascade={hardCascade}
          onHardCascadeChange={setHardCascade}
        />
      )}
    </div>
  );
};

export default PlacesDashboard;
