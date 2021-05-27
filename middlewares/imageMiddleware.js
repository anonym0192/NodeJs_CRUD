const multer = require('multer');
const uuid = require('uuid');
const jimp = require('jimp');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: (req, file, next ) => {

        const allowed = ['image/jpg', 'image/jpeg', 'image/png'];

        if(allowed.includes(file.mimetype)){
            next(null, true);
        }else{
            next({message: 'File extension not supported'}, false);
        }
    }
};
exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if(!req.file){
        next();
        return;
    }
    const ext = req.file.mimetype.split('/')[1];
    const filename = `${uuid.v4()}.${ext}`;
    try{
        let image = await jimp.read(req.file.buffer);
        await image.resize(800, jimp.AUTO);
        await image.write(`./public/uploads/${filename}`);

        req.body.photo = filename;
    }catch(e){
        console.error(e.message);
    }
    next();
};
