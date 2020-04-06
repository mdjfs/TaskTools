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
                        return SuccessMessage({"message":"You're login", "ID": result["id_users"]});
                    }
                    else{
                        return ErrorMessage("Wrong password !!");
                    }
                }
                catch(err){
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
                            "user": result["username_users"],
                            "email": result["email_users"]
                        }
                        return SuccessMessage({"message":"You're login", "info": userinfo});
                    }
                    else{
                        return ErrorMessage("Wrong password !!");
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

module.exports = {
    register: Register,
    login: Login
};