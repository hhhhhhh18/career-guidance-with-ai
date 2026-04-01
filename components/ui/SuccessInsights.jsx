"use client";

export default function SuccessInsights({ isOpen, onClose }) {
  if (!isOpen) return null;

  // 🔥 Mock data (replace later with real user data)
  const data = {
    accuracy: 78,
    attempted: 24,
    strong: ["HTML", "CSS", "React"],
    weak: ["JavaScript Closures", "Event Loop"],
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[90%] max-w-3xl max-h-[85vh] overflow-y-auto">

        <h2 className="text-2xl font-bold mb-6">
          Your Performance Insights
        </h2>

        {/* 📊 Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg text-center">
            <p className="text-lg font-semibold">Accuracy</p>
            <p className="text-2xl font-bold text-green-600">
              {data.accuracy}%
            </p>
          </div>

          <div className="p-4 border rounded-lg text-center">
            <p className="text-lg font-semibold">Questions Attempted</p>
            <p className="text-2xl font-bold">
              {data.attempted}
            </p>
          </div>
        </div>

        {/* 💪 Strong Areas */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-green-600">
            Strong Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.strong.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ⚠️ Weak Areas */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-red-600">
            Areas to Improve
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.weak.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 🤖 AI Insight */}
        <div className="p-4 border rounded-lg bg-muted">
          <p className="font-semibold mb-1">AI Insight</p>
          <p className="text-sm text-muted-foreground">
            You are performing well in frontend technologies. Focus more on JavaScript concepts like closures and event loop to improve your interview success rate.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-black text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}