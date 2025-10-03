//
import { db } from "@/utils/dbConnection";

export default async function PostIdPage(params) {
  const postId = params;
  const post = (
    await db.query(
      `SELECT id, title, author, content, created_at FROM pigeonblogposts WHERE id = $1`,
      [postId]
    )
  ).rows[0];

  if (!post) return <p>Post not found!</p>;
  return (
    <>
      <div>
        <h1>{post.title}</h1>
        <h2>Posted on: {post.created_at}</h2>
        <p>{post.content}</p>
      </div>
    </>
  );
}
