const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
//we set up environment variables in config and installed env-cmd 
//to load those when the app is loaded  (package.json -> scripts -> dev)
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is up on port ', port);
})

// const Task = require('./models/task');
// const User = require('./models/user');

//TESTING PURPOSES

//populate models with data in another table
const main = async () => {

    // const task = await Task.findById('61275659f53aa827d03ab81f');
    // //populate the data from a relationship defiined in 'ref'
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    // const user = await User.findById('61274e3e5d56de37a8d96a00');
    // await user.populate('tasks').execPopulate();
    // console.log(user.tasks);
}

main();

//upload files
// const multer = require('multer');
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Please uplaod a Word document'));
//         }
//         cb(undefined, true);
//     }
// });

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
// })