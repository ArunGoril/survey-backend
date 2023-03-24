import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

mongoose.connect("mongodb://localhost:27017/surveyDB", options, (err) => {
    if (!err) {
        console.log("DB connected");
    } else {
        console.log("Error")
    }
});

const userSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    birthday: String,
    email: String,
    commEmail: String,
    interests: String,
    moderatePercentile: String,
    growthPercentile: String,
    aggressiveGrowthPercentile: String,
    ageGroup: String,
    websiteLink: String,
    emailType: String,
    facebookLink: String,
    twitterLink: String,
    linkedLink: String
});

const User = new mongoose.model("User", userSchema);

//Routes
app.get("/", (req, res) => {
    res.send("My Servey API");
});

app.post("/survey", (req, res) => {
    const userFields = req.body;
    const user = new User(userFields);
    user.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.send({message: "Successfully Registered"});
        }
    });
});

app.listen(9002, () => {
    console.log("Server is up and running at port 9002...");
});