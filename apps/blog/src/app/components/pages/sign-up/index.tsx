"use client";

import type { SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "@ashgw/design/motion";
import { useForm } from "react-hook-form";
import { toast } from "@ashgw/design/ui";

import { logger } from "@ashgw/logger";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Loading,
} from "@ashgw/design/ui";

import type { UserRegisterDto } from "~/api/models";
import { userRegisterSchemaDto } from "~/api/models";
import { useAuth } from "~/app/hooks/auth";
import { trpcClientSide } from "~/trpc/callers/client";

export function SignUpPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const utils = trpcClientSide.useUtils();

  // If already logged in, redirect to editor
  useEffect(() => {
    if (!isLoading && !!user) {
      router.push("/editor");
    }
  }, [isLoading, user, router]);

  const form = useForm<UserRegisterDto>({
    resolver: zodResolver(userRegisterSchemaDto),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signUpMutation = trpcClientSide.user.signUp.useMutation({
    onSuccess: () => {
      void utils.user.me.invalidate();
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account.",
      });
      router.push("/login");
    },
    onError: (error) => {
      logger.error("Sign up failed", { error });
      form.setError("root", {
        message: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<UserRegisterDto> = (data) => {
    signUpMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="layout mx-auto max-w-md px-4 py-16">
      <motion.div
        className="bg-card rounded-lg border p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="mb-2 text-2xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Sign Up
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Create your account to get started with the blog
        </motion.p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        type="text"
                        autoComplete="off"
                        {...field}
                      />
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
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        autoComplete="off"
                        {...field}
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your password"
                        type="password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="text-sm text-red-500">
                  {form.formState.errors.root.message}
                </div>
              )}

              <motion.div
                className="flex justify-end gap-2 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/login")}
                  disabled={signUpMutation.isPending}
                >
                  Already have an account?
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  disabled={signUpMutation.isPending}
                  loading={signUpMutation.isPending}
                >
                  {signUpMutation.isPending ? "Creating account..." : "Sign Up"}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
