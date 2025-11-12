"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CommentCard from "../molecules/CommentCard";
import { commentSchema } from "@/types/declarations/selectInp";

interface CommentListProps {
  comments: commentSchema[];
  currentUserAvatar?: string | null;
  currentUserName?: string;
  onLike?: (id: string) => void;
  onReply?: (parentId: string, content: string, rating: number | null) => void;
  loading?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  currentUserAvatar,
  currentUserName,
  onLike,
  onReply,
  loading = false,
}) => {
  const t = useTranslations();

  // Ensure comments is always an array
  const commentsArray = Array.isArray(comments) ? comments : [];

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#1e1e1e] rounded-lg p-4 mb-3 border border-[#333]"
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (commentsArray.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">{t("Comments.noComments")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {commentsArray
        .filter((comment) => comment && comment._id)
        .map((comment) => (
          <CommentCard
            key={comment._id}
            id={comment._id}
            avatar={
              comment.user?.avatar?.name
                ? `/uploads/images/${comment.user.avatar.name}`
                : undefined
            }
            userName={
              `${comment.user?.first_name || ""} ${comment.user?.last_name || ""}`.trim() ||
              t("Comments.anonymous")
            }
            content={comment.text}
            rating={comment.rating}
            timestamp={new Date(comment.createdAt).toLocaleDateString()}
            likes={0} // The schema doesn't have a direct likes count
            onLike={onLike}
            onReply={onReply}
            currentUserAvatar={currentUserAvatar}
            currentUserName={currentUserName}
            replies={[]} // The schema doesn't currently support nested replies
          />
        ))}
    </div>
  );
};

export default CommentList;
