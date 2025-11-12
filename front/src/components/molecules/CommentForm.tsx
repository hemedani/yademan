import React, { useState } from "react";
import { useTranslations } from "next-intl";
import CommentAvatar from "../atoms/CommentAvatar";
import NeonInput from "../atoms/NeonInput";
import NeonButton from "../atoms/NeonButton";
import RatingInput from "../atoms/RatingInput";

interface CommentFormProps {
  onSubmit: (content: string, rating: number | null) => void;
  userAvatar?: string | null;
  userName?: string;
  placeholder?: string;
  className?: string;
}

interface NewCommentData {
  content: string;
  rating: number | null;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  userAvatar,
  userName = "Anonymous",
  placeholder,
  className = "",
}) => {
  const t = useTranslations();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content, rating);
      setContent("");
      setRating(null);
    }
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      <CommentAvatar src={userAvatar} alt={userName} />
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("Comments.ratingLabel")}
          </label>
          <RatingInput value={rating} onChange={setRating} />
        </div>
        <NeonInput
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder || t("Comments.writeComment")}
          rows={3}
          className="mb-2"
        />
        <div className="flex justify-end">
          <NeonButton type="submit" variant="primary">
            {t("Comments.postComment")}
          </NeonButton>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
