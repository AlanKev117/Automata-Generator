import React, { Component } from 'react';
import Automaton from "../../ts/Automaton/Automaton";

class AutomatonContainer extends Component {
	state = {
		automaton: null,
	}

	render () {
		return this.state.automaton ? <div>{this.state.automaton.toString()}</div> : null;
	}
}