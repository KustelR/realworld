import { usernameToPath } from "@/lib/utils/usernameToPath";
import Image from "next/image";
import Link from "next/link";

export default function ArticleComments() {
  return (
    <div className="row">
      <div className="col-xs-12 col-md-8 offset-md-2">
        <form className="card comment-form">
          <div className="card-block">
            <textarea
              className="form-control"
              placeholder="Write a comment..."
              rows={3}
            ></textarea>
          </div>
          <div className="card-footer">
            <img
              src="http://i.imgur.com/Qr71crq.jpg"
              className="comment-author-img"
            />
            <button className="btn btn-sm btn-primary">Post Comment</button>
          </div>
        </form>
        <Comment
          author={{
            username: "Jacob Schmidt",
            profilePicture: "http://i.imgur.com/Qr71crq.jpg",
          }}
          content="This is a great article!"
        />
        <Comment
          author={{
            username: "Jane Doe",
            profilePicture: "http://i.imgur.com/Qr71crq.jpg",
          }}
          content="Thanks for sharing!"
        />
      </div>
    </div>
  );
}

interface CommentAuthor {
  username: string;
  profilePicture: string;
}

interface CommentData {
  author: CommentAuthor;
  content: string;
}

function Comment(props: CommentData) {
  const { author, content } = props;
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{content}</p>
      </div>
      <div className="card-footer">
        <Link
          href={`/profile/${usernameToPath(author.username)}`}
          className="comment-author"
        >
          <Image
            src={author.profilePicture}
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
        <span className="date-posted">Dec 29th</span>
        <span className="mod-options">
          <i className="ion-trash-a"></i>
        </span>
      </div>
    </div>
  );
}
