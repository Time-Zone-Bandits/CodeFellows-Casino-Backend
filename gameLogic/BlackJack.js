const axios = require("axios");
const { response } = require("express");
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
        console.log('drawing cards:');
        const playersCards = await this.drawCards(2);
        const dealersCards = await this.drawCards(2);
        console.log('adding cards');
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
            return 'tie';
        } else if (dealersScore === 21){
            return 'dealer won';
        } else if (playerScore === 21){
            return 'player won';
        } else {
            return 'no winner';
        }
    }

    playRound = async (hitOrStand) => {
        if (hitOrStand === 'hit'){
            await this.addCard('player');
            //if player busts, return 'dealer won'
            let playerScore = this.scoreHand(this.playersCards);
            if (playerScore > 21) {
                return 'dealer won';
                //if player gets 21, go to dealers turn
            } else if (playerScore === 21){
                return this.dealersTurn();
            } else {
                return 'no winner';
            }
        } else if (hitOrStand === 'stand'){
            return this.dealersTurn();
        }
    }

    dealersTurn = async() => {
        return 'tie';
    }
}

/* async function tryBlackJack(){
    const BlackjackGame = new Blackjack(6);
    await BlackjackGame.fetchDeck(6);
    console.log(await BlackjackGame.initialDeal());
    console.log('PLAYER:');
    let cards = BlackjackGame.getPlayersCards() 
    console.log(cards);
    console.log('SCORING:')
    console.log(BlackjackGame.scoreHand(cards));
    console.log('DEALER:');
    cards = BlackjackGame.getDealersCards();
    console.log(cards);
    console.log('SCORING');
    console.log(BlackjackGame.scoreHand(cards));
    await BlackjackGame.addCard('dealer')
    cards = BlackjackGame.getDealersCards();
    console.log(cards);
    console.log('SCORING');
    console.log(BlackjackGame.scoreHand(cards))

}

tryBlackJack(); */

module.exports = Blackjack;

