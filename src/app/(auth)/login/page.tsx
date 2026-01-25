"use client";

import Image from "next/image";
import { loginImage } from "@/src/assets";
import LoginForm from "@/src/components/forms/LoginForm";
import { useAuthStore } from "@/src/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLoadUser } from "@/src/hooks/auth/useLoadUser";

const Login = () => {
  const router = useRouter();
  const { loading } = useLoadUser();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/"); 
    }
  }, [loading, user, router]);

  if (loading || user) return null; 

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Image
        src={loginImage}
        alt="background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 h-full overflow-hidden">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
