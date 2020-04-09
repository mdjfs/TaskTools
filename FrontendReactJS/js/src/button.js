
var textborderbutton = "Sign in";
var textfillbutton = "Sign up";


 // componentes

function Borderbutton(props){
  console.log(props.value);
  return <button id={props.id} className="borderbutton" >{props.innerHTML}</button>;
}

function Fillbutton(props){
  return <button id={props.id} className="fillbutton" >{props.innerHTML}</button>;
}

function Logo(props){
  return <img className="logo" src={props.src}/>
}

// componentes de componentes

function Toolbar(){
  return (<div className="toolbar">
            <Borderbutton id="bttnIN" innerHTML="Sign in"/>
            <Fillbutton id="bttnUP" innerHTML="Sign up"/>
            <Logo src="src/icon.svg"></Logo>
            </div>);
}

function Page(){
  return (<div className="content-page"><Toolbar/><div className="img"></div></div>);
}



window.onload = function(){
    const reactContainer = document.getElementById("root");
    ReactDOM.render(
        <Page/>,
        reactContainer
      );
}