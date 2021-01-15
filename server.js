const mongoose = require('mongoose');

require("dotenv").config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
});

mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error) => {
    console.error("ERROR: "+error.message);
});

require('./models/Post');
const app = require('./app');
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
    console.log('This server is running on port: '+app.get('port'));
});