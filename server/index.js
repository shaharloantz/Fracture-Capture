
const express = require('express')

const dotenv = require('dotenv').config()
const cors  = require('cors')
const {mongoose} = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Database is connected... (:'))
.catch((err)=>console.log('Database not connected... :(',err))

const app = express();

// middleware
app.use(express.json())

app.use('/',require('./routes/authRoutes'))
// exporting here to entry level - app with app.use

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
