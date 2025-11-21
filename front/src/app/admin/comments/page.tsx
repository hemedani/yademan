"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { AppApi } from "@/services/api";
import Cookies from "js-cookie";

interface Comment {
  _id: string;
  text: string;
  rating?: number;
  status: "pending" | "approved" | "rejected";
  is_anonymous: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  place: {
    _id: string;
    name: string;
  };
}

interface CommentFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const CommentsManagement: React.FC = () => {
  const {} = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Filters
  const [filters, setFilters] = useState<CommentFilters>({
    search: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const formatPersianNumber = useCallback((num: number): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
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
      case "approved":
        return "bg-green-900/30 text-green-400 border-green-800";
      case "rejected":
        return "bg-red-900/30 text-red-400 border-red-800";
      default:
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800";
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case "approved":
        return "تایید شده";
      case "rejected":
        return "رد شده";
      default:
        return "در انتظار بررسی";
    }
  }, []);

  const renderStars = useCallback(
    (rating?: number) => {
      if (!rating) return null;

      return (
        <div className="flex items-center  space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= rating ? "text-yellow-400" : "text-gray-500"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-sm text-gray-400 mr-2">
            {formatPersianNumber(rating)}
          </span>
        </div>
      );
    },
    [formatPersianNumber],
  );

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from cookies
      const token =
        typeof window !== "undefined"
          ? Cookies.get("token") || undefined
          : undefined;
      const api = AppApi(undefined, token);

