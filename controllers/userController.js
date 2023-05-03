const { User, Thought } = require('../models');

const userController = {
    getUsers(req, res) {
        User.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

getSingleUser({ params }, res) {
    User.findOne({ _id: params.id })
    .populate({
        path: 'thoughts',
        select: '-__v'
    })
    .populate({
        path: 'friends',
        select: '-__v'
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.stauts(404).json({ message: 'No User found with this ID!' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    });
},


}