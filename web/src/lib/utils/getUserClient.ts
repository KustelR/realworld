import fetchClient from "@/lib/req/fetchClient";

export default async function getUser(): Promise<{ user: User }> {
  const data = await fetchClient("/user");
  return await data.json();
}
