import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// GET: Fetch messages for a specific conversation
export async function GET(request, { params }) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: id,
        userId: userId, // Security check: ensure the chat belongs to the user
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Fetch Conversation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove a conversation
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This will also delete messages if you have onDelete: Cascade in Prisma
    await db.conversation.delete({
      where: {
        id: id,
        userId: userId,
      },
    });

    return NextResponse.json({ message: "Conversation deleted" });
  } catch (error) {
    console.error("Delete Conversation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}