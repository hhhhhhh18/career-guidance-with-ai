"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getOrCreateUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let user = await db.user.findUnique({ where: { clerkUserId: userId } });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Clerk user not found");

    user = await db.user.create({
      data: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || `${userId}@temp.com`,
        name: clerkUser.firstName || "",
        imageUrl: clerkUser.imageUrl || "",
      },
    });
  }
  return user;
}

export async function generateQuiz(subcategory) {
  const user = await getOrCreateUser();

  const prompt = `
Generate 10 multiple choice interview questions for ${subcategory}.

Return ONLY a JSON object in exactly this format, with no extra text:
{
  "questions": [
    {
      "question": "What does HTML stand for?",
      "options": [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language"
      ],
      "correctAnswer": "Hyper Text Markup Language",
      "explanation": "HTML stands for Hyper Text Markup Language."
    }
  ]
}

Rules:
- options must be an array of 4 full descriptive strings, NOT letters like A/B/C/D
- correctAnswer must be the EXACT full string from the options array
- Do not use A, B, C, D as option values
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a strict JSON generator. Return ONLY valid JSON with no markdown, no explanation, no extra text." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error("API failed");

    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("No content returned");

    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Error:", cleaned);
      throw new Error("Invalid JSON");
    }

    if (!parsed || !Array.isArray(parsed.questions)) throw new Error("Invalid quiz format");

    return parsed.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}

export async function saveQuizResult(questions, answers, score, subcategory) {
  console.log("saveQuizResult called - score:", score, "answers count:", answers?.length, "subcategory:", subcategory);

  // ✅ Ensure score is a valid number
  const finalScore = typeof score === "number" && !isNaN(score) ? score : 0;

  const questionResults = questions.map((q, index) => {
    const userAnswer = answers?.[index] ?? null;
    const isCorrect =
      !!userAnswer &&
      userAnswer.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();

    return {
      question: q.question,
      answer: q.correctAnswer,
      userAnswer: userAnswer,
      isCorrect,
      explanation: q.explanation,
    };
  });

  console.log("finalScore being saved:", finalScore);

  try {
    const user = await getOrCreateUser();

    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: finalScore,
        questions: questionResults,
        category: subcategory || "General",
        improvementTip: "Keep practicing consistently!",
      },
    });

    console.log("Assessment saved with score:", assessment.quizScore);
    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return {
      quizScore: finalScore,
      questions: questionResults,
    };
  }
}

export async function getAssessments() {
  try {
    const user = await getOrCreateUser();
    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
}