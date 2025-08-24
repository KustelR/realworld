"use client";

import fetchClient from "@/lib/req/fetchClient";
import favoriteAction from "@/lib/utils/favoriteSwitch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FavoriteButton(props: {
  slug: string;
  favoritesCount: number;
  favorited: boolean;
}) {
  const { slug, favoritesCount, favorited } = props;
  const router = useRouter();
  return (
    <button
      className={`btn btn-sm btn-outline-primary ${favorited ? "active" : ""}`}
      onClick={async () => {
        await favoriteAction(favorited, slug);
        router.refresh();
      }}
    >
      <i className="ion-heart"></i>
      &nbsp; {`${favorited ? "Unavorite" : "Favorite"} Post`}{" "}
      <span className="counter">{favoritesCount}</span>
    </button>
  );
}
