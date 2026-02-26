"use client";

import React, { useState } from "react";

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  activityVisible: boolean;
}

interface ProfileSettingsProps {
  user?: {
    name: string;
    email: string;
    phone?: string;
    notifications: NotificationSettings;
    privacy: PrivacySettings;
  };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

function Toggle({
  checked,
  onChange,
  name,
}: {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-[#2a2a2a] border border-[#444] rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-[#FF007A] peer-checked:to-[#A020F0] peer-checked:border-transparent transition-all duration-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner peer-checked:shadow-[0_0_8px_rgba(255,0,122,0.4)]" />
    </label>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
      <span className="text-[#FF007A]">{icon}</span>
      {children}
    </h3>
  );
}

function SettingRow({
  title,
  description,
  name,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#333] transition-colors duration-200">
      <div className="flex-1 min-w-0 mr-4">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-[#666] mt-0.5">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} name={name} />
    </div>
  );
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const [formData, setFormData] = useState<FormData>({
    name: user?.name ?? "کاربر یادمان",
    email: user?.email ?? "user@yademan.ir",
    phone: user?.phone ?? "",
    notifications: {
      email: user?.notifications.email ?? true,
      push: user?.notifications.push ?? true,
      sms: user?.notifications.sms ?? false,
    },
    privacy: {
      profileVisible: user?.privacy.profileVisible ?? true,
      activityVisible: user?.privacy.activityVisible ?? true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => {
        const parentValue = prev[parent as keyof FormData];
        if (typeof parentValue === "object" && parentValue !== null) {
          return {
            ...prev,
            [parent]: {
              ...(parentValue as unknown as Record<string, unknown>),
              [child]: type === "checkbox" ? checked : value,
            },
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "تنظیمات با موفقیت ذخیره شد" });
    } catch {
      setMessage({ type: "error", text: "خطا در ذخیره تنظیمات" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#121212] border border-[#333] rounded-2xl overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <svg
            className="w-5 h-5 text-[#FF007A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          تنظیمات پروفایل
        </h2>

        {/* Status message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm flex items-center gap-3 ${
              message.type === "success"
                ? "bg-[#00ff85]/10 border-[#00ff85]/20 text-[#00ff85]"
                : "bg-[#FF007A]/10 border-[#FF007A]/20 text-[#FF007A]"
            }`}
          >
            {message.type === "success" ? (
              <svg
                className="w-5 h-5 flex-shrink-0"
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
            ) : (
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <SectionTitle
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            >
              اطلاعات شخصی
            </SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-[#a0a0a0] mb-2">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#FF007A] focus:shadow-[0_0_0_3px_rgba(255,0,122,0.1)] transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-[#a0a0a0] mb-2">
                  آدرس ایمیل
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#FF007A] focus:shadow-[0_0_0_3px_rgba(255,0,122,0.1)] transition-all duration-200"
                />
              </div>

              <div className="md:col-span-2 md:max-w-xs">
                <label htmlFor="phone" className="block text-xs font-medium text-[#a0a0a0] mb-2">
                  شماره تلفن
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="09123456789"
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#FF007A] focus:shadow-[0_0_0_3px_rgba(255,0,122,0.1)] transition-all duration-200"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

          {/* Notification Settings */}
          <div>
            <SectionTitle
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              }
            >
              تنظیمات اعلان‌ها
            </SectionTitle>

            <div className="space-y-3">
              <SettingRow
                title="اعلان‌های ایمیل"
                description="دریافت اعلان‌ها از طریق ایمیل"
                name="notifications.email"
                checked={formData.notifications.email}
                onChange={handleInputChange}
              />
              <SettingRow
                title="اعلان‌های مرورگر"
                description="دریافت اعلان‌های push در مرورگر"
                name="notifications.push"
                checked={formData.notifications.push}
                onChange={handleInputChange}
              />
              <SettingRow
                title="اعلان‌های پیامکی"
                description="دریافت اعلان‌ها از طریق پیامک"
                name="notifications.sms"
                checked={formData.notifications.sms}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

          {/* Privacy Settings */}
          <div>
            <SectionTitle
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            >
              تنظیمات حریم خصوصی
            </SectionTitle>

            <div className="space-y-3">
              <SettingRow
                title="نمایش عمومی پروفایل"
                description="امکان مشاهده پروفایل شما توسط دیگران"
                name="privacy.profileVisible"
                checked={formData.privacy.profileVisible}
                onChange={handleInputChange}
              />
              <SettingRow
                title="نمایش فعالیت‌ها"
                description="امکان مشاهده فعالیت‌های شما توسط دیگران"
                name="privacy.activityVisible"
                checked={formData.privacy.activityVisible}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

          {/* Danger Zone */}
          <div>
            <SectionTitle
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              }
            >
              اقدامات حساب
            </SectionTitle>

            <div className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-[#a0a0a0] hover:border-[#FF007A]/30 hover:text-white hover:bg-[#FF007A]/5 transition-all duration-200 text-right"
              >
                <svg
                  className="w-4 h-4 text-[#a0a0a0] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                تغییر رمز عبور
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-[#FF007A]/70 hover:border-[#FF007A]/30 hover:text-[#FF007A] hover:bg-[#FF007A]/5 transition-all duration-200 text-right"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
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
                حذف حساب کاربری
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#FF007A]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105 transition-all duration-300"
            >
              {isLoading ? (
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>
    </div>
  );
};

export default ProfileSettings;
