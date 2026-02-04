"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddTaskComment } from "@/src/hooks/tasks/client/useAddTaskComment";
import { mapTaskStatusForDisplay, Role } from "@/src/types/task";
import { useUploadTaskImage } from "@/src/hooks/tasks/useUploadTaskImage";
import { Camera, MessageCircle, X } from "lucide-react";
import { useAuthStore } from "@/src/store/auth.store";
import { useDeleteAdminComment } from "@/src/hooks/tasks/admin/useDeleteAdminComment ";
import { ConfirmModal } from "@/src/context/ConfirmModal ";
import { useAddComment } from "@/src/hooks/tasks/admin/useAdminAddComment";

interface Props {
  task: any;
  role: Role;
}

export default function TaskComments({ task, role }: Props) {
  const currentUser = useAuthStore((state) => state.user);

  const queryClient = useQueryClient();
  const [commentInput, setCommentInput] = useState("");
  const addAdminCommentMutation = useAddComment(task.id);

  const [images, setImages] = useState<{ secure_url: string }[]>([]);

  const isAdmin = role === "admin";

  // const canComment = role === "client" && task.status === "in_progress";

  // const canComment =
  //   role === "client" && !["under_review", "completed"].includes(task.status);
  const canComment = role === "client";

  const addClientCommentMutation = useAddTaskComment();
  // const uploadImageMutation = useUploadTaskImage();

  const uploadImageMutation = useUploadTaskImage();
  const isLoading = uploadImageMutation.isPending;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadImageMutation.mutate(file, {
      onSuccess: (uploaded) => {
        setImages((prev) => [...prev, uploaded]);
      },
    });
  };

  // const handlePostComment = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!commentInput.trim() && images.length === 0) return;

  //   const validImages = images
  //     .filter((img) => img)
  //     .map((img) => ({
  //       secure_url: typeof img.secure_url === "string" ? img.secure_url : "",
  //       public_id: img.public_id || "",
  //       folderId: img.folderId || "",
  //     }))
  //     .filter((img) => img.secure_url);

  //   addClientCommentMutation.mutate(
  //     {
  //       taskId: task._id,
  //       comment: commentInput || "",
  //       images: validImages,
  //     },
  //     {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries(["client-task-details", task._id]);
  //         setCommentInput("");
  //         setImages([]);
  //       },
  //     },
  //   );
  // };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() && images.length === 0) return;

    const validImages = images
      .filter(
        (
          img,
        ): img is {
          secure_url: string;
          public_id?: string;
          folderId?: string;
        } => Boolean(img),
      )
      .map((img) => ({
        secure_url: typeof img.secure_url === "string" ? img.secure_url : "",
        public_id: img.public_id || "",
        folderId: img.folderId || "",
      }))
      .filter((img) => img.secure_url);

    const payload = {
      taskId: task._id,
      comment: commentInput || "",
      images: validImages,
    };

    const mutation =
      currentUser?.role === "admin"
        ? addAdminCommentMutation
        : addClientCommentMutation;

    mutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["task-details", task.id],
        });

        setCommentInput("");
        setImages([]);
      },
    });
  };

  // const [comments, setComments] = useState(task.comments || []);

  const deleteMutation = useDeleteAdminComment(task.id);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (!commentToDelete) return;

    deleteMutation.mutate(commentToDelete, {
      onSuccess: () => {
        queryClient.setQueryData(["task-details", task.id], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            comments: old.comments.filter(
              (c: any) => c._id !== commentToDelete,
            ),
          };
        });

        setCommentToDelete(null);
      },
    });
  };
  // const formatDateTimeAr = (d?: string | Date) =>
  //   d
  //     ? new Intl.DateTimeFormat("ar-EG", {
  //         dateStyle: "medium",
  //         timeStyle: "short",
  //       }).format(new Date(d))
  //     : "";

  return (
    <div className="px-4 py-3 border-t">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-sm flex items-center gap-1">
          التعليقات
          <span className="flex items-center gap-1 text-gray-600">
            <MessageCircle size={16} />
            {task?.comments?.length || 0}
          </span>
        </p>
      </div>

      <div className="space-y-3">
        {task?.comments?.length ? (
          task.comments.map((c: any, i: number) => (
            <div key={i} className="flex gap-2 relative">
              {c.userId?.profileImage ? (
                <img
                  src={c.userId.profileImage.secure_url}
                  alt={c.userId.firstName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-white">
                  {`${c.userId?.firstName?.charAt(0) || ""}${c.userId?.lastName?.charAt(0) || ""}`}
                </div>
              )}

              {/* <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm flex-1">
                <p className="font-semibold">
                  {c.userId
                    ? `${c.userId.firstName} ${c.userId.lastName || ""}`
                    : "Anonymous"}
                </p>
                <p>{c.comment}</p>
                {c.images?.length > 0 && (
                  <div className="flex gap-2 mt-1">
                    {c.images.map((img: any, idx: number) => (
                      <img
                        key={idx}
                        src={img.secure_url}
                        alt="comment image"
                        className="w-full max-w-md h-auto object-cover rounded-lg mt-2"
                      />
                    ))}
                  </div>
                )}
              </div> */}
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm flex-1">
                <p className="font-semibold">
                  {c.userId
                    ? `${c.userId.firstName} ${c.userId.lastName || ""}`
                    : "مستخدم"}
                </p>

                {c.isDeleted ? (
                  <p className="text-gray-500 italic">
                    تم حذف تعليق{" "}
                    {c.userId
                      ? `${c.userId.firstName} ${c.userId.lastName || ""}`
                      : "المستخدم"}{" "}
                    بواسطة{" "}
                    {c.deletedByName ? `الأدمن ${c.deletedByName}` : "الأدمن"}{" "}
                    بتاريخ{" "}
                    {c.deletedAt
                      ? new Intl.DateTimeFormat("ar-EG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(c.deletedAt))
                      : ""}
                  </p>
                ) : (
                  <>
                    <p>{c.comment}</p>

                    {c.images?.length > 0 && (
                      <div className="flex gap-2 mt-1">
                        {c.images.map((img: any, idx: number) => (
                          <img
                            key={idx}
                            src={img.secure_url}
                            alt="comment image"
                            className="w-full max-w-md h-auto object-cover rounded-lg mt-2"
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* علامة الحذف للأدمن */}
              {/* {currentUser?.role === "admin" && (
                <button
                  onClick={() => {
                    console.log("Deleting comment id:", c);
                    setCommentToDelete(c._id);
                  }}
                  className="absolute left-5 top-2 p-1 hover:bg-red-200 rounded-full"
                >
                  <X size={16} className="text-red-600" />
                </button>
              )} */}
              {currentUser?.role === "admin" && !c.isDeleted && (
                <button
                  onClick={() => {
                    console.log("Deleting comment id:", c);
                    setCommentToDelete(c._id);
                  }}
                  className="absolute left-5 top-2 p-1 hover:bg-red-200 rounded-full"
                >
                  <X size={16} className="text-red-600" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">لا يوجد تعليقات</p>
        )}
      </div>
      <ConfirmModal
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        onConfirm={handleDelete}
        title="حذف التعليق"
        description="هل أنت متأكد أنك تريد حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
      />

      {/* فورم إضافة كومنت + رفع صور */}
      {/* {isAdmin || canComment ? ( */}

      {isAdmin || (canComment && task.status !== "completed") ? (
        <form onSubmit={handlePostComment} className="flex flex-col gap-2 mt-3">
          <div className="flex items-center gap-2">
            {/* حقل النص */}
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2 text-sm"
              placeholder="كتابة تعليق"
            />

            {/* أيقونة رفع الصورة */}
            <label className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-gray-800">
              <Camera className="text-lg" />
              <span className="text-sm">ملفات</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                // disabled={uploadImageMutation.isLoading}
                disabled={isLoading}
              />
            </label>

            {/* زر Post */}
            {/* <button
              type="submit"
              className="text-blue-600 font-semibold px-3 py-1 rounded hover:bg-blue-50"
              disabled={
                addClientCommentMutation.isLoading &&
                !commentInput &&
                images.length === 0
              }
            >
              {addClientCommentMutation.isLoading ? "Posting..." : "Post"}
            </button> */}
            <button
              type="submit"
              className="text-blue-600 font-semibold px-3 py-1 rounded hover:bg-blue-50"
              disabled={
                // (currentUser?.role === "admin"
                //   ? addAdminCommentMutation.isLoading
                //   : addClientCommentMutation.isLoading)
                (currentUser?.role === "admin"
                  ? addAdminCommentMutation.isPending
                  : addClientCommentMutation.isPending) ||
                (!commentInput && images.length === 0)
              }
            >
              {(
                currentUser?.role === "admin"
                  ? addAdminCommentMutation.isPending
                  : addClientCommentMutation.isPending
              )
                ? "جارٍ النشر..."
                : "نشر"}
            </button>
          </div>

          {/* preview للصور قبل ارسال الكومنت */}
          {images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.secure_url}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
        </form>
      ) : null}
    </div>
  );
}
