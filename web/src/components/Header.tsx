import Link from "next/link";
import Image from "next/image";
import { usernameToPath } from "@/lib/utils/usernameToPath";

async function getUser(auth: boolean = false) {
  // Simulate fetching user data
  if (!auth) return { username: undefined };
  return { username: "John Dou" };
}

export default async function Header() {
  const { username } = await getUser(true);
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
        {username && (
          <>
            <NavItem>
              <Link href="editor" className="ion-compose">
                New Article
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/settings" className="ion-gear-a">
                Settings
              </Link>
            </NavItem>
            <NavItem>
              <Link
                href={`/profile/${usernameToPath(username)}`}
                className="ion-person"
              >
                <Image
                  src="http://i.imgur.com/Qr71crq.jpg"
                  className="user-pic"
                  alt={username}
                  width={32}
                  height={32}
                />
              </Link>
            </NavItem>
          </>
        )}
      </NavBarContainer>
    </nav>
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
