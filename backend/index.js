const express = require('express');
const cors = require("cors");
const crypto = require('crypto');
const axios = require('axios');
const { url } = require('inspector');
const { request } = require('http');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));




// routes

app.get("/", (req, res)=>{
    res.send("API is Ready")
})

let salt_key = '96434309-7796-489d-8924-ab56988a6076'
let merchant_id = 'PGTESTPAYUAT86'

app.post('/order', async(req, res)=>{
    try{

        let {
            MUID, 
            transactionId,
            amount,
            mobile,
            name
        } = req.body;

 const data={
    merchantId: merchant_id,
    merchantTransactionId: transactionId,
    name: name,
    amount: amount * 100,
    redirectUrl: `http://localhost:8000/status?id=${transactionId}`,
    redirectMode: 'POST',
    mobileNumber: mobile,
    paymentInstrument:{
        type: "PAY_PAGE" 
    }
 }

 


 const payload = JSON.stringify(data);
 const payloadMain = Buffer.from(payload).toString('base64');

 const string = payloadMain + '/pg/v1/pay' + salt_key;
 const sha256 = crypto.createHash('sha256').update(string).digest('hex');

  const checksum = sha256 + '###' + 1;

  const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
 
   const options = {
    method: "POST",
    url:prod_URL,
    headers:{
        'accept': "application/json",
        "content-type": "application/json",
        "X-VERIFY": checksum
    },
    data:{
        request:payloadMain
    }
   }

   await axios(options).then(response=>{
    res.json(response.data)
   }).catch(error=>{
    console.log(error.message);
    res.status(500).json({error: error.message})
   })

    }
    catch(error){
        console.log(error)
    }
})


 app.post('/status', async (req, res)=>{
    try{
        const merchantTransactionId = req.query.id;
        const merchantId = merchant_id

        const keyIndex = 1;

        const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}+salt_key`;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex'); 
         const checksum = sha256 + '###' + keyIndex;

  const options = {
    method: 'GET',
    url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId,
    },
  };

   await axios(options).then(response=>{
    if(response.data.success === true){
        const url= "http://localhost:5173/success"
        return res.redirect(url)
    } else{
        const url="http://localhost:5173/failure"
        return res.redirect(url)
    }
   }) 
    } catch (error){
        console.log(error)
    }
 })





app.listen(8000, ()=>{
    console.log("server is runnig on Port 8000")
})