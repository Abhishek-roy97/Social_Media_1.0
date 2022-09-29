const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async(req, resp)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return resp.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            resp.status(200).json("Account has been updated")
        }catch(err){
            return resp.status(500).json(err);
        }
    }else {
        return resp.status(403).json("You can update only your account!");
    };
});
//delete user
router.delete("/:id", async(req, resp)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
       
        try{
            const user = await User.findByIdAndDelete( req.params.id);
            resp.status(200).json("Account has been deleted")
        }catch(err){
            return resp.status(500).json(err);
        }
    }else {
        return resp.status(403).json("You can delete only your account!");
    };
});
//get a user
router.get("/:id", async (req, resp)=>{
    try{
        const user = await User.findById(req.params.id);
        const{password, updatedAt, ...other}= user._doc;
        resp.status(200).json(other);
    } catch(err){
        resp.status(500).json(err);
    }
})
//follow user
router.put("/:id/follow", async (req, resp)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push: { followers: req.body.userId }});
                await currentUser.updateOne({ $push: { followings: req.params.id }});
                resp.status(200).json("user has been followed");
            }else{
                resp.status(403).json("you already follow this user");
            }
        } catch(err){
            resp.status(500).json(err);
        }
    }else{
        resp.status(403).json("you can't follow yourself");
    }
});
//unfollow user
router.put("/:id/unfollow", async (req, resp)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: { followers: req.body.userId }});
                await currentUser.updateOne({ $pull: { followings: req.params.id }});
                resp.status(200).json("user has been unfollowed");
            }else{
                resp.status(403).json("you don't follow this user");
            }
        } catch(err){
            resp.status(500).json(err);
        }
    }else{
        resp.status(403).json("you can't unfollow yourself");
    }
});

module.exports = router;