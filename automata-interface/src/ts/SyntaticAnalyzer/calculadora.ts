import { Automaton } from "../Automaton/Automaton";
import Misc from "../Misc/Misc";
import { State } from "../State/State";
import { Transition } from "../Transition/Transition";
import { LexicAnalyzer } from "../LexicAnalizer/LexicAnalizer";

class calculadora{
    public MAS ;
    public MENOS ;
    public PROD ;
    public DIV ;
    public POR ;
    public PAR_I ;
    public PAR_D:string ;
    public NUM:number;    
    public v:number;
    public lexico:LexicAnalyzer;
    public cadena:string;
    constructor(Cadena: string, Lexico: LexicAnalyzer){
    this.lexico = Lexico;
    this.cadena = Cadena;
    this.v=0;
    }

    G = (v: any) =>{
        let tok: any;
        if(this.E(v)){
            tok =this.lexico.getToken();
            if (tok == this.NUM )
             return true; 
        }
        return false
    };

    E = (v:any) =>{
        if(T(v)){
            if(this.Ep(v))
            return true;
        }return false;
    };
    Ep = (v:any) =>{
        let tok: any;
        let v1: number;
        tok = this.lexico.getToken();
        if (tok == MAS || tok == MENOS) {
            
        }

    };

    T = () =>{

    };

    Tp = () =>{

    };
    
    p = () =>{

    };

    Pp = () =>{

    };

    F = () =>{

    }
};
export { calculadora };
