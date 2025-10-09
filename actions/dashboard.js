"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

export const generateAIInsights = async (industry) => {
  const prompt = `
You are an expert career analyst. Provide structured insights about the ${industry} industry in JSON format. Include:

- salaryRanges: [{ role, min, max, median, location }]
- growthRate: number
- demandLevel: string
- topSkills: string[]
- marketOutlook: string
- keyTrends: string[]
- recommendedSkills: string[]

Respond only with valid JSON.
`;

  const response = await fetch(HUGGINGFACE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 512 },
    }),
  });

  const result = await response.json();
  const raw = result?.generated_text || result?.[0]?.generated_text || "";

  console.log("Raw AI response:", raw);

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    console.warn("No JSON found. Using fallback.");
    return {
      salaryRanges: [
        { role: "Software Engineer", min: 500000, max: 1500000, median: 1000000, location: "India" },
      ],
      growthRate: 7.2,
      demandLevel: "High",
      topSkills: ["React", "Next.js", "TypeScript"],
      marketOutlook: "Positive",
      keyTrends: ["AI integration", "Remote work", "Cloud adoption"],
      recommendedSkills: ["Tailwind", "Clerk", "Hugging Face API"],
    };
  }

  try {
    return JSON.parse(match[0]);
  } catch (error) {
    console.error("Failed to parse AI response:", match[0]);
    throw new Error("Invalid AI response format");
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}