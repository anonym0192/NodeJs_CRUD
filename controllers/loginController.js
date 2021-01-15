const User = require('../models/User');

exports.login = (req, res) => {
    res.render('login');
};

exports.loginAction = (req, res ) => {

    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, user)=>{
        if(!user){
            req.flash('error', 'The username/password are incorrect');
            res.redirect('/users/login');
        }
            req.login(user, ()=>{});
            req.flash('success', 'You were logged successfully!');
            res.redirect('/');
    });
}

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');

};

exports.register = (req, res) => {
    res.render('register');
};

exports.registerAction = (req, res) => {

    //res.json(req.body);
    const newUser = new User(req.body);

    User.register(newUser, req.body.pass, (error) => {
        if(error){
            req.flash('error', 'There was a problem in registering, please try again later');
            res.redirect('/users/register');
            return;
        }
        req.flash('success', 'The user was registered successfully');
        res.redirect('/');
    });
};