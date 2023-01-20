import React, { useEffect, useState } from "react";
import UserRepo from "./UserRepo";
import axios from "axios";

function UserRepos({ username }) {
  const [repos, setRepos] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await axios({
        url: "http://localhost:5000/api/github/getJsUserRepos",
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
    console.log(repos);
    fetchRepos();
  }, []);

  return (
    <>
      <div className="font-mono px-10 pb-20 pt-10 container mx-auto">
        {finished ? (
          repos.map((item, index) => (
            <div className="mb-12" key={index}>
              <UserRepo item={item} />
            </div>
          ))
        ) : (
          <p className="text-center">Repos you have used will appear here.</p>
        )}
      </div>
    </>
  );
}

export default UserRepos;
