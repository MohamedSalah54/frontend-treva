"use client";

import TaskHeader from "./TaskHeader";
import TaskContent from "./TaskContent";
import TaskImages from "./TaskImages";
import TaskStatusActions from "./TaskStatusActions";
import TaskComments from "./TaskComments";
import TaskDeadline from "./TaskDeadline";

import { useAuthStore } from "@/src/store/auth.store";
import { useTaskDetails } from "@/src/hooks/tasks/user/useTaskDetails";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLoader from "@/src/ui/AppLoader";
import EmptyState from "@/src/ui/EmptyState";
import { ClipboardCheck } from "lucide-react";
import { Role } from "@/src/types/task";

interface Props {
  taskId: string;
}

export default function TaskInfoPage({ taskId }: Props) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const { data: task, isLoading, error } = useTaskDetails(taskId);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  if (isLoading) {
    return <AppLoader text="جاري تحميل المهام..." />;
  }

  if (error) {
    return (
      <p className="text-center py-10 text-red-500">فشل في تحميل المهام</p>
    );
  }

  if (!task) {
    return (
      <p className="text-center py-10">
        <EmptyState
          icon={<ClipboardCheck size={56} />}
          title="لا يوجد مهام"
          actionText="الرجوع الي الصفحة الرئيسية"
          onAction={() => router.push("/")}
        />
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-6 px-3">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow">
        {user && (
          <>
            <TaskHeader createdBy={task.createdBy} createdAt={task.createdAt} />

            <TaskContent title={task.title} description={task.description} />

            <TaskImages images={task.requestImages} />

            <TaskStatusActions task={task} />

            <TaskComments task={task} role={user.role as Role} />

            <TaskDeadline deadline={task.deadline} />
          </>
        )}
      </div>
    </div>
  );
}
