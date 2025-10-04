//

import { db } from "@/utils/dbConnection";
import { revalidatePath } from "next/cache";

export default async function PostIdPage({ params }) {
  // Next.js being very cranky about params now needing awaiting since version 15
  const awaitedParams = await params;
  const postId = parseInt(awaitedParams.postId, 10);

  const postResponse = await db.query(
    `SELECT id, title, author, content, created_at FROM pigeonblogposts WHERE id = $1;`,
    [postId]
  );

  const post = postResponse.rows[0];

  const commentResponse = await db.query(
    `SELECT id, author, content, created_at FROM pigeonblogcomments WHERE post_id = $1;`,
    [postId]
  );
  const comments = commentResponse.rows;

  if (!post) return <p>Post not found!</p>;

  // Now code to handle form for comment submissions
  async function handleCommentSubmit(formData) {
    "use server";

    const author = formData.get("author");
    const content = formData.get("content");

    await db.query(
      `INSERT INTO pigeonblogcomments (author, content, post_id) VALUES ($1, $2, $3)`,
      [author, content, postId]
    );

    revalidatePath(`/posts/${postId}`);
  }

  return (
    <div>
      <div className="post-container">
        <h1>{post.title}</h1>
        <h2>Written by: {post.author}</h2>
        {/* 'new' instance needed to use the .toLocaleDateString() method */}
        <h3>Posted on: {new Date(post.created_at).toLocaleDateString()}</h3>
        <p>{post.content}</p>
      </div>

      <div className="add-comment-container">
        <h3>Add a Comment</h3>
        <form action={handleCommentSubmit}>
          <label htmlFor="author">Your name:</label>
          <input type="text" name="author" required />
          <label htmlFor="content">Your comment:</label>
          <textarea name="content" required />
          <input type="hidden" name="postId" value={post.id} />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="comments-container">
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <h4>{comment.author}</h4>
              <h5>
                Posted on: {new Date(comment.created_at).toLocaleDateString()}
              </h5>
              <p>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
