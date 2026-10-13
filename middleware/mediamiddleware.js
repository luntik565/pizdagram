import multer from "multer";
import path from "path";
import fs from 'fs'

function createstorage(subfolder){ 
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const targetDir = path.join('uploads', subfolder)
            if(!fs.existsSync(targetDir)){
                fs.mkdirSync(targetDir, {recursive: true})
            }
            cb(null, targetDir)
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + path.extname(file.originalname))
        }
    })
}

function imageFilter(req, file, cb){
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    } else {
        cb(new Error('Only image'), false)
    }
}

const limits = { fileSize: 5 * 1024 * 1024 } 

export const uploadMessMedia = multer({
    storage: createstorage('messages'),
    fileFilter: imageFilter,
    limits: limits,
}).single('file') 

export const uploadAvatar = multer({
    storage: createstorage('avatar'),
    fileFilter: imageFilter,
    limits: limits
}).single('/avatar')