
var dataprojects = {};

//load information of profile

function loadInfo(id, callback) {

  var jsontasks = {};
  var comtask = new Communication("task");
  var comsubtask = new Communication("subtask");
  comtask.send("PUT", { "project_id": id }, function (response) {
    var finalcount = Object.keys(response).length;
    var countready = 0;
    if (finalcount == 0) callback(jsontasks);
    for (var i = 0; i < Object.keys(response).length; i++) {
      comsubtask.send("PUT", { "task_id": response[i]["id_task"] }, function (res) {
        var id = null;
        var jsonsubtasks = [];
        for (var i = 0; i < Object.keys(res).length; i++) {
          id = res[i]["id_task"];
          jsonsubtasks.push({ "name_subtask": res[i]["name_subtask"], "description_subtask": res[i]["description_subtask"] });
        }
        if (id != null) jsontasks[id]["subtasks"] = jsonsubtasks;

        countready++;

        if (countready == finalcount) callback(jsontasks);
      });
      jsontasks[response[i]["id_task"]] = {
        "id_task": response[i]["id_task"],
        "name_task": response[i]["name_task"],
        "description_task": response[i]["description_task"]
      };
    }
  });
}

function LoadProfile() {
  var com = new Communication("session");
  com.send("GET", null, function (response) {
    document.getElementById("username").innerHTML = response["username"];
    document.getElementById("email").innerHTML = response["email"];
  });
}

function setBackground(src) {
  var element = document.getElementsByTagName("html")[0];
  element.style.setProperty("--imagebackground", 'url("' + src + '")');
  element.style.setProperty("--colorbackground", "none");
}

function resetBackground() {
  var element = document.getElementsByTagName("html")[0];
  element.style.setProperty("--imagebackground", "var(--basecolor)");
  element.style.setProperty("--colorbackground", "none");
}

//themes

function setTheme(theme) {
  var element = document.getElementsByTagName("html")[0];
  if (theme.includes("original")) {
    document.cookie = "theme=original";
    element.style.setProperty("--basecolor", "#F4D3D3");
    element.style.setProperty("--constrastcolor", "white");
    element.style.setProperty("--twoconstrastcolor", "black");
  }
  if (theme.includes("dark")) {
    document.cookie = "theme=dark";
    element.style.setProperty("--basecolor", "black");
    element.style.setProperty("--constrastcolor", "white");
    element.style.setProperty("--twoconstrastcolor", "rgba(5, 30, 255, 0.829)");
  }
  if (theme.includes("olive")) {
    document.cookie = "theme=olive";
    element.style.setProperty("--basecolor", "rgba(132, 252, 182, 0.842)");
    element.style.setProperty("--constrastcolor", "rgba(58, 58, 58, 0.7)");
    element.style.setProperty("--twoconstrastcolor", "white");
  }
}

// componentes

function Borderbutton(props) {
  return React.createElement(
    "button",
    { id: props.id, className: "borderbutton", onClick: props.onclick },
    props.innerHTML
  );
}

function Fillbutton(props) {
  return React.createElement(
    "button",
    { id: props.id, className: "fillbutton", onClick: props.onclick },
    props.innerHTML
  );
}

function Logo(props) {
  return React.createElement(
    "div",
    { className: "containerlogo", onClick: props.onclick },
    React.createElement("img", { className: "logo", src: props.src }),
    " ",
    React.createElement(
      "p",
      { className: "textlogo" },
      "Task Tools"
    )
  );
}

function Form(props) {
  var dataforms = props.forms;
  var renderforms = [];
  for (var i = 0; i < Object.keys(dataforms).length; i++) {
    var key = Object.keys(dataforms)[i];
    var json = dataforms[key];
    renderforms.push(React.createElement("input", { name: json.name, type: json.type, key: i, onKeyUp: json.onkeyup, placeholder: json.placeholder }));
    renderforms.push(React.createElement("br", { key: i + Object.keys(dataforms).length }));
  }
  return React.createElement(
    "div",
    null,
    renderforms
  );
}

