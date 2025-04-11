import React, { use, useState } from "react";
import { loginUser, signInWithGoogle} from "../services/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      if (response.success) {
        setMessage(response.message);
        setError(""); // Clear any previous errors
        navigate("/"); // Redirect to home page after successful login
      } else {
        setError(response.message);
        setMessage(""); // Clear any previous messages
      }
    } catch (err) {
      setError(err.message);
      setMessage(""); // Clear any previous messages
    }
  };

  const handleGoogleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await signInWithGoogle();
      if (response.success) {
        setMessage(response.message);
        setError(""); // Clear any previous errors
        navigate("/"); // Redirect to home page after successful login
      } else {
        setError(response.message);
        setMessage(""); // Clear any previous messages
      }
    } catch (err) {
      setError(err.message);
      setMessage(""); // Clear any previous messages
    }
  }
  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        className="w-full rounded border p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600"
      >
        Đăng Nhập
      </button>

      <p className="my-4 text-center text-gray-500">HOẶC</p>

      <button
        onClick={handleGoogleSignUp}
        className="mb-2 flex w-full items-center justify-center rounded-lg border py-2 transition hover:bg-gray-100"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google logo"
          className="mr-2 h-5 w-5"
        />
        Tiếp tục với Google
      </button>
    </form>
  );
};

export default LoginForm;
