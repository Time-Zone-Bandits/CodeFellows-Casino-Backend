const router = require('express').Router();
const Payments = require('../gameLogic/Payment');

class RouletteRoutes {


    static async updateRoulette(request, response){
        console.log(request.body);
        let board = request.body;
        const newWinningNumber = Math.floor(Math.random() * Object.keys(board).length - 2);
        let winnings = 0;
        if (newWinningNumber !== 0 && newWinningNumber % 2 === 0){
            winnings += board['evens'] * 2;
        }
        if (newWinningNumber !== 0 && newWinningNumber % 2 !== 0){
            winnings += board['odds'] * 2;
        }
        winnings += board[newWinningNumber] * 36;
        winnings -= Object.values(board).reduce((prev, curr)=>prev + curr,0);
        let chips = await Payments.closeBet(request.user.email, winnings, 'roulette');
        response.send({newWinningNumber: newWinningNumber, chips: chips});
    }
}

router.put('/', RouletteRoutes.updateRoulette);

module.exports = router;