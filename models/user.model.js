import mongoose from 'mongoose';

const userSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            unique:true,
            required:true,
            match:[/.+\@.+\../,"Please enter a valid email"]
        },
        password:{
            type:String,
            required:true
        },
        resetPasswordExpire:Date

    }
);

export const UserModel=mongoose.model('User',userSchema);