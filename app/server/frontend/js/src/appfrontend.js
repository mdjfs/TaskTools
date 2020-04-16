
var dataprojects = {};

//load information of profile

function loadInfo(id, callback){

  var jsontasks = {};
  var comtask = new Communication("task");
  var comsubtask = new Communication("subtask");
  comtask.send("PUT", {"project_id": id}, function(response){
      var finalcount = Object.keys(response).length;
      var countready = 0;
      if (finalcount == 0)
        callback(jsontasks);
      for(var i=0; i<Object.keys(response).length;i++){
        comsubtask.send("PUT", {"task_id": response[i]["id_task"]}, function(res){
            var id = null;
            var jsonsubtasks = [];
            for(var i=0; i<Object.keys(res).length;i++){
              id = res[i]["id_task"];
              jsonsubtasks.push({"name_subtask": res[i]["name_subtask"], "description_subtask": res[i]["description_subtask"]})
            }
            if(id != null)
                jsontasks[id]["subtasks"] = jsonsubtasks; 

          
          countready++;
            
          if( countready == finalcount)
            callback(jsontasks);


        });
        jsontasks[response[i]["id_task"]] = {
          "id_task":response[i]["id_task"],
          "name_task":response[i]["name_task"],
          "description_task":response[i]["description_task"]
        }
    }
  });
}

function LoadProfile(){
  var com = new Communication("session");
  com.send("GET", null, function(response){
    document.getElementById("username").innerHTML = response["username"];
    document.getElementById("email").innerHTML = response["email"];
  });
}

function setBackground(src){
  var element = document.getElementsByTagName("html")[0];
  element.style.setProperty("--imagebackground", 'url("'+src+'")');
  element.style.setProperty("--colorbackground", "none");
}

function resetBackground(){
  var element = document.getElementsByTagName("html")[0];
  element.style.setProperty("--imagebackground", "var(--basecolor)");
  element.style.setProperty("--colorbackground", "none");
}

//themes

function setTheme(theme){
  var element = document.getElementsByTagName("html")[0];
  if(theme.includes("original")){
    document.cookie = "theme=original";
    element.style.setProperty("--basecolor", "#F4D3D3");
    element.style.setProperty("--constrastcolor", "white");
    element.style.setProperty("--twoconstrastcolor", "black");
  }
  if(theme.includes("dark")){
    document.cookie = "theme=dark";
    element.style.setProperty("--basecolor", "black");
    element.style.setProperty("--constrastcolor", "white");
    element.style.setProperty("--twoconstrastcolor", "rgba(5, 30, 255, 0.829)");
  }
  if(theme.includes("olive")){
    document.cookie = "theme=olive";
    element.style.setProperty("--basecolor", "rgba(132, 252, 182, 0.842)");
    element.style.setProperty("--constrastcolor", "rgba(58, 58, 58, 0.7)");
    element.style.setProperty("--twoconstrastcolor", "white");
  }
}


 // componentes

function Borderbutton(props){
  return <button id={props.id} className="borderbutton" onClick={props.onclick}>{props.innerHTML}</button>;
}

function Fillbutton(props){
  return <button id={props.id} className="fillbutton" onClick={props.onclick}>{props.innerHTML}</button>;
}

function Logo(props){
  return <div className="containerlogo" onClick={props.onclick}><img className="logo" src={props.src}/> <p className="textlogo">Task Tools</p></div>
}

function Form(props){
  const dataforms = props.forms;
  var renderforms = [];
  for(var i=0; i < Object.keys(dataforms).length; i++){
    var key = Object.keys(dataforms)[i];
    var json = dataforms[key];
    renderforms.push(<input name={json.name} type={json.type} key={i} onKeyUp={json.onkeyup} placeholder={json.placeholder}></input>);
    renderforms.push(<br key={i+Object.keys(dataforms).length}/>);
  }
  return (<div>
    {renderforms}</div>);
}

