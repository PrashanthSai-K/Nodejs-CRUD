const express =  require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();


app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



const connectParam = {
    useNewUrlParser : true,
    useUnifiedTopology : true
}

const uri = `mongodb://127.0.0.1:27017/demo`

const connection = mongoose.connect(uri,connectParam)
                    .then(()=>console.log('COnnedted to Mongo DB Successfully'))
                    .catch((err)=>console.log(err))


const userschema = new mongoose.Schema({
    name:'string',
    rollno:"string",
    dept:"string"
})

const user = mongoose.model('user', userschema)

app.get('/',(req,res)=>{

    res.sendFile(__dirname+'/index.html')
})

app.get('/users',(req,res)=>{
    user.find()
        .then((users)=>res.send(users))
        .catch((err)=>console.log(err));
})

app.get("/insert", (req,res)=>{
    res.sendFile(__dirname+'/insert.html')
})

app.get('/update',(req,res)=>{
    res.sendFile(__dirname+'/update.html')
})

app.post('/insertdb',(req,res)=>{
    console.log(req)
    const name = req.body.name
    const rollno = req.body.rollno
    const dept =  req.body.dept
    const newUser = new user({
        name:name,
        rollno:rollno,
        dept:dept
    })
    newUser.save()
        .then((usersaved)=>console.log(usersaved))
        .catch((error)=>console.log(error));
    res.redirect('/')
})

app.post("/updatedb",(req,res)=>{
    const name = req.body.name;
    const rollno = req.body.rollno;
    const dept = req.body.dept;
    user.findOneAndUpdate(
        {rollno:rollno},
        {name:name,dept:dept},
        {new:true}
    ).then((updateduser)=>{
        if(!updateduser){
            console.log("usser not found");
        }else{
            console.log(updateduser);
        }
    }).catch((error)=>{
        console.log(error)
    });
    res.redirect('/')
})





app.listen(3000,()=>console.log("App listenting on port : 3000"))