function DivTasks(props) {
  var data = props.datajson;
  var rendertasks = [];
  var keystask = Object.keys(data);

  var _loop = function _loop() {
    task = data[keystask[i]];
    rendersubtasks = [];
    subtasks = task["subtasks"];

    var idtask = task["id_task"];
    if (subtasks != null) {
      for (j = 0; j < subtasks.length; j++) {
        rendersubtasks.push(React.createElement(
          "div",
          { className: "subtask", key: i + j },
          React.createElement(
            "div",
            { className: "subtaskT" },
            subtasks[j]["name_subtask"]
          ),
          React.createElement(
            "div",
            { className: "subtaskD" },
            subtasks[j]["description_subtask"]
          )
        ));
      }
    }
    rendertasks.push(React.createElement(
      "div",
      { className: "task", key: i },
      React.createElement(
        "div",
        { className: "taskT" },
        task["name_task"]
      ),
      React.createElement(
        "div",
        { className: "taskD" },
        task["description_task"]
      ),
      rendersubtasks,
      React.createElement(
        "div",
        { className: "addsubtask", onClick: function onClick() {
            props.addsubtask(idtask);
          } },
        React.createElement("span", { className: "vert" }),
        React.createElement("span", { className: "hor" })
      )
    ));
  };

  for (var i = 0; i < keystask.length; i++) {
    var task;
    var rendersubtasks;
    var subtasks;
    var j;

    _loop();
  }
  return React.createElement(
    "div",
    { id: "containertasks" },
    rendertasks
  );
}

function DivProject(props) {
  var data = dataprojects;
  var renderdivs = [];

  var _loop2 = function _loop2() {
    json = data[i];

    var id = json.id_project;
    renderdivs.push(React.createElement(
      "div",
      { onClick: function onClick() {
          props.onClick(id);
        }, id: json.id_project, className: "project", key: i },
      React.createElement(
        "div",
        { className: "titleproject" },
        json.name_project
      ),
      React.createElement(
        "div",
        { className: "descriptionproject" },
        json.description_project
      )
    ));
  };

  for (var i = 0; i < Object.keys(data).length; i++) {
    var json;

    _loop2();
  }
  return React.createElement(
    "div",
    null,
    renderdivs
  );
}

// componentes de componentes


function Toolbar(props) {
  var buttons = props.buttons;
  var islogin = false;
  var isregister = false;
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i] == "signin") {
      islogin = true;
    } else if (buttons[i] == "signup") {
      isregister = true;
    }
  }
  return React.createElement(
    "div",
    { className: "toolbar" },
    islogin && React.createElement(Borderbutton, { id: "bttnIN", innerHTML: "Sign in", onclick: function onclick() {
        Render("login", null);
      } }),
    isregister && React.createElement(Fillbutton, { id: "bttnUP", innerHTML: "Sign up", onclick: function onclick() {
        Render("register", null);
      } }),
    React.createElement(Logo, { src: "src/icon.svg", onclick: function onclick() {
        Render("index", null);
      } })
  );
}

function Index(props) {
  return React.createElement(
    "div",
    { className: "indexpage" },
    React.createElement(Toolbar, { buttons: ["signin", "signup"] }),
    React.createElement("div", { className: "img" }),
    React.createElement(
      "div",
      { className: "invitation" },
      React.createElement(
        "div",
        { className: "constrastpart" },
        React.createElement(
          "p",
          { className: "textconstrast" },
          "Quisque facilisis eu felis vel mattis. Pellentesque viverra iaculis lacinia. Vestibulum dapibus ligula eu dolor consequat accumsan. Etiam ut eleifend tortor. Nullam dapibus diam tempus, lacinia odio eget, pretium metus. Mauris molestie mattis ullamcorper. Donec ut finibus urna. Maecenas suscipit pharetra ultricies. Nunc egestas, dui et mollis fermentum, velit ligula hendrerit neque, in fringilla arcu lacus et velit. Mauris iaculis ex id consectetur pharetra. Phasellus semper tincidunt accumsan. Sed commodo mattis efficitur. "
        )
      ),
      React.createElement(
        "div",
        { className: "basecolorpart" },
        React.createElement(
          "p",
          { className: "textbasecolor" },
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in elementum libero, sed tempus lorem. Nulla nulla nibh, placerat et auctor in, rutrum sodales augue. Mauris bibendum vel sem nec interdum. Aliquam posuere justo vitae turpis varius vehicula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla vitae nunc sed mauris egestas aliquet vel ut odio. Donec eros tortor, venenatis aliquam felis in, laoreet sodales odio. Ut eu magna dignissim, posuere sapien ac, sagittis nisl. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus odio tortor, vulputate vitae ipsum a, sagittis aliquet augue. "
        )
      )
    )
  );
}

function Login(props) {
  function sendLogin() {
    var error = document.getElementById("error");
    error.hidden = true;
    var fields = document.getElementsByTagName("input");
    var json = {};
    for (var i = 0; i < fields.length; i++) {
      if (i == 0) json["constraint"] = fields[i].value;else json[fields[i].placeholder] = fields[i].value;
    }
    var com = new Communication("login");
    com.send("POST", json, function (response) {
      if (response["results"].includes("error")) {
        error.innerHTML = response["message"];
        error.hidden = false;
      } else {
        window.location.reload();
      }
    });
  }
  function listenfield(event) {
    if (event.keyCode === 13) sendLogin();
  }
  var forms = { "1": {
      "type": "text",
      "placeholder": "user or email",
      "onkeyup": listenfield
    },
    "2": {
      "type": "password",
      "placeholder": "password",
      "onkeyup": listenfield
    } };
  return React.createElement(
    "div",
    { className: "loginpage" },
    React.createElement(Toolbar, { buttons: ["signup"] }),
    React.createElement(
      "div",
      { className: "formbox" },
      React.createElement(Form, { forms: forms }),
      "Don't have account? Please ",
      React.createElement(
        "a",
        { className: "href", onClick: function onClick() {
            Render("register", null);
          } },
        "Sign Up"
      ),
      React.createElement("br", null),
      React.createElement(
        "div",
        { id: "error", className: "errors", hidden: true },
        "Esto es un error !!"
      ),
      React.createElement("br", null),
      React.createElement(Fillbutton, { id: "actionbuttonIN", innerHTML: "Sign in", onclick: sendLogin })
    )
  );
}

function Register(props) {
  function sendRegister() {
    var error = document.getElementById("error");
    error.hidden = true;
    var fields = document.getElementsByTagName("input");
    var json = {};
    for (var i = 0; i < fields.length; i++) {
      json[fields[i].placeholder] = fields[i].value;
    }
    var com = new Communication("register");
    com.send("POST", json, function (response) {
      if (response["results"].includes("error")) {
        error.innerHTML = response["message"];
        error.hidden = false;
      } else {
        error.hidden = true;
        var jsonlogin = {
          "constraint": fields[1].value,
          "password": fields[2].value
        };
        com = new Communication("login");
        com.send("POST", jsonlogin, function (response) {
          if (response["results"].includes("error")) {
            error.innerHTML = response["message"];
            error.hidden = false;
          } else {
            Render("dashboard", { "view": "start" });
          }
        });
      }
    });
  }
  function listenfield(event) {
    if (event.keyCode === 13) sendRegister();
  }
  var forms = { "1": {
      "type": "text",
      "placeholder": "username",
      "onkeyup": listenfield
    },
    "2": {
      "type": "text",
      "placeholder": "email",
      "onkeyup": listenfield
    },
    "3": {
      "type": "password",
      "placeholder": "password",
      "onkeyup": listenfield
    } };
  return React.createElement(
    "div",
    { className: "registerpage" },
    React.createElement(Toolbar, { buttons: ["signin"] }),
    React.createElement(
      "div",
      { className: "formbox" },
      React.createElement(Form, { forms: forms }),
      "You have account? Please ",
      React.createElement(
        "a",
        { className: "href", onClick: function onClick() {
            Render("login", null);
          } },
        "Sign In"
      ),
      React.createElement("br", null),
      React.createElement(
        "div",
        { id: "error", className: "errors", hidden: true },
        "Esto es un error !!"
      ),
      React.createElement("br", null),
      React.createElement(Borderbutton, { id: "actionbuttonUP", innerHTML: "Sign up", onclick: sendRegister })
    )
  );
}

function Start(props) {
  var viewone = React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      null,
      React.createElement(Projects, null)
    ),
    React.createElement("div", { "class": "darking" }),
    React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { id: "getstarted" },
        React.createElement(
          "div",
          { id: "onemessage" },
          "it is a table with your projects"
        ),
        React.createElement(Borderbutton, { id: "YEstart", onclick: function onclick() {
            var message = document.getElementById("onemessage");
            var thisbutton = document.getElementById("YEstart");
            var pointer = document.getElementById("pointer");
            pointer.hidden = false;
            message.innerHTML = "click here to add a new project";
            thisbutton.onclick = function () {
              Render("dashboard", { "view": "projects" });
            };
          }, innerHTML: "OK" })
      )
    )
  );
  var viewdefault = React.createElement(
    "div",
    { id: "getstarted" },
    React.createElement("div", { id: "inicialmessage" }),
    React.createElement(Borderbutton, { id: "YEstart", onclick: function onclick() {
        var thisbutton = document.getElementById("YEstart");
        var otherbutton = document.getElementById("NOstart");
        var started = document.getElementById("getstarted");
        started.removeChild(thisbutton);
        started.removeChild(otherbutton);
        var pointer = document.getElementById("pointer");
        var message = document.getElementById("inicialmessage");
        message.innerHTML = "This is a section of your profile";
        pointer.hidden = false;
        pointer.setAttribute("class", "pointerprofile");
        thisbutton = document.createElement("button");
        thisbutton.setAttribute('id', "YEstart");
        thisbutton.setAttribute('class', "borderbutton");
        thisbutton.innerHTML = "OK";
        thisbutton.onclick = function () {
          LoadProfile();
          document.getElementById("prof").hidden = false;
          message.innerHTML = "Click here to change color theme";
          pointer.setAttribute("class", "pointertheme");
          thisbutton.onclick = function () {
            Render("dashboard", { "view": "start", "loop": "1" });
          };
        };
        started.appendChild(thisbutton);
      }, innerHTML: "YES" }),
    " ",
    React.createElement(Fillbutton, { id: "NOstart", onclick: function onclick() {
        window.location.reload();
      }, innerHTML: "NO" })
  );
  var com = new Communication("session");
  if (props.loop == null) {
    com.send("GET", null, function (response) {
      var user = response["username"];
      document.getElementById("inicialmessage").innerHTML = "Welcome " + user + ", you want to get started?";
      document.getElementsByClassName("darking")[0].hidden = false;
    });
  }

  if (props.loop == "1") {
    com.send("GET", null, function (response) {
      document.getElementsByClassName("darking")[0].hidden = false;
      var pointer = document.getElementById("pointer");
      pointer.setAttribute("class", "pointerprojects");
    });
  }

  return React.createElement(
    "div",
    null,
    React.createElement("div", { id: "pointer", hidden: true }),
    React.createElement(
      "div",
      null,
      props.loop == null && viewdefault,
      props.loop == "1" && viewone
    )
  );
}

function Tasks(props) {
  var idtask = null;
  function addsubtask(id) {
    idtask = id;
    document.getElementById("newsubtask").hidden = !document.getElementById("newsubtask").hidden;
  }
  function sendsubtask() {
    if (idtask != null) {
      var element = document.getElementById("errorsubtask");
      element.hidden = true;
      var com = new Communication("subtask");
      var json = {
        "name": document.getElementsByName("namesub")[0].value,
        "description": document.getElementsByName("descsub")[0].value,
        "task_id": idtask
      };
      com.send("POST", json, function (response) {
        if (response["status"] == "200") {
          loadInfo(props.id_project, function (json) {
            Render("dashboard", { "view": "tasks", "id_project": props.id_project, "datajson": json });
          });
        } else {
          element.hidden = false;
          element.innerHTML = response["message"];
        }
      });
    }
  }
  function sendTask() {
    var element = document.getElementById("errortask");
    element.hidden = true;
    var com = new Communication("task");
    var json = {
      "name": document.getElementsByName("name")[0].value,
      "description": document.getElementsByName("desc")[0].value,
      "project_id": props.id_project
    };
    com.send("POST", json, function (response) {
      if (response["status"] == "200") {
        loadInfo(props.id_project, function (json) {
          Render("dashboard", { "view": "tasks", "id_project": props.id_project, "datajson": json });
        });
      } else {
        element.hidden = false;
        element.innerHTML = response["message"];
      }
    });
  }
  function listenfieldsub(event) {
    if (event.keyCode === 13) sendsubtask();
  }
  function listenfield(event) {
    if (event.keyCode === 13) sendTask();
  }

  var formssubtask = { "1": {
      "type": "text",
      "placeholder": "Subask Name",
      "name": "namesub",
      "onkeyup": listenfieldsub
    },
    "2": {
      "type": "text",
      "placeholder": "Description",
      "name": "descsub",
      "onkeyup": listenfieldsub
    } };
  var formstask = { "1": {
      "type": "text",
      "placeholder": "Task Name",
      "name": "name",
      "onkeyup": listenfield
    },
    "2": {
      "type": "text",
      "placeholder": "Description",
      "name": "desc",
      "onkeyup": listenfield
    } };
  function loadtitle() {
    var com = new Communication("project");
    com.send("GET", null, function (response) {
      for (var i = 0; i < Object.keys(response).length; i++) {
        if (response[i]["id_project"] == props.id_project) {
          document.getElementById("titleproject").innerHTML = response[i]["name_project"];
          document.getElementById("descriptionproject").innerHTML = response[i]["description_project"];
        }
      }
    });
  }
  function getBackground() {
    var com = new Communication("background/?id=" + props.id_project);
    com.send("GET", null, function (response) {
      if (response == null) {
        setBackground(window.location.href + "background/?id=" + props.id_project);
      } else {
        if (response["status"] == "200") {
          setBackground(response["message"]);
        }
      }
    });
  }
  function sendBackground() {
    var error = document.getElementById("error");
    error.hidden = true;
    var com = new Communication("background");
    var file = document.getElementsByName("project_id:" + props.id_project)[0];
    if (file.files.length == 0) {
      var URL = document.getElementsByName("URL")[0];
      var json = { "url": URL.value, "id": props.id_project };
      com.send("POST", json, function (response) {
        if (response["status"] == 200) {
          getBackground();
        } else {
          error.hidden = false;
          error.innerHTML = response["message"];
        }
      });
    } else {
      file = file.files[0];
      com.sendFile("POST", "project_id:" + props.id_project, file, function (response) {
        if (response["status"] == 200) {
          getBackground();
        } else {
          error.hidden = false;
          error.innerHTML = response["message"];
        }
      });
    }
  }
  var forms = { "0": {
      "type": "file",
      "name": "project_id:" + props.id_project
    },
    "1": {
      "name": "URL",
      "type": "text",
      "placeholder": "or insert a image URL",
      "onkeyup": sendBackground
    } };
  getBackground();
  loadtitle();
  return React.createElement(
    "div",
    { id: "taskscontainer" },
    React.createElement(
      "div",
      { id: "addtask", onClick: function onClick() {
          var newtask = document.getElementsByClassName("new")[0];
          newtask.hidden = !newtask.hidden;
        } },
      React.createElement("span", { className: "vert" }),
      React.createElement("span", { className: "hor" })
    ),
    React.createElement(DivTasks, { addsubtask: addsubtask, datajson: props.datajson }),
    React.createElement(
      "div",
      { id: "newtask", className: "new", hidden: true },
      React.createElement(
        "div",
        { id: "exittask", className: "exit", onClick: function onClick() {
            document.getElementById("newtask").hidden = true;
          } },
        React.createElement("span", { className: "diag1" }),
        React.createElement("span", { className: "diag2" })
      ),
      React.createElement(Form, { forms: formstask }),
      React.createElement(
        "div",
        { id: "errorsubtask", className: "errors", hidden: true },
        "Esto es un error !!"
      ),
      React.createElement(Borderbutton, { id: "save", innerHTML: "SAVE", onclick: sendTask })
    ),
    React.createElement(
      "div",
      { id: "newproject", hidden: true },
      React.createElement(
        "div",
        { id: "exit", onClick: function onClick() {
            document.getElementById("newproject").hidden = true;
          } },
        React.createElement("span", { className: "diag1" }),
        React.createElement("span", { className: "diag2" })
      ),
      React.createElement(
        "h6",
        null,
        "Add a background image"
      ),
      React.createElement(Form, { forms: forms }),
      React.createElement(
        "div",
        { id: "error", className: "errors", hidden: true },
        "Esto es un error !!"
      ),
      React.createElement("br", null),
      React.createElement(Borderbutton, { id: "sendbackground", onclick: sendBackground, innerHTML: "send" })
    ),
    React.createElement(
      "div",
      { className: "taskbar" },
      React.createElement("text", { id: "titleproject" }),
      React.createElement("text", { id: "descriptionproject" }),
      React.createElement(
        "div",
        { className: "setbackground", onClick: function onClick() {
            document.getElementById("newproject").hidden = !document.getElementById("newproject").hidden;
          } },
        React.createElement(
          "p",
          null,
          "Set a background image"
        ),
        React.createElement("div", null)
      )
    ),
    React.createElement(
      "div",
      { id: "newsubtask", className: "new", hidden: true },
      React.createElement(
        "div",
        { className: "exit", onClick: function onClick() {
            document.getElementById("newsubtask").hidden = true;
          } },
        React.createElement("span", { className: "diag1" }),
        React.createElement("span", { className: "diag2" })
      ),
      React.createElement(Form, { forms: formssubtask }),
      React.createElement(
        "div",
        { id: "errortask", className: "errors", hidden: true },
        "Esto es un error !!"
      ),
      React.createElement(Borderbutton, { id: "subtask", onclick: sendsubtask, innerHTML: "save" })
    )
  );
}

function Projects(props) {
  function displayproject(element) {
    loadInfo(element, function (json) {
      console.log(json);
      Render("dashboard", { "view": "tasks", "id_project": element, "datajson": json });
    });
  }
  function sendProject() {
    console.log("hola");
    var com = new Communication("project");
    var fields = document.getElementsByTagName("input");
    var json = {};
    for (var i = 0; i < fields.length; i++) {
      json[fields[i].placeholder] = fields[i].value;
    }
    console.log(json);
    com.send("POST", json, function (response) {
      console.log(response);
      window.location.reload();
    });
  }
  function listenfield(event) {
    if (event.keyCode === 13) sendProject();
  }
  var forms = { "1": {
      "type": "text",
      "placeholder": "name",
      "onkeyup": listenfield
    },
    "2": {
      "type": "text",
      "placeholder": "description",
      "onkeyup": listenfield
    } };
  var com = new Communication("session");
  com.send("GET", null, function (response) {
    var user = response["username"];
    document.getElementById("welcome").innerHTML = "Welcome, " + user + "!";
  });
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { id: "projectscontainer" },
      React.createElement("div", { id: "welcome" }),
      React.createElement(
        "div",
        { id: "myprojects" },
        React.createElement(
          "h6",
          { id: "titlecontainer", className: "titleprojects" },
          "My Projects"
        ),
        React.createElement(DivProject, { onClick: displayproject }),
        React.createElement(
          "div",
          { id: "addproject", onClick: function onClick() {
              var newproject = document.getElementById("newproject");
              newproject.hidden = !newproject.hidden;
            } },
          React.createElement("span", { className: "vert" }),
          React.createElement("span", { className: "hor" })
        )
      )
    ),
    React.createElement(
      "div",
      { id: "newproject", hidden: true },
      React.createElement(
        "h6",
        null,
        " Create new project"
      ),
      React.createElement(
        "div",
        { id: "exit", onClick: function onClick() {
            document.getElementById("newproject").hidden = true;
          } },
        React.createElement("span", { className: "diag1" }),
        React.createElement("span", { className: "diag2" })
      ),
      React.createElement(Form, { forms: forms }),
      React.createElement(Fillbutton, { id: "createproject", innerHTML: "Create", onclick: sendProject })
    )
  );
}

