import React, { Component } from "react";
import Auxiliary from "./hoc/Auxiliary/Auxiliary";
import Header from "./components/Header/Header";
import { Switch, Route } from "react-router-dom";

import Builder from "./containers/Pages/Builder/Builder";
import Lexic from "./containers/Pages/Lexic/Lexic";
import Calculator from "./containers/Pages/Calculator/Calculator";
import Regex from "./containers/Pages/Regex/Regex";
import Grammar from "./containers/Pages/Grammar/Grammar";
// import Axios from "axios";

class App extends Component {
    automata = [];
    analyzers = [];

    // componentDidMount () {
    //     Axios.get("192.168.10.5:4000/automatas").then(res => console.log(res.data));
    // }

    render() {
        return (
            <Auxiliary>
                <Header />
                <Switch>
                    <Route path="/grammar" component={Grammar}/>
                    <Route
                        path="/regex"
                        render={() => <Regex automata={this.automata} />}
                    />
                    <Route path="/calculator" component={Calculator} />
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
