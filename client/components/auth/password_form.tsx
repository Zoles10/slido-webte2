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
  email: z.string().email("Zadajte platnú emailovú adresu"),
});

export default function PasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //add delay
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // try {
    //   login(values.username, values.password);
    //   router.push("/home");
    // } catch (error) {
    //   console.error("Login failed:", error);
    //   form.setError("root", {
    //     type: "manual",
    //     message: "Nepodarilo sa prihlasit",
    //   });
    // }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zmena hesla</CardTitle>
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
                  <FormDescription>
                    Email, na ktorý je váš účet registrovaný.
                  </FormDescription>
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
              Zaslať žiadosť o zmenu hesla
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
