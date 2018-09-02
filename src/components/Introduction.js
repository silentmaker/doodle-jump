import React from 'react';
import '../styles/Introduction.css';

const Introduction = (props) => (
  <div className="intro">
    <div>Introduction</div>
    <div onClick={props.play}>Play</div>
    <div>Top Score: </div>
    <div className="ninja">ninja</div>
  </div>
)

export default Introduction;
