//
import Link from "next/link";
import { db } from "@/utils/dbConnection";

export default async function PostsPage() {
  const posts = (
    await db.query(
      `SELECT id, title, author, content, created_at FROM pigeonblogposts`
    )
  ).rows;

  console.log(posts);

  return (
    <>
      <div>
        <h1>Posts</h1>
        <p>List of all the posts.</p>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
