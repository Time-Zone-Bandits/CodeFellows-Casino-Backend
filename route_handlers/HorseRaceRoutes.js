const router = require('express').Router();
const Payments = require('../gameLogic/Payment');

class HorseRaceRoutes {

    static async postHorseRace(request, response){
        try {
            let times = [];
            let min = Infinity;
            let winner = 0;
            for(let i = 0; i < 4; i++){
                let t = Math.random() * (5.0 - 2.5) + 3.0;
                if (t < min){
                    min = t;
                    winner = i;
                }
                times.push(t);
            }
            response.send({times: times, winStatus: request.body.winner === winner});
            let winnings = 0;
            if (request.body.winner === winner){
                winnings = 20 * 3;
            } else {
                winnings = -20;
            }
            await Payments.closeBet(request.user.email, winnings, 'horserace');
        } catch (error) {
            response.send(error);
        }
    }
}

router.post('/', HorseRaceRoutes.postHorseRace);

module.exports = router;