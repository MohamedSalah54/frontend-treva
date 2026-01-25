"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useAuthStore } from "@/src/store/auth.store";
import { AssignedUser } from "@/src/types/task";
type MongoDate = { $date: string };

interface UserHeaderProps {
  assignedUserId: AssignedUser;
  createdAt?: string | Date | MongoDate;
}

export default function UserHeader({
  assignedUserId,
  createdAt,
}: UserHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const currentUser =
    typeof assignedUserId === "string" ? undefined : assignedUserId;

  const initials = `${currentUser?.firstName?.charAt(0) || ""}${
    currentUser?.lastName?.charAt(0) || ""
  }`;

  const hasImage = !!currentUser?.profileImage?.secure_url;

  let displayDate: string;
  try {
    displayDate = createdAt
      ? new Date(
          typeof createdAt === "string"
            ? createdAt
            : // : createdAt.$date || createdAt,

              "$date" in createdAt
              ? createdAt.$date
              : createdAt,
        ).toLocaleDateString()
      : "No date";
  } catch (err) {
    displayDate = "No date";
  }

  // Dynamic profile link logic
  // const profileLink =
  //   user?._id === assignedUserId._id
  //     ? "/profile"
  //     : `/profile/${assignedUserId._id}`;
  const assignedId =
    typeof assignedUserId === "string" ? assignedUserId : assignedUserId._id;

  const profileLink =
    user?.sub === assignedId ? "/profile" : `/profile/${assignedId}`;

  return (
    <div className="flex items-center gap-3 p-4">
      {/* Avatar */}
      <Link href={profileLink} onClick={(e) => e.stopPropagation()}>
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 cursor-pointer">
          {hasImage ? (
            <Image
              src={currentUser.profileImage!.secure_url}
              alt={`${currentUser?.firstName || "User"} ${
                currentUser?.lastName || ""
              }`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-sky-600 text-white font-bold text-lg">
              {initials || "?"}
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1">
        <p className="font-semibold leading-none">
          {currentUser?.firstName || "User"} {currentUser?.lastName || ""}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Clock size={12} />
          {displayDate}
        </p>
      </div>
    </div>
  );
}
