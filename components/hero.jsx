"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";


const HeroSection = () => {
  return (
    <section className="w-full pt-36 md:pt-48 pb-10 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="text-center mx-auto max-w-[650px] space-y-6">
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
          Your AI Career Guidance
          <br />
          for Professional Success
        </h1>

       
        <p className="text-gray-300 md:text-xl">
          Advance your career with personalized guidance, interview prep, and
          AI-powered tools for job success.
        </p>

        
        <div className="flex justify-center mt-6">
          <Link href="/dashboard">
            <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300">
              Start Your Journey
            </button>
          </Link>
        </div>

      
        <div className="mt-10 w-full max-w-[900px] mx-auto">
          <Image
            src="/dashboardpic.jpg"
            alt="Dashboard Preview"
            width={1280}
            height={720}
            className="rounded-xl shadow-2xl border border-gray-800 w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
