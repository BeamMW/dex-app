export type MethodRoles = "user" | "manager" | "admin" | null /* empty string or null for new contract types without roles */;

export type MethodType = "writable" | "readable";