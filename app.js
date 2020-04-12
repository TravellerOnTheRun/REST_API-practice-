const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

//Multer setup
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4()+ file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// app.use(bodyParser.urlencoded());

app.use(bodyParser.json()); // application/json
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter}).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

//CORS setup
app.use(( req, res, next ) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use( '/feed', feedRoutes );
app.use( '/auth', authRoutes );

//Error middleware
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
})

//Server + db connection
mongoose.connect(
    'mongodb+srv://alexsplatter:aleksivchenko1344@clusternodejscourse-tufbq.mongodb.net/messages?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(res => {
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
        console.log('Client connected');
    });
})
    
.catch(err => console.log(err));
