import React, { useState } from "react";
import { loginUser } from "../services/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      if (response.success) {
        setMessage(response.message);
        setError(""); // Clear any previous errors
      } else {
        setError(response.message);
        setMessage(""); // Clear any previous messages
      }
    } catch (err) {
      setError(err.message);
      setMessage(""); // Clear any previous messages
    }
  };
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
        className="w-full rounded bg-blue-500 p-2 text-white"
      >
        Đăng Nhập
      </button>
    </form>
  );
};

export default LoginForm;
