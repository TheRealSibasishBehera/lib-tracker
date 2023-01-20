import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import PackageInfo from "../components/PackageInfo";

function HomeLoggedOut() {
  const [repos, setRepos] = useState([]);
  const [finished, setFinished] = useState(false);
  const githubLink = useRef();
  const branch = useRef();

  let arr = [];

  async function handleSubmit() {
    setRepos([]);
    setFinished(false);
    let username, repo;
    username = githubLink.current.value.split("/")[3];
    repo = githubLink.current.value.split("/")[4];

    const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch.current.value}/package.json`;
    console.log(url);
    const resp = await fetch(url);
    if (resp.status !== 200) {
      alert("Please insert github repo link in right format");
      return;
    }
    localStorage.setItem("githubLink", githubLink.current.value);
    localStorage.setItem("branch", branch.current.value);

    const body = await resp.json();
    //const dependencies_array = Object.keys(body.dependencies)
    //setDependencies(dependencies_array);
    Object.keys(body.dependencies).map(async (item) => {
      if (item.includes("@")) {
        let p = item.split("/")[0].slice(1);
        const url = "https://api.npms.io/v2/package/" + p;
        const resp = await fetch(url);
        const body = await resp.json();
        if (!arr.includes(body.collected.metadata.name)) {
          arr.push(body.collected.metadata.name);
          setRepos((current) => [...current, body]);
        }
      } else if (!item.includes("@")) {
        const url = "https://api.npms.io/v2/package/" + item;
        const resp = await fetch(url);
        const body = await resp.json();
        if (!arr.includes(body.collected.metadata.name)) {
          arr.push(body.collected.metadata.name);
          setRepos((current) => [...current, body]);
        }
      }
    });

    console.log(repos);

    setFinished(true);
  }

  const finishLine = async () => {
    console.log("hemlo");
    await handleSubmit();
    const res = await Promise.all(repos);
    console.log(res);
  };

  useEffect(() => {
    if (
      localStorage.getItem("githubLink") !== null &&
      localStorage.getItem("branch") !== null
    ) {
      githubLink.current.value = localStorage.getItem("githubLink");
      branch.current.value = localStorage.getItem("branch");
      finishLine();
      return;
    }
  }, []);

  return (
    <>
      <div className="p-20 flex flex-col justify-center items-center bg-gray-900 text-white">
        <h1 className="text-5xl text-center font-mono font-extrabold">
          Lib Tracker 🎣
        </h1>
        <br />
        <p className="text-lg text-center font-mono font-extralight">
          Are you aware of what npm packages you have installed? What do they
          do? When were they last updated? What are their issues and
          dependencies?
          <br />
          <br />
          LibTracker is an all-seeing eye for your npm packages. It aims to help
          you identify potentially harmful and/or outdated packages.
        </p>

        <div className="container mx-auto mt-8">
          <div className="flex flex-col items-center">
            <label htmlFor="githubLink" className="font-mono text-lg mb-2">
              Enter the GitHub repository URL
            </label>
            <input
              type="text"
              ref={githubLink}
              className="font-mono outline-none border border-gray-300 shadow-md p-2 rounded-lg w-[300px] lg:w-[450px] text-gray-800 placeholder-gray-400 focus:border-purple-500 mb-4"
              name="githubLink"
              id="githubLink"
              placeholder="https://github.com/azyzz228/hsl-color-picker"
            />
            <label htmlFor="branch" className="font-mono text-lg mb-2">
              Enter the branch name
            </label>
            <input
              type="text"
              ref={branch}
              className="outline-none border border-gray-300 shadow-md p-2 rounded-lg w-[300px] lg:w-[450px] text-gray-800 placeholder-gray-400 focus:border-purple-500 mb-8"
              name="branch"
              id="branch"
              placeholder="master"
            />
            <button
              className="font-mono py-3 px-6 text-lg text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="font-mono px-10 pb-20 pt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-12 container mx-auto">
        {finished ? (
          repos.map((item, index) => <PackageInfo item={item} key={index} />)
        ) : (
          <p className="text-center">
            Packages you have used will appear here.
          </p>
        )}
      </div>
    </>
  );
}

export default HomeLoggedOut;
