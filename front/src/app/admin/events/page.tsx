"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { AppApi } from "@/services/api";
import Cookies from "js-cookie";
import Link from "next/link";
import { eventSchema } from "@/types/declarations/selectInp";

type Event = eventSchema;

interface EventFilters {
  search: string;
  status: string;
  isPublic: string;
  placeId?: string;
}

const EventsManagement: React.FC = () => {
  const { userLevel } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Filters
  const [filters, setFilters] = useState<EventFilters>({
    search: "",
    status: "",
    isPublic: "",
  });

  const formatPersianNumber = useCallback((num: number): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  }, []);

  const formatPersianDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tehran",
    }).format(date);
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "published":
        return "bg-green-900/30 text-green-400 border-green-800";
      case "draft":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800";
      case "archived":
        return "bg-gray-700 text-gray-400 border-gray-600";
      case "cancelled":
        return "bg-red-900/30 text-red-400 border-red-800";
      default:
        return "bg-gray-700 text-gray-400 border-gray-600";
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case "published":
        return "منتشر شده";
      case "draft":
        return "پیش نویس";
      case "archived":
        return "بایگانی شده";
      case "cancelled":
        return "لغو شده";
      default:
        return status;
    }
  }, []);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from cookies
      const token = typeof window !== "undefined" ? Cookies.get("token") || undefined : undefined;
      const api = AppApi(undefined, token);

      const response = await api.send({
        service: "main",
        model: "event",
        act: "gets",
        details: {
          set: {
            page: currentPage,
            limit: itemsPerPage,
            name: filters.search || undefined,
            status: filters.status
              ? (filters.status as "draft" | "published" | "archived" | "cancelled")
              : undefined,
            isPublic: filters.isPublic === "" ? undefined : filters.isPublic === "true",
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
              capacity: 1,
              status: 1,
              isPublic: 1,
              ticketPrice: 1,
              registrationRequired: 1,
              maxAttendees: 1,
              eventUrl: 1,
              registrationUrl: 1,
              createdAt: 1,
              updatedAt: 1,
              registrar: {
                _id: 1,
                first_name: 1,
                last_name: 1,
                email: 1,
              },
              places: {
                _id: 1,
                name: 1,
              },
              organizer: {
                _id: 1,
                first_name: 1,
                last_name: 1,
                email: 1,
              },
            },
            metadata: {
              total: 1,
              page: 1,
              limit: 1,
              pageCount: 1,
            },
          },
        },
      });

      if (response.success && response.body) {
        // The response for gets operation in Lesan may have different structure depending on implementation
        // If it has data and metadata (paginated), use that; otherwise use the body directly
        if ("data" in response.body && "metadata" in response.body) {
          setEvents(response.body.data || []);
          setTotalPages(response.body.metadata?.pageCount || 1);
        } else {
          // If response has direct structure (non-paginated), use it directly
          setEvents(response.body || []);
          setTotalPages(1); // Only one page if no pagination
        }
      } else {
        setError("خطا در بارگذاری رویدادها");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  // Update event status
  const handleStatusChange = async (
    eventId: string,
    newStatus: "draft" | "published" | "archived" | "cancelled",
  ) => {
    try {
      setActionLoading(eventId);

      // Get token from cookies
      const token = typeof window !== "undefined" ? Cookies.get("token") || undefined : undefined;
      const api = AppApi(undefined, token);

      const response = await api.send({
        service: "main",
        model: "event",
        act: "update",
        details: {
          set: {
            _id: eventId,
            status: newStatus,
          },
          get: {
            _id: 1,
            name: 1,
            description: 1,
            startTime: 1,
            endTime: 1,
            color: 1,
            icon: 1,
            capacity: 1,
            status: 1,
            isPublic: 1,
            ticketPrice: 1,
            registrationRequired: 1,
            maxAttendees: 1,
            eventUrl: 1,
            registrationUrl: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      });

      if (response.success && response.body) {
        setEvents((prev) =>
          prev.map((event) => (event._id === eventId ? { ...response.body } : event)),
        );
      } else {
        setError("خطا در تغییر وضعیت رویداد");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      console.error("Error updating event status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (!eventId) return;

    try {
      setActionLoading(eventId);

      // Get token from cookies
      const token = typeof window !== "undefined" ? Cookies.get("token") || undefined : undefined;
      const api = AppApi(undefined, token);

      const response = await api.send({
        service: "main",
        model: "event",
        act: "remove",
        details: {
          set: { _id: eventId },
          get: {
            _id: 1,
          },
        },
      });

      if (response.success && response.body) {
        setEvents((prev) => prev.filter((event) => event._id !== eventId));
        setShowDeleteModal(false);
        setSelectedEvent(null);
      } else {
        setError("خطا در حذف رویداد");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      console.error("Error deleting event:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = useCallback((key: keyof EventFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-500/30 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">در حال بارگذاری رویدادها</h2>
            <p className="text-gray-400">لطفاً منتظر بمانید...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Page Header */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              مدیریت رویدادهای شهرداری
            </h1>
            <p className="text-gray-400 text-lg">بررسی و مدیریت رویدادهای شهری</p>
            <div className="flex items-center  space-x-4 text-sm text-gray-500">
              <span>مجموع {formatPersianNumber(events.length)} رویداد</span>
              <span>•</span>
              <span>
                صفحه {formatPersianNumber(currentPage)} از {formatPersianNumber(totalPages)}
              </span>
            </div>
          </div>

          {/* Add New Event Button */}
          {(userLevel === "Manager" || userLevel === "Editor" || userLevel === "Ghost") && (
            <Link
              href="/admin/events/create"
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg shadow-pink-500/30"
            >
              افزودن رویداد جدید
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">جستجو</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
              placeholder="جستجو در رویدادها..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">وضعیت</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
            >
              <option value="" className="bg-gray-700">
                همه
              </option>
              <option value="draft" className="bg-gray-700">
                پیش نویس
              </option>
              <option value="published" className="bg-gray-700">
                منتشر شده
              </option>
              <option value="archived" className="bg-gray-700">
                بایگانی شده
              </option>
              <option value="cancelled" className="bg-gray-700">
                لغو شده
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">عمومی</label>
            <select
              value={filters.isPublic}
              onChange={(e) => handleFilterChange("isPublic", e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
            >
              <option value="" className="bg-gray-700">
                همه
              </option>
              <option value="true" className="bg-gray-700">
                بله
              </option>
              <option value="false" className="bg-gray-700">
                خیر
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-2xl p-4">
          <div className="flex items-center  space-x-2">
            <svg
              className="w-5 h-5 text-red-500"
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
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-6">
        {events.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-700">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
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
            <h3 className="text-xl font-semibold text-white mb-2">رویدادی یافت نشد</h3>
            <p className="text-gray-400">هیچ رویدادی با فیلترهای انتخابی شما یافت نشد.</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700"
            >
              <div className="p-6">
                {/* Event Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center  space-x-4 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: event.color || "#8884d8" }}
                      ></div>
                      <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                    </div>

                    {event.description && <p className="text-gray-300 mb-3">{event.description}</p>}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div className="flex items-center  space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{formatPersianDate(event.startTime.toString())}</span>
                      </div>

                      <div className="flex items-center  space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>تا {formatPersianDate(event.endTime.toString())}</span>
                      </div>

                      {event.capacity && (
                        <div className="flex items-center  space-x-2">
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
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span>ظرفیت: {event.capacity}</span>
                        </div>
                      )}

                      {event.maxAttendees && (
                        <div className="flex items-center  space-x-2">
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
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                            />
                          </svg>
                          <span>حداکثر: {event.maxAttendees}</span>
                        </div>
                      )}
                    </div>

                    {event.registrar && (
                      <div className="mt-3 flex items-center  space-x-2 text-sm text-gray-400">
                        <span>ثبت شده توسط:</span>
                        <span className="font-medium text-gray-300">
                          {event.registrar.first_name} {event.registrar.last_name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        event.status,
                      )}`}
                    >
                      {getStatusText(event.status)}
                    </span>

                    <div className="flex items-center  space-x-2">
                      {(userLevel === "Manager" ||
                        userLevel === "Editor" ||
                        userLevel === "Ghost") && (
                        <Link
                          href={`/admin/events/edit/${event._id}`}
                          className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          ویرایش
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center  space-x-2">
                    {event.status !== "published" &&
                      (userLevel === "Manager" || userLevel === "Editor" || userLevel === "Ghost") && (
                        <button
                          onClick={() => handleStatusChange(event._id!, "published")}
                          disabled={actionLoading === event._id}
                          className="px-4 py-2 bg-green-900/30 text-green-400 border border-green-800 rounded-lg hover:bg-green-800/50 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          انتشار
                        </button>
                      )}

                    {event.status !== "draft" &&
                      (userLevel === "Manager" || userLevel === "Editor" || userLevel === "Ghost") && (
                        <button
                          onClick={() => handleStatusChange(event._id!, "draft")}
                          disabled={actionLoading === event._id}
                          className="px-4 py-2 bg-yellow-900/30 text-yellow-400 border border-yellow-800 rounded-lg hover:bg-yellow-800/50 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          پیش نویس
                        </button>
                      )}

                    {event.status !== "cancelled" &&
                      (userLevel === "Manager" || userLevel === "Editor" || userLevel === "Ghost") && (
                        <button
                          onClick={() => handleStatusChange(event._id!, "cancelled")}
                          disabled={actionLoading === event._id}
                          className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-800 rounded-lg hover:bg-red-800/50 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          لغو
                        </button>
                      )}
                  </div>

                  {/* Delete Button */}
                  {(userLevel === "Manager" || userLevel === "Editor" || userLevel === "Ghost") && (
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors"
                      title="حذف رویداد"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}

                  {actionLoading === event._id && (
                    <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center  space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              قبلی
            </button>

            <div className="flex items-center  space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-pink-600 text-white"
                      : "text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {formatPersianNumber(page)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              بعدی
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-900/30 rounded-full mb-4 border border-red-700">
                <svg
                  className="w-6 h-6 text-red-500"
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
              </div>

              <h3 className="text-lg font-semibold text-white text-center mb-2">حذف رویداد</h3>
              <p className="text-gray-400 text-center mb-6">
                آیا مطمئن هستید که می‌خواهید رویداد{" "}
                <span className="font-semibold">{selectedEvent.name}</span> را حذف کنید؟ این عمل قابل
                بازگشت نیست.
              </p>

              <div className="flex justify-center  space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={() => handleDeleteEvent(selectedEvent._id!)}
                  disabled={actionLoading === selectedEvent._id}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === selectedEvent._id ? "در حال حذف..." : "حذف رویداد"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;
