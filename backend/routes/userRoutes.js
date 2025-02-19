const express = require('express')
const { registerUser,authUser,allUsers } =require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router()
router.use(express.json());

router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login',authUser);
router.route('/').get(protect,allUsers); //first it goes to the 'protect' middleware after which it moves to 'allUsers'

module.exports = router;