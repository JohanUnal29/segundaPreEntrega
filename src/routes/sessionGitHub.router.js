import passport from 'passport';
import express from 'express';
export const sessionGitHubRouter = express.Router();

sessionGitHubRouter.get('/error-auth',(req,res) => {
    return res.status(400).render('error-page', { msg: 'error de autenticación'});
});

sessionGitHubRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionGitHubRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/error-auth' }), (req, res) => {
  req.session.user = req.user;
  // Successful authentication, redirect home.
  res.redirect('/profile');
});

sessionGitHubRouter.get('/show', (req, res) => {
  return res.send(JSON.stringify(req.session));
});