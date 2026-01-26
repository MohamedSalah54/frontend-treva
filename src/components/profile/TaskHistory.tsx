"use client";

import { useProfile } from "@/src/hooks/profile/useProfile";
import AppLoader from "@/src/ui/AppLoader";
import EmptyState from "@/src/ui/EmptyState";
import { PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface HistoryProps {
  userId: string;
}

export default function History({ userId }: HistoryProps) {
  const router = useRouter();

  const { data: profileUser, isLoading, isError } = useProfile(userId);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        {" "}
        <AppLoader text="جري تحميل السجل" />
      </div>
    );
  }

  if (isError || !profileUser) {
    return (
      <div className="text-center py-10 text-red-500">
        <EmptyState icon={<PackageCheck size={56} />} title="لا يوجد سجل" />
      </div>
    );
  }

  const completedTasks = profileUser.taskStats?.completed || 0;
  const inProgressTasks = profileUser.taskStats?.inProgress || 0;
  const totalTasksPosted = profileUser.totalTasksRequested || 0;

  const tasks = profileUser.tasksHistory || [];

  console.log("tasks", tasks);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* ===== Numbers Section ===== */}
      <div className="flex gap-6 text-gray-800 font-medium">
        {profileUser.role === "user" && (
          <>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              مهام منجزة: {completedTasks}
            </div>
            <div className="bg-yellow-100 px-4 py-2 rounded-lg">
              مهام جاري العمل عليها: {inProgressTasks}
            </div>
          </>
        )}

        {profileUser.role === "client" && (
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            عدد المهام المنشورة : {totalTasksPosted}
          </div>
        )}
      </div>

      {/* ===== History Cards ===== */}
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task: any, idx: number) => (
            <div
              key={idx}
              className="border rounded-xl p-4 bg-white shadow-sm cursor-pointer"
              onClick={() => router.push(`/tasks/${task._id}`)} // ← هنا كل كارد يروح لتاسكه
            >
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {task.description}
              </p>
              {task.createdAt && (
                <span className="text-xs text-gray-400">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <EmptyState
              icon={<PackageCheck size={56} />}
              title=" لايوجد سجل للأدمن"
            />
          </div>
        )}
      </div>
    </div>
  );
}
