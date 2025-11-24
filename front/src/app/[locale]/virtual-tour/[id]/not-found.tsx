import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function NotFound() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a00] text-white p-4">
      <h2 className="text-2xl font-bold mb-4">{t("virtualTour.errorTitle")}</h2>
      <p className="mb-6 text-center text-[#a0a0a0]">{t("virtualTour.errorMessage")}</p>
      <Link
        href={`/${locale}/`}
        className="px-4 py-2 bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white rounded-md text-sm font-medium"
      >
        {t("Common.back")}
      </Link>
    </div>
  );
}
