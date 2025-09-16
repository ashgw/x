"use client";

import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

import { logger } from "@ashgw/logger";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@ashgw/ui";

import type { NewsletterSubscribeDto } from "~/api/models/newsletter";
import { newsletterSubscribeDtoSchema } from "~/api/models/newsletter";
import { trpcClientSide } from "~/trpc/callers/client";

export function Newsletter() {
  const form = useForm<NewsletterSubscribeDto>({
    resolver: zodResolver(newsletterSubscribeDtoSchema),
    mode: "onSubmit",
  });

  const subscribeMutation = trpcClientSide.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("You're in!", {
        description: "Welcome aboard. Thanks for joining!",
      });
      form.reset();
    },
    onError: (error) => {
      toast.error("Something went wrong", {
        description: error.message,
      });
    },
  });

  const submitHandler: SubmitHandler<NewsletterSubscribeDto> = async (data) => {
    try {
      await subscribeMutation.mutateAsync({
        email: data.email,
      });
    } catch (error) {
      logger.debug("Newsletter subscription failed", {
        error,
      });
    }
  };

  return (
    <motion.div
      className={`mx-auto w-full max-w-[1280px] px-2 sm:px-10`}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="relative mx-auto flex max-w-[600px] flex-col items-center p-8 before:absolute before:left-1/2 before:top-0 before:h-[1px] before:w-full before:-translate-x-1/2 before:bg-white/15 sm:before:w-[450px] md:before:w-[550px] lg:before:w-[650px] xl:before:w-[750px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="flex w-full max-w-[480px] flex-col items-center justify-center gap-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex w-full items-center gap-3">
                      <input
                        type="email"
                        {...field}
                        placeholder="your@email.com"
                        className="h-12 flex-1 rounded-[2rem] border border-white/15 bg-transparent px-3 text-sm font-medium text-[#B0B0B0] outline-none transition-all duration-300 ease-in-out selection:bg-white/10 hover:border-white/20 focus:border-white/30 focus:ring-0 [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-[#B0B0B0] [&:-webkit-autofill]:shadow-[0_0_0_1000px_transparent_inset] focus:[&:-webkit-autofill]:bg-transparent"
                      />
                      <Button
                        className="glowsup shrink-0"
                        variant="navbar"
                        type="submit"
                        disabled={subscribeMutation.isPending}
                        loading={subscribeMutation.isPending}
                      >
                        {subscribeMutation.isPending
                          ? "Subscribing..."
                          : "Subscribe"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <p className="dimmed-3 mt-4 text-center text-sm">
          Subscribe to my newsletter. No gimmicks, just food for thought &
          sauce.
        </p>
      </div>
      <Toaster position="bottom-right" />
    </motion.div>
  );
}
