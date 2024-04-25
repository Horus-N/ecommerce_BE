const Color = require('../models/colorModel');
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbid");



const createColor = asyncHandler(async(req,res)=>{
   try {
    const newColor = await Color.create(req.body);
    return res.json({newColor:newColor})
   } catch (error) {
    throw new Error(error)
   }
})


const updateColor = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id)
   try {
    const updateColor = await Color.findByIdAndUpdate({_id:id},req.body,{
      new:true
    });
    return res.json({updateColor})
   } catch (error) {
    throw new Error(error)
   }
})

const deleteColor = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id);
   try {
    const deleteColor = await Color.findByIdAndDelete(id);
    return res.json({deleteColor})
   } catch (error) {
    throw new Error(error)
   }
})

const getColor = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id);
   try {
    const getColor = await Color.findById(id);
    return res.json({getColor})
   } catch (error) {
    throw new Error(error)
   }
})

const getallColor = asyncHandler(async(req,res)=>{
   try {
    const getallColor = await Color.find({});
    return res.json({getallColor})
   } catch (error) {
    throw new Error(error)
   }
})
module.exports ={createColor,updateColor,deleteColor,getColor,getallColor}