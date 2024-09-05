export const LoginForm = ({ handleLogin, loginFormData, setLoginFormData }) => {
  return (
    <>
      <h1>Log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <br />
          <input
            id="username"
            type="text"
            value={loginFormData.username}
            name="Username"
            onChange={({ target }) =>
              setLoginFormData((prev) => ({
                ...prev,
                username: target.value,
              }))
            }
          />
        </div>
        <div>
          Password
          <br />
          <input
            id="password"
            type="password"
            value={loginFormData.password}
            name="Password"
            onChange={({ target }) =>
              setLoginFormData((prev) => ({
                ...prev,
                password: target.value,
              }))
            }
          />
        </div>
        <br />
        <button id="login-button" type="submit">
          Login
        </button>
      </form>
    </>
  );
};
