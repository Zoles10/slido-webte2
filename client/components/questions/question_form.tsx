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
        question_option_id: z.number(),
        option: z.string(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
  currentVoteStart: z.string().optional(),
  user_id: z.number().optional(),
  note: z.string().optional(),
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
  const [deletedOptions, setDeletedOptions] = useState([]);
  const [showNote, setShowNote] = useState(false);

  const form = useForm({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question_string: initialData?.question_string || "",
      question_type: initialData?.question_type || "",
      topic: initialData?.topic || "",
      active: initialData?.active ? "true" : "false",
      options: [{ option: "", isCorrect: false }],
      user_id: isAdmin ? user?.id : user?.id || "",
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
    form.reset({
      ...form.getValues(),
      ...initialData,
      options: (!initialData?.options?.message
        ? initialData?.options?.map((option) => ({
            option_string: option.option_string,
            correct: option.correct === 1,
            question_option_id: option.question_option_id,
          }))
        : "") || [{ option_string: "", correct: false }],
    });
  }, [initialData, form]);

  // Modify the useEffect that handles user fetching to also fetch options if needed
  const handleRemoveOption = (index) => {
    const option = fields[index];
    if (option.question_option_id) {
      // Check if the option has an ID
      setDeletedOptions((prev) => [...prev, option.question_option_id]);
    }
    remove(index);
  };

  const processDeletions = async () => {
    await Promise.all(
      deletedOptions.map(async (optionId) => {
        const deleteEndpoint = `${apiUrl}questionOption/${optionId}`;
        try {
          const response = await fetch(deleteEndpoint, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
          if (!response.ok) {
            throw new Error("Failed to delete option");
          }
          console.log(`Deleted option ${optionId} successfully`);
        } catch (error) {
          console.error(`Error deleting option ${optionId}:`, error);
        }
      })
    );
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = form.getValues();
    values.active = values.active === "true";

    try {
      await processDeletions();
    } catch (error) {
      console.error("Error processing form:", error);
      form.setError("root", { type: "manual", message: error.message });
      return;
    }
    const endpoint = apiUrl + (isEditMode ? `question/${code}` : "question");
    const method = isEditMode ? "PUT" : "POST";
    if (
      isEditMode &&
      initialData.active === "false" &&
      values.active === true
    ) {
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
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to submit question");

      const questionId = isEditMode ? code : result.id;
      if (values.question_type === "multiple_choice") {
        await handleOptionSubmit(questionId);
      }

      router.push("/home/myQuestions");
    } catch (error) {
      console.error("Submission error:", error);
      form.setError("root", { type: "manual", message: error.message });
    }
  };

  const handleOptionSubmit = async (questionId) => {
    const options = form.getValues().options;
    console.log("Options to submit:", options);

    await Promise.all(
      options.map(async (option) => {
        // Determine the endpoint and HTTP method based on whether an option ID is present
        const isUpdate = Boolean(option.question_option_id);
        const optionEndpoint =
          apiUrl +
          (isUpdate
            ? `questionOption/${option.question_option_id}`
            : `questionOption/${code}`);
        const optionMethod = isUpdate ? "PUT" : "POST";

        const body = {
          question_id: questionId,
          option_string: option.option_string,
          correct: option.correct ?? false,
        };

        console.log(`Submitting option (${optionMethod}):`, body);

        try {
          const response = await fetch(optionEndpoint, {
            method: optionMethod,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const result = await response.json();

          if (!response.ok) {
            console.error("Response Error:", result);
            throw new Error(result.error || "Failed to submit option");
          }

          console.log("Option submission result:", result);
        } catch (error) {
          console.error("Error submitting option:", error);
          throw error; // Rethrowing the error is useful if you want to handle it further up in your call stack
        }
      })
    );
  };

  const archiveQuestion = async (questionCode: string) => {
    try {
      const archiveEndpoint = `${apiUrl}archivedQuestion/${questionCode}`;
      const archiveResponse = await fetch(archiveEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: form.getValues().note ?? "" }),
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
      router.push("/home/myQuestions");
    } catch (error) {
      console.error("Deletion error:", error);
    }
  };
  const active = form.watch("active");

  useEffect(() => {
    console.log("USE EFFECT", form);
    if (isEditMode && initialData?.active === "true" && active === "false") {
      setShowNote(true);
    } else {
      setShowNote(false);
    }
  }, [initialData?.active, isEditMode, active]);

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
                {...form.register(`options.${index}.option_string`)}
                placeholder="Option"
              />
              <input
                type="checkbox"
                checked={field.correct}
                onChange={(e) => {
                  const newOptions = [...fields];
                  newOptions[index] = {
                    ...newOptions[index],
                    correct: e.target.checked,
                  };
                  form.setValue("options", newOptions); // Update the options in the form
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  remove(index);
                  handleRemoveOption(index);
                }}
              >
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
        {showNote && (
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormattedMessage id="note" />
                <FormLabel></FormLabel>
                <Input {...field} />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) =>
            isAdmin ? (
              <FormItem>
                <FormLabel>
                  <FormattedMessage id="user" />
                </FormLabel>
                <Select {...field} value={field.value || user?.id}>
                  {users?.map((u: any) => (
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
        <div className="flex flex-col items-center">
          <Button
            type="submit"
            className="mb-5"
            disabled={form.formState.isSubmitting}
          >
            {isEditMode ? (
              <FormattedMessage id="save" />
            ) : (
              <FormattedMessage id="create" />
            )}
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
        </div>
      </form>
    </Form>
  );
}
