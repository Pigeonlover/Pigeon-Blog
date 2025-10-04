//
import { db } from "@/utils/dbConnection";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function AddPostPage() {
  async function handleSubmit(formData) {
    // The function to be executed in the server
    "use server";

    // Storing the form data
    const formValues = {
      title: formData.get("title"),
      author: formData.get("author"),
      content: formData.get("content"),
    };
    console.log(formValues);

    // Then we insert the data into the database table
    db.query(
      `INSERT INTO pigeonblogposts (title, author, content) VALUES($1, $2, $3)`,
      [formValues.title, formValues.author, formValues.content]
    );

    //refresh the cache
    revalidatePath("/posts");

    //redirect the user to the rollercoasters page
    redirect("posts");
  }

  return (
    <>
      <div>
        <h1>Add a new post</h1>
        <p>Form to create a new post.</p>

        <form action={handleSubmit}>
          <fieldset>
            <label htmlFor="title">New post&apos;s title: </label>
            <input type="text" name="title" required />
            <label htmlFor="author">Author: </label>
            <input type="text" name="author" required />
            <label htmlFor="content">Content: </label>
            <input type="text" name="content" required />
          </fieldset>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
