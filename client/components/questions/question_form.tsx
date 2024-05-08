"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/components/auth/auth_provider";
import { apiUrl } from "@/utils/config";
import { useEffect } from "react";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleCheckBig, Loader2 } from "lucide-react";
import { FormattedMessage } from "react-intl";

const questionFormSchema = z.object({
  question_string: z
    .string()
    .min(10, "The question must be at least 10 characters long."),
  question_type: z.string(),
  topic: z.string(),
  active: z.boolean().optional(),
  user_id: z.number(),
});

export default function QuestionForm() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question_string: "",
      question_type: "",
      topic: "",
      active: true,
      user_id: user?.id,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    console.log("fields", fields);
  }, [fields]);

  const onSubmit = async (values) => {
    console.log("User:", user);
    const token = localStorage.getItem("token");
    console.log("Form Values:", values);

    try {
      const questionResponse = await fetch(apiUrl + "question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const questionData = await questionResponse.json();
      if (!questionResponse.ok) {
        throw new Error(
          `Server responded with status ${questionResponse.status}: ${
            questionData.error || "Failed to post question"
          }`
        );
      }

      console.log("Question added:", questionData);
      toast("Otázka pridaná", {
        description: "Otázka bola úspešne pridaná do databázy.",
        important: true,
        icon: <CircleCheckBig className="text-destructive" />,
      });

      if (values.question_type === "multiple_choice" && questionData.code) {
        await Promise.all(
          fields.map(async (option) => {
            const optionResponse = await fetch(
              `${apiUrl}questionOption/${questionData.code}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  option_string: option.option,
                  correct: option.isCorrect,
                }),
              }
            );

            const optionData = await optionResponse.json();
            if (!optionResponse.ok) {
              throw new Error(
                `Server responded with status ${optionResponse.status}: ${
                  optionData.error || "Failed to post question option"
                }`
              );
            }
            router.push(`/${questionData.code}/dashboard`);
            console.log("Option added:", optionData);
          })
        );
      } else {
        router.push(`/${questionData.code}/dashboard`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      form.setError("root", {
        type: "manual",
        message: error.message || "Failed to submit question",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question_string"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="question" />
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="question_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {" "}
                <FormattedMessage id="type" />
              </FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="">
                    <FormattedMessage id="chooseType" />
                  </option>
                  <option value="multiple_choice">
                    <FormattedMessage id="multipleChoice" />
                  </option>
                  <option value="open_end">
                    <FormattedMessage id="openEnded" />
                  </option>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("question_type") === "multiple_choice" &&
          fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Input
                {...form.register(`options.${index}.option`)}
                placeholder="Option"
              />
              <input
                type="checkbox"
                {...form.register(`options.${index}.isCorrect`, {
                  valueAsBoolean: true,
                })}
              />
              <Button type="button" onClick={() => remove(index)}>
                <FormattedMessage id="remove" />
              </Button>
            </div>
          ))}
        {form.watch("question_type") === "multiple_choice" && (
          <Button
            type="button"
            onClick={() => append({ option: "", isCorrect: false })}
          >
            <FormattedMessage id="addOption" />
          </Button>
        )}

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {" "}
                <FormattedMessage id="topic" />
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          <FormattedMessage id="addQuestion" />
        </Button>
      </form>
    </Form>
  );
}
