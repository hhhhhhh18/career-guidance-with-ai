"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [subcategory, setSubcategory] = useState("");

  const answersRef = useRef([]);
  const quizDataRef = useRef(null);
  const quizInitialized = useRef(false);

  const subcategories = [
    "Frontend", "Backend", "DevOps", "Cybersecurity",
    "Data Science", "AI/ML", "Cloud",
  ];

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch((type) => generateQuiz(type));

  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    if (quizData) quizDataRef.current = quizData;
  }, [quizData]);

  useEffect(() => {
    if (quizData && quizData.length > 0 && !quizInitialized.current) {
      quizInitialized.current = true;
      const initial = new Array(quizData.length).fill(null);
      answersRef.current = initial;
      setAnswers(initial);
    }
  }, [quizData]);

  const handleAnswer = (option) => {
    const newAnswers = [...answersRef.current];
    newAnswers[currentQuestion] = option;
    answersRef.current = newAnswers;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizDataRef.current.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const finishQuiz = async () => {
    const snapshotAnswers = [...answersRef.current];
    const snapshotQuiz = [...(quizDataRef.current || [])];

    if (snapshotQuiz.length === 0) {
      toast.error("Quiz data missing");
      return;
    }

    const isCorrect = (userAnswer, correctAnswer) =>
      !!userAnswer &&
      userAnswer.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();

    const correctCount = snapshotQuiz.reduce((acc, q, i) =>
      acc + (isCorrect(snapshotAnswers[i], q.correctAnswer) ? 1 : 0), 0);

    const score = (correctCount / snapshotQuiz.length) * 100;

    // ✅ Log in browser console to confirm score and answers
    console.log("finishQuiz - score:", score);
    console.log("finishQuiz - snapshotAnswers:", JSON.stringify(snapshotAnswers));

    const questionResults = snapshotQuiz.map((q, index) => ({
      question: q.question,
      answer: q.correctAnswer,
      userAnswer: snapshotAnswers[index] ?? "Not answered",
      isCorrect: isCorrect(snapshotAnswers[index], q.correctAnswer),
      explanation: q.explanation,
    }));

    // Show result immediately
    setResultData({
      quizScore: score,
      questions: questionResults,
      improvementTip: "Keep practicing consistently!",
    });

    // Save to server
    try {
      const saved = await saveQuizResult(snapshotQuiz, snapshotAnswers, score, subcategory);
      console.log("Saved to DB:", saved?.quizScore);
      toast.success("Quiz completed!");
    } catch (error) {
      console.error("Save error:", error?.message);
      toast.error("Result shown locally — server save failed");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSubcategory("");
    answersRef.current = [];
    quizDataRef.current = null;
    quizInitialized.current = false;
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Select IT Subcategory</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Choose the type of IT questions you'd like to practice:
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {subcategories.map((type) => (
              <Button
                key={type}
                variant={subcategory === type ? "default" : "outline"}
                onClick={() => setSubcategory(type)}
                className="w-full"
              >
                {type}
              </Button>
            ))}
          </div>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your selection.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              if (!subcategory) {
                toast.error("Please select a category before starting");
                return;
              }
              generateQuizFn(subcategory);
            }}
            className="w-full"
          >
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (quizData.length === 0) return <p>No quiz data available</p>;

  const question = quizData[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleAnswer(option)}
                className={`w-full flex items-center gap-3 p-3 border rounded-md text-left transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    isSelected
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-400 text-gray-500"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handlePrev} variant="outline" disabled={currentQuestion === 0}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!selectedAnswer} className="ml-auto">
          {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}