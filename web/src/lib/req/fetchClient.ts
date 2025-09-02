import { getCookie } from "cookies-next";

export default async function fetchFromAPI(
  endpoint: string,
  init?: RequestInit,
  searchParams: { [key: string]: string } = {},
): Promise<Response> {
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

  const target = new URL(endpoint, process.env.NEXT_PUBLIC_API_URL);
  Object.entries(searchParams).forEach(([key, value]) => {
    target.searchParams.append(key, value);
  });

  return await fetch(target, {
    ...init,
    headers: {
      ...init?.headers,
      ...headers,
    },
  });
}
