import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, FormMessage, FormLabel, FormControl, FormItem, Form } from "@/components/ui";
import { useRouter } from 'next/router';
import { apiUrl } from "@/utils/config";

const newUserSchema = z.object({
  name: z.string().min(1, "Meno je povinné"),
  lastname: z.string().min(1, "Priezvisko je povinné"),
  email: z.string().email("Email musí mat platný formát"),
  password: z.string().min(1, "Heslo je povinné")
});

const AdminAddUserForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(newUserSchema)
  });
  const router = useRouter();

  const onSubmit = async data => {
    console.log(data); 
    fetch(apiUrl + "register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      router.push('/admin-dashboard'); 
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="w-full max-w-xs m-auto">
      <Form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <FormItem>
          <FormLabel>Meno</FormLabel>
          <FormControl>
            <Input type="text" {...register("name")} />
            <FormMessage>{errors.name?.message}</FormMessage>
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Priezvisko</FormLabel>
          <FormControl>
            <Input type="text" {...register("lastname")} />
            <FormMessage>{errors.lastname?.message}</FormMessage>
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" {...register("email")} />
            <FormMessage>{errors.email?.message}</FormMessage>
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Heslo</FormLabel>
          <FormControl>
            <Input type="password" {...register("password")} />
            <FormMessage>{errors.password?.message}</FormMessage>
          </FormControl>
        </FormItem>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Pridať
        </Button>
      </Form>
    </div>
  );
}

export default AdminAddUserForm;