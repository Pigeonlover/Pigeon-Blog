//
import Link from "next/link";

export default function Header() {
  return (
    <>
      <div>
        <header>
          <h1>PIGEON BLOG</h1>
          <nav>
            <Link href={"/"}>Home</Link>
            <Link href={"/posts"}>Posts</Link>
            <Link href={"/add-post"}>Add Post</Link>
          </nav>
        </header>
      </div>
    </>
  );
}
