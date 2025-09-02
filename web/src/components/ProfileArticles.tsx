"use client";

import { useEffect, useState } from "react";
import ArticlePreview from "./ArticlePreview/ArticlePreview";
import fetchFromAPI from "@/lib/req/fetchClient";

enum ArticleMode {
  my,
  favorited,
}

export default function ProfileArticles(props: { author: string }) {
  const [mode, setMode] = useState<ArticleMode>(ArticleMode.my);
  const [page, setPage] = useState<number>(1);
  const { author } = props;
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    const params: { [key: string]: string } = {};
    if (mode === ArticleMode.my) params.author = author;
    if (mode === ArticleMode.favorited) params.favorited = author;
    if (page !== 1) params.offset = ((page - 1) * 20).toString();
    fetchFromAPI(`/articles`, undefined, params).then(async (res) => {
      const data = await res.json();
      setArticles(data.articles);
    });
  }, [mode, page]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-md-10 offset-md-1">
          <ModeSetter onChange={setMode} current={mode} />

          {articles.map((article) => (
            <ArticlePreview key={article.slug} article={article} />
          ))}

          <PaginationClient page={page} setPage={setPage} />
        </div>
      </div>
    </div>
  );
}

function ModeSetter(props: {
  onChange: (mode: ArticleMode) => void;
  current: ArticleMode;
}) {
  const { onChange, current } = props;
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <button
            onClick={() => {
              onChange(ArticleMode.my);
            }}
            className={`nav-link ${current === ArticleMode.my && "active"}`}
          >
            My articles
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${current === ArticleMode.favorited && "active"}`}
            onClick={() => {
              onChange(ArticleMode.favorited);
            }}
          >
            Favorited articles
          </button>
        </li>
      </ul>
    </div>
  );
}

function PaginationClient(props: {
  setPage: (page: number) => void;
  page: number;
}) {
  const { page, setPage } = props;
  return (
    <ul className="pagination">
      <li className={`page-item ${page === 1 && "active"}`}>
        <button onClick={() => setPage(1)} className="page-link">
          1
        </button>
      </li>
      {page > 2 && (
        <li className={`page-item`}>
          <button onClick={() => setPage(page - 1)} className="page-link">
            {page - 1}
          </button>
        </li>
      )}
      {page > 1 && (
        <li className={`page-item ${page > 1 && "active"}`}>
          <button onClick={() => setPage(page)} className="page-link">
            {page}
          </button>
        </li>
      )}
      {
        <li className="page-item">
          <button onClick={() => setPage(page + 1)} className="page-link">
            {page + 1}
          </button>
        </li>
      }
    </ul>
  );
}
