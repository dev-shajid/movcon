import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString?: Date, formatString: string='MMM dd, yyyy'): string => {
  if (!dateString) return "N/A";

  try {
    return format(dateString, formatString);
  } catch {
    return "Invalid date";
  }
};
