"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackToHome() {
  return (
    <Link
      href="/"
      className="
        fixed top-20 left-4 z-50
        inline-flex items-center gap-2
        text-sm font-medium
        text-muted-foreground
        hover:text-foreground
        transition-colors
      "
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Home
    </Link>
  );
}
