import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import "./App.css";
import Routes from "./Routes";
import { ParallaxProvider } from 'react-scroll-parallax';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      backgroundColor: "#fff"
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    console.log(authenticated);
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  setBackgroundColor() {
    const route = this.props.location.pathname;
    let color = "";
    let height = "";
    if (route === "/"){
      console.log(route);
      color = "#ADC9C5";
      height = "100%"
    } else {
      console.log(route);
      color = "#FCB5AC";
      height = "fill"
    }
    document.body.style.backgroundColor = color;
    document.body.style.height = height;
  }

  render() {
    let login = "";
    if (this.props.location.pathname === "/login") {
      login = true;
    } else {
      login = false;
    }

    this.setBackgroundColor();
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      <ParallaxProvider>
      <div className="App container">
      {login
      ?<div>
      <Routes childProps={childProps} />
      </div>
      :
      <div>
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">My Fridge</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight className="mr-auto">
            {this.state.isAuthenticated
              ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
              : <Fragment>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
        </div>
      }
      </div>
      </ParallaxProvider>
    );
  }
}

export default withRouter(App);
