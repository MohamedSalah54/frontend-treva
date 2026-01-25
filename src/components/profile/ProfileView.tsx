import Image from "next/image";
import { Mail, Phone, Briefcase, MessageCircle } from "lucide-react";

interface ProfileViewProps {
  data: {
    firstName: string;
    lastName: string;
    title?: string;
    email?: string;
    phoneNumber?: string;
    whatsappLink?: string;
    profileImage?: {
      secure_url?: string | null;
    };
  };
}

const PRIMARY = "rgb(24,130,156)";

export default function ProfileView({ data }: ProfileViewProps) {
  const fullName = `${data.firstName} ${data.lastName}`;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
      {/* ---------- Top Section ---------- */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Profile Image */}
        <div
          className="relative w-32 h-32 rounded-full overflow-hidden border-4"
          style={{ borderColor: PRIMARY }}
        >
          {data.profileImage?.secure_url ? (
            <Image
              src={data.profileImage.secure_url}
              alt={fullName}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ backgroundColor: PRIMARY }}
            >
              {data.firstName[0]?.toUpperCase()}
              {data.lastName[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Title */}
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-semibold">{fullName}</h2>
          <p className="text-gray-600 flex items-center gap-2 justify-center sm:justify-start">
            <Briefcase size={18} style={{ color: PRIMARY }} />
            {data.title}
          </p>
        </div>
      </div>

      {/* ---------- Info Section ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoItem
          icon={<Mail />}
          label="البريد الالكتروني"
          value={data.email ?? ""}
        />

        {data.phoneNumber && (
          <InfoItem icon={<Phone />} label="Phone" value={data.phoneNumber} />
        )}

        {data.whatsappLink && (
          <a
            href={`https://wa.me/${data.whatsappLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border hover:bg-green-50 transition"
          >
            <MessageCircle className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">واتساب</p>
              <p className="font-medium text-green-600">تواصل عبر واتساب</p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------- Small Info Item ---------- */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border">
      <span style={{ color: PRIMARY }}>{icon}</span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
