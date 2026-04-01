"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getCareerChatHistory() {
  const { userId } = await auth();
  if (!userId) return [];

  return db.careerChat.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}
