import { useState } from "react";
import { deleteBlog, getAll } from "../services/blogs";

export const Blog = ({
  blog,
  setBlogs,
  token,
  showNotification,
  username,
  handleLike,
}) => {
  const [toggle, setToggle] = useState(false);
  const blogStyle = {
    padding: 10,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}`)) {
      const response = await deleteBlog(token, blog.id);
      getAll().then((blogs) => setBlogs(blogs));
      if (response.status === 204) {
        showNotification(
          `Removed "${blog.title}" by ${blog.author}`,
          "success"
        );
      } else {
        showNotification(`Blot not found`, "fail");
      }
    } else {
      return;
    }
  };

  return (
    <div className="indv-blog" style={blogStyle}>
      <div>
        <span className="title">{blog.title}</span> -{" "}
        <span className="author">{blog.author}</span>
        <button
          style={{ marginLeft: 5 }}
          onClick={() => (toggle ? setToggle(false) : setToggle(true))}
        >
          {toggle ? "Hide" : "View"}
        </button>
      </div>
      {toggle && (
        <div>
          <div>
            URL:
            <a href={blog.url} className="url" target="_blank">
              {blog.url}
            </a>
          </div>
          <div>
            Likes:<span className="likes"> {blog.likes} </span>
            <button onClick={() => handleLike(blog, token)}>Like</button>
          </div>
          <div>Created by: {blog.user.name}</div>
          {username === blog.user.username && (
            <button id="likeButton" onClick={handleDelete}>
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};
