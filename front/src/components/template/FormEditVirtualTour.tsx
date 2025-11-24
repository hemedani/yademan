"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectBox from "../atoms/Select";
import { UploadImage } from "@/components/molecules/UploadFile";
import { ToastNotify } from "@/utils/helper";
import MyInput from "../atoms/MyInput";
import { update } from "@/app/actions/virtual_tour/update";
import { ReqType } from "@/types/declarations/selectInp";
import { useEffect } from "react";

export const VirtualTourEditSchema = z.object({
  _id: z.string().min(1, "شناسه تور مجازی الزامی است"),
  name: z.string().min(1, "نام تور مجازی الزامی است"),
  description: z.string().optional(),
  placeId: z.string().min(1, "انتخاب مکان الزامی است"),
  panoramaId: z.string().min(1, "بارگذاری تصویر پانوراما الزامی است"),
  status: z.enum(["draft", "active", "archived"], {
    message: "وضعیت الزامی است",
  }),
});

export type VirtualTourEditFormData = z.infer<typeof VirtualTourEditSchema>;
export type VirtualTourUpdateObj =
  ReqType["main"]["virtual_tour"]["update"]["set"];

type PlaceOption = {
  value: string;
  label: string;
};

type TourData = {
  _id: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "archived";
  place?: {
    _id: string;
    name: string;
  };
  panorama?: {
    _id: string;
    name: string;
  };
};

export const FormEditVirtualTour = ({
  token,
  places = [],
  tourData,
}: {
  token?: string;
  places: PlaceOption[];
  tourData: TourData;
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<VirtualTourEditFormData>({
    resolver: zodResolver(VirtualTourEditSchema),
    defaultValues: {
      _id: tourData._id,
      name: tourData.name,
      description: tourData.description || "",
      placeId: tourData.place?._id || "",
      panoramaId: tourData.panorama?._id || "",
      status: tourData.status,
    },
    mode: "onChange",
  });

  // Initialize form with tour data
  useEffect(() => {
    if (tourData) {
      reset({
        _id: tourData._id,
        name: tourData.name,
        description: tourData.description || "",
        placeId: tourData.place?._id || "",
        panoramaId: tourData.panorama?._id || "",
        status: tourData.status,
      });

      // Also set the values for SelectBox components
      if (tourData.place) {
        setValue("placeId", tourData.place._id);
      }

      if (tourData.status) {
        setValue("status", tourData.status);
      }
    }
  }, [tourData, reset, setValue]);

  const onSubmit: SubmitHandler<VirtualTourEditFormData> = async (data) => {
    try {
      // Convert form data to backend format
      const updateData: VirtualTourUpdateObj = {
        _id: data._id,
        name: data.name,
        description: data.description,
        status: data.status,
      };

      const result = await update({
        set: updateData,
        get: { _id: 1, name: 1 },
      });

      if (result.success) {
        ToastNotify("success", "تور مجازی با موفقیت بروزرسانی شد");
        router.replace("/admin/virtual-tours");
      } else {
        ToastNotify(
          "error",
          result.body?.message || "خطا در بروزرسانی تور مجازی",
        );
      }
    } catch (error) {
      console.error("Error updating virtual tour:", error);
      ToastNotify("error", "خطا در ارسال فرم");
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-gray-800 p-6 border border-gray-700 rounded-xl shadow-lg"
      >
        <div className="w-full flex flex-wrap">
          <div className="w-full p-4">
            <span className="text-sm font-medium text-gray-300">
              تصویر پانوراما
            </span>
            <UploadImage
              inputName="panorama"
              setUploadedImage={(uploaded: string) =>
                setValue("panoramaId", uploaded, { shouldValidate: true })
              }
              type="image"
              token={token}
              filePath={tourData.panorama?.name}
            />
            {errors.panoramaId && (
              <p className="text-red-400 text-xs mt-1">
                {errors.panoramaId.message}
              </p>
            )}
          </div>

          {/* Hidden field for ID */}
          <input type="hidden" {...register("_id")} />

          <MyInput
            label="نام تور مجازی"
            register={register}
            name="name"
            errMsg={errors.name?.message}
            className="w-full md:w-1/2 p-4"
          />

          <MyInput
            label="توضیحات"
            register={register}
            name="description"
            errMsg={errors.description?.message}
            className="w-full md:w-1/2 p-4"
            type="textarea"
          />

          <div className="w-full md:w-1/2 p-4">
            <SelectBox
              label="مکان"
              name="placeId"
              setValue={setValue}
              errMsg={errors.placeId?.message}
              options={places}
              placeholder="انتخاب مکان"
              defaultValue={
                tourData.place
                  ? { value: tourData.place._id, label: tourData.place.name }
                  : undefined
              }
            />
          </div>

          <div className="w-full md:w-1/2 p-4">
            <SelectBox
              label="وضعیت"
              name="status"
              setValue={setValue}
              errMsg={errors.status?.message}
              options={[
                { value: "draft", label: "پیش‌نویس" },
                { value: "active", label: "فعال" },
                { value: "archived", label: "بایگانی شده" },
              ]}
              defaultValue={
                tourData.status
                  ? {
                      value: tourData.status,
                      label:
                        tourData.status === "draft"
                          ? "پیش‌نویس"
                          : tourData.status === "active"
                            ? "فعال"
                            : "بایگانی شده",
                    }
                  : undefined
              }
            />
          </div>
        </div>

        <div className="w-full flex gap-4 justify-end">
          {!isValid && Object.keys(errors).length > 0 && (
            <div className="text-sm text-red-400 mr-4 self-center">
              لطفاً فیلدهای اجباری را تکمیل کنید
            </div>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="p-4 px-8 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-center font-semibold rounded-lg hover:from-gray-600 hover:to-gray-700 border border-gray-600"
          >
            بازگشت
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="p-4 px-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed shadow-lg shadow-pink-500/30"
          >
            {isSubmitting ? "در حال بروزرسانی..." : "بروزرسانی تور مجازی"}
          </button>
        </div>
      </form>
    </div>
  );
};
