// const mongoose = require('mongoose');
// const User = mongoose.model('User');
// const promisify = require('es6-promisify');
// const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.registerUser = (req, res) => {
    // const password = req.body.password;
    // bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    //     if (err) {
    //         res.render('error', { title: "Error" });     
    //     }
    //     const user = new User({ username: req.body.username, passwordHash: hash });
    // });
    res.redirect('account');
};

exports.accountHome = (req, res) => {
    res.render('account', { title: "Account Home" });
}

exports.verifyUser = (req, res) => {
    res.render('verify', { title: 'Two Factor Authentication' });
};

exports.twofactor = (req, res) => {
    res.redirect('account');
};