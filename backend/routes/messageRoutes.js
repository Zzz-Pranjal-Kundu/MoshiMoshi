const express = require('express');
const { sendMessage, allMessages } = require('../controllers/messageControllers');
const { protect } = require("../middleware/authMiddleware"); 

const router = express.Router();

router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect,allMessages);  //Fetch one of the message from one single chat

module.exports = router;