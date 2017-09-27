const mongoose = require('mongoose');
const User = mongoose.model('User');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.viewAccount = async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to view that page!');
        res.redirect('/login');
        return;
    }

    res.render('account');
};

exports.createAccount = async (req, res, next) => {
    const password = req.body.password;
    const username = req.body.username;
    let checkUser = await User.findOne({ username });
    if (checkUser) {
        req.flash('error', 'That username is already taken!');
        res.redirect('/register');
        return;
    }
    const passwordHash = await (bcrypt.hashSync(password, saltRounds));
    const user = await (new User({ username, passwordHash })).save();
    const secret = speakeasy.generateSecret({length: 20});
    req.session.user = user;
    req.session.secret = secret;
    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        res.render('setup', {
            qrcode: data_url,
            secret: secret.base32
        });
    });
};

exports.validate = async (req, res) => {
    const token = req.body.token;
    const secret = req.session.secret.base32;
    const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token
    });

    if (verified) {
        const user = User.findOneAndUpdate({ _id: req.session.user._id }, { secret }).exec();
        req.flash('success', 'Account successfully created');
        res.redirect('/account');
        return;
    } else {
        req.flash('error', 'Incorrect token, please try again!');
        QRCode.toDataURL(req.session.secret.otpauth_url, (err, data_url) => {
            res.render('setup', {
                qrcode: data_url,
                secret: req.session.secret.base32
            });
        });
    }
};

exports.findAccount = async (req, res) => {
    // Get user info
    const password = req.body.password;
    const username = req.body.username;

    // Attempt to find the user
    const user = await User.findOne({ username });

    if (!user) {
        req.flash('error', 'The username or password is incorrect!');
        res.redirect('/login');
        return;
    }

    // Compare hashes
    if (bcrypt.compareSync(password, user.passwordHash)) {
        res.render('twofactor', { id: user._id });
        return;
    } else {
        req.flash('error', 'The username or password is incorrect!');
        res.redirect('/login');
        return;
    }

};

exports.verify = async (req, res) => {
    const user = await User.findOne({ _id: req.body.userID });
    const token = req.body.token;
    const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token
    });

    if (verified) {
        req.session.user = user;
        req.flash('success', 'You have been successfully logged in!');
        res.redirect('/account');
        return;
    } else {
        req.flash('error', 'Incorrect token, please try again!');
        res.render('twofactor', { id: req.body.userID });
    }
};