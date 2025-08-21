import fetchServer from "@/lib/req/fetchServer";
import formatTime from "@/lib/utils/formatTime";
import { usernameToPath } from "@/lib/utils/usernameToPath";
import Image from "next/image";
import Link from "next/link";
import CommentEditor from "./CommentEditor";

interface Comment {
  id: string;
  author: User;
  body: string;
  createdAt: string;
  updatedAt: string;
}

async function getComments(slug: string) {
  const data = await fetchServer(`/articles/${slug}/comments`);
  const deserialized = await data.json();
  return deserialized.comments as Comment[];
}

export default async function ArticleComments(props: { slug: string }) {
  const { slug } = props;
  const comments = await getComments(slug);
  return (
    <div className="row">
      <div className="col-xs-12 col-md-8 offset-md-2">
        <CommentEditor slug={slug} />
        <ul>
          {comments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Comment(props: Comment) {
  const { author, body, createdAt } = props;
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{body}</p>
      </div>
      <div className="card-footer">
        <Link
          href={`/profile/${usernameToPath(author.username)}`}
          className="comment-author"
        >
          <Image
            src={author.image}
            className="comment-author-img"
            width={64}
            height={64}
            alt="comment author pfp"
          />
        </Link>
        &nbsp;
        <Link href="/profile/jacob-schmidt" className="comment-author">
          {author.username}
        </Link>
        <span className="date-posted">{formatTime(createdAt)}</span>
        <span className="mod-options">
          <i className="ion-trash-a"></i>
        </span>
      </div>
    </div>
  );
}
