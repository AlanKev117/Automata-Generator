import { Automaton } from "../Automaton/Automaton";
import Axios from "../../node_modules/axios/index";
namespace ListenersLexic {
    export const loadDFAs = (automata: Automaton[]) => {
        document
            .querySelector("#automaton-table")
            .addEventListener("DOMSubtreeModified", event => {
                Axios.post(
                    "https://automata-generator.firebaseio.com/automata",
                    {automata}
                )
                    .then(reponse => console.log)
                    .catch(error => console.log);
                const cheks = automata
                    .filter(automaton => automaton.esAFD())
                    .map(
                        automaton =>
                            `<div class="check">
								<input 
									type="checkbox" 
									name="${automaton.getName()}" 
									class="automaton-checkbox" 
									value="${automaton.getName()}" />${automaton.getName()}
							</div>`
                    )
                    .reduce((tags, tag) => tags + "\n" + tag, "");
                console.log(cheks);
                document.querySelector("#afd-checks").innerHTML = cheks;
            });
    };
}

export { ListenersLexic };
