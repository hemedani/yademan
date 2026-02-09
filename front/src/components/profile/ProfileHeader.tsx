"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ProfileHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    level: string;
    joinDate: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const t = useTranslations("Profile");

  const defaultUser = {
    name: "کاربر تست",
    email: "test@example.com",
    avatar: undefined,
    level: "کاربر عادی",
    joinDate: "۱۴۰۳/۰۱/۰۱",
  };

  const userData = user || defaultUser;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {userData.avatar ? (
            <Image
              className="h-20 w-20 rounded-full object-cover"
              src={userData.avatar}
              alt={userData.name}
              width={80}
              height={80}
              unoptimized={true}
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{userData.name}</h1>
          <p className="text-sm text-gray-500">{userData.email}</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{userData.level}</span>
            <span>عضو از: {userData.joinDate}</span>
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex-shrink-0">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            ویرایش پروفایل
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
