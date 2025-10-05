//
// Page with a form to add a new blog post

import { db } from "@/utils/dbConnection";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function AddPostPage() {
  async function handleSubmit(formData) {
    "use server";

    const formValues = {
      title: formData.get("title"),
      author: formData.get("author"),
      content: formData.get("content"),
    };

    await db.query(
      `INSERT INTO pigeonblogposts (title, author, content) VALUES($1, $2, $3)`,
      [formValues.title, formValues.author, formValues.content]
    );

    revalidatePath("/posts");
    redirect("posts");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Add a New Post</h1>
        <p className="text-gray-600">
          Fill out the form below to publish a new blog post.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Post Title
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your post title"
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author&apos;s Name
          </label>
          <input
            type="text"
            name="author"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            name="content"
            required
            rows="6"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Start writing your post here..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition cursor-pointer"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
}
