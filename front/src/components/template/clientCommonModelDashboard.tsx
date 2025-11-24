"use client";

import { useState } from "react";
import { DeleteModal } from "./DeleteModal";
import { useRouter } from "next/navigation";
import {
  ModelName,
  ToastNotify,
  translateModelNameToPersian,
} from "@/utils/helper";
import CreateUpdateModal from "./CreateUpdateModal";
import toast from "react-hot-toast";

interface TData {
  _id: string;
  name: string;
  description: string;
  color?: string;
  icon?: string;
  isActive: boolean;
}

interface ClientDashboardProps {
  data: TData[];
  model: ModelName;
  remove: (_id: string, hardCascade: boolean) => Promise<any>;
  add: (data: {
    name: string;
    description: string;
    color?: string;
    icon?: string;
  }) => Promise<any>;
  update: (data: {
    _id: string;
    name: string;
    description: string;
    color?: string;
    icon?: string;
  }) => Promise<any>;
}

const formatPersianNumber = (num: number): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
};

const ClientCommonModelDashboard: React.FC<ClientDashboardProps> = ({
  data,
  model,
  remove,
  add,
  update,
}) => {
  const router = useRouter();

  const [activeModal, setActiveModal] = useState<"edit" | "delete" | null>(
    null,
  );
  const [selectedItem, setSelectedItem] = useState<TData | null>(null);

  const [hardCascade, setHardCascade] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const openModal = (type: "edit" | "delete", item: TData | null = null) => {
    setSelectedItem(item);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
    setHardCascade(false);
  };

  const confirmDelete = async () => {
    if (selectedItem?._id) {
      const removedItem = await remove(selectedItem._id, hardCascade);

      if (removedItem.success) {
        ToastNotify(
          "success",
          `${translateModelNameToPersian(model)} با موفقیت حذف شد`,
        );
      } else {
        ToastNotify(
          "error",
          `مشکلی در حذف ${translateModelNameToPersian(model)} وجود دارد - ${removedItem.body.message}}`,
        );
      }

      router.refresh();
    }
    closeModal();
  };

  const handleToggleStatus = async (categoryId: string) => {
    const category = data.find((cat) => cat._id === categoryId);
    if (!category) return;

    setActionLoading(categoryId);
    try {
      // Since the backend doesn't have an isActive field, we'll manage it locally
      // You might want to implement this in the backend later
      // setCategories((prev) =>
      //   prev.map((cat) =>
      //     cat._id === categoryId
      //       ? {
      //           ...cat,
      //           isActive: !cat.isActive,
      //           updatedAt: new Date().toISOString(),
      //         }
      //       : cat,
      //   ),
      // );

      toast.success("وضعیت دسته‌بندی با موفقیت تغییر کرد");
    } catch (error) {
      console.error("Error toggling category status:", error);
      toast.error("خطا در تغییر وضعیت دسته‌بندی");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <button
        className="absolute top-1 left-5 mt-4 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors flex items-center gap-2"
        onClick={() => openModal("edit")}
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        ایجاد {translateModelNameToPersian(model)} جدید
      </button>

      {/* Categories Grid */}
      {data.length === 0 ? (
        <div className="text-center py-12 mt-6">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-bold text-white mb-2">
            هیچ {translateModelNameToPersian(model)} یافت نشد
          </h3>
          <p className="text-gray-400 mb-4">
            "نتیجه‌ای برای جستجوی شما یافت نشد"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {data.map((item) => (
            <div
              key={item._id}
              className={`relative bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-1 ${
                actionLoading === item._id ? "opacity-60" : ""
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
                <div className="flex items-center  space-x-2">
                  <button
                    onClick={() => handleToggleStatus(item._id)}
                    disabled={actionLoading !== null}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      item.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="relative group">
                    <button className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-200">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    <div className="absolute left-0 top-full mt-1 bg-gray-700 rounded-lg shadow-lg border border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <button
                        onClick={() => openModal("edit", item)}
                        className="w-full px-4 py-2 text-right text-sm text-gray-300 hover:bg-gray-600 rounded-t-lg"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => openModal("delete", item)}
                        className="w-full px-4 py-2 text-right text-sm text-red-400 hover:bg-red-900/30 rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {item.color && (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                      title={`رنگ: ${item.color}`}
                    />
                  )}
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {/* fellan faghat  tool data  ro gozashtam ta baadan ye dogme konam jodagane az backend begiram */}
                    {formatPersianNumber(data.length || 0)} مکان
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      item.isActive
                        ? "bg-green-900/30 text-green-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {item.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeModal === "edit" && (
        <CreateUpdateModal
          isOpen
          onClose={closeModal}
          itemToEdit={selectedItem}
          model={model}
          add={add}
          update={update}
        />
      )}

      {activeModal === "delete" && (
        <DeleteModal
          isVisible
          onConfirm={confirmDelete}
          onCancel={closeModal}
          message="آیا مطمئن هستید که می‌خواهید این برچسب را حذف کنید؟ این عمل قابل بازگشت نیست."
          isHardCascade={hardCascade}
          onHardCascadeChange={setHardCascade}
        />
      )}
    </div>
  );
};

export default ClientCommonModelDashboard;
