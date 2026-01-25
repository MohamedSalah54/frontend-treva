import AdminDashboard from "@/src/components/dashboard/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">لوحة تحكم الأدمن</h1>
      <AdminDashboard />
    </div>
  );
}
