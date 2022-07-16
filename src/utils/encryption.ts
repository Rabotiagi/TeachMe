require('dotenv').config();
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const initVector = randomBytes(16);

export function encryptData(str: string): string{
    const cipher = createCipheriv(
        process.env.ALGORITHM, 
        process.env.ENCRYPTION_KEY, 
        initVector
    );

    let encrypted = cipher.update(str, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decryptData(str: string): string{
    const decipher = createDecipheriv(
        process.env.ALGORITHM, 
        process.env.ENCRYPTION_KEY, 
        initVector
    );

    let decrypted = decipher.update(str, 'utf-8', 'hex');
    decrypted += decipher.final('utf-8');
    return decrypted;
}