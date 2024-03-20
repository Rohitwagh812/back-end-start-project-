//create server in use exprees js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// const uri = 'mongodb+srv://rohitwagh0801:TH8myxnP0Z9MQJ1E@cluster0.lurrouo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// console.log(process.env.MONGO_URI);


const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);
// mongoose.connect(uri);

const db = mongoose.connection;


db.once('open', async()=>{
    console.log('db connecton succsufully')
})

db.on('error' , (error)=>{
    console.log(error)
})

const user = require('./modules/user');

app.get('/', (req, res) => {
    
    const { token } = req.cookies;
    if(token){
        const tokenData = jwt.verify(token , process.env.JWT_SECRET_KEY)

        if(tokenData.type == 'user'){
            res.render('home')  // next
    } 
    }else{
        res.redirect('/signin')
    }

    res.status(200).json({ message: 'hello world'}); // first 

})

app.get('/signin', (req , res)=>{

    res.render('signin')

})

app.get('/signup', (req , res)=>{

    res.render('signup')

})

// signup method 

app.post('/signup',async (req, res)=>{
    const {name ,email , password: plainTextPassword} = req.body;
    const salt = await bcrypt.genSalt(10);
    console.log(req.body)
    const hashedPassword = await bcrypt.hashSync(plainTextPassword, salt);

    try{
        await user.create({
            name, 
            email,
            password: hashedPassword
        }) 
        res.redirect('/signin')
    } catch(error){
        console.log(error)
    }
}
)

// signin method
app.post('/signin', async (req, res)=>{

    const {email , password} = req.body;
    const userObj = await user.findOne({email})
    if(!userObj){
       res.send({error:'user not found' , status:404})
    }

    if(bcrypt.compare(password , userObj.password)){

        const token = jwt.sign({

            userId:userObj._id , name:userObj.name , email:email , type:'user'

        }, process.env.JWT_SECRET_KEY , {expiresIn:'2h'})

        res.cookie('token', token , {maxAge: 2*60*60*1000})
        
        res.redirect('/')
        // res.render('home')
    }

})





const router = require('./router/user');
app.use('/users', router);




app.listen(5000);
console.log('Server is listening on port 5000');


