"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectBox from "../atoms/Select";
import { UploadImage } from "@/components/molecules/UploadFile";
import { ToastNotify } from "@/utils/helper";
import MyInput from "../atoms/MyInput";
import { add } from "@/app/actions/virtual_tour/add";
import { ReqType } from "@/types/declarations/selectInp";

export const VirtualTourCreateSchema = z.object({
  name: z.string().min(1, "نام تور مجازی الزامی است"),
  description: z.string().optional(),
  placeId: z.string().min(1, "انتخاب مکان الزامی است"),
  panoramaId: z.string().min(1, "بارگذاری تصویر پانوراما الزامی است"),
  status: z.enum(["draft", "active", "archived"], {
    message: "وضعیت الزامی است",
  }),
});

export type VirtualTourFormData = z.infer<typeof VirtualTourCreateSchema>;
export type VirtualTourSetObj = Omit<
  ReqType["main"]["virtual_tour"]["add"]["set"],
  "createdAt" | "updatedAt"
>;

type PlaceOption = {
  value: string;
  label: string;
};

export const FormCreateVirtualTour = ({
  token,
  places = [],
}: {
  token?: string;
  places: PlaceOption[];
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<VirtualTourFormData>({
    resolver: zodResolver(VirtualTourCreateSchema),
    defaultValues: {
      description: "",
      status: "draft",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<VirtualTourFormData> = async (data) => {
    try {
      // Convert form data to backend format
      const backendData: VirtualTourSetObj = {
        ...data,
      };

      const get = {
        _id: 1,
        name: 1,
      };

      const result = await add({
        set: backendData as ReqType["main"]["virtual_tour"]["add"]["set"],
        get,
      });

      if (result.success) {
        ToastNotify("success", "تور مجازی با موفقیت ایجاد شد");
        router.replace("/admin/virtual-tours");
      } else {
        ToastNotify("error", result.body?.message || "خطا در ایجاد تور مجازی");
      }
    } catch (error) {
      console.error("Error creating virtual tour:", error);
      ToastNotify("error", "خطا در ارسال فرم");
    }
  };

  return (
    <div className="p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-gray-100 p-6 border rounded-lg"
      >
        <div className="w-full flex flex-wrap">
          <div className="w-full p-4">
            <span className="text-sm font-medium text-gray-700">
              تصویر پانوراما
            </span>
            <UploadImage
              inputName="panorama"
              setUploadedImage={(uploaded: string) =>
                setValue("panoramaId", uploaded, { shouldValidate: true })
              }
              type="image"
              token={token}
            />
            {errors.panoramaId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.panoramaId.message}
              </p>
            )}
          </div>

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
              defaultValue={{ value: "draft", label: "پیش‌نویس" }}
            />
          </div>
        </div>

        <div className="w-full flex gap-4 justify-end">
          {!isValid && Object.keys(errors).length > 0 && (
            <div className="text-sm text-red-600 mr-4 self-center">
              لطفاً فیلدهای اجباری را تکمیل کنید
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="p-4 px-8 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "در حال ارسال..." : "ایجاد تور مجازی"}
          </button>
        </div>
      </form>
    </div>
  );
};
