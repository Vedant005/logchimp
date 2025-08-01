import nodemailer from "nodemailer";
import("dotenv");

// utils
import logchimpConfig from "../../utils/logchimpConfig";
const config = logchimpConfig();
import logger from "../../utils/logger";

function getMailConfig() {
  const mailConfig = {
    host: process.env.LOGCHIMP_MAIL_HOST || config.mail?.host,
    port: Number.parseInt(
      process.env.LOGCHIMP_MAIL_PORT || config.mail?.port || "465",
      10,
    ),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.LOGCHIMP_MAIL_USER || config.mail?.user,
      pass: process.env.LOGCHIMP_MAIL_PASSWORD || config.mail?.password,
    },
  };

  const isConfigured = Object.values(mailConfig).some(
    (value) => value !== undefined,
  );

  if (!isConfigured) {
    logger.warn("Email adapter missing");
    return null;
  }

  return nodemailer.createTransport(mailConfig);
}

export const mail = getMailConfig();
