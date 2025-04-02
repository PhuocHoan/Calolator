import React, { useState } from "react";
import { signInWithGoogle, registerUser } from "../services/auth";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Đăng nhập thất bại, vui lòng thử lại.");
      console.log(err);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(email, password);
      setMessage(response.message);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      setMessage(""); // Clear any previous messages
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <input
        type="email"
        placeholder="Địa chỉ Email *"
        className="mb-4 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mật khẩu *"
        className="mb-4 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-green-500 py-2 text-white transition hover:bg-green-600"
      >
        Tiếp tục
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

      <button className="mb-2 flex w-full items-center justify-center rounded-lg border py-2 transition hover:bg-gray-100">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
          alt="Microsoft logo"
          className="mr-2 h-5 w-5"
        />
        Tiếp tục với Tài khoản Microsoft
      </button>

      <button className="flex w-full items-center justify-center rounded-lg border py-2 transition hover:bg-gray-100">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
          alt="Apple logo"
          className="mr-2 h-5 w-5"
        />
        Tiếp tục với Apple
      </button>

      <p className="mt-4 text-center text-sm text-gray-500">
        <a href="/terms" className="text-blue-500">
          Điều khoản sử dụng
        </a>{" "}
        |{" "}
        <a href="/privacy" className="text-blue-500">
          Chính sách riêng tư
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