function DivTasks(props){
  var data = props.datajson;
  var rendertasks = [];
  var keystask = Object.keys(data);
  for(var i=0; i< keystask.length; i++){
    var task = data[keystask[i]];
    var rendersubtasks = [];
    var subtasks = task["subtasks"];
    const idtask = task["id_task"];
    if(subtasks != null){
      for(var j=0; j< subtasks.length; j++){
        rendersubtasks.push(<div className="subtask" key={i+j}>
          <div className="subtaskT">{subtasks[j]["name_subtask"]}</div>
          <div className="subtaskD">{subtasks[j]["description_subtask"]}</div>
          </div>)
      }
    }
    rendertasks.push(<div className="task" key={i}>
      <div className="taskT">{task["name_task"]}</div>
      <div className="taskD">{task["description_task"]}</div>
      {rendersubtasks}

      <div className="addsubtask" onClick={function(){
        props.addsubtask(idtask);
      }}>
        <span className="vert"></span>
      <span className="hor"></span>
      </div>
    </div>)
  }
  return (<div id="containertasks">{rendertasks}</div>);
}

function DivProject(props){
  const data = dataprojects;
  var renderdivs = [];
  for(var i=0; i < Object.keys(data).length; i++){
    var json = data[i];
    const id = json.id_project;
    renderdivs.push(<div onClick={function(){
      props.onClick(id);
    }} id={json.id_project} className="project" key={i}><div className="titleproject">{json.name_project}</div><div className="descriptionproject">{json.description_project}</div></div>);
  }
  return (<div>
    {renderdivs}</div>);
}

// componentes de componentes


function Toolbar(props){
  var buttons =props.buttons;
  var islogin = false;
  var isregister = false;
  for(var i=0; i<buttons.length;i++){
    if(buttons[i] == "signin"){
      islogin = true;
    }
    else if(buttons[i] == "signup"){
      isregister = true;
    }
  }
  return (<div className="toolbar">
            {islogin &&
            <Borderbutton id="bttnIN" innerHTML="Sign in" onclick={function(){
              Render("login", null);
            }}/> }
            {isregister &&
            <Fillbutton id="bttnUP" innerHTML="Sign up" onclick={function(){
            Render("register", null);}}/> }
            <Logo src="src/icon.svg" onclick={function(){
              Render("index", null);
            }}></Logo>
            </div>);
}

function Index(props){
  return (<div className="indexpage">
          <Toolbar buttons={["signin","signup"]}></Toolbar>
          <div className="img"></div>
          <div className="invitation">
              <div className="constrastpart"><p className="textconstrast">Quisque facilisis eu felis vel mattis. Pellentesque viverra iaculis lacinia. Vestibulum dapibus ligula eu dolor consequat accumsan. Etiam ut eleifend tortor. Nullam dapibus diam tempus, lacinia odio eget, pretium metus. Mauris molestie mattis ullamcorper. Donec ut finibus urna. Maecenas suscipit pharetra ultricies. Nunc egestas, dui et mollis fermentum, velit ligula hendrerit neque, in fringilla arcu lacus et velit. Mauris iaculis ex id consectetur pharetra. Phasellus semper tincidunt accumsan. Sed commodo mattis efficitur. </p></div>
              <div className="basecolorpart"><p className="textbasecolor">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in elementum libero, sed tempus lorem. Nulla nulla nibh, placerat et auctor in, rutrum sodales augue. Mauris bibendum vel sem nec interdum. Aliquam posuere justo vitae turpis varius vehicula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla vitae nunc sed mauris egestas aliquet vel ut odio. Donec eros tortor, venenatis aliquam felis in, laoreet sodales odio. Ut eu magna dignissim, posuere sapien ac, sagittis nisl. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus odio tortor, vulputate vitae ipsum a, sagittis aliquet augue. </p></div>
          </div>
          </div>);
}

