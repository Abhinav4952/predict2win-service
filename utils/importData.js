require("dotenv").config({ path: "./config.env" });
const fs = require("fs");
const Post = require("../models/Post");
const connectDB = require("../config/db");

connectDB();

const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, "utf-8"));

const importData = async () => {
  try {
    await Post.create(posts);
    console.log("Data Successfully imported 👌");
    process.exit();
  } catch (error) {
    console.log(`ERROR 💥: ${error}`);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Post.deleteMany({});
    console.log("Data successfully deleted");
    process.exit();
  } catch (error) {
    console.log(`ERROR 💥: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}


//Create a admin by directly connecting to DB - DONE
//Create a 2 league admin by using create league admin - DONE
//Create two normal users and story the jwt token - DONE
//for every league admin create 3 leagues - DONE
//for every league create 5 questions and with 4 options and start the league once questions are created
//register user for atleast 2 leagues
//for every registered league once done submit answers for it
//all the above create league register for atleast one league
//done
