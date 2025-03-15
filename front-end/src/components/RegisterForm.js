import React, { useState } from "react";
import { signInWithGoogle } from "../config/auth";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setError("Đăng nhập thất bại, vui lòng thử lại.");
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await registerUser(email, password);
    setMessage(response.message);
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Địa chỉ Email *"
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mật khẩu *"
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
        Tiếp tục
      </button>

      <p className="text-center my-4 text-gray-500">HOẶC</p>

      <button
        onClick={handleGoogleSignUp}
        className="w-full flex items-center justify-center border py-2 rounded-lg mb-2 hover:bg-gray-100 transition"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="w-5 h-5 mr-2" />
        Tiếp tục với Google
      </button>

      <button className="w-full flex items-center justify-center border py-2 rounded-lg mb-2 hover:bg-gray-100 transition">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft logo" className="w-5 h-5 mr-2" />
        Tiếp tục với Tài khoản Microsoft
      </button>

      <button className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 transition">
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple logo" className="w-5 h-5 mr-2" />
        Tiếp tục với Apple
      </button>

      <p className="text-center text-sm mt-4 text-gray-500">
        <a href="/terms" className="text-blue-500">Điều khoản sử dụng</a> | <a href="/privacy" className="text-blue-500">Chính sách riêng tư</a>
      </p>
    </div>
  );
};

export default RegisterForm;
