const router = require('express').Router();
const UserModel = require('../models/User');
const TransactionModel = require('../models/Transaction')

class BlackJackRoutes {

    static async getBlackJack(request, response){
        
    }

    static postBlackJack(request, response){
        
    }

    static deleteBlackJack(request, response){
      
    }

    static updateBlackJack(request, response){
       
    }
}

router.get('/', BlackJackRoutes.getBlackJack);
router.post('/', BlackJackRoutes.postBlackJack);
router.delete('/:id', BlackJackRoutes.deleteBlackJack);
router.put('/:id', BlackJackRoutes.updateBlackJack);

module.exports = router;