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
const UserPosts = require('../models/UserPosts');

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

    const userDetails = req.user;
    console.log(userDetails._id);

    const league = await League.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(leagueId),
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

    if (league?.leagueStatus !== LeagueStatus.RegistrationOpen) {
      return next(new ErrorResponse('League not yet started', 404, 'Not found'));
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

exports.updateAnswersForLeague = async (req, res, next) => {
  try {
    const { leagueId, questionsAnswered } = req.body;

    const participationId = req.params.participationId;

    if (!participationId) {
      return next(new ErrorResponse('Participation ID is mandatory', 404, 'Not found'));
    }

    let questionOptions = Joi.object().keys({
      questionId: Joi.string().required(),
      option: Joi.string().required(),
    });

    const schema = Joi.object({
      leagueId: Joi.string().required(),
      questionsAnswered: Joi.array().items(questionOptions).min(1),
    });
    //TODO : Add more validations when to retireve league quuestions

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

    const leagueDetails = await League.findById(leagueId);

    if (!leagueDetails) {
      return next(new ErrorResponse('League Not found', 404, 'Not found'));
    }

    if ([LeagueStatus.RegistrationClosed, LeagueStatus.Expired].includes(leagueDetails?.leagueStatus)) {
      return next(new ErrorResponse('League is no more accepting answers', 400, 'Bad Request'));
    }

    const participationDetails = await UserParticipation.findById(participationId);

    console.log(participationDetails);

    if (!participationDetails) {
      return next(new ErrorResponse('Participation ID is mandatory', 404, 'Not found'));
    }

    if (`${participationDetails?.leagueId}` !== `${leagueDetails?._id}`) {
      return next(new ErrorResponse('Invalid LeagueId', 400, 'Bad Request'));
    }

    await UserParticipation.findByIdAndUpdate(
      participationId,
      {
        userParticipationStatus: UserParticipationStatus.QuestionsAnswered,
        questionsAnswered,
        updated: new Date().toISOString(),
      },
      { useFindAndModify: false },
    );

    res.status(200).json({
      success: true,
      data: 'Answers Updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

exports.getQuestionDetailsByParticipationId = async (req, res, next) => {
  try {
    const { participationId } = req.params;

    const schema = Joi.object({
      participationId: Joi.string().required(),
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

    const participationDetails = await UserParticipation.findById(participationId);

    if (!participationDetails) {
      return next(new ErrorResponse('Participation details not found', 404, 'Not found'));
    }

    if (!participationDetails?.questionsAnswered?.length) {
      return next(new ErrorResponse('Questions not answered', 400));
    }

    const questionDetails = await UserParticipation.aggregate([
      {
        $match: {
          $expr: {
            $eq: ['$_id', mongoose.Types.ObjectId(participationId)],
          },
        },
      },
      {
        $unwind: {
          path: '$questionsAnswered',
        },
      },
      {
        $lookup: {
          from: 'leaguequestions',
          let: {
            itemId: {
              $toObjectId: '$questionsAnswered.questionId',
            },
            items: '$questionsAnswered',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$itemId'],
                },
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: ['$$items', '$$ROOT'],
                },
              },
            },
            {
              $project: {
                selectedOptions: '$option',
                questionId: 1,
                isAnswerUpdated: 1,
                updated: 1,
                name: 1,
                questionType: 1,
                options: 1,
              },
            },
          ],
          as: 'questionDetails',
        },
      },
      {
        $group: {
          _id: '$_id',
          userParticipationStatus: {
            $first: '$userParticipationStatus',
          },
          leagueId: {
            $first: '$leagueId',
          },
          userId: {
            $first: '$userId',
          },
          questionDetails: {
            $push: {
              $first: '$questionDetails',
            },
          },
        },
      },
      {
        $project: {
          'questionDetails.wrongAnswerValue': 0,
          'questionDetails.isDeleted': 0,
          'questionDetails.correctAnswerValue': 0,
          'questionDetails.created': 0,
          'questionDetails.__v': 0,
          'questionDetails.correctAnswer': 0,
          'questionDetails.leagueId': 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: questionDetails,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAnswersByParticipation = async (req, res, next) => {
  try {
    const { participationId } = req.params;

    const schema = Joi.object({
      participationId: Joi.string().required(),
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

    const participationDetails = await UserParticipation.findById(participationId);

    if (!participationDetails) {
      return next(new ErrorResponse('Participation details not found', 404, 'Not found'));
    }

    if (!participationDetails?.questionsAnswered?.length) {
      return next(new ErrorResponse('Questions not answered', 400));
    }

    const questionDetails = await UserParticipation.aggregate([
      {
        $match: {
          $expr: {
            $eq: ['$_id', mongoose.Types.ObjectId(participationId)],
          },
        },
      },
      {
        $unwind: {
          path: '$questionsAnswered',
        },
      },
      {
        $lookup: {
          from: 'leaguequestions',
          let: {
            itemId: {
              $toObjectId: '$questionsAnswered.questionId',
            },
            items: '$questionsAnswered',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$itemId'],
                },
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: ['$$items', '$$ROOT'],
                },
              },
            },
            {
              $project: {
                selectedOption: '$option',
                questionId: 1,
                isAnswerUpdated: 1,
                updated: 1,
                name: 1,
                questionType: 1,
                options: 1,
                correctAnswer: 1,
                correctAnswerValue: 1,
                wrongAnswerValue: 1,
              },
            },
          ],
          as: 'questionDetails',
        },
      },
      {
        $group: {
          _id: '$_id',
          userParticipationStatus: {
            $first: '$userParticipationStatus',
          },
          leagueId: {
            $first: '$leagueId',
          },
          userId: {
            $first: '$userId',
          },
          questionDetails: {
            $push: {
              $first: '$questionDetails',
            },
          },
        },
      },
      {
        $project: {
          'questionDetails.isDeleted': 0,
          'questionDetails.created': 0,
          'questionDetails.__v': 0,
          'questionDetails.leagueId': 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: questionDetails,
    });
  } catch (err) {
    next(err);
  }
};

exports.getLeaderBoardByLeagueId = async (req, res, next) => {
  try {
    const leagueId = req.params.leagueId;

    const league = await League.findById(leagueId);

    if (!league) {
      return next(new ErrorResponse('League Not found', 404, 'Not found'));
    }

    if (![LeagueStatus.RegistrationClosed, LeagueStatus.Expired].includes(league?.leagueStatus)) {
      return next(new ErrorResponse('League is still accepting Answers', 400));
    }

    const leaderBoard = await UserParticipation.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: ['$leagueId', mongoose.Types.ObjectId(leagueId)],
              },
              {
                $ne: ['$userParticipationStatus', 'REGISTERED'],
              },
            ],
          },
        },
      },
      {
        $unwind: {
          path: '$questionsAnswered',
        },
      },
      {
        $lookup: {
          from: 'leaguequestions',
          let: {
            itemId: {
              $toObjectId: '$questionsAnswered.questionId',
            },
            items: '$questionsAnswered',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$itemId'],
                },
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: ['$$items', '$$ROOT'],
                },
              },
            },
          ],
          as: 'questionDetails',
        },
      },
      {
        $group: {
          _id: '$_id',
          userParticipationStatus: {
            $first: '$userParticipationStatus',
          },
          leagueId: {
            $first: '$leagueId',
          },
          userId: {
            $first: '$userId',
          },
          questionDetails: {
            $push: {
              $first: '$questionDetails',
            },
          },
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
        },
      },
      {
        $project: {
          'questionDetails.isDeleted': 0,
          'questionDetails.created': 0,
          'questionDetails.__v': 0,
          'questionDetails.leagueId': 0,
          'userDetails._id': 0,
          'userDetails.userType': 0,
          'userDetails.userStatus': 0,
          'userDetails.updated': 0,
          'userDetails.password': 0,
          'userDetails.resetPasswordExpire': 0,
          'userDetails.resetPasswordToken': 0,
          'userDetails.__v': 0,
        },
      },
    ]);

    const calculatedLeaderBoard = leaderBoard.map(ele => {
      const currentAns = ele.questionDetails.filter(e => e.option === e.correctAnswer);
      const result = currentAns.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.correctAnswerValue - currentValue.wrongAnswerValue),
        0,
      );
      return {
        ...ele,
        result,
      };
    });

    const sortedLeagerBoard = calculatedLeaderBoard.sort((a, b) => b.result - a.result);
    res.status(200).json({
      success: true,
      data: sortedLeagerBoard,
    });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const leagueId = req.params.leagueId;

    const { userId, post } = req.body;

    const schema = Joi.object({
      userId: Joi.string().required(),
      post: Joi.string().required(),
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

    if (!existinParticipation) {
      return next(new ErrorResponse('Not Registered for league', 400, 'Bad Request'));
    }

    const userPostDetails = await UserPosts.create({
      leagueId,
      userId,
      post,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    });
    console.log(userPostDetails);

    res.status(201).json({
      success: true,
      data: userPostDetails,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const leagueId = req.params.leagueId;

    const schema = Joi.object({
      leagueId: Joi.string().required(),
    });

    const userDetails = req.user;

    // schema options
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    const { error } = schema.validate(req.params, options);

    if (error?.details) {
      return next(new ErrorResponse(error?.details[0]?.message || 'Bad Request', 400, 'ValidationError'));
    }

    const user = await User.findOne({ _id: userDetails?._id });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (user?.userStatus !== 'CREATED') {
      return next(new ErrorResponse('User not active', 400));
    }

    const existinParticipation = await UserParticipation.findOne({ userId: userDetails?._id, leagueId });

    if (!existinParticipation) {
      return next(new ErrorResponse('Not Registered for league', 400, 'Bad Request'));
    }

    const userPostDetails = await UserPosts.aggregate([
      {
        $match: {
          leagueId: mongoose.Types.ObjectId(leagueId),
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
        },
      },
      {
        $project: {
          'userDetails.userType': 0,
          'userDetails.userStatus': 0,
          'userDetails.password': 0,
          'userDetails.created': 0,
          'userDetails.updated': 0,
          'userDetails.__v': 0,
          'userDetails.resetPasswordToken': 0,
          'userDetails.resetPasswordExpire': 0,
          userId: 0,
          __v: 0,
        },
      },
    ]);
    console.log(userPostDetails);

    res.status(200).json({
      success: true,
      data: userPostDetails,
    });
  } catch (err) {
    next(err);
  }
};
