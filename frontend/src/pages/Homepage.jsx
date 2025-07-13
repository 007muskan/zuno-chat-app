import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div
      className="min-h-screen w-full flex"
      style={{
        backgroundImage: "url('/bground.png')", // replace with your image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#1e0035",
      }}
    >
      {/* Left: Logo & tagline */}
      <div className="w-1/2 flex flex-col items-center justify-center p-10 mt-[-250px]">
        <img
          src="/zuno-logo.png"
          alt="ZUNO"
          className="w-[590px] leading-none"
        />
        <p className="text-white italic text-3xl text-center mt-[-230px] leading-tight ml-22">
          Chat, but make it unhinged.
        </p>
      </div>

      {/* Right: Form Card */}
      <div className="w-1/2 flex items-center justify-center mr-28">
        <div className="bg-white rounded-xl p-8 w-full max-w-[500px] shadow-md h-auto">
          {/* Tab Switch */}
          <div className="flex justify-between mb-6">
            <button
              className={`w-1/2 py-2 font-semibold rounded-full ${
                activeTab === "login"
                  ? "bg-purple-200 text-purple-800"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2 font-semibold rounded-full ${
                activeTab === "signup"
                  ? "bg-purple-200 text-purple-800"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {activeTab === "login" ? <LoginForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
