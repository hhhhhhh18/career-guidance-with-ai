"use client";

import { useState, useEffect } from "react";
import { industries } from "@/data/industries";

export default function IndustryExplorer({ isOpen, onClose }) {
  const [selected, setSelected] = useState(null);

  // 🔥 Scroll lock fix
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[90%] max-w-5xl max-h-[85vh] overflow-y-auto">

        <h2 className="text-2xl font-bold mb-4">
          Explore Industries
        </h2>
        
        {!selected ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {industries.map((ind) => (
              <div
                key={ind.id}
                onClick={() => setSelected(ind)}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {ind.name}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelected(null)}
              className="mb-4 text-blue-500"
            >
              ← Back
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {selected.name}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selected.subIndustries.map((sub, i) => (
                <div
                  key={i}
                  className="p-3 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {sub}
                </div>
              ))}
            </div>
          </div>
        )}

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