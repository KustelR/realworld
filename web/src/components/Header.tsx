import Link from "next/link";
import Image from "next/image";
import { usernameToPath } from "@/lib/utils/usernameToPath";
import fetchAuth from "@/lib/req/fetchServer";

async function getUser(): Promise<User | undefined> {
  const response = await fetchAuth("/user");

  const data = await response.json();
  const user = data.user;
  return user ?? user;
}

export default async function Header() {
  const user = await getUser();
  const { username } = user ?? {};
  return (
    <nav className="navbar navbar-light">
      <NavBarContainer>
        <NavItem>
          <Link href="/">Home</Link>
        </NavItem>
        {username === undefined && (
          <>
            <NavItem>
              <Link href="/login">Sign in</Link>
            </NavItem>
            <NavItem>
              <Link href="/register">Sign up</Link>
            </NavItem>
          </>
        )}
        {user && <UserCorner user={user} />}
      </NavBarContainer>
    </nav>
  );
}

function UserCorner(props: { user: User }) {
  const { user } = props;
  const { username, image } = user;
  return (
    <>
      <NavItem>
        <Link href="/editor" className="ion-compose">
          New Article
        </Link>
      </NavItem>
      <NavItem>
        <Link href="/settings" className="ion-gear-a">
          Settings
        </Link>
      </NavItem>
      <NavItem>
        <Link href={`/profile/${username}`} className="ion-person">
          <Image
            src={image ?? ""}
            className="user-pic"
            alt={username}
            width={32}
            height={32}
          />
        </Link>
      </NavItem>
    </>
  );
}

function NavBarContainer(props: { children?: React.ReactNode }) {
  const { children } = props;
  return (
    <div className="container">
      <a className="navbar-brand" href="/">
        conduit
      </a>
      <ul className="nav navbar-nav pull-xs-right">{children}</ul>
    </div>
  );
}

function NavItem(props: { children: React.ReactNode }) {
  const { children } = props;
  return <li className="nav-item">{children}</li>;
}
