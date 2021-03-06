const { ApiError } = require("../middlewares/apiError");
const { User } = require("../models/user");
const { authService } = require("../services/");
const {
  registerSchema,
  loginSchema,
} = require("../validations/regitserLoginValidations");
const httpStatus = require("http-status");

const authController = {
  async register(req, res, next) {
    try {
      //validating using joi

      let value = await registerSchema.validateAsync(req.body);

      if (value) {
        //chechking if email is taken
        if (await User.emailTaken(value.email)) {
          throw new ApiError(httpStatus.BAD_REQUEST, "User already exists!");
        }

        let user = await authService.createUser(
          value.email,
          value.password,
          value.firstName,
          value.lastName,
          value.phone
        );

        res.status(httpStatus.CREATED).send({
          user,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async signin(req, res, next) {
    try {
      //validating user login data using joi
      let value = await loginSchema.validateAsync(req.body);

      if (value) {
        const user = await authService.signInEmailAndPassword(
          value.email,
          value.password
        );

        //setting access token
        let token = await authService.genAuthToken(user);

        res
          .cookie("x-access-token", token, { httpOnly: true })
          .status(httpStatus.OK)
          .send({
            user,
          });
      }
    } catch (error) {
      next(error);
    }
  },
  async isauth(req, res, next) {
    let auth = req.authenticated;

    if (auth) {
      res.status(httpStatus.OK).send("Authenticated successfully!");
    }
  },
};
module.exports = authController;
