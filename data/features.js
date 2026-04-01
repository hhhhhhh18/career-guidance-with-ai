import { Brain, GraduationCap, BarChart3, FileText } from "lucide-react";

export const features = [
  {
    title: "AI-Powered Career Guidance",
    description: "Not sure what to do next in your career? Let AI analyze your profile and guide you with personalized advice",
    icon: <Brain className="h-8 w-8" />,
    action: "open-ai-chat"
  },
  
  {
    title: "Interview Preparation",
    description:
      "Practice with role-specific questions and get instant feedback to improve your performance.",
    icon: <GraduationCap className="h-8 w-8" />,
    href: "/interview",
  },
  {
    title: "Industry Insights",
    description:
      "Stay ahead with real-time industry trends, salary data, and market analysis.",
    icon: <BarChart3 className="h-8 w-8" />,
    href: "/dashboard",
  },
  {
    title: "Smart Resume Creation",
    description:
      "Generate ATS-optimized resumes with AI assistance.",
    icon: <FileText className="h-8 w-8" />,
    href: "/resume",
  },
];
