"use client";

import fetchFromAPI from "@/lib/req/fetchClient";

export default function ControlsAuthorized(props: { slug: string }) {
  const { slug } = props;
  return (
    <>
      <button className="btn btn-sm btn-outline-secondary">
        <i className="ion-edit"></i> Edit Article
      </button>
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={async () => {
          fetchFromAPI(`/articles/${slug}`, { method: "DELETE" });
          window.location.href = "/";
        }}
      >
        <i className="ion-trash-a"></i> Delete Article
      </button>
    </>
  );
}
