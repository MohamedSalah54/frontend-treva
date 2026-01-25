"use client";

import Image from "next/image";
import { Pencil, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import toast from "react-hot-toast";
import { updateMyProfile, uploadProfileImage } from "@/src/services/profile";

export default function ProfileImage() {
  const user = useAuthStore((state) => state.user);

  const [isUploading, setIsUploading] = useState(false);

  const first = user?.firstName?.trim()?.charAt(0) ?? "";
  const last = user?.lastName?.trim()?.charAt(0) ?? "";
  const initials = (first + last).toUpperCase();

  const hasImage =
    typeof user?.profileImage?.secure_url === "string" &&
    user.profileImage.secure_url.trim() !== "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const data = await uploadProfileImage(file);

      // if (data?.secure_url) {
      //   useAuthStore.setState((prev) => ({
      //     ...prev,
      //     user: {
      //       ...prev.user,
      //       profileImage: {
      //         secure_url: data.secure_url,
      //         public_id: data.public_id,
      //       },
      //     },
      //   }));

      if (data?.secure_url) {
        useAuthStore.setState((prev) => {
          if (!prev.user) return prev;
          return {
            ...prev,
            user: {
              ...prev.user,
              profileImage: {
                secure_url: data.secure_url,
                public_id: data.public_id,
              },
            },
          };
        });

        await updateMyProfile({
          profileImage: {
            secure_url: data.secure_url,
            public_id: data.public_id,
          },
        });

        toast.success("تم تحديث الصورة الشخصية");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "فشل في تحديث الصورة");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8 gap-3">
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[rgb(24,130,156)] shadow-lg bg-[rgb(24,130,156)] flex items-center justify-center">
        {hasImage && (
          <Image
            key={user?.profileImage?.secure_url}
            src={user!.profileImage!.secure_url!}
            alt="Profile Image"
            fill
            className="object-cover"
          />
        )}

        {!hasImage && initials && (
          <span className="relative z-10 text-white text-4xl sm:text-5xl font-bold select-none">
            {initials}
          </span>
        )}

        {!hasImage && !initials && (
          <span className="relative z-10 text-white text-3xl font-bold select-none">
            U
          </span>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
            <span className="text-white font-medium">جاري الرفع...</span>
          </div>
        )}

        <label
          htmlFor="profile-image-upload"
          className="absolute bottom-3 right-3 bg-[rgb(24,130,156)] p-2 rounded-full cursor-pointer text-white hover:scale-110 transition shadow-lg"
        >
          <Pencil className="w-5 h-5 stroke-[2.5]" />
        </label>
      </div>

      {/* WhatsApp Icon */}
      {user?.whatsappLink && (
        <a
          href={`https://wa.me/${user.whatsappLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-green-600 hover:text-green-700 transition"
        >
          <div className="p-2 rounded-full bg-green-100 hover:scale-110 transition">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">التواصل عبر واتساب</span>
        </a>
      )}

      <input
        id="profile-image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
