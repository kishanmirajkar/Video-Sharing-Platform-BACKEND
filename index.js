let express = require('express');
let app=express()
let mongoose = require('mongoose');
let UserRoutes=require('./Routes/User');
let VideoRoutes=require('./Routes/VideoRoute')
let bodyParser=require('body-parser');
let cors=require('cors')
mongoose.connect("mongodb+srv://abhi22525:BsjlPsAimhxx1NX2@cluster0.xqlhxhh.mongodb.net/?retryWrites=true&w=majority", { dbName: "VSPmain" })
    .then(() => console.log("DataBase is Connected"))
    .catch((err) => console.log("Failed to Connect", err))

app.use(cors())
app.use(express.static('public'));

app.use(bodyParser.json());

app.use('/user',UserRoutes);
app.use('/videos',VideoRoutes)
app.get('/home', (req, res) => {
    res.json({
        message: "welcome to video sharing platform"
    })
})

app.listen(9000, () => {
    console.log("App is Running");
})


// Hosting link --> https://veshare.netlify.app
