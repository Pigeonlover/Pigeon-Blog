import Link from "next/link";
import { db } from "@/utils/dbConnection";

export default async function PostsPage() {
  const posts = (
    await db.query(
      `SELECT id, title, author, content, created_at FROM pigeonblogposts`
    )
  ).rows;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-inter p-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Posts</h2>
      <p className="mb-6 text-center">
        List of all the posts currently available.
      </p>

      <ul className="space-y-4 max-w-xl mx-auto">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.id}`}
              className="block bg-white shadow-md p-4 rounded hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500">
                By {post.author} •{" "}
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
