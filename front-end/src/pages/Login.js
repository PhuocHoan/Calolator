import React from "react";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
        <LoginForm />
        <p className="mt-4 text-center">
          Chưa có tài khoản? <a href="/register" className="text-blue-500">Đăng ký</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
