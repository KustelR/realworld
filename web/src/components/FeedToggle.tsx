import Link from "next/link";

export default function FeedToggle(props: {
  items: { name: string; href: string }[];
  active?: number;
}) {
  const { items } = props;
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {items.map((item, idx) => (
          <li className="nav-item" key={item.name}>
            <Link
              className={`nav-link ${props.active === idx ? "active" : ""}`}
              href={item.href}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
