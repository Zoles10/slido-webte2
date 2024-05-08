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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Paragraph } from "../ui/typography/typography";
import { apiUrl } from "@/utils/config";
import { FormattedMessage } from "react-intl";

import { useRouter } from "next/navigation";

// Define schema using Zod
const formSchema = z
  .object({
    name: z.string().min(1, { message: "Meno je povinné" }),
    last_name: z.string().min(1, { message: "Priezvisko je povinné" }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Heslo je povinné" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Heslá sa nezhodujú",
    path: ["password_confirmation"],
  });

export default function RegisterForm() {
  const router = useRouter();

  // Initialize form with validation schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(apiUrl + "register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.email,
        password: values.password,
        name: values.name,
        lastname: values.last_name,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        router.push("/"); // Navigate after successful registration
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

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
                    <Input size={40} placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="lastName" />
                  </FormLabel>
                  <FormControl>
                    <Input size={40} placeholder="shadcn" {...field} />
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
                    <Input size={40} placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="password" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="confirmPassword" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <FormattedMessage id="register" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
