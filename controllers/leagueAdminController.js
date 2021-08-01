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
const mongoose = require('mongoose');
const LeagueQuestionType = require('../helpers/enums/LeagueQuestionType');
var moment = require('moment');
const LeagueQuestion = require('../models/LeagueQuestion');

exports.addLeague = async (req, res, next) => {
  try {
    const { name, userId, description, leagueCategory, expiryDate } = req.body;

    console.log(req.file.filename);
    const schema = Joi.object({
      name: Joi.string().required(),
      userId: Joi.string().required(),
      description: Joi.string(),
      leagueCategory: Joi.string()
        .required()
        .valid(...Object.values(LeagueCategory)),
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
      <h1>${name} has been successfully created.Please add league questions to open the registrations</h1>
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

exports.addQuestion = async (req, res, next) => {
  try {
    const { name, leagueId, questionType, options, correctAnswerValue, wrongAnswerValue } = req.body;

    let questionOptions = Joi.object().keys({
      optionValue: Joi.string().required(),
    });
    const schema = Joi.object({
      name: Joi.string().required(),
      leagueId: Joi.string().required(),
      options: Joi.array().items(questionOptions).min(4),
      questionType: Joi.string()
        .required()
        .valid(...Object.values(LeagueQuestionType)),
      correctAnswerValue: Joi.number().required(),
      wrongAnswerValue: Joi.number(),
    });

    // schema options
    const schemaOptions = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    const { error } = schema.validate(req.body, schemaOptions);

    if (error?.details) {
      return next(new ErrorResponse(error?.details[0]?.message || 'Bad Request', 400, 'ValidationError'));
    }

    const league = await League.findById(leagueId);

    if (!league) {
      return next(new ErrorResponse('League Not found', 404, 'Not found'));
    }

    if (league?.userId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('UnAuthorized to add Question for different users league', 401));
    }

    if (!moment(new Date().toISOString()).isBefore(league?.expiryDate)) {
      return next(new ErrorResponse('League Expired', 400, 'ValidationError'));
    }

    const leagueQuestion = await LeagueQuestion.create({
      name,
      leagueId,
      questionType,
      options,
      correctAnswerValue: correctAnswerValue,
      wrongAnswerValue: wrongAnswerValue ? wrongAnswerValue : 0,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: leagueQuestion,
    });
  } catch (err) {
    next(err);
  }
};

exports.getQuestionByLeague = async (req, res, next) => {
  try {
    const { leagueId } = req.params;

    const schema = Joi.object({
      leagueId: Joi.string().required(),
    });

    // schema options
    const schemaOptions = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    const { error } = schema.validate(req.params, schemaOptions);

    if (error?.details) {
      return next(new ErrorResponse(error?.details[0]?.message || 'Bad Request', 400, 'ValidationError'));
    }

    const league = await League.findById(leagueId);

    if (!league) {
      return next(new ErrorResponse('League Not found', 404, 'Not found'));
    }

    if (league?.userId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('UnAuthorized to view Questions for different users league', 401));
    }

    const leagueQuestions = await LeagueQuestion.find({ leagueId }, { __v: 0 });

    res.status(200).json({
      success: true,
      data: leagueQuestions,
    });
  } catch (err) {
    next(err);
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

exports.startLeague = async (req, res, next) => {
  try {
    const { leagueId, slots } = req.body;

    const schema = Joi.object({
      leagueId: Joi.string().required(),
      slots: Joi.number().required(),
    });

    // schema options
    const schemaOptions = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    const { error } = schema.validate(req.body, schemaOptions);

    if (error?.details) {
      return next(new ErrorResponse(error?.details[0]?.message || 'Bad Request', 400, 'ValidationError'));
    }

    const league = await League.findById(leagueId);
    console.log(league);
    if (!league) {
      return next(new ErrorResponse('League Not found', 404, 'Not found'));
    }

    if (league?.userId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('UnAuthorized to start league of different users league', 401));
    }

    if (league?.leagueStatus !== LeagueStatus.Created) {
      return next(new ErrorResponse('League Status should be created', 400, 'ValidationError'));
    }

    if (!moment(new Date().toISOString()).isBefore(league?.expiryDate)) {
      return next(new ErrorResponse('League Expired', 400, 'ValidationError'));
    }


    await League.findByIdAndUpdate(leagueId, {
      leagueStatus: LeagueStatus.RegistrationOpen,
      slots,
      updated: new Date().toISOString(),
    });
    res.status(201).json({
      success: true,
      data: 'Answers Updated Successfully',
    });
  } catch (err) {
    next(err);
  }
};

exports.stopLeague = async (req, res, next) => {
  try {
    const { leagueId } = req.body;

    const schema = Joi.object({
      leagueId: Joi.string().required(),
      slots: Joi.number().required(),
    });

    // schema options
    const schemaOptions = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    const { error } = schema.validate(req.body, schemaOptions);

    if (error?.details) {
      return next(new ErrorResponse(error?.details[0]?.message || 'Bad Request', 400, 'ValidationError'));
    }

    const league = await League.findById(leagueId);

    if (!league) {
      return next(new ErrorResponse('League Not found', 404, 'Not found'));
    }

    if (league?.userId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('UnAuthorized to stop league of different users league', 401));
    }

    if (!moment(new Date().toISOString()).isBefore(league?.expiryDate)) {
      return next(new ErrorResponse('League Expired', 400, 'ValidationError'));
    }

    const currentDate = new Date().toISOString();

    await League.findByIdAndUpdate(leagueId, {
      leagueStatus: LeagueStatus.Expired,
      expiryDate: currentDate,
      updated: currentDate,
    });
    res.status(201).json({
      success: true,
      data: 'Answers Updated Successfully',
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAnswers = async (req, res, next) => {
  try {
    const { leagueId, questionAnswers } = req.body;

    let questionOptions = Joi.object().keys({
      questionId: Joi.string().required(),
      optionValue: Joi.string().required(),
    });
    const schema = Joi.object({
      leagueId: Joi.string().required(),
      questionAnswers: Joi.array().items(questionOptions).min(1),
    });

    // schema options
    const schemaOptions = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    const { error } = schema.validate(req.body, schemaOptions);

    if (error?.details) {
      return next(new ErrorResponse(error?.details[0]?.message || 'Bad Request', 400, 'ValidationError'));
    }

    const league = await League.findById(leagueId);

    if (!league) {
      return next(new ErrorResponse('League Not found', 404, 'Not found'));
    }

    if (league?.userId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('UnAuthorized to add Answers for different users league', 401));
    }

    if (league?.leagueStatus !== LeagueStatus.RegistrationOpen) {
      return next(new ErrorResponse('League is not yet started', 400, 'ValidationError'));
    }

    if (!moment(new Date().toISOString()).isBefore(league?.expiryDate)) {
      return next(new ErrorResponse('League Expired', 400, 'ValidationError'));
    }

    await asyncForEach(questionAnswers, async element => {
      const res = await LeagueQuestion.findByIdAndUpdate(element.questionId, { correctAnswer: element.optionValue });
      console.log(res);
    });

    await League.findByIdAndUpdate(leagueId, {
      leagueStatus: LeagueStatus.RegistrationClosed,
      updated: new Date().toISOString(),
    });
    res.status(201).json({
      success: true,
      data: 'Answers Updated Successfully',
    });
  } catch (err) {
    next(err);
  }
};

exports.getCurretUserLeague = async (req, res, next) => {
  try {
    const userDetails = req.user;
    console.log(userDetails._id);
    // const leagues = await League.find({ userId: userDetails._id }, {__v:0});

    // const updatedLeague = await League.aggregate([
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'userId',
    //       foreignField: '_id',
    //       as: 'userDetails',
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: '$userDetails',
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $project: {
    //       __v: 0,
    //       'userDetails.__v': 0,
    //     },
    //   },
    // ]);
    const leagues = await League.aggregate([
      {
        $match: {
          userId: userDetails._id,
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
      {
        $sort: {
          expiryDate: -1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: leagues,
    });
  } catch (err) {
    next(err);
  }
};

exports.getLeagueById = async (req, res, next) => {
  try {
    const leagueId = req.params.leagueId;

    const league = await League.findById(leagueId);

    if (!league) {
      return next(new ErrorResponse('League Not found', 404, 'Not found'));
    }

    if (league?.userId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('UnAuthorized to view different users League', 401));
    }

    console.log(league);
    res.status(200).json({
      success: true,
      data: league,
    });
  } catch (err) {
    next(err);
  }
};
