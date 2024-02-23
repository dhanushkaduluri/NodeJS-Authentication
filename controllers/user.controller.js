import passport from "passport";
import { UserModel } from "../models/user.model.js";
import { hashPassword } from "../utils/hashPassword.util.js";
import { sendPasswordResetEmail } from "../utils/passwordReset.js";

export default class UserController{

    async signIn(req,res){
        passport.authenticate('local', async (err, user) => {
            try {
              if (err) {
                throw err;
              }

              if (!user) {
                // Authentication failed
                return res.render('login',{msg:'Invalid credentials!'});
              }

              // Log in the user and redirect to the dashboard
              req.login(user, (loginErr) => {
                if (loginErr) {
                  console.log(loginErr);
                }
                req.session.email=user.email;
                return res.render('display');
              });
            } catch (error) {
              console.log(error);
            }
       })(req, res);
    }

    async getSignIn(req,res){
        res.render('login',{msg:null});
    }

    async get(req,res){
        res.render('home');
    }

    async getRegister(req,res){
        res.render('register',{msg:null});
    }

    async postRegister(req, res) {
        try {
          console.log("post reset");
          if (req.body.password !== req.body['re-password']) {
            return res.render('register',{msg:'Password not matched!'}); // Assuming 'password-not-matched' is the name of your EJS view
          }

          const check=await UserModel.findOne({email:req.body.email});

          if(check){
            return res.render('register',{msg:'Email already exists!'});
          }

          const hashedPassword = await hashPassword(req.body.password);
          const user = new UserModel({
            email: req.body.email,
            password: hashedPassword,
          });

          await user.save();
          res.redirect('/login');
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error'); // Adjust the response as needed
        }
      }
    async logout(req,res){
        req.logout();
        res.redirect('/');
    }

    async resetPassword(req,res){
      
      res.render('resetForm',{msg:null});
    }

    async forgot(req,res){
      res.render('emailReset',{msg:null});
    }

    async postForgot(req,res){
      req.session.email=req.body.email;
      const user=await UserModel.findOne({email:req.body.email});
      if(!user){
        return res.render('emailReset',{msg:'Email does not exist in our records'});
      }
      user.resetPasswordExpire= Date.now() + 10 * 60 * 1000;
      console.log(user);
      await user.save();
      await sendPasswordResetEmail(req.body.email);
      res.render('emailReset',{msg:'Email sent to reset password'});
    }

    async forgotReset(req,res){
      const email=req.params.email;
      console.log("params email"+email);
      const user = await UserModel.findOne({
        email:email,
        resetPasswordExpire: { $gt: Date.now() }, // Check if the token is still valid
      });
      console.log("forgetReset: "+ user);
      if(!user){
        return res.render('emailReset',{msg:'Time expired'});
      }
      return res.render('resetForm',{msg:null});
    }

    async postReset(req,res){
      if (req.body.password !== req.body['re-password']) {
        return res.render('resetForm',{msg:'Password not matched!'}); // Assuming 'password-not-matched' is the name of your EJS view
      }
      console.log(req.body);
      console.log("email : "+req.session.email);
      const hashedPassword=await hashPassword(req.body.password);
      const user=await UserModel.findOne({email:req.session.email});
      user.password=hashedPassword;
      await user.save();
      res.redirect('/logout');
    }
  }