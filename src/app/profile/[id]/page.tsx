"use client";

import { useParams, useRouter } from "next/navigation";
import ProfileView from "@/src/components/profile/ProfileView";
import TaskHistory from "@/src/components/profile/TaskHistory";
import { usePublicProfile } from "@/src/hooks/profile/usePublicProfile";
import AppLoader from "@/src/ui/AppLoader";
import EmptyState from "@/src/ui/EmptyState";
import { User } from "lucide-react";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, isError, error } = usePublicProfile(id, {
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="text-center py-20">
        {" "}
        <AppLoader text="جاري تحميل الصفحة الشخصية..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-20">
        <EmptyState
          icon={<User size={56} />}
          title="لا يوجد ملف شخصي"
          description="لا توجد بيانات لعرضها"
          actionText="العودة إلى الصفحة الرئيسية"
          onAction={() => router.push("/")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 space-y-6">
      <ProfileView data={data} />
      <TaskHistory userId={data?._id} />
    </div>
  );
}
