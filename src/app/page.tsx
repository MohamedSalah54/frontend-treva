"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth.store";
import TaskPostCard from "../components/post/TaskPostCard";
import TaskFilterBar from "../components/filter/TaskFilterBar";
import CreateTaskForm from "../components/forms/CreateTaskForm";
import { useLoadUser } from "../hooks/auth/useLoadUser";
import { useClientTimeline } from "../hooks/tasks/client/useClientTimeline";
import { useUserTimeline } from "../hooks/tasks/user/useUserTimeline";
import { useAdminTimeline } from "../hooks/tasks/admin/useAdminTimeline";
import { useFilterMyTasks } from "../hooks/tasks/useFilterMyTasks";
import AppLoader from "../ui/AppLoader";
import EmptyState from "../ui/EmptyState";
import { PackageCheck } from "lucide-react";
import { Role, Task } from "../types/task";

const Home = () => {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [showCreateTask, setShowCreateTask] = useState(false);
  const clientTimeline = useClientTimeline();
  const userTimeline = useUserTimeline();
  const adminTimeline = useAdminTimeline();

  const { loading } = useLoadUser();
  const user = useAuthStore((state) => state.user);

  // const filteredTasksQuery = useFilterMyTasks(user?.role || "client", filter);

  let tasks: Task[] = [];
  let isLoading = false;

  if (user?.role === "client") {
    tasks = (clientTimeline.data ?? []) as any[];
    isLoading = clientTimeline.isLoading;
  } else if (user?.role === "admin") {
    tasks = adminTimeline.data || [];
    isLoading = adminTimeline.isLoading;
  } else {
    tasks = userTimeline.data || [];
    isLoading = userTimeline.isLoading;
  }

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <AppLoader text="جاري تحميل المهام..." />
      </div>
    );
  }

  if (!user) return null;

  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;

    const status = t.status?.toLowerCase() || "unknown";

    if (user?.role === "client") {
      if (filter === "receive") return status === "available";
      if (filter === "completed") return status === "completed";
      return false;
    }

    // admin
    return status === filter.toLowerCase();
  });

  const tasksToShow = user?.role === "user" ? tasks : filteredTasks;

  const isUser = user?.role === "user";

  let tasksToShowFinal = tasksToShow;

  if (
    isUser &&
    tasksToShowFinal.length > 0 &&
    tasksToShowFinal.every((t) => t.status?.toLowerCase() === "completed")
  ) {
    tasksToShowFinal = [];
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-zinc-50 py-10 dark:bg-black">
      <div className="w-full max-w-3xl px-4 py-3 flex items-center gap-3">
        {(user?.role === "client" || user?.role === "admin") && (
          <TaskFilterBar
            role={user?.role}
            value={filter}
            onChange={setFilter}
          />
        )}

        {user?.role === "client" && (
          <button
            onClick={() => setShowCreateTask((prev) => !prev)}
            className="
        flex items-center justify-center gap-2
        px-3 py-2 rounded-lg
        bg-sky-600 text-white text-sm font-medium
        hover:bg-sky-700 transition
        whitespace-nowrap
      "
          >
            <span className="text-xl leading-none">
              {showCreateTask ? "−" : "+"}
            </span>
            <span>{showCreateTask ? "إخفاء المهمة" : "نشر مهمة"}</span>
          </button>
        )}
      </div>
      {/* Create Task */}
      <div
        className={`
    w-full
    max-w-3xl
    mx-auto
    flex justify-center
    transition-all duration-300 ease-in-out
    ${
      showCreateTask
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 -translate-y-2 pointer-events-none"
    }
  `}
      >
        {showCreateTask && (
          <CreateTaskForm
            onSuccess={() => {
              setShowCreateTask(false);
            }}
          />
        )}
      </div>
      {/* Tasks */}
      {/* {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<PackageCheck size={65} />}
          title="No tasks available"
          description="Create your first task to get started."
        />
      ) : (
        filteredTasks.map((t) => (
          <TaskPostCard key={t._id} role={user?.role} data={t} />
        ))
      )} */}
      {tasksToShowFinal.length === 0 ? (
        <EmptyState
          icon={<PackageCheck size={65} />}
          title="لا توجد مهام متاحة"
          description={
            isUser ? "لم تستلم أي مهام حتى الآن." : "قم بإنشاء أول مهمة للبدء."
          }
        />
      ) : (
        tasksToShowFinal.map((t) => (
          <TaskPostCard key={t._id} role={user?.role as Role} data={t} />
        ))
      )}
    </div>
  );
};

export default Home;
