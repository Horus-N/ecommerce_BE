const Brand = require('../models/brandModel');
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbid");



const createBrand = asyncHandler(async(req,res)=>{
   try {
    const newBrand = await Brand.create(req.body);
    return res.json({newBrand:newBrand})
   } catch (error) {
    throw new Error(error)
   }
})


const updateBrand = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id)
   try {
    const updateBrand = await Brand.findByIdAndUpdate({_id:id},req.body,{
      new:true
    });
    return res.json({updateBrand})
   } catch (error) {
    throw new Error(error)
   }
})

const deleteBrand = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id);
   try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    return res.json({deleteBrand})
   } catch (error) {
    throw new Error(error)
   }
})

const getBrand = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id);
   try {
    const getBrand = await Brand.findById(id);
    return res.json({getBrand})
   } catch (error) {
    throw new Error(error)
   }
})

const getallBrand = asyncHandler(async(req,res)=>{
   try {
    const getallBrand = await Brand.find({});
    return res.json({getallBrand})
   } catch (error) {
    throw new Error(error)
   }
})
module.exports ={createBrand,updateBrand,deleteBrand,getBrand,getallBrand}