//

import { db } from "@/utils/dbConnection";
import { revalidatePath } from "next/cache";

export default async function PostIdPage({ params }) {
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

  if (!post)
    return <p className="text-center text-red-500 mt-8">Post not found!</p>;

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

  async function handleDeleteComment(formData) {
    "use server";
    const commentId = parseInt(formData.get("commentId"), 10);
    const postId = parseInt(formData.get("postId"), 10);

    await db.query(`DELETE FROM pigeonblogcomments WHERE id = $1`, [commentId]);
    revalidatePath(`/posts/${postId}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      {/* Post's content */}
      <div className="bg-white border border-gray-300 shadow-md p-6 rounded space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
        <h2 className="text-lg text-gray-600">Written by: {post.author}</h2>
        <h3 className="text-sm text-gray-500">
          Posted on: {new Date(post.created_at).toLocaleDateString()}
        </h3>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Comment Form */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Add a Comment</h3>
        <form action={handleCommentSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Your name:
            </label>
            <input
              type="text"
              name="author"
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Your comment:
            </label>
            <textarea
              name="content"
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <input type="hidden" name="postId" value={post.id} />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-4 rounded shadow space-y-2"
            >
              <h4 className="text-md font-medium text-gray-700">
                {comment.author}
              </h4>
              <h5 className="text-sm text-gray-500">
                Posted on: {new Date(comment.created_at).toLocaleDateString()}
              </h5>
              <p className="text-gray-700">{comment.content}</p>
              <form action={handleDeleteComment}>
                <input type="hidden" name="commentId" value={comment.id} />
                <input type="hidden" name="postId" value={post.id} />
                <button
                  type="submit"
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition cursor-pointer"
                >
                  Delete
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
