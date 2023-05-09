//Import dependencies
import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from 'passport';

//Import files
import __dirname from './utils.js';
import initializePassport from './config/passport.config.js';
import CartsRoute from "./routes/carts.route.js";
import ProductsRoute from "./routes/products.route.js";
import UsersRoute from "./routes/users.route.js";
import usersViewRouter from "./routes/userViews.route.js";

//Initializing app w/express
const APP = express();
const PORT = 8080;

//Handlebars
APP.engine('handlebars', handlebars.engine());
APP.set('views', __dirname + '/views')
APP.set('view engine', 'handlebars');

//MONGO_URL this way because I couldn't set it the way Alejandro set it up...
const MONGO_URL = "mongodb+srv://jazmingv:KJ8to7UL9ZcWUqf6@cluster0.fuizku2.mongodb.net/CODER-project?retryWrites=true&w=majority";

//Middlewares JSON
APP.use(express.json());
APP.use(express.urlencoded({ extends: true }));

//Public folder
APP.use(express.static(__dirname + '/public'));

//Mongo Session
APP.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60
    }),
    secret: "JazminGV",
    resave: false,
    saveUninitialized: true
}))

//Middlewares Passport
initializePassport();
APP.use(passport.initialize());
APP.use(passport.session());

//Routers
APP.use('/', usersViewRouter);
APP.use("/api/products", ProductsRoute);
APP.use("/api/carts", CartsRoute);
APP.use("/api/users", UsersRoute);

//Connect to MongoDB
const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Successfully connected to Mongo Database");
    } catch (error) {
        console.error("Couldn't connect to Mongo Database: " + error);
        process.exit();
    }
}

//Server on
APP.listen(PORT, () => {
    connectMongoDB();
    console.log("Server on");
});