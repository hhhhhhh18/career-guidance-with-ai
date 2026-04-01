import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-white px-5">
      <div className="flex items-center justify-between mb-5">
      <h1 className="
  text-4xl md:text-5xl font-bold
  text-gray-900
  dark:text-white
">
  Industry Insights
</h1>

      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
