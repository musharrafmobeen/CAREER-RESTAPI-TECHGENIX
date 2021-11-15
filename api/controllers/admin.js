const adminModel = require("../models/admin");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.Admin_Log_In = async (req, res, next) => {
  try {
    let adminDoc = await adminModel
      .findOne({ email: req.body.email })
      .select("name email _id password")
      .exec();

    if (adminDoc) {
      bcrypt.compare(req.body.password, adminDoc.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            error: {
              status: "Auth Failed",
              statusCode: 401,
              errorMessage: err,
            },
            message: "Wrong Credentials.",
          });
        }
        if (result) {
          adminDoc = {
            email: adminDoc.email,
            name: adminDoc.name,
            adminId: adminDoc._id,
            userType: "admin",
          };

          const token = jwt.sign(
            {
              email: adminDoc.email,
              _id: adminDoc._id,
            },
            process.env.JWT_ADMIN_KEY,
            {
              expiresIn: "2h",
            }
          );

          return res.status(200).json({
            admin: adminDoc,
            token,
            request: {
              type: "POST",
              description: "Logging in",
              URL: "http://localhost:5000/login",
            },
          });
        }
        return res.status(401).json({
          error: {
            status: "Auth Failed",
            statusCode: 401,
          },
          message: "No User Found with given Email and Password.",
        });
      });
    } else {
      return res.status(404).json({
        status: "Admin Not Found",
        statusCode: 404,
        message: "No admin found with the given credentials.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to Log In.",
    });
  }
};
