"use client";

import { useEffect, useState } from "react";
import { useRegister } from "@/src/hooks/auth/useRegister";
import { RegisterPayload } from "@/src/services/auth";
import { Role } from "@/src/types/task";
import { useAuthStore } from "@/src/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterPayload>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    role: "user",
  });

  const { user } = useAuthStore((state) => state);
  const router = useRouter();
  const { mutate, isPending } = useRegister();

  useEffect(() => {
    if (user?.role !== "admin") {
      toast.error("هذه الصفحة متاحة للأدمن فقط");
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value as any });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  if (user?.role !== "admin") return null;

  return (
    <div className="min-h-[80dvh] flex justify-center py-10 px-4">
      <div className="w-[450px] max-w-[95%] bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-center text-[22px] font-bold mb-6 text-[#18829C]">
          إنشاء حساب جديد
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="الإسم الأول"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            label="الإسم الأخير"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <Input
            label="رقم الهاتف"
            name="phoneNumber"
            type="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <Input
            label="كلمة المرور"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {/* <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          /> */}

          <div>
            <label className="block mb-1 font-medium text-[#18829C]">
              الصلاحية
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as Role,
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#18829C] focus:outline-none focus:ring-2 focus:ring-[#18829C]"
            >
              <option value="admin">أدمن</option>
              <option value="client">عميل</option>
              <option value="user">مستخدم</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 py-3 rounded-lg bg-[#18829C] text-white font-bold hover:bg-[#126478] transition-colors disabled:opacity-50"
          >
            {isPending ? "جاري إنشاء حساب ..." : "إانشاء حساب"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-[#18829C]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 rounded-lg border border-[#18829C] focus:outline-none focus:ring-2 focus:ring-[#18829C]"
      />
    </div>
  );
}
