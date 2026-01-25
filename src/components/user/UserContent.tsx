interface TaskImagesProps {
  images: { secure_url: string }[];
}

export default function TaskImages({ images }: TaskImagesProps) {
  
  return (
    <div className="px-4 pb-3 flex flex-col gap-2">
      {images.map((img, index) => (
        <div
          key={index}
          className="rounded-lg overflow-hidden flex justify-center"
        >
          <img
            src={img.secure_url}
            alt={`task image ${index + 1}`}
            className="max-w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
}
