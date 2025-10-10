import { NextResponse } from "next/server";
import { generateCoverLetter } from "../../../actions/cover-letter.js";

export async function GET() {
  try {
    const result = await generateCoverLetter({
      jobTitle: "Frontend Developer",
      companyName: "Stripe",
      jobDescription: "We're looking for a frontend engineer to build beautiful, performant UIs using React and Tailwind.",
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}