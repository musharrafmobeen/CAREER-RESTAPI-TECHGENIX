const jobModel = require("../models/Jobs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.create_Job = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_KEY);

    if (decoded) {
      console.log("adrak");
      const job = new jobModel({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
      });

      const createdJob = await job.save();
      console.log(job);
      return res.status(201).json({
        message: "Job Created",
        createdJob: {
          _id: createdJob._id,
          name: createdJob.name,
          description: createdJob.description,
          request: {
            type: "POST",
            URL: "http://localhost:5000/jobs/",
          },
        },
      });
    }
    return res.status(401).json({
      status: 401,
      message: "Auth Failed",
      error: "User Is not authorized to create jobs",
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to create a new Job.",
    });
  }
};

exports.get_All_Jobs = async (req, res, next) => {
  try {
    const jobs = await jobModel.find().exec();
    return res.status(200).json({
      message: "All Jobs Returned",
      jobs,
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobs/",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to get all Jobs.",
    });
  }
};

exports.get_Specific_Job = async (req, res, next) => {
  try {
    const job = await jobModel.findOne({ _id: req.params.jobID }).exec();

    if (job) {
      return res.status(200).json({
        message: "Job Returned",
        job,
        request: {
          type: "GET",
          URL: "http://localhost:5000/jobs/" + req.params.jobID,
        },
      });
    }
    return res.status(404).json({
      message: "No Job Found",
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobs/" + req.params.jobID,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to get a Job.",
    });
  }
};

exports.delete_Job = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_KEY);
    if (decoded) {
      const deletedJob = await jobModel
        .findOneAndDelete({
          _id: req.params.jobID,
        })
        .exec();
      if (deletedJob) {
        return res.status(200).json({
          message: "Job Has Been Deleted",
          deletedJob,
          request: {
            type: "Delete",
            URL: "http://localhost:5000/jobs/" + req.params.jobID,
          },
        });
      }
      return res.status(404).json({
        message: "No Job Found For Deletion",
        request: {
          type: "Delete",
          URL: "http://localhost:5000/jobs/" + req.params.jobID,
        },
      });
    }
    return res.status(401).json({
      status: 401,
      message: "Auth Failed",
      error: "User Is not authorized to delete jobs",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to delete a Job.",
    });
  }
};

exports.update_Job = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_KEY);
    if (decoded) {
      const updatedJob = await jobModel
        .findOneAndUpdate(
          {
            _id: req.params.jobID,
          },
          { $set: { ...req.body } }
        )
        .exec();
      if (updatedJob) {
        return res.status(200).json({
          message: "Job Has Been Updated",
          updatedJob,
          request: {
            type: "patch",
            URL: "http://localhost:5000/jobs/" + req.params.jobID,
          },
        });
      }
      return res.status(404).json({
        message: "No Job Found For Updation",
        request: {
          type: "patch",
          URL: "http://localhost:5000/jobs/" + req.params.jobID,
        },
      });
    }
    return res.status(401).json({
      status: 401,
      message: "Auth Failed",
      error: "User Is not authorized to update jobs",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to delete a Job.",
    });
  }
};
