"use client";

import { useAdminStatistics } from "@/src/hooks/tasks/admin/useAdminStatistics";
import AppLoader from "@/src/ui/AppLoader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0ea5e9", "#22c55e", "#facc15", "#ef4444"];

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStatistics();

  if (isLoading) {
    return <AppLoader text="Loading Dashboard..." />;
  }

  const dashboardStats = [
    {
      title: "إجمالي المهام",
      value: data.tasksStats.total,
      color: "bg-sky-500",
    },
    {
      title: "المنجز",
      value: data.tasksStats.completed,
      color: "bg-green-500",
    },
    {
      title: "جاري العمل عليه",
      value: data.tasksStats.inProgress,
      color: "bg-yellow-500",
    },
    {
      title: "مرفوض",
      value: data.tasksStats.rejected,
      color: "bg-red-500",
    },
  ];

  const topWorkers = data.topUser
    ? [
        {
          name: data.topUser.name,
          completedTasks: data.topUser.completedTasks,
        },
      ]
    : [];

  const topClients = data.topClient
    ? [
        {
          name: data.topClient.name,
          tasksPosted: data.topClient.totalTasksRequested,
        },
      ]
    : [];

  return (
    <div className="space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} text-white rounded-2xl p-6 shadow`}
          >
            <p className="text-lg font-semibold opacity-95">{stat.title}</p>

            <h3 className="text-4xl font-bold mt-3">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Top Workers */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">
            أفضل مستخدم (مهام تم الإنتهاء منها)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topWorkers}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="completedTasks"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">
            أفضل عميل (المهام المنشورة)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topClients}
                dataKey="tasksPosted"
                nameKey="name"
                outerRadius={110}
                label
              >
                {topClients.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
