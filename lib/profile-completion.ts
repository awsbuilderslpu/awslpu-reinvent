import type { AuthUser } from "@/types/auth"

export function getMissingProfileFields(user: AuthUser | null | undefined) {
  const missing: string[] = []

  if (!user?.first_name?.trim()) missing.push("first name")
  if (!user?.last_name?.trim()) missing.push("last name")
  if (!user?.phone?.trim()) missing.push("phone number")
  if (!user?.academic?.institution?.trim()) missing.push("institution")
  if (!user?.academic?.degree?.trim()) missing.push("degree")
  if (!user?.academic?.department?.trim()) missing.push("department")
  if (
    typeof user?.academic?.graduation_year !== "number" ||
    !Number.isFinite(user.academic.graduation_year) ||
    user.academic.graduation_year < 1
  ) {
    missing.push("graduation year")
  }

  return missing
}
