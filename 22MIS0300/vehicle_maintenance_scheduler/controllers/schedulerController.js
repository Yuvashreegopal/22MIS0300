const {
    solveScheduling
} = require("../services/schedulerService");

const getOptimalSchedule = async (req, res) => {

    try {

        const result = await solveScheduling();

        res.status(200).json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getOptimalSchedule
};