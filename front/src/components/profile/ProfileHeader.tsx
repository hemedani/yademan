"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import EditProfileModal from "./EditProfileModal";

interface ProfileHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    level: string;
    joinDate: string;
  };
}

const roleLabelMap: Record<string, { label: string; color: string }> = {
  admin: { label: "مدیر", color: "from-[#FF007A] to-[#A020F0]" },
  moderator: { label: "ویراستار", color: "from-[#A020F0] to-[#7B2FF7]" },
  user: { label: "کاربر عادی", color: "from-[#00ff85] to-[#00cc6a]" },
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { user: authUser, refreshUserData } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const defaultUser = {
    name: "کاربر یادمان",
    email: "user@yademan.ir",
    avatar: undefined,
    level: "user",
    joinDate: new Date().toISOString(),
  };

  const userData = user || defaultUser;
  const roleInfo = roleLabelMap[userData.level] ?? roleLabelMap.user;

  // Prefer live authUser data so the header reflects edits immediately after
  // refreshUserData() resolves, without requiring a full page reload.
  const displayName = authUser ? `${authUser.first_name} ${authUser.last_name}`.trim() : userData.name;

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = new Date(userData.joinDate).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const userId = authUser?._id ?? "";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-[#121212] border border-[#333] rounded-2xl overflow-hidden"
      >
        {/* Top gradient banner */}
        <div className="h-24 bg-gradient-to-r from-[#FF007A]/20 via-[#A020F0]/15 to-[#121212]" />

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="relative shrink-0">
                {userData.avatar ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#333] shadow-xl">
                    <Image
                      src={userData.avatar}
                      alt={userData.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF007A] to-[#A020F0] flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-[#FF007A]/20 border-2 border-[#333]">
                    {initials}
                  </div>
                )}
                {/* Online indicator */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00ff85] rounded-full border-2 border-[#121212]" />
              </div>

              {/* Name & email */}
              <div className="pb-1">
                <h2 className="text-xl font-bold text-white leading-tight">{displayName}</h2>
                <p className="text-sm text-[#a0a0a0] mt-0.5">{userData.email}</p>
                {/* Role badge */}
                <span
                  className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${roleInfo.color}`}
                >
                  {roleInfo.label}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:pb-1">
              {/* Join date */}
              <div className="flex items-center gap-1.5 text-xs text-[#a0a0a0]">
                <svg
                  className="w-4 h-4 shrink-0"
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
                <span>عضو از {formattedDate}</span>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e1e1e] border border-[#333] text-sm text-[#a0a0a0] hover:border-[#FF007A] hover:text-white transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                ویرایش پروفایل
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-3 divide-x divide-x-reverse divide-[#333] border border-[#333] rounded-xl overflow-hidden">
            {[
              {
                label: "بازدیدها",
                value: "۱۲",
                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
              },
              {
                label: "علاقه‌مندی‌ها",
                value: "۲۵",
                icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
              },
              {
                label: "نظرات",
                value: "۸",
                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
              },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="flex flex-col items-center py-4 bg-[#1a1a1a] hover:bg-[#1e1e1e] transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[#FF007A] mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                <span className="text-lg font-bold text-white">{value}</span>
                <span className="text-xs text-[#a0a0a0]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userId={userId}
        onSuccess={refreshUserData}
      />
    </>
  );
};

export default ProfileHeader;
