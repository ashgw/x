"use client";

import { motion } from "framer-motion";
import { Crown, User } from "lucide-react";

import { Badge } from "@ashgw/ui";

import type { UserRo } from "~/api/models";
import { UserRoleEnum } from "~/api/models";

interface UserInfoProps {
  user: UserRo;
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function UserInfo({ user }: UserInfoProps) {
  const isAdmin = user.role === UserRoleEnum.ADMIN;

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.div variants={itemVariants}>
        <label className="text-muted-foreground text-sm font-medium">
          Email
        </label>
        <p className="mt-1">{user.email}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="text-muted-foreground text-sm font-medium">
          Name
        </label>
        <p className="mt-1">{user.name}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="text-muted-foreground text-sm font-medium">
          Role
        </label>
        <div className="mt-2 flex items-center gap-2">
          <Badge
            variant={isAdmin ? "outline" : "secondary"}
            className={`flex items-center gap-1.5 px-3 py-1 ${isAdmin ? "border-yellow-500/70 text-yellow-500" : "text-blue-400"} `}
          >
            {isAdmin ? (
              <Crown className="h-3.5 w-3.5" />
            ) : (
              <User className="h-3.5 w-3.5" />
            )}
            {user.role.toLowerCase()}
          </Badge>
          {isAdmin ? (
            <span className="text-muted-foreground text-xs">
              Full access to the admin panel
            </span>
          ) : null}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="text-muted-foreground text-sm font-medium">
          Member Since
        </label>
        <p className="mt-1">
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>
    </motion.div>
  );
}
