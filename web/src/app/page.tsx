import ArticlePreview from "@/components/ArticlePreview/ArticlePreview";
import FeedToggle from "@/components/FeedToggle";
import fetchServer from "@/lib/req/fetchServer";

async function getArticles(): Promise<{ articles: Article[] }> {
  const data = await fetchServer("/articles");
  const articles: Article[] = (await data.json()).articles;
  return { articles };
}

async function getPopularTags(): Promise<string[]> {
  const data = await fetchServer("/tags");
  const tags: string[] = (await data.json()).tags;
  return tags;
}

export default async function Home() {
  const articles = (await getArticles()).articles;
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
              <ArticlePreview key={article.slug} article={article} />
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
