"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/src/context/Model";
import { useUpdateTaskStatus } from "@/src/hooks/tasks/client/useUpdateTaskStatus";
import {
  AdminDecision,
  CLIENT_TASK_STATUS_LABELS,
  ClientTaskStatus,
  mapClientStatusToTaskStatus,
  mapTaskStatusForDisplay,
  Role,
  TASK_STATUS_LABELS,
  TaskStatus,
} from "@/src/types/task";
import { useAuthStore } from "@/src/store/auth.store";
import toast from "react-hot-toast";
import { useTakeTask } from "@/src/hooks/tasks/user/useTakeTask";
import { useAdminReviewTask } from "@/src/hooks/tasks/admin/useAdminReviewTask";
import { useSubmitTask } from "@/src/hooks/tasks/user/useSubmitTask";
import { useUploadTaskImage } from "@/src/hooks/tasks/useUploadTaskImage";
import { useAdminUpdateTask } from "@/src/hooks/tasks/admin/useAdminUpdateTask";
import { adminUpdateTask } from "@/src/services/task/task.admin";
import { useRouter } from "next/navigation";

interface Props {
  task: any;
}

export default function TaskStatusActions({ task }: Props) {
  const router = useRouter();

  const currentUser = useAuthStore((state) => state.user);

  const { mutate: reviewTask, isPending: isAdminReviewPending } =
    useAdminReviewTask({
      taskId: task._id,
    });

  const { mutate: takeTask, isPending: isTaking } = useTakeTask();

  const { mutate: submitTaskMutate, isPending: isSubmitTaskPending } =
    useSubmitTask({
      taskId: task._id,
    });

  const { mutate: adminUpdateStatus, isPending: isAdminUpdatingStatus } =
    useAdminUpdateTask(task._id);

  const { mutate: clientUpdateStatus, isPending: isClientUpdatingStatus } =
    useUpdateTaskStatus();

  const { taskStatus, adminDecision, isPaid } = task;

  const [taskStatusState, setTaskStatusState] = useState(
    task.status ?? "available",
  );
  const realStatus = taskStatusState;

  const [userUploadedFiles, setUserUploadedFiles] = useState(
    task.userUploadedFiles,
  );

  useEffect(() => {
    setUserUploadedFiles(task.userUploadedFiles);
  }, [task.userUploadedFiles]);

  const [userHasTakenTask, setUserHasTakenTask] = useState(false);

  useEffect(() => {
    setUserHasTakenTask(
      task.status === "in_progress" &&
        (task.assignedUserId?._id === currentUser?.sub ||
          task.assignedUserId === currentUser?.sub),
    );
  }, [task, currentUser]);

  useEffect(() => {
    setTaskStatusState(task.status ?? "available");
  }, [task.status]);

  const [modal, setModal] = useState<React.ReactNode | null>(null);

  const statusOptions =
    currentUser?.role === "admin"
      ? ([
          "available",
          "in_progress",
          "completed",
          "under_review",
          "rejected",
        ] as TaskStatus[])
      : (["receive", "complete"] as ClientTaskStatus[]);

  const statusColors: Record<string, string> = {
    available: "bg-gray-100 text-gray-600",
    in_progress: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    under_review: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    receive: "bg-blue-100 text-blue-700",
    complete: "bg-green-100 text-green-700",
  };

  const paidColors = {
    true: "bg-emerald-100 text-emerald-700",
    false: "bg-gray-200 text-gray-700",
  };

  const adminDecisionColors: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    edit_requested: "bg-yellow-100 text-yellow-700",
  };
  const canEditStatus =
    currentUser?.role === "admin" ||
    (currentUser?.role === "client" && task.createdBy._id === currentUser?.sub);

  const [isPaidState, setIsPaidState] = useState(isPaid);

  const [adminDecisionState, setAdminDecisionState] = useState(
    task.adminReview?.decision ?? "under_review",
  );

  if (!currentUser) return null;

  const { mutateAsync: uploadImage } = useUploadTaskImage();

  // const handleSubmitTask = async (files: File[]) => {

  //   if (!files.length) return;

  //   try {
  //     const uploadedImages: { secure_url: string; public_id: string }[] =
  //       await Promise.all(
  //         files.map(async (file) => {
  //           const uploaded = await uploadImage(file);
  //           return uploaded;
  //         }),
  //       );

  //     submitTaskMutate(
  //       { images: uploadedImages },
  //       {
  //         onSuccess: (res) => {
  //           setUserUploadedFiles(true);
  //         },
  //         onError: (err) => {},
  //       },
  //     );
  //   } catch (error) {}
  // };

  const handleSubmitTask = async (files: File[]) => {
    if (!files.length) return;

    try {
      const uploadedImages: { secure_url: string; public_id: string }[] =
        await Promise.all(
          files.map(async (file) => {
            const uploaded = await uploadImage(file);
            return uploaded;
          }),
        );

      submitTaskMutate(
        { images: uploadedImages },
        {
          onSuccess: (res) => {
            setUserUploadedFiles(true);
            task.submission = res.data.submission;
            task.status = res.data.status;
            task.userHasSubmitted = res.data.userHasSubmitted;
          },
          onError: (err) => {},
        },
      );
    } catch (error) {}
  };

  // const clientStatusDisplay = () => {
  //   if (currentUser.role === "client") {
  //     if (taskStatusState === "completed") return "complete";
  //     return "receive";
  //   }
  //   return mapTaskStatusForDisplay(taskStatusState, currentUser.role);
  // };

  // const statusDisplay = clientStatusDisplay();
  const statusDisplay =
    currentUser.role === "client"
      ? CLIENT_TASK_STATUS_LABELS[
          realStatus === "completed" ? "complete" : "receive"
        ]
      : // : TASK_STATUS_LABELS[realStatus];
        TASK_STATUS_LABELS[realStatus as TaskStatus];

  // const statusClass =
  //   statusColors[statusDisplay] || "bg-blue-100 text-blue-700";
  const statusClass = statusColors[realStatus] || "bg-gray-100 text-gray-600";

  const updateAdminDecision = (value: AdminDecision) => {
    reviewTask(
      { decision: value },
      {
        onSuccess: (res) => {
          setAdminDecisionState(value);

          switch (value) {
            case "approved":
              setTaskStatusState("completed");
              break;
            case "rejected":
              setTaskStatusState("available");
              break;
            case "edit_requested":
              setTaskStatusState("under_review");
              break;
          }

          setModal(null);
        },
      },
    );
  };
  const updatePaid = (value: boolean) => {
    adminUpdateStatus(
      { isPaid: value },
      {
        onSuccess: (data) => {
          setModal(null);
          setIsPaidState(data.isPaid);
          toast.success("تم تحديث حالة الدفع");
        },
        onError: (err) => {
          toast.error("فشل في تحديث حالة الدفع");
        },
      },
    );
  };

  // const updateStatus = (newStatus: ClientTaskStatus | TaskStatus) => {
  //   const statusToSend = mapClientStatusToTaskStatus(
  //     newStatus,
  //     currentUser.role,
  //     taskStatusState,
  //   );
  const updateStatus = (newStatus: ClientTaskStatus) => {
    const statusToSend = mapClientStatusToTaskStatus(
      newStatus,
      currentUser.role as Role,
      taskStatusState,
    );

    if (currentUser.role === "admin") {
      adminUpdateStatus(
        { status: statusToSend },
        {
          onSuccess: () => {
            setTaskStatusState(statusToSend);
            setModal(null);
            toast.success("تم تحديث حالة المهمة");
          },
        },
      );
    } else {
      clientUpdateStatus(
        {
          id: task._id,
          status: statusToSend,
        },
        {
          onSuccess: () => {
            setTaskStatusState(statusToSend);
            setModal(null);
            toast.success("تم تحديث حالة المهمة");
          },
        },
      );
    }
  };

  const showAdminDecision =
    currentUser.role === "admin" ||
    (currentUser.role === "user" && task.submission?.submittedAt);

  if (!currentUser || !currentUser.sub) return null;

  // const currentUserId = currentUser._id;

  // const assignedUserId =
  //   typeof task.assignedUserId === "string"
  //     ? task.assignedUserId
  //     : task.assignedUserId?._id;

  // const isAssignedToUser =
  //   Boolean(currentUserId) && assignedUserId === currentUserId;

  const adminDecisionText: Record<string, string> = {
    approved: "مقبول",
    rejected: "مرفوض",
    edit_requested: "طلب تعديل",
    under_review: "قيد المراجعة",
  };

  //typescript
  const isTaskStatus = (s: TaskStatus | ClientTaskStatus): s is TaskStatus =>
    s in TASK_STATUS_LABELS;

  const isClientTaskStatus = (
    s: TaskStatus | ClientTaskStatus,
  ): s is ClientTaskStatus => s in CLIENT_TASK_STATUS_LABELS;

  return (
    <div className="px-4 py-3 border-t flex flex-wrap items-center gap-2 text-sm">
      {/* ===== USER ACTIONS ===== */}

      {currentUser.role === "user" && (
        <>
          {/* Take Task */}
          {task.status === "available" && !userHasTakenTask && (
            <div className="w-full px-4">
              <button
                // onClick={() => {
                //   takeTask(task._id, {
                //     onSuccess: () => {
                //       setUserHasTakenTask(true);
                //     },
                //   });
                // }}
                onClick={() => {
                  takeTask(task._id, {
                    onSuccess: () => {
                      setUserHasTakenTask(true);
                    },
                    onError: (error: any) => {
                      toast.error(
                        "عندك مهمة حالياً، خلصها الأول وبعدين خد مهمة تانية",
                      );
                    },
                  });
                }}
                className="
            block
            w-full
            max-w-md
            mx-auto
            py-3
            rounded-xl
            bg-green-600
            text-white
            text-lg
            font-semibold
            hover:bg-green-700
            transition
          "
                disabled={isTaking}
              >
                {isTaking ? "جاري الاستلام..." : "استلام المهمة"}
              </button>
            </div>
          )}

          {/* Attach Files */}
          {/* {task.status === "in_progress" &&
            userHasTakenTask &&
            !userUploadedFiles && ( */}
          {/* Attach Files */}
          {task.status === "in_progress" &&
            userHasTakenTask &&
            !task.submission && (
              <div className="w-full px-4 mb-2">
                <label className="block w-full max-w-md mx-auto text-center py-3 rounded-xl bg-yellow-600 text-white text-lg font-semibold cursor-pointer hover:bg-yellow-700 transition">
                  {isSubmitTaskPending ? "جاري الإرسال..." : "إرفاق ملفات"}
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={(e) =>
                      handleSubmitTask(Array.from(e.target.files || []))
                    }
                  />
                </label>
              </div>
            )}

          {/* View Result */}
          {/* View Result */}
        </>
      )}
      {/* {(currentUser.role === "user" ||
        currentUser.role === "admin" ||
        currentUser.role === "client") &&
        task.submission && (
          <div className="w-full px-4 mb-2">
            <button
              onClick={() => router.push(`/user/submitted/${task._id}`)}
              className="block w-full max-w-md mx-auto py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition"
            >
              View Result
            </button>
          </div>
        )} */}
      {task.submission && (
        <div className="w-full px-4 mb-2">
          {(currentUser.role === "admin" ||
            currentUser.role === "user" ||
            (currentUser.role === "client" &&
              adminDecisionState === "approved")) && (
            <button
              onClick={() => router.push(`/user/submitted/${task._id}`)}
              className="block w-full max-w-md mx-auto py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition"
            >
              مشاهدة النتيجة
            </button>
          )}
        </div>
      )}

      {/* ===== Task Status ===== */}
      <span
        className={`px-3 py-1 rounded-full flex items-center gap-2 max-w-xs truncate ${statusClass}`}
      >
        حالة المهمة: {statusDisplay}
        {canEditStatus && (
          <button
            className="w-4 h-4 flex items-center justify-center ml-1"
            onClick={() =>
              setModal(
                <Modal
                  title="تعديل حالة المهمة"
                  onClose={() => setModal(null)}
                  content={
                    <div className="flex flex-col gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          className={`px-3 py-1 rounded ${
                            statusColors[status.toLowerCase()] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                          // onClick={() => updateStatus(status)}
                          onClick={() =>
                            updateStatus(status as ClientTaskStatus)
                          }
                        >
                          {/* {TASK_STATUS_LABELS[status] ??
                            CLIENT_TASK_STATUS_LABELS[status]}
                             */}
                          {isTaskStatus(status)
                            ? TASK_STATUS_LABELS[status]
                            : isClientTaskStatus(status)
                              ? CLIENT_TASK_STATUS_LABELS[status]
                              : ""}
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
      </span>

      {/* ===== Admin Decision ===== */}

      {showAdminDecision && adminDecisionState && (
        <span
          className={`px-3 py-1 rounded-full flex items-center gap-2 max-w-xs truncate ${
            adminDecisionColors[adminDecisionState] ||
            "bg-gray-100 text-gray-600"
          }`}
        >
          مناقشة الادمن: {adminDecisionText[adminDecisionState] || "غير معروف"}
          {/* زر التعديل يظهر فقط للأدمن */}
          {currentUser.role === "admin" && (
            <button
              className="w-4 h-4 flex items-center justify-center ml-1"
              onClick={() =>
                setModal(
                  <Modal
                    title="Edit Admin Decision"
                    onClose={() => setModal(null)}
                    content={
                      <div className="flex flex-col gap-2">
                        <button
                          className="px-3 py-1 bg-green-100 text-green-700 rounded"
                          onClick={() => updateAdminDecision("approved")}
                        >
                          قبول
                        </button>
                        <button
                          className="px-3 py-1 bg-red-100 text-red-700 rounded"
                          onClick={() => updateAdminDecision("rejected")}
                        >
                          رفض
                        </button>
                        <button
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded"
                          onClick={() => updateAdminDecision("edit_requested")}
                        >
                          طلب تعديل
                        </button>
                      </div>
                    }
                  />,
                )
              }
            >
              ✏️
            </button>
          )}
        </span>
      )}

      {/* ===== Paid ===== */}
      {(currentUser.role === "admin" || currentUser.role === "client") && (
        <span
          className={`px-3 py-1 rounded-full flex items-center gap-2 max-w-xs truncate ${
            // paidColors[String(isPaidState)]

            paidColors[String(isPaidState) as "true" | "false"]
          }`}
        >
          حالة الدفع: {isPaidState ? "مدفوع" : "غير مدفوع"}
          {currentUser.role === "admin" && (
            <button
              className="w-4 h-4 flex items-center justify-center ml-1"
              onClick={() =>
                setModal(
                  <Modal
                    title="Edit Payment Status"
                    onClose={() => setModal(null)}
                    content={
                      <div className="flex flex-col gap-2">
                        <button
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded"
                          onClick={() => updatePaid(true)}
                        >
                          مدفوع
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded"
                          onClick={() => updatePaid(false)}
                        >
                          غير مدفوع
                        </button>
                      </div>
                    }
                  />,
                )
              }
            >
              ✏️
            </button>
          )}
        </span>
      )}

      {modal}
    </div>
  );
}
