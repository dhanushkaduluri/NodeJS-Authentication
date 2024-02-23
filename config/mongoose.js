import mongoose from 'mongoose';

mongoose.set('strictQuery', false);


const url='mongodb+srv://dhanushkaduluri:630356Dk@cluster0.fbxouqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectToDB=async()=>{
    try {
        await mongoose.connect(url);
        console.log("Connected to database successfully!");
    } catch (error) {
        console.log(error);
    }
}

export default connectToDB;