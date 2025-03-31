import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "PPP");
}

export function formatShortDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function calculatePercentage(total: number, obtained: number): number {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100);
}
