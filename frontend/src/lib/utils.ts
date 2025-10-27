import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format error message from API
 */
export function formatErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    const message = error.response.data.message;
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    return message;
  }
  return error.message || 'An unexpected error occurred';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    admin: 'Administrator',
    student: 'Student',
    prospective: 'Prospective Student',
    boarding_provider: 'Boarding Provider',
  };
  return roleMap[role] || role;
}
