import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span className="attribution">
          An interactive learning project from{" "}
          <Link href="https://thinkster.io">Thinkster</Link>. Code &amp; design
          licensed under{" "}
          <Link href="https://opensource.org/licenses/MIT">MIT</Link>.
        </span>
      </div>
    </footer>
  );
}
