"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import AsyncSelectBox from "../atoms/AsyncSelectBox";
import MyInput from "../atoms/MyInput";
import { ToastNotify } from "@/utils/helper";
import { update } from "@/app/actions/virtual_tour/update";

export const VirtualTourEditSchema = z.object({
  _id: z.string().min(1, "شناسه تور مجازی الزامی است"),
  name: z.string().min(1, "نام تور مجازی الزامی است"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "archived"], {
    message: "وضعیت الزامی است",
  }),
});

export type VirtualTourEditFormData = z.infer<typeof VirtualTourEditSchema>;

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

type StatusOption = { value: string; label: string };

const statusOptions: StatusOption[] = [
  { value: "draft", label: "پیش‌نویس" },
  { value: "active", label: "فعال" },
  { value: "archived", label: "بایگانی شده" },
];

const statusLabelMap: Record<string, string> = {
  draft: "پیش‌نویس",
  active: "فعال",
  archived: "بایگانی شده",
};

const loadStatusOptions = async (inputValue: string) => {
  return statusOptions.filter((opt) => opt.label.includes(inputValue));
};

export const FormEditVirtualTour = ({
  tourData,
}: {
  token?: string;
  places?: { value: string; label: string }[];
  tourData: TourData;
}) => {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(
    tourData.status ? { value: tourData.status, label: statusLabelMap[tourData.status] } : null,
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<VirtualTourEditFormData>({
    resolver: zodResolver(VirtualTourEditSchema),
    defaultValues: {
      _id: tourData._id,
      name: tourData.name,
      description: tourData.description ?? "",
      status: tourData.status,
    },
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      _id: tourData._id,
      name: tourData.name,
      description: tourData.description ?? "",
      status: tourData.status,
    });
    setSelectedStatus(
      tourData.status ? { value: tourData.status, label: statusLabelMap[tourData.status] } : null,
    );
  }, [tourData, reset]);

  const onSubmit: SubmitHandler<VirtualTourEditFormData> = async (data) => {
    try {
      const result = await update({
        set: {
          _id: data._id,
          name: data.name,
          description: data.description,
          status: data.status,
        },
        get: { _id: 1, name: 1 },
      });

      if (result.success) {
        ToastNotify("success", "تور مجازی با موفقیت بروزرسانی شد");
        router.replace("/admin/virtual-tours");
      } else {
        ToastNotify("error", result.body?.message || "خطا در بروزرسانی تور مجازی");
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
            <AsyncSelectBox
              label="وضعیت"
              name="status"
              setValue={setValue}
              loadOptions={loadStatusOptions}
              defaultOptions={statusOptions}
              value={selectedStatus}
              placeholder="انتخاب وضعیت"
              errMsg={errors.status?.message}
              onSelectChange={(option: StatusOption | null) => {
                setSelectedStatus(option);
              }}
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
