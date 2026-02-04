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
import { useUpdateTaskStatus } from "@/src/hooks/tasks/client/useUpdateTaskStatus";
import { useQueryClient } from "@tanstack/react-query";
import UserContent from "@/src/components/user/UserContent";
import { useCanDownload } from "@/src/hooks/tasks/client/useCanDownload";
import { useSetClientReview } from "@/src/hooks/tasks/client/useSetClientReview";
import { downloadUrl, pickOriginalUrls } from "@/src/helper";

const Page = ({ params }: { params: Promise<{ taskId: string }> }) => {
  const setClientReviewMutation = useSetClientReview();
  const canDownloadMutation = useCanDownload();

  const { mutate: clientUpdateStatus, isPending: isClientUpdatingStatus } =
    useUpdateTaskStatus();

  const queryClient = useQueryClient();

  const router = useRouter();
  const { taskId } = React.use(params);
  const { data: task, isLoading, error } = useTaskDetails(taskId);
  const clientApproved = task?.clientReview === "yes";

  const currentUser = useAuthStore((state) => state.user);
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  // const [adminDecisionState, setAdminDecisionState] = useState<AdminDecision>(
  //   task?.adminReview?.decision || "under_review",
  // );
  const adminDecisionState: AdminDecision =
    task?.adminReview?.decision ?? "under_review";
  const [taskStatusState, setTaskStatusState] = useState(
    task?.status ?? "available",
  );
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

  const requestTaskEdit = () => {
    clientUpdateStatus(
      {
        id: task._id,
        status: "available",
      },
      {
        onSuccess: () => {
          setTaskStatusState("available");

          queryClient.invalidateQueries({ queryKey: ["task", task._id] });
          queryClient.invalidateQueries({ queryKey: ["client-timeline"] });

          router.push(`/tasks/${task._id}`);

          toast.success("تم إرسال طلب التعديل بنجاح");
        },
      },
    );
  };

  const openPayFirstModal = () => {
    setModal(
      <Modal
        title="غير مدفوع"
        onClose={() => setModal(null)}
        content={<div>لازم تدفع الأول عشان تقدر تحمل النتيجة النهائية.</div>}
      />,
    );
  };

  // const openConfirmFinalDownloadModal = () => {
  //   setModal(
  //     <Modal
  //       title="تأكيد"
  //       onClose={() => setModal(null)}
  //       content={
  //         <div className="flex flex-col gap-4">
  //           <div>إذا تم تحميل النتيجة النهائية لا يمكنك طلب تعديل.</div>

  //           <div className="flex justify-end gap-2">
  //             <button
  //               className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
  //               onClick={() => setModal(null)}
  //             >
  //               إلغاء
  //             </button>

  //             <button
  //               className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
  //               onClick={async () => {
  //                 try {
  //                   await setClientReviewMutation.mutateAsync({
  //                     id: task._id,
  //                     clientReview: "yes",
  //                   });

  //                   setClientApprovedLocal(true); // يخفي طلب تعديل + يحول الزر لتحميل
  //                   setModal(null);
  //                   toast.success("تمت الموافقة، يمكنك التحميل الآن");
  //                 } catch (e: any) {
  //                   setModal(null);
  //                   toast.error(
  //                     e?.response?.data?.message || e?.message || "حدث خطأ",
  //                   );
  //                 }
  //               }}
  //               disabled={setClientReviewMutation.isPending}
  //             >
  //               موافق
  //             </button>
  //           </div>
  //         </div>
  //       }
  //     />,
  //   );
  // };
  const openConfirmFinalDownloadModal = () => {
    setModal(
      <Modal
        title="تأكيد"
        onClose={() => setModal(null)}
        content={
          <div className="flex flex-col gap-4">
            <div>إذا تم تحميل النتيجة النهائية لا يمكنك طلب تعديل.</div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setModal(null)}
              >
                إلغاء
              </button>

              <button
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                onClick={async () => {
                  try {
                    await setClientReviewMutation.mutateAsync({
                      id: task._id,
                      clientReview: "yes",
                    });

                    // مهم: ده اللي هيخلّي UI يجيب task جديد وفيه clientReview=yes
                    queryClient.invalidateQueries({
                      queryKey: ["task", task._id],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["client-timeline"],
                    });

                    setModal(null);
                    toast.success("تمت الموافقة");
                  } catch (e: any) {
                    setModal(null);
                    toast.error(
                      e?.response?.data?.message || e?.message || "حدث خطأ",
                    );
                  }
                }}
                disabled={setClientReviewMutation.isPending}
              >
                موافق
              </button>
            </div>
          </div>
        }
      />,
    );
  };

  const handleDownloadOnly = async () => {
    try {
      const res = await canDownloadMutation.mutateAsync(task._id);
      const urls = pickOriginalUrls(res.images);
      urls.forEach((u, idx) => downloadUrl(u, `result-${idx + 1}`));
      toast.success("تم التحميل");
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "حدث خطأ";
      if (String(msg).toLowerCase().includes("pay first")) {
        openPayFirstModal();
        return;
      }
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-6 px-3">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow">
        <UserHeader
          assignedUserId={task.assignedUserId}
          createdAt={task.submission?.submittedAt || ""}
        />

        {task.submission?.images?.length ? (
          <UserContent images={task.submission.images} />
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

        {/* Admin only view */}
        {currentUser?.role === "admin" && (
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
        )}

        {/* Client only view */}
        {/* {currentUser?.role === "client" && (
          <div className="p-4 border-t text-center flex justify-center gap-3">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={requestTaskEdit}
            >
              طلب تعديل
            </button>

            <button
              className={`px-4 py-2 text-white rounded ${
                clientApproved
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
              onClick={() => {
                if (!clientApproved) {
                  setClientApproved(true);
                } else {
                  // handleDownload();
                }
              }}
            >
              {clientApproved ? "تحميل" : "موافق على النتيجة"}
            </button>
          </div>
        )} */}


        {/* {currentUser?.role === "client" && (
          <div className="p-4 border-t text-center flex justify-center gap-3">
            {!clientApprovedLocal && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={requestTaskEdit}
              >
                طلب تعديل
              </button>
            )}

            <button
              className={`px-4 py-2 text-white rounded ${
                clientApprovedLocal
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
              onClick={() => {
                if (!clientApprovedLocal) {
                  if (!task.isPaid) {
                    openPayFirstModal();
                  } else {
                    openConfirmFinalDownloadModal();
                  }
                } else {
                  handleDownloadOnly(); // هنا التحميل الفعلي
                }
              }}
              disabled={
                setClientReviewMutation.isPending ||
                canDownloadMutation.isPending
              }
            >
              {clientApprovedLocal ? "تحميل" : "موافق على النتيجة"}
            </button>
          </div>
        )} */}
        {currentUser?.role === "client" && (
  <div className="p-4 border-t text-center flex justify-center gap-3">
    {!clientApproved && (
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={requestTaskEdit}
      >
        طلب تعديل
      </button>
    )}

    <button
      className={`px-4 py-2 text-white rounded ${
        clientApproved
          ? "bg-green-500 hover:bg-green-600"
          : "bg-emerald-500 hover:bg-emerald-600"
      }`}
      onClick={() => {
        if (!clientApproved) {
          if (!task.isPaid) openPayFirstModal();
          else openConfirmFinalDownloadModal();
        } else {
          handleDownloadOnly();
        }
      }}
      disabled={setClientReviewMutation.isPending || canDownloadMutation.isPending}
    >
      {clientApproved ? "تحميل" : "موافق على النتيجة"}
    </button>
  </div>
)}


        {modal}
      </div>
    </div>
  );
};

export default Page;
