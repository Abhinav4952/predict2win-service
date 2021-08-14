const crypto = require('crypto');
const User = require('../../models/User');
const Joi = require('joi');
const sendEmail = require('../../utils/sendEmail');

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
};

async function login(loginRequest) {
  return new Promise((resolve, reject) => {
    (async () => {
      const { email, password } = loginRequest;

      try {
        const schema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
        });

        // schema options
        const options = {
          abortEarly: false, // include all errors
          allowUnknown: true, // ignore unknown props
          stripUnknown: true, // remove unknown props
        };

        const { error } = schema.validate(loginRequest, options);

        if (error?.details) {
          return next(new ErrorResponse(error?.details[0]?.message || 'Bad Request', 400, 'ValidationError'));
        }

        // Check that user exists by email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
          reject(new ErrorResponse('Invalid credentials', 401));
        }

        // Check that password match
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
          reject(new ErrorResponse('Invalid credentials', 401));
        }

        const token = sendToken(user);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    })();
  });
}

async function register(registerRequest) {
  return new Promise((resolve, reject) => {
    (async () => {
      const { username, email, password } = registerRequest;

      try {
        const schema = Joi.object({
          username: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
        });

        // schema options
        const options = {
          abortEarly: false, // include all errors
          allowUnknown: true, // ignore unknown props
          stripUnknown: true, // remove unknown props
        };

        const { error } = schema.validate(registerRequest, options);

        if (error?.details) {
          reject(new ErrorResponse(error?.details[0]?.message || 'Bad Request', 400, 'ValidationError'));
        }

        const user = await User.create({
          username,
          email,
          password,
        });

        const token = sendToken(user, 200, res);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    })();
  });
}

async function forgotPassword(forgotPasswordRequest) {
  return new Promise((resolve, reject) => {
    (async () => {
      const { email } = forgotPasswordRequest;

      try {
        const schema = Joi.object({
          email: Joi.string().email().required(),
        });

        // schema options
        const options = {
          abortEarly: false, // include all errors
          allowUnknown: true, // ignore unknown props
          stripUnknown: true, // remove unknown props
        };

        const { error } = schema.validate(forgotPasswordRequest, options);

        if (error?.details) {
          reject(new ErrorResponse(error?.details[0]?.message || 'Bad Request', 400, 'ValidationError'));
        }

        const user = await User.findOne({ email });

        if (!user) {
          reject(new ErrorResponse('No email could not be sent', 404));
        }

        // Reset Token Gen and add to database hashed (private) version of token
        const resetToken = user.getResetPasswordToken();

        await user.save();

        // Create reset url to email to provided email
        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        // HTML Message
        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please make a put request to the following link:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
          `;

        try {
          await sendEmail({
            to: email,
            subject: 'Password Reset',
            text: message,
          });

          resolve({ success: true, data: 'Email Sent' });
        } catch (err) {
          console.log(err);

          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;

          await user.save();

          reject(new ErrorResponse('Email could not be sent', 500));
        }
        resolve();
      } catch (err) {
        console.log('Error in sending Email', JSON.stringify(err));
        reject(err);
      }
    })();
  });
}

async function resetPassword(resetPasswordRequest) {
  return new Promise((resolve, reject) => {
    (async () => {
      // Compare token in URL params to hashed token
      const { resetToken, password } = resetPasswordRequest;
      const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      try {
        const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
          return next(new ErrorResponse('Invalid Token', 400));
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        resolve({
          success: true,
          data: 'Password Updated Success',
          token: user.getSignedJwtToken(),
        });
      } catch (err) {
        reject(err);
      }
    })();
  });
}

const sendToken = user => {
  const token = user.getSignedJwtToken();
  return token;
};
