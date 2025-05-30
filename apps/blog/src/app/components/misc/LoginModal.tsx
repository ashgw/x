"use client";

import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { logger } from "@ashgw/observability";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@ashgw/ui";

import type { UserLoginDto } from "~/api/models";
import { userLoginSchemaDto } from "~/api/models";
import { trpcClientSide } from "~/trpc/client";

export function LoginModal(props: {
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const utils = trpcClientSide.useUtils();

  const form = useForm<UserLoginDto>({
    resolver: zodResolver(userLoginSchemaDto),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const loginMutation = trpcClientSide.user.login.useMutation({
    onSuccess: () => {
      void utils.user.me.invalidate();
      toast.success("Successfully logged in", {
        description: "You can now create and edit blog posts.",
      });
      props.onSuccess?.();
      window.location.reload();
    },
    onError: (error) => {
      logger.error("Login failed", { error });
      form.setError("root", {
        message: "Invalid email or password",
      });
    },
  });

  const onSubmit: SubmitHandler<UserLoginDto> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={overlayVariants}
    >
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-[2px]"
        onClick={props.onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        className="bg-card relative z-50 w-full max-w-md rounded-lg border p-6 shadow-xl"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.h3
          className="mb-2 text-lg font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Login
        </motion.h3>

        <motion.p
          className="text-muted-foreground mb-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Enter your credentials to access the blog editor
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
                  variant="squared:outline"
                  type="button"
                  onClick={props.onClose}
                  disabled={loginMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="squared:default"
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
    </motion.div>
  );
}
