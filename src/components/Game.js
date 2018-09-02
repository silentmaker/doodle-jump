import React, { Component } from 'react'
import Introduction from "./Introduction"
import { Doodle } from "./Basic"

import '../styles/Game.css';

export class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      doodle: new Doodle(),
    }
  }
  componentDidMount() {
    this.state.doodle.init(window.innerWidth, window.innerHeight)
  }
  render() {
    const { doodle } = this.state

    return (
      <div className="game">
        <Introduction play={doodle.play} />
      </div>
    )
  }
}

export default Game
