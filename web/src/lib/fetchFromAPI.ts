export default async function fetchFromAPI(
  endpoint: string,
  init?: RequestInit,
): Promise<any> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined in the environment variables.",
    );
  }
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, init);
}
