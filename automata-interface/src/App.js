import React, { Component } from "react";
import Auxiliary from "./hoc/Auxiliary/Auxiliary";
import Header from "./components/Header/Header";
import { Switch, Route } from "react-router-dom";

import Builder from "./containers/Pages/Builder/Builder";
import Lexic from "./containers/Pages/Lexic/Lexic";
import Calculator from "./containers/Pages/Calculator/Calculator";

class App extends Component {
	automata = [];
	analyzers = [];
	render() {
		return (
			<Auxiliary>
				<Header />
				<Switch>
					<Route path="/calculator" component={Calculator}/>
					<Route
						path="/lexic"
						render={() => (
							<Lexic
								automata={this.automata}
								analyzers={this.analyzers}
							/>
						)}
					/>
					<Route
						path="/"
						render={() => <Builder automata={this.automata} />}
					/>
				</Switch>
			</Auxiliary>
		);
	}
}

export default App;
