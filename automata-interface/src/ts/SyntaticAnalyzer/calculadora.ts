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
    public POT ;
    public PAR_I ;
    public PAR_D;
    public NUM:number;    
    public v:number;
    public lexico:LexicAnalyzer;
    public cadena:string;


    constructor(Cadena: string, Lexico: LexicAnalyzer){
    this.lexico = Lexico;
    this.cadena = Cadena;
    this.v;
    }

    G = (v: number) =>{
        let tok: any;
        if(this.E(v)){
            tok =this.lexico.getToken();
            if (tok == this.NUM )
             return true; 
        }
        return false
    };

    E = (v:number) =>{
        if(this.T(v)){
            if(this.Ep(v))
            return true;
        }return false;
    };
    Ep = (v:number) =>{
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

    T = (v:number) =>{
        if (this.P(v)) {
            if(this.Pp(v))
            return true;
        }return false;
    };

    Tp = (v:number) =>{
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
    this.lexico.regresarToken();
    return true;
    };

    
    P = (v:number) =>{
        if (this.F(v)){
            if (this.Pp(v))
                return true;
        }else 
            return false;
    };

    Pp = (v:number) =>{
        let tok:number;
        let v1:number;
        tok = this.lexico.getToken();
        
        if (tok == this.POT){
            if (this.F(v1)) {
                v= Math.pow(v,v1);

                if (this.Pp(v)) {
                    return true;
                }else 
                    return false;
            }
        }
        this.lexico.regresarToken();
        return true;
    };

    F = (v:number) =>{
        let tok:number;
        tok = this.lexico.getToken();

        switch (tok) {
            case this.PAR_I:
            if (this.E(v)) {
                
                tok = this.lexico.getToken();
                if (tok == this.PAR_D) {
                    return true
                }   
            }return false

            default:
                break;
        }
    }
};
export { calculadora };
