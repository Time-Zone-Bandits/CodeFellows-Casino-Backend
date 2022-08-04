const axios = require("axios");
const { response } = require("express");
const cardApiUrl = 'https://www.deckofcardsapi.com/api/deck'

class Blackjack{
    
    constructor(decks){
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
        const playersCards = await this.drawCards(2);
        const dealersCards = await this.drawCards(2);
        this.playersCards.push(...playersCards);
        this.dealersCards.push(...dealersCards);
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
            this.playersCards.push(card);
        } else if (playerOrDealer === 'dealer'){
            this.dealersCards.push(card);
        }
    }
}

async function tryBlackJack(){
    const BlackjackGame = new Blackjack(6);
    await BlackjackGame.fetchDeck(6);
    await BlackjackGame.initialDeal();
    await BlackjackGame.addCard('player');
    console.log('PLAYER:');
    console.log(BlackjackGame.getPlayersCards());
    console.log('DEALER:');
    console.log(BlackjackGame.getDealersCards());
}

tryBlackJack();

module.exports = Blackjack;

