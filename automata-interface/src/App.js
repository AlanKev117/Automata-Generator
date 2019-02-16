import React, { Component } from "react";
import Auxiliary from "./hoc/Auxiliary/Auxiliary";
import Header from "./components/Header/Header";
import Builder from "./containers/Pages/Builder/Builder";
import { Switch, Route } from "react-router-dom";
import { Automaton } from "./ts/Automaton/Automaton";

class App extends Component {
    constructor () {
        super();
        const automaton = new Automaton("alan");
        automaton.createBasic("s");
        this.automata = [automaton];
    }
    render() {
        return (
            <Auxiliary>
                <Header />
                <Switch>
                    <Route path="/lexic" render={null} />
                    <Route
                        path="/"
                        render={() => (
                            <Builder automata={this.automata} />
                        )}
                    />
                </Switch>
            </Auxiliary>
        );
    }
}

export default App;
