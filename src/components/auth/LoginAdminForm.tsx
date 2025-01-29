"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loginchema } from "@/schemas";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export const LoginAdminForm = () => {
  const route = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // To track form submission status

  const form = useForm<z.infer<typeof Loginchema>>({
    resolver: zodResolver(Loginchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof Loginchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/admin/sign-in", {
        email: values.email,
        password: values.password,
      });

      if (res.status === 200) {
        setSuccess(res.data.message);
        route.push("/admin/dashboard");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response?.data?.message || "Unknown error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardWrapper headerLabel="Welcome Back">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting} // Disable input during submission
                        type="email"
                        placeholder="type your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting} // Disable input during submission
                        type="password"
                        placeholder="******"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <Button
                      size={"sm"}
                      variant={"link"}
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href={"/auth/reset"}>Forgot password!</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {"Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
