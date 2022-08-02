const router = require('express').Router();
const UserModel = require('../models/User');
const TransactionModel = require('../models/Transaction')

class UserRoutes {

    static async getUser(request, response){
        response.send(`Hello ${request.user.name}`);
    }

    static postUser(request, response){
        
    }

    static deleteUser(request, response){
      
    }

    static updateUser(request, response){
       
    }
}

router.get('/', UserRoutes.getUser);
router.post('/', UserRoutes.postUser);
router.delete('/:id', UserRoutes.deleteUser);
router.put('/:id', UserRoutes.updateUser);

module.exports = router;