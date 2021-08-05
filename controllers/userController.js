const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const League = require('../models/League');
const User = require('../models/User');
const UserParticipation = require('../models/UserParticipation');
const ErrorResponse = require('../utils/errorResponse');
const UserRole = require('../helpers/enums/UserRole');
const LeagueStatus = require('../helpers/enums/LeagueStatus');
const UserParticipationStatus = require('../helpers/enums/UserParticipationStatus');
const LeagueCategory = require('../helpers/enums/LeagueCategory');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');
const LeagueQuestionType = require('../helpers/enums/LeagueQuestionType');
var moment = require('moment');
const LeagueQuestion = require('../models/LeagueQuestion');

exports.getLeaguesforUser = async (req, res, next) => {
  try {
    const userDetails = req.user;
    console.log(userDetails._id);
    const leagues = await League.aggregate([
      {
        $sort: {
          expiryDate: 1,
          slots: -1,
        },
      },
      {
        $lookup: {
          from: 'userparticipations',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$leagueId', '$$id'],
                    },
                    {
                      $eq: ['$userId', mongoose.Types.ObjectId(userDetails._id)],
                    },
                  ],
                },
              },
            },
          ],
          as: 'participationStatus',
        },
      },
      {
        $unwind: {
          path: '$participationStatus',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          __v: 0,
          userId: 0,
          updated: 0,
          'participationStatus.updated': 0,
          'participationStatus.leagueId': 0,
          'participationStatus.userId': 0,
          'participationStatus.__v': 0,
          'participationStatus.questionsAnswered': 0,
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

    const league = await League.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(leagueId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          __v: 0,
          userId: 0,
          'userDetails.__v': 0,
          'userDetails.password': 0,
          'userDetails.userType': 0,
          'userDetails.userStatus': 0,
          'userDetails.updated': 0,
        },
      },
    ]);
    if (!league.length) {
      return next(new ErrorResponse('League Not found', 404, 'Not found'));
    }

    res.status(200).json({
      success: true,
      data: league[0],
    });
  } catch (err) {
    next(err);
  }
};

exports.registerForLeague = async (req, res, next) => {
  try {
    const leagueId = req.params.leagueId;

    const { userId } = req.body;

    const schema = Joi.object({
      userId: Joi.string().required(),
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

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (user?.userStatus !== 'CREATED') {
      return next(new ErrorResponse('User not active', 400));
    }

    const existinParticipation = await UserParticipation.findOne({ userId, leagueId });

    if (existinParticipation) {
      return next(new ErrorResponse('Already registered for the league', 400, 'Bad Request'));
    }

    const league = await League.findById(leagueId);

    if (!league) {
      return next(new ErrorResponse('League Not found', 404, 'Not found'));
    }

    if (!moment(new Date().toISOString()).isBefore(league?.expiryDate)) {
      return next(new ErrorResponse('League Expired', 400, 'ValidationError'));
    }

    if ([LeagueStatus.RegistrationClosed, LeagueStatus.Created, LeagueStatus.Expired].includes(league?.leagueStatus)) {
      return next(new ErrorResponse('Registrations are not open', 400, 'Bad Request'));
    }

    if (+league?.slots <= 0) {
      return next(new ErrorResponse('Slots unavailable', 400, 'Bad Request'));
    }

    const userParticipationDetails = await UserParticipation.create({
      leagueId,
      userId,
      userParticipationStatus: UserParticipationStatus.Registered,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    });
    console.log(userParticipationDetails);
    try {
      await League.findByIdAndUpdate(
        leagueId,
        {
          slots: Number(league?.slots - 1),
          updated: new Date().toISOString(),
        },
        { useFindAndModify: false },
      );
      console.log('league updated', leagueId);
    } catch (err) {
      await UserParticipation.findByIdAndDelete(userParticipationDetails?._id);
      console.log(err);
    }

    res.status(201).json({
      success: true,
      data: userParticipationDetails,
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

    //TODO : Add more validations when to retireve league quuestions

    const leagueQuestions = await LeagueQuestion.find({ leagueId }, { __v: 0 });

    res.status(200).json({
      success: true,
      data: leagueQuestions,
    });
  } catch (err) {
    next(err);
  }
};
