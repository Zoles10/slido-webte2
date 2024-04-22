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
import { redirect, useRouter } from "next/navigation";

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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      login(values.username, values.password);
      router.push("/home");
    } catch (error) {
      console.error("Login failed:", error);
      form.setError("root", {
        type: "manual",
        message: "Nepodarilo sa prihlasit",
      });
    }
  }

  //   <Card>

  //   <CardContent>
  //     <p>Card Content</p>
  //   </CardContent>
  //   <CardFooter>
  //     <p>Card Footer</p>
  //   </CardFooter>
  // </Card>

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
                  {/* <FormDescription>Email vašeho účtu</FormDescription> */}
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Prihlasujem..." : "Prihlásiť"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
