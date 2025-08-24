import ArticlePreview, {
  ArticlePreviewProps,
} from "@/components/ArticlePreview/ArticlePreview";
import FeedToggle from "@/components/FeedToggle";
import FollowButton from "@/components/FollowButton";
import fetchServer from "@/lib/req/fetchServer";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getMyArticles(username: string): Promise<Article[]> {
  const articles = await (
    await fetchServer(`/articles?author=${username}`)
  ).json();
  return articles.articles;
}

async function getProfile(username: string) {
  const response = await fetchServer(`/profiles/${username}`);
  const deserialized = await response.json();
  if (!deserialized.profile) {
    notFound();
  }
  return deserialized.profile as User;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articles = await getMyArticles(id);
  const profile = await getProfile(id);
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <Image
                src={profile.image}
                className="user-img"
                alt="profile picture"
                width={100}
                height={100}
              />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
            </div>
          </div>
          <Controls user={profile} />
        </div>
      </div>
      <Articles articles={articles} />
    </div>
  );
}

function Articles(props: { articles: Article[] }) {
  const { articles } = props;
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-md-10 offset-md-1">
          <FeedToggle
            items={[
              { name: "My Articles", href: "" },
              { name: "Favorited Articles", href: "" },
            ]}
            active={0}
          />

          {articles.map((article) => (
            <ArticlePreview key={article.slug} article={article} />
          ))}

          <Pagination />
        </div>
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

function Controls({ user }: { user: User }) {
  return (
    <>
      <FollowButton user={user} />
      <button className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i>
        &nbsp; Edit Profile Settings
      </button>
    </>
  );
}
