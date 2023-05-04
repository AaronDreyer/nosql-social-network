const { User, Thought } = require('../models');

// Creating User Controller to handle Routes
const userController = {

    // GET users
    getUsers(req, res) {
        User.find({})
        // Select excludes data in Mongo and -__v is versions which is not required in this application
        .select('-__v')
        // This sorts data in descending order
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

// GET user by ID
getSingleUser({ params }, res) {
    // _id is the id created but userId is the route in which we pull from. Its important to designate this as you will get a 400 error because the route does not understand which id youre accessing
    // findOne method
    User.findOne({ _id: params.userId })
    // Populates the user with thoughts and friends data
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

// POST user
createUser({ body }, res) {
    // create method
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
},

// PUT user
updateUser({ params, body }, res) {
    // findOneAndUpdate method
    // new: true returns updated document after its been updated
    // runValidators: true runs validation as specified in model
    User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this ID!' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

// DELETE user
deleteUser({ params }, res) {
    // deleteMany method to delete all associated thoughts
    Thought.deleteMany({ _id: params.userId })
    .then(() => {
        // findOneAndDelete method
        User.findOneAndDelete({ _id: params.userId })
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

// POST friend
addFriend({ params }, res) {
    User.findOneAndUpdate(
        // Specify correct id
        { _id: params.userId },
        // $push adds a new array field
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

// DELETE friend
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