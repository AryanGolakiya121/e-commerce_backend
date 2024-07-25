require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const passport = require('passport');
const cookieSession = require('cookie-session');
const expressSession = require('express-session')
const cookieParser = require('cookie-parser');
const dbConfig = require('./src/config/db.config')
const passportSetup = require('./passport')
const { publicRoutes, privateRoutes, adminRoutes } = require('./src/routes/index.routes');
const HandleErrorMessage = require('./src/middleware/validatorMessage');
const { userAuth, adminAuth } = require('./src/middleware/auth');
const app = express();

// app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(cookieParser());


app.use(
    cookieSession({
        name: "session",
        keys:["ecommerce"],
        maxAge: 24 * 60 * 60 * 100,
    })
)

app.use(passport.initialize())
app.use(passport.session())


app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Alllow-Origin", "*")
    res.setHeader(
        "Acccess-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
})

// Add auth routes
app.all('/api/private/*', userAuth)
app.all('/api/admin/*', adminAuth)

// Use routers
app.use("/api/private", privateRoutes)
app.use("/api/public", publicRoutes)
app.use("/api/admin", adminRoutes)

app.use(HandleErrorMessage)
const port = process.env.PORT || 3100

app.get('/', (req, res) => {
    res.status(200).json({status:"Success", message:"Server Started Successfully"})
})
app.listen(port, () => {
    console.log(`Server started on port: ${port}...`);
})
