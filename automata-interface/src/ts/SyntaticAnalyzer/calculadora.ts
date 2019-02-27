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
    this.v;
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
        if(this.T(v)){
            if(this.Ep(v))
            return true;
        }return false;
    };
    Ep = (v:any) =>{
        let tok: any;
        let v1: number;
        tok = this.lexico.getToken();
        if (tok == this.MAS || tok == this.MENOS) {
            if (this.T(v1)) {
               v +=  (tok == this.MAS)? v1: -v1;
               if (this.Ep(v) ){
                    return true;
               }return false;
            }
        }
        this.lexico.regresarToken();
        return true;

    };

    T = (v:any) =>{
        if (this.P(v)) {
            if(this.Pp(v))
            return true;
        }return false;
    };

    Tp = (v:any) =>{
    let tok:number;
    let v1:number;
    tok = this.lexico.getToken();
    if (tok == this.PROD || tok == this.DIV) {
        if (this.P(v1)) {
            v *= (tok == this.PROD)? v1: 1.0/v1; 
            if (this.Tp(v)) 
                return true;
            return false;
        }
    }
    };
    
    P = (v:any) =>{
        return false;
    };

    Pp = (v:any) =>{
        return true;
    };

    F = (v:any) =>{

    }
};
export { calculadora };
