import { BrowserRouter as Router, Route } from "react-router-dom";
import PackageDependencies from "./components/PackageDependencies";
import HomeLoggedOut from "./pages/HomeLoggedOut";
import HomeLoggedIn from "./pages/HomeLoggedIn";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const clientID = "1a81e934136e2a925cf5";
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  // const [userData, setUserData] = useState({});
  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + clientID
    );
  }

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.reload(); // Refresh the page to update the navbar
  };

  // http://localhost:3000/auth/github/callback?code=3ba88312a2561da38cbd
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam);

    // using local storage to store access token
    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await axios({
          url: "http://localhost:5000/api/auth/getAccessToken",
          method: "get",
          params: {
            code: codeParam,
          },
        })
          .then((response) => {
            return response.data;
          })
          .then((data) => {
            // console.log(data);
            if (data.access_token) {
              // console.log("hemlo3");
              localStorage.setItem("accessToken", data.access_token);
              setRerender(!rerender);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      getAccessToken();
    }
    const getUserData = async () => {
      await axios({
        url: "http://localhost:5000/api/auth/getUserData",
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
          setUserData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUserData();
    console.log("ayo man ");
    console.log(userData);
  }, []);
  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + clientID
    );
  }

  return (
    <>
      <Navbar
        // accessToken={accessToken}
        onLogin={loginWithGithub}
        onLogout={logout}
        userData={userData}
      />
      <Router>
        <Route exact path="/">
          {localStorage.getItem("accessToken") ? (
            <HomeLoggedIn userData={userData} />
          ) : (
            <HomeLoggedOut />
          )}
        </Route>
        <Route
          exact
          path="/package-dependencies/:slug"
          component={PackageDependencies}
        ></Route>
      </Router>
    </>
  );
}

export default App;
