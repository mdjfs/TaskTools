const fs = require('fs');
const hash = require('./hashing');
const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'app',
  password: 'postgres',
  port: 5432,
});
var querys = null;
var dirs = null;
const mkdirp = require('mkdirp');
var MimeLookup = require('mime-lookup');
var mime = new MimeLookup(require('mime-db'));

function SuccessMessage(message){
    return {"results":"success",
    "status":"200",
    "message":message
    }
}

function ErrorMessage(message){
    return {"results":"error",
    "status":"500",
    "message":message
    }
}

function isAllKeys(keys, json){
    for(var i=0; i<keys.length ; i++){
        if(! json.hasOwnProperty(keys[i])){
            return false;
        }
    }
    return true;
}

function loadDirs(){
    if(dirs == null){
        try{
            var file = fs.readFileSync('./configuration/dirs.json')
            dirs = JSON.parse(file);
        }
        catch(err){
            console.log(err);
            return ErrorMessage(err);
        }
    }
    return null;
}

function loadQuerys(){
    if(querys == null){
        try{
            var file = fs.readFileSync('./configuration/querys.json')
            querys = JSON.parse(file);
        }
        catch(err){
            console.log(err);
            return ErrorMessage(err);
        }
    }
    return null;
}

function validarEmail(valor) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(valor); 
}

function validarUsername(valor){
    return /^[a-z0-9_-]{3,16}$/.test(valor);
}
  

async function Register(json, keys){
    var error = loadQuerys();
    if(error != null)
        return error;
    let date = new Date();
    var dateString = date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
    dateString += " - "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    if(isAllKeys(keys, json)){
        if(validarEmail(json[keys[1]])){
            if(validarUsername(json[keys[0]])){
                const connection = await pool.connect();
                try{
                    await connection.query(querys["insert.users"], 
                    [json[keys[0]], json[keys[1]], hash.sha256(json[keys[2]]), dateString]);
                    return SuccessMessage("You're registered.");
                }
                catch(err){
                    if(err.message.includes("llave duplicada")){
                        if(err.message.includes("email")){
                            return ErrorMessage("Email already exists");
                        }
                        return ErrorMessage("User already exists");
                    }
                    return ErrorMessage(err.message);
                }
                finally{
                    connection.release();
                }
            }
            else{
                return ErrorMessage("Verify your username");
            }
        }
        else{
            return ErrorMessage("Verify your email");
        }

    }
    else{
        return ErrorMessage("Fails this keys:" + keys.toString());
    }
}

async function Login(json, keys){
    var error = loadQuerys();
    if(error != null)
        return error;
    if(isAllKeys(keys, json)){
        const connection = await pool.connect();
        try{
            if(validarEmail(json[keys[0]])){
                const connection = await pool.connect();
                try{
                    result = await connection.query(querys["select.users.where.email"], 
                    [json[keys[0]]]);
                    result = result.rows[0];
                    if(hash.sha256(json[keys[1]]).trim() === result["password_users"].trim() ){
                        info = {
                            "username": result["username_users"],
                            "ID": result["id_users"],
                            "email": result["email_users"]
                        }
                        return SuccessMessage({"message":"You're login", "info": info});
                    }
                    else{
                        return ErrorMessage("Wrong password !!");
                    }
                }
                catch(err){
                    if(err.name.includes("TypeError")){
                        return ErrorMessage("User not exists");
                    }
                    return ErrorMessage(err.message);
                }
                finally{
                    connection.release();
                }
            }
            else if(validarUsername(json[keys[0]])){
                const connection = await pool.connect();
                try{
                    result = await connection.query(querys["select.users.where.username"], 
                    [json[keys[0]]]);
                    result = result.rows[0];
                    if(hash.sha256(json[keys[1]]).trim() === result["password_users"].trim()){
                        var userinfo = {
                            "id": result["id_users"],
                            "username": result["username_users"],
                            "email": result["email_users"]
                        }
                        return SuccessMessage({"message":"You're login", "info": userinfo});
                    }
                    else{
                        return ErrorMessage("Wrong password !!");
                    }
                }
                catch(err){
                    if(err.name.includes("TypeError")){
                        return ErrorMessage("User not exists");
                    }
                    return ErrorMessage(err.message);
                }
                finally{
                    connection.release();
                }
            }
            else{
                return ErrorMessage("Check your constraint");
            }
        }
        catch(err){
            return ErrorMessage(err.message);
         }
         finally{
             connection.release();
         }
    }
    else{
        return ErrorMessage("Fails this keys:" + keys.toString());
    }
}

function newProject(session, json, keys, callback){
    if(session != null){
        if(isAllKeys(keys, json)){
            pool
            .query(querys["insert.project"], [json[keys[0]], json[keys[1]], session["id"]])
            .then(res => callback(SuccessMessage("Project " + json[keys[0]] + " is save"))) 
            .catch(err => console.error('Error executing query', err.stack));
        }
        else{
            callback( ErrorMessage("Fails this keys:" + keys.toString()));
        }
    }
    else{
        callback(ErrorMessage("You not have session !"));
    }
}

function getProject(session, callback){
    if(session != null){
        pool
        .query(querys["select.project.where.id_users"], [session["id"]])
        .then(res => {
            json = {};
            for(var i=0; i<res.rows.length; i++){
                json[i] = res.rows[i];
            }
            callback(json);
        }) 
        .catch(err => {callback(ErrorMessage(err.message))});
    }
    else{
        callback(ErrorMessage("You not have session !"));
    }
}

