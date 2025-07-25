import Link from "next/link";
import Image from "next/image";

async function getUser(auth: boolean = false) {
  // Simulate fetching user data
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
              <Link href="editor" className="ion-compose"></Link>New Article
            </NavItem>
            <NavItem>
              <Link href="/settings" className="ion-gear-a"></Link>Settings
            </NavItem>
            <NavItem>
              <Link
                href={`/profile/${usernameToPath(username)}`}
                className="ion-person"
              >
                <Image
                  src={`https://placehold.co/32x32`}
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

function usernameToPath(username: string): string {
  return username.toLocaleLowerCase().replace(/ /g, "-");
}
