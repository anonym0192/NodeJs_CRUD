const helpers =  require('../helpers');

exports.index = (req, res, next)=>{

    res.locals.h = {...helpers};
    res.locals.flashes = req.flash();
    res.locals.user = req.user;

    //filter menu to logged user
    if(req.user){
        res.locals.h.menu = res.locals.h.menu.filter(i=>i.logged);
    //filter menu to guests
    }else{
        res.locals.h.menu = res.locals.h.menu.filter(i=>i.guest);
    }
    next();
}