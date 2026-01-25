import Image from "next/image";
import { logoWhite } from "../assets";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import toast from "react-hot-toast";
import { FiUser, FiLogOut } from "react-icons/fi";
import { logoutRequest } from "../services/auth";

export default function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutRequest();
      logout();
      router.replace("/login");
    } catch (err) {
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () =>
    `${user?.firstName?.[0]?.toUpperCase() || ""}${
      user?.lastName?.[0]?.toUpperCase() || ""
    }`;

  return (
<nav className="w-full bg-[rgb(24,130,156)] px-6 h-[90px] flex items-center justify-between">
  {/* ===== Left ===== */}
  <div className="flex items-center">
    {/* Logo */}
    <Image
      src={logoWhite}
      alt="Logo"
      priority
      className="
        cursor-pointer
        w-24
        sm:w-28
        md:w-32
        h-auto
        object-contain
      "
      onClick={() => router.push("/")}
    />
  </div>

  {/* ===== Right ===== */}
  {user && (
    <div className="flex items-center gap-6 relative">
      {/* Admin Links */}
      {user?.role === "admin" && (
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/statistics")}
            className="
              text-white/90
              text-[15px]
              font-normal
              tracking-wide
              hover:text-white
              border-b-2 border-transparent
              hover:border-white
              transition
            "
          >
            لوحة التحكم
          </button>

          <button
            onClick={() => router.push("/register")}
            className="
              text-white/90
              text-[15px]
              font-normal
              tracking-wide
              hover:text-white
              border-b-2 border-transparent
              hover:border-white
              transition
            "
          >
            إنشاء حساب جديد
          </button>
        </div>
      )}

      {/* User Avatar */}
      <div className="relative">
        <div
          onClick={() => setShowDropdown((prev) => !prev)}
          className="
            relative
            w-10 h-10
            sm:w-11 sm:h-11
            rounded-full
            overflow-hidden
            border-2 border-white
            cursor-pointer
            bg-gray-400
            flex items-center justify-center
            text-white
            font-semibold
          "
        >
          {user?.profileImage?.secure_url ? (
            <Image
              src={user.profileImage.secure_url}
              alt="Profile"
              fill
              className="object-cover rounded-full"
            />
          ) : (
            <span className="text-sm">{getInitials()}</span>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="
              absolute left-0 mt-3
              w-44
              bg-white
              shadow-lg
              rounded-md
              overflow-hidden
              z-50
            "
          >
            <button
              onClick={() => router.push("/profile")}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FiUser /> الحساب
            </button>

            <button
              onClick={() => {
                handleLogout();
                toast.success("تم تسجيل الخروج");
                router.push("/login");
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FiLogOut /> تسجيل الخروج
            </button>
          </div>
        )}
      </div>
    </div>
  )}
</nav>

  );
}
