const mongoose=require('mongoose');
require('dotenv').config();
const mongoURL='mongodb://localhost:27017/TrackingSYstem';
// const mongoURL=process.env.mongoURL;
// const mongoURL="mongodb+srv://arpitabarode367:arpita0725@cluster0.dha37px.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const connection=mongoose.connection;
connection.on('connected',()=>{
    console.log("connected to mongo db");
})
connection.on('error',()=>{
    console.log("mongo db connection error");
})
module.exports=connection;