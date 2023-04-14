const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const querystring = require("node:querystring"); 

const config = require("config");




//this is for regular mail
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}



//these are for github logins
const clientID = config.get("clientID");
const clientSecret = config.get("clientSecret");
console.log(clientID);
console.log(clientSecret);
router.get("/getAccessToken", async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).send("Authorization code is missing");
    }

    const response = await axios.get(
      "https://github.com/login/oauth/access_token",
      {
        params: {
          client_id: clientID,
          client_secret: clientSecret,
          code: code,
        },
      }
    );

    const { access_token } = querystring.parse(response.data);

    if (!access_token) {
      return res.status(500).send("Access token not found in the response");
    }

    console.log(access_token);
    return res.send({ access_token });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error occurred while retrieving access token");
  }
});


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
    {}
    return res.send(data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Error occurred while fetching user repositories");
  }
});

module.exports = router;
