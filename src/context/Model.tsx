interface ModalProps {
  title: string;
  content: React.ReactNode;
  onClose?: () => void;
}

export function Modal({ title, content, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✖
          </button>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
}