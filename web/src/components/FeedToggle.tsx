"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function FeedToggle(props: {
  items: {
    name: string;
    param?: { name: string; value: string };
  }[];
  active?: number;
}) {
  const { items } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      console.log(params);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {items.map((item, idx) => {
          const param = item.param;
          let paramObject: { [key: string]: string } = {};
          if (param) {
            paramObject[param.name] = param.value;
          }
          return (
            <li className="nav-item" key={item.name}>
              {param !== undefined && (
                <Link
                  className={`nav-link ${searchParams.get(param.name) === param.value ? "active" : ""}`}
                  href={{
                    pathname: pathname,
                    query: createQueryString(param.name, param.value),
                  }}
                >
                  {item.name}
                </Link>
              )}
              {item.param === undefined && <span>{item.name}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
