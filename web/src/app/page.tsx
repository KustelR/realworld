import ArticlePreview from "@/components/ArticlePreview/ArticlePreview";
import FeedToggle from "@/components/FeedToggle";
import Pagination from "@/components/Pagination";
import fetchServer from "@/lib/req/fetchServer";

async function getArticles(
  limit?: number,
  offset?: number,
  feed: "global" | "personal" = "global",
): Promise<{ articles: Article[] }> {
  const searchParams: { [key: string]: string } = {};
  if (limit) searchParams.limit = limit.toString();
  if (offset) searchParams.offset = offset.toString();

  const data = await fetchServer(
    `/articles/${feed === "personal" ? "feed" : ""}`,
    undefined,
    searchParams,
  );
  if (data.ok) {
    const articles: Article[] = (await data.json()).articles;
    return { articles };
  } else {
    console.warn(
      `something went wrong while fetching articles: ${(await data.json()).detail}`,
    );
    return { articles: [] };
  }
}

async function getPopularTags(): Promise<string[]> {
  const data = await fetchServer("/tags");
  const tags: string[] = (await data.json()).tags;
  return tags;
}

export default async function Home(params: Promise<{ searchParams: any }>) {
  const { searchParams } = await params;
  const limit: string = (await (await searchParams).limit) ?? 0;
  const offset: string = (await (await searchParams).offset) ?? 0;
  const feedMode = await (await searchParams).feed;
  const articles = (
    await getArticles(parseInt(limit), parseInt(offset), feedMode)
  ).articles;
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
                {
                  name: "Your Feed",
                  param: { name: "feed", value: "personal" },
                },
                {
                  name: "Global Feed",
                  param: { name: "feed", value: "global" },
                },
              ]}
            />
            {articles.map((article) => (
              <ArticlePreview key={article.slug} article={article} />
            ))}
            <Pagination
              location="/"
              offset={parseInt(offset)}
              last={articles.length < 20}
            />
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
