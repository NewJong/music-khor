import { fetchData } from "@/lib/fetchData";

export const getUserEmail = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

export const getCurrentUserId = async (): Promise<number | null> => {
  const email = getUserEmail();
  if (!email) return null;

  const userData = await fetchData(`get-user?email=${email}`);
  return userData?.id ?? null;
};
