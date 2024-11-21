const express = require("express");
const cors =  require('cors');
const router = express.Router();
const Chapa = require('chapa')


const chapaKey = "CHASECK-LGrL0zMgWROcgKr4IqHqS8cPfNaHoH03"

let myChapa = new Chapa(chapaKey)

router.use(cors())
router.post("/", async (req, res, next) => {
    const { first_name,amount,email="a@gmail.com",phone_number,title="",return_url,description="",currency} = req.body
    const TEXT_REF = "tx-ABI_ZEER12345" + Date.now()
   
   const url = return_url +TEXT_REF;
   
   
   


    // form data
    const customerInfo = {
        amount: amount, 
        currency: currency,
        email: email,
        first_name: first_name,
        last_name: first_name,
        tx_ref: TEXT_REF,
        callback_url: 'https://chapa.co', 
        return_url:url,
        phone_number:phone_number,
        customization: {
            title: title,
            description: description
        } 
    }

console.log(customerInfo)

myChapa.initialize(customerInfo, { autoRef: true }).then(response => {
 
    return res.status(200).json({
       response:response
      });

}).catch(e => res.send(e))  
});

router.get("/verify-payment/:id",async(req,res,next)=>{
    
    myChapa.verify(req.params.id).then(response => {
        return res.status(200).json({
            response:response
           });
    }).catch(e => res.send(e))    
})

router.get("/test",async(req,res,next)=>{
    
   res.send("hi")
})

module.exports = router;



// async/await
// let response = await myChapa.initialize(customerInfo, { autoRef: true })

// myChapa.verify('txn-reference').then(response => {
//     console.log(response) // if success
// }).catch(e => console.log(e)) // catch errors

// // async/await
// let response = await myChapa.verify('txn-reference')