      const response = await api.send({
        service: "main",
        model: "comment",
        act: "gets",
        details: {
          set: {
            page: currentPage,
            limit: itemsPerPage,
            text: filters.search || undefined,
            status: filters.status || undefined,
            rating: undefined, // We're not filtering by rating in the UI
            is_anonymous: undefined, // We're not filtering by anonymous status in the UI
            place: undefined, // We're not filtering by place in the UI
            user: undefined, // We're not filtering by user in the UI
          },
          get: {
            _id: 1,
            text: 1,
            rating: 1,
            status: 1,
            is_anonymous: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              email: 1,
            },
            place: {
              _id: 1,
              name: 1,
            },
          },
        },
      });

      if (response.success && response.body) {
        // The response for gets operation in Lesan may have different structure depending on implementation
        // If it has data and metadata (paginated), use that; otherwise use the body directly
        if ("data" in response.body && "metadata" in response.body) {
          setComments(response.body.data || []);
          setTotalPages(response.body.metadata?.pageCount || 1);
        } else {
          // If response has direct structure (non-paginated), use it directly
          setComments(response.body || []);
          setTotalPages(1); // Only one page if no pagination
        }
      } else {
        setError("خطا در بارگذاری نظرات");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  // Update comment status
  const handleStatusChange = async (commentId: string, newStatus: string) => {
    try {
      setActionLoading(commentId);
      // Get token from cookies
      const token =
        typeof window !== "undefined"
          ? Cookies.get("token") || undefined
          : undefined;
      const api = AppApi(undefined, token);

      const response = await api.send({
        service: "main",
        model: "comment",
        act: "update",
        details: {
          set: {
            _id: commentId,
            status: newStatus as "pending" | "approved" | "rejected",
          },
          get: {
            _id: 1,
            text: 1,
            rating: 1,
            status: 1,
            is_anonymous: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              email: 1,
            },
            place: {
              _id: 1,
              name: 1,
            },
          },
        },
      });

      if (response.success && response.body) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...response.body,
                  is_anonymous: comment.is_anonymous, // Preserve is_anonymous from the original since it might not be in the update response
                }
              : comment,
          ),
        );
      } else {
        setError("خطا در تغییر وضعیت نظر");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      console.error("Error updating comment status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!commentId) return;

    try {
      setActionLoading(commentId);
      // Get token from cookies
      const token =
        typeof window !== "undefined"
          ? Cookies.get("token") || undefined
          : undefined;
      const api = AppApi(undefined, token);

      const response = await api.send({
        service: "main",
        model: "comment",
        act: "remove",
        details: {
          set: { _id: commentId },
          get: {
            success: 1,
          },
        },
      });

      if (response.success && response.body?.success) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId),
        );
        setShowDeleteModal(false);
        setSelectedComment(null);
      } else {
        setError("خطا در حذف نظر");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      console.error("Error deleting comment:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = useCallback(
    (key: keyof CommentFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    [],
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  if (loading && comments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-500/30 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              در حال بارگذاری نظرات
            </h2>
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
              مدیریت نظرات
            </h1>
            <p className="text-gray-400 text-lg">
              بررسی و مدیریت نظرات کاربران
            </p>
            <div className="flex items-center  space-x-4 text-sm text-gray-500">
              <span>مجموع {formatPersianNumber(comments.length)} نظر</span>
              <span>•</span>
              <span>
                صفحه {formatPersianNumber(currentPage)} از{" "}
                {formatPersianNumber(totalPages)}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
              <div className="text-2xl font-bold text-green-400">
                {formatPersianNumber(
                  comments.filter((c) => c.status === "approved").length,
                )}
              </div>
              <div className="text-sm text-green-300 font-medium">
                تایید شده
              </div>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
              <div className="text-2xl font-bold text-yellow-400">
                {formatPersianNumber(
                  comments.filter((c) => c.status === "pending").length,
                )}
              </div>
              <div className="text-sm text-yellow-300 font-medium">
                در انتظار
              </div>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
              <div className="text-2xl font-bold text-red-400">
                {formatPersianNumber(
                  comments.filter((c) => c.status === "rejected").length,
                )}
              </div>
              <div className="text-sm text-red-300 font-medium">رد شده</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              جستجو
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
              placeholder="جستجو در نظرات..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              وضعیت
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
            >
              <option value="" className="bg-gray-700">
                همه
              </option>
              <option value="pending" className="bg-gray-700">
                در انتظار بررسی
              </option>
              <option value="approved" className="bg-gray-700">
                تایید شده
              </option>
              <option value="rejected" className="bg-gray-700">
                رد شده
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              مرتب‌سازی
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
            >
              <option value="createdAt" className="bg-gray-700">
                تاریخ ایجاد
              </option>
              <option value="updatedAt" className="bg-gray-700">
                تاریخ آپدیت
              </option>
              <option value="rating" className="bg-gray-700">
                امتیاز
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ترتیب
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFilterChange(
                  "sortOrder",
                  e.target.value as "asc" | "desc",
                )
              }
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
            >
              <option value="desc" className="bg-gray-700">
                نزولی
              </option>
              <option value="asc" className="bg-gray-700">
                صعودی
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
              className="w-5 h-5 text-red-400"
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

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              نظری یافت نشد
            </h3>
            <p className="text-gray-400">
              هیچ نظری با فیلترهای انتخابی شما یافت نشد.
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700"
            >
              <div className="p-6">
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start  space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {comment.user.first_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center  space-x-2 mb-1">
                        <h3 className="font-semibold text-white">
                          {comment.user.first_name} {comment.user.last_name}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {formatPersianDate(comment.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center  space-x-2 text-sm text-gray-500">
                        <span>مکان: {comment.place.name}</span>
                        {comment.rating && (
                          <>
                            <span>•</span>
                            {renderStars(comment.rating)}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      comment.status,
                    )}`}
                  >
                    {getStatusText(comment.status)}
                  </span>
                </div>

                {/* Comment Text */}
                <div className="mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    {comment.text}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center  space-x-2">
                    {comment.status !== "approved" && (
                      <button
                        onClick={() =>
                          handleStatusChange(comment._id, "approved")
                        }
                        disabled={actionLoading === comment._id}
                        className="px-4 py-2 bg-green-900/30 text-green-400 border border-green-800 rounded-lg hover:bg-green-800/50 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        تایید
                      </button>
                    )}

                    {comment.status !== "rejected" && (
                      <button
                        onClick={() =>
                          handleStatusChange(comment._id, "rejected")
                        }
                        disabled={actionLoading === comment._id}
                        className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-800 rounded-lg hover:bg-red-800/50 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        رد
                      </button>
                    )}

                    {comment.status !== "pending" && (
                      <button
                        onClick={() =>
                          handleStatusChange(comment._id, "pending")
                        }
                        disabled={actionLoading === comment._id}
                        className="px-4 py-2 bg-yellow-900/30 text-yellow-400 border border-yellow-800 rounded-lg hover:bg-yellow-800/50 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        در انتظار
                      </button>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      setSelectedComment(comment);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors"
                    title="حذف نظر"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  {actionLoading === comment._id && (
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                ),
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              بعدی
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedComment && (
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

              <h3 className="text-lg font-semibold text-white text-center mb-2">
                حذف نظر
              </h3>
              <p className="text-gray-400 text-center mb-6">
                آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟ این عمل قابل
                بازگشت نیست.
              </p>

              <div className="flex justify-center  space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedComment(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={() => handleDeleteComment(selectedComment._id)}
                  disabled={actionLoading === selectedComment._id}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === selectedComment._id
                    ? "در حال حذف..."
                    : "حذف نظر"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsManagement;
