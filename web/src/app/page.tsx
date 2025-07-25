import Link from "next/link";
import Image from "next/image";
import { usernameToPath } from "@/lib/utils/usernameToPath";
import ArticlePreview, {
  ArticlePreviewProps,
} from "@/components/ArticlePreview";
import FeedToggle from "@/components/FeedToggle";

async function getArticles(): Promise<ArticlePreviewProps[]> {
  return [
    {
      author: "Eric Simons",
      authorPFP: "http://i.imgur.com/Qr71crq.jpg",
      date: "January 20th",
      header: "How to build webapps that scale",
      description: "This is the description for the post.",
      likes: 29,
      tags: ["realworld", "implementations"],
    },
    {
      author: "Albert Pai",
      authorPFP: "http://i.imgur.com/N4VcUeJ.jpg",
      date: "January 20th",
      header:
        "The song you won't ever stop singing. No matter how hard you try.",
      description: "This is the description for the post.",
      likes: 32,
      tags: ["realworld", "implementations"],
    },
  ];
}

async function getPopularTags(): Promise<string[]> {
  return [
    "programming",
    "javascript",
    "emberjs",
    "angularjs",
    "react",
    "mean",
    "node",
    "rails",
  ];
}

export default async function Home() {
  const articles = await getArticles();
  const popularTags = await getPopularTags();
  return (
    <div className="home-page">
      <Banner />

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedToggle
              active={0}
              items={[
                { name: "Your Feed", href: "" },
                { name: "Global Feed", href: "" },
              ]}
            />
            {articles.map((article) => (
              <ArticlePreview key={article.header} {...article} />
            ))}
            <Pagination />
          </div>
          <PopularTags tags={popularTags} />
        </div>
      </div>
    </div>
  );
}

function Banner() {
  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
  );
}

function Pagination() {
  return (
    <ul className="pagination">
      <li className="page-item active">
        <a className="page-link" href="">
          1
        </a>
      </li>
      <li className="page-item">
        <a className="page-link" href="">
          2
        </a>
      </li>
    </ul>
  );
}

function PopularTags(props: { tags: string[] }) {
  return (
    <div className="col-md-3">
      <div className="sidebar">
        <p>Popular Tags</p>

        <div className="tag-list">
          {props.tags.map((tag) => (
            <a href="" className="tag-pill tag-default" key={tag}>
              {tag}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
