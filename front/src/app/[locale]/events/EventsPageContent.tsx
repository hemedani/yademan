"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { eventSchema, ReqType } from "@/types/declarations/selectInp";
import { gets as getEvents } from "@/app/actions/event/gets";
import EventCard from "@/components/events/EventCard";
import EventFilters from "@/components/events/EventFilters";

export default function EventsPageContent() {
  const t = useTranslations("Events");
  const tCommon = useTranslations("Common");
  const params = useParams();
  const locale = params.locale as string;

  const [events, setEvents] = useState<eventSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [sortBy, setSortBy] = useState<"date" | "_id">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const ITEMS_PER_PAGE = 12;

  // Fetch events
  const fetchEvents = useCallback(
    async (currentPage: number, currentFilters: any, append = false) => {
      try {
        setLoading(true);
        setError(null);

        // Build the query
        const query: ReqType["main"]["event"]["gets"] = {
          set: {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          },
          get: {
            data: {
              _id: 1,
              name: 1,
              description: 1,
              startTime: 1,
              endTime: 1,
              color: 1,
              icon: 1,
              status: 1,
              isPublic: 1,
              ticketPrice: 1,
              registrationRequired: 1,
              maxAttendees: 1,
              capacity: 1,
              places: {
                _id: 1,
                name: 1,
                center: 1,
              },
              organizer: {
                _id: 1,
                first_name: 1,
                last_name: 1,
              },
              tags: {
                _id: 1,
                name: 1,
                color: 1,
                icon: 1,
              },
              thumbnail: {
                _id: 1,
                name: 1,
                alt_text: 1,
              },
            },
            metadata: {
              total: 1,
              page: 1,
              limit: 1,
              pageCount: 1,
            },
          },
        };

        // Apply filters
        if (currentFilters.status) {
          query.set.status = currentFilters.status;
        }

        if (currentFilters.tagIds && currentFilters.tagIds.length > 0) {
          query.set.tagIds = currentFilters.tagIds;
        }

        if (currentFilters.isPublic !== undefined) {
          query.set.isPublic = currentFilters.isPublic;
        }

        if (currentFilters.startTimeAfter) {
          query.set.startTimeAfter = currentFilters.startTimeAfter;
        }

        if (currentFilters.endTimeBefore) {
          query.set.endTimeBefore = currentFilters.endTimeBefore;
        }

        if (currentFilters.name) {
          query.set.name = currentFilters.name;
        }

        // Sort
        if (sortBy === "date") {
          query.set.sort = { startTime: sortOrder === "asc" ? 1 : -1 };
        } else if (sortBy === "_id") {
          query.set.sort = { _id: sortOrder === "asc" ? 1 : -1 };
        }

        const response = await getEvents({
          set: query.set,
          get: query.get,
        });

        if (response.success && response.body?.data) {
          const { data, metadata } = response.body;

          if (append) {
            setEvents((prev) => [...prev, ...data]);
          } else {
            setEvents(data);
          }

          // Use metadata for accurate pagination
          if (metadata) {
            setTotalCount(metadata.total || 0);
            setPageCount(metadata.pageCount || 0);
            setHasMore(currentPage < (metadata.pageCount || 0));
          } else {
            // Fallback if metadata not provided
            setHasMore(data.length === ITEMS_PER_PAGE);
          }
        } else {
          setError(response.body?.message || t("fetchError"));
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    },
    [sortBy, sortOrder, t, ITEMS_PER_PAGE],
  );

  // Initial load
  useEffect(() => {
    fetchEvents(1, filters);
  }, [fetchEvents, filters]);

  // Handle filter change
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1);
    fetchEvents(1, newFilters);
    setShowFilters(false);
  };

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage, filters, true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-transparent backdrop-blur-xl border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back to Home Link */}
          <div className="mb-4">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse text-[#a0a0a0] hover:text-white transition-colors group"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm font-medium">{t("backToHome")}</span>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF007A] to-[#7B2FF7] flex items-center justify-center shadow-lg shadow-[#FF007A]/30">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#a0a0a0] bg-clip-text text-transparent">
                  {t("title")}
                </h1>
                <p className="text-sm text-[#a0a0a0] mt-1">
                  {events.length > 0 ? t("eventsFound", { count: events.length }) : t("noEvents")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* Sort */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-2">
                <span className="text-sm text-[#a0a0a0]">{t("sortBy")}:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-");
                    setSortBy(newSortBy as "date" | "_id");
                    setSortOrder(newSortOrder as "asc" | "desc");
                  }}
                  className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
                >
                  <option value="date-asc">{t("sortByOldest")}</option>
                  <option value="date-desc">{t("sortByNewest")}</option>
                  <option value="_id-asc">{t("sortByIdAsc")}</option>
                  <option value="_id-desc">{t("sortByIdDesc")}</option>
                </select>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  showFilters
                    ? "bg-gradient-to-r from-[#FF007A] to-[#7B2FF7] text-white shadow-lg shadow-[#FF007A]/50"
                    : "bg-[#1a1a1a] border border-[#333] text-[#a0a0a0] hover:border-[#FF007A] hover:text-white"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span>{t("filters")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <EventFilters
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
              isOpen={showFilters}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading && events.length === 0 ? (
          /* Loading State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-[#1a1a1a] border border-[#333] rounded-2xl overflow-hidden"
              >
                <div className="h-48 bg-[#222]" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-[#222] rounded" />
                  <div className="h-4 bg-[#222] rounded w-3/4" />
                  <div className="h-4 bg-[#222] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
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
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{error}</h3>
            <button
              onClick={() => fetchEvents(1, filters)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-[#FF007A] to-[#7B2FF7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#FF007A]/50 transition-all duration-300"
            >
              {tCommon("retry")}
            </button>
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-dashed border-[#333]">
              <svg
                className="w-12 h-12 text-[#666]"
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
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">{t("noEvents")}</h3>
            <p className="text-[#a0a0a0] mb-6">Try adjusting your filters or check back later</p>
            <button
              onClick={() => handleFilterChange({})}
              className="px-6 py-3 bg-[#1a1a1a] border border-[#333] text-white rounded-xl font-medium hover:border-[#FF007A] transition-all duration-300"
            >
              {t("resetFilters")}
            </button>
          </div>
        ) : (
          /* Events Grid */
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EventCard event={event} locale={locale} />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More */}
            {hasMore && !loading && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF007A] to-[#7B2FF7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#FF007A]/50 transition-all duration-300 transform hover:scale-105"
                >
                  {t("loadMore")}
                </button>
              </div>
            )}

            {/* Loading more indicator */}
            {loading && events.length > 0 && (
              <div className="mt-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF007A]"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
