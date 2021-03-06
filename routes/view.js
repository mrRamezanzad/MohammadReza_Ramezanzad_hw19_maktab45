const express = require('express'),
      router  = express.Router(),
      {
        isAuthorized,
        checkLogin
      }    = require('../services/authorization'),
      User = require('../services/user')

// ============================Render Home Page============================
router.get('/', function(req, res, next) {
  res.render('index', {msg: req.flash('message'), err: req.flash('error')});
});

// ============================Render Register Page============================
router.get('/register/', checkLogin, (req, res) => {
  res.render('register', {msg: req.flash('message'), err: req.flash('error')})
})

// ============================Render Login Page============================
router.get('/login/', checkLogin, (req, res) => {
  res.render('login', {msg: req.flash('message'), err: req.flash('error')})
})

// ============================Render Dashboard Page============================
router.get('/dashboard/', isAuthorized, async (req, res) => {
  let user 
  try{ user = await User.read(req.session.user._id) }
  catch (err) { req.flash("error", err) }
  
  res.locals.user = user
  res.render('dashboard--profile', {msg: req.flash('message'), err: req.flash('error')})
})

// ============================Render Dashboard Edit Page============================
router.get('/dashboard/edit/', isAuthorized, async (req, res) => {
  let user
  try { user = await User.read(req.session.user._id) }
  catch (err) { return req.flash("error", err) }

  res.locals.user = user
  res.render('dashboard--edit', {msg: req.flash('message'), err: req.flash('error')})
})

module.exports = router;
