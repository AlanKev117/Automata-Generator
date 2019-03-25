import { Gramatica } from "./Gramatica";

class LL1 {
    private G: Gramatica;
    
    public readonly first = (gamas:string) => {
        let c:string= null;
        if( gamas[0].esTerminal || gamas[0].esEpsilon ){
            c.add(gamas[0]);
            return c;
        }
        //S[0] -> Vn

        gamas.forEach(element => {
            
        });

    }
    public readonly follow = () => {

    }
}

export { LL1 };
