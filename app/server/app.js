const SECRET_KEY = " Secret key DON'T HACK PLEASE !!!!! "

var express = require('express');
var session = require('express-session');

const app = express();
const routes = express.Router();
const appsystem = require('./appsystem');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(fileUpload());
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

routes.get('/session', (req, res) => {
    res.setHeader('content-type','application/json');
    if(req.session.user != null)
        res.send(req.session.user);
    else
        res.send({});
});

routes.delete('/session',(req, res) =>{
    req.session.user = null;
    res.end();
});

routes.post('/project', (req, res) => {
    res.setHeader('content-type','application/json');
    var keys= ["name", "description"];
    appsystem.newproject(req.session.user, req.body, keys, function(data){
        res.send(data);
    });
});

routes.get('/project', (req, res) => {
    res.setHeader('content-type','application/json');
    appsystem.getproject(req.session.user, function(data){
        res.send(data);
    });
});

routes.post('/task', (req, res) => {
    res.setHeader('content-type','application/json');
    var keys= ["name", "description", "project_id"];
    appsystem.newtask(req.session.user, req.body, keys, function(data){
        res.send(data);
    });
});

routes.put('/task', (req, res) => {
    res.setHeader('content-type','application/json');
    var keys= ["project_id"];
    appsystem.gettask(req.session.user, req.body, keys, function(data){
        res.send(data);
    });
});

routes.post('/subtask', (req, res) => {
    res.setHeader('content-type','application/json');
    var keys= ["name", "description", "task_id"];
    appsystem.newsubtask(req.session.user, req.body, keys, function(data){
        res.send(data);
    });
});

routes.put('/subtask', (req, res) => {
    res.setHeader('content-type','application/json');
    var keys= ["task_id"];
    console.log(req.body);
    appsystem.getsubtask(req.session.user, req.body, keys, function(data){
        res.send(data);
    });
});

routes.post('/background', (req, res) => {
    res.setHeader('content-type','application/json');
    if(req.files == null){
        appsystem.uploadbackground(req.session.user, req.body, function(data){
            res.send(data);
        });

    }
    else{

        appsystem.uploadbackground(req.session.user, req.files, function(data){
            res.send(data);
        });
    }
});


routes.get('/background', (req, res) => {
    var id = req.query.id;
    appsystem.getbackground(req.session.user, function(data, mimetype){
        res.setHeader('content-type', mimetype);
        res.send(data);
    }, id);
});

app.use('/', routes);

app.listen(3000, function(){
    console.log('Listening....')
});