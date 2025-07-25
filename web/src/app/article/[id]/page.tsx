import { ArticlePreviewProps } from "@/components/ArticlePreview";
import TagList from "@/components/TagList";
import { usernameToPath } from "@/lib/utils/usernameToPath";
import Link from "next/link";
import Image from "next/image";
import ArticleComments from "@/components/ArticleComments";

type ArticleItem = { type: "p" | "h2"; content: string };
type ArticleContent = { text: ArticleItem[] };

async function getArticle(): Promise<ArticlePreviewProps & ArticleContent> {
  return {
    author: "Eric Simons",
    authorPFP: "http://i.imgur.com/Qr71crq.jpg",
    date: "January 20th",
    header: "How to build webapps that scale",
    description: "This is the description for the post.",
    likes: 29,
    tags: ["realworld", "implementations"],
    text: [
      {
        type: "p",
        content:
          "Web development technologies have evolved at an incredible clip over the past few years.",
      },
      { type: "h2", content: "Introducing RealWorld." },
      {
        type: "p",
        content:
          "It's a great solution for learning how other frameworks work.",
      },
    ],
  };
}

export default async function Page() {
  const article = await getArticle();
  return (
    <div className="article-page">
      <Banner article={article} />
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <RenderText text={article.text} />
            <TagList tags={article.tags} />
          </div>
        </div>

        <hr />

        <ArticleActions article={article} />
        <ArticleComments />
      </div>
    </div>
  );
}

function Banner(props: { article: ArticlePreviewProps }) {
  const { article } = props;
  return (
    <div className="banner">
      <div className="container">
        <h1>{article.header}</h1>

        <div className="article-meta">
          <Link href={`/profile/${usernameToPath(article.author)}`}>
            <img src={article.authorPFP} />
          </Link>
          <div className="info">
            <Link
              href={`/profile/${usernameToPath(article.author)}`}
              className="author"
            >
              {article.author}
            </Link>
            <span className="date">{article.date}</span>
          </div>
          <button className="btn btn-sm btn-outline-secondary">
            <i className="ion-plus-round"></i>
            &nbsp; Follow {article.author} <span className="counter">(10)</span>
          </button>
          &nbsp;&nbsp;
          <button className="btn btn-sm btn-outline-primary">
            <i className="ion-heart"></i>
            &nbsp; Favorite Post{" "}
            <span className="counter">{article.likes}</span>
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

function ArticleActions(props: { article: ArticlePreviewProps }) {
  const { article } = props;
  return (
    <div className="article-actions">
      <div className="article-meta">
        <Link href={`/profile/${usernameToPath(article.author)}`}>
          <Image
            src={article.authorPFP}
            alt="author pfp"
            width={64}
            height={64}
          />
        </Link>
        <div className="info">
          <Link
            href={`/profile/${usernameToPath(article.author)}`}
            className="author"
          >
            {article.author}
          </Link>
          <span className="date">{article.date}</span>
        </div>
        <button className="btn btn-sm btn-outline-secondary">
          <i className="ion-plus-round"></i>
          &nbsp; Follow {article.author}
        </button>
        &nbsp;
        <button className="btn btn-sm btn-outline-primary">
          <i className="ion-heart"></i>
          &nbsp; Favorite Article{" "}
          <span className="counter">({article.likes})</span>
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
