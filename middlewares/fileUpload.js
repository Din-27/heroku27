const multer = require('multer')

const storage = multer.diskStorage({
    destination: (request, file, callback)=>{
        callback(null, "upload")
    },
    filename: (request, file, callback)=>{
        callback(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({storage})

module.exports = upload