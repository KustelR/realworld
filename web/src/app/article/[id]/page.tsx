import TagList from "@/components/TagList";
import { usernameToPath } from "@/lib/utils/usernameToPath";
import Link from "next/link";
import Image from "next/image";
import ArticleComments from "@/components/ArticleComments";
import fetchFromAPI from "@/lib/req/fetchServer";
import FavoriteButton from "../FavoriteButton";
import ControlsAuthorized from "./ControlsAuthorized";
import FollowButton from "@/components/FollowButton";

type ArticleItem = { type: "p" | "h2"; content: string };

async function getArticle(slug: string): Promise<{ article: Article }> {
  const data = await fetchFromAPI(`/articles/${slug}`);
  return await data.json();
}

async function getUser(): Promise<{ user: User }> {
  const data = await fetchFromAPI("/user");
  return await data.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = (await getArticle(id)).article;
  const user = (await getUser()).user;
  return (
    <div className="article-page">
      <Banner article={article} user={user} />
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article.body}</p>
            <TagList tags={article.tagList} />
          </div>
        </div>

        <hr />

        <ArticleActions article={article} user={user} />
        <ArticleComments />
      </div>
    </div>
  );
}

function Banner(props: { article: Article; user: User }) {
  const { article, user } = props;
  const { author } = article;
  return (
    <div className="banner">
      <div className="container">
        <h1>{article.title}</h1>

        <div className="article-meta">
          <Link href={`/profile/${usernameToPath(author.username)}`}>
            {author.image && (
              <Image
                src={author.image}
                alt={author.username}
                width={32}
                height={32}
              />
            )}
          </Link>
          <div className="info">
            <Link
              href={`/profile/${usernameToPath(article.author.username)}`}
              className="author"
            >
              {article.author.username}
            </Link>
            <span className="date">{article.createdAt}</span>
          </div>
          <FollowButton target={author.username} />
          &nbsp;
          <FavoriteButton
            slug={article.slug}
            favorited={article.favorited ?? false}
            favoritesCount={article.favoritesCount}
          />
          &nbsp;
          {author.username == user.username && (
            <ControlsAuthorized slug={article.slug} />
          )}
        </div>
      </div>
    </div>
  );
}

function ArticleActions(props: { article: Article; user: User }) {
  const { article, user } = props;
  return (
    <div className="article-actions">
      <div className="article-meta">
        <Link href={`/profile/${usernameToPath(article.author.username)}`}>
          {article.author.image && (
            <Image
              src={article.author.image}
              alt="author pfp"
              width={64}
              height={64}
            />
          )}
        </Link>
        <div className="info">
          <Link
            href={`/profile/${usernameToPath(article.author.username)}`}
            className="author"
          >
            {article.author.username}
          </Link>
          <span className="date">{article.createdAt}</span>
        </div>
        &nbsp;
        <FollowButton target={article.author.username} />
        &nbsp;
        <FavoriteButton
          slug={article.slug}
          favorited={article.favorited ?? false}
          favoritesCount={article.favoritesCount}
        />
        &nbsp;
        {article.author.username == user.username && (
          <ControlsAuthorized slug={article.slug} />
        )}
      </div>
    </div>
  );
}

function RenderText(props: { text: ArticleItem[] }) {
  const { text } = props;
  return (
    <div>
      {text.map((item, index) => {
        switch (item.type) {
          case "p":
            return <p key={index}>{item.content}</p>;
          case "h2":
            return <h2 key={index}>{item.content}</h2>;
        }
        return null;
      })}
    </div>
  );
}
