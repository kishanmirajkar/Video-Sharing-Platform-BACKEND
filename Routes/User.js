const express = require("express");
let router = express.Router()
let UserModal = require('../modals/RegisterModal')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let multer = require('multer')
let Path = require('path')
let SecretKey = "VSP2023"
let cors=require('cors');
router.use(cors())
let Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/Pictures')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + Date.now() + Path.extname(file.originalname))
    }
})

let upload = multer({
    storage: Storage
})

router.post('/register', upload.single("profile"), async (req, res) => {
    let { Name, Phone, Email, Profession, Password } = req.body;

    let ecryptedPassword = await bcrypt.hash(Password, 10)
    let User = new UserModal({
        Name,
        Email,
        Phone,
        Profession,
        UserProfile: req.file.filename,
        Password: ecryptedPassword
    })
    try {
        let respo = await User.save()
        res.status(200).json({
            message: "User Saved Successfully",
            Data: respo
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went Wrong",
            ErrorDescription: err.message
        })
    }

})

router.post('/login', (req, res) => {
    let { Email, Password } = req.body;
    UserModal.findOne({ Email: Email }).then((user) => {
        bcrypt.compare(Password, user.Password)
            .then((IsUser) => {
                if (IsUser) {
                    let token = jwt.sign({ id: user._id, name: user.Name, ProfilePic: user.UserProfile }, SecretKey)
                    res.json({
                        meassage: "Login Successfully",
                        token: token
                    })
                } else {
                    res.json({
                        message: "Invalid Crediantials"
                    })
                }
            }).catch((err) => {
                res.json({
                    message: "Internal Server issue Please Try Again"
                })
            })
    }).catch((err) => {
        res.json({
            message: "You are Not Registered With US Please Register Yourself First"
        })
    })


})


module.exports = router