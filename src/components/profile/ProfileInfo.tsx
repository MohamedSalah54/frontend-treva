"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Briefcase, User, MessageCircle } from "lucide-react";
import { useUpdateProfile } from "@/src/hooks/profile/useUpdateProfile";
import { whatsappLogo } from "@/src/assets";
import Image from "next/image";

type UpdateProfilePayload = {
  profileImage?: any;
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string; // أضفنا email هنا
  phoneNumber?: string;
  whatsappLink?: string;
};

interface ProfileInfoProps {
  data: UpdateProfilePayload;
}

const PRIMARY = "rgb(24,130,156)";

export default function ProfileInfo({ data }: ProfileInfoProps) {
  const { mutate, isPending } = useUpdateProfile();

  const [form, setForm] = useState<UpdateProfilePayload>({
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phoneNumber: "",
    whatsappLink: "",
    profileImage: undefined,
    ...data,
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...data }));
  }, [data]);

  const handleChange = (key: keyof UpdateProfilePayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // const handleSave = () => {
  //   const payload: UpdateProfilePayload = {
  //     firstName: form.firstName,
  //     lastName: form.lastName,
  //     title: form.title,
  //     phoneNumber: form.phoneNumber,
  //     whatsappLink: form.whatsappLink,
  //     profileImage: form.profileImage,
  //   };

  //   mutate(payload);
  // };
  const handleSave = () => {
    const payload: Partial<UpdateProfilePayload> = {
      firstName: form.firstName,
      lastName: form.lastName,
      title: form.title,
      whatsappLink: form.whatsappLink,
      profileImage: form.profileImage,
    };

    if (form.phoneNumber) {
      payload.phoneNumber = form.phoneNumber.replace(/\D/g, "");
    }

    mutate(payload);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-gray-100 rounded-2xl  p-6 space-y-6">
      <h2 className="text-lg font-semibold" style={{ color: PRIMARY }}>
        المعلومات الشخصية
      </h2>

      <InputRow
        icon={<User />}
        label="الإسم الأول"
        value={form.firstName || ""}
        placeholder="Enter your first name"
        onChange={(v) => handleChange("firstName", v)}
      />

      <InputRow
        icon={<User />}
        label="الإسم الأخير"
        value={form.lastName || ""}
        placeholder="Enter your last name"
        onChange={(v) => handleChange("lastName", v)}
      />

      <InputRow
        icon={<Briefcase />}
        label="التخصص الوظيفي"
        value={form.title || ""}
        placeholder="e.g. MERN Stack Developer"
        onChange={(v) => handleChange("title", v)}
      />

      <InputRow
        icon={<Mail />}
        label="البريد الإلكتروني"
        value={form.email || ""}
        placeholder="example@email.com"
        onChange={(v) => handleChange("email", v)}
      />

      <InputRow
        icon={<Phone />}
        label="رقم الهاتف"
        value={form.phoneNumber || ""}
        placeholder="+20 100 000 0000"
        onChange={(v) => handleChange("phoneNumber", v)}
      />

      <InputRow
        icon={
          <div className="-ml-4">
            <Image src={whatsappLogo} alt="WhatsApp" width={56} height={56} />
          </div>
        }
        label="WhatsApp Link"
        value={form.whatsappLink || ""}
        placeholder="01******"
        onChange={(v) => handleChange("whatsappLink", v)}
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isPending}
        className="
            w-full
            py-3
            rounded-xl
            text-white
            font-medium
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        style={{ backgroundColor: PRIMARY }}
      >
        {isPending ? "جاري الحفظ..." : "حفظ التغيرات"}
      </button>
    </div>
  );
}

/* ---------- Input Row ---------- */

// function InputRow({
//   icon,
//   label,
//   value,
//   placeholder,
//   onChange, // optional
//   readOnly = false,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   placeholder: string;
//   onChange?: (value: string) => void; // دلوقتي اختياري
//   readOnly?: boolean;
// }) {
//   return (
//     <div className="space-y-1">
//       <label className="text-sm font-medium text-gray-600">{label}</label>

//       <div className="relative">
//         <span
//           className="absolute left-3 top-1/2 -translate-y-1/2"
//           style={{ color: PRIMARY }}
//         >
//           {icon}
//         </span>

//         <input
//           type="text"
//           value={value}
//           placeholder={placeholder}
//           onChange={(e) => onChange && onChange(e.target.value)}
//           className="
//             w-full
//             pl-10
//             pr-3
//             py-2.5
//             border
//             rounded-xl
//             outline-none
//             text-sm
//             transition
//             focus:ring-2
//             focus:ring-[rgb(24,130,156)]
//             focus:border-[rgb(24,130,156)]
//           "
//         />
//       </div>
//     </div>
//   );
// }

function InputRow({
  icon,
  label,
  value,
  placeholder,
  onChange,
  readOnly = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  const isWhatsapp = label === "WhatsApp Link";

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>

      <div className="relative">
        {/* Icon */}
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: PRIMARY }}
        >
          {icon}
        </span>

        {/* Prefix ثابت */}
        {isWhatsapp && (
          <span className="absolute left-14 top-1/2 -translate-y-1/2 font-bold text-gray-600 text-sm select-none">
            https://wa.me/
          </span>
        )}

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) =>
            onChange &&
            onChange(
              isWhatsapp ? e.target.value.replace(/\D/g, "") : e.target.value,
            )
          }
          className={`
            w-full
            ${isWhatsapp ? "pl-[160px]" : "pl-10"}
            pr-3
            py-2.5
            border
            rounded-xl
            outline-none
            text-sm
            transition
            focus:ring-2
            focus:ring-[rgb(24,130,156)]
            focus:border-[rgb(24,130,156)]
          `}
        />
      </div>
    </div>
  );
}
