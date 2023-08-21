//import jwt
const jwt=require('jsonwebtoken')

//import model
const users = require("../models/modelcollection")

//logic for register - create as functions
const register=(req,res)=>{         //body={acno:"123",uname="anu",psw:'abc123'}
    // res.send("Register working")
    //access data from body
    const acno=req.body.acno
    const uname=req.body.uname
    const psw=req.body.psw
    //const {acno,uname,psw}=req.body

    //check acno is present in collection users
    users.findOne({acno}).then(user=>{      //key and value of acno is same, insted of {acno:acno}, {acno is used}, key from schema in model and value is from body
        if(user){
            // res.send("user already exist")
            res.status(401).send("user already exist")  //change status as the data is already exist and is a clint side error
        }
        else{
            //register user - create a new object for user
            var newUser= new users({
                acno,
                uname,
                psw,
                balance:0,
                transactions:[]
            })
            //save object in collection
            newUser.save()
            //send response
            // res.send(newUser)   //only send data
            res.json(newUser)       //json() - convert js data into json type and send
        }
    })
}

//logic for login
const login=(req,res)=>{    //body={acno:1000,psw:"abc123"}
    const {acno,psw}=req.body
    users.findOne({acno,psw}).then(user=>{
        if(user){
            //generate token
            var token=jwt.sign({acno},"secretkey123")
            // user["token"]=token
            // res.status(200).json(user)
            res.status(200).json({
                acno:user.acno,
                uname:user.uname,
                token
            })
        }
        else{
            res.status(401).json("Incorrect acno or password")
        }
    })
}

//logic to get profile datas
const getprofile=(req,res)=>{
    //access acno param from url request
    const {acno}=req.params
    users.findOne({acno}).then(user=>{
        if(user){
            res.status(200).json({
                acno:user.acno,
                uname:user.uname
            })
        }
        else{
            res.status(401).json("user not exist")
        }
    })
}

//logic for balance Enquiry
const balanceEnquiry=(req,res)=>{
const {acno}=req.params
users.findOne({acno}).then(user=>{
  if(user){
    res.status(200).json({
        uname:user.uname,
        balance:user.balance
    })
  } 
  else{
    res.status(401).json("User not exist")
  } 
})
}

//logic for money transfer
const moneyTransfer=(req,res)=>{
    //access all datas from body
    const {fromAcno,toAcno,psw,amount,date}=req.body
    //convert amount to number
    var amnt=parseInt(amount)
    //check for user in db
    users.findOne({acno:fromAcno,psw}).then(fromUser=>{
        if(fromUser){
            //check for toUser
            users.findOne({acno:toAcno}).then(touser=>{
                if(touser){
                    //fromUser balance check
                    if(amnt<=fromUser.balance){
                        fromUser.balance -=amnt
                        fromUser.transactions.push({type:"DEBIT",amount:amnt,date,User:touser.uname})
                        fromUser.save()

                        touser.balance +=amnt
                        touser.transactions.push({type:"CREDIT",amount:amnt,date,User:fromUser.uname})
                        touser.save()

                        res.status(200).json({message:"Transcation success"})
                    }
                    else{
                        res.status(401).json({message:"Insufficient balance"})
                    }
                }
                else{
                    res.status(401).json({message:"Invalid credit credinals"})
                }
            })
        }
        else{
            res.status(401).json({message:"Invalid debit credinals"})
        }
    })
}

//logic for transaction history
const history=(req,res)=>{
    const {acno}=req.params
    users.findOne({acno}).then(user=>{
        if(user){
            res.status(200).json(user.transactions)
        }
        else{
            res.status(401).json({message:"Invalid debit credinals"})
        }
    })
}

//logic to delete ac
const deleteAc=(req,res)=>{
    const {acno}=req.params
    users.deleteOne({acno}).then(user=>{  //deleteCount - 1/0
        if(user){
            res.status(200).json("Account deleted")
        }
        else{
            res.status(401).json("User not exist")
        }
    })
}

module.exports={
    register,login,getprofile,balanceEnquiry,moneyTransfer,history,deleteAc
}