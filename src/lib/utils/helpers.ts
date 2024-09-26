import clsx, { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Generates a random string of the specified length.
 * @param length The length of the random string to generate.
 * @returns The randomly generated string.
 */
export const generateRandomStr = (length: number) => {
  return [...Array(length)]
    .map(() => ((Math.random() * 36) | 0).toString(36))
    .join('')
}

/**
 * Combines multiple class names into a single string.
 *
 * @param inputs - The class names to combine.
 * @returns The combined class names as a string.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))