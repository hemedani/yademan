import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CommentAvatar from "../atoms/CommentAvatar";
import NeonButton from "../atoms/NeonButton";
import CommentForm from "./CommentForm";
import RatingInput from "../atoms/RatingInput";

interface CommentCardProps {
  id: string;
  avatar?: string | null;
  userName: string;
  content: string;
  timestamp: string;
  rating?: number;
  likes?: number;
  onLike?: (id: string) => void;
  onReply?: (id: string, content: string, rating: number | null) => void;
  currentUserAvatar?: string | null;
  currentUserName?: string;
  replies?: CommentCardProps[];
  depth?: number;
}

const CommentCard: React.FC<CommentCardProps> = ({
  id,
  avatar,
  userName,
  content,
  timestamp,
  rating,
  likes = 0,
  onLike,
  onReply,
  currentUserAvatar,
  currentUserName,
  replies = [],
  depth = 0,
}) => {
  const t = useTranslations();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = (content: string, rating: number | null) => {
    if (onReply) {
      onReply(id, content, rating);
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  // Maximum depth of 2 for replies
  const canReply = depth < 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#1e1e1e] rounded-lg p-4 mb-3 border border-[#333] ${depth > 0 ? "ml-6 border-l-2 border-[#FF007A]" : ""}`}
    >
      <div className="flex gap-3">
        <CommentAvatar src={avatar} alt={userName} glow={depth === 0} />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-white">{userName}</h4>
              <p className="text-xs text-gray-400">{timestamp}</p>
              {rating !== undefined && rating !== null && (
                <div className="mt-1">
                  <RatingInput value={rating} max={5} size="sm" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={() => onLike && onLike(id)}
                className="text-xs"
              >
                ❤️ {likes}
              </NeonButton>
              {canReply && (
                <NeonButton
                  variant="ghost"
                  size="sm"
                  onClick={handleReplyClick}
                  className="text-xs"
                >
                  {showReplyForm ? t("Common.cancel") : t("Comments.reply")}
                </NeonButton>
              )}
            </div>
          </div>
          <p className="text-gray-200 mt-2">{content}</p>

          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReply}
                userAvatar={currentUserAvatar}
                userName={currentUserName}
                placeholder={t("Comments.replyPlaceholder", { userName })}
              />
            </div>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="mt-4">
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              {...reply}
              depth={depth + 1}
              currentUserAvatar={currentUserAvatar}
              currentUserName={currentUserName}
              onLike={onLike}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CommentCard;
