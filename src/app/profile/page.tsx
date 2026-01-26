// "use client";

// import { useAuthStore } from "@/src/store/auth.store";
// import ProfileImage from "@/src/components/profile/ProfileImage";
// import ProfileInfo from "@/src/components/profile/ProfileInfo";
// import ProfileView from "@/src/components/profile/ProfileView";
// import TaskHistory from "@/src/components/profile/TaskHistory";
// import { usePublicProfile } from "@/src/hooks/profile/usePublicProfile";
// import { useMyProfile } from "@/src/hooks/profile/useMyProfile";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useLoadUser } from "@/src/hooks/auth/useLoadUser";

// interface ProfilePageProps {
//   params?: { id?: string };
// }

// export default function ProfilePage({ params }: ProfilePageProps) {
//   const { loading } = useLoadUser();
//   const router = useRouter();
//   const currentUser = useAuthStore((state) => state.user);

//   useEffect(() => {
//     if (!loading && !currentUser) {
//       router.replace("/login");
//     }
//   }, [loading, currentUser, router]);

//   const userId = params?.id;

//   const myProfileQuery = useMyProfile({
//     enabled: !userId && !!currentUser && !loading,
//   });

//   const publicProfileQuery = usePublicProfile(userId, {
//     enabled: !loading,
//   });

//   const profileQuery = userId ? publicProfileQuery : myProfileQuery;
//   const { data: profileData, isLoading, isError } = profileQuery;

//   if (isLoading)
//     return <div className="text-center py-20">Loading profile...</div>;

//   if (isError || !profileData)
//     return <div className="text-center py-20">Profile not found</div>;

//   const isOwner = currentUser?.email === profileData.email;

//   return (
//     <div className="min-h-screen bg-gray-100 px-4 py-6 space-y-6">
//       {isOwner ? (
//         <>
//           <ProfileImage user={profileData} />
//           <ProfileInfo data={profileData} />
//         </>
//       ) : (
//         <ProfileView data={profileData} />
//       )}

//       <TaskHistory role={profileData.role} tasks={profileData.tasks || []} />
//     </div>
//   );
// }

"use client";

import { useAuthStore } from "@/src/store/auth.store";
import ProfileImage from "@/src/components/profile/ProfileImage";
import ProfileInfo from "@/src/components/profile/ProfileInfo";
import TaskHistory from "@/src/components/profile/TaskHistory";
import { useMyProfile } from "@/src/hooks/profile/useMyProfile";
import { useLoadUser } from "@/src/hooks/auth/useLoadUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLoader from "@/src/ui/AppLoader";
import EmptyState from "@/src/ui/EmptyState";
import { User } from "lucide-react";

export default function MyProfilePage() {
  const { loading } = useLoadUser();
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace("/login");
    }
  }, [loading, currentUser, router]);

  const { data, isLoading, isError } = useMyProfile({
    enabled: !!currentUser && !loading,
  });

  if (isLoading)
    return (
      <div className="text-center py-20">
        <AppLoader text="جاري تحميل الصفحة الشخصية..." />.
      </div>
    );
  if (isError || !data)
    return (
      <EmptyState
        icon={<User size={56} />}
        title="لا يوجد ملف شخصي"
        description="لا توجد بيانات لعرضها"
        actionText="العودة إلى الصفحة الرئيسية"
        onAction={() => router.push("/")}
      />
    );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 space-y-6">
      <ProfileImage />
      <ProfileInfo data={data} />
      <TaskHistory userId={data?._id} />
    </div>
  );
}
