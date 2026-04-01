"use server";

export async function getCareerGuidance(message) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/inngest/ai-career-guidance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("API request failed");
    }

    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.error("AI Career Guidance Error:", error);
    throw new Error("AI career guidance failed");
  }
}
