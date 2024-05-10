"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { apiUrl } from "@/utils/config";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/navigation";

// Define schema with Zod
const userFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    lastname: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email(),
    role: z.string().min(1, { message: "Role is required" }),
  })


interface UserFormProps {
  initialData?: {
    name: string;
    lastname: string;
    email: string;
    user_id: string;
    role: string;
  };
  isEditMode: boolean;
  userId?: string;
}

export default function UserForm({ initialData, isEditMode, userId }: UserFormProps) {
  const router = useRouter();
  console.log(initialData, ' initialData');

  // Initialize the form with schema and default values
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      lastname: initialData?.lastname || "",
      email: initialData?.email || "",
      role: initialData?.role || "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    const method = isEditMode ? "PUT" : "POST";
    const endpoint = isEditMode ? `${apiUrl}user/${initialData.user_id}` : `${apiUrl}register`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          lastname: values.lastname,
          email: values.email,
          role: values.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      router.push("/home/users"); // Navigate after successful submission
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // Handle user deletion
  const handleDelete = async () => {
    if (!isEditMode || !userId) return;

    try {
      const response = await fetch(`${apiUrl}users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      router.push("/"); // Navigate after successful deletion
    } catch (error) {
      console.error("Deletion error:", error);
    }
  };

  // Reset form values if initialData is provided
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        lastname: initialData.lastname,
        email: initialData.email,
        role: initialData.role,
      });
    }
  }, [initialData, form]);

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="name" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="First name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="lastName" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Last name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {" "}
                    <FormattedMessage id="role" />
                  </FormLabel>
                  <Select {...field}>
                    <option value="">
                      {" "}
                      <FormattedMessage id="selectRole" />
                    </option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </Select>
            </FormItem>
          )}
        />
            <Button type="submit">{isEditMode ? "Update User" : "Register"}</Button>
            {isEditMode && (
              <Button type="button" onClick={handleDelete} className="bg-red-500">
                Delete User
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
