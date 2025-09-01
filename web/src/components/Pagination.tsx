import Link from "next/link";

export default function Pagination(props: {
  location: string;
  offset: number;
  last: boolean;
}) {
  const { location, offset, last } = props;
  return (
    <ul className="pagination">
      <li className={`page-item ${offset === 0 && "active"}`}>
        <Link className="page-link" href={location}>
          1
        </Link>
      </li>
      {offset > 20 && (
        <li className={`page-item`}>
          <Link
            className="page-link"
            href={`${location}?offset=${offset - 20}`}
          >
            {offset / 20}
          </Link>
        </li>
      )}
      {offset > 0 && (
        <li className={`page-item ${offset > 0 && "active"}`}>
          <Link className="page-link" href={`${location}?offset=${offset}`}>
            {(offset + 20) / 20}
          </Link>
        </li>
      )}
      {!last && (
        <li className="page-item">
          <Link
            className="page-link"
            href={`${location}?offset=${offset + 20}`}
          >
            {(offset + 40) / 20}
          </Link>
        </li>
      )}
    </ul>
  );
}
