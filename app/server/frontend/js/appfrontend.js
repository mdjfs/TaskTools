
var textborderbutton = "Sign in";
var textfillbutton = "Sign up";

// componentes

function Borderbutton(props) {
  console.log(props.value);
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
  var forms = null;
  var renderforms = [];
  for (var i = 0; i < Object.keys(dataforms).length; i++) {
    var key = Object.keys(dataforms)[i];
    var json = dataforms[key];
    if (forms == null) {
      renderforms.push(React.createElement("input", { type: json.type, placeholder: json.placeholder }));
    } else {
      renderforms.push(React.createElement("input", { type: json.type, placeholder: json.placeholder }));
    }
    renderforms.push(React.createElement("br", null));
  }
  return React.createElement(
    "div",
    null,
    renderforms
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
        Render("login");
      } }),
    isregister && React.createElement(Fillbutton, { id: "bttnUP", innerHTML: "Sign up", onclick: function onclick() {
        Render("register");
      } }),
    React.createElement(Logo, { src: "src/icon.svg", onclick: function onclick() {
        Render("index");
      } })
  );
}

function Index() {
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

function Login() {
  var forms = { "1": {
      "type": "text",
      "placeholder": "user or email"
    },
    "2": {
      "type": "password",
      "placeholder": "password"
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
            Render("register");
          } },
        "Sign Up"
      ),
      React.createElement("br", null),
      React.createElement(
        "div",
        { className: "errors", hidden: true },
        "Esto es un error !!"
      ),
      React.createElement("br", null),
      React.createElement(Fillbutton, { id: "actionbuttonIN", innerHTML: "Sign in", onclick: function onclick() {
          //error = document.getElementsByClassName("errors")[0];
          //error.hidden = !error.hidden;
        } })
    )
  );
}

function Register() {
  var forms = { "1": {
      "type": "text",
      "placeholder": "username"
    },
    "2": {
      "type": "text",
      "placeholder": "email"
    },
    "3": {
      "type": "password",
      "placeholder": "password"
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
            Render("login");
          } },
        "Sign In"
      ),
      React.createElement("br", null),
      React.createElement(
        "div",
        { className: "errors", hidden: true },
        "Esto es un error !!"
      ),
      React.createElement("br", null),
      React.createElement(Borderbutton, { id: "actionbuttonUP", innerHTML: "Sign in", onclick: function onclick() {
          //error = document.getElementsByClassName("errors")[0];
          //error.hidden = !error.hidden;
        } })
    )
  );
}

function Render(page) {
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
}

window.onload = function () {
  this.Render("index");
};