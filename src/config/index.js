require("dotenv").config() // Load env to process.env


const env = process.env


module.exports = {
  APP_NAME: env.APP_NAME,
  PORT: env.PORT,
  BCRYPT_SALT: 10,


  "url": {
    BASE_URL: env.BASE_URL,
    CLIENT_URL: env.CLIENT_URL
  },

  "nodemailer": {
    HOST: env.MAILER_HOST,
    USER: env.MAILER_USER,
    PASSWORD: env.MAILER_PASSWORD,
    PORT: env.MAILER_PORT,
    SECURE: env.MAILER_PASSWORD,
    DOMAIN: env.MAILER_DOMAIN
  },

  "mongodb": {
    URI: env.MONGODB_URI,
  },

  "mySql" : {
    MYSQL_HOST: env.MYSQL_HOST,
    MYSQL_PORT: env.MYSQL_PORT,
    MYSQL_DB_PASSWORD: env.MYSQL_DB_PASSWORD,
    MYSQL_DB_USERNAME: env.MYSQL_DB_USERNAME,
    MYSQL_DB_NAME: env.MYSQL_DB_NAME
  },

  "jwt": {
    AUTH_SECRET: env.JWT_AUTH_SECRET,
  }
}