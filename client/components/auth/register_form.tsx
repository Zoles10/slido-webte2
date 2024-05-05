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

const formSchema = z
  .object({
    name: z.string().min(1, {
      message: "Meno je povinné",
    }),
    last_name: z.string().min(1, {
      message: "Priezvisko je povinné",
    }),
    email: z.string().email(),
    password: z.string().min(1, {
      message: "Heslo je povinné",
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Heslá sa nezhodujú",
    path: ["password_confirmation"],
  });

export default function RegisterForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const formData = new FormData();
    formData.append("username", values.email); // Assuming you use the email as the username
    formData.append("password", values.password);
    fetch(
      "https://node98.webte.fei.stuba.sk/slido-webte2/server/api/register",
      {
        method: "POST",
        body: formData, // Sending as FormData to match PHP's $_POST handling
      }
    )
      .then((response) => response.text()) // Assuming the response is text, not JSON
      .then((data) => {
        console.log(data); // Log the success or error message from the server
        // Here you can handle redirection to login or further actions
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
        <CardTitle>Registrácia</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meno</FormLabel>
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
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priezvisko</FormLabel>
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
              name="email"
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
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heslo znova</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" type="password" {...field} />
                  </FormControl>
                  {/* <FormDescription>Vaše </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Registrovať</Button>
          </form>
        </Form>
        <Separator className="my-4" />
        <Link href="/login">
          <Paragraph>
            Už máte účet? <span className="text-primary">Prihlásiť sa</span>
          </Paragraph>
        </Link>
      </CardContent>
    </Card>
  );
}
