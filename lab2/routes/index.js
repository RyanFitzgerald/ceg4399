const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

// --- Home Route ---
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// --- Login-related Routes
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/verify', catchErrors(userController.findAccount));

router.post('/twofactor', catchErrors(userController.verify));

// --- Register-related Routes
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' })
});

router.post('/create', catchErrors(userController.createAccount));

router.post('/validate', catchErrors(userController.validate));

// --- Account-related Routes ---
router.get('/account', userController.viewAccount);

router.get('/logout', (req, res) => {
    req.session.user = false;
    req.flash('success', 'You are now logged out!');
    res.redirect('/');
    return;
});

module.exports = router;