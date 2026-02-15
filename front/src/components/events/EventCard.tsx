"use client";

import { eventSchema } from "@/types/declarations/selectInp";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface EventCardProps {
  event: eventSchema;
  locale: string;
}

export default function EventCard({ event, locale }: EventCardProps) {
  const t = useTranslations("Events");
  const router = useRouter();

  // Format date safely
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(dateString);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const handleClick = () => {
    router.push(`/${locale}/events/${event._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#333] hover:border-[#FF007A] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#FF007A]/20 transform hover:-translate-y-1"
    >
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF007A]/0 via-transparent to-[#7B2FF7]/0 group-hover:from-[#FF007A]/10 group-hover:to-[#7B2FF7]/10 transition-all duration-300" />

      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden">
        {event.thumbnail?.name ? (
          <Image
            src={getImageUploadUrl(event.thumbnail.name, "images")}
            alt={event.thumbnail.alt_text || event.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center text-6xl font-bold"
            style={{
              background: event.color
                ? `linear-gradient(135deg, ${event.color}20, ${event.color}40)`
                : "linear-gradient(135deg, #FF007A20, #7B2FF740)",
            }}
          >
            {event.icon || event.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(event.status)}`}
          >
            {t(event.status)}
          </span>
        </div>

        {/* Public/Private indicator */}
        {event.isPublic !== undefined && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm border border-white/20">
              {event.isPublic ? t("publicEvent") : t("privateEvent")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-5 space-y-3">
        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-[#FF007A] transition-colors line-clamp-1">
          {event.name}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-[#a0a0a0] line-clamp-2">{event.description}</p>
        )}

        {/* Time info */}
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#a0a0a0]">
            <svg
              className="w-4 h-4 text-[#FF007A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(event.startTime)}</span>
          </div>

          {event.endTime && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#a0a0a0] text-xs">
              <svg
                className="w-4 h-4 text-[#7B2FF7]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formatDate(event.endTime)}</span>
            </div>
          )}
        </div>

        {/* Places */}
        {event.places && event.places.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.places.slice(0, 2).map((place, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 rtl:space-x-reverse text-xs bg-[#1e1e1e] px-3 py-1 rounded-full border border-[#333] text-[#a0a0a0]"
              >
                <svg
                  className="w-3 h-3 text-[#FF007A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="line-clamp-1">{place.name}</span>
              </div>
            ))}
            {event.places.length > 2 && (
              <div className="flex items-center text-xs text-[#FF007A]">
                +{event.places.length - 2} {t("locations")}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs rounded-md border border-[#333] text-[#a0a0a0] bg-[#1a1a1a]"
                style={{
                  borderColor: tag.color || undefined,
                  color: tag.color || undefined,
                }}
              >
                {tag.icon && <span className="mr-1">{tag.icon}</span>}
                {tag.name}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-md text-[#a0a0a0]">
                +{event.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between pt-3 border-t border-[#333]">
          {/* Price */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {event.ticketPrice ? (
              <span className="text-sm font-medium text-white">{event.ticketPrice}</span>
            ) : (
              <span className="text-sm font-medium text-green-400">{t("free")}</span>
            )}
          </div>

          {/* Registration indicator */}
          {event.registrationRequired && (
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-[#FF007A]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>{t("registrationRequired")}</span>
            </div>
          )}
        </div>

        {/* Organizer */}
        {event.organizer && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-[#a0a0a0] pt-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>
              {t("organizer")}: {event.organizer.first_name} {event.organizer.last_name}
            </span>
          </div>
        )}
      </div>

      {/* Hover effect accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF007A] to-[#7B2FF7] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
}
