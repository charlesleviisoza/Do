import crypto from "crypto";
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export const createHash = (data: string) => {
    const result = crypto.createHash('sha1').update(data).digest('hex');
    return result;
}

export const getHashPassword = (password: string) => {
    const salt =  genSaltSync(8);
    const hash = hashSync(password, salt);
    return hash;
}

export const validateHashPassword = (plainPassword: string, hashPassword: string) => {
    return compareSync(plainPassword, hashPassword);
}