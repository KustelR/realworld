"use client";

import fetchClient from "@/lib/req/fetchClient";
import { useEffect, useState } from "react";

export default function FavoriteButton(props: {
  slug: string;
  favoritesNumber: number;
  favorited: boolean;
}) {
  const { slug, favoritesNumber, favorited } = props;
  const [favoritesCount, setFavoritesCount] = useState(favoritesNumber);
  const [isFavorited, setIsFavorited] = useState(favorited);
  useEffect(() => {
    console.log(favorited);
  }, [favorited]);
  return (
    <button
      className={`btn btn-outline-primary btn-sm pull-xs-right ${isFavorited ? "active" : ""}`}
      type="button"
      onClick={async () => {
        const article = await favoriteAction(isFavorited, slug);
        setFavoritesCount(article.favoritesCount);
        setIsFavorited(article.favorited ?? false);
      }}
    >
      <i className={`ion-heart ${favorited ? "active" : ""}`}></i>{" "}
      {favoritesCount}
    </button>
  );
}

async function favoriteAction(
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
