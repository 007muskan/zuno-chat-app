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
      className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-[#1e0035]"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Section for Mobile, Left on Desktop */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 md:px-10 py-8 md:py-16 md:mt-[-250px]">
        <img
          src="/zuno-logo.png"
          alt="ZUNO"
          className="w-[180px] mb-[-50px] sm:w-[250px] md:w-[500px] md:mb-[-180px]"
        />
        <p className="text-white italic text-xl sm:text-2xl md:text-3xl text-center leading-tight">
          Chat, but make it unhinged.
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full  mb-[120px] md:w-1/2 flex items-center justify-center px-4 sm:px-6 md:mr-28  md:mb-0">
        <div className="bg-white rounded-xl p-6 w-[80%] max-w-sm sm:max-w-md md:max-w-[500px] shadow-md">
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
