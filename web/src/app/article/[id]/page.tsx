import { ArticlePreviewProps } from "@/components/ArticlePreview";
import TagList from "@/components/TagList";
import { usernameToPath } from "@/lib/utils/usernameToPath";
import Link from "next/link";
import Image from "next/image";
import ArticleComments from "@/components/ArticleComments";
import fetchFromAPI from "@/lib/fetchFromAPI";

type ArticleItem = { type: "p" | "h2"; content: string };
type ArticleContent = { text: ArticleItem[] };

async function getArticle(slug: string): Promise<{ article: Article }> {
  const data = await fetchFromAPI(`/articles/${slug}`);
  return await data.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const article = (await getArticle(params.id)).article;
  return (
    <div className="article-page">
      <Banner article={article} />
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article.body}</p>
            <TagList tags={article.tagList} />
          </div>
        </div>

        <hr />

        <ArticleActions article={article} />
        <ArticleComments />
      </div>
    </div>
  );
}

function Banner(props: { article: Article }) {
  const { article } = props;
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
          <button className="btn btn-sm btn-outline-secondary">
            <i className="ion-plus-round"></i>
            &nbsp; Follow {article.author.username}{" "}
            <span className="counter">(10)</span>
          </button>
          &nbsp;&nbsp;
          <button className="btn btn-sm btn-outline-primary">
            <i className="ion-heart"></i>
            &nbsp; Favorite Post{" "}
            <span className="counter">{article.favoritesCount}</span>
          </button>
          <button className="btn btn-sm btn-outline-secondary">
            <i className="ion-edit"></i> Edit Article
          </button>
          <button className="btn btn-sm btn-outline-danger">
            <i className="ion-trash-a"></i> Delete Article
          </button>
        </div>
      </div>
    </div>
  );
}

function ArticleActions(props: { article: Article }) {
  const { article } = props;
  return (
    <div className="article-actions">
      <div className="article-meta">
        <Link href={`/profile/${usernameToPath(article.author.username)}`}>
          <Image
            src={article.author.image}
            alt="author pfp"
            width={64}
            height={64}
          />
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
        <button className="btn btn-sm btn-outline-secondary">
          <i className="ion-plus-round"></i>
          &nbsp; Follow {article.author.username}
        </button>
        &nbsp;
        <button className="btn btn-sm btn-outline-primary">
          <i className="ion-heart"></i>
          &nbsp; Favorite Article{" "}
          <span className="counter">({article.favoritesCount})</span>
        </button>
        <button className="btn btn-sm btn-outline-secondary">
          <i className="ion-edit"></i> Edit Article
        </button>
        <button className="btn btn-sm btn-outline-danger">
          <i className="ion-trash-a"></i> Delete Article
        </button>
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
