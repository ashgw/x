import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useMemo } from "react";
import { motion } from "framer-motion";

import { WordCounterService } from "@ashgw/cross-runtime";
import { Form } from "@ashgw/ui";

import type { PostEditorDto } from "~/api/models/post";
import { CategoryField } from "../fields/CategoryField";
import { ContentField } from "../fields/ContentField";
import { SummaryField } from "../fields/SummaryField";
import { TagsField } from "../fields/TagsField";
import { TitleField } from "../fields/TitleField";
import { FormButtons } from "./FormButtons";
import { WordCountDisplay } from "./WordCountDisplay";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

interface PostEditorFormProps {
  form: UseFormReturn<PostEditorDto>;
  onSubmit: SubmitHandler<PostEditorDto>;
  isSubmitting?: boolean;
  isHidden?: boolean;
}

export function PostEditorForm({
  form,
  onSubmit,
  isSubmitting,
  isHidden = false,
}: PostEditorFormProps) {
  const { reset, control, register, watch, handleSubmit } = form;

  const content = watch("mdxContent");

  const { wordCount, minutesToRead } = useMemo(
    () => ({
      wordCount: WordCounterService.countWords(content),
      minutesToRead: WordCounterService.countMinutesToRead(content),
    }),
    [content],
  );

  if (isHidden) return null;

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-card rounded-lg border p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 100,
        }}
      >
        <motion.h2
          className="mb-4 text-lg font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Editor
        </motion.h2>
        <Form {...form}>
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <TitleField control={control} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <SummaryField control={control} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <CategoryField control={control} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <TagsField form={form} />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6"
            >
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" {...register("isReleased")} />
                <span>Released</span>
              </label>
              <WordCountDisplay
                wordCount={wordCount}
                minutesToRead={minutesToRead}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <ContentField control={control} />
            </motion.div>

            <FormButtons onReset={() => reset()} isSubmitting={isSubmitting} />
          </motion.form>
        </Form>
      </motion.div>
    </motion.div>
  );
}
