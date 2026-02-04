interface TaskImagesProps {
  images?: {
    secure_url: string;
    public_id?: string;
  }[];
}

export default function TaskImages({ images }: TaskImagesProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="px-4 pb-3 flex flex-col gap-2">
      {images.map((img, index) => (
        <div
          key={index}
          className="rounded-lg overflow-hidden flex justify-center"
        >
          <img
            src={img.secure_url}
            alt="task image"
            className="max-w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
}

