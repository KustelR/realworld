"use client";

import favoriteAction from "@/lib/utils/favoriteSwitch";
import { getCookie } from "cookies-next";
import { useState } from "react";

export default function FavoriteButton(props: {
  slug: string;
  favoritesNumber: number;
  favorited: boolean;
}) {
  const { slug, favoritesNumber, favorited } = props;
  const [favoritesCount, setFavoritesCount] = useState(favoritesNumber);
  const [isFavorited, setIsFavorited] = useState(favorited);

  return (
    <button
      className={`btn btn-outline-primary btn-sm pull-xs-right ${isFavorited ? "active" : ""}`}
      type="button"
      onClick={async () => {
        if (!(await getCookie("Authorization"))) {
          window.location.href = "/login";
        }
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
