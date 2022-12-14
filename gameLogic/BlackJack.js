const axios = require("axios");
const cardApiUrl = 'https://www.deckofcardsapi.com/api/deck'

class Blackjack{
    
    constructor(){
        this.deck = {};
        this.deck_id = '';
        this.remaining = 0;
        this.shuffled = false;
        this.playersCards = [];
        this.dealersCards = [];
        this.bet = 0;
        this.winCondition = 'no winner';
    }

    fetchDeck = async (deckCount) => {
        await axios.get(`${cardApiUrl}/new/shuffle/?deck_count=${deckCount}`)
        .then(response => {
            this.deck = response.data;
            this.deck_id = response.data.deck_id;
            this.remaining = response.data.remaining;
            this.shuffled = response.data.shuffled;
        });
    }

    drawCards = async (cardCount) => {
        const result = await axios.get(`${cardApiUrl}/${this.deck_id}/draw/?count=${cardCount}`)
        this.remaining = result.data.remaining;
        return result.data.cards;
    }

    initialDeal = async() => {
        const playersCards = await this.drawCards(2);
        const dealersCards = await this.drawCards(2);
        this.playersCards.push(...playersCards);
        this.dealersCards.push(...dealersCards);
        return this.initialWinStatus();
    }

    getPlayersCards = () => {
        return this.playersCards;
    };

    getDealersCards = () => {
        return this.dealersCards;
    }

    addCard = async (playerOrDealer) => {
        const card = await this.drawCards(1);
        if (playerOrDealer === 'player'){
            this.playersCards.push(...card);
        } else if (playerOrDealer === 'dealer'){
            this.dealersCards.push(...card);
        }
    }

    scoreHand = (hand) => {
        const faceCards = ['JACK', 'QUEEN', 'KING'];
        let score = 0;
        let aceCount = 0;
        for (let card of hand){
            if (faceCards.includes(card.value)){
                score += 10;
            } else if (card.value === 'ACE'){
                aceCount += 1;
            } else {
                score += parseInt(card.value);
            }
        }
        score = this.addAceScores(score, aceCount);
        return score;
    }

    addAceScores = (score, aceCount) => {
        score += aceCount * 11;
        for(let i = 0; i < aceCount; i++){
            if (score > 21){
                score -= 10;
            }
        }
        return score;
    }

    initialWinStatus = () => {
        const playerScore = this.scoreHand(this.playersCards);
        const dealersScore = this.scoreHand(this.dealersCards);
        if (playerScore === 21 && dealersScore === 21){
            this.winCondition = 'tie';
        } else if (dealersScore === 21){
            this.winCondition = 'dealer won';
        } else if (playerScore === 21){
            this.winCondition = 'player won';
        } else {
            this.winCondition = 'no winner';
        }
        return this.winCondition;
    }

    playRound = async (hitOrStand) => {
        if (this.winCondition !== 'no winner'){
            return this.winCondition;
        }
        if (hitOrStand === 'hit'){
            await this.addCard('player');
            //if player busts, return 'dealer won'
            let playerScore = this.scoreHand(this.playersCards);
            if (playerScore > 21) {
                this.winCondition = 'dealer won';
                //if player gets 21, go to dealers turn
            } else if (playerScore === 21){
                this.winCondition = await this.dealersTurn();
            } else {
                this.winCondition = 'no winner';
            }
        } else if (hitOrStand === 'stand'){
            this.winCondition = await this.dealersTurn();
        }
        return this.winCondition;
    }

    dealersTurn = async() => {
        let playerScore = this.scoreHand(this.playersCards);
        let dealerScore = this.scoreHand(this.dealersCards);
        while(dealerScore < 17){
            await this.addCard('dealer');
            dealerScore = this.scoreHand(this.dealersCards);
        }
        if (dealerScore > 21){
            this.winCondition = 'player won';
        } else if (playerScore === dealerScore){
            this.winCondition = 'tie';
        } else if (dealerScore > playerScore){
            this.winCondition = 'dealer won';
        } else {
            this.winCondition = 'player won';
        }
        return this.winCondition;
    }
}

/* async function tryBlackJack(){
    const BlackjackGame = new Blackjack(6);
    await BlackjackGame.fetchDeck(6);
    let result = await BlackjackGame.initialDeal()
    console.log('PLAYER HAND:');
    console.log(BlackjackGame.getPlayersCards());
    console.log('PLAYER SCORE:');
    console.log(BlackjackGame.scoreHand(BlackjackGame.getPlayersCards()));
    console.log('DEALER HAND:');
    console.log(BlackjackGame.getDealersCards());
    console.log('DEALER SCORE:');
    console.log(BlackjackGame.scoreHand(BlackjackGame.getDealersCards()));
    console.log('GAME RESULT:');
    console.log(result);
    ////
    console.log('PLAY ROUND');
    result = await BlackjackGame.playRound('hit');
    console.log('PLAYS HAND AFTER HIT:');
    console.log(BlackjackGame.getPlayersCards());
    console.log('PLAYER SCORE:');
    console.log(BlackjackGame.scoreHand(BlackjackGame.getPlayersCards()));
    console.log('DEALER SCORE:');
    console.log(BlackjackGame.scoreHand(BlackjackGame.getDealersCards()));
    console.log('GAME RESULT:');
    console.log(result);
    ////
    console.log('PLAY ROUND');
    result = await BlackjackGame.playRound('stand')
    console.log('DEALERS CARDS AFTER STAND');
    console.log(BlackjackGame.getDealersCards());
    console.log('PLAYER SCORE:');
    console.log(BlackjackGame.scoreHand(BlackjackGame.getPlayersCards()));
    console.log('DEALERS SCORE');
    console.log(BlackjackGame.scoreHand(BlackjackGame.getDealersCards()));
    console.log('GAME RESULT:');
    console.log(result);
}

tryBlackJack(); */

module.exports = Blackjack;

