const SECRET_KEY = " Secret key DON'T HACK PLEASE !!!!! "

var express = require('express');
var session = require('express-session');

const app = express();
const routes = express.Router();
const appsystem = require('./appsystem')
const bodyParser = require('body-parser');

app.use(session({secret: SECRET_KEY,saveUninitialized: true,resave: true}));
app.use(bodyParser.json('application/json'));      
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', express.static(__dirname + '/frontend'));

routes.post('/register', async (req, res) => {
    res.setHeader('content-type','application/json');
    var keys= ["username", "email", "password"];
    res.send(await appsystem.register(req.body, keys));
    });

routes.post('/login', async (req, res) => {
    res.setHeader('content-type','application/json');
    var keys= ["constraint", "password"];
    var result = await appsystem.login(req.body, keys);
    if(result["status"] == "200"){
        var message = result["message"];
        req.session.user = message["info"];
        result["message"] = message["message"];
        res.send(result);
    }
    else{
        res.send(result);
    }
    });



app.use('/', routes);

app.listen(3000, function(){
    console.log('Listening....')
});