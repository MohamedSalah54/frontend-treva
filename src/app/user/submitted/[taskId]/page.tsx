"use client";

import React, { useState } from "react";
import TaskImages from "@/src/components/post/TaskImages";
import { useTaskDetails } from "@/src/hooks/tasks/user/useTaskDetails";
import UserHeader from "@/src/components/user/UserHeader";
import { useAuthStore } from "@/src/store/auth.store";
import { Modal } from "@/src/context/Model";
import { useAdminReviewTask } from "@/src/hooks/tasks/admin/useAdminReviewTask";
import toast from "react-hot-toast";
import { AdminDecision } from "@/src/types/task";
import AppLoader from "@/src/ui/AppLoader";
import EmptyState from "@/src/ui/EmptyState";
import { Ban, ClipboardCheck, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: Promise<{ taskId: string }> }) => {
  const router = useRouter();
  const { taskId } = React.use(params);
  const { data: task, isLoading, error } = useTaskDetails(taskId);
  const currentUser = useAuthStore((state) => state.user);
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  // const [adminDecisionState, setAdminDecisionState] = useState<AdminDecision>(
  //   task?.adminReview?.decision || "under_review",
  // );
  const adminDecisionState: AdminDecision =
    task?.adminReview?.decision ?? "under_review";

  const { mutate: reviewTask } = useAdminReviewTask({ taskId });

  if (isLoading)
    return (
      <div className="p-4 text-center">
        <AppLoader text="تحميل المهمة..." />
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-center text-red-500">
        <EmptyState
          icon={<Ban size={56} />}
          title="حدث خطأ في التحميل"
          actionText="العودة الي الصفحة الرئيسية"
          onAction={() => router.push("/")}
        />
      </div>
    );
  if (!task)
    return (
      <div className="p-4 text-center">
        <EmptyState
          icon={<PackageCheck size={56} />}
          title="لا توجد مهام"
          description="لم يتم إضافة أي مهام حتى الآن"
          actionText="العودة إلى الصفحة الرئيسية"
          onAction={() => router.push("/")}
        />
      </div>
    );

  const adminDecisionText: Record<AdminDecision, string> = {
    approved: "مقبول",
    rejected: "مرفوض",
    edit_requested: "طلب تعديل",
    under_review: "قيد المراجعة",
  };

  const canEditDecision = currentUser?.role === "admin";

  const adminDecisionColors: Record<AdminDecision, string> = {
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    edit_requested: "bg-yellow-100 text-yellow-700",
    under_review: "bg-blue-100 text-blue-700",
  };

  const handleAdminDecision = (decision: AdminDecision) => {
    reviewTask(
      { decision },
      {
        onSuccess: () => {
          // setAdminDecisionState(decision);
          setModal(null);
          toast.success(
            `تم تحديث قرار الادمن إلى: ${adminDecisionText[decision]}`,
          );
        },
        onError: () => toast.error("فشل في تحديث قرار الأدمن"),
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-6 px-3">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow">
        <UserHeader
          assignedUserId={task.assignedUserId}
          createdAt={task.submission?.submittedAt || ""}
        />

        {task.submission?.images?.length ? (
          <TaskImages images={task.submission.images} />
        ) : (
          <div className="p-4 text-center text-gray-500">
            <EmptyState
              icon={<PackageCheck size={56} />}
              title="لا توجد مهام"
              description="لم يتم إضافة أي مهام حتى الآن"
              actionText="العودة إلى الصفحة الرئيسية"
              onAction={() => router.push("/")}
            />
          </div>
        )}

        {/* Admin Decision display */}
        <div className="p-4 border-t text-center font-semibold flex justify-center items-center gap-2">
          الأدمن:{" "}
          <span
            className={`px-2 py-1 rounded ${
              adminDecisionColors[adminDecisionState] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {adminDecisionText[adminDecisionState]}
          </span>
          {canEditDecision && (
            <button
              className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() =>
                setModal(
                  <Modal
                    title="Edit Admin Decision"
                    onClose={() => setModal(null)}
                    content={
                      <div className="flex flex-col gap-2">
                        {(
                          Object.keys(adminDecisionColors) as AdminDecision[]
                        ).map((decision) => (
                          <button
                            key={decision}
                            className={`px-3 py-1 rounded ${
                              adminDecisionColors[decision]
                            }`}
                            onClick={() => handleAdminDecision(decision)}
                          >
                            {adminDecisionText[decision]}
                          </button>
                        ))}
                      </div>
                    }
                  />,
                )
              }
            >
              ✏️
            </button>
          )}
        </div>

        {modal}
      </div>
    </div>
  );
};

export default Page;
