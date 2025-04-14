import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, registerUser } from "../services/auth";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import TermsOfServiceModal from "./TermsOfServiceModal";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const navigate = useNavigate();
  const handleGoogleSignUp = async (e) => {
      e.preventDefault();
      try {
        const response = await signInWithGoogle();
        if (response) {
          navigate("/"); // Redirect to home page after successful login
        }
      } catch (err) {
        setError(err.message);
        setMessage(""); // Clear any previous messages
        console.error("Google sign-in error:", err);
      }
    };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(email, password);
      setMessage(response.message);
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
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

      <p className="mt-4 text-center text-sm text-gray-500">
        <button
          type="button"
          onClick={() => setShowTerms(true)}
          className="text-blue-500 underline"
        >
          Điều khoản sử dụng
        </button>{" "}
        |{" "}
        <button
          type="button"
          onClick={() => setShowPrivacy(true)}
          className="text-blue-500 underline"
        >
          Chính sách riêng tư
        </button>
      </p>
      {showTerms && <TermsOfServiceModal onClose={() => setShowTerms(false)} />}
      {showPrivacy && (
        <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />
      )}
    </form>
  );
};

export default RegisterForm;
