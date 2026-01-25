export const task = [
  {
    _id: "1",
    title: "تصميم شعار جديد",
    description:  " تصميم شعار لشركة ناشئة",
    requestImages: [{ secure_url: "/img1.jpg" }, { secure_url: "/img2.webp" }],
    deadline: "2025-12-31T23:59:59.000Z",
    taskStatus: "completed", 
    adminDecision: "approved",
    isPaid: false,
    createdAt: "2025-01-01T10:20:00.000Z",
    createdBy: { name: "Mohamed Salah" },
  },
  {
    _id: "2",
    title: "تصميم واجهة تطبيق",
    description: "واجهة مستخدم لتطبيق جديد",
    requestImages: [{ secure_url: "/img3.jpg" }, { secure_url: "/img4.jpg" }],
    deadline: "2025-12-25T23:59:59.000Z",
    taskStatus: "available",
    adminDecision: "approved",
    isPaid: true,
    createdAt: "2025-02-01T10:20:00.000Z",
    createdBy: { name: "Client Name" },
  },
];

export const topWorkers = [
  { name: "Ahmed Ali", completedTasks: 12 },
  { name: "Mohamed Salah", completedTasks: 9 },
  { name: "Youssef Hassan", completedTasks: 7 },
];

export const topClients = [
  { name: "Client A", tasksPosted: 15 },
  { name: "Client B", tasksPosted: 10 },
  { name: "Client C", tasksPosted: 6 },
];

export const dashboardStats = [
  { title: "Total Tasks", value: 120, color: "bg-sky-500" },
  { title: "Completed Tasks", value: 78, color: "bg-green-500" },
  { title: "Active Tasks", value: 32, color: "bg-yellow-500" },
  { title: "Rejected Tasks", value: 10, color: "bg-red-500" },
];

