import fetchClient from "../req/fetchClient";

export default async function favoriteAction(
  favorited: boolean,
  slug: string,
): Promise<Article> {
  let data: Response;
  if (favorited) {
    data = await fetchClient(`/articles/${slug}/favorite`, {
      method: "DELETE",
    });
  } else {
    data = await fetchClient(`/articles/${slug}/favorite`, {
      method: "POST",
    });
  }
  if (data.ok) {
    return await (
      await data.json()
    ).article;
  } else {
    const failed = await data.json();
    throw Error(
      `Failed to favorite/unfavorite article, details: ${failed.detail}`,
    );
  }
}
