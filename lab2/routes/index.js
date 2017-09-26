const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

// --- Static Routes ---
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/verify-login', (req, res) => {
    res.redirect('/twofactor');
});

router.get('/twofactor', (req, res) => {
    res.render('twofactor', { title: 'Two-Factor' })
});

router.post('/verify-twofactor', (req, res) => {
    res.redirect('/account');
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' })
});

router.post('/create', (req, res) => {
    res.redirect('/setup');
});

router.get('/setup', (req, res) => {
    console.log('here');
    res.render('setup', { title: 'Setup Two-Factor' });
});

router.get('/account', (req, res) => {
    res.render('account', { title: 'Account Home' })
});

module.exports = router;