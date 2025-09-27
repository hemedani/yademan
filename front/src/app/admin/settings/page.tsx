"use client";

import React, { useState, useEffect } from "react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    instagram: string;
    telegram: string;
    twitter: string;
  };
  maintenanceMode: boolean;
  allowUserRegistration: boolean;
}

interface SecuritySettings {
  enableTwoFactor: boolean;
  sessionTimeout: number;
  passwordMinLength: number;
  requireEmailVerification: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

interface ContentSettings {
  autoApproveComments: boolean;
  autoApprovePlaces: boolean;
  enableReviews: boolean;
  maxImageSize: number;
  allowedImageTypes: string[];
  moderationKeywords: string[];
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("site");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "نقشه ایران",
    siteDescription: "راهنمای جامع اماکن و جاذبه‌های توریستی شیراز",
    contactEmail: "info@naghshe-shiraz.ir",
    contactPhone: "071-12345678",
    address: "شیراز، خیابان زند، پلاک ۱۲۳",
    socialLinks: {
      instagram: "@naghshe_shiraz",
      telegram: "@naghshe_shiraz",
      twitter: "@naghshe_shiraz",
    },
    maintenanceMode: false,
    allowUserRegistration: true,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    enableTwoFactor: false,
    sessionTimeout: 60, // minutes
    passwordMinLength: 8,
    requireEmailVerification: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
  });

  const [contentSettings, setContentSettings] = useState<ContentSettings>({
    autoApproveComments: false,
    autoApprovePlaces: false,
    enableReviews: true,
    maxImageSize: 5, // MB
    allowedImageTypes: ["jpg", "jpeg", "png", "webp"],
    moderationKeywords: ["spam", "تبلیغ", "فحش"],
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Settings are already initialized with mock data
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (settingsType: string) => {
    setSaveLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(`تنظیمات ${getTabLabel(settingsType)} با موفقیت ذخیره شد!`);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("خطا در ذخیره تنظیمات");
    } finally {
      setSaveLoading(false);
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "site":
        return "سایت";
      case "security":
        return "امنیتی";
      case "content":
        return "محتوا";
      case "backup":
        return "پشتیبان‌گیری";
      default:
        return "عمومی";
    }
  };

  const formatPersianNumber = (num: number): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  };

  const tabs = [
    { id: "site", label: "تنظیمات سایت", icon: "🌐" },
    { id: "security", label: "امنیت", icon: "🔒" },
    { id: "content", label: "محتوا", icon: "📝" },
    { id: "backup", label: "پشتیبان‌گیری", icon: "💾" },
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">در حال بارگذاری تنظیمات...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                تنظیمات سیستم
              </h1>
              <p className="text-slate-600 mt-2">
                مدیریت تنظیمات و پیکربندی سایت
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* Site Settings Tab */}
            {activeTab === "site" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-6">
                    تنظیمات عمومی سایت
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        نام سایت
                      </label>
                      <input
                        type="text"
                        value={siteSettings.siteName}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            siteName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        ایمیل تماس
                      </label>
                      <input
                        type="email"
                        value={siteSettings.contactEmail}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            contactEmail: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        تلفن تماس
                      </label>
                      <input
                        type="tel"
                        value={siteSettings.contactPhone}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            contactPhone: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        آدرس
                      </label>
                      <input
                        type="text"
                        value={siteSettings.address}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      توضیحات سایت
                    </label>
                    <textarea
                      value={siteSettings.siteDescription}
                      onChange={(e) =>
                        setSiteSettings((prev) => ({
                          ...prev,
                          siteDescription: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    شبکه‌های اجتماعی
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        اینستاگرام
                      </label>
                      <input
                        type="text"
                        value={siteSettings.socialLinks.instagram}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            socialLinks: {
                              ...prev.socialLinks,
                              instagram: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        placeholder="@username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        تلگرام
                      </label>
                      <input
                        type="text"
                        value={siteSettings.socialLinks.telegram}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            socialLinks: {
                              ...prev.socialLinks,
                              telegram: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        placeholder="@username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        توییتر
                      </label>
                      <input
                        type="text"
                        value={siteSettings.socialLinks.twitter}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            socialLinks: {
                              ...prev.socialLinks,
                              twitter: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    تنظیمات عملکرد
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={siteSettings.maintenanceMode}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            maintenanceMode: e.target.checked,
                          }))
                        }
                        className="ml-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-700">
                          حالت تعمیرات
                        </span>
                        <p className="text-xs text-slate-500">
                          سایت برای کاربران عادی غیرقابل دسترس خواهد بود
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={siteSettings.allowUserRegistration}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            allowUserRegistration: e.target.checked,
                          }))
                        }
                        className="ml-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-700">
                          امکان ثبت‌نام کاربران
                        </span>
                        <p className="text-xs text-slate-500">
                          کاربران جدید می‌توانند ثبت‌نام کنند
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveSettings("site")}
                    disabled={saveLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {saveLoading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings Tab */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-6">
                    تنظیمات امنیتی
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        حداقل طول رمز عبور
                      </label>
                      <input
                        type="number"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            passwordMinLength: parseInt(e.target.value),
                          }))
                        }
                        min="6"
                        max="20"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        فعلی:{" "}
                        {formatPersianNumber(
                          securitySettings.passwordMinLength,
                        )}{" "}
                        کاراکتر
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        زمان انقضای نشست (دقیقه)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            sessionTimeout: parseInt(e.target.value),
                          }))
                        }
                        min="15"
                        max="1440"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        فعلی:{" "}
                        {formatPersianNumber(securitySettings.sessionTimeout)}{" "}
                        دقیقه
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        حداکثر تلاش ورود ناموفق
                      </label>
                      <input
                        type="number"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            maxLoginAttempts: parseInt(e.target.value),
                          }))
                        }
                        min="3"
                        max="10"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        مدت قفل حساب (دقیقه)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.lockoutDuration}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            lockoutDuration: parseInt(e.target.value),
                          }))
                        }
                        min="5"
                        max="60"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    تنظیمات احراز هویت
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securitySettings.enableTwoFactor}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            enableTwoFactor: e.target.checked,
                          }))
                        }
                        className="ml-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-700">
                          احراز هویت دو مرحله‌ای
                        </span>
                        <p className="text-xs text-slate-500">
                          نیاز به تأیید اضافی برای ورود
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securitySettings.requireEmailVerification}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            requireEmailVerification: e.target.checked,
                          }))
                        }
                        className="ml-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-700">
                          تأیید ایمیل الزامی
                        </span>
                        <p className="text-xs text-slate-500">
                          کاربران باید ایمیل خود را تأیید کنند
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveSettings("security")}
                    disabled={saveLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {saveLoading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                  </button>
                </div>
              </div>
            )}

            {/* Content Settings Tab */}
            {activeTab === "content" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-6">
                    تنظیمات محتوا
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">
                        تأیید خودکار
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={contentSettings.autoApproveComments}
                            onChange={(e) =>
                              setContentSettings((prev) => ({
                                ...prev,
                                autoApproveComments: e.target.checked,
                              }))
                            }
                            className="ml-3"
                          />
                          <div>
                            <span className="text-sm font-medium text-slate-700">
                              تأیید خودکار نظرات
                            </span>
                            <p className="text-xs text-slate-500">
                              نظرات بدون نیاز به بررسی منتشر شوند
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={contentSettings.autoApprovePlaces}
                            onChange={(e) =>
                              setContentSettings((prev) => ({
                                ...prev,
                                autoApprovePlaces: e.target.checked,
                              }))
                            }
                            className="ml-3"
                          />
                          <div>
                            <span className="text-sm font-medium text-slate-700">
                              تأیید خودکار مکان‌ها
                            </span>
                            <p className="text-xs text-slate-500">
                              مکان‌های جدید بدون بررسی منتشر شوند
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={contentSettings.enableReviews}
                            onChange={(e) =>
                              setContentSettings((prev) => ({
                                ...prev,
                                enableReviews: e.target.checked,
                              }))
                            }
                            className="ml-3"
                          />
                          <div>
                            <span className="text-sm font-medium text-slate-700">
                              فعال‌سازی بررسی‌ها
                            </span>
                            <p className="text-xs text-slate-500">
                              کاربران می‌توانند امتیاز و نظر ثبت کنند
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">
                        تنظیمات تصاویر
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            حداکثر حجم تصویر (مگابایت)
                          </label>
                          <input
                            type="number"
                            value={contentSettings.maxImageSize}
                            onChange={(e) =>
                              setContentSettings((prev) => ({
                                ...prev,
                                maxImageSize: parseInt(e.target.value),
                              }))
                            }
                            min="1"
                            max="50"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            فرمت‌های مجاز
                          </label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {contentSettings.allowedImageTypes.map(
                              (type, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                  {type.toUpperCase()}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">
                        کلمات نامناسب
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {contentSettings.moderationKeywords.map(
                          (keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-1"
                            >
                              {keyword}
                              <button
                                onClick={() =>
                                  setContentSettings((prev) => ({
                                    ...prev,
                                    moderationKeywords:
                                      prev.moderationKeywords.filter(
                                        (_, i) => i !== index,
                                      ),
                                  }))
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                ×
                              </button>
                            </span>
                          ),
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="کلمه جدید اضافه کنید..."
                        onKeyPress={(e) => {
                          if (
                            e.key === "Enter" &&
                            (e.target as HTMLInputElement).value.trim()
                          ) {
                            setContentSettings((prev) => ({
                              ...prev,
                              moderationKeywords: [
                                ...prev.moderationKeywords,
                                (e.target as HTMLInputElement).value.trim(),
                              ],
                            }));
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Enter را فشار دهید تا اضافه شود
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveSettings("content")}
                    disabled={saveLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {saveLoading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                  </button>
                </div>
              </div>
            )}

            {/* Backup Tab */}
            {activeTab === "backup" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-6">
                    پشتیبان‌گیری و بازیابی
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">
                        ایجاد پشتیبان
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">
                        پشتیبان کاملی از پایگاه داده و فایل‌های سایت ایجاد کنید
                      </p>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
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
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                          />
                        </svg>
                        ایجاد پشتیبان
                      </button>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">
                        بازیابی از پشتیبان
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">
                        سایت را از یک فایل پشتیبان بازیابی کنید
                      </p>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
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
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        بازیابی از پشتیبان
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 bg-amber-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">
                      پشتیبان‌های اخیر
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-slate-800">
                            پشتیبان کامل - ۱۴۰۳/۰۱/۲۰
                          </p>
                          <p className="text-xs text-slate-500">
                            حجم: ۲۵ مگابایت
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors duration-200">
                            دانلود
                          </button>
                          <button className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors duration-200">
                            حذف
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-slate-800">
                            پشتیبان کامل - ۱۴۰۳/۰۱/۱۵
                          </p>
                          <p className="text-xs text-slate-500">
                            حجم: ۲۲ مگابایت
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors duration-200">
                            دانلود
                          </button>
                          <button className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors duration-200">
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-yellow-600 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">
                          هشدار مهم
                        </h4>
                        <p className="text-sm text-yellow-700">
                          قبل از بازیابی از پشتیبان، حتماً پشتیبان جدیدی از
                          وضعیت فعلی تهیه کنید. فرآیند بازیابی غیرقابل بازگشت
                          است.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