function Login(props){
  function sendLogin(){
    const error = document.getElementById("error");
    error.hidden = true;
    const fields = document.getElementsByTagName("input");
    var json = {};
    for(var i=0; i<fields.length; i++){
      if(i==0)
        json["constraint"] = fields[i].value
      else
        json[fields[i].placeholder] = fields[i].value
    }
    var com = new Communication("login");
    com.send("POST", json, function(response){
        if(response["results"].includes("error")){
          error.innerHTML = response["message"];
          error.hidden = false;
        }
        else{
          window.location.reload();
        }
    });
  }
  function listenfield(event){
    if (event.keyCode === 13)
      sendLogin();
  }
  var forms = {"1":{
    "type":"text",
    "placeholder":"user or email",
    "onkeyup":listenfield
  },
  "2":{
    "type":"password",
    "placeholder":"password",
    "onkeyup":listenfield
  }};
  return (<div className="loginpage">
    <Toolbar buttons={["signup"]}></Toolbar>
    <div className="formbox">
      <Form forms={forms}></Form>
      Don't have account? Please <a className="href"onClick={function(){
        Render("register", null);
      }}>Sign Up</a><br/>
      <div id="error" className="errors" hidden>Esto es un error !!</div><br/>
      <Fillbutton id="actionbuttonIN" innerHTML="Sign in" onclick={sendLogin}/>
    </div>
  </div>);
}

function Register(props){
  function sendRegister(){
    const error =document.getElementById("error");
    error.hidden = true;
    const fields = document.getElementsByTagName("input");
    var json = {};
    for(var i=0; i<fields.length; i++){
      json[fields[i].placeholder] = fields[i].value
    }
    var com = new Communication("register");
    com.send("POST", json, function(response){
        if(response["results"].includes("error")){
          error.innerHTML = response["message"];
          error.hidden = false;
        }
        else{
          error.hidden = true;
          var jsonlogin={
            "constraint":fields[1].value,
            "password":fields[2].value
          }
          com = new Communication("login");
          com.send("POST", jsonlogin, function(response){
            if(response["results"].includes("error")){
              error.innerHTML = response["message"];
              error.hidden = false;
            }
            else{
              Render("dashboard",{"view":"start"});
            }
          });
        }
    });
  }
  function listenfield(event){
    if (event.keyCode === 13)
      sendRegister();
  }
  var forms = {"1":{
    "type":"text",
    "placeholder":"username",
    "onkeyup":listenfield
  },
  "2":{
    "type":"text",
    "placeholder":"email",
    "onkeyup":listenfield
  },
  "3":{
    "type":"password",
    "placeholder":"password",
    "onkeyup":listenfield
  }};
  return (<div className="registerpage">
    <Toolbar buttons={["signin"]}></Toolbar>
    <div className="formbox">
      <Form forms={forms}></Form>
      You have account? Please <a className="href"onClick={function(){
        Render("login", null);
      }}>Sign In</a><br/>
      <div id="error" className="errors" hidden>Esto es un error !!</div><br/>
      <Borderbutton id="actionbuttonUP" innerHTML="Sign up" onclick={sendRegister}/>
    </div>
  </div>);
}

function Start(props){
  const viewone = (<div>
    <div><Projects></Projects></div>
      <div class="darking"></div>
      <div>
      <div id="getstarted">
        <div id="onemessage">it is a table with your projects</div>
    <Borderbutton id="YEstart" onclick={function(){
      const message = document.getElementById("onemessage");
      const thisbutton = document.getElementById("YEstart");
      const pointer = document.getElementById("pointer");
      pointer.hidden = false;
      message.innerHTML = "click here to add a new project";
      thisbutton.onclick = function(){
        Render("dashboard", {"view":"projects"});
      }

    }} innerHTML="OK"></Borderbutton>
  </div>
      </div>
    </div>);
  const viewdefault = (<div id="getstarted">
    <div id="inicialmessage"></div>
    <Borderbutton id="YEstart" onclick={function(){
    var thisbutton = document.getElementById("YEstart");
    const otherbutton = document.getElementById("NOstart");
    const started = document.getElementById("getstarted");
    started.removeChild(thisbutton);
    started.removeChild(otherbutton);
    const pointer = document.getElementById("pointer");
    const message = document.getElementById("inicialmessage");
    message.innerHTML = "This is a section of your profile";
    pointer.hidden = false;
    pointer.setAttribute("class","pointerprofile");
    thisbutton = document.createElement("button");
    thisbutton.setAttribute('id', "YEstart");
    thisbutton.setAttribute('class', "borderbutton");
    thisbutton.innerHTML = "OK";
    thisbutton.onclick = function(){
      LoadProfile();
      document.getElementById("prof").hidden = false;
      message.innerHTML = "Click here to change color theme";
      pointer.setAttribute("class","pointertheme");
      thisbutton.onclick = function(){
        Render("dashboard", {"view": "start", "loop":"1"})
      }

    }
    started.appendChild(thisbutton);
    

  }} innerHTML="YES"></Borderbutton> <Fillbutton id="NOstart" onclick={function(){
    window.location.reload();
  }} innerHTML="NO"></Fillbutton>
  </div>);
  var com = new Communication("session");
  if(props.loop == null){
    com.send("GET", null, function(response){
      var user = response["username"];
      document.getElementById("inicialmessage").innerHTML = "Welcome "+user+", you want to get started?";
      document.getElementsByClassName("darking")[0].hidden = false;
    });
  }

  if(props.loop =="1"){
    com.send("GET", null, function(response){
      document.getElementsByClassName("darking")[0].hidden = false;
      const pointer = document.getElementById("pointer");
      pointer.setAttribute("class","pointerprojects");
    });
  }


  return(
    <div>
      <div id="pointer"  hidden></div>
    <div>
        {props.loop == null && viewdefault}
        {props.loop == "1" && viewone}

    </div>
    </div>);
}

