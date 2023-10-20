require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const connectDb = require("./db/connect");

const userRoutes = require("./routes/userRoutes");
const errorHandlerMiddleware = require("./middlewares/error-handler");

app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY));

app.use("/api/v1/auth", userRoutes);

app.use(errorHandlerMiddleware);

const port = process.env.PORT;
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening at port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
