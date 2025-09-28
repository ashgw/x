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

import type { UserLoginDto } from "~/api/models";
import { userLoginSchemaDto } from "~/api/models";
import { useAuth } from "~/app/hooks/auth";
import { trpcClientSide } from "~/trpc/callers/client";

export function LoginPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const utils = trpcClientSide.useUtils();

  // If already logged in, redirect to editor
  useEffect(() => {
    if (!isLoading && !!user) {
      router.push("/editor");
    }
  }, [isLoading, user, router]);

  const form = useForm<UserLoginDto>({
    resolver: zodResolver(userLoginSchemaDto),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = trpcClientSide.user.login.useMutation({
    onSuccess: () => {
      void utils.user.me.invalidate();
      toast.success("Successfully logged in", {
        description: "You can now create and edit blog posts.",
      });
      router.push("/editor");
    },
    onError: (error) => {
      logger.error("Login failed", { error });
      form.setError("root", {
        message: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<UserLoginDto> = (data) => {
    loginMutation.mutate(data);
  };

  const googleLoginMutation = trpcClientSide.user.signInWithGoogle.useMutation({
    onSuccess: (data) => {
      // Redirect to the Google OAuth URL
      window.location.href = data.url;
    },
    onError: (error) => {
      logger.error("Google login failed", { error });
      toast.error("Google login failed", {
        description: "Please try again or use email login.",
      });
    },
  });

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate({
      callbackURL: "/editor",
    });
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
          Login
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Enter your credentials to access the blog editor
        </motion.p>

        {/* Google Login Button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            onClick={handleGoogleLogin}
            disabled={loginMutation.isPending || googleLoginMutation.isPending}
            loading={googleLoginMutation.isPending}
          >
            <svg
              className="mr-3 h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googleLoginMutation.isPending
              ? "Redirecting..."
              : "Continue with Google"}
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </motion.div>
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
                <div className="text-sm text-destructive">
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
                  onClick={() => router.push("/sign-up")}
                  disabled={loginMutation.isPending}
                >
                  Sign Up
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  disabled={loginMutation.isPending}
                  loading={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
