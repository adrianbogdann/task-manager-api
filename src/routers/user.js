const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');

//CREATING USERS
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    // user.save().then(() => {
    //     res.status(201).send(user);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // })

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({
            // user has private details hidden in the user model toJSON method
            //toJSON manipulates the JSON object
            user,
            token
        });
    } catch (e) {
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

//READING USERS
//middleware with auth
router.get('/users/me', auth, async (req, res) => {
    // try {
    //     const users = await User.find({});
    //     res.send(users);
    // } catch (e) {
    //     res.status(500).send();
    // }

    res.send(req.user);
});

//not needed - maybe only for admin who can see all users
// router.get('/users/:id', async (req, res) => {
//     const userId = req.params.id;
//     // User.findById(userId).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send();
//     //     }
//     //     res.send(user);
//     // }).catch((e) => {
//     //     res.status(500).send();
//     // })

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send();
//     }
// })

//UPDATE USERS
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const userId = req.user._id;
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)

    })
    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        //this method bypasses mongoose and works directly with the DB
        //we can;t add middlewares on updates ( ex:preSave)
        // const user = await User.findByIdAndUpdate(
        //     userId,
        //     req.body,
        //     { new: true, runValidators: true }
        // );

        // const user = await User.findById(userId);

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();

        //dont need anymore -> because of authentication
        // if (!req.user) {
        //     return res.status(404).send();
        // }

        res.send(req.user);

    } catch (e) {
        res.status(400).send(e);
    }
})

//DELETE USERS
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);

        // if (!user) {
        //     return res.status(404).send();
        // }

        await req.user.remove();
        sendCancelEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})

const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be jpg,jpeg or png format'));
        }
        cb(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
})

module.exports = router;