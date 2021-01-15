
const User = require('../models/User');
const crypto = require('crypto');
const emailHandler = require('../handlers/emailHandler');

exports.edit = (req, res) => {  
    res.render('profile');
};

exports.editAction = async (req, res) => {

    await User.findByIdAndUpdate(
        {_id: req.user._id},
        {name: req.body.name, email: req.body.email },
        {new: true, runValidators: true}
        ,
        (error, result)=>{

            if(error){
                console.error(error);
                req.flash('error', 'There was an error in the process, please try again later');
                res.redirect('/users/edit');
                return;
            }

            req.flash('success', 'The data was updated successfully');
            res.redirect('/');
        });
};

exports.forgetPassword = (req, res)=>{
    res.render('forget');
}

exports.forgetPasswordAction = async (req, res)=>{

    const user = await User.findOne({email: req.body.email});

    if(!user){
        req.flash('error', 'The informed e-mail address is not registered');
        res.redirect('/users/forget');
        return;
    }
    user.resetPasswordToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour;

    await user.save();

    const passwordChangeLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;

    const options = {
        to: user.email,
        subject: 'Password change request',
        html: `Click the link the redefine your password <a href="${passwordChangeLink}">Change Password</a>`,
        text: `Open the link to change your password ${passwordChangeLink}`
        };

    const result = await emailHandler.sendMail(options);

    if(!result){
        req.flash('error', 'An error ocurred, please try again later. ');
    }else{
        req.flash('success', 'The e-mail was sent to you for password redefinition! ');
    }

    res.redirect('/users/forget');
}

exports.resetPassword = async (req, res)=>{

    const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: {$gt: Date.now()}
            });
    if(!user){
        req.flash('error', 'The token is not valid or is already expired!');
        res.redirect('/users/forget');
        return;
    }
    res.render('resetPassword');
};

exports.resetPasswordAction = async (req, res)=>{

    const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: {$gt: Date.now()}
        });

    if(!user){
        req.flash('error', 'The token is not valid or is already expired!');
        res.redirect('/users/forget');
        return;
    }

    if(req.body.pass !== req.body['pass-confirm']){
        req.flash('error', 'The 2 passwords did not match!');
        res.redirect('back');
        return;
    }

    user.setPassword(req.body.pass, async ()=>{
        
        await user.save();
        req.flash('success', 'Your password was updated successfully!');
        res.redirect('/');
    });
    
};