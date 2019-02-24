import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import "./Home.css";
import { Parallax } from 'react-scroll-parallax';
import * as V from 'victory';
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      fridge: [],
      temp_list: [{productName:"Milk"}, {productName:"Milk"}, {productName:"Jam"}, {productName:"Meat"}, {productName:"Milk"}],
      percent: 25,
      data: this.getData(0)
    };
  }

  // componentDidUpdate(prevProps) {
  //   // Typical usage (don't forget to compare props):
  //   if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
  //     this.componentDidMount()
  //   }
  // }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      console.log(this.props.isAuthenticated);
      return;
    }

    try {
      console.log(this.props.isAuthenticated);
      console.log("Trying");
      const fridge = await this.myfridge();
      console.log(fridge);
      this.setState({ fridge });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });

    let percent = 25;
    this.setStateInterval = window.setInterval(() => {
      percent += (Math.random() * 25);
      percent = (percent > 100) ? 0 : percent;
      this.setState({
        percent, data: this.getData(percent)
      });
    }, 2000);
  }

  componentWillUnmount() {
    window.clearInterval(this.setStateInterval);
  }

  getData(percent) {
    return [{ x: 1, y: percent }, { x: 2, y: 100 - percent }];
  }

  myfridge() {
    console.log("Fetching");
    return API.get("myfridge", "/myfridge");
  }

  renderFridgeListRight(fridge) {
    console.log(fridge);
    const items = this.state.temp_list.map((item, index) =>
      <li key={index}>
      {item.productName}
      <svg viewBox="0 0 100 20" width="50%" height="1%">
          <VictoryPie
            standalone={false}
            animate={{ duration: 1000 }}
            width={10} height={10}
            data={this.state.data}
            innerRadius={10}
            cornerRadius={25}
            labels={() => null}
            style={{
              data: { fill: (d) => {
                const color = d.y > 30 ? "green" : "red";
                return d.x === 1 ? color : "transparent";
              }
              }
            }}
          />
          <VictoryAnimation duration={1000} data={this.state}>
            {(newProps) => {
              return (
                <VictoryLabel
                  textAnchor="middle" verticalAnchor="middle"
                  x={50} y={15}
                  text={`${Math.round(newProps.percent)}%`}
                  style={{ fontSize: 5 }}
                />
              );
            }}
          </VictoryAnimation>
        </svg>
      </li>
    );
    console.log(this.state.temp_list);
    console.log(items);
    return (

          <Row className="category-row">

              <Col md={6}><h2 className="category-name-right">Meat</h2></Col>

              <Col className="color-list-right" md={6}><ul>{items }</ul></Col>
          </Row>

    );
  }

  renderFridgeListLeft(fridge) {
    console.log(fridge);
    const items = this.state.temp_list.map((item, index) => <li key={index}>{item.productName}</li>);
    console.log(this.state.temp_list);
    console.log(items);
    return (

          <Row className="category-row">
            <Col className="color-list-left" md={6}><ul>{items }</ul></Col>
            <Col md={6}><h2 className="category-name-left">Dairy</h2></Col>
          </Row>

    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h2>My Fridge</h2>
        <h3>-A cold and modern container</h3>
        <p>It seems like you haven't logged in. Go back and log in to be able to see the fridge.</p>
      </div>
    );
  }

  renderFridge() {
    console.log(this.state.isLoading + "LOADING?!");
    return (
      <div className="notes">
        <h1 className="header">Good ol' food</h1>
        <ListGroup>
          <Parallax
            className="para-right"
            offsetYMax={480}
            offsetYMin={-480}
            tag="figure"
          >
            {this.state.isLoading && this.renderFridgeListRight(this.state.fridge)}
          </Parallax>
          <Parallax
            className="para-left"
            offsetYMax={400}
            offsetYMin={-400}
            fasterScrollRate
            tag="figure"
          >
            {this.state.isLoading && this.renderFridgeListLeft(this.state.fridge)}
          </Parallax>
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderFridge() : this.renderLander()}
      </div>
    );
  }
}
