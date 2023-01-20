import React from "react";
import { useEffect,useState } from "react";
function BrandPara() {
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

  return (
    <div className="p-20 flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-5xl text-center font-mono font-extrabold">
        {<TypedAnimation text="Lib Tracker 🎣" />}
      </h1>
      <br />
      <p className="text-lg text-center font-mono font-extralight">
        Are you aware of what npm packages you have installed? What do they do?
        When were they last updated? What are their issues and dependencies?
        <br />
        <br />
        LibTracker is an all-seeing eye for your npm packages. It aims to help
        you identify potentially harmful and/or outdated packages.
      </p>
    </div>
  );
}

export default BrandPara;
