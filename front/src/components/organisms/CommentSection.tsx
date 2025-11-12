"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import NeonButton from "../atoms/NeonButton";
import CommentForm from "../molecules/CommentForm";
import CommentList from "./CommentList";
import { commentSchema } from "@/types/declarations/selectInp";
import {
  addComment as createComment,
  getComments,
} from "@/app/actions/comment";

interface CommentSectionProps {
  placeId: string;
  placeComments?: commentSchema[]; // Comments embedded in the place
  userAvatar?: string | null;
  userName?: string;
  initialComments?: commentSchema[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  placeId,
  placeComments = [],
  userAvatar,
  userName,
  initialComments = [],
}) => {
  const t = useTranslations();
  const { isAuthenticated, user } = useAuth();

  // Ensure placeComments is always an array
  const normalizedPlaceComments = Array.isArray(placeComments)
    ? placeComments
    : [];

  const [comments, setComments] = useState<commentSchema[]>(
    normalizedPlaceComments,
  ); // Start with embedded comments
  const [loading, setLoading] = useState(false); // Not loading initially since using embedded comments
  const [sortOption, setSortOption] = useState<"recent" | "popular">("recent");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Load more comments when user clicks load more (not on initial render)
  useEffect(() => {
    if (page === 1) return; // Don't fetch on initial load (page 1 is the initial state), only when user wants more

    const fetchMoreComments = async () => {
      try {
        setLoading(true);
        const result = await getComments({
          set: {
            place: placeId, // Use 'place' to filter by placeId as per user requirement
            page: page, // Include page for pagination
            limit: 20, // Set a reasonable limit
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
              level: 1,
              is_verified: 1,
              avatar: {
                _id: 1,
                name: 1,
                mimType: 1,
                size: 1,
                alt_text: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          },
        });

        // Add the new comments to the existing ones
        setComments((prev) => [...prev, ...(result.data || [])]);
      } catch (error) {
        console.error("Failed to fetch more comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoreComments();
  }, [placeId, page]);

  const handleAddComment = async (content: string, rating: number | null) => {
    if (!isAuthenticated) {
      toast.error(t("Comments.loginRequired"));
      return;
    }

    try {
      const result = await createComment({
        text: content,
        rating: rating || undefined, // Pass undefined if rating is null
        placeId: placeId,
        is_anonymous: false, // Set according to user preference
      });
      // Optimistically update the UI by adding the new comment at the beginning
      setComments((prev) => [result.data, ...prev]);
      toast.success(t("Comments.commentAdded"));
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error(t("Comments.addCommentError"));
    }
  };

  const handleLike = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.error(t("Comments.loginRequired"));
      return;
    }

    // In a real implementation, you would update the comment or add to a like model
    // For now, optimistically update the UI without backend call
    // In a real Lesan system, likes might be handled through a separate endpoint or by updating a field
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? { ...comment } // We'll update this when we have real backend support
          : comment,
      ),
    );

    // Show user feedback
    toast.success(t("Comments.likeSuccess"));
  };

  const handleReply = async (
    parentId: string,
    content: string,
    rating: number | null,
  ) => {
    if (!isAuthenticated) {
      toast.error(t("Comments.loginRequired"));
      return;
    }

    // For now, replies are not supported in the backend schema
    // In a real implementation, you would create a new comment with a reference to the parent
    toast.error(t("Comments.replyNotSupported"));
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOption === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Note: The schema doesn't have a direct likes count, so we're using a mock value
      return (b.likesCount || 0) - (a.likesCount || 0);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 border-t border-[#333] pt-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[#FF007A]">
          {t("Comments.title", { count: comments.length })}
        </h3>
        <div className="flex gap-2">
          <NeonButton
            variant={sortOption === "recent" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSortOption("recent")}
          >
            {t("Comments.recent")}
          </NeonButton>
          <NeonButton
            variant={sortOption === "popular" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSortOption("popular")}
          >
            {t("Comments.popular")}
          </NeonButton>
        </div>
      </div>

      <CommentForm
        onSubmit={handleAddComment}
        userAvatar={userAvatar}
        userName={userName}
        placeholder={t("Comments.placeholder")}
      />

      <div className="mt-6">
        <CommentList
          comments={sortedComments}
          currentUserAvatar={userAvatar}
          currentUserName={userName}
          onLike={handleLike}
          onReply={handleReply}
          loading={loading}
        />
      </div>

      {hasMore && !loading && (
        <div className="flex justify-center mt-4">
          <NeonButton onClick={loadMore} variant="secondary">
            {t("Comments.loadMore")}
          </NeonButton>
        </div>
      )}
    </motion.div>
  );
};

export default CommentSection;
