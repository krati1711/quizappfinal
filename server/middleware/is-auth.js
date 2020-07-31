const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const Admin = require('../models/admin');
const User = require('../models/user');

const RSA_PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../', 'keys') + '/public.key', 'utf8');

// module.exports = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         res.status(401).json({message: 'No Header Found'});
//         return;
//     }
//     const token = authHeader.split(' ')[1];
//     let decodedToken;

//     try{
//         decodedToken = jwt.verify(token, RSA_PUBLIC_KEY, {algorithms: ['RS256']});
//         if (!decodedToken) {
//             res.status(401).json({message: 'No good token found'});
//             return;
//         }
//         Admin.find({username: decodedToken.uname})
//         .then(result => {
//           if (result){  // We found user as admin
//             next();
//             return;
//           }
//           else{
//             return User.find({username: decodedToken.uname})
//           }
//         })
//         .then(result=> {
//           if (result){    // We found user as Normal User
//             next();
//             return;
//           }
//         })
//         .catch(err => {
//           res.status(401).json({message: 'Not Authorized'});
//         });
//     }
//     catch (err) {
//         res.status(500).json({message: 'Not Authenticated'});
//         return;
//     }
// };

/**
 * Checks for headers before passing to other functions
 * @param {header - authorization} req
 * @param {json with some message if problems occurs} res
 * @param {} url
 */
module.exports = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  try {
    // ------------------check if any header present------------------
    if (!authHeader) {
      res.status(401).json({ message: 'No Header Found' });
      throw new Error('No Header Found');
    }

    //------------------separating token from bearer-----------------
    const token = authHeader.split(' ')[1];

    //------------------if no token found ----------------------
    if (!token) {
      res.status(401).json({ message: 'No Token Found' });
      throw new Error('No Token Found');
    }

    // ----------------decoding token------------------------------------------------
    const decodedToken = jwt.verify(token, RSA_PUBLIC_KEY);

    //-----------------------if problem in decoded token ---------------------------
    if (!decodedToken) {
      res.status(401).json({ message: 'No good token found' });
      throw new Error('No good token found');
    }

    // ------------------------check if the request if from admin-------------------
    const adminRetObj = await Admin.find({ username: decodedToken.uname });

    // -------------------if coming request found from admin, move on-------------------
    if (adminRetObj) {
      next();
      return;
    }

    // ------------------------check if the request if from student-------------------
    const userObj = await User.find({ username: decodedToken.uname });

    //-----------------We found user as Normal User-----------------------------
    if (userObj) {
      next();
      return;
    }
    //---------------user found in neither------------------------------
    else {
      res.status(500).json({ message: 'Not Authenticated' });
      throw new Error('Not Authenticated');
    }
  } catch (err) {

    if (err.name == 'JsonWebTokenError'){
      res.status(401).json({ message: 'Invalid Token' });
      return;
    }
    else if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).json({ message: 'Not Authenticated' });
  }
};

