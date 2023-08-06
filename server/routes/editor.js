const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const checkRole = require("../middlewares/checkRole");
const sendResponse = require("../utils/response");
const validateQuestion = require("../validators/questionValidator");
const Answer = require("../models/answer");
const validateAnswer = require("../validators/answerValidator");
var request = require("request");
const config = require("../config");

// GET all questions (auth access)
router.get("/test", async (req, res) => {
  try {
    // define access parameters
    var accessToken = config.sphereSecret;
    var endpoint = config.sphereEndpoint;
    // send request
    request(
      {
        url: "https://" + endpoint + "/api/v4/test?access_token=" + accessToken,
        method: "GET",
      },
      function (error, response, body) {
        if (error) {
          console.log("Connection problem");
        }

        // process response
        if (response) {
          if (response.statusCode === 200) {
            console.log(JSON.parse(response.body)); // test message in JSON
          } else {
            if (response.statusCode === 401) {
              console.log("Invalid access token");
            }
          }
        }
      }
    );

    res.status(200).json({ hello: "fo" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/compilers", async (req, res) => {
  try {
    // define access parameters
    var accessToken = config.sphereSecret;
    var endpoint = config.sphereEndpoint;

    // send request
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/compilers?access_token=" +
          accessToken,
        method: "GET",
      },
      function (error, response, body) {
        if (error) {
          console.log("Connection problem");
        }

        // process response
        if (response) {
          if (response.statusCode === 200) {
            //console.log(JSON.parse(response.body)); // list of compilers in JSON
            res.status(200).json(JSON.parse(response.body));
          } else {
            if (response.statusCode === 401) {
              console.log("Invalid access token");
            }
          }
        }
      }
    );
  } catch (error) {}
});

router.post("/submission", async (req, res) => {
  try {
    // define access parameters
    var accessToken = config.sphereSecret;
    var endpoint = config.sphereEndpoint;

    // define request parameters
    var submissionData = {
      compilerId: 116,
      source: 'print("Hello I am working")',
    };

    console.log(
      "https://" + endpoint + "/api/v4/submissions?access_token=" + accessToken
    );
    console.log(submissionData);
    // send request
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/submissions?access_token=" +
          accessToken,
        method: "POST",
        form: submissionData,
      },
      function (error, response, body) {
        if (error) {
          console.log("Connection problem");
        }
        //588906314
        // process response
        if (response) {
          if (response.statusCode === 201) {
            console.log(JSON.parse(response.body)); // submission data in JSON
          } else {
            if (response.statusCode === 401) {
              console.log("Invalid access token");
            } else if (response.statusCode === 402) {
              console.log("Unable to create submission");
            } else if (response.statusCode === 400) {
              var body = JSON.parse(response.body);
              console.log(
                "Error code: " +
                  body.error_code +
                  ", details available in the message: " +
                  body.message
              );
            }
          }
        }
      }
    );
  } catch (error) {}
});

router.post("/submissions/:id", async (req, res) => {
  try {
    let submissionId = req.params.id;
    let { answerId } = req.body;
    // define access parameters
    var accessToken = config.sphereSecret;
    var endpoint = config.sphereEndpoint;

    // define request parameters
    // var submissionId = 588906314;

    // send request
    request(
      {
        url:
          "https://" +
          endpoint +
          "/api/v4/submissions/" +
          submissionId +
          "?access_token=" +
          accessToken,
        method: "GET",
      },
      async function (error, response, body) {
        if (error) {
          console.log("Connection problem");
        }

        // process response
        if (response) {
          if (response.statusCode === 200) {
            console.log(JSON.parse(response.body)); // submission data in JSON
            if (answerId) {
              await Answer.updateOne(
                { _id: answerId },
                {
                  $set: {
                    submission: response.body,
                  },
                }
              );
            }

            res.status(200).json(JSON.parse(response.body));
          } else {
            if (response.statusCode === 401) {
              console.log("Invalid access token");
            }
            if (response.statusCode === 403) {
              console.log("Access denied");
            }
            if (response.statusCode === 404) {
              console.log("Submision not found");
            }
          }
        }
      }
    );
  } catch (error) {}
});

router.post("/streams", async (req, res) => {
  const { stream_uri } = req.body;
  if (stream_uri === null || stream_uri === "" || stream_uri === undefined) {
    return res
      .status(400)
      .json({ status: false, message: "Stream url not provided", data: {} });
  }

  request(
    {
      url: stream_uri,
      method: "GET",
    },
    function (error, response, body) {
      if (error) {
        console.log("Connection problem");
        return res
          .status(400)
          .json({ status: false, message: "Connection problem", data: {} });
      }

      // process response
      if (response) {
        if (response.statusCode === 200) {
          console.log(response.body);
          return res.status(200).json(response.body); // raw data from selected stream
        } else {
          if (response.statusCode === 401) {
            console.log("Invalid access token");
          } else if (response.statusCode === 403) {
            console.log("Access denied");
          } else if (response.statusCode === 404) {
            var body = JSON.parse(response.body);
            console.log(
              "Non existing resource, error code: " +
                body.error_code +
                ", details available in the message: " +
                body.message
            );
          } else if (response.statusCode === 400) {
            var body = JSON.parse(response.body);
            console.log(
              "Error code: " +
                body.error_code +
                ", details available in the message: " +
                body.message
            );
          }
        }
      }
    }
  );
});

module.exports = router;
