import express from "express";
import passport from 'passport';

export const loginRouter = express.Router();


loginRouter.post('/register', passport.authenticate('register', { failureRedirect: '/error-reg' }), (req, res) => {
  if (!req.user) {
    return res.json({ error: 'something went wrong' });
  }
  req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, admin: req.user.admin};
  return res.redirect('/profile');
});

loginRouter.get('/error-reg',(req,res) => {
  return res.status(400).render('error-page', { msg: 'controla tu email y intenta mas tarde'});
});


loginRouter.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
  if (!req.user) {
    return res.json({ error: 'invalid credentials' });
  }
  req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, admin: req.user.admin };

  return res.redirect('/profile');
});

loginRouter.get('/faillogin', async (req, res) => {
  return res.status(400).render('error-page', { msg: 'email o pass incorrectos' });
});
