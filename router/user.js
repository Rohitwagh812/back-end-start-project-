const express = require('express');
const router = express.Router();
const User = require('../modules/user'); 

// Get all users
router.get('/', async (req, res) => {
    try {
        const usersData = await User.find();
        res.json({ data: usersData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json({ data: user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error occurred while querying" });
    }
});

// Create a new user
router.post('/new', async (req, res) => {
    try {
        const newUser = new User({ userName: req.body.userName });
        await newUser.save();
        res.status(201).json({ message: 'New user created', data: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user details by ID
router.patch('/update/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.userName = req.body.userName;
        await user.save();
        res.json({ message: 'User details updated', data: user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete user by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: 'User deleted', data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;




// const express =  require('express');

// const router = express.Router();

// const User = require('../modules/user')

// router.get('/', async (req, res) => {
//     try {
//         const usersData = await User.find();
//         res.json({ data : usersData });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// })


// // get(read) singel user data
// router.get('/:id', async (req, res) => {

//     try {
//         const user = await User.findById(req.params.id);
//             if(user){
//                 res.json({ data : user });
            
//             } else{
//                 res.status(404).json({ message: "Error orccud while querying" });
//             }
//         } catch (err) {
//         res.status(500).json({ message: "Error orccud while querying" });
//     }
// });

// // to create a user
// router.post('/new', async(req, res) => {
// //user is create in DB
// const newUser = new User({ userName : req.body.userName })
//  await newUser.save()
// res.status(200).json({ message: ' a new user post update' });
// })

// //to updated a user details
// router.patch('/update/:id',async (req, res) => { 
//    const user = await User.findById(req.params.id);
//    user.userName = req.body.userName;
//    await user.save()
// //user is updated in DB
// res.status(200).json({ message: 'user detail updated'});
// })

// //to delete a user details
// router.delete('/delete/:id', async (req, res) => {  
// //user is delete in DB
// await User.findOneAndDelete(req.params.id)
// res.status(200).json({ message: 'user delete'});
// })





// module.exports = router;