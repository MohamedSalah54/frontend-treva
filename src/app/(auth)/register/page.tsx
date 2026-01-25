import { loginImage } from "@/src/assets";
import RegisterForm from "@/src/components/forms/RegisterForm";
import Image from "next/image";

const Register = () => {
  return (
    <div className="relative min-h-[100dvh] flex justify-center items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={loginImage}
        alt="background"
        fill
        priority
        style={{ objectFit: "cover", zIndex: -1 }}
      />

      {/* Overlay optional */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Form */}
      <div className="relative z-10 w-[450px] max-w-[95%] py-12">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
