"use client";
import Image from "next/image";
import { Calendar, Clock, DollarSign, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { mapTaskStatusForDisplay, TaskPostCardProps } from "@/src/types/task";
import Link from "next/link";
import { useAuthStore } from "@/src/store/auth.store";

export default function TaskPostCard({ role, data }: TaskPostCardProps) {
  const router = useRouter();

  if (!data) {
    return null;
  }

  const {
    title,
    description,
    requestImages,
    deadline,
    // taskStatus,
    status: taskStatus,
    // adminDecision,
    isPaid,
    createdAt,
    createdBy,
  } = data;

  const realStatus = mapTaskStatusForDisplay(data.status ?? taskStatus, role);
  const currentUser = useAuthStore((state) => state.user);

  if (role === "user" && realStatus === "completed") {
    return null;
  }

  const displayStatus =
    role === "client"
      ? realStatus === "completed" || realStatus === "complete"
        ? "completed"
        : "received"
      : realStatus;

  const statusClasses: Record<string, string> = {
    available: "bg-gray-100 text-gray-600",
    in_progress: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    under_review: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    received: "bg-blue-100 text-blue-700",
    receive: "bg-blue-100 text-blue-700",
    complete: "bg-green-100 text-green-700",
  };

  const imagesToShow = requestImages?.slice(0, 2) ?? [];

  const profileLink = createdBy?._id
    ? currentUser?.sub === createdBy._id
      ? "/profile"
      : `/profile/${createdBy._id}`
    : undefined;

  const statusText: Record<string, string> = {
    available: "متاحة",
    in_progress: "قيد التنفيذ",
    completed: "مكتملة",
    complete: "مكتملة",
    under_review: "قيد المراجعة",
    rejected: "مرفوضة",
    received: "تم الاستلام",
    receive: "تم الاستلام",
  };

  return (
    <div
      onClick={() => {
        router.push(`/tasks/${data._id}`);
      }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-3xl mx-auto my-6 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-5">
        {profileLink ? (
          <Link href={profileLink} onClick={(e) => e.stopPropagation()}>
            {createdBy?.profileImage?.secure_url ? (
              <img
                src={createdBy.profileImage.secure_url}
                alt={`${createdBy?.firstName || ""} ${createdBy?.lastName || ""}`}
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
              />
            ) : createdBy?.firstName || createdBy?.lastName ? (
              <div className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-lg cursor-pointer">
                {`${(createdBy?.firstName?.charAt(0) || "").toUpperCase()}${(createdBy?.lastName?.charAt(0) || "").toUpperCase()}`}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg cursor-pointer">
                ?
              </div>
            )}
          </Link>
        ) : (
          <>
            {createdBy?.profileImage?.secure_url ? (
              <img
                src={createdBy.profileImage.secure_url}
                alt={`${createdBy?.firstName || ""} ${createdBy?.lastName || ""}`}
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
              />
            ) : createdBy?.firstName || createdBy?.lastName ? (
              <div className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-lg cursor-pointer">
                {`${createdBy?.firstName?.charAt(0) || ""}${createdBy?.lastName?.charAt(0) || ""}`}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg cursor-pointer">
                ?
              </div>
            )}
          </>
        )}

        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-lg">
            {createdBy?.firstName || "User"} {createdBy?.lastName || ""}
          </p>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(createdAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}{" "}
              {new Date(createdAt).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </div>

        <span
          className={`text-sm px-4 py-1 rounded-full font-medium ${
            statusClasses[displayStatus] || "bg-gray-100 text-gray-600"
          }`}
        >
          {statusText[displayStatus] || "غير معروف"}
        </span>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <h3 className="font-bold text-xl text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-700 text-base line-clamp-3">{description}</p>
      </div>

      {/* Images */}
      {imagesToShow.length > 0 && (
        <div
          className={`grid gap-2 px-6 pb-4 ${
            imagesToShow.length > 1 ? "lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {imagesToShow.map((img, i) => (
            <a
              href={img.secure_url}
              download
              key={i}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {" "}
              {/* ← هنا */}
              <div className="relative w-full rounded-lg overflow-hidden aspect-[4/3]">
                <Image
                  src={img.secure_url}
                  alt="task image"
                  fill
                  className="object-contain"
                />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-6 px-6 py-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-600" />
          <span>موعد التسليم: {new Date(deadline).toLocaleDateString()}</span>
        </div>

        {(role === "admin" || role === "client") && (
          <div className="flex items-center gap-2">
            <DollarSign
              className={`w-5 h-5 ${
                isPaid ? "text-green-600" : "text-red-500"
              }`}
            />
            <span>{isPaid ? "مدفوع" : "غير مدفوع"}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {(role === "admin" ||
        (role === "client" && realStatus === "available")) && (
        <div className="border-t px-6 py-4 flex items-center gap-6 text-gray-600">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-2 hover:text-sky-600 transition"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm font-medium">التعليقات</span>
          </button>
        </div>
      )}
    </div>
  );
}
