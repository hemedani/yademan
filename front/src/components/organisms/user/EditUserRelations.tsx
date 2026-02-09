"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { updateRelationUser } from "@/app/actions/user/updateRelationUser";
import { ToastNotify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { ReqType, userSchema } from "@/types/declarations/selectInp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadImage } from "@/components/molecules/UploadFile";

export const UpdateUserRelationSchema = z.object({
  _id: z.string(),
  avatar: z.any().optional(), // برای عکس پروفایل
  national_card: z.any().optional(), // برای کارت ملی
});

export type UpdateUserRelationSchemaType = z.infer<typeof UpdateUserRelationSchema>;
export type UpdateUserRelationSet = ReqType["main"]["user"]["updateUserRelations"]["set"];

export const EditUserRelations = ({
  _id,
  avatar,
  national_card,
  isOwn,
}: userSchema & { isOwn?: boolean }) => {
  const { handleSubmit, setValue } = useForm<UpdateUserRelationSet>({
    resolver: zodResolver(UpdateUserRelationSchema),
  });

  const token = Cookies.get("token");
  const router = useRouter();

  const onSubmit: SubmitHandler<UpdateUserRelationSet> = async (formData) => {
    const updatedUserRelations = await updateRelationUser({
      get: { first_name: 1 },
      set: { ...formData, _id: _id! },
    });
    if (updatedUserRelations.success) {
      ToastNotify("success", "با موقیت ویرایش شد");
      router.replace(isOwn ? "/user" : "/admin/users");
    } else {
      ToastNotify("error", "با خطا مواجه شد");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-gray-800 p-6 border border-gray-700 rounded-lg"
    >
      <div className="flex flex-wrap w-full">
        <div className="w-1/2 p-4">
          <span className="text-gray-300">عکس پروفایل کاربری</span>
          <UploadImage
            inputName="avatar"
            setUploadedImage={(uploaded: string) => setValue("avatar", uploaded)}
            type="image"
            token={token}
            filePath={avatar ? avatar.name : undefined}
          />
        </div>
        <div className="w-1/2 p-4">
          <span className="text-gray-300">عکس کارت ملی</span>
          <UploadImage
            inputName="national_card"
            setUploadedImage={(uploaded: string) => setValue("national_card", uploaded)}
            type="image"
            token={token}
            filePath={national_card ? national_card.name : undefined}
          />
        </div>
      </div>
      <div className="w-full flex gap-4 justify-end">
        <button
          type="submit"
          className="p-4 px-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-lg shadow-pink-500/30"
        >
          ارسال
        </button>
      </div>
    </form>
  );
};
