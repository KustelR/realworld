"use client";

import fetchClient from "@/lib/req/fetchClient";
import getUserClient from "@/lib/utils/getUserClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CommentEditor(props: { slug: string }) {
  const { slug } = props;
  const [user, setUser] = useState<User | undefined>();
  const [body, setBody] = useState("");

  const router = useRouter();

  useEffect(() => {
    getUserClient().then((u) => {
      setUser(u.user);
    });
  }, []);

  if (!user) return;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fetchClient(`/articles/${slug}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment: { body: body } }),
        });
        router.refresh();
      }}
      className="card comment-form"
    >
      <div className="card-block">
        <textarea
          className="form-control"
          placeholder="Write a comment..."
          rows={3}
          onChange={(e) => {
            setBody(e.currentTarget.value);
          }}
        ></textarea>
      </div>
      <div className="card-footer">
        {user.image && (
          <Image
            alt="comment-author pfp"
            src={user.image}
            className="comment-author-img"
            width={32}
            height={32}
          />
        )}
        <button className="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>
  );
}
