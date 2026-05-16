const axios = require("axios");
require("dotenv").config();

async function solveScheduling() {

    const headers = {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN.trim()}`
    };

    // Fetch depots
    const depotResponse = await axios.get(
        "http://4.224.186.213/evaluation-service/depots",
        { headers }
    );

    // Fetch vehicles
    const vehicleResponse = await axios.get(
        "http://4.224.186.213/evaluation-service/vehicles",
        { headers }
    );

    const depots = depotResponse.data.depots;

    const vehicles = vehicleResponse.data.vehicles;

    let finalResult = [];

    for (const depot of depots) {

        const selectedTasks = knapsack(
            vehicles,
            depot.MechanicHours
        );

        finalResult.push({
            depotID: depot.ID,
            mechanicHours: depot.MechanicHours,
            selectedTasks
        });
    }

    return finalResult;
}

function knapsack(tasks, maxHours) {

    const n = tasks.length;

    let dp = Array(n + 1)
        .fill()
        .map(() =>
            Array(maxHours + 1).fill(0)
        );

    for (let i = 1; i <= n; i++) {

        const duration = tasks[i - 1].Duration;

        const impact = tasks[i - 1].Impact;

        for (let w = 0; w <= maxHours; w++) {

            if (duration <= w) {

                dp[i][w] = Math.max(
                    impact +
                    dp[i - 1][w - duration],

                    dp[i - 1][w]
                );

            } else {

                dp[i][w] =
                    dp[i - 1][w];
            }
        }
    }

    let w = maxHours;

    let selected = [];

    for (let i = n; i > 0; i--) {

        if (dp[i][w] !== dp[i - 1][w]) {

            selected.push(tasks[i - 1]);

            w -= tasks[i - 1].Duration;
        }
    }

    return selected;
}

module.exports = {
    solveScheduling
};