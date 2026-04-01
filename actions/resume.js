"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import Groq from "groq-sdk";

/* -------------------- GROQ SETUP -------------------- */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* -------------------- USER HELPER -------------------- */
async function getOrCreateUser({ clerkUserId, email }) {
  let user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    user = await db.user.create({
      data: { clerkUserId, email },
    });
  }

  return user;
}

/* -------------------- SAVE RESUME -------------------- */
export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("Email not found");

  const user = await getOrCreateUser({ clerkUserId: userId, email });

  const resume = await db.resume.upsert({
    where: { userId: user.id },
    update: { content },
    create: { userId: user.id, content },
  });

  revalidatePath("/resume");
  return resume;
}

/* -------------------- GET RESUME -------------------- */
export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("Email not found");

  const user = await getOrCreateUser({ clerkUserId: userId, email });

  return db.resume.findUnique({
    where: { userId: user.id },
  });
}

/* -------------------- IMPROVE WITH AI (GROQ) -------------------- */
export async function improveWithAI({
  title,
  organization,
  description,
  section,
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!title) {
    throw new Error("Please enter the position/title first");
  }

  const prompt = `
You are an expert resume writer.

Generate 4–6 strong bullet points for the ${section} section.

Job Title: ${title}
Company: ${organization || "N/A"}

Rules:
- Use action verbs
- Focus on achievements
- Include metrics where possible
- ATS-friendly
- Output ONLY bullet points

Current description:
"${description}"
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a professional resume writer." },
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error("Groq improve error:", err);
    throw new Error("Failed to improve content");
  }
}
