import { usernameToPath } from "@/lib/utils/usernameToPath";
import Link from "next/link";
import Image from "next/image";
import TagList from "./TagList";

export type ArticlePreviewProps = {
  author: string;
  authorPFP: string;
  date: string;
  header: string;
  description: string;
  likes: number;
  tags: string[];
};

export default function ArticlePreview(props: ArticlePreviewProps) {
  const { author, date, header, description, tags, authorPFP, likes } = props;
  return (
    <div className="article-preview">
      <ArticleMeta
        author={author}
        authorPFP={authorPFP}
        date={date}
        likes={likes}
      />
      <a href={`/article/${usernameToPath(header)}`} className="preview-link">
        <h1>{header}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <TagList tags={tags} />
      </a>
    </div>
  );
}

function ArticleMeta(props: {
  author: string;
  authorPFP: string;
  date: string;
  likes: number;
}) {
  const { author, authorPFP, date, likes } = props;
  return (
    <div className="article-meta">
      <Link href={`/profile/${usernameToPath(author)}`}>
        <Image src={authorPFP} alt="author" width={32} height={32} />
      </Link>
      <div className="info">
        <a href={`/profile/${usernameToPath(author)}`} className="author">
          {author}
        </a>
        <span className="date">{date}</span>
      </div>
      <FavoriteButton
        slug={slug}
        favoritesNumber={favoritesNumber}
        favorited={false}
      />
    </div>
  );
}
