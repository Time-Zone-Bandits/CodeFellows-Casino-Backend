const TransactionModel = require('../models/Transaction')
const UserModel = require('../models/User');

class Payments{
    
    //change the user's chip amount by any positive, zero, or negative amount; record a game transaction
    //winnings can be positive, negative, or 0 (for a tie)
    static async closeBet(userEmail, winnings, gameName){
        let user = await UserModel.findOne({email: userEmail});
        user.chips += winnings;
        user.save()
        TransactionModel.create({email: userEmail, winnings: winnings, game: gameName, date: new Date()});
        return user.chips; 
    }

    //returns how many chips the user has
    static async getChipsAmount(userEmail){
        let user = await UserModel.findOne({email: userEmail});
        return user.chips;
    }

    //return false if user doesn't have enough chips for bet
    static async checkBet(userEmail, betAmount){
        let user = await UserModel.findOne({email: userEmail});
        return user.chips > betAmount;
    }
}

module.exports = Payments;