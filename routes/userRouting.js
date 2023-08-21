//import express
const express=require('express')

//import register from logic
const logic=require('../controllers/logic')

//import middleware
const jwtMiddleware = require('../middlewares/routerMiddleware')

//create an object for router class in express
const router=new express.Router()

//register
router.post('/bankuser/user-register',logic.register)

//login
router.post('/bankuser/user-login',logic.login)

//user profile
router.get('/bankuser/user-profile/:acno',jwtMiddleware,logic.getprofile)

//user balance
router.get('/bankuser/user-balance/:acno',jwtMiddleware,logic.balanceEnquiry)

//money transfer
router.post('/bankuser/money-transfer',jwtMiddleware,logic.moneyTransfer)

//transaction history
router.get('/bankuser/user-history/:acno',jwtMiddleware,logic.history)

//delete ac
router.delete('/bankuser/user-delete/:acno',jwtMiddleware,logic.deleteAc)

//export router
module.exports=router