function Dashboard(props) {
  return React.createElement(
    "div",
    { className: "dashboardpage" },
    props.view["view"].includes("projects") && React.createElement(Projects, null),
    props.view["view"].includes("tasks") && React.createElement(Tasks, { id_project: props.view["id_project"], datajson: props.view["datajson"] }),
    React.createElement(
      "div",
      { className: "aboutme", onClick: function onClick() {
          var profile = document.getElementById("prof");
          profile.hidden = !profile.hidden;
          if (!profile.hidden) {
            LoadProfile();
          }
        } },
      React.createElement("div", null),
      React.createElement("div", null),
      React.createElement("div", null)
    ),
    React.createElement(
      "div",
      { id: "prof", className: "myprofile", hidden: true },
      React.createElement(
        "div",
        { className: "profileinfo" },
        React.createElement("p", { id: "username" }),
        React.createElement("p", { id: "email" })
      ),
      React.createElement(
        "div",
        { className: "profileactions" },
        React.createElement(
          "button",
          { className: "toolbutton", onClick: function onClick() {
              var com = new Communication("session");
              com.send("DELETE", null, function (response) {
                setTheme("original");
                window.location.reload();
              });
            } },
          "Logout"
        ),
        React.createElement("br", null),
        props.view["view"].includes("tasks") && React.createElement(
          "button",
          { className: "toolbutton", onClick: function onClick() {
              window.location.reload();
            } },
          "Dashboard"
        )
      ),
      React.createElement(
        "div",
        { className: "themes" },
        "Themes",
        React.createElement("br", null),
        React.createElement("div", { id: "theme1", title: "original theme", onClick: function onClick() {
            setTheme("original");
          } }),
        React.createElement("div", { id: "theme2", title: "dark theme", onClick: function onClick() {
            setTheme("dark");
          } }),
        React.createElement("div", { id: "theme3", title: "olive theme", onClick: function onClick() {
            setTheme("olive");
          } })
      )
    ),
    React.createElement("div", { className: "darking", hidden: true }),
    props.view["view"].includes("start") && React.createElement(Start, { loop: props.view["loop"] })
  );
}

function Render(page, jsonprops) {
  var root = document.getElementById("root");
  if (document.getElementById("rootchild") != null) {
    root.removeChild(document.getElementById("rootchild"));
  }
  var element = document.createElement("div");
  element.setAttribute('id', "rootchild");
  root.appendChild(element);
  var reactContainer = document.getElementById("rootchild");
  if (page == "index") {
    ReactDOM.render(React.createElement(Index, null), reactContainer);
  }
  if (page == "login") {
    ReactDOM.render(React.createElement(Login, null), reactContainer);
  }
  if (page == "register") {
    ReactDOM.render(React.createElement(Register, null), reactContainer);
  }
  if (page == "dashboard" && jsonprops != null) {
    ReactDOM.render(React.createElement(Dashboard, { view: jsonprops }), reactContainer);
  }
}

window.onload = function () {
  var com = new Communication("session");
  com.send("GET", null, function (response) {
    if (Object.entries(response).length === 0) {
      Render("index", null);
    } else {
      var firstcookie = document.cookie.split(";")[0];
      var theme = null;
      if (firstcookie != null) {
        if (firstcookie.split("=")[0].includes("theme")) {
          theme = firstcookie.split("=")[1];
        }
      }
      if (theme != null) setTheme(theme);
      com = new Communication("project");
      com.send("GET", null, function (response) {
        dataprojects = response;
        Render("dashboard", { "view": "projects" });
      });
    }
  });
};