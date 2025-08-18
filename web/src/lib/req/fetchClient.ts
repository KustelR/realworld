import { getCookie } from "cookies-next";

export default async function fetchFromAPI(
  endpoint: string,
  init?: RequestInit,
): Promise<any> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined in the environment variables.",
    );
  }
  const headers: { Authorization?: string } = {};
  const authToken = await getCookie("Authorization");
  if (authToken) {
    headers.Authorization = authToken;
  }

  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...init,
    headers: {
      ...init?.headers,
      ...headers,
    },
  });
}
