"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { ToastNotify, translateGender } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { ReqType, userSchema } from "@/types/declarations/selectInp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MyInput from "@/components/atoms/MyInput";
import DateInput from "@/components/atoms/DateInput";
import SelectBox from "@/components/atoms/Select";
import { updateUserPure } from "@/app/actions/user/updateUser";

export const UpdateUserPureSchema = z.object({
  _id: z.string(),
  first_name: z.optional(z.string().min(1, "نام الزامی است")),
  last_name: z.optional(z.string().min(1, "نام خانوادگی الزامی است")),
  father_name: z.string().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  birth_date: z.coerce.date().optional(),
  summary: z.string().optional(),
  address: z.optional(z.string()),
});

export type UpdateUserPureSchemaType = z.infer<typeof UpdateUserPureSchema>;
export type UpdateUserPureSet = ReqType["main"]["user"]["updateUser"]["set"];

export const EditUserPures = ({
  isOwn,
  ...rest
}: userSchema & { isOwn?: boolean }) => {
  const {
    handleSubmit,
    setValue,
    register,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UpdateUserPureSet>({
    resolver: zodResolver(UpdateUserPureSchema),
    defaultValues: rest,
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<UpdateUserPureSet> = async (formData) => {
    const updatedUserPures = await updateUserPure(formData);
    if (updatedUserPures.success) {
      ToastNotify("success", "با موقیت ویرایش شد");
      router.replace(isOwn ? "/user" : "/admin/users");
    } else {
      ToastNotify("error", updatedUserPures.body.message);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-wrap w-full">
        <input
          {...register("_id")}
          id="_id"
          name="_id"
          type="text"
          disabled
          hidden
        />

        <MyInput
          label="نام"
          register={register}
          name="first_name"
          errMsg={errors.father_name?.message}
        />
        <MyInput
          label="نام خانوادگی"
          register={register}
          name="last_name"
          errMsg={errors.last_name?.message}
        />
        <MyInput
          label="نام پدر"
          register={register}
          name="father_name"
          errMsg={errors.father_name?.message}
        />
        <MyInput
          label="آدرس"
          register={register}
          name="address"
          errMsg={errors.address?.message}
        />
        <MyInput
          label="توضیحات"
          register={register}
          name="summary"
          errMsg={errors.summary?.message}
        />

        <DateInput
          label="تاریخ تولد"
          name="birth_date"
          control={control}
          errMsg={errors.birth_date?.message}
          className="w-1/2 p-2"
          format="YYYY/MM/DD"
          locale="fa"
        />

        <SelectBox
          label="جنسیت"
          name="gender"
          setValue={setValue}
          errMsg={errors.gender?.message}
          options={[
            { value: "Male", label: "مرد" },
            { value: "Female", label: "زن" },
          ]}
          defaultValue={{
            value: rest.gender,
            label: translateGender(rest.gender),
          }}
        />
      </div>

      <div className="w-full flex gap-4 justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="p-4 px-8 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          ارسال
        </button>
      </div>
    </form>
  );
};
