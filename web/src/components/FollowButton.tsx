"use client";

import fetchClient from "@/lib/req/fetchClient";
import { FetchEventResult } from "next/dist/server/web/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FollowButton(props: { user: User }) {
  const { user } = props;
  const router = useRouter();

  return (
    <button
      className={`btn btn-sm btn-outline-secondary action-btn ${user.following ? "active" : ""}`}
      onClick={async () => {
        await switchFollow(user.username, user.following ?? false);
        router.refresh();
      }}
    >
      <i className="ion-plus-round"></i>
      &nbsp; {user.following ? "Unfollow" : "Follow"} {user.username}{" "}
    </button>
  );
}

async function getProfile(target: string): Promise<User | undefined> {
  const data = await fetchClient(`/profiles/${target}`);
  const deserialized = await data.json();

  return deserialized.profile;
}

async function switchFollow(target: string, following: boolean): Promise<User> {
  let data: Response;
  if (!following) {
    data = await fetchClient(`/profiles/${target}/follow`, {
      method: "POST",
    });
  } else {
    data = await fetchClient(`/profiles/${target}/follow`, {
      method: "DELETE",
    });
  }
  const deserialized: { profile: User } = await data.json();
  return deserialized.profile;
}
