"use client";

import { useState, useEffect } from "react";
import { interviewQuestions } from "@/data/interviewQuestions";

export default function DailyChallenge({ isOpen, onClose }) {
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  // 🔥 Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDifficulty(null);
      setQuestions([]);
      setOpenIndex(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startChallenge = (level) => {
    const allQ = interviewQuestions[level];

    // pick 5 random questions
    const shuffled = [...allQ].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    setDifficulty(level);
    setQuestions(selected);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto">

        <h2 className="text-2xl font-bold mb-4">
          Daily Interview Challenge
        </h2>

        {!difficulty ? (
          <div className="flex gap-4 justify-center">
            <button onClick={() => startChallenge("easy")} className="btn">Easy</button>
            <button onClick={() => startChallenge("medium")} className="btn">Medium</button>
            <button onClick={() => startChallenge("hard")} className="btn">Hard</button>
          </div>
        ) : (
          <div>
            <h3 className="mb-4 font-semibold">
              {difficulty.toUpperCase()} Questions
            </h3>

            <ul className="space-y-3">
              {questions.map((q, i) => (
                <li
                  key={i}
                  onClick={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <p className="font-medium">
                    {i + 1}. {q.question}
                  </p>

                  {openIndex === i && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {q.answer}
                    </p>
                  )}
                </li>
              ))}
            </ul>
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