import React from "react";
import classes from "./StepsViewer.module.css";
import { LR1 } from "../../../../../ts/Grammar/LR1/LR1";
import { LR0 } from "../../../../../ts/Grammar/LR0/LR0";

const stepsViewer = props => {
    const { stacks, sigmas, actions } = props.analysis;
    const parser = props.parser;
    return (
        <table className={classes.StepsViewer}>
            <thead>
                <tr>
                    <th>Stack</th>
                    <th>Sigma</th>
                    <th>Operación</th>
                </tr>
            </thead>
            <tbody>
                {stacks.map((stack, i) => {
                    let LR1Rule;
                    if (parser instanceof LR1) {
                        if (actions[i].startsWith("r")) {
                            if (actions[i][1] === "0") {
                                actions[i] = "acc";
                            } else {
                                const ruleIndex = +actions[i][1];
                                LR1Rule = parser.arrayRules[ruleIndex];
                                actions[i] +=
                                    ", " +
                                    Object.keys(LR1Rule)[0] +
                                    " → " +
                                    Object.values(LR1Rule)[0];
                            }
                        }
                    }
                    return (
                        <tr>
                            <td>{stack.join(", ")}</td>
                            <td>{sigmas[i]}</td>
                            <td>{actions[i]}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default stepsViewer;
