import React from "react";
import {
  EditIcon,
  HideIcon,
  TrashIcon,
  UpdateIcon,
} from "@/components/atoms/Icons";
import { useRouter } from "next/navigation";

interface UserCardProps {
  id: string;
  first_name: string;
  last_name: string;
  national_number: string;
  onDelete: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  first_name,
  last_name,
  national_number,
  onDelete,
}) => {
  const router = useRouter();
  return (
    <div className="border border-gray-700 w-full max-w-lg bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-4">
      <div className="w-24 h-24 flex-shrink-0">
        <div className="w-full h-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center rounded-full text-white text-2xl font-semibold">
          {first_name[0]} {last_name[0]}
        </div>
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-white">
          {first_name} {last_name}
        </h2>
        <p className="text-gray-400 text-sm mt-1">{national_number}</p>
      </div>
      <div className="flex flex-col gap-2">
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 bg-red-900/30 text-red-400 border border-red-800 rounded-full hover:bg-red-800/50 transition-all duration-200 shadow shadow-red-500/20"
            title="حذف"
          >
            <TrashIcon />
          </button>
        )}
        <button
          onClick={() => router.push(`/admin/users/edit/pure/${id}`)}
          className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-all duration-200 shadow shadow-gray-500/20"
          title="ویرایش"
        >
          <UpdateIcon />
        </button>
        <button
          onClick={() => router.push(`/admin/users/edit/relation/${id}`)}
          className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-all duration-200 shadow shadow-gray-500/20"
          title="ویرایش"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => router.push(`/admin/users/user/${id}`)}
          className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-all duration-200 shadow shadow-gray-500/20"
          title="مشاهده جزئیات"
        >
          <HideIcon />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
