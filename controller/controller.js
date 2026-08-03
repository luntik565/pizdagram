import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';
import jsonwebtoken from "jsonwebtoken";
import { use } from "bcrypt/promises";
const JWT_SECRET = "8i9o0pgderu"

function generatetoken(id, username){
    return jsonwebtoken.sign(
        {id, username},
        JWT_SECRET,
        {expiresIn: '30d'}
    )
}

class AuthControll {
    async reg(req, res) {
        try {
            const { username, password } = req.body;

            const isUserExist = await db.query.users.findFirst({
                where: eq(users.username, username)
            });

            if (isUserExist) {
                return res.status(400).json({ message: "Пользователь с таким именем уже существует" });
            }

            const hashpassword = await bcrypt.hash(password, 7);
            
            const [newUser] = await db.insert(users)
                .values({ username, password: hashpassword })
                .returning();
            const { password: _, ...userRes } = newUser;
            const token = generatetoken(newUser.id, newUser.username)

            return res.status(200).json({ message: "Пользователь успешно создан", user: userRes, token });
            
        } catch (error) {
            console.log(error);
            if (!res.headersSent) {
                return res.status(500).json({ message: "Ошибка сервера" });
            }
        }
    }
    async login(req, res){
        try {
            const { username, password } = req.body;
            const isfinduserDB = await db.query.users.findFirst({
                where: eq(users.username, username)
            })
            if(!isfinduserDB){
                return res.status(400).json({ message: "такого пользователя нет" });
            }
            const passValid = await bcrypt.compare(password, isfinduserDB.password)
            if(!passValid){
                return res.status(400).json({ message: "неправильный пароль" })
            }

            const {password: _, ...userRes} = isfinduserDB
            const token = generatetoken(isfinduserDB.id, isfinduserDB.username)

            return res.status(200).json({ 
                message: "Успешный вход", 
                user: userRes,
                token 
            });
        } catch (error) {
            console.log(error);
            if(!res.headersSent){
                return res.status(500).json({ message: "Ошибка сервера" });
            }
        }
    }
    async allUsers(req, res){
        try {
            const allusers = await db.query.users.findMany()
            return res.json(allusers)
        } catch (error) {
            
        }
        
    }
}

export const authController = new AuthControll();