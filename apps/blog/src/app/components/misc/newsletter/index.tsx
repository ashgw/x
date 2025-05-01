"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

import { Button } from "@ashgw/ui";

import type { NewsletterSubscribeDto } from "~/server/models/newsletter";
import { newsletterSubscribeDtoSchema } from "~/server/models/newsletter";
import { trpcClientSideClient } from "~/trpc/client";

export function Newsletter() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewsletterSubscribeDto>({
    resolver: zodResolver(newsletterSubscribeDtoSchema),
  });

  const subscribeMutation =
    trpcClientSideClient.newsletter.subscribe.useMutation({
      onSuccess: () => {
        toast.success("Success!", {
          description: "Thank you for subscribing.",
        });
        reset();
      },
      onError: () => {
        toast.error("Something went wrong", {
          description: "Please try again later",
        });
      },
    });

  const onSubmit = (data: NewsletterSubscribeDto) => {
    subscribeMutation.mutate({
      email: data.email,
    });
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-[480px] items-center justify-center gap-3"
        >
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="your@email.com"
            className="h-12 flex-1 rounded-[2rem] border border-white/15 bg-white/5 px-3 text-sm font-medium text-[#B0B0B0] focus:border-white/30 focus:outline-none"
          />

          <Button
            className="glowsup shrink-0"
            variant="navbarMin"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "…" : "Subscribe"}
          </Button>
        </form>
        <p className="dimmed-3 mt-4 text-center text-sm">
          Extension of this blog and my Twitter. Weekly updates.
        </p>
      </div>
      <Toaster position="bottom-right" />
    </motion.div>
  );
}
