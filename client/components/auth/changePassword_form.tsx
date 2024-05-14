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
import { FormattedMessage } from "react-intl";

const formSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6, {
    message: "New password must be at least 6 characters long.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords must match.",
  path: ["confirmPassword"],
});

export default function ChangePasswordForm() {
  const { changePassword, isAuthenticated } = useAuth();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: { oldPassword: string; newPassword: string; }) => {
    try {
      const result = await changePassword(values.oldPassword, values.newPassword);
      console.log(result);
      //Redirect or show success message
        router.push("/profile");
    } catch (error) {
      console.error("Error changing password:", error);
      // Handle error (show error message to user)
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="changePassword" defaultMessage="Zmena hesla" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="oldPassword" defaultMessage="Staré heslo" />
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="newPassword" defaultMessage="Nové heslo" />
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="confirmPassword" defaultMessage="Potvrdiť heslo" />
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
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
                id="changePasswordButton"
                defaultMessage="Zmeniť heslo"
              />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
