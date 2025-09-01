"use client";

import ErrorMessages from "@/components/ErrorMessages";
import fetchAuthClient from "@/lib/req/fetchClient";
import { useState } from "react";

export default function Page() {
  const [errors, setErrors] = useState<string[]>([]);
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ErrorMessages messages={errors} />
            <ArticleForm setErrors={setErrors} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleForm(props: { setErrors: (errors: string[]) => void }) {
  const { setErrors } = props;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title) {
          setErrors(["Title is required"]);
          return;
        }
        const response = await fetchAuthClient("/articles", {
          method: "POST",
          body: JSON.stringify({
            article: {
              title,
              description,
              body,
              tagList,
            },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const slug = (await response.json()).article.slug;
          window.location.href = `/article/${slug}`;
        } else {
          const detail = (await response.json()).detail;
          setErrors([detail]);
        }
      }}
    >
      <fieldset>
        <fieldset className="form-group">
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="form-control form-control-lg"
            placeholder="Article Title"
          />
        </fieldset>
        <fieldset className="form-group">
          <input
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            className="form-control"
            placeholder="What's this article about?"
          />
        </fieldset>
        <fieldset className="form-group">
          <textarea
            onChange={(e) => setBody(e.target.value)}
            className="form-control"
            rows={8}
            placeholder="Write your article (in markdown)"
          ></textarea>
        </fieldset>
        <fieldset className="form-group">
          <input
            onChange={(e) => setTagList(e.target.value.split(","))}
            type="text"
            className="form-control"
            placeholder="Enter tags"
          />
          <div className="tag-list">
            {tagList.map((tag, index) => (
              <span className="tag-default tag-pill" key={index}>
                {" "}
                <i className="ion-close-round"></i> {tag}{" "}
              </span>
            ))}
          </div>
        </fieldset>
        <button className="btn btn-lg pull-xs-right btn-primary" type="submit">
          Publish Article
        </button>
      </fieldset>
    </form>
  );
}
