import React, { useState } from "react";
import styles from "./Homepage.module.css";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url('/your-background.jpg')` }}
    >
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div>
            <h1 className={styles.logo}>
              ZU<span>N</span>
              <span>O</span>
            </h1>
            <p className={styles.tagline}>Chat, but make it unhinged.</p>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tab} ${
                activeTab === "login" ? styles.activeTab : styles.inactiveTab
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "signup" ? styles.activeTab : styles.inactiveTab
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          <form>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
