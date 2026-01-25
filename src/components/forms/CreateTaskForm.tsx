"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useCreateTask } from "@/src/hooks/tasks/client/useCreateTask";
import { useUploadTaskImage } from "@/src/hooks/tasks/useUploadTaskImage";

export default function CreateTaskForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadTaskImage();

  const { mutate, isPending } = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        title,
        description,
        deadline,
        requestImages: images,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setDeadline("");
          setImages([]);

          onSuccess();
        },
      },
    );
  };
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
    mt-5
    w-[500px] max-w-full
    p-6 md:p-8
    rounded-2xl
    shadow-[0_10px_40px_rgba(0,0,0,0.25)]
    dark:shadow-[0_10px_40px_rgba(0,0,0,0.7)]
    flex flex-col
    gap-4
  "
    >
      <h2 className="text-center text-2xl font-bold text-[#18829C]">
        إنشاء مهمة
      </h2>

      <Input label="عنوان" value={title} onChange={setTitle} />
      <Textarea label="الوصف" value={description} onChange={setDescription} />
      <Input
        label="الموعد النهائي"
        type="date"
        value={deadline}
        onChange={setDeadline}
      />

      {/* Images Scrollable */}
      <div className="flex flex-col">
        <label className="block mb-2 font-medium text-[#18829C]">
          صور الطلب
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          id="upload-images"
          hidden
          onChange={async (e) => {
            if (!e.target.files) return;
            const files = Array.from(e.target.files);
            for (const file of files) {
              try {
                const uploaded = await uploadImage(file);
                setImages((prev) => [...prev, uploaded]);
              } catch {}
            }
          }}
        />

        <label htmlFor="upload-images">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon style={{ marginLeft: "13px" }} />}
            sx={{
              borderColor: "#18829C",
              color: "#18829C",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                borderColor: "#126478",
                backgroundColor: "rgba(24,130,156,0.08)",
              },
            }}
            fullWidth
          >
            اختر الصور
          </Button>
        </label>

        {/* الصور نفسها */}
        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden border"
              >
                <img
                  src={img.secure_url}
                  alt="preview"
                  className="h-20 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* زر Create Task ثابت أسفل الفورم */}
      <div className="mt-auto">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-[#18829C] text-white font-bold hover:bg-[#126478] transition-colors disabled:opacity-50"
        >
          {isPending ? "جارٍ الإنشاء..." : "إنشاء مهمة"}
        </button>
      </div>
    </form>
  );
}

// Input component
function Input({ label, type = "text", value, onChange }: any) {
  return (
    <div>
      <label className="block mb-1 font-medium text-[#18829C]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-[#18829C] focus:outline-none focus:ring-2 focus:ring-[#18829C]"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block mb-1 font-medium text-[#18829C]">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 rounded-lg border border-[#18829C] resize-none focus:outline-none focus:ring-2 focus:ring-[#18829C]"
      />
    </div>
  );
}
