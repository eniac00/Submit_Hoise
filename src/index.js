const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const port = process.env.PORT || 3000;
const router = require("./routers/login");
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('../server/database/connection');
const fetch_google = require('./modules/fetch_google');
const credentials = require('../server/model/credentials');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public/")));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views/'));
hbs.registerPartials(path.join(__dirname, "../templates/partials/"));
const oneHour = 1000*60*60;
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60 }
}));

connectDB();

app.use('/login', router);

app.get('/', (req, res)=>{
    res.render('base');
});

app.post('/submit-form', async (req, res)=>{
    const faculty_init = req.body.faculty_init.toUpperCase();
    const course_name = req.body.course_name.toUpperCase();
    const file_name = req.body.file_name;

    try{
        const infos = await credentials.findOne({initial: faculty_init, course_id: course_name});

        if(infos){
            try{
                await fetch_google(infos.client_id, infos.client_secret, infos.redirect_uri, infos.refresh_token, infos.folder)
                    .then((result)=>{
                        const found = result.find(({name})=>name===file_name);
                        if(found){
                            res.render('success', {
                                faculty_init,
                                file_name
                            });
                        }else{
                            res.render("not_found", {
                                faculty_init,
                                file_name
                            });
                        }
                    });
            }catch(err){
                console.log(err);
                console.log("the error");
            }
        }else{
            res.render('wrong', {
                faculty_init,
                course_name
            });
        }
    }catch(err){
        res.render("404");
    }
});

app.get("*", (req, res)=>{
    res.render("404");
});


app.listen(port);
