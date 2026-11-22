"use client";

import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

export type ActionIconButtonVariant =
  | "danger"
  | "warning"
  | "success"
  | "info"
  | "gold"
  | "neutral";

export type ActionIconButtonSize = "xs" | "sm" | "md";

const SIZE_CLASS: Record<ActionIconButtonSize, string> = {
  xs: "w-5 h-5 !w-5 !h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]",
  sm: "w-6 h-6 !w-6 !h-6 min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px]",
  md: "w-7 h-7 !w-7 !h-7 min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px]",
};

const ICON_PX: Record<ActionIconButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
};

const VARIANT_CLASS: Record<ActionIconButtonVariant, string> = {
  danger:
    "bg-red-50 text-red-700 border-red-300 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/20",
  warning:
    "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25 dark:hover:bg-amber-500/20",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/20",
  info:
    "bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/30 dark:hover:bg-sky-500/20",
  gold:
    "bg-gold-500/10 text-gold-700 border-gold-500/30 hover:bg-gold-500/20 dark:text-gold-300 dark:border-gold-500/25 dark:hover:bg-gold-500/20",
  neutral:
    "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-dark-850 dark:text-gray-400 dark:border-dark-700 dark:hover:bg-dark-800 dark:hover:text-white",
};

export function actionIconButtonClass(
  variant: ActionIconButtonVariant = "neutral",
  size: ActionIconButtonSize = "sm",
  className?: string
) {
  return clsx(
    "inline-flex items-center justify-center rounded-md border shrink-0 transition-all p-0 leading-none",
    "focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/60",
    "disabled:opacity-40 disabled:pointer-events-none hover:scale-105 active:scale-95",
    SIZE_CLASS[size],
    VARIANT_CLASS[variant],
    className
  );
}

/**
 * The Material Symbols stylesheet sets a fixed 24px font-size on the icon class,
 * which is loaded after Tailwind. An inline size keeps the glyph compact inside
 * our small action buttons regardless of stylesheet order.
 */
export function ActionIcon({
  icon,
  size = "sm",
}: {
  icon: string;
  size?: ActionIconButtonSize;
}) {
  return (
    <span
      className="material-symbols-outlined select-none"
      style={{
        fontSize: `${ICON_PX[size]}px`,
        width: `${ICON_PX[size]}px`,
        height: `${ICON_PX[size]}px`,
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

interface ActionIconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: string;
  label: string;
  variant?: ActionIconButtonVariant;
  size?: ActionIconButtonSize;
}

/**
 * Unified, compact icon-only action button used across tables and toolbars.
 * The label is used both as a native tooltip and an accessible name.
 */
export function ActionIconButton({
  icon,
  label,
  variant = "neutral",
  size = "sm",
  className,
  type = "button",
  ...props
}: ActionIconButtonProps) {
  return (
    <button
      type={type}
      title={label}
      aria-label={label}
      className={actionIconButtonClass(variant, size, className)}
      {...props}
    >
      <ActionIcon icon={icon} size={size} />
    </button>
  );
}
