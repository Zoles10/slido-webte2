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

import { FormattedMessage } from "react-intl";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string(),
});

export default function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await login(values.email, values.password);
    if (isAuthenticated) {
      console.log("logged in");
      router.push("/home");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="login" defaultMessage="Prihlásenie" />
        </CardTitle>
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
                    <FormattedMessage id="password" defaultMessage="Heslo" />
                  </FormLabel>
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
              <FormattedMessage
                id="loginButton"
                defaultMessage="Prihlásiť sa"
              />
            </Button>
          </form>
        </Form>
        <Separator className="my-4" />
        <div className="mt-1"></div>
        <Link href="/password">
          <Paragraph>
            <FormattedMessage
              id="forgotPassword"
              defaultMessage="Zabudnuté heslo"
            />
          </Paragraph>
        </Link>
        <Link href="/register">
          <Paragraph>
            <FormattedMessage
              id="dontHaveAnAccount"
              defaultMessage="Nemáte účet?"
            />
            <span className="text-primary">
              <FormattedMessage id="signUp" defaultMessage="Zaregistrovať sa" />
            </span>
          </Paragraph>
        </Link>
      </CardContent>
    </Card>
  );
}
