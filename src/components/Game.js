import React, { Component } from 'react'
import { Doodle } from "./Basic"

import moutainImage from "../images/mountain.png";
import '../styles/Game.css';

export class Game extends Component {
  componentDidMount() {
    const doodle = new Doodle('game')
    doodle.init()
    window.doodle = doodle
  }
  render() {
    return (
      <div>
        <div id="mountain">
          <img src={moutainImage} alt="mountain"/>
        </div>
        <div id="game"></div>
      </div>
    )
  }
}

export default Game
