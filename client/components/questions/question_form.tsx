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
  currentVoteStart: z.string().optional(),
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
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  console.log("initialData form", initialData);
  const form = useForm({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question_string: initialData?.question_string || "",
      question_type: initialData?.question_type || "",
      topic: initialData?.topic || "",
      active: initialData?.active ? "true" : "false",
      options: [{ option: "", isCorrect: false }],
      user_id: isAdmin ? "" : user?.id || "",
      currentVoteStart: initialData?.currentVoteStart || "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(apiUrl + "users", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            console.log("users", data);
            setUsers(data);
          } else {
            throw new Error("Failed to fetch users");
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (initialData) {
      console.log("initialData active", initialData.active);
      form.reset({
        ...form.getValues(),
        ...initialData,
      });
      console.log("form", form.getValues());
    }
  }, [initialData, form]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = form.getValues();
    values.active = values.active === "true";
    console.log("values.user", values.user_id);
    const endpoint = apiUrl + (isEditMode ? `question/${code}` : "question");
    const method = isEditMode ? "PUT" : "POST";

    if (
      isEditMode &&
      initialData.active === "false" &&
      values.active === true
    ) {
      console.log("start vote");
      const isoDate = new Date().toISOString();
      const date = new Date(isoDate);
      values.currentVoteStart =
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2) +
        " " +
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2) +
        ":" +
        ("0" + date.getSeconds()).slice(-2);
    }
    if (
      isEditMode &&
      initialData.active === "true" &&
      values.active === false
    ) {
      console.log("archive question");
      await archiveQuestion(code);
    }
    console.log("values", values);
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
      router.push("/home/myQuestions");
    } catch (error) {
      console.error("Submission error:", error);
      form.setError("root", { type: "manual", message: error.message });
    }
  };

  const archiveQuestion = async (questionCode: string) => {
    try {
      const archiveEndpoint = `${apiUrl}archivedQuestion/${questionCode}`;
      const archiveResponse = await fetch(archiveEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const archiveResult = await archiveResponse.json();
      if (!archiveResponse.ok)
        throw new Error(archiveResult.error || "Failed to archive question");
      console.log("Question archived successfully");
    } catch (error) {
      console.error("Error archiving question:", error);
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
      router.push("/home/myQuestion");
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
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) =>
            isAdmin ? (
              <FormItem>
                <FormLabel>
                  <FormattedMessage id="user" />
                </FormLabel>
                <Select {...field} value={field.value || ""}>
                  {users?.map((u) => (
                    <option key={u.id} value={u.user_id}>
                      {u.name + " " + u.lastname}
                    </option>
                  ))}
                </Select>
              </FormItem>
            ) : (
              <FormItem>
                <FormLabel>
                  <FormattedMessage id="user" />
                </FormLabel>
                <Input {...field} value={user?.id.toString()} readOnly />
              </FormItem>
            )
          }
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
