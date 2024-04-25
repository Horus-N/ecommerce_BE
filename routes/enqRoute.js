const express = require('express');
const { createEnquiry,updateEnquiry,deleteEnquiry,getEnquiry,getallEnquiry } = require('../controller/enqController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/',getallEnquiry)
router.post('/create-enquiry',authMiddleware,isAdmin,createEnquiry)
router.get('/:id',authMiddleware,isAdmin,getEnquiry)
router.put('/:id',authMiddleware,isAdmin,updateEnquiry)
router.delete('/:id',authMiddleware,isAdmin,deleteEnquiry)


module.exports = router;