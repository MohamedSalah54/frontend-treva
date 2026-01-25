interface TaskFilterBarProps {
  role: "client" | "admin";
  value: string;
  onChange: (value: string) => void;
}

const clientOptions = [
  { label: "تم الاستلام", value: "receive" },
  { label: "مكتملة", value: "completed" },
];

const adminOptions = [
  { label: "متاحة", value: "available" },
  { label: "قيد التنفيذ", value: "in_progress" },
  { label: "مكتملة", value: "completed" },
  { label: "قيد المراجعة", value: "under_review" },
  { label: "مرفوضة", value: "rejected" },
];

export default function TaskFilterBar({
  role,
  value,
  onChange,
}: TaskFilterBarProps) {
  const options = role === "admin" ? adminOptions : clientOptions;

  return (
    <div className="w-full max-w-3xl  px-4 py-3 flex items-center gap-3 ">
      <span className="font-medium text-gray-700">تصفية حسب</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <option value="all">الكل</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
