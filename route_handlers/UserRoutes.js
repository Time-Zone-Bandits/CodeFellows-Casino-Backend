const router = require('express').Router();
const UserModel = require('../models/User');
const TransactionModel = require('../models/Transaction')

class UserRoutes {

    static async getUser(request, response){
        const user = await UserModel.findOne({email: request.user.email})
        const transactions = await TransactionModel.find({email: request.user.email});

        response.send({user: user, transactions: transactions});
    }

    static async postUser(request, response){
        const user = {
            name: request.user.name,
            email: request.user.email,
            chips: 1000
        };
        UserModel.create(user, (error, user) => {
            !(error) ? response.send(user) : response.status(400).send(error.message);
        });
    }

    static async deleteUser(request, response){
        const emailToDelete = request.params.email;
        UserModel.deleteOne({email: emailToDelete}, (error, deleteStatus) => {
            !(error) ? response.send(deleteStatus) : response.status(400).send(error.message);
        })
    }

    static async updateUser(request, response){
        let user = await UserModel.find({email: request.user.email})
        if (user.length === 0){
            user = {
                name: request.user.name,
                email: request.user.email,
                chips: 1000
            }
            UserModel.create(user, (error, user) => {
                !(error) ? response.send(user) : response.status(400).send(error.message);
            })
        } else {
            UserModel.findOneAndUpdate({email: request.user.email}, request.body, {new: true}, (error, result) => {
                !(error) ? response.send(result) : response.status(400).send(error.message);
            });
        }
    }
}

router.get('/', UserRoutes.getUser);
router.post('/', UserRoutes.postUser);
router.delete('/:email', UserRoutes.deleteUser);
router.put('/', UserRoutes.updateUser);

module.exports = router;