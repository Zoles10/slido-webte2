"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { apiUrl } from "@/utils/config";
import { FormattedMessage } from "react-intl";
import { useAuth } from "@/components/auth/auth_provider";

const questionFormSchema = z.object({
  question_string: z
    .string()
    .min(10, "The question must be at least 10 characters long."),
  question_type: z.enum(["multiple_choice", "open_end"]),
  topic: z.string(),
  active: z.boolean(),
  options: z
    .array(
      z.object({
        option: z.string(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
  user_id: z.number().optional(),
});

export default function QuestionForm({
  code,
  initialData,
  isEditMode,
}: {
  code: string;
  initialData: any;
  isEditMode: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  console.log("initialData form", initialData);
  const form = useForm({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question_string: initialData?.question_string || "",
      question_type: initialData?.question_type || "",
      topic: initialData?.topic || "",
      active: initialData?.active ? "true" : "false",
      options: [{ option: "", isCorrect: false }],
      user_id: user?.id || null,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    if (initialData) {
      console.log("initialData active", initialData.active);
      form.reset({
        ...form.getValues(), // Preserve other values not provided by initialData
        ...initialData, // Overwrite with initial data
      });
      console.log("form", form.getValues());
    }
  }, [initialData, form]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = form.getValues();
    values.active = values.active === "true";
    const endpoint = apiUrl + (isEditMode ? `question/${code}` : "question");
    const method = isEditMode ? "PUT" : "POST";
    console.log("values", JSON.stringify(values));
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      console.log("response", response);
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to submit question");
      router.push("/myQuestions");
    } catch (error) {
      console.error("Submission error:", error);
      form.setError("root", { type: "manual", message: error.message });
    }
  };
  const handleDelete = async () => {
    if (!isEditMode || !code) return;

    try {
      const response = await fetch(`${apiUrl}question/${code}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete question");
      router.push("/myQuestion");
    } catch (error) {
      console.error("Deletion error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="question_string"
          render={({ field }) => (
            <FormItem>
              <FormattedMessage id="question" />
              <FormLabel></FormLabel>
              <Input {...field} />
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
              <Select {...field}>
                <option value="">
                  {" "}
                  <FormattedMessage id="selectType" />
                </option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="open_end">Open End</option>
              </Select>
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
              <Input {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="active" />
              </FormLabel>
              <Select {...field} value={field.value}>
                <option value="">
                  {" "}
                  <FormattedMessage id="selectActive" />
                </option>
                <option value="true">True</option>
                <option value="false">False</option>
              </Select>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isEditMode ? "Update Question" : "Add Question"}
        </Button>
        {isEditMode && (
          <Button
            type="button"
            onClick={handleDelete}
            style={{ background: "red" }}
          >
            Delete Question
          </Button>
        )}
      </form>
    </Form>
  );
}
