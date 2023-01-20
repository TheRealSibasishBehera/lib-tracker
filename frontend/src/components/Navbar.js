import React, { useState, useEffect } from "react";

const Navbar = ({ onLogin, onLogout ,userData }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Simulate fetching the username
    // setTimeout(() => {
      setUsername(userData.login); // Replace with actual username retrieval logic
      
      // console.log("userbdata",userData);
      // }, 1500);
  }, []);

  return (
    <nav className="bg-black">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          {localStorage.getItem("accessToken") && (
            <img
              className="ml-2 h-8 w-8 rounded-full"
              src={userData.avatar_url}
              alt="Profile"
            />
          )}
          {localStorage.getItem("accessToken") ? (
            <span className="text-white text-lg font-semibold font-mono">
              {username && <TypedAnimation text={username} />}
            </span>
          ) : (
            <span className="text-white text-lg font-semibold font-mono">
              LibTracker
            </span>
          )}
        </div>
        <div>
          {localStorage.getItem("accessToken") ? (
            <button
              className="bg-white text-black px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={onLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-white text-black px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={onLogin}
            >
              GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const TypedAnimation = ({ text }) => {
  const [typedText, setTypedText] = useState("");
  useEffect(() => {
    let timeout;
    const delay = 100; // Delay between each typed character

    const type = (index) => {
      if (index <= text.length) {
        setTypedText(text.substring(0, index));
        timeout = setTimeout(() => type(index + 1), delay);
      }
    };

    type(1);

    return () => {
      clearTimeout(timeout);
    };
  }, [text]);
  return <span>{typedText}</span>;
};
export default Navbar;
