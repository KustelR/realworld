"use client";

import fetchFromAPI from "@/lib/fetchFromAPI";

export default function FavoriteButton(props: {
  slug: string;
  favoritesNumber: number;
  favorited: boolean;
}) {
  const { slug, favoritesNumber, favorited } = props;
  return (
    <button
      className="btn btn-outline-primary btn-sm pull-xs-right"
      onClick={() => {
        fetchFromAPI(`/articles/${slug}/favorite`, {
          method: "POST",
        });
      }}
    >
      <i className={`ion-heart ${favorited ? "active" : ""}`}></i>{" "}
      {favoritesNumber}
    </button>
  );
}
