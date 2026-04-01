import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
  return NextResponse.json({
    status: "AI Career Guidance API is alive ✅",
  });
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId } = await req.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    /* 1️⃣ Save USER message */
    await db.message.create({
      data: {
        conversationId,
        role: "user",
        content: message,
      },
    });

    /* 2️⃣ Fetch recent messages for memory */
    const prevMessages = await db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    /* 3️⃣ Prepare messages for Groq */
    const groqMessages = [
      {
        role: "system",
        content:
          "You are an expert AI career advisor. Give clear, friendly, actionable career guidance.",
      },
      ...prevMessages.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    ];

    /* 4️⃣ Call Groq */
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: groqMessages,
    });

    const aiReply = completion.choices[0].message.content;

    /* 5️⃣ Save AI reply */
    await db.message.create({
      data: {
        conversationId,
        role: "ai",
        content: aiReply,
      },
    });

    /* 6️⃣ AI-BASED SMART TITLE (ChatGPT-style) */
    const userMessages = prevMessages.filter(
      (m) => m.role === "user"
    );

    // Generate title only ONCE, after enough context
    if (userMessages.length === 2) {
      const titlePrompt = [
        {
          role: "system",
          content:
            "Generate a short, clear chat title (max 6 words). No quotes. Summarize the topic.",
        },
        {
          role: "user",
          content: userMessages.map((m) => m.content).join("\n"),
        },
      ];

      const titleCompletion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: titlePrompt,
      });

      const generatedTitle =
        titleCompletion.choices[0].message.content
          .replace(/["']/g, "")
          .trim();

      await db.conversation.update({
        where: { id: conversationId },
        data: { title: generatedTitle },
      });
    }

    return NextResponse.json({ reply: aiReply });
  } catch (err) {
    console.error("❌ GROQ / DB ERROR:", err);
    return NextResponse.json(
      { error: "Failed to process career guidance" },
      { status: 500 }
    );
  }
}
