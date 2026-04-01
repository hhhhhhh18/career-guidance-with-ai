"use client";

import { useState } from "react";

export default function OnboardingModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [role, setRole] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    const userData = {
      name,
      skills,
      role,
    };

    // ✅ Store data
    localStorage.setItem("userProfile", JSON.stringify(userData));

    // ✅ Trigger parent action (VERY IMPORTANT)
    if (onSave) onSave(userData);

    // ✅ Close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[90%] max-w-md">

        <h2 className="text-xl font-bold mb-4">
          Tell us about yourself
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Your Skills (React, Java...)"
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Interested Role (Frontend, AI...)"
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}