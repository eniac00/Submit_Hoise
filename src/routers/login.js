const express = require('express');
const router = express.Router();
const credentials = require('../../server/model/credentials');


router.get('/', (req, res)=>{
    res.render('login');
});


router.post('/login-form', async (req,res)=>{

    try{
        const result = await credentials.findOne({username: req.body.email});

        if(req.body.email===result.username && req.body.password===result.password){
            req.session.user = result._id;
            res.redirect('/login/dashboard');
        }else{
            res.render('login', {wrong: true});
        }
    }catch(err){
        res.render('login', {wrong: true});
    }

});

router.get('/dashboard', async (req, res)=>{
    try{
        if(req.session.user){
            var infos = await credentials.findOne({_id: req.session.user})
            res.render('dashboard', {
                title: infos.username, 
                email: infos.username, 
                username: infos.username,
                password: infos.password,
                client_id: infos.client_id,
                client_secret: infos.client_secret,
                redirect_uri: infos.redirect_uri,
                refresh_token: infos.refresh_token,
                initial: infos.initial,
                course_id: infos.course_id,
                folder: infos.folder
            });
        }else{
            res.render('404');
        }
    }catch(err){
        res.render('404');
    }
});

router.post('/dashboard-form', async (req, res)=>{
    try{
        await credentials.updateOne({_id: req.session.user},{
            $set : {
                username: req.body.username,
                password: req.body.password,
                client_id: req.body.client_id,
                client_secret: req.body.client_secret,
                redirect_uri: req.body.redirect_uri,
                refresh_token: req.body.refresh_token,
                initial: req.body.initial,
                course_id: req.body.course_id,
                folder: req.body.folder
            }
        });
        res.redirect('/login/dashboard');
    }catch(err){
        res.render('404');
    }
});

router.get('/logout', (req, res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }else{
            res.render('login', {logout: true});
        }
    });
});


module.exports = router;




