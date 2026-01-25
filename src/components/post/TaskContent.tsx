interface TaskContentProps {
  title: string;
  description: string;
}

export default function TaskContent({
  title,
  description,
}: TaskContentProps) {
  return (
    <div className="px-4 pb-3">
      <h2 className="font-semibold text-lg mb-1">{title}</h2>
      <p className="text-gray-800 whitespace-pre-line">{description}</p>
    </div>
  );
}
