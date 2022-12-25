const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        
        mongoose.connect( 'mongodb://localhost:27017/storybooks', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => {
                console.log('MongoDB connected');
            });

    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;