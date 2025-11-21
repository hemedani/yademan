"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  ModelName,
  ToastNotify,
  translateModelNameToPersian,
} from "@/utils/helper";
import MyInput from "@/components/atoms/MyInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScrollLock } from "@/hooks/useScrollLock";
import { availableColors, availableIcons } from "@/app/actions/category/types";

interface CreateUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: {
    _id: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
  } | null;
  model: ModelName;

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

const itemSchema = z.object({
  name: z
    .string()
    .min(1, "نام برچسب الزامی است")
    .max(50, "حداکثر 50 کاراکتر مجاز است"),
  description: z
    .string()
    .min(1, "نام برچسب الزامی است")
    .max(50, "حداکثر 50 کاراکتر مجاز است"),
  color: z.optional(
    z
      .string()
      .min(1, "نام برچسب الزامی است")
      .max(50, "حداکثر 50 کاراکتر مجاز است"),
  ),
  icon: z.optional(
    z
      .string()
      .min(1, "نام برچسب الزامی است")
      .max(50, "حداکثر 50 کاراکتر مجاز است"),
  ),
});

type ItemFormValues = z.infer<typeof itemSchema>;

const CreateUpdateModal = ({
  isOpen,
  onClose,
  itemToEdit,
  model,
  update,
  add,
}: CreateUpdateModalProps): React.ReactElement => {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  // Prevent background scrolling when modal is open
  useScrollLock(isOpen);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: itemToEdit?.name || "",
      description: itemToEdit?.description || "",
      color: itemToEdit?.color || "#3B82F6",
      icon: itemToEdit?.icon || "📍",
    },
  });

  const watchedColor = watch("color");
  const watchedIcon = watch("icon");

  useEffect(() => {
    if (itemToEdit) {
      setSelectedColor(itemToEdit.color || "#3B82F6");
      setSelectedIcon(itemToEdit.icon || "📍");
      reset({
        name: itemToEdit.name || "",
        description: itemToEdit.description || "",
        color: itemToEdit.color || "#3B82F6",
        icon: itemToEdit.icon || "📍",
      });
    } else {
      setSelectedColor("#3B82F6");
      setSelectedIcon("📍");
      reset({
        name: "",
        description: "",
        color: "#3B82F6",
        icon: "📍",
      });
    }
  }, [itemToEdit, reset]);

  const onSubmit = async (data: ItemFormValues) => {
    try {
      if (itemToEdit) {
        await update({ _id: itemToEdit._id, ...data });
        ToastNotify(
          "success",
          `${translateModelNameToPersian(model)} با موفقیت ویرایش شد`,
        );
      } else {
        await add(data);
        ToastNotify(
          "success",
          `${translateModelNameToPersian(model)} با موفقیت ایجاد شد`,
        );
      }
      router.refresh();
      reset();
      onClose();
    } catch (err) {
      ToastNotify("error", "خطا در انجام عملیات");
      console.error(err);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 z-[2000] ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`bg-gray-800/90 backdrop-blur-xl p-6 rounded-xl border border-gray-700 shadow-2xl w-1/3 transform transition-all duration-500 ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-lg font-bold text-white mb-4">
          {itemToEdit
            ? `ویرایش ${translateModelNameToPersian(model)}`
            : `ایجاد ${translateModelNameToPersian(model)} جدید`}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <MyInput
            className="w-full"
            errMsg={errors.name?.message}
            name="name"
            label={translateModelNameToPersian(model)}
            register={register}
          />

          <MyInput
            className="w-full"
            errMsg={errors.description?.message}
            name="description"
            label="توضیحات"
            register={register}
            type="textarea"
          />

          <>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                آیکون
              </label>
              <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-700 rounded-lg bg-gray-700/50 mb-2">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`text-2xl p-2 rounded-md hover:bg-gray-600 ${
                      watchedIcon === icon
                        ? "bg-pink-500/20 border-2 border-pink-500"
                        : "border border-gray-600"
                    }`}
                    onClick={() => {
                      setValue("icon", icon);
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  آیکون سفارشی
                </label>
                <input
                  type="text"
                  {...register("icon")}
                  className="w-full p-2 rounded-md bg-gray-700 border-gray-600 text-white focus:border-pink-500 focus:ring-pink-500"
                  placeholder="آیکون سفارشی وارد کنید"
                />
              </div>
              {errors.icon?.message && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.icon.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                رنگ
              </label>
              <div className="grid grid-cols-10 gap-2 mt-2 mb-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      watchedColor === color
                        ? "border-white ring-2 ring-pink-500 ring-offset-2 ring-offset-gray-800"
                        : "border-gray-400"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setValue("color", color);
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <label className="block text-sm font-medium text-gray-300">
                  رنگ سفارشی
                </label>
                <input
                  type="color"
                  {...register("color")}
                  className="h-8 w-8 rounded-md bg-gray-700 border-gray-600 focus:border-pink-500 focus:ring-pink-500"
                />
                <input
                  type="text"
                  value={watchedColor}
                  onChange={(e) => setValue("color", e.target.value)}
                  className="flex-1 p-2 rounded-md bg-gray-700 border-gray-600 text-white focus:border-pink-500 focus:ring-pink-500"
                  placeholder="#RRGGBB"
                />
              </div>
              {errors.color?.message && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.color.message}
                </p>
              )}
            </div>
          </>

          <div className="flex justify-end mt-4 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              بستن
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors"
            >
              {itemToEdit ? "ویرایش" : "ایجاد"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUpdateModal;