function Tasks(props){
  var idtask = null;
  function addsubtask(id){
    idtask = id;
    document.getElementById("newsubtask").hidden = ! document.getElementById("newsubtask").hidden;
  }
  function sendsubtask(){
    if(idtask != null){
      var element = document.getElementById("errorsubtask");
      element.hidden = true;
      var com = new Communication("subtask");
      var json = {
        "name":document.getElementsByName("namesub")[0].value,
        "description":document.getElementsByName("descsub")[0].value,
        "task_id":idtask
      }
      com.send("POST",json, function(response){
        if(response["status"] == "200"){
          loadInfo(props.id_project, function(json){
            Render("dashboard", {"view":"tasks","id_project":props.id_project, "datajson":json});
          });
        }
        else{
          element.hidden = false;
          element.innerHTML = response["message"];
        }
      });
    }
  }
  function sendTask(){
    var element = document.getElementById("errortask");
    element.hidden = true;
    var com = new Communication("task");
    var json = {
      "name":document.getElementsByName("name")[0].value,
      "description":document.getElementsByName("desc")[0].value,
      "project_id":props.id_project
    }
    com.send("POST",json, function(response){
      if(response["status"] == "200"){
        loadInfo(props.id_project, function(json){
          Render("dashboard", {"view":"tasks","id_project":props.id_project, "datajson":json});
        });
      }
      else{
        element.hidden = false;
        element.innerHTML = response["message"];
      }
    });
  }
  function listenfieldsub(event){
    if (event.keyCode === 13)
      sendsubtask();
  }
  function listenfield(event){
    if (event.keyCode === 13)
      sendTask();
  }

  var formssubtask = {"1":{
    "type":"text",
    "placeholder":"Subask Name",
    "name":"namesub",
    "onkeyup":listenfieldsub
  },
  "2":{
    "type":"text",
    "placeholder":"Description",
    "name":"descsub",
    "onkeyup":listenfieldsub
  }};
  var formstask = {"1":{
    "type":"text",
    "placeholder":"Task Name",
    "name":"name",
    "onkeyup":listenfield
  },
  "2":{
    "type":"text",
    "placeholder":"Description",
    "name":"desc",
    "onkeyup":listenfield
  }};
  function loadtitle(){
    var com = new Communication("project");
    com.send("GET", null, function(response){
      for(var i=0; i<Object.keys(response).length;i++){
        if(response[i]["id_project"]==props.id_project){
          document.getElementById("titleproject").innerHTML = response[i]["name_project"];
          document.getElementById("descriptionproject").innerHTML = response[i]["description_project"];
        }
      }
    });
  }
  function getBackground(){
    var com = new Communication("background/?id="+props.id_project);
    com.send("GET", null, function(response){
      if(response == null){
        setBackground(window.location.href + "background/?id="+props.id_project);
      }
      else{
        if(response["status"] == "200"){
          setBackground(response["message"]);
        }
      }
    });
  }
  function sendBackground(){
    var error = document.getElementById("error");
    error.hidden = true;
    var com = new Communication("background");
    var file = document.getElementsByName("project_id:"+props.id_project)[0];
    if(file.files.length == 0){
      var URL = document.getElementsByName("URL")[0];
      var json = {"url": URL.value, "id":props.id_project};
      com.send("POST", json, function(response){
        if(response["status"] == 200){
          getBackground();
        }
        else{
          error.hidden = false;
          error.innerHTML = response["message"];
        }
      });

    }
    else{
      file = file.files[0];
      com.sendFile("POST", "project_id:"+props.id_project, file, function(response){
        if(response["status"] == 200){
          getBackground();
        }
        else{
          error.hidden = false;
          error.innerHTML = response["message"];
        }
      });
    }
  }
  var forms = {"0":{
    "type":"file",
    "name":"project_id:"+props.id_project
  },
  "1":{
    "name":"URL",
    "type":"text",
    "placeholder":"or insert a image URL",
    "onkeyup":sendBackground
  }}
  getBackground();
  loadtitle();
    return(<div id="taskscontainer">

      <div id="addtask" onClick={function(){
        var newtask = document.getElementsByClassName("new")[0];
        newtask.hidden = ! newtask.hidden;
      }}>
              <span className="vert"></span>
      <span className="hor"></span>
      </div>
      <DivTasks addsubtask={addsubtask} datajson={props.datajson}></DivTasks>
      <div id="newtask" className="new" hidden><div id="exittask" className="exit" onClick={function(){
        document.getElementById("newtask").hidden = true
      }}>
      <span className="diag1"></span>
        <span className="diag2"></span></div>
        <Form forms={formstask}></Form>

        <div id="errorsubtask" className="errors" hidden>Esto es un error !!</div>
        <Borderbutton id="save" innerHTML="SAVE" onclick={sendTask}></Borderbutton>
        </div>
  <div id="newproject" hidden><div id="exit" onClick={function(){
          document.getElementById("newproject").hidden = true;
        }}><span className="diag1"></span>
        <span className="diag2"></span></div>
        <h6>Add a background image</h6>
        <Form forms={forms}></Form>
        <div id="error" className="errors" hidden>Esto es un error !!</div><br/>
        <Borderbutton  id="sendbackground" onclick={sendBackground} innerHTML="send"></Borderbutton></div>
    <div className="taskbar">
      <text id="titleproject"></text>
      <text id="descriptionproject"></text>
      <div className="setbackground" onClick={function(){
        document.getElementById("newproject").hidden = !document.getElementById("newproject").hidden;
      }}><p>Set a background image</p><div></div></div>
    </div>

    <div id="newsubtask" className="new" hidden><div className="exit" onClick={function(){
      document.getElementById("newsubtask").hidden = true;
    }}><span className="diag1"></span>
        <span className="diag2"></span></div>
        <Form forms={formssubtask}></Form>
        <div id="errortask" className="errors" hidden>Esto es un error !!</div>
        <Borderbutton  id="subtask" onclick={sendsubtask} innerHTML="save"></Borderbutton></div>
  </div>)
}

