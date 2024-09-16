import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const mongodbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      "Mongodb connected !! host: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("MongoDB connection failed...!!", error);
  }
};

export { mongodbConnect };
