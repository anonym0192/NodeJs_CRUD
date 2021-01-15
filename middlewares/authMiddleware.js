const User = require('../models/User');

exports.isUserLogged = (req, res, next)=>{
    if(!req.user){
        req.flash('error', 'Ops, you must be logged to access this page');
        res.redirect('/users/login');
        return;
    }
    next();
};

exports.passwordUpdate = (req, res)=>{

    if(req.body.pass !== req.body['pass-confirm']){
        req.flash('error', 'The password doesn\'t match');
        res.redirect('/users/edit');
    }

    req.user.setPassword(req.body.pass, async ()=>{

        await req.user.save();

        req.flash('success', 'The password was updated successfully');
        res.redirect('/');
    });



   
};