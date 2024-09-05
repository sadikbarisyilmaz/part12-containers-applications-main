import { useState, useEffect } from "react";
import { Blog } from "./components/Blog";
import { createBlog, getAll, updateBlog } from "./services/blogs";
import { login } from "./services/login";
import { Notification } from "./components/Notification";
import { LoginForm } from "./components/LoginForm";
import { BlogForm } from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showBlogForm, setShowBlogForm] = useState(false);

  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const getBlogs = async () => {
      const blogs = await getAll();
      setBlogs(blogs);
    };

    getBlogs();

    if (window.localStorage.getItem("loggedUser")) {
      const loggedUser = window.localStorage.getItem("loggedUser");
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  const handleLike = async (blog, token) => {
    const likedBlog = blog;
    likedBlog.likes += 1;
    const response = await updateBlog(likedBlog, token, blog.id);
    const blogs = await getAll();
    setBlogs(blogs);
    if (response.status === 201) {
      showNotification(`Liked "${blog.title}" by ${blog.author}`, "success");
    } else {
      showNotification(`Like failed`, "fail");
    }
  };

  const showNotification = (msg, type) => {
    setErrorMessage(msg);
    setNotification(type);
    setTimeout(() => {
      setErrorMessage(null);
    }, 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(loginFormData);

    if (response.status === 200) {
      showNotification("Login Successfull", "success");
      const cridentials = response.data;
      setUser(cridentials);
      window.localStorage.setItem("loggedUser", JSON.stringify(cridentials));
      setLoginFormData({
        username: "",
        password: "",
      });
    } else {
      showNotification(response.data.error, "fail");
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedUser");
    showNotification("Logout Successful", "success");
  };

  const handleSubmit = async (blogForm, setBlogForm) => {
    const response = await createBlog(blogForm, user.token);
    if (response.status === 201) {
      showNotification(
        `A new blog "${blogForm.title}" by "${blogForm.author}" added`,
        "success"
      );
      setBlogForm({
        title: "",
        author: "",
        url: "",
      });
      setShowBlogForm(false);
      const blogs = await getAll();
      setBlogs(blogs);
      return blogForm;
    } else {
      showNotification(response.data.error, "fail");
    }
  };

  return (
    <div>
      <div>
        <h1>Blogssss</h1>
        {errorMessage && (
          <Notification type={notification} message={errorMessage} />
        )}

        {user && (
          <>
            <h2>
              {user.name} logged in <button onClick={logout}>Logout</button>
            </h2>

            {!showBlogForm && (
              <button onClick={() => setShowBlogForm(true)}>New Blog</button>
            )}
            {showBlogForm && (
              <>
                <BlogForm handleSubmit={handleSubmit} />
                <button
                  onClick={() => {
                    setShowBlogForm(false);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
            <br />
            <h3>Blogs</h3>
            <div className="blog">
              {blogs
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                  <Blog
                    key={blog.id}
                    blog={blog}
                    setBlogs={setBlogs}
                    token={user.token}
                    showNotification={showNotification}
                    username={user.username}
                    handleLike={handleLike}
                  />
                ))}
            </div>
          </>
        )}
        <br />

        {!user && (
          <>
            <LoginForm
              handleLogin={handleLogin}
              loginFormData={loginFormData}
              setLoginFormData={setLoginFormData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
