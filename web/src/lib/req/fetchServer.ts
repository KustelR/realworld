import { cookies } from "next/headers";

export default async function fetchFromAPIWithAuth(
  endpoint: string,
  init?: RequestInit,
): Promise<any> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined in the environment variables.",
    );
  }

  const cookieStore = await cookies();
  const auth = cookieStore.get("Authorization");
  const headers: { Authorization?: string } = {};
  if (auth) headers.Authorization = auth.value;

  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...init,
    headers: { ...init?.headers, ...headers },
  });
}
