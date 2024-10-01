import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserType } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatTime(input: string): string {
  const date = new Date(input);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getСompanion(users: UserType[], myId: string): number {
  return Number(users[0]._id === myId);
}
