import { cookies } from "next/headers";

export default async function fetchFromAPIWithAuth(
  endpoint: string,
  init?: RequestInit,
  searchParams: { [key: string]: string } = {},
): Promise<Response> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined in the environment variables.",
    );
  }

  const cookieStore = await cookies();
  const auth = cookieStore.get("Authorization");
  const headers: { Authorization?: string } = {};
  if (auth) headers.Authorization = auth.value;

  const target = new URL(endpoint, process.env.NEXT_PUBLIC_API_URL);
  Object.entries(searchParams).forEach(([key, value]) => {
    target.searchParams.append(key, value);
  });

  return await fetch(target, {
    ...init,
    headers: { ...init?.headers, ...headers },
  });
}
