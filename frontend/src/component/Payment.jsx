import axios from 'axios';
import React, { useState } from 'react'

const Payment = () => {

     const [name, setName] = useState('');
     const [mobile, setMobile] = useState('');
     const [amount, setAmount] = useState('');
     const [loading, setLoading] = useState('');




  const handleSubmit= async (e)=>{
    e.preventDefault();
    

    setLoading(true);

    const data={
        name,
        mobile,
        amount,
        MUID: "MUIDW" + Date.now(),
        transactionId: "T" + Date.now(),
    };

    await axios
    .post("http://localhost:8000/order", data)
    .then((response)=> {
      
        if(response.data && response.data.data.instrumentResponse.redirectInfo.url){
            window.location.href = response.data.data.instrumentResponse.redirectInfo.url;
        }
    })
    .catch((error)=>{
        console.log("erroe", error);
    });
  };




  return (
    <div>
    <form onSubmit={handleSubmit} className=''>
        <h2 className='text-4xl font-bold mb-6 text-[#673987]'>Make a Payment</h2>
       
        <div className='mb-6'>
            <label htmlFor='Name' className='black text-sm font-medium leading-6 text-gray-900'>Name</label>
            <div className='relative mt-2 rounded-md shadow-sm'>
                <input  id="Name" name="Name" type='text' value={name} onChange={(e)=>setName(e.target.value)} required placeholder='Enter Your Name'
                className='block w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-900 ring-1 ring-insert'/>
            </div>
            </div>

            <div className='mb-6'>
            <label htmlFor='Name' className='black text-sm font-medium leading-6 text-gray-900'>Mobile</label>
            <div className='relative mt-2 rounded-md shadow-sm'>
                <input  id="Name" name="Name" type='text' value={mobile} onChange={(e)=> setMobile(e.target.value)} required placeholder='Enter Your Phone Number'
                className='block w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-900 ring-1 ring-insert'/>
            </div>
        </div>



        <div className='mb-6'>
            <label htmlFor='Name' className='black text-sm font-medium leading-6 text-gray-900'>Amount</label>
            <div className='relative mt-2 rounded-md shadow-sm'>
                <input  id="Name" name="Name" type='text' value={amount} onChange={(e)=> setAmount(e.target.value)} required placeholder='0.00'
                className='block w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-900 ring-1 ring-insert'/>
           <div className='absolute insert-y-0 right-0 flex item-center'>
            <label htmlFor='currency' className='sr-only'>Currency</label>
            <select id='currency' name='currency' className='h-full py-0 pl-2 text-gray-500 bg-transparent border-0 rounded-md pr-7 focus: ring-2'>
                <option>INR</option>
                <option>CAD</option>
                <option>EUR</option>
            
            </select>
           </div>
            </div>
        </div>


           <button type="submit" disabled={loading} className='w-full py-3 bg-[#673997] text-white font-semibold rounded-md hover:bg-primary-dark'>
            Pay Now
           </button>
    </form>
    </div>
  )
}

export default Payment







  
