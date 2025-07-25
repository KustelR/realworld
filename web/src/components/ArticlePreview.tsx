import { usernameToPath } from "@/lib/utils/usernameToPath";
import Link from "next/link";
import Image from "next/image";

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
        <ul className="tag-list">
          {tags.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
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
      <button className="btn btn-outline-primary btn-sm pull-xs-right">
        <i className="ion-heart"></i> {likes}
      </button>
    </div>
  );
}
