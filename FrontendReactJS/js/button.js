
var textborderbutton = "Sign in";
var textfillbutton = "Sign up";

// componentes

function Borderbutton(props) {
  console.log(props.value);
  return React.createElement(
    "button",
    { id: props.id, className: "borderbutton" },
    props.innerHTML
  );
}

function Fillbutton(props) {
  return React.createElement(
    "button",
    { id: props.id, className: "fillbutton" },
    props.innerHTML
  );
}

function Logo(props) {
  return React.createElement("img", { className: "logo", src: props.src });
}

// componentes de componentes

function Toolbar() {
  return React.createElement(
    "div",
    { className: "toolbar" },
    React.createElement(Borderbutton, { id: "bttnIN", innerHTML: "Sign in" }),
    React.createElement(Fillbutton, { id: "bttnUP", innerHTML: "Sign up" }),
    React.createElement(Logo, { src: "src/icon.svg" })
  );
}

function Page() {
  return React.createElement(
    "div",
    { className: "content-page" },
    React.createElement(Toolbar, null),
    React.createElement("div", { className: "img" })
  );
}

window.onload = function () {
  var reactContainer = document.getElementById("root");
  ReactDOM.render(React.createElement(Page, null), reactContainer);
};