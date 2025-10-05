//
import "@/app/globals.css";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <header>
        <h1>PIGEON BLOG</h1>
        <nav className="flex gap-4 mb-6">
          <Link
            href={"/"}
            className="inline-block px-4 py-2 bg-green-900 text-white rounded hover:bg-green-700 transition"
          >
            Home
          </Link>
          <Link
            href={"/posts"}
            className="inline-block px-4 py-2 bg-green-900 text-white rounded hover:bg-green-700 transition"
          >
            Posts
          </Link>
          <Link
            href={"/add-post"}
            className="inline-block px-4 py-2 bg-green-900 text-white rounded hover:bg-green-700 transition"
          >
            Add Post
          </Link>
        </nav>
      </header>
    </>
  );
}
