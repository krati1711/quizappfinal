const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const Admin = require('../models/admin');
const User = require('../models/user');

const RSA_PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../' , 'keys') + '/public.key','utf8');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({message: 'No Header Found'});
        return;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try{
        decodedToken = jwt.verify(token, RSA_PUBLIC_KEY, {algorithms: ['RS256']});
        if (!decodedToken) {
            res.status(401).json({message: 'No good token found'});
            return;
        }
        Admin.find({username: decodedToken.uname})
        .then(result => {
          if (result){  // We found user as admin
            next();
            return;
          }
          else{
            return User.find({username: decodedToken.uname})
          }
        })
        .then(result=> {
          if (result){    // We found user as Normal User
            next();
            return;
          }
        })
        .catch(err => {
          res.status(401).json({message: 'Not Authorized'});
        });
    }
    catch (err) {
        res.status(500).json({message: 'Not Authenticated'});
        return;
    }
}