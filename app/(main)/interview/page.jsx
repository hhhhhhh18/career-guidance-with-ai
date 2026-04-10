import BackToHome from "@/components/back-to-home";
import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();
  const totalQuizzes = assessments.length;

const averageScore =
  totalQuizzes > 0
    ? (
        assessments.reduce((acc, a) => acc + (a.quizScore || 0), 0) /
        totalQuizzes
      ).toFixed(1)
    : 0;

const latestScore =
  totalQuizzes > 0 ? assessments[0]?.quizScore?.toFixed(1) : 0;

const totalQuestions = assessments.reduce(
  (acc, a) => acc + (a.questions?.length || 0),
  0
);
  return (
    <>
          <BackToHome />

    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
    </>
  );
}
