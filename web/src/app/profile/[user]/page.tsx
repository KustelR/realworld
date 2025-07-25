import ArticlePreview, {
  ArticlePreviewProps,
} from "@/components/ArticlePreview";
import FeedToggle from "@/components/FeedToggle";
import Image from "next/image";

async function getMyArticles() {
  // Simulate fetching articles for the user
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

async function getUser() {
  // Simulate fetching user data
  return {
    username: "Eric Simons",
    bio: "Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda looks like Peeta from the Hunger Games",
    image: "http://i.imgur.com/Qr71crq.jpg",
  };
}

export default async function Page() {
  const articles = await getMyArticles();
  const user = await getUser();
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <Image
                src={user.image}
                className="user-img"
                alt="profile picture"
                width={100}
                height={100}
              />
              <h4>{user.username}</h4>
              <p>{user.bio}</p>
            </div>
          </div>
          <Controls user={user} />
        </div>
      </div>
      <Articles articles={articles} />
    </div>
  );
}

function Articles(props: { articles: ArticlePreviewProps[] }) {
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
            <ArticlePreview key={article.header} {...article} />
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

function Controls({ user }: { user: { username: string } }) {
  return (
    <>
      <button className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-plus-round"></i>
        &nbsp; Follow {user.username}
      </button>
      <button className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i>
        &nbsp; Edit Profile Settings
      </button>
    </>
  );
}
