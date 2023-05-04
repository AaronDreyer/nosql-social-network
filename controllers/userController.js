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
    User.findOne({ _id: params.userId })
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
            res.status(404).json({ message: 'No User found with this ID!' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    });
},

createUser({ body }, res) {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
},

updateUser({ params, body }, res) {
    User.findOneandUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this ID!' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

deleteUser({ params }, res) {
    Thought.deleteMany({ userId: params.userId })
    .then(() => {
        User.findOneAndDelete({ userId: params.userId })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this ID!' });
                return;
            }
            res.json(dbUserData);
        });
    })
    .catch(err => res.json(err));
},

addFriend({ params }, res) {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true }
    )
    .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this ID!' });
            return;
        }
        res.json(dbUserData);
    })
    .catch((err) => res.status(400).json(err));
},

deleteFriend({ params }, res) {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
    )
    .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this ID!' });
            return;
        }
        res.json(dbUserData);
    })
    .catch((err) => res.status(400).json(err));
}

};

module.exports = userController