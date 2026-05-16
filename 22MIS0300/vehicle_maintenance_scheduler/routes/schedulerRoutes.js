const express = require("express");

const router = express.Router();

const {
    getOptimalSchedule
} = require("../controllers/schedulerController");

router.get(
    "/schedule",
    getOptimalSchedule
);

module.exports = router;