function newTask(session, json, keys, callback){
    if(session != null){
        if(isAllKeys(keys, json)){
            pool
            .query(querys["insert.task"], [json[keys[0]],json[keys[1]],json[keys[2]]])
            .then(res => {
                callback(SuccessMessage("Task " + json[keys[0]] + " is save"));
            }) 
            .catch(err => {callback(ErrorMessage(err.message))});   
        }
        else{
            callback( ErrorMessage("Fails this keys:" + keys.toString()));
        }
    }
    else{
        callback(ErrorMessage("You not have session !"));
    }
}

function getTask(session, json, keys, callback){
    if(session != null){
        if(isAllKeys(keys, json)){
            pool
            .query(querys["select.task.where.id_project"], [json[keys[0]]])
            .then(res => {
                json = {};
                for(var i=0; i<res.rows.length; i++){
                    json[i] = res.rows[i];
                }
                callback(json);
            }) 
            .catch(err => {callback(ErrorMessage(err.message))});
        }
        else{
            callback( ErrorMessage("Fails this keys:" + keys.toString()));
        }

    }
    else{
        callback(ErrorMessage("You not have session !"));
    }
}

function newsubTask(session, json, keys, callback){
    if(session != null){
        if(isAllKeys(keys, json)){
            pool
            .query(querys["insert.subtask"], [json[keys[0]],json[keys[1]],json[keys[2]]])
            .then(res => {
                callback(SuccessMessage("Task " + json[keys[0]] + " is save"));
            }) 
            .catch(err => {callback(ErrorMessage(err.message))});   
        }
        else{
            callback( ErrorMessage("Fails this keys:" + keys.toString()));
        }
    }
    else{
        callback(ErrorMessage("You not have session !"));
    }
}

function getsubTask(session, json, keys, callback){
    if(session != null){
        if(isAllKeys(keys, json)){
            pool
            .query(querys["select.subtask.where.id_task"], [json[keys[0]]])
            .then(res => {
                json = {};
                for(var i=0; i<res.rows.length; i++){
                    json[i] = res.rows[i];
                }
                callback(json);
            }) 
            .catch(err => {callback(ErrorMessage(err.message))});
        }
        else{
            callback( ErrorMessage("Fails this keys:" + keys.toString()));
        }

    }
    else{
        callback(ErrorMessage("You not have session !"));
    }
}

function getBackground(session, callback, id){
    var error = loadDirs();

    if(error != null)
        callback(error, "application/json");
    if(session != null){
        pool
        .query(querys["select.backgrounds.where.id_project"], [id])
        .then(res => {
            if(res.rows.length != 0){
                var id_user = res.rows[0]["id_users"];
                if(id_user == session["id"]){
                    var src = res.rows[0]["dir"];
                    if(src.includes("http")){
                        callback(SuccessMessage(src), "application/json")
                    }
                    else{
                        const dir = dirs["usersources"] + src;
                        fs.readFile(dir, function(err, data){
                            if(err){
                                callback(ErrorMessage(err.message), "application/json");
                            }
                            else{
                                callback(data, mime.lookup(dir));
                            }
                        });
                    }

                }
                else{
                    callback(ErrorMessage("hehee !! no hacks !! ", "application/json"));
                }

            }
            else{
                callback(ErrorMessage("You don't have a background"), "application/json");
            }
        }) 
        .catch(err => { callback(ErrorMessage(err.message), "application/json");});
    }
    else{
        callback(ErrorMessage("You not have session !"), "application/json");
    }
}

function uploadBackground(session, parameter, callback){
    var error = loadDirs();
    if(error != null)
        callback(error);
    function LoadDB(path, callbackto, id){
        pool
        .query(querys["insert.backgrounds"], [path, session["id"], id])
        .then(res => {callbackto()}) 
        .catch(err => {
            if (err.message.includes("llave duplicada"))
                callback(ErrorMessage("You already have a background !!! "));
            else
                callback(ErrorMessage(err.message));
            });
    }
    if(session != null){
        if(parameter.url != null && parameter.id != null){
            LoadDB(parameter.url, function(){
                callback(SuccessMessage("Your file is upload"))
            },parameter.id);
        }
        else{
            if(parameter == null)
                callback(ErrorMessage("no files!"));
            else
            {
                var id = null;
                var keyid = null;
                var keys = Object.keys(parameter);
                for(var i=0; i<keys.length ; i++){
                    if(keys[i].includes("project_id:")){
                        id = keys[i].split(":")[1];
                        keyid = keys[i];
                    }
                }
                if(keyid != null && id != null){
                    parameter = parameter[keyid];
                    const dir = dirs["usersources"] + session["username"] + "/" + id + "/";
                    function upload(){
                        parameter.mv(dir + parameter.name , function(err){
                            if(err)
                                callback(ErrorMessage(err.message));
                            else
                                callback(SuccessMessage("Your file is upload"));
                        });
                    }
                    mkdirp(dir)
                    .then(made =>{LoadDB(session["username"] + "/" + id + "/" + parameter.name , upload, id)})
                    .catch(error =>{LoadDB(session["username"] + "/" + id + "/"+ parameter.name , upload, id)});
                }
                else{
                    callback(ErrorMessage("no project id !"));
                }

            }
        }
    }
    else{
        callback(ErrorMessage("You not have session !"));
    }
}

module.exports = {
    register: Register,
    login: Login,
    newproject: newProject,
    getproject: getProject,
    newtask: newTask,
    gettask: getTask,
    newsubtask: newsubTask,
    getsubtask: getsubTask,
    uploadbackground: uploadBackground,
    getbackground: getBackground
};