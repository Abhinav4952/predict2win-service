const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const League = require('../models/League');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const UserRole = require('../helpers/enums/UserRole');
const LeagueStatus = require('../helpers/enums/LeagueStatus');
const LeagueCategory = require('../helpers/enums/LeagueCategory');
const sendEmail = require('../utils/sendEmail');

exports.addLeague = async (req, res, next) => {
  try {
    const { name, userId, description, leagueCategory, expiryDate } = req.body;

    console.log(req.file.filename);
    const schema = Joi.object({
      name: Joi.string().required(),
      userId: Joi.string().required(),
      description: Joi.string(),
      leagueCategory: Joi.string().required().valid(...Object.values(LeagueCategory)),
      expiryDate: Joi.string().required(),
      startDate: Joi.string(),
    });

    // schema options
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    const { error } = schema.validate(req.body, options);

    if (error?.details) {
      return next(new ErrorResponse(error?.details[0]?.message || 'Bad Request', 400, 'ValidationError'));
    }

    const user = await User.findOne({ _id: userId });
    if (user?.userType !== UserRole.LeagueAdmin) {
      return next(new ErrorResponse('League Can be added only by League Admin', 401));
    }

    const leagueDetails = await League.create({
      name,
      userId,
      description,
      leagueCategory,
      leagueStatus: LeagueStatus.Created,
      image: {
        data: fs.readFileSync(path.join(__dirname, '..', 'uploads', req.file.filename)),
        contentType: 'image/png',
      },
      created: new Date().toISOString(),
      expiryDate,
    });

    const message = `
      <h1>${name} has been successfully created.Please add league questions to open the registrationg</h1>
    `;
    try {
      await sendEmail({
        to: user?.email,
        subject: 'League Confirmation',
        text: message,
      });
    } catch (err) {
      console.log(err);
    }
    res.status(201).json({
      success: true,
      data: leagueDetails,
    });
  } catch (err) {
    next(err);
  }
};
