import React from "react";
import RegisterForm from "../components/RegisterForm";

const Register = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold">Calolator</h1>
        <h2 className="mb-4 text-center text-2xl font-semibold">
          Đăng ký tài khoản
        </h2>
        <RegisterForm />
        <p className="mt-4 text-center">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-blue-500">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
