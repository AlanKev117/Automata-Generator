import { Gramatica } from "./Gramatica";

class LL1 {
    private G: Gramatica; //lista de reglas
   


    constructor (gramatica:Gramatica){



        
    }

    public readonly first = (s:Array<string>) => {//recibimos los lexemas a analizar 
        //Declaramos conjunto vacio
        let c:Array<string> = null;
        //Se separan los elementos
        const gamas: Array<string> = s;

        if ( this.esTerminal(gamas[0]) || this.esEps(gamas[0]) ){
            c.push(gamas[0])
            return c;
        } 

        gamas.forEach(gama => {
            let beta = Array.from(this.G.getRightSidesWith(gama)); // convertimos el cojunto en arreglo para aplicar propiedades
            c = c.concat( this.first(beta) );
        });

        if (this.tEpsilon(c) && ( gamas.length ) != 1 ){
            let set:Set<string> = new Set(c);  
            set.delete("\u03B5");
            gamas.shift();
            c.concat( this.first(gamas) )
        }



    }
    public readonly follow = (s:Array<string>) => {


    };

    public readonly esTerminal = (gama:string) => {
    
        return true;
    }

    public readonly esEps = (gama:string) => {
        if (gama == "\u03B5")
            return true;
        return false;
    }

    public readonly tEpsilon = (arreglo:Array<string>) => {
        let conjunto = new Set(arreglo) 
        if (conjunto.has("\u03B5"))
            return true;
        return false;
    }



}

export { LL1 };
