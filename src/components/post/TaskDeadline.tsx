import { Calendar } from "lucide-react";

export default function TaskDeadline({ deadline }: { deadline: string }) {
  return (
    <div className="px-4 py-3 border-t text-sm text-gray-600 flex items-center gap-2">
      <Calendar size={16} />
      الموعد النهائي: {new Date(deadline).toLocaleDateString()}
    </div>
  );
}
