import bcrypt from 'bcrypt'

export const hashPassword=async(password)=>{
    try {
        const HP=await bcrypt.hash(password,12);
        return HP;
    } catch (error) {
       console.log(error);
    }
}

export const compare=async(hashedPassword,password)=>{
    try {
        const result =await bcrypt.compare(password,hashedPassword);
        return result;
    } catch (error) {
        console.log(error);

    }
}