const Enquiry = require('../models/enqModel');
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbid");



const createEnquiry = asyncHandler(async(req,res)=>{
   try {
    const newEnquiry = await Enquiry.create(req.body);
    return res.json({newEnquiry:newEnquiry})
   } catch (error) {
    throw new Error(error)
   }
})


const updateEnquiry = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id)
   try {
    const updateEnquiry = await Enquiry.findByIdAndUpdate({_id:id},req.body,{
      new:true
    });
    return res.json({updateEnquiry})
   } catch (error) {
    throw new Error(error)
   }
})

const deleteEnquiry = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id);
   try {
    const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
    return res.json({deleteEnquiry})
   } catch (error) {
    throw new Error(error)
   }
})

const getEnquiry = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id);
   try {
    const getEnquiry = await Enquiry.findById(id);
    return res.json({getEnquiry})
   } catch (error) {
    throw new Error(error)
   }
})

const getallEnquiry = asyncHandler(async(req,res)=>{
   try {
    const getallEnquiry = await Enquiry.find({});
    return res.json({getallEnquiry})
   } catch (error) {
    throw new Error(error)
   }
})
module.exports ={createEnquiry,updateEnquiry,deleteEnquiry,getEnquiry,getallEnquiry}