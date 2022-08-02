const router = require('express').Router();
const UserModel = require('../models/User');
const TransactionModel = require('../models/Transaction')

class UserRoutes {

    static async getUser(request, response){
        response.send(`Hello ${request.user.name}`);
        console.log(response.getHeaders());
    }

    static postUser(request, response){
        response.send(`Hello ${request.user.name}`);
        console.log(response.getHeaders());
    }

    static deleteUser(request, response){
        response.send(`Hello ${request.user.name}`);
        console.log(response.getHeaders());
    }

    static updateUser(request, response){
        response.send(`Hello ${request.user.name}`);
        console.log(response.getHeaders());
    }
}

router.get('/', UserRoutes.getUser);
router.post('/', UserRoutes.postUser);
router.delete('/:id', UserRoutes.deleteUser);
router.put('/:id', UserRoutes.updateUser);

module.exports = router;