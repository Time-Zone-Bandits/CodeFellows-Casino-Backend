const router = require('express').Router();
const UserModel = require('../models/User');
const TransactionModel = require('../models/Transaction');
const Payments = require('../gameLogic/Payment');
const Blackjack = require('../gameLogic/BlackJack');

class BlackJackRoutes {
    static BlackjackGame = {};

    static async getBlackJack(request, response){
        

    }

    static async postBlackJack(request, response){
        console.log(request.body);
        BlackJackRoutes.BlackjackGame[request.user.email] = new Blackjack();
        await BlackJackRoutes.BlackjackGame[request.user.email].fetchDeck(6);
        let winStatus = await BlackJackRoutes.BlackjackGame[request.user.email].initialDeal();
        let playersCards = BlackJackRoutes.BlackjackGame[request.user.email].getPlayersCards();
        let dealersCards = BlackJackRoutes.BlackjackGame[request.user.email].getDealersCards();
        let playerScore = BlackJackRoutes.BlackjackGame[request.user.email].scoreHand(playersCards);
        let dealerScore = BlackJackRoutes.BlackjackGame[request.user.email].scoreHand(dealersCards);
        console.log(`bet: ${request.body.bet}`);
        BlackJackRoutes.BlackjackGame[request.user.email].bet = request.body.bet;
        console.log(BlackJackRoutes.BlackjackGame[request.user.email]);
        response.send({
            winStatus: winStatus, 
            playersCards: playersCards,
            dealersCards: dealersCards,
            playerScore: playerScore,
            dealerScore: dealerScore
        });
        //TO DO: if won, record transaction and end game 
    }

    static async deleteBlackJack(request, response){
        BlackJackRoutes.BlackjackGame[request.user.email] = null;
    }

    static async updateBlackJack(request, response){
       
    }
}

router.get('/', BlackJackRoutes.getBlackJack);
router.post('/', BlackJackRoutes.postBlackJack);
router.delete('/', BlackJackRoutes.deleteBlackJack);
router.put('/', BlackJackRoutes.updateBlackJack);

module.exports = router;