function Projects(props){
  function displayproject(element){
    loadInfo(element, function(json){
      console.log(json);
      Render("dashboard", {"view":"tasks", "id_project": element, "datajson": json});
    });
  }
  function sendProject(){
    console.log("hola");
    var com = new Communication("project");
    const fields = document.getElementsByTagName("input");
    var json = {};
    for(var i=0; i<fields.length; i++){
      json[fields[i].placeholder] = fields[i].value;
    }
    console.log(json);
    com.send("POST", json, function(response){
      console.log(response);
      window.location.reload();
    });
  }
  function listenfield(event){
    if (event.keyCode === 13)
      sendProject();
  }
  var forms = {"1":{
    "type":"text",
    "placeholder":"name",
    "onkeyup":listenfield
  },
  "2":{
    "type":"text",
    "placeholder":"description",
    "onkeyup":listenfield
  }};
  var com = new Communication("session");
  com.send("GET", null, function(response){
    var user = response["username"];
    document.getElementById("welcome").innerHTML = "Welcome, "+user+"!";
  });
  return (<div>
      <div id="projectscontainer">
    <div id="welcome"></div>
    <div id="myprojects">
      <h6 id="titlecontainer" className="titleprojects">My Projects</h6>
      <DivProject onClick={displayproject}></DivProject>
      <div id="addproject" onClick={function(){
        var newproject = document.getElementById("newproject");
        newproject.hidden = ! newproject.hidden;
      }}>
      <span className="vert"></span>
      <span className="hor"></span>
      </div>
      </div></div>

      <div id="newproject" hidden><h6> Create new project</h6>
        <div id="exit" onClick={function(){
          document.getElementById("newproject").hidden = true;
        }}><span className="diag1"></span>
      <span className="diag2"></span></div>
      <Form forms={forms}></Form>
      <Fillbutton id="createproject" innerHTML="Create" onclick={sendProject}/></div>
    </div>);
}

