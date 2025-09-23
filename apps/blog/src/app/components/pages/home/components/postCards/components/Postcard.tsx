import Link from "next/link";
import { Views } from "~/app/components/shared/views";

import { DateService } from "@ashgw/cross-runtime";

import type { PostCardRo } from "~/api/models";

import * as React from "react";
import type { VariantProps } from "@ashgw/ui";
import { cva, cn } from "@ashgw/ui";

// ==================
// Card Variants
// ==================
const cardVariants = cva(
  "group flex flex-col border border-white/10 shadow transition-all", // base
  {
    variants: {
      variant: {
        default: "bg-background/50",
        glow: "glowsup-dimmed hover:slower-translate hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)]",
        subtle: "hover:shadow-md hover:border-white/20",
        flat: "border-none shadow-none bg-transparent",
      },
      size: {
        default: "p-5 rounded-[2rem]",
        sm: "p-3 rounded-xl",
        lg: "p-8 rounded-[2.5rem]",
      },
      animate: {
        none: "",
        scale: "hover:scale-105 slower-transition",
        pop: "hover:scale-110 slower-transition",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animate: "scale",
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean; // like shadcn Button
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, animate, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "section" : "div";
    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, size, animate, className }))}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

// ==================
// PostCard using <Card>
// ==================
export function PostCard({ postData }: { postData: PostCardRo }) {
  return (
    <div className="mx-auto mt-8 w-full max-w-[1280px] px-5 sm:mt-24 sm:px-10">
      <Card variant="glow" size="default" animate="pop">
        <div className="flex flex-col gap-4 lg:gap-6">
          <div className="text-muted-foreground flex items-center gap-2 px-1 text-sm">
            <span>
              {DateService.formatDate({
                stringDate: postData.firstModDate.toISOString(),
              })}
            </span>
            <span className="mx-1 scale-150 select-none text-white/40">·</span>
            <Views
              slug={postData.slug}
              initial={postData.views}
              className="flex items-center gap-1 opacity-70"
            />
          </div>

          <Link href={`/${postData.slug}`}>
            <h2 className="dimmed-4 text-2xl font-bold lg:text-[2.5rem]">
              {postData.title}
            </h2>
            <p className="dimmed-3 mt-3 lg:text-xl">{postData.summary}</p>
          </Link>

          <div className="dimmed-4 flex flex-wrap items-center gap-[0.625rem] text-sm">
            {postData.tags.map((tag) => (
              <Link
                href={`/tag/${tag}`}
                key={tag}
                className="relative rounded-full border border-white/10 px-4 py-2 text-sm transition-all duration-200 ease-in-out hover:border-white/20"
              >
                {tag}
              </Link>
            ))}
            <div className="dimmed-1 flex items-center gap-2">
              <span>
                {postData.minutesToRead
                  ? `${postData.minutesToRead} minutes`
                  : "∞ minutes"}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/${postData.slug}`}
          className="relative h-full overflow-hidden rounded-[2rem]"
        />
      </Card>
    </div>
  );
}
