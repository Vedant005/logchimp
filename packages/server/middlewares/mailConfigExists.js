// services
const { mail } = require("../services/mail");

module.exports = async (_, res, next) => {
  if (!mail) {
    return res.status(501).send({
      message: "Mail configuration missing",
      code: "MAIL_CONFIG_MISSING",
    });
  }

  next();
};
