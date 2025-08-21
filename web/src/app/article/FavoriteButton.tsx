"use client";

import favoriteAction from "@/lib/utils/favoriteSwitch";
import { useState } from "react";

export default function FavoriteButton(props: {
  slug: string;
  favorited: boolean;
  favoritesCount: number;
}) {
  const { slug, favorited, favoritesCount } = props;
  const [favoritesNumber, setFavoritesNumber] = useState(favoritesCount);
  const [isFavorited, setIsFavorited] = useState(favorited);
  return (
    <button
      className={`btn btn-sm btn-outline-primary ${isFavorited ? "active" : ""}`}
      onClick={async () => {
        const data = await favoriteAction(isFavorited, slug);
        setFavoritesNumber(data.favoritesCount);
        setIsFavorited(data.favorited ?? false);
      }}
    >
      <i className="ion-heart"></i>
      &nbsp; {`${isFavorited ? "Favorite" : "Unfavorite"} Post`}{" "}
      <span className="counter">{favoritesNumber}</span>
    </button>
  );
}
