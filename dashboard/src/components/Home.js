import React, { useEffect, useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [ready, setReady] = useState(false); // ✅ FIX HERE

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("accessToken", tokenFromUrl);
      window.history.replaceState({}, "", window.location.pathname);
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      window.location.href = "http://localhost:3003/signup";
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return <div>Loading...</div>;

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;