function Dashboard(props){
  return (<div className="dashboardpage">
    {props.view["view"].includes("projects") && <Projects/>}
    {props.view["view"].includes("tasks") && <Tasks id_project={props.view["id_project"]} datajson={props.view["datajson"]}/>}
    <div className="aboutme" onClick={function(){
      var profile = document.getElementById("prof");
      profile.hidden = ! profile.hidden;
      if(! profile.hidden){
        LoadProfile();
      } 
    }}>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div id="prof" className="myprofile" hidden>
      <div className="profileinfo"><p id="username"></p><p id="email"></p></div>
      <div className="profileactions">
        <button className="toolbutton" onClick={function(){
          var com = new Communication("session");
          com.send("DELETE", null, function(response){
            setTheme("original");
            window.location.reload();
          });
        }}>Logout</button><br/>
        {props.view["view"].includes("tasks") && <button className="toolbutton" onClick={function(){
          window.location.reload();
        }}>Dashboard</button>}
      </div>
      <div className="themes">
        Themes<br/>
        <div id="theme1" title="original theme" onClick={function(){
          setTheme("original");
        }}></div>
        <div id="theme2" title="dark theme" onClick={function(){
          setTheme("dark");
        }}></div>
        <div id="theme3" title="olive theme" onClick={function(){
          setTheme("olive");
        }}></div>
      </div>
    </div>

    <div className="darking" hidden></div>
    {props.view["view"].includes("start") && <Start loop={props.view["loop"]}/>}
  </div>);
}

function Render(page, jsonprops){
  var root = document.getElementById("root");
  if(document.getElementById("rootchild") != null){
    root.removeChild(document.getElementById("rootchild"));
  }
  var element = document.createElement("div");
  element.setAttribute('id', "rootchild");
  root.appendChild(element);
  var reactContainer = document.getElementById("rootchild");
  if(page == "index"){
    ReactDOM.render(
      <Index/>,
      reactContainer
    );
  }
  if(page == "login"){
    ReactDOM.render(
      <Login/>,
      reactContainer
    );
  }
  if(page == "register"){
    ReactDOM.render(
      <Register/>,
      reactContainer
    );
  } 
  if(page == "dashboard" && jsonprops != null){
    ReactDOM.render(
      <Dashboard view={jsonprops}/>,
      reactContainer
    );
  }
}

window.onload = function(){
  var com = new Communication("session");
  com.send("GET", null, function(response){
    if(Object.entries(response).length === 0){
      Render("index", null);
    }
    else{
      var firstcookie = document.cookie.split(";")[0];
      var theme = null;
      if(firstcookie != null){
        if(firstcookie.split("=")[0].includes("theme")){
          theme = firstcookie.split("=")[1];
        }
      }
      if(theme !=null)
        setTheme(theme);
      com = new Communication("project");
      com.send("GET", null, function(response){
        dataprojects = response;
        Render("dashboard", {"view":"projects"});
      });
    }
  });
}