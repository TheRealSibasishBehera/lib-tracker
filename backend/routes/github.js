const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const querystring = require("node:querystring");

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

//these are for github logins

router.get("/getUserData", async (req, res) => {
  try {
    const authorizationHeader = req.get("Authorization");
    if (!authorizationHeader) {
      return res.status(401).send("Authorization header missing");
    }

    const { data } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: authorizationHeader,
      },
    });

    console.log(data);
    return res.send(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error occurred while fetching user data");
  }
});

router.get("/getUserRepos", async (req, res) => {
  const accessToken = req.get("Authorization");

  try {
    const { data } = await axios({
      url: "https://api.github.com/user/repos",
      headers: {
        Authorization: accessToken,
      },
      method: "get",
    });

    console.log(data);
    {
    }
    return res.send(data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Error occurred while fetching user repositories");
  }
});

router.get("/getJsUserRepos", async (req, res) => {
  const accessToken = req.get("Authorization");

  try {
    const { data } = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: accessToken,
      },
    });

    const jsRepos = data.filter((repo) => {
      // Check if the repository includes JavaScript (JS) among its languages
      return repo.language === "Go";
    });

    console.log(jsRepos);
    return res.send(jsRepos);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Error occurred while fetching user repositories");
  }
});
module.exports = router;
