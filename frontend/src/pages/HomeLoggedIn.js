import React, { useState, useEffect, useRef } from "react";
import PackageInfo from "../components/PackageInfo";
import BrandPara from "../components/BrandPara";
import UserRepos from "../components/UserRepos";
const axios = require("axios");

function HomeLoggedIn({ userData }) {
  const [repos, setRepos] = useState([]);
  // const [userData, setUserData] = useState({});
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [finished, setFinished] = useState(false);
  const [accessToken, setAccessToken] = useState(""); // Replace with your access token
  const githubLink = useRef();
  const branch = useRef();
  const [username, setUsername] = useState("");

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
    const fetchRepos = async () => {
      const response = await axios({
        url: "http://localhost:5000/api/github/getUserRepos",
        method: "get",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          console.log(data);
          setRepos(data);
          setFinished(true);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchRepos();
  }, [accessToken]);

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <>
      <p></p>
      <BrandPara />
      <h3 className="py-4 text-4xl text-center font-mono font-extrabold">
        User Repositories
      </h3>
      <br />
      <UserRepos />
      <div className="p-20 flex flex-col justify-center items-center bg-gray-900 text-white">
        {/* Your header content */}
      </div>

      {/* {selectedRepo && (
        <div className="container mx-auto">
          <PackageInfo item={selectedRepo} />
        </div>
      )} */}
    </>
  );
}

export default HomeLoggedIn;
