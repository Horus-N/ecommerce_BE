const Category = require('../models/prodcategoryModel');
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbid");



const createCategory = asyncHandler(async(req,res)=>{
   try {
    const newCategory = await Category.create(req.body);
    return res.json({newCategory:newCategory})
   } catch (error) {
    throw new Error(error)
   }
})


const updateCategory = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id)
   try {
    const updateCategory = await Category.findByIdAndUpdate({_id:id},req.body,{
      new:true
    });
    return res.json({updateCategory})
   } catch (error) {
    throw new Error(error)
   }
})

const deleteCategory = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id);
   try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    return res.json({deleteCategory})
   } catch (error) {
    throw new Error(error)
   }
})

const getCategory = asyncHandler(async(req,res)=>{
   const {id}= req.params;
   validateMongoDbId(id);
   try {
    const getCategory = await Category.findById(id);
    return res.json({getCategory})
   } catch (error) {
    throw new Error(error)
   }
})

const getallCategory = asyncHandler(async(req,res)=>{
   try {
    const getallCategory = await Category.find({});
    return res.json({getallCategory})
   } catch (error) {
    throw new Error(error)
   }
})
module.exports ={createCategory,updateCategory,deleteCategory,getCategory,getallCategory}