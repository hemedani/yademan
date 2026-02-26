"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserPure } from "@/app/actions/user/updateUser";
import { getMe } from "@/app/actions/user/getMe";
import toast from "react-hot-toast";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => Promise<void>;
}

interface FormState {
  first_name: string;
  last_name: string;
  father_name: string;
  gender: "Male" | "Female" | "";
  summary: string;
  address: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
}

const EMPTY_FORM: FormState = {
  first_name: "",
  last_name: "",
  father_name: "",
  gender: "",
  summary: "",
  address: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.first_name.trim()) errors.first_name = "نام الزامی است";
  if (!form.last_name.trim()) errors.last_name = "نام خانوادگی الزامی است";
  return errors;
}

// ---------------------------------------------------------------------------
// Reusable sub-components
// ---------------------------------------------------------------------------

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-[#a0a0a0] mb-1.5">
      {children}
    </label>
  );
}

function TextInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-[#1a1a1a] border rounded-xl text-sm text-white placeholder-[#555] focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? "border-[#FF007A] focus:shadow-[0_0_0_3px_rgba(255,0,122,0.15)]"
            : "border-[#333] focus:border-[#FF007A] focus:shadow-[0_0_0_3px_rgba(255,0,122,0.1)]"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-[#FF007A]">{error}</p>}
    </div>
  );
}

function TextAreaInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-xl text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#FF007A] focus:shadow-[0_0_0_3px_rgba(255,0,122,0.1)] transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

function SkeletonField({ wide = false }: { wide?: boolean }) {
  return <div className={`h-10 rounded-xl bg-[#222] animate-pulse ${wide ? "w-full" : "w-full"}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="px-6 py-5 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="h-3 w-20 rounded bg-[#222] animate-pulse" />
          <SkeletonField />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-24 rounded bg-[#222] animate-pulse" />
          <SkeletonField />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-16 rounded bg-[#222] animate-pulse" />
        <SkeletonField />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-14 rounded bg-[#222] animate-pulse" />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-[#222] animate-pulse" />
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-20 rounded bg-[#222] animate-pulse" />
        <div className="h-20 rounded-xl bg-[#222] animate-pulse" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-12 rounded bg-[#222] animate-pulse" />
        <div className="h-16 rounded-xl bg-[#222] animate-pulse" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userId, onSuccess }) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch full user profile whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const fetchProfile = async () => {
      setIsFetching(true);
      setErrors({});

      try {
        const response = await getMe({
          _id: 1,
          first_name: 1,
          last_name: 1,
          father_name: 1,
          gender: 1,
          summary: 1,
          address: 1,
        });

        if (cancelled) return;

        if (response.success && response.user) {
          const u = response.user;
          setForm({
            first_name: u.first_name ?? "",
            last_name: u.last_name ?? "",
            father_name: (u as any).father_name ?? "",
            gender: u.gender === "Male" || u.gender === "Female" ? u.gender : "",
            summary: (u as any).summary ?? "",
            address: (u as any).address ?? "",
          });
        } else {
          toast.error("خطا در بارگذاری اطلاعات پروفایل");
        }
      } catch {
        if (!cancelled) toast.error("خطای غیرمنتظره‌ای رخ داد");
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Close on Escape key
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Parameters<typeof updateUserPure>[0] = {
        _id: userId,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        ...(form.father_name.trim() && { father_name: form.father_name.trim() }),
        ...(form.gender && { gender: form.gender }),
        ...(form.summary.trim() && { summary: form.summary.trim() }),
        ...(form.address.trim() && { address: form.address.trim() }),
      };

      const response = await updateUserPure(payload);

      if (response.success) {
        toast.success("پروفایل با موفقیت به‌روزرسانی شد");
        await onSuccess();
        onClose();
      } else {
        const msg = (response.body as { message?: string })?.message ?? "خطا در به‌روزرسانی پروفایل";
        toast.error(msg);
      }
    } catch {
      toast.error("خطای غیرمنتظره‌ای رخ داد");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isFetching || isSubmitting;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-lg bg-[#121212] border border-[#333] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-[#222] bg-gradient-to-r from-[#FF007A]/10 via-transparent to-[#A020F0]/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF007A] to-[#A020F0] flex items-center justify-center shadow-lg shadow-[#FF007A]/20 shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">ویرایش پروفایل</h2>
                    <p className="text-xs text-[#a0a0a0] mt-0.5">اطلاعات شخصی خود را به‌روز کنید</p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 left-4 p-2 rounded-lg text-[#666] hover:text-white hover:bg-[#1e1e1e] border border-transparent hover:border-[#333] transition-all duration-200"
                  aria-label="بستن"
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

              {/* Body: skeleton while fetching, form when ready */}
              {isFetching ? (
                <LoadingSkeleton />
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel htmlFor="first_name">
                          نام <span className="text-[#FF007A]">*</span>
                        </FieldLabel>
                        <TextInput
                          id="first_name"
                          name="first_name"
                          value={form.first_name}
                          onChange={handleChange}
                          placeholder="نام"
                          error={errors.first_name}
                          disabled={isDisabled}
                        />
                      </div>
                      <div>
                        <FieldLabel htmlFor="last_name">
                          نام خانوادگی <span className="text-[#FF007A]">*</span>
                        </FieldLabel>
                        <TextInput
                          id="last_name"
                          name="last_name"
                          value={form.last_name}
                          onChange={handleChange}
                          placeholder="نام خانوادگی"
                          error={errors.last_name}
                          disabled={isDisabled}
                        />
                      </div>
                    </div>

                    {/* Father name */}
                    <div>
                      <FieldLabel htmlFor="father_name">نام پدر</FieldLabel>
                      <TextInput
                        id="father_name"
                        name="father_name"
                        value={form.father_name}
                        onChange={handleChange}
                        placeholder="نام پدر (اختیاری)"
                        disabled={isDisabled}
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <FieldLabel htmlFor="gender">جنسیت</FieldLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { value: "", label: "انتخاب نشده" },
                            { value: "Male", label: "مرد" },
                            { value: "Female", label: "زن" },
                          ] as const
                        ).map(({ value, label }) => {
                          const isActive = form.gender === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => setForm((prev) => ({ ...prev, gender: value }))}
                              className={`py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isActive
                                  ? "bg-gradient-to-r from-[#FF007A] to-[#A020F0] border-transparent text-white shadow-lg shadow-[#FF007A]/20"
                                  : "bg-[#1a1a1a] border-[#333] text-[#a0a0a0] hover:border-[#FF007A]/50 hover:text-white"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Summary / Bio */}
                    <div>
                      <FieldLabel htmlFor="summary">درباره من</FieldLabel>
                      <TextAreaInput
                        id="summary"
                        name="summary"
                        value={form.summary}
                        onChange={handleChange}
                        placeholder="چند جمله‌ای درباره خودتان بنویسید..."
                        rows={3}
                        disabled={isDisabled}
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <FieldLabel htmlFor="address">آدرس</FieldLabel>
                      <TextAreaInput
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="آدرس محل سکونت..."
                        rows={2}
                        disabled={isDisabled}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-[#222] bg-[#0e0e0e] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#333] text-sm text-[#a0a0a0] hover:border-[#555] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      انصراف
                    </button>

                    <button
                      type="submit"
                      disabled={isDisabled}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#FF007A]/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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
                          در حال ذخیره...
                        </>
                      ) : (
                        <>
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          ذخیره تغییرات
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
