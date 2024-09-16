import dotenv from "dotenv";
import { app } from "./app.js";
import { mongodbConnect } from "./db/db.js";

dotenv.config({
  path: "./.env",
});


mongodbConnect()
  .then(() => {
    app.listen(process.env.PORT || 8001, () => {
      console.log(`App listening on PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
