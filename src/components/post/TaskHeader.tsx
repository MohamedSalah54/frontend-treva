"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useAuthStore } from "@/src/store/auth.store";

interface TaskHeaderProps {
  createdBy: {
    _id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: {
      secure_url: string;
      public_id?: string;
    };
  };
  createdAt: string;
}

// Component
export default function TaskHeader({ createdBy, createdAt }: TaskHeaderProps) {
  const user = useAuthStore((state) => state.user);

  const initials = `${createdBy?.firstName?.charAt(0) || ""}${
    createdBy?.lastName?.charAt(0) || ""
  }`;

  const hasImage = !!createdBy?.profileImage?.secure_url;

  // Dynamic profile link logic
  const profileLink =
    user?.sub === createdBy._id ? "/profile" : `/profile/${createdBy._id}`;

  return (
    <div className="flex items-center gap-3 p-4">
      {/* Avatar */}
      <Link href={profileLink} onClick={(e) => e.stopPropagation()}>
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 cursor-pointer">
          {hasImage ? (
            <Image
              src={createdBy.profileImage!.secure_url}
              alt={`${createdBy?.firstName || "User"} ${createdBy?.lastName || ""}`}
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
          {createdBy?.firstName || "مجهول"} {createdBy?.lastName || ""}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Clock size={12} />
          {createdAt
            ? new Date(createdAt).toLocaleDateString()
            : "لا يوجد تاريخ"}
        </p>
      </div>
    </div>
  );
}
