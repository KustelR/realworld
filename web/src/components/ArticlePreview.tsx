import { usernameToPath } from "@/lib/utils/usernameToPath";
import Link from "next/link";
import Image from "next/image";
import TagList from "./TagList";
import FavoriteButton from "./FavoriteButton";

export type User = {
  username: string;
  image: string;
  bio: string;
};

export type ArticlePreviewProps = {
  article: Article;
};

export default function ArticlePreview(props: ArticlePreviewProps) {
  const {
    slug,
    author,
    createdAt,
    title,
    description,
    tagList,
    favoritesCount,
    favorited,
  } = props.article;
  return (
    <div className="article-preview">
      <ArticleMeta
        slug={slug}
        author={author}
        date={createdAt}
        favoritesNumber={favoritesCount}
        favorited={favorited}
      />
      <a href={`/article/${usernameToPath(title)}`} className="preview-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <TagList tags={tagList} />
      </a>
    </div>
  );
}

function ArticleMeta(props: {
  slug: string;
  author: User;
  date: string;
  favoritesNumber: number;
  favorited?: boolean;
}) {
  const { slug, author, date, favoritesNumber, favorited } = props;
  return (
    <div className="article-meta">
      <Link href={`/profile/${author.username}`}>
        {author.image && (
          <Image src={author.image} alt="author" width={32} height={32} />
        )}
      </Link>
      <div className="info">
        <a href={`/profile/${author.username}`} className="author">
          {author.username}
        </a>
        <span className="date">{date}</span>
      </div>
      <FavoriteButton
        slug={slug}
        favoritesNumber={favoritesNumber}
        favorited={favorited ?? false}
      />
    </div>
  );
}
