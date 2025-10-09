import { generateCoverLetter } from "./actions/cover-letter.js"; // adjust path if needed

const run = async () => {
  try {
    const result = await generateCoverLetter({
      jobTitle: "Frontend Developer",
      companyName: "Stripe",
      jobDescription: "We're looking for a frontend engineer to build beautiful, performant UIs using React and Tailwind.",
    });

    console.log("✅ Cover Letter:\n", result.content);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

run();