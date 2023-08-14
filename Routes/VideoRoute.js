let express = require('express');
let router = express.Router();
const { getVideoDurationInSeconds } = require('get-video-duration')
let jwt = require('jsonwebtoken')
let multer = require('multer')
let Path = require('path')
let VideoModal = require('../modals/VideoModal')
let SecretKey = "VSP2023"

router.use(express.static('public'));


let Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === "video") {
            callback(null, 'public/Videos')

        } else {
            callback(null, 'public/Thumbnails')
        }
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + Date.now() + Path.extname(file.originalname))
    }
})

let upload = multer({
    storage: Storage
})


function AuthincationMiddleware(req, res, next) {
    try {
        let token = req.headers.authorization.split(" ")[1]
        let userinfo = jwt.verify(token, SecretKey)
        req.User = userinfo;
        next();
    } catch (err) {
        res.status(401).json({
            status: "please login first",
            error: err
        })
    }
}

router.post('/uploadVideo', upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), AuthincationMiddleware, async (req, res) => {
    let { video, thumbnail } = req.files
    let { title, Description, Category, Visibility } = req.body
    let durationInSec = await getVideoDurationInSeconds(`${video[0].path}`)
    let VideoPost = new VideoModal({
        title: title,
        date: new Date().toDateString(),
        duration: (durationInSec / 60).toFixed(2),
        views: 0,
        Description: Description,
        Video: video[0].filename,
        Thumbnail: thumbnail[0].filename,
        PublisherProfilePic: req.User.ProfilePic,
        PublisherName: req.User.name,
        PubilsherId: req.User.id,
        Category: Category,
        Visibility: Visibility
    })
    try {

        let response = await VideoPost.save()
        res.status(200).json({
            messsage: "Video Saved SuccessFully",
            data: response
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed To Save Video",
            errorDescription: err.message
        })
    }


})

router.get('/getVideos', async (req, res) => {
    let query=req.query.video
    let limit=Number(req.query.limit)
    let filter={}
    if(query){
        filter={ $text: { $search: query } }
    }
    try {
        
        let response =limit? await VideoModal.find(filter).limit(limit): await VideoModal.find(filter) 
        if(response.length){
            res.status(200).json({
                message:"Fetch Videos Successfully",
                data:response
            })

        }else{
            res.json({
                message:"Videos Not Found"
            })
        }  
    } catch (err) {
        res.status(500).json({
            message:"Failed to Fetch Videos",
            errorDescription:err.message
        })
    }
})

router.get('/myvideos',AuthincationMiddleware,async(req,res)=>{
    let filter={PubilsherId: req.User.id}
    try{
        let response= await VideoModal.find(filter)
        res.json({
            message:"Fetch Videos Successfully",
            data:response
        })
    }catch(err){
        res.json({
            message:"Failed to Fetch Videos",
            errorDescription:err.message
        })
    }
})

router.delete('/deleteVideo/:videoId',AuthincationMiddleware,async(req,res)=>{
    let videoId=req.params.videoId
    let filter={_id:videoId,PubilsherId: req.User.id}
    try{
        let response=await VideoModal.deleteOne(filter)
        if(response.deletedCount!=0){
            res.status(200).json({
                message:"Video Deleted SuccessFully",
            })
        }else{
            res.status(404).json({
                message:"Video not Found To Delete"
            })
        }
    }catch(err){
        res.status(500).json({
            message:"Failed to Delete Video"
        })
    }
})

router.put('/updateVideo/:videoId',AuthincationMiddleware,async(req,res)=>{
    let videoId=req.params.videoId;
    let filter={_id:videoId,PubilsherId: req.User.id}
    let updatedContent=req.body;

    try{
        let response=await VideoModal.findOneAndUpdate(filter,updatedContent)
        if(response){
            res.status(200).json({
                message:"Video Details Updated Succefully"
            })
        }else{
            res.status(404).json({
                message:"Video Not Found To Update"
            })
        }
    }catch(err){
        res.status(500).json({
            message:"Internal Server Issue"
        })
    }
    
})

module.exports = router