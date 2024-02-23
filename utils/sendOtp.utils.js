import nodemailer from "nodemailer";

export const sendOtpMail=async(reciever,next)=>{
    const transporter=nodemailer.createTransport(
        {
            service:'gmail',
            auth:{
                user:'codingninjas2k16@gmail.com',
                pass:'slwvvlczduktvhdj'
            }
        }
    );

    const mailOptions={
        from:'codingninjas2k16@gmail.com',
        to:reciever,
        subject:'OTP for password reset',
        text:`your otp for password reset is : ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully");
        return true;
    } catch (error) {
        console.log(error);
        next(error);
    }
}