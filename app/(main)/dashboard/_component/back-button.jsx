"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="
        absolute top-6 left-4
        inline-flex items-center gap-2
        text-sm font-medium
        text-muted-foreground
        hover:text-foreground
        transition-colors
      "
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Link>
  );
}
