import { X } from "lucide-react";

function PreviewModal({ submission, onClose }) {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Modal container */}
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-4">
          {submission.title}
        </h2>

        {/* Scripture */}
        <div className="mb-4">
          <div className="text-sm text-gray-400">Scripture:</div>
          <div className="text-purple-300 italic">
            "{submission.scripture}"
          </div>
        </div>

        {/* Full Body */}
        <div className="prose prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: submission.body }}
          />
        </div>

        {/* Author */}
        {submission.writer && (
          <div className="mt-6 flex items-center space-x-3">
            {submission.writer.profile_image && (
              <img
                src={submission.writer.profile_image}
                alt={submission.writer.name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <span className="text-gray-300">{submission.writer.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewModal;
