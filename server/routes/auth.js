const router = require("express").Router();
const User = require("../models/User");
const bycrypt = require("bcrypt");


//REGISTER
router.post("/register", async (req, resp)=>{
    

    try{
        //generate new password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(req.body.password, salt);
        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        //save user and respond
        const user = await newUser.save();
        resp.status(200).json(user);
    } catch(err){
        resp.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async(req, resp)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        !user && resp.status(404).json("user not found");

        const validPassword = await bycrypt.compare(req.body.password, user.password);
        !validPassword && resp.status(400).json("wrong password");

        resp.status(200).json(user);
    } catch (err){
        resp.status(500).json(err);
    }
});

module.exports = router