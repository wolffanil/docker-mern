import * as z from "zod";

export const ProfileValidation = z.object({
  name: z.string().min(6, { message: "Слишком кароткий" }).trim(),
  username: z.string().min(6, { message: "Слишком кароткий" }).trim(),
  bio: z
    .string()
    .min(10, { message: "Слишком кароткий" })
    .max(1024, { message: "Текст должен быть кароче чем 1024 символа" })
    .trim(),
  file: z.custom<File[]>(),
});

export const SignupValidation = z.object({
  name: z.string().min(6, { message: "Слишком кароткий" }).trim(),
  email: z.string().email({ message: "Введите коректный email" }).trim(),
  password: z
    .string()
    .min(8, { message: "Пароль должен быть не меньше 8 символов" }),
});

export const SigninValidation = z.object({
  email: z.string().email({ message: "Введите коректный email" }).trim(),
  password: z
    .string()
    .min(8, { message: "Пароль должен быть не меньше 8 символов" }),
});
