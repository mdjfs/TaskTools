
var textborderbutton = "Sign in";
var textfillbutton = "Sign up";

 // componentes

function Borderbutton(props){
  console.log(props.value);
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
  var forms= null;
  var renderforms = [];
  for(var i=0; i < Object.keys(dataforms).length; i++){
    var key = Object.keys(dataforms)[i];
    var json = dataforms[key];
    if (forms==null){
      renderforms.push(<input type={json.type} placeholder={json.placeholder}></input>);
    }
    else{
      renderforms.push(<input type={json.type} placeholder={json.placeholder}></input>);
    }
    renderforms.push(<br/>);
  }
  return (<div>
    {renderforms}</div>);
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
              Render("login");
            }}/> }
            {isregister &&
            <Fillbutton id="bttnUP" innerHTML="Sign up" onclick={function(){
            Render("register");}}/> }
            <Logo src="src/icon.svg" onclick={function(){
              Render("index");
            }}></Logo>
            </div>);
}

function Index(){
  return (<div className="indexpage">
          <Toolbar buttons={["signin","signup"]}></Toolbar>
          <div className="img"></div>
          <div className="invitation">
              <div className="constrastpart"><p className="textconstrast">Quisque facilisis eu felis vel mattis. Pellentesque viverra iaculis lacinia. Vestibulum dapibus ligula eu dolor consequat accumsan. Etiam ut eleifend tortor. Nullam dapibus diam tempus, lacinia odio eget, pretium metus. Mauris molestie mattis ullamcorper. Donec ut finibus urna. Maecenas suscipit pharetra ultricies. Nunc egestas, dui et mollis fermentum, velit ligula hendrerit neque, in fringilla arcu lacus et velit. Mauris iaculis ex id consectetur pharetra. Phasellus semper tincidunt accumsan. Sed commodo mattis efficitur. </p></div>
              <div className="basecolorpart"><p className="textbasecolor">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in elementum libero, sed tempus lorem. Nulla nulla nibh, placerat et auctor in, rutrum sodales augue. Mauris bibendum vel sem nec interdum. Aliquam posuere justo vitae turpis varius vehicula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla vitae nunc sed mauris egestas aliquet vel ut odio. Donec eros tortor, venenatis aliquam felis in, laoreet sodales odio. Ut eu magna dignissim, posuere sapien ac, sagittis nisl. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus odio tortor, vulputate vitae ipsum a, sagittis aliquet augue. </p></div>
          </div>
          </div>);
}

function Login(){
  var forms = {"1":{
    "type":"text",
    "placeholder":"user or email"
  },
  "2":{
    "type":"password",
    "placeholder":"password"
  }};
  return (<div className="loginpage">
    <Toolbar buttons={["signup"]}></Toolbar>
    <div className="formbox">
      <Form forms={forms}></Form>
      Don't have account? Please <a className="href"onClick={function(){
        Render("register");
      }}>Sign Up</a><br/>
      <div className="errors" hidden>Esto es un error !!</div><br/>
      <Fillbutton id="actionbuttonIN" innerHTML="Sign in" onclick={function(){
              //error = document.getElementsByClassName("errors")[0];
              //error.hidden = !error.hidden;
            }}/>
    </div>
  </div>);
}

function Register(){
  var forms = {"1":{
    "type":"text",
    "placeholder":"username"
  },
  "2":{
    "type":"text",
    "placeholder":"email",
  },
  "3":{
    "type":"password",
    "placeholder":"password"
  }};
  return (<div className="registerpage">
    <Toolbar buttons={["signin"]}></Toolbar>
    <div className="formbox">
      <Form forms={forms}></Form>
      You have account? Please <a className="href"onClick={function(){
        Render("login");
      }}>Sign In</a><br/>
      <div className="errors" hidden>Esto es un error !!</div><br/>
      <Borderbutton id="actionbuttonUP" innerHTML="Sign in" onclick={function(){
              //error = document.getElementsByClassName("errors")[0];
              //error.hidden = !error.hidden;
            }}/>
    </div>
  </div>);
}

function Render(page){
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
  
}

window.onload = function(){
  this.Render("index");
};