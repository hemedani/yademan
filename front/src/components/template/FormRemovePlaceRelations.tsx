"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import { ToastNotify } from "@/utils/helper";
import { removeRelations } from "@/app/actions/place/removeRelations";
import { get } from "@/app/actions/place/get";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface TagItem {
  _id: string;
  name: string;
  color?: string;
}

interface GalleryItem {
  _id: string;
  name: string;
  mimType?: string;
}

interface FormRemovePlaceRelationsProps {
  placeId: string;
}

const FormRemovePlaceRelations: React.FC<FormRemovePlaceRelationsProps> = ({ placeId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [placeName, setPlaceName] = useState<string>("");

  // Existing data from server
  const [tags, setTags] = useState<TagItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Selected items to remove
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedGallery, setSelectedGallery] = useState<Set<string>>(new Set());

  // Fetch existing place data
  const fetchData = useCallback(async () => {
    setLoadingInitial(true);
    try {
      const result = await get({
        set: { _id: placeId },
        get: {
          _id: 1,
          name: 1,
          tags: {
            _id: 1,
            name: 1,
            color: 1,
          },
          gallery: {
            _id: 1,
            name: 1,
            mimType: 1,
          },
        },
      });

      if (result.success && result.body && result.body[0]) {
        const place = result.body[0];
        setPlaceName(place.name || "");
        setTags(place.tags || []);
        setGallery(place.gallery || []);
      } else {
        ToastNotify("error", "خطا در دریافت اطلاعات مکان");
        router.push("/admin/places");
      }
    } catch (error) {
      console.error("Error fetching place data:", error);
      ToastNotify("error", "خطا در بارگذاری اطلاعات");
      router.push("/admin/places");
    } finally {
      setLoadingInitial(false);
    }
  }, [placeId, router]);

  useEffect(() => {
    if (placeId) {
      fetchData();
    }
  }, [placeId, fetchData]);

  // Toggle tag selection
  const toggleTag = (id: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle gallery item selection
  const toggleGalleryItem = (id: string) => {
    setSelectedGallery((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select/deselect all tags
  const toggleAllTags = () => {
    if (selectedTags.size === tags.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(tags.map((t) => t._id)));
    }
  };

  // Select/deselect all gallery items
  const toggleAllGallery = () => {
    if (selectedGallery.size === gallery.length) {
      setSelectedGallery(new Set());
    } else {
      setSelectedGallery(new Set(gallery.map((g) => g._id)));
    }
  };

  const hasSelection = selectedTags.size > 0 || selectedGallery.size > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSelection) {
      ToastNotify("error", "هیچ موردی برای حذف انتخاب نشده است");
      return;
    }

    setLoading(true);
    try {
      const result = await removeRelations({
        _id: placeId,
        tags: selectedTags.size > 0 ? Array.from(selectedTags) : undefined,
        gallery: selectedGallery.size > 0 ? Array.from(selectedGallery) : undefined,
      });

      if (result.success) {
        const removedCount = selectedTags.size + selectedGallery.size;
        ToastNotify("success", `${removedCount} مورد با موفقیت حذف شد`);
        // Refresh data in place instead of navigating away
        setSelectedTags(new Set());
        setSelectedGallery(new Set());
        await fetchData();
      } else {
        ToastNotify("error", `خطا در حذف: ${result.body?.message || "خطای ناشناخته"}`);
      }
    } catch (error) {
      console.error("Error removing place relations:", error);
      ToastNotify("error", "خطا در حذف روابط مکان");
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-red-900 border-t-red-500 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Warning banner */}
      <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-800 rounded-xl">
        <svg
          className="w-5 h-5 text-red-400 mt-0.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <p className="text-red-400 font-semibold text-sm">هشدار: این عملیات برگشت‌پذیر نیست</p>
          <p className="text-red-300/70 text-xs mt-1">
            موارد انتخاب‌شده از مکان «{placeName}» حذف خواهند شد. پس از تأیید امکان بازگردانی وجود ندارد.
          </p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="w-2 h-6 bg-red-500 rounded-full ml-2"></div>
            برچسب‌ها
            {tags.length > 0 && (
              <span className="mr-2 bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                {tags.length} مورد
              </span>
            )}
          </h2>
          {tags.length > 0 && (
            <button
              type="button"
              onClick={toggleAllTags}
              className="text-xs text-gray-400 hover:text-white underline transition-colors"
            >
              {selectedTags.size === tags.length ? "لغو انتخاب همه" : "انتخاب همه"}
            </button>
          )}
        </div>

        {tags.length === 0 ? (
          <div className="flex items-center gap-2 p-4 bg-gray-700/30 rounded-lg border border-dashed border-gray-600">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <p className="text-sm text-gray-500">هیچ برچسبی به این مکان اضافه نشده است</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => {
              const isSelected = selectedTags.has(tag._id);
              return (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleTag(tag._id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium
                    transition-all duration-200 cursor-pointer
                    ${
                      isSelected
                        ? "border-red-500 bg-red-900/40 text-red-300 shadow-[0_0_0_2px_rgba(239,68,68,0.3)]"
                        : "border-gray-600 bg-gray-700/50 text-gray-200 hover:border-gray-400 hover:bg-gray-700"
                    }
                  `}
                >
                  {/* Color dot */}
                  {tag.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                  )}
                  {tag.name}
                  {/* Remove indicator */}
                  {isSelected && (
                    <span className="mr-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {selectedTags.size > 0 && (
          <p className="mt-3 text-xs text-red-400">
            {selectedTags.size} برچسب برای حذف انتخاب شده
          </p>
        )}
      </div>

      {/* Gallery Section */}
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="w-2 h-6 bg-red-500 rounded-full ml-2"></div>
            گالری تصاویر
            {gallery.length > 0 && (
              <span className="mr-2 bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                {gallery.length} تصویر
              </span>
            )}
          </h2>
          {gallery.length > 0 && (
            <button
              type="button"
              onClick={toggleAllGallery}
              className="text-xs text-gray-400 hover:text-white underline transition-colors"
            >
              {selectedGallery.size === gallery.length ? "لغو انتخاب همه" : "انتخاب همه"}
            </button>
          )}
        </div>

        {gallery.length === 0 ? (
          <div className="flex items-center gap-2 p-4 bg-gray-700/30 rounded-lg border border-dashed border-gray-600">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-500">هیچ تصویری در گالری وجود ندارد</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {gallery.map((item) => {
              const isSelected = selectedGallery.has(item._id);
              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => toggleGalleryItem(item._id)}
                  className={`
                    relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200
                    focus:outline-none
                    ${
                      isSelected
                        ? "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.4)]"
                        : "border-transparent hover:border-gray-500"
                    }
                  `}
                >
                  <Image
                    src={getImageUploadUrl(item.name, "images")}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className={`object-cover transition-all duration-200 ${isSelected ? "brightness-50" : "hover:scale-105"}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.jpg";
                    }}
                  />

                  {/* Selection overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-900/30">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* File name tooltip on hover */}
                  <div
                    className={`
                      absolute bottom-0 left-0 right-0 px-2 py-1 text-xs truncate
                      transition-opacity duration-200
                      ${isSelected ? "opacity-100 bg-red-900/80 text-red-200" : "opacity-0 group-hover:opacity-100 bg-black/70 text-gray-300"}
                    `}
                  >
                    {item.name}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedGallery.size > 0 && (
          <p className="mt-3 text-xs text-red-400">
            {selectedGallery.size} تصویر برای حذف انتخاب شده
          </p>
        )}
      </div>

      {/* Summary of selection */}
      {hasSelection && (
        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800/60 rounded-xl">
          <svg
            className="w-5 h-5 text-red-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <p className="text-sm text-red-300">
            {selectedTags.size > 0 && (
              <span>
                <strong>{selectedTags.size}</strong> برچسب
              </span>
            )}
            {selectedTags.size > 0 && selectedGallery.size > 0 && <span> و </span>}
            {selectedGallery.size > 0 && (
              <span>
                <strong>{selectedGallery.size}</strong> تصویر گالری
              </span>
            )}
            <span> از مکان «{placeName}» حذف خواهد شد</span>
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={loading || !hasSelection}
          className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-xl hover:from-red-800 hover:to-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              در حال حذف...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              حذف موارد انتخاب‌شده
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FormRemovePlaceRelations;
