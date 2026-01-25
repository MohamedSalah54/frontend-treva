"use client";

import { useEffect, useState } from "react";
import { useLogin } from "@/src/hooks/auth/useLogin";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth.store";
import { useLoadUser } from "@/src/hooks/auth/useLoadUser";

export default function LoginForm() {
  const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
  const { mutate, isPending, error } = useLogin();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-cover bg-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#18829C]">
          مرحبًا بعودتك 🤩
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="phoneNumber"
            name="phoneNumber"
            placeholder="رقم الهاتف"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="border border-[#18829C] rounded px-4 py-2"
          />

          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            className="border border-[#18829C] rounded px-4 py-2"
          />

          <button
            type="submit"
            disabled={isPending}
            className="bg-[#18829C] text-white py-2 rounded font-semibold"
          >
            {isPending ?  "جاري تسجيل الدخول...." : "تسجيل الدخول"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">فشل في تسجيل الدخول</p>
          )}
        </form>
      </div>
    </div>
  );
}
