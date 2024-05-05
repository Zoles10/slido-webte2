"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "./auth_provider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Paragraph } from "../ui/typography/typography";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string(),
});

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
    fetch("https://node98.webte.fei.stuba.sk/slido-webte2/server/api/login", {
      method: "POST",
      body: formData, // Sending as FormData to match PHP's $_POST handling
    })
      .then((response) => response.json()) // Update here if your response is in JSON format
      .then((data) => {
        console.log("Login response:", data);
        console.log(data);
        if (data.message === "Login successful") {
          router.push("/home"); // Redirect on successful login
        } else {
          throw new Error(data.error || "Login failed");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        form.setError("root", {
          type: "manual",
          message: error.message || "Failed to login",
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prihlásenie</CardTitle>
        <CardDescription className="text-destructive">
          {form.formState.errors.root
            ? form.formState.errors.root?.message
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
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
                  <FormLabel>Heslo</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" type="password" {...field} />
                  </FormControl>
                  {/* <FormDescription>Vaše </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              )}
              Prihlásiť
            </Button>
          </form>
        </Form>
        <Separator className="my-4" />
        <div className="mt-1"></div>
        <Link href="/password">
          <Paragraph>Zabudli ste heslo?</Paragraph>
        </Link>
        <Link href="/register">
          <Paragraph>
            Nemáte účet? <span className="text-primary">Zaregistrujte sa</span>
          </Paragraph>
        </Link>
      </CardContent>
    </Card>
  );
}
