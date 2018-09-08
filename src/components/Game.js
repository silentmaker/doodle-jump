import React, { Component } from 'react'
import { Doodle } from "./Basic"

import '../styles/Game.css';

export class Game extends Component {
  componentDidMount() {
    const doodle = new Doodle('game')
    doodle.init()
    window.doodle = doodle
  }
  render() {
    return (
      <div id="game">
        <div id="console-log"></div>
      </div>
    )
  }
}

export default Game
