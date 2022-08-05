const router = require('express').Router();
const Payments = require('../gameLogic/Payment');
const Blackjack = require('../gameLogic/BlackJack');
const { findByIdAndDelete } = require('../models/Transaction');

class BlackJackRoutes {
    static BlackjackGame = {};

    static async getBlackJack(request, response){
        

    }

    static async postBlackJack(request, response){
        try {
            BlackJackRoutes.BlackjackGame[request.user.email] = new Blackjack();
            await BlackJackRoutes.BlackjackGame[request.user.email].fetchDeck(6);
            let winStatus = await BlackJackRoutes.BlackjackGame[request.user.email].initialDeal();
            let playersCards = BlackJackRoutes.BlackjackGame[request.user.email].getPlayersCards();
            let dealersCards = BlackJackRoutes.BlackjackGame[request.user.email].getDealersCards();
            let playerScore = BlackJackRoutes.BlackjackGame[request.user.email].scoreHand(playersCards);
            let dealerScore = BlackJackRoutes.BlackjackGame[request.user.email].scoreHand(dealersCards);
            BlackJackRoutes.BlackjackGame[request.user.email].bet = request.body.bet;
            let bet = request.body.bet;
            let winnings = 0;
            if (winStatus !== 'no winner'){
                if (winStatus === 'player won'){
                    winnings = bet * 1.5
                    await Payments.closeBet(request.user.email, winnings, 'blackjack');
                } else if (winStatus === 'tie'){
                    await Payments.closeBet(request.user.email, winnings, 'blackjack');
                } else if (winStatus === 'dealer won'){
                    winnings = -bet
                    await Payments.closeBet(request.user.email, winnings, 'blackjack');
                }
            }
            response.send({
                winStatus: winStatus, 
                playersCards: playersCards,
                dealersCards: dealersCards,
                playerScore: playerScore,
                dealerScore: dealerScore,
                winnings: winnings
            });
        } catch (error) {
            response.send(error.message);
        }
    }

    static async deleteBlackJack(request, response){
        BlackJackRoutes.BlackjackGame[request.user.email] = null;
    }

    static async updateBlackJack(request, response){
        try{
            if (BlackJackRoutes.BlackjackGame[request.user.email] === null){
                response.send('game not started');
                return;
            }
            let winStatus = await BlackJackRoutes.BlackjackGame[request.user.email].playRound(request.body.choice);
            let playersCards = BlackJackRoutes.BlackjackGame[request.user.email].getPlayersCards();
            let dealersCards = BlackJackRoutes.BlackjackGame[request.user.email].getDealersCards();
            let playerScore = BlackJackRoutes.BlackjackGame[request.user.email].scoreHand(playersCards);
            let dealerScore = BlackJackRoutes.BlackjackGame[request.user.email].scoreHand(dealersCards);
            let bet = BlackJackRoutes.BlackjackGame[request.user.email].bet;
            let winnings = 0;
            if (winStatus !== 'no winner'){
                if (winStatus === 'player won'){
                    winnings = bet;
                    await Payments.closeBet(request.user.email, winnings, 'blackjack');
                } else if (winStatus === 'tie'){
                    await Payments.closeBet(request.user.email, winnings, 'blackjack');
                } else if (winStatus === 'dealer won'){
                    winnings = -bet;
                    await Payments.closeBet(request.user.email, winnings, 'blackjack');
                }
                BlackJackRoutes.BlackjackGame[request.user.email] === null;
            }
            response.send({
                winStatus: winStatus, 
                playersCards: playersCards,
                dealersCards: dealersCards,
                playerScore: playerScore,
                dealerScore: dealerScore,
                winnings: winnings
            });
        } catch (error){
            console.error(error.message)
            response.send(error.message);
        }
    }
}

router.get('/', BlackJackRoutes.getBlackJack);
router.post('/', BlackJackRoutes.postBlackJack);
router.delete('/', BlackJackRoutes.deleteBlackJack);
router.put('/', BlackJackRoutes.updateBlackJack);

module.exports = router;