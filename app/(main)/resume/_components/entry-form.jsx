// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

/* ===== DATE HELPERS (UNCHANGED) ===== */
const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const YEARS = Array.from(
  { length: 40 },
  (_, i) => `${new Date().getFullYear() - i}`
);

const displayDateRange = (start, end, current) => {
  if (!start && !end && !current) return "Date not specified";
  if (current && start) return `${start} – Present`;
  if (start && end) return `${start} – ${end}`;
  if (start) return `${start} – Present`;
  return "Date not specified";
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      endDate: data.current ? "" : data.endDate,
    };

    onChange([...entries, formattedEntry]);
    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  /* ===== AI HANDLER (JOB TITLE REQUIRED) ===== */
  const handleImproveDescription = async () => {
    const title = watch("title");
    const description = watch("description");

    if (!title || !title.trim()) {
      toast.error("Please enter job title");
      return;
    }

    await improveWithAIFn({
      title,
      description,
      section: type.toLowerCase(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {entries.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>
                {item.title}{" "}
                <span className="text-muted-foreground font-normal">
                  @ {item.organization}
                </span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {displayDateRange(item.startDate, item.endDate, item.current)}
              </p>
              <p className="mt-3 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Title / Position" {...register("title")} />
              <Input
                placeholder="Organization / Company"
                {...register("organization")}
              />
            </div>

            {/* ===== DATE INPUTS (UNCHANGED) ===== */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Start Date</label>
                <div className="flex gap-2">
                  <select
                    className="w-full border rounded-md px-2 py-2"
                    onChange={(e) =>
                      setValue(
                        "startDate",
                        `${e.target.value} ${watch("startDate")?.split(" ")[1] || ""}`.trim()
                      )
                    }
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    className="w-full border rounded-md px-2 py-2"
                    onChange={(e) =>
                      setValue(
                        "startDate",
                        `${watch("startDate")?.split(" ")[0] || ""} ${e.target.value}`.trim()
                      )
                    }
                  >
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">End Date</label>
                <div className="flex gap-2">
                  <select
                    disabled={current}
                    className="w-full border rounded-md px-2 py-2"
                    onChange={(e) =>
                      setValue(
                        "endDate",
                        `${e.target.value} ${watch("endDate")?.split(" ")[1] || ""}`.trim()
                      )
                    }
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    disabled={current}
                    className="w-full border rounded-md px-2 py-2"
                    onChange={(e) =>
                      setValue(
                        "endDate",
                        `${watch("endDate")?.split(" ")[0] || ""} ${e.target.value}`.trim()
                      )
                    }
                  >
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) setValue("endDate", "");
                }}
              />
              <label>Current {type}</label>
            </div>

            {/* ===== DESCRIPTION + AI BUTTON INSIDE ===== */}
            <div className="space-y-2">
            {type !== "Certification" && (
  <Textarea
    placeholder={`Description of your ${type.toLowerCase()}`}
    {...register("description")}
  />
)}

{type !== "Certification" && (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={handleImproveDescription}
  >
    <Sparkles className="h-4 w-4 mr-2" />
    Improve with AI
  </Button>
)}


 
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button variant="outline" onClick={() => setIsAdding(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}
