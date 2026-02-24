"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastNotify } from "@/utils/helper";
import { updateRelations } from "@/app/actions/place/updateRelations";
import { get } from "@/app/actions/place/get";
import { gets as getCategoriesAction } from "@/app/actions/category/gets";
import { gets as getProvincesAction } from "@/app/actions/province/gets";
import { gets as getCitiesAction } from "@/app/actions/city/gets";
import { gets as getTagsAction } from "@/app/actions/tag/gets";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import AsyncSelectBox from "../atoms/AsyncSelectBox";
import { UploadImage } from "@/components/molecules/UploadFile";
import { getImageUploadUrl } from "@/utils/imageUrl";
import Image from "next/image";

interface SelectOption {
  value: string;
  label: string;
}

interface FileItem {
  _id: string;
  name: string;
}

const relationsSchema = z.object({
  province: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  category: z.string().min(1, { message: "لطفاً یک دسته‌بندی انتخاب کنید" }),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().optional().or(z.literal("")),
  gallery: z.array(z.string()).optional(),
});

type RelationsFormValues = z.infer<typeof relationsSchema>;

interface FormUpdatePlaceRelationsProps {
  placeId: string;
  token?: string;
  lesanUrl?: string;
}

const FormUpdatePlaceRelations: React.FC<FormUpdatePlaceRelationsProps> = ({ placeId, token }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Track current province for city dependency
  const [currentProvince, setCurrentProvince] = useState<string>("");

  // Track initial values for pre-populated select display
  const [initialProvince, setInitialProvince] = useState<SelectOption | null>(null);
  const [initialCity, setInitialCity] = useState<SelectOption | null>(null);
  const [initialCategory, setInitialCategory] = useState<SelectOption | null>(null);
  const [initialTags, setInitialTags] = useState<SelectOption[]>([]);

  // Thumbnail: track both _id (for submission) and name (for preview)
  const [thumbnailItem, setThumbnailItem] = useState<FileItem | null>(null);

  // Gallery: list of { _id, name } for existing items, plus newly uploaded _ids (no name available)
  const [galleryItems, setGalleryItems] = useState<FileItem[]>([]);
  // Newly uploaded gallery items only have _id (returned from UploadImage)
  const [newGalleryIds, setNewGalleryIds] = useState<string[]>([]);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RelationsFormValues>({
    resolver: zodResolver(relationsSchema),
    defaultValues: {
      province: "",
      city: "",
      category: "",
      tags: [],
      thumbnail: "",
      gallery: [],
    },
  });

  // Sync gallery form value whenever galleryItems or newGalleryIds changes
  useEffect(() => {
    const allIds = [...galleryItems.map((g) => g._id), ...newGalleryIds];
    setValue("gallery", allIds, { shouldValidate: true });
  }, [galleryItems, newGalleryIds, setValue]);

  // Fetch existing place data to pre-populate the form
  useEffect(() => {
    const fetchData = async () => {
      setLoadingInitial(true);
      try {
        const placeResult = await get({
          set: { _id: placeId },
          get: {
            _id: 1,
            name: 1,
            province: {
              _id: 1,
              name: 1,
            },
            city: {
              _id: 1,
              name: 1,
            },
            category: {
              _id: 1,
              name: 1,
              color: 1,
            },
            tags: {
              _id: 1,
              name: 1,
              color: 1,
            },
            thumbnail: {
              _id: 1,
              name: 1,
              mimType: 1,
            },
            gallery: {
              _id: 1,
              name: 1,
              mimType: 1,
            },
          },
        });

        if (placeResult.success && placeResult.body && placeResult.body[0]) {
          const place = placeResult.body[0];

          const provinceId = place.province?._id || "";
          const cityId = place.city?._id || "";
          const categoryId = place.category?._id || "";
          const tagIds = (place.tags || []).map((t: FileItem) => t._id);
          const thumbnailId = place.thumbnail?._id || "";
          const galleryIds = (place.gallery || []).map((g: FileItem) => g._id);

          reset({
            province: provinceId,
            city: cityId,
            category: categoryId,
            tags: tagIds,
            thumbnail: thumbnailId,
            gallery: galleryIds,
          });

          setCurrentProvince(provinceId);

          // Set initial select options for display
          if (place.province?._id) {
            setInitialProvince({ value: place.province._id, label: place.province.name });
          }
          if (place.city?._id) {
            setInitialCity({ value: place.city._id, label: place.city.name });
          }
          if (place.category?._id) {
            setInitialCategory({ value: place.category._id, label: place.category.name });
          }
          if (place.tags && place.tags.length > 0) {
            setInitialTags(
              place.tags.map((t: { _id: string; name: string }) => ({
                value: t._id,
                label: t.name,
              })),
            );
          }

          // Set thumbnail with both _id and name for preview
          if (place.thumbnail?._id && place.thumbnail?.name) {
            setThumbnailItem({ _id: place.thumbnail._id, name: place.thumbnail.name });
          }

          // Set gallery items with both _id and name for preview
          if (place.gallery && place.gallery.length > 0) {
            setGalleryItems(
              place.gallery.map((g: { _id: string; name: string }) => ({
                _id: g._id,
                name: g.name,
              })),
            );
          }
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
    };

    if (placeId) {
      fetchData();
    }
  }, [placeId, reset, router]);

  // Load provinces options
  const loadProvincesOptions = useCallback(async (inputValue?: string): Promise<SelectOption[]> => {
    const setParams: { limit: number; page: number; name?: string } = {
      limit: 20,
      page: 1,
    };
    if (inputValue) {
      setParams.name = inputValue;
    }
    try {
      const response = await getProvincesAction({
        set: setParams,
        get: { _id: 1, name: 1 },
      });
      if (response && response.success) {
        return response.body.map((item: { _id: string; name: string }) => ({
          value: item._id,
          label: item.name,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading provinces:", error);
      return [];
    }
  }, []);

  // Load cities options based on selected province
  const loadCitiesOptions = useCallback(
    async (inputValue?: string): Promise<SelectOption[]> => {
      const selectedProvince = currentProvince || watch("province");
      if (!selectedProvince) return [];

      const setParams: {
        limit: number;
        page: number;
        name?: string;
        provinceId?: string;
      } = {
        limit: 20,
        page: 1,
        provinceId: selectedProvince,
      };
      if (inputValue) {
        setParams.name = inputValue;
      }
      try {
        const response = await getCitiesAction({
          set: setParams,
          get: { _id: 1, name: 1 },
        });
        if (response && response.success) {
          return response.body.map((item: { _id: string; name: string }) => ({
            value: item._id,
            label: item.name,
          }));
        }
        return [];
      } catch (error) {
        console.error("Error loading cities:", error);
        return [];
      }
    },
    [currentProvince, watch],
  );

  // Load categories options
  const loadCategoriesOptions = useCallback(async (inputValue: string): Promise<SelectOption[]> => {
    const setParams: { limit: number; page: number; name?: string } = {
      limit: 20,
      page: 1,
    };
    if (inputValue) {
      setParams.name = inputValue;
    }
    try {
      const response = await getCategoriesAction({
        set: setParams,
        get: { _id: 1, name: 1 },
      });
      if (response && response.success) {
        return response.body.map((item: { _id: string; name: string }) => ({
          value: item._id,
          label: item.name,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading categories:", error);
      return [];
    }
  }, []);

  // Load tags options
  const loadTagsOptions = useCallback(async (inputValue: string): Promise<SelectOption[]> => {
    const setParams: { limit: number; page: number; name?: string } = {
      limit: 20,
      page: 1,
    };
    if (inputValue) {
      setParams.name = inputValue;
    }
    try {
      const response = await getTagsAction({
        set: setParams,
        get: { _id: 1, name: 1 },
      });
      if (response && response.success) {
        return response.body.map((item: { _id: string; name: string }) => ({
          value: item._id,
          label: item.name,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading tags:", error);
      return [];
    }
  }, []);

  // Handle province selection change - update controlled value and clear city
  const handleProvinceSelect = (option: SelectOption | null) => {
    setInitialProvince(option);
    setCurrentProvince(option?.value || "");
    setValue("city", "");
    setInitialCity(null);
  };

  // Handle city selection change - keep value prop in sync
  const handleCitySelect = (option: SelectOption | null) => {
    setInitialCity(option);
  };

  // Handle category selection change - keep value prop in sync
  const handleCategorySelect = (option: SelectOption | null) => {
    setInitialCategory(option);
  };

  // Handle tags selection change - keep value prop in sync
  const handleTagsSelect = (options: SelectOption[] | null) => {
    setInitialTags(options || []);
  };

  // Remove an existing gallery item by _id
  const removeGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((g) => g._id !== id));
  };

  // Remove a newly uploaded gallery item by _id
  const removeNewGalleryId = (id: string) => {
    setNewGalleryIds((prev) => prev.filter((i) => i !== id));
  };

  // Form submission handler
  const onSubmit: SubmitHandler<RelationsFormValues> = async (data) => {
    setLoading(true);
    try {
      const allGalleryIds = [...galleryItems.map((g) => g._id), ...newGalleryIds];

      const result = await updateRelations({
        _id: placeId,
        province: data.province || undefined,
        city: data.city || undefined,
        category: data.category || undefined,
        tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
        thumbnail: thumbnailItem?._id || data.thumbnail || undefined,
        gallery: allGalleryIds.length > 0 ? allGalleryIds : undefined,
      });

      if (result.success) {
        ToastNotify("success", "روابط مکان با موفقیت به‌روزرسانی شد");
        router.push("/admin/places");
        router.refresh();
      } else {
        ToastNotify("error", `خطا در به‌روزرسانی روابط: ${result.body.message}`);
      }
    } catch (error) {
      console.error("Error updating place relations:", error);
      ToastNotify("error", "خطا در به‌روزرسانی روابط مکان");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching initial data
  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-4 border-pink-900 border-t-pink-500 animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-400">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Province & City Section */}
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-6 bg-pink-500 rounded-full ml-2"></div>
          موقعیت اداری
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AsyncSelectBox
            name="province"
            label="استان"
            setValue={setValue}
            loadOptions={loadProvincesOptions}
            defaultOptions={initialProvince ? [initialProvince] : true}
            value={initialProvince}
            placeholder="استان را انتخاب کنید"
            errMsg={errors.province?.message}
            onSelectChange={handleProvinceSelect}
          />

          <AsyncSelectBox
            name="city"
            label="شهر"
            setValue={setValue}
            loadOptions={loadCitiesOptions}
            defaultOptions={initialCity ? [initialCity] : currentProvince ? true : false}
            value={initialCity}
            placeholder={currentProvince ? "شهر را انتخاب کنید" : "ابتدا استان را انتخاب کنید"}
            errMsg={errors.city?.message}
            onSelectChange={handleCitySelect}
          />
        </div>
      </div>

      {/* Category & Tags Section */}
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-6 bg-pink-500 rounded-full ml-2"></div>
          دسته‌بندی و برچسب‌ها
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AsyncSelectBox
            name="category"
            label="دسته‌بندی"
            setValue={setValue}
            loadOptions={loadCategoriesOptions}
            defaultOptions={initialCategory ? [initialCategory] : true}
            value={initialCategory}
            placeholder="دسته‌بندی را انتخاب کنید"
            errMsg={errors.category?.message}
            isRequired={true}
            onSelectChange={handleCategorySelect}
          />

          <AsyncSelectBox
            name="tags"
            label="برچسب‌ها"
            setValue={setValue}
            loadOptions={loadTagsOptions}
            defaultOptions={initialTags.length > 0 ? initialTags : true}
            value={initialTags.length > 0 ? initialTags : null}
            placeholder="برچسب‌ها را انتخاب کنید"
            errMsg={errors.tags?.message}
            isMulti={true}
            onSelectChange={handleTagsSelect}
          />
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-6 bg-pink-500 rounded-full ml-2"></div>
          تصاویر
        </h2>

        {/* Thumbnail */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-300 mb-3 text-right">تصویر شاخص</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Current thumbnail preview */}
            {thumbnailItem && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-400 text-right">تصویر فعلی:</p>
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-600 bg-gray-700/50 group">
                  <Image
                    src={getImageUploadUrl(thumbnailItem.name, "images")}
                    alt="تصویر شاخص فعلی"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.jpg";
                    }}
                  />
                  {/* Remove overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailItem(null);
                        setValue("thumbnail", "", { shouldValidate: true });
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg"
                      title="حذف تصویر شاخص"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                    {thumbnailItem.name}
                  </div>
                </div>
              </div>
            )}

            {/* Upload new thumbnail */}
            <div>
              <p className="text-xs text-gray-400 text-right mb-2">
                {thumbnailItem ? "جایگزین کردن با تصویر جدید:" : "آپلود تصویر شاخص:"}
              </p>
              <UploadImage
                label=""
                inputName="thumbnail-upload"
                setUploadedImage={(uploadedId: string) => {
                  // When a new image is uploaded, we only have its _id.
                  // Replace the thumbnail _id in the form; clear the old preview
                  // since we can't show the new one by name without re-fetching.
                  setThumbnailItem(null);
                  setValue("thumbnail", uploadedId, { shouldValidate: true });
                }}
                type="image"
                token={token}
              />
              {errors.thumbnail && (
                <p className="text-red-400 text-xs mt-1 text-right">{errors.thumbnail.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 text-right">
            گالری تصاویر
            {galleryItems.length + newGalleryIds.length > 0 && (
              <span className="mr-2 bg-purple-900/50 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-700">
                {galleryItems.length + newGalleryIds.length} تصویر
              </span>
            )}
          </h3>

          {/* Existing gallery items grid */}
          {galleryItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
              {galleryItems.map((item) => (
                <div
                  key={item._id}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-600 bg-gray-700/50 group"
                >
                  <Image
                    src={getImageUploadUrl(item.name, "images")}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.jpg";
                    }}
                  />
                  {/* Remove button */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(item._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg"
                      title="حذف از گالری"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Newly uploaded items (no preview available — only _id known) */}
          {newGalleryIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {newGalleryIds.map((id) => (
                <div
                  key={id}
                  className="flex items-center gap-2 bg-purple-900/30 border border-purple-700 rounded-lg px-3 py-1.5"
                >
                  <svg
                    className="w-4 h-4 text-purple-400 shrink-0"
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
                  <span className="text-xs text-purple-300 font-mono truncate max-w-[120px]">
                    {id}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewGalleryId(id)}
                    className="text-red-400 hover:text-red-300 transition-colors shrink-0"
                    title="حذف"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {galleryItems.length === 0 && newGalleryIds.length === 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-700/30 rounded-lg border border-dashed border-gray-600">
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
          )}

          {/* Upload new gallery image */}
          <UploadImage
            label="افزودن تصویر به گالری"
            inputName="gallery-upload"
            setUploadedImage={(uploadedId: string) => {
              setNewGalleryIds((prev) => [...prev, uploadedId]);
            }}
            type="image"
            token={token}
          />

          {/* Clear all gallery */}
          {galleryItems.length + newGalleryIds.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setGalleryItems([]);
                setNewGalleryIds([]);
              }}
              className="mt-3 text-xs text-red-400 hover:text-red-300 underline"
            >
              حذف تمام تصاویر گالری
            </button>
          )}

          {errors.gallery && (
            <p className="text-red-400 text-xs mt-1 text-right">{errors.gallery.message}</p>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
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
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-70 flex items-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          به‌روزرسانی روابط
        </button>
      </div>
    </form>
  );
};

export default FormUpdatePlaceRelations;
