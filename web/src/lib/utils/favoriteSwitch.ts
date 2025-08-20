import fetchClient from "../req/fetchClient";

export default async function favoriteAction(
  favorited: boolean,
  slug: string,
): Promise<Article> {
  let data: any;
  if (favorited) {
    data = await fetchClient(`/articles/${slug}/favorite`, {
      method: "DELETE",
    });
  } else {
    data = await fetchClient(`/articles/${slug}/favorite`, {
      method: "POST",
    });
  }
  return await (
    await data.json()
  ).article;
}
