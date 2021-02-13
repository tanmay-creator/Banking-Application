require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const bank = require('./Models/customer');
const transaction = require('./Models/transaction');
const dburl = require('./config/keys');

app.use(express.static('public'));
// app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }));


app.set('view engine', 'ejs');


//database connection
// const url = 'mongodb://localhost:27017/bank';

mongoose.connect(dburl.mongourl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Database Connected");
}).catch(err => {
    console.log("Connection failed");
});

app.get('/',  (req, res) => {
    
    res.render('main');
})

//Get request to /home route
app.get('/home', async (req, res) => {
    const customers = await bank.find();
    
    res.render('home', { details: customers });
})


//Get request to /transaction route
app.get('/transaction', async (req, res) => {
    const customers = await bank.find();
    const person = await bank.findOne({ acno: req.query.accnno });
    
    res.render('transaction',{details:customers,acno:req.query.accnno,person:person});

})

//Post request to /transact/:sender route
app.post('/transact/:sender',async(req,res)=>{
    const amount = req.body.amount;
    const receiver_name = req.body.name;
    const detail = await bank.findOne({acno:req.params.sender});
    const sender_name = detail.first+" "+detail.last;
    if(detail.balance>=amount)
    {
        const detail2 = await bank.findOne({first:receiver_name});
        detail2.balance=parseInt(detail2.balance) + parseInt(amount);
        detail.balance=detail.balance - amount;
        detail.save();
        detail2.save();
        await transaction.create({sendername:sender_name,amount:amount,receivername:receiver_name})
        res.render('successful');
    }
    else{
        res.render("error")
    }
})

//Get request to /trecord route
app.get('/trecord',async (req,res)=>{
    const customers= await transaction.find();
    res.render('transaction-record',{details:customers});
})


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
})