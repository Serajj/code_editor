const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const checkRole = require("../middlewares/checkRole");
const sendResponse = require("../utils/response");
const validateQuestion = require("../validators/questionValidator");
const Answer = require("../models/answer");
const validateAnswer = require("../validators/answerValidator");
const validateTestCase = require("../validators/testCaseValidator");
const config = require("../config");
var request = require("request");

// GET all questions (auth access)
router.get("/all", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * limit;
    const totalquestions = await Question.countDocuments();
    const questions = await Question.find().skip(offset).limit(limit);
    res
      .status(200)
      .json(
        sendResponse(
          true,
          "Questions fetched successfully",
          { questions, totalquestions },
          200
        )
      );
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET all questions  admin (auth access)
router.get("/allquest", async (req, res) => {
  try {
    const questions = await Question.find();
    res
      .status(200)
      .json(
        sendResponse(true, "Questions fetched successfully", questions, 200)
      );
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET a questions with all answers (auth access)
router.get("/with-answer/:id", async (req, res) => {
  try {
    let questionId = req.params.id;
    const question = await Question.findById(questionId);
    const participant = req.user.userId;
    // Fetch all answers for the specific question and populate participant details
    const answers = await Answer.find({ question: questionId,participant }).populate(
      "participant",
      ["name"]
    );

    res
      .status(200)
      .json(
        sendResponse(
          true,
          "Question with answers fetched successfully",
          { question, answers },
          200
        )
      );
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

const submitTosphere = async (submissionData) => {
  // define access parameters
  var accessToken = config.sphereSecret;
  var endpoint = config.sphereEndpoint;

  try {
    console.log(
      "https://" + endpoint + "/api/v4/submissions?access_token=" + accessToken
    );
    console.log(submissionData);
    var id;
    var submission_error = false;
    var msg = "";
    // send request

    return new Promise((resolve, reject) => {
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
          var id;
          var submission_error = false;
          var msg = "";
          if (error) {
            console.log("Connection problem");
            submission_error = true;
            msg = "connection problem";
          }
          //588906314
          // process response
          if (response) {
            if (response.statusCode === 201) {
              const resObj = JSON.parse(response.body);
              id = resObj.id; // submission data in JSON
              data = { error: false, id, msg };
              resolve(data);
            } else {
              if (response.statusCode === 401) {
                console.log("Invalid access token");
                submission_error = true;
                msg = "Invalid access token";
                data = { error: true, id, msg };
                resolve(data);
              } else if (response.statusCode === 402) {
                console.log("Unable to create submission");
                submission_error = true;
                msg = "Unable to create submission";
                data = { error: true, id, msg };
                resolve(data);
              } else if (response.statusCode === 400) {
                var body = JSON.parse(response.body);
                console.log(
                  "Error code: " +
                    body.error_code +
                    ", details available in the message: " +
                    body.message
                );
                submission_error = true;
                msg =
                  "Error code: " +
                  body.error_code +
                  ", details available in the message: " +
                  body.message;
                data = { error: true, id, msg };
                resolve(data);
              }
            }
          }
        }
      );
    });
  } catch (error) {
    return { error: true, id, msg };
  }
};

// Submit answer of a questions (auth access)
router.post("/submit", async (req, res) => {
  const { questionId, source, cinput } = req.body;
  const validationResult = validateAnswer(questionId, source);
  if (!validationResult.isValid) {
    return res.json(
      sendResponse(false, "Validation error", [validationResult.errors])
    );
  }
  try {
    const participant = req.user.userId;

    // Check if the question exists

    const question = await Question.findById(questionId);
    if (!question) {
      return res.json(sendResponse(false, "Invalid question ID.", []));
    }

    await Answer.deleteMany({ question: questionId, participant });

    // define request parameters
    var submissionData = {
      compilerId: 116,
      source: source,
      input: cinput,
    };
    const { error, id, msg } = await submitTosphere(submissionData);
    console.log("recieved id : " + id);
    if (error) {
      return res
        .status(500)
        .json({
          status: false,
          message: "Something went wrong in submission",
          errors: msg,
        });
    }

    const isCorrect = true; //await validateAnswerWithSphereAPI(questionId, submittedAnswer);
    //delete old submission
    await Answer.deleteMany({ question: questionId, participant });
    // Create a new answer entry
    const newAnswer = new Answer({
      question: questionId,
      participant,
      submissionId: id,
      source,
      cinput,
      isCorrect,
    });

    await newAnswer.save();
    return res
      .status(201)
      .json(sendResponse(true, "Answer submitted successfully!!", newAnswer));
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json(
        sendResponse(false, "Something went wrong. Please check question ID", [
          err,
        ])
      );
  }
});

// GET a single question by ID (auth access)
router.get("/single/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Fetched successfully!", data: question });
  } catch (err) {
    res
      .status(500)
      .json({
        staus: false,
        message: "Invalid question ID : " + req.params.id,
        data: err,
      });
  }
});

// CREATE a new question (admin access only)
router.post("/", checkRole("admin"), async (req, res) => {
  const { question, description, source } = req.body;
  const validationResult = validateQuestion(question, description, source);
  if (!validationResult.isValid) {
    return res.json(
      sendResponse(false, "Validation error", [validationResult.errors])
    );
  }
  try {
    const judgeId = 1;
    const createdBy = req.user.userId;
    const newQuestion = new Question({
      question,
      source,
      judgeId,
      description,
      createdBy,
    });

    await newQuestion.save();

    res
      .status(201)
      .json(sendResponse(true, "Question created successfully!!", []));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", err });
  }
});

// UPDATE a question (admin access only)
router.put("/:id", checkRole("admin"), async (req, res) => {
  try {
    const { question, description } = req.body;

    const iquestion = await Question.findById(req.params.id);
    if (!iquestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    iquestion.question = question;
    iquestion.description = description;

    await iquestion.save();

    res.json({ message: "Question updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// DELETE a question (admin access only)
router.delete("/:id", checkRole("admin"), async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/:questionId/testcases", async (req, res) => {
  try {
    const { questionId } = req.params;
    const { input, expectedOutput } = req.body;
    const validationResult = validateTestCase(
      input,
      expectedOutput,
      questionId
    );
    if (!validationResult.isValid) {
      return res.json(
        sendResponse(false, "Validation error", [validationResult.errors])
      );
    }
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const testId = 1;
    question.testCases.push({ testId, input, expectedOutput });
    await question.save();

    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ errors: "Failed to add test case", error });
  }
});

router.post("/delete_testcase", async (req, res) => {
  try {
    const { questionId, testCaseId } = req.body;

    // Find the question by its ID
    const question = await Question.findById(questionId);

    // Check if the question exists
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Find the index of the test case in the question's testCases array
    const testCaseIndex = question.testCases.findIndex(
      (testCase) => testCase._id.toString() === testCaseId
    );

    // Check if the test case exists in the question
    if (testCaseIndex === -1) {
      return res.status(404).json({ error: "Test case not found" });
    }

    // Remove the test case from the question's testCases array
    question.testCases.splice(testCaseIndex, 1);

    // Save the updated question in the database
    await question.save();

    // Return the updated question
    res.json(question);
  } catch (error) {
    console.error("Error deleting test case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
