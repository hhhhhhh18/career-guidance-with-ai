"use client";
import AICareerChat from "@/components/ai-career-chat";
import IndustryExplorer from "@/components/ui/IndustryExplorer";
import React, { useState } from "react";
import Link from "next/link";
import DailyChallenge from "@/components/ui/DailyChallenge";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/hero";
import { useRouter } from "next/navigation";
import SuccessInsights from "@/components/ui/SuccessInsights";
import OnboardingModal from "@/components/ui/OnboardingModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";
// import AICareerChat from "@/components/ai-career-chat"; // later

export default function LandingPage() {
  // ✅ STEP 2: state added correctly
  
const router = useRouter();
const [userProfile, setUserProfile] = useState(null);
  const [openChallenge, setOpenChallenge] = useState(false);
  const [openCareerAI, setOpenCareerAI] = useState(false);
  const [openIndustries, setOpenIndustries] = useState(false);
  const [openInsights, setOpenInsights] = useState(false);
  const [openOnboarding, setOpenOnboarding] = useState(false);
  return (
    <>
      <div id="main-content" className="transition-opacity duration-300">
        <div className="grid-background"></div>

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Powerful Features for Your Career Growth
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const card = (
                  <Card
                    onClick={() => {
                      // ✅ STEP 3: card click logic
                      if (feature.action === "open-ai-chat") {
                        setOpenCareerAI(true);
                      }
                    }}
                    className={`
                      h-full transition-all duration-300
                      ${
                        feature.href || feature.action
                          ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl"
                          : "opacity-60 cursor-default"
                      }
                    `}
                  >
                    <CardContent className="pt-6 text-center flex flex-col items-center space-y-3">
                      {feature.icon}
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );

                // ✅ Only wrap with Link when href exists
                return feature.href ? (
                  <Link key={index} href={feature.href}>
                    {card}
                  </Link>
                ) : (
                  <div key={index}>{card}</div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
  { value: "50+", label: "Industries Covered", action: "industries" },
  { value: "100+", label: "Interview Questions",action:"challenge" },
  { value: "95%", label: "Success Rate",action:"insights" },
  { value: "24/7", label: "AI Support",action: "ai-chat" },
  
].map((stat, index) => (
  <div
    key={index}
    onClick={() => {
      if (stat.action === "industries") {
        setOpenIndustries(true);
      }
      if (stat.action === "challenge") {
        setOpenChallenge(true);
      }
      if (stat.action === "insights") {
        setOpenInsights(true);
      }
      if (stat.action === "ai-chat") {
        setOpenCareerAI(true);
      }
    }}
    className={`
      group flex flex-col items-center justify-center
      bg-card rounded-2xl p-6 shadow-sm
      hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center
      ${stat.action ? "cursor-pointer" : ""}
    `}
  >
                  <h3 className="text-4xl md:text-5xl font-extrabold text-foreground group-hover:scale-105 transition">
                    {stat.value}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                Four simple steps to accelerate your career growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">


{howItWorks.map((item, index) => (
  <div
    key={index}
    onClick={() => {
      if (item.action === "onboarding") {
        setOpenOnboarding(true); // we will create this
      }
      if (item.action === "documents") {
        router.push("/resume");
      }
      if (item.action === "interview") {
        setOpenChallenge(true);
      }
      if (item.action === "progress") {
        setOpenInsights(true);
      }
    }}
    className="group flex flex-col items-center text-center space-y-4 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
  >
                  <div className="w-16 h-16 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-24 bg-background dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Join thousands of professionals advancing with AI guidance.
              </p>
              <Link href="/dashboard">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all">
                  Start Your Journey Today
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      {openCareerAI && (
  <AICareerChat
    userProfile={userProfile}
    onClose={() => setOpenCareerAI(false)}
  />
)}
<IndustryExplorer
  isOpen={openIndustries}
  onClose={() => setOpenIndustries(false)}
/>
<DailyChallenge
  isOpen={openChallenge}
  onClose={() => setOpenChallenge(false)}
/> 
<SuccessInsights
  isOpen={openInsights}
  onClose={() => setOpenInsights(false)}
/>
<OnboardingModal
  isOpen={openOnboarding}
  onClose={() => setOpenOnboarding(false)}
  onSave={(data) => {
    // ✅ store globally
    setUserProfile(data);

    // ✅ open AI chat
    setOpenCareerAI(true);
  }}
/>
    </>
  );
}
