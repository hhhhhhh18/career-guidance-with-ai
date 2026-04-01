"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";


const HeroSection = () => {
  return (
    <section
  className="
    relative w-full
    pt-40 md:pt-52 pb-24
    bg-background
    dark:bg-gradient-to-b
    dark:from-gray-900
    dark:via-gray-800
    dark:to-background
    text-foreground
  "
>
  <div className="container mx-auto px-6">
    <div className="text-center mx-auto max-w-3xl space-y-6">

      {/* Headline */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
        Your AI Career Guidance
        <br />
        <span className="text-primary">for Professional Success</span>
      </h1>

      {/* Subtext */}
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Advance your career with personalized guidance, interview prep,
        and AI-powered tools designed to help you succeed faster.
      </p>

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <Link href="/dashboard">
          <button
            className="
              bg-blue-600 text-white
              px-10 py-4
              rounded-xl
              font-semibold
              shadow-lg
              hover:bg-blue-700
              hover:scale-105
              transition-all
              duration-300
            "
          >
            Start Your Journey
          </button>
        </Link>
      </div>

      {/* Dashboard Preview */}
      <div className="pt-14 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
          <Image
            src="/dashboardpic.jpg"
            alt="Dashboard Preview"
            width={1280}
            height={720}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

    </div>
  </div>
</section>

  );
};

export default HeroSection;
