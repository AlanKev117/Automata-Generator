import { Automaton } from "../Automaton/Automaton";
import Misc from "../Misc/Misc";
import { State } from "../State/State";
import { Transition } from "../Transition/Transition";
import { LexicAnalyzer } from "../LexicAnalizer/LexicAnalizer";

class Calculadora{
    //Declaramos todos los tokens
    public MAS:number;
    public MENOS:number;
    public PROD:number;
    public DIV:number;
    public POR:number;
    public POT:number;
    public PAR_I:number;
    public PAR_D:number;
    //operaciones adicionales TENEMOS QUE CREAR LOS LEXICOS DE CADA UNO PARA QUE TENGAN UN TOKEN
    public SIN:number;
    public COS:number;
    public TAN:number;
    public EXP:number;
    public LN:number;
    public LOG:number;
    public NUM:number;    
    public v:number;
    public lexico:LexicAnalyzer;
    public cadena:string;


    constructor(Cadena: string, Lexico: LexicAnalyzer){
    //INICIALIZAMOS NUESTROS TOKENS
    //Declaramos todos los tokens
    this.MAS = 10;
    this.MENOS = 20;
    this.PROD = 30;
    this.DIV = 40;
    this.POR = 50;
    this.POT = 60;
    this.PAR_I = 70;
    this.PAR_D = 80;
    //operaciones adicionales TENEMOS QUE CREAR LOS LEXICOS DE CADA UNO PARA QUE TENGAN UN TOKEN
    this.SIN = 90;
    this.COS = 100;
    this.TAN = 110;
    this.EXP =120;
    this.LN =130;
    this.LOG =140;
    this.lexico = Lexico;
    this.cadena = Cadena;
    var result = 0; 
    }

    G = (v: number) =>{
        let tok: number;
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
        let tok: number;
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
                    return true;
                }   
            }return false
           
            case this.SIN:
            tok = this.lexico.getToken();
                if (tok == this.PAR_I) {
                    if (this.E(v)) {
                        tok = this.lexico.getToken();
                        if (tok == this.PAR_D) {
                            v = Math.sin(v);
                            return true;
                        }
                    }   
                }
                return false;
            
            case this.COS:
            tok = this.lexico.getToken();
                if (tok == this.PAR_I) {
                    if (this.E(v)) {
                        tok = this.lexico.getToken();
                        if (tok == this.PAR_D) {
                            v = Math.cos(v);
                            return true;
                        }
                    }   
                }
                return false;

            case this.TAN:
            tok = this.lexico.getToken();
                if (tok == this.PAR_I) {
                    if (this.E(v)) {
                        tok = this.lexico.getToken();
                        if (tok == this.PAR_D) {
                            v = Math.tan(v);
                            return true;
                        }
                    }   
                }
                return false;
            
            case this.EXP:
            tok = this.lexico.getToken();
                if (tok == this.PAR_I) {
                    if (this.E(v)) {
                        tok = this.lexico.getToken();
                        if (tok == this.PAR_D) {
                            v = Math.exp(v);
                            return true;
                        }
                    }   
                }
                return false;

            case this.LN:
            
            tok = this.lexico.getToken();
            if (tok == this.PAR_I) {
                if (this.E(v)) {
                    tok = this.lexico.getToken();
                    if (tok == this.PAR_D) {
                        v = Math.log(v);
                        return true;
                    }
                }   
            }
            return false;

            case this.LOG:
                        tok = this.lexico.getToken();
                if (tok == this.PAR_I) {
                    if (this.E(v)) {
                        tok = this.lexico.getToken();
                        if (tok == this.PAR_D) {
                            v = Math.log10(v);
                            return true;
                        }
                    }   
                }

                return false;

            case this.NUM:
                return v = parseFloat(this.lexico.getLexem());
            default:
            console.error("Error");
            
            return false;
        }
    }
};
export { Calculadora };
