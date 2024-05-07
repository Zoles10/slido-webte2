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

  const onSubmit = (values: any) => {
    console.log("user", user);
    const token = localStorage.getItem("token");
    console.log("values", values);
    fetch(apiUrl + "question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(
              `Server responded with status ${response.status}: ${text}`
            );
          });
        }
        return response.json(); // Assume JSON if the response was okay
      })
      .then((data) => {
        if (data.message) {
          console.log("Question added:", data);
        } else {
          throw new Error(data.error || "Failed to post question");
        }
      })
      .catch((error) => {
        console.error("Submission error:", error);
        form.setError("root", {
          type: "manual",
          message: error.message || "Failed to submit question",
        });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question_string"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
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
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="">Select Type</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="open_end">Open End</option>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit Question
        </Button>
      </form>
    </Form>
  );
}
