const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, allMessages, clearChat } = require("../controllers/messageControllers");

const router = express.Router();

router.route('/').post(protect,sendMessage)
router.route('/:chatId').get(protect,allMessages)
router.route("/clear/:chatId").delete(protect, clearChat);


module.exports = router;
