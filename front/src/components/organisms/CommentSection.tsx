"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import NeonButton from "../atoms/NeonButton";
import CommentForm from "../molecules/CommentForm";
import CommentList from "./CommentList";
import { commentSchema, userSchema } from "@/types/declarations/selectInp";
import {
  addComment as createComment,
  getComments,
} from "@/app/actions/comment";

// Define a minimal comment type that picks only the fields CommentSection needs from commentSchema
// Using Pick to extract specific fields and creating subtypes for nested objects
// Note: Extending with optional place property for flexibility when passed from parent components
export type MinimalComment = {
  _id: commentSchema["_id"];
  text: commentSchema["text"];
  rating: commentSchema["rating"];
  status: commentSchema["status"];
  is_anonymous: commentSchema["is_anonymous"];
  createdAt: commentSchema["createdAt"];
  updatedAt: commentSchema["updatedAt"];
  user: Pick<
    userSchema,
    | "_id"
    | "first_name"
    | "last_name"
    | "email"
    | "level"
    | "is_verified"
    | "avatar"
  >;
} & {
  place?: Pick<
    commentSchema["place"],
    | "_id"
    | "name"
    | "description"
    | "slug"
    | "center"
    | "area"
    | "address"
    | "contact"
    | "hoursOfOperation"
    | "meta"
    | "status"
    | "createdAt"
    | "updatedAt"
  >;
}; // Allow optional place property when passed from parent components like PlaceDetailsModal

interface CommentSectionProps {
  placeId: string;
  placeComments?: MinimalComment[]; // Comments to be displayed (may include place info if passed from parent)
  userAvatar?: string | null;
  userName?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  placeId,
  placeComments = [],
  userAvatar,
  userName,
}) => {
  const t = useTranslations();
  const { isAuthenticated, user } = useAuth();

  // Ensure placeComments is always an array
  const normalizedPlaceComments = Array.isArray(placeComments)
    ? placeComments
    : [];

  const [comments, setComments] = useState<MinimalComment[]>(
    normalizedPlaceComments,
  ); // Start with embedded comments
  const [loading, setLoading] = useState(false); // Not loading initially since using embedded comments
  // No sorting functionality for now - will be implemented in future backend changes
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

        // Add the new comments to the existing ones, ensuring they match MinimalComment type
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
      // Type assertion to match MinimalComment type
      setComments((prev) => [result.data as MinimalComment, ...prev]);
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
      </div>

      <CommentForm
        onSubmit={handleAddComment}
        userAvatar={userAvatar}
        userName={userName}
        placeholder={t("Comments.placeholder")}
      />

      <div className="mt-6">
        <CommentList
          comments={comments}
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
