"use client";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "../molecules/ConfirmationDialog";

type VirtualTour = {
  _id: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "archived";
  createdAt: string;
  updatedAt: string;
  place?: {
    _id: string;
    name: string;
  };
  panorama?: {
    _id: string;
    name: string;
  };
};

type Props = {
  data: VirtualTour[];
  remove: (_id: string, hardCascade?: boolean) => Promise<any>;
};

export default function VirtualToursDashboard({ data, remove }: Props) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    try {
      const result = await remove(selectedItem, false);

      if (result.success) {
        toast.success("تور مجازی با موفقیت حذف شد");
        router.refresh();
      } else {
        toast.error(result.body?.message || "خطا در حذف تور مجازی");
      }
    } catch (error) {
      toast.error("خطا در حذف تور مجازی");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setSelectedItem(null);
    }
  };

  const openConfirmDialog = (id: string) => {
    setSelectedItem(id);
    setIsConfirmOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium border border-green-800">
            فعال
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs font-medium border border-yellow-800">
            پیش‌نویس
          </span>
        );
      case "archived":
        return (
          <span className="px-2 py-1 bg-gray-900/30 text-gray-400 rounded-full text-xs font-medium border border-gray-800">
            بایگانی شده
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-900/30 text-gray-400 rounded-full text-xs font-medium border border-gray-800">
            نامشخص
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("fa-IR");
    } catch {
      return "---";
    }
  };

  return (
    <div className="mt-8 w-full text-white">
      {data.length === 0 ? (
        <div className="mt-8 bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-700">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-pink-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">هیچ تور مجازی یافت نشد</h3>
          <p className="text-gray-400 mb-6">
            با کلیک بر روی دکمه «ایجاد تور مجازی جدید» اولین تور مجازی خود را بسازید.
          </p>
          <Link
            href="/admin/virtual-tours/create"
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-pink-500/30"
          >
            ایجاد تور مجازی
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-700 border-b border-gray-600">
                  <th className="p-4 text-right font-semibold text-white">نام</th>
                  <th className="p-4 text-right font-semibold text-white">مکان</th>
                  <th className="p-4 text-right font-semibold text-white">وضعیت</th>
                  <th className="p-4 text-right font-semibold text-white">تاریخ ایجاد</th>
                  <th className="p-4 text-right font-semibold text-white">آخرین بروزرسانی</th>
                  <th className="p-4 text-right font-semibold text-white">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2 max-w-xs">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {item.place ? (
                        <span className="text-sm text-gray-300">{item.place.name}</span>
                      ) : (
                        <span className="text-xs text-gray-500">تعیین نشده</span>
                      )}
                    </td>
                    <td className="p-4">{getStatusBadge(item.status)}</td>
                    <td className="p-4 text-gray-300">{formatDate(item.createdAt)}</td>
                    <td className="p-4 text-gray-300">{formatDate(item.updatedAt)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/virtual-tours/view/${item._id}`}
                          className="p-1.5 bg-gray-700 text-pink-400 rounded-md hover:bg-gray-600 transition-colors"
                          title="مشاهده"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/virtual-tours/edit/${item._id}`}
                          className="p-1.5 bg-gray-700 text-green-400 rounded-md hover:bg-gray-600 transition-colors"
                          title="ویرایش"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                            />
                          </svg>
                        </Link>
                        <button
                          onClick={() => openConfirmDialog(item._id)}
                          className="p-1.5 bg-gray-700 text-red-400 rounded-md hover:bg-gray-600 transition-colors"
                          title="حذف"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="حذف تور مجازی"
        message="آیا از حذف این تور مجازی اطمینان دارید؟ این عمل قابل بازگشت نیست."
        confirmText="حذف"
        cancelText="انصراف"
        isLoading={isDeleting}
      />
    </div>
  );
}
