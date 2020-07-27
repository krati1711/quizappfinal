const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');


const app = express();
require('dotenv').config();

const authRoutes = require('./server/routes/adminRoutes');
const quizRoutes = require('./server/routes/quizRoutes');
const questionRoutes = require('./server/routes/questionRoutes');
const userRoutes = require('./server/routes/userRoute');
// const responseRoutes = require('../QuizApp/server/routes/responseRoute');
const responseRoutes = require('./server/routes/responseRoute');

//to disable header used to find if server is express prevent express related attacks()
app.disable('x-powered-by');

app.use(bodyParser.json());

app.use(cors());
app.use(helmet());

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/question', questionRoutes);
app.use('/user', userRoutes);
app.use('/response', responseRoutes);

app.use(express.static(__dirname + '/dist/QuizApp'));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname +
        '/dist/QuizApp/index.html'));
});

mongoose
    .connect(
        'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PASSWD + '@cluster0-shard-00-00-vccpc.mongodb.net:27017,cluster0-shard-00-01-vccpc.mongodb.net:27017,cluster0-shard-00-02-vccpc.mongodb.net:27017/' + process.env.DB_NAME + '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        console.log("Backend Started");
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log("err->" + err));
