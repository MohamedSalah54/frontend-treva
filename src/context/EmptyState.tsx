import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No tasks found",
  description = "There are no tasks matching this filter.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500">
      <Inbox className="w-14 h-14 mb-4 text-gray-400" />

      <h3 className="text-lg font-semibold text-gray-700 mb-1">
        {title}
      </h3>

      <p className="text-sm max-w-xs">
        {description}
      </p>
    </div>
  );
}
