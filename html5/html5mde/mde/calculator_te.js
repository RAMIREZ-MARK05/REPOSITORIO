// 21.05.2020 - 20.07.2020

// Globale Konstanten

var SIZEY = 12;                                            // Schrifthöhe (Pixel)

// Globale Methoden

// Breite einer Zeichenkette (Pixel):
// s ... Zeichenkette
  
function widthPix (s) {return ctx.measureText(s).width;}

//-------------------------------------------------------------------------------------------------

// Klasse TE (Term oder Gleichung)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value

class TE {

// Konstruktor:
// (x,y) ... Position (Pixel)

  constructor (x, y) {
    this.type = undefined;                                 // Typ (vermutlich unnötig!)
    this.complete = false;                                 // Vollständigkeit
    this.syntax = syntaxOK;                                // Syntaxvariable
    this.runtime = runtimeOK;                              // Laufzeitvariable
    this.width = 0; this.asc = SIZEY; this.desc = 0;       // Abmessungen (Pixel)
    this.x = x; this.y = y;                                // Position (Pixel) übernehmen
    this.value = undefined;                                // Zahlenwert
    }
    
// Verschiebung:
// (dx,dy) ... Verschiebungsvektor (optional)

  move (dx, dy) {
    if (!dx) dx = 0;                                       // Defaultwert für waagrechte Verschiebung
    if (!dy) dy = 0;                                       // Defaultwert für senkrechte Verschiebung
    this.x += dx; this.y += dy;                            // Verschiebung für den Term ohne untergeordnete Teile
    }
    
// Reaktion auf Laufzeitfehler:
// e ... Fehler 
  
  runtimeError (e) {
    alert(e);                                              // Fehlermeldung
    this.runtime = e;                                      // Attributwert von runtime
    this.value = undefined;                                // Attributwert von value
    }
    
// Kommentar zu einem Term bzw. zu einer Gleichung:
// Rückgabewert: Falls fehlerlos, Termart; gegebenenfalls Syntaxfehler oder Laufzeitfehler
  
  comment () {
    var sy = (this.syntax == syntaxOK);                    // Syntax in Ordnung?
    if (sy && this.runtime == runtimeOK)                   // Falls kein Syntax- und kein Laufzeitfehler ... 
      switch(this.type) {                                  // Je nach Termart ...                                
        case "Empty": return empty;                        // Leerer Term
        case "NatNum": return natNum;                      // Natürliche Zahl
        case "FracNum": return fracNum;                    // Bruch oder gemischte Zahl
        case "DecNum": return decNum;                      // Dezimalbruch
        case "Plus": return plus;                          // Plus-Ausdruck
        case "Minus": return minus;                        // Minus-Ausdruck
        case "Brack": return brack;                        // Klammer
        case "Perc": return perc;                          // Prozentsatz
        case "Sum": return sum;                            // Summe
        case "Diff": return diff;                          // Differenz
        case "Prod": return prod;                          // Produkt (mit Multiplikationszeichen)
        case "Prod0": return prod0;                        // Produkt (ohne Multiplikationszeichen) 
        case "Quot": return quot;                          // Quotient (mit Divisionszeichen)
        case "FracTerm": return fracTerm;                  // Bruchterm
        case "Power": return pow;                          // Potenz
        }
    if (sy) return this.runtime;                           // Rückgabewert, falls nur Laufzeitfehler 
    return this.syntax;                                    // Rückgabewert, falls Syntaxfehler
    }
    
  } // Ende der Klasse TE
  
//-------------------------------------------------------------------------------------------------

// Klasse Term (bisher nicht verwendet)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value

class Term extends TE {

  } // Ende der Klasse Term
  
//-------------------------------------------------------------------------------------------------

// Klasse UnTerm (unärer Term)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, argument

class UnTerm extends Term {

// Konstruktor:
// (x,y) ... Position (Pixel)

  constructor (x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.argument = undefined;                             // Argument undefiniert
    }
    
// Hilfsroutine für die Klassen Plus und Minus: Breite des Vorzeichens einschließlich Leerzeichen

  widthSign () {
    var a = this.argument;                                 // Argument
    var n = (a.type == "NatNum" || a.type == "DecNum");    // Flag für Typ NatNum oder DecNum
    return (n ? 1 : 2)*widthPix(" ");                      // Rückgabewert
    }
    
// Verschiebung:
// (dx,dy) ... Verschiebungsvektor (optional)

  move (dx, dy) {
    super.move(dx,dy);                                     // Term insgesamt verschieben (Methode von TE)
    this.argument.move(dx,dy);                             // Argument verschieben
    }

  } // Ende der Klasse UnTerm
  
//-------------------------------------------------------------------------------------------------
  
// Klasse PlusMinus (Plus- oder Minus-Ausdruck):
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, argument
// Es werden alle Attribute außer syntax gesetzt. Beim Attribut value ist in der Klasse Minus noch eine Vorzeichenumkehr nötig.

class PlusMinus extends UnTerm {

// Konstruktor:
// a ....... Array der Bestandteile
// (x,y) ... Position

  constructor (a, x, y) {
    super(x,y);                                            // UnTerm-Konstruktor aufrufen
    this.argument = constrTerm(a[1],x,y);                  // Argument an vorläufiger Position
    var arg = this.argument;                               // Abkürzung für Argument
    arg.move(this.widthSign(),0);                          // Argument an endgültiger Position 
    this.complete = arg.complete;                          // Vollständigkeit
    this.runtime = arg.runtime;                            // Laufzeit-Attribut 
    this.setMetrics();                                     // Abmessungen (Pixel)
    this.value = arg.value;                                // Vorläufiger Wert (gilt für Plus-Ausdruck)
    }

// Abmessungen:
    
  setMetrics () {
    var a = this.argument;                                 // Argument
    this.width = this.widthSign()+a.width;                 // Breite (Pixel)
    this.asc = a.asc; this.desc = a.desc;                  // Abmessungen senkrecht (Pixel)
    }
    
// Grafikausgabe:
// ch ... Vorzeichen ('+' oder '-')
// c .... Flag für Cursor (optional, Defaultwert true)

  writePlusMinus (ch, c) {
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    ctx.fillText(ch,this.x,this.y);                        // Vorzeichen
    var a = this.argument;                                 // Argument
    a.write(a.x,this.y,c);                                 // Argument ausgeben
    }
    
  }
  
//-------------------------------------------------------------------------------------------------

// Klasse BinTerm (binärer Term)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, left, right

class BinTerm extends Term {

// Konstruktor:
// (x,y) ... Position (Pixel)

  constructor (x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.left = this.right = undefined;                    // Operanden undefiniert
    }
    
// Attributwert von runtime setzen: 

  setRuntime () {
    var op1 = this.left, op2 = this.right;                 // Operanden
    var rt1 = op1.runtime, rt2 = op2.runtime;              // Attributwerte runtime für Operanden
    if (rt1 == runtimeOK) this.runtime = rt2;              // Falls 1. Operand okay, Attributwert vom 2. Operanden übernehmen
    else throw rt1;                                        // Andernfalls Ausnahme, da Fehler endgültig
    }
    
// Verschiebung:
// (dx,dy) ... Verschiebungsvektor (optional)

  move (dx, dy) {
    super.move(dx,dy);                                     // Term insgesamt verschieben (Methode von TE)
    this.left.move(dx,dy);                                 // 1. Operanden verschieben
    this.right.move(dx,dy);                                // 2. Operanden verschieben
    }
    
  } // Ende der Klasse BinTerm
  
//-------------------------------------------------------------------------------------------------
  
// Klasse SDPQ (Summe, Differenz, Produkt mit Multiplikationszeichen oder Quotient)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, left, right

class SDPQ extends BinTerm {

// Konstruktor:
// a ....... Array der Bestandteile (Rechenzeichen und Operanden als Zeichenketten)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(x,y);                                            // BinTerm-Konstruktor aufrufen
    var op1 = this.left = constrTerm(a[1],x,y);            // 1. Operand
    var ch = a[0];                                         // Rechenzeichen
    var w0 = widthPix(" "+ch+" ");                         // Breite von Rechen- und Leerzeichen (Pixel)
    var w1 = op1.width+w0;                                 // Breite 1. Operand, Rechen- und Leerzeichen (Pixel)
    var op2 = this.right = constrTerm(a[2],x+w1,y);        // 2. Operand
    this.complete = op1.complete && op2.complete;          // Vollständigkeit
    this.setSyntax();                                      // Attribut syntax
    this.setRuntime();                                     // Attribut runtime
    this.width = w1+op2.width;                             // Gesamte Breite (Pixel) 
    this.asc = Math.max(op1.asc,op2.asc);                  // Platzbedarf nach oben (Pixel)
    this.desc = Math.max(op1.desc,op2.desc);               // Platzbedarf nach unten (Pixel)
    }
    
// Attributwert von syntax setzen: 
// e ... Flag für Auslösung einer Ausnahme (optional, Defaultwert true)
  
  setSyntax (e) {
    if (e == undefined) e = true;                          // Falls nötig, Defaultwert für e
    var op1 = this.left, op2 = this.right;                 // Operanden
    var sy1 = op1.syntax, sy2 = op2.syntax;                // Attributwerte syntax für Operanden
    if (sy1 == syntaxOK) this.syntax = sy2;                // Falls 1. Operand okay, Attributwert vom 2. Operanden übernehmen
    else if (e) throw sy1;                                 // Falls Flag gesetzt und 1. Operand endgültig fehlerhaft, Ausnahme
    else this.syntax = sy1;                                // Falls 1. Operand noch nicht okay, Attributwert syntax
    }
    
// Grafikausgabe:
// ch ... Rechenzeichen
// c .... Flag für Cursor (optional, Defaultwert true)
  
  writeSDPQ (ch, c) {
    var op1 = this.left, op2 = this.right;                 // Operanden
    op1.write(op1.x,op1.y,false);                          // 1. Operand (ohne Cursor)
    var x = this.x+op1.width+widthPix(" ");                // Position des Rechenzeichens (Pixel)
    ctx.fillText(ch,x,this.y);                             // Rechenzeichen
    op2.write(op2.x,op2.y,c);                              // 2. Operand (eventuell mit Cursor)
    }

  } // Ende der Klasse SDPQ
  
//-------------------------------------------------------------------------------------------------

// Klasse Sum (Summe)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, left, right

class Sum extends SDPQ {

// Konstruktor:
// a ....... Array der Bestandteile (Pluszeichen, 1. und 2. Summand)
// (x,y) ... Position (Pixel)
    
  constructor (a, x, y) {
    super(a,x,y);                                          // SDPQ-Konstruktor aufrufen
    this.type = "Sum";                                     // Vermutlich unnötig!
    if (a[2] == "") this.syntax = missingSummand;          // Fehlender Summand?
    var op1 = this.left, op2 = this.right;                 // Operanden
    this.value = addRatVal(op1.value,op2.value);           // Wert der Summe
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    this.writeSDPQ("+",c);                                 // Methode von SDPQ aufrufen
    }
    
  } // Ende der Klasse Sum
  
//-------------------------------------------------------------------------------------------------

// Klasse Diff (Differenz)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, left, right

class Diff extends SDPQ {

// Konstruktor:
// a ....... Array der Bestandteile (Minuszeichen, Minuend, Subtrahend)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(a,x,y);                                          // SDPQ-Konstruktor aufrufen
    this.type = "Diff";                                    // Vermutlich unnötig!
    if (a[2] == "") this.syntax = missingSubtrahend;       // Fehlender Subtrahend?
    var op1 = this.left, op2 = this.right;                 // Operanden
    this.value = subRatVal(op1.value,op2.value);           // Wert der Differenz
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    this.writeSDPQ(symbolMinus,c);                         // Methode von SDPQ aufrufen
    }

  } // Ende der Klasse Diff
  
//-------------------------------------------------------------------------------------------------

// Klasse Prod (Produkt mit Multiplikationszeichen)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, left, right

class Prod extends SDPQ {

// Konstruktor:
// a ....... Array der Bestandteile (Multiplikationszeichen und Faktoren)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(a,x,y);                                          // SDPQ-Konstruktor aufrufen
    this.type = "Prod";                                    // Vermutlich unnötig!
    if (a[1] == "") throw missingFactor1;                  // Fehlender 1. Faktor?
    if (a[2] == "") this.syntax = missingFactor2;          // Fehlender 2. Faktor?
    var op1 = this.left, op2 = this.right;                 // Operanden
    this.value = mulRatVal(op1.value,op2.value);           // Wert des Produkts
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    this.writeSDPQ(symbolMult,c);                          // Methode von SDPQ aufrufen
    }

  } // Ende der Klasse Prod
  
//-------------------------------------------------------------------------------------------------

// Klasse Prod0 (Produkt ohne Multiplikationszeichen):
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, left, right

class Prod0 extends BinTerm {

// Konstruktor:
// a ....... Array der Bestandteile (Faktoren)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(x,y);                                            // BinTerm-Konstruktor aufrufen
    this.type = "Prod0";                                   // Typ (vermutlich unnötig)
    var op1 = this.left = constrTerm(a[0],x,y);            // 1. Faktor
    var w0 = widthPix(" ");                                // Breite eines Leerzeichens (Pixel)
    var w1 = op1.width+w0;                                 // Breite 1. Faktor, Leerzeichen (Pixel)
    var op2 = this.right = constrTerm(a[1],x+w1,y);        // 2. Faktor
    this.complete = op1.complete && op2.complete;          // Vollständigkeit
    this.setSyntax();                                      // Attribut syntax
    this.setRuntime();                                     // Attribut runtime
    this.width = w1+op2.width;                             // Gesamte Breite (Pixel) 
    this.asc = Math.max(op1.asc,op2.asc);                  // Platzbedarf nach oben (Pixel)
    this.desc = Math.max(op1.desc,op2.desc);               // Platzbedarf nach unten (Pixel)
    this.value = mulRatVal(op1.value,op2.value);           // Wert des Produkts
    }
    
// Attributwert von syntax setzen: 
// e ... Flag für Auslösung einer Ausnahme (optional, Defaultwert true)
  
  setSyntax (e) {
    if (e == undefined) e = true;                          // Falls nötig, Defaultwert für e
    var op1 = this.left, op2 = this.right;                 // Operanden
    var sy1 = op1.syntax, sy2 = op2.syntax;                // Attributwerte syntax für Operanden
    if (sy1 == syntaxOK) this.syntax = sy2;                // Falls 1. Operand okay, Attributwert vom 2. Operanden übernehmen
    else if (e) throw sy1;                                 // Falls Flag gesetzt und 1. Operand endgültig fehlerhaft, Ausnahme
    else this.syntax = sy1;                                // Falls 1. Operand noch nicht okay, Attributwert syntax
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    var op1 = this.left, op2 = this.right;                 // Abkürzungen für Faktoren
    op1.write(x,y,false);                                  // 1. Faktor (ohne Cursor)
    op2.write(op2.x,y,c);                                  // 2. Faktor    
    }

  } // Ende der Klasse Prod0
  
//-------------------------------------------------------------------------------------------------

// Klasse Quot (Quotient mit Divisionszeichen)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, left, right

class Quot extends SDPQ {

// Konstruktor:
// a ....... Array der Bestandteile (Divisionszeichen, Dividend, Divisor)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(a,x,y);                                          // SDPQ-Konstruktor aufrufen
    this.type = "Quot";                                    // Vermutlich unnötig!
    if (a[1] == "") throw missingDividend;                 // Fehlender Dividend?
    if (a[2] == "") this.syntax = missingDivisor;          // Fehlender Divisor?
    var op1 = this.left, op2 = this.right;                 // Operanden
    var r = op2.value;                                     // Wert des Divisors oder undefined
    if (r && r.numerator == 0n)                            // Falls Divisor definiert und gleich 0 ...
      this.runtimeError(divisionByZero);                   // Laufzeitfehler
    else this.value = divRatVal(op1.value,op2.value);      // Wert des Quotienten
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    this.writeSDPQ(symbolDiv,c);                           // Methode von SDPQ aufrufen
    }

  } // Ende der Klasse Quot
  
//-------------------------------------------------------------------------------------------------

// Klasse FracTerm (Bruchterm)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, left, right, state

class FracTerm extends BinTerm {

// Konstruktor:
// a ....... Array der Bestandteile (Zustand, Zähler, Nenner)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(x,y);                                            // BinTerm-Konstruktor aufrufen
    this.type = "FracTerm";                                // Typ (vermutlich unnötig)
    this.state = (a[0]=="1" ? 1 : 2);                      // Zustand (1 für Zähler oder 2 für Nenner)
    this.left = constrTerm(a[1],x,y);                      // Zähler an vorläufiger Position
    if (a[0] == "1") {                                     // Falls kein Slash vorhanden ...
      var c = false;                                       // Flag für vollständigen Nenner
      this.right = new Empty(x,y);                         // Leerer Nenner an vorläufiger Position
      }
    else {                                                 // Falls Slash vorhanden ...
      c = (a[0] == "3");                                   // Flag für vollständigen Nenner
      this.right = constrTerm(a[2],x,y);                   // Nenner an vorläufiger Position
      }
    var op1 = this.left, op2 = this.right;                 // Abkürzungen für Zähler und Nenner
    this.complete = op1.complete && op2.complete && c;     // Vollständigkeit
    this.setSyntax(c);                                     // Attribut syntax, Ausnahmen
    this.setMetrics();                                     // Abmessungen und endgültige Position von Zähler und Nenner
    var v1 = op1.value, v2 = op2.value;                    // Werte von Zähler und Nenner (eventuell undefiniert)
    if (v2 && v2.numerator == 0n && this.complete)         // Falls Nenner definiert und gleich 0 ...
      this.runtimeError(divisionByZero);                   // Laufzeitfehler
    else this.value = divRatVal(v1,v2);                    // Wert des Bruchterms (Normalfall)
    if (!this.complete) this.value = undefined;            // Falls Bruchterm unvollständig, Wert undefiniert
    }
    
// Attributwert von syntax, Ausnahmen:
// c ... Flag für abgeschlossenen Nenner bzw. Bruchterm

  setSyntax (c) {
    var op1 = this.left, op2 = this.right;                 // Abkürzungen für Zähler und Nenner
    if (this.state == 1) {                                 // Falls noch kein Bruchstrich ...
      if (op1.type == "Empty")                             // Falls noch kein Zähler ... 
        this.syntax = missingNumerator;                    // Attributwert syntax (Zähler fehlt)
      else if (op1.syntax != syntaxOK)                     // Falls Zähler mit Syntaxfehler ... 
        this.syntax = op1.syntax;                          // Attributwert syntax vom Zähler übernehmen
      else this.syntax = openNumerator;                    // Sonst Attributwert syntax (Zähler nicht abgeschlossen)
      }
    else {                                                 // Falls Bruchstrich vorhanden ...
      if (op1.type == "Empty") throw missingNumerator;     // Falls kein Zähler, Ausnahme
      if (op1.syntax != syntaxOK) throw op1.syntax;        // Falls Zähler mit Syntaxfehler, Ausnahme
      if (op2.type == "Empty")                             // Falls noch kein Nenner ...
        this.syntax = missingDenominator;                  // Attributwert syntax (Nenner fehlt)
      else if (op2.syntax != syntaxOK)                     // Falls Nenner mit Syntaxfehler ...
        this.syntax = op2.syntax;                          // Attributwert syntax vom Nenner übernehmen
      else this.syntax = (c ? syntaxOK : openDenominator); // Sonst Attributwert syntax 
      }
    if (!c) return;                                        // Falls Bruchterm nicht abgeschlossen, abbrechen
    if (op2.type == "Empty") throw missingDenominator;     // Falls Bruchterm abgeschlossen und Nenner leer, Ausnahme
    if (op2.syntax != syntaxOK) throw op2.syntax;          // Falls Bruchterm abgeschlossen und Nenner fehlerhaft, Ausnahme
    }
    
// Abmessungen und endgültige Position von Zähler und Nenner:

  setMetrics () {
    var w0 = widthPix(" ");                                // Breite eines Leerzeichens (Pixel)
    var op1 = this.left, op2 = this.right;                 // Abkürzungen für Zähler und Nenner
    var w1 = op1.width, w2 = op2.width;                    // Breite von Zähler und Nenner (Pixel)
    this.width = Math.max(w1,w2)+2*w0;                     // Breite des Bruchterms (Pixel)
    var asc1 = op1.asc, desc1 = op1.desc;                  // Senkrechte Abmessungen Zähler (Pixel)
    var asc2 = op2.asc, desc2 = op2.desc;                  // Senkrechte Abmessungen Nenner (Pixel)
    this.asc = SIZEY+asc1+desc1; this.desc = asc2+desc2;   // Senkrechte Abmessungen Bruchterm (Pixel)
    op1.move((this.width-w1)/2,-desc1-SIZEY);              // Zähler an endgültige Position verschieben
    op2.move((this.width-w2)/2,asc2);                      // Nenner an endgültige Position verschieben
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    line(x,y-3,x+this.width,y-3);                          // Bruchstrich
    var op1 = this.left, op2 = this.right;                 // Zähler und Nenner (eventuell undefiniert)
    op1.write(op1.x,op1.y,c&&this.state==1);               // Zähler (eventuell mit Cursor)
    op2.write(op2.x,op2.y,c&&this.state==2&&!this.complete);  // Nenner (eventuell mit Cursor)
    var xc = x+this.width+widthPix(" ");                   // Position des Cursors (Pixel)
    if (this.complete && c) cursor(xc,y);                  // Eventuell Cursor nach dem Bruchterm
    }
    
  } // Ende der Klasse FracTerm
  
//-------------------------------------------------------------------------------------------------

// Klasse Power (Potenz)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, left, right

// Konstruktor:
// a ....... Array der Bestandteile (Zustand, Basis, Exponent)
// (x,y) ... Position (Pixel)

class Power extends BinTerm {

  constructor (a, x, y) {
    super(x,y);                                            // BinTerm-Konstruktor aufrufen
    this.type = "Power";                                   // Typ (vermutlich unnötig)
    this.left = constrTerm(a[1],x,y);                      // Basis
    var op1 = this.left, v1 = op1.value;                   // Basis und Wert des Basis (Typ RatVal)  
    this.right = constrTerm(a[2],x+op1.width,y);           // Exponent an vorläufiger Position
    var op2 = this.right, v2 = op2.value;                  // Exponent und Wert des Exponenten (Typ RatVal)
    var c = (a[0] == "2");                                 // Flag für abgeschlossenen Exponenten
    this.complete = op1.complete && op2.complete && c;     // Vollständigkeit 
    this.setSyntax(c);                                     // Syntax, Ausnahmen
    this.setMetrics();                                     // Abmessungen und endgültige Position des Exponenten
    var big1 = (v2 && compare(v2,new RatVal("1000")) > 0); // Flag für Exponent über 1000
    var big2 = (v2 && compare(v2,new RatVal("-1000")) < 0);// Flag für Exponent unter -1000
    var big = big1 || big2;                                // Flag für zu großen Betrag des Exponenten
    if (v2 && !isInteger(v2) && c)                         // Falls Exponent vollständig und nicht ganzzahlig ... 
      this.runtimeError(notIntegerExponent);               // Laufzeitfehler
    else if (signum(v1) == 0 && v2 && signum(v2) < 0 && c) // Falls Basis 0 und negativer Exponent ...
      this.runtimeError(divisionByZero);                   // Laufzeitfehler 
    else if (big && c)                                     // Falls Exponent größer als 1000 ...
      this.runtimeError(tooBigExponent);                   // Laufzeitfehler
    else if (!big) this.value = powRatVal(v1,v2);          // Wert der Potenz (Normalfall)
    if (!this.complete || big) this.value = undefined;     // Falls Potenz unvollständig, Wert undefiniert
    }
    
// Attributwert von syntax, Ausnahmen:
// c ... Flag für abgeschlossenen Exponenten

  setSyntax (c) {
    var sy1 = this.left.syntax, sy2 = this.right.syntax;   // Attributwerte syntax für Operanden
    var t1 = this.left.type, t2 = this.right.type;         // Typen der Operanden
    if (t1 == "Empty") throw missingBase;                  // Falls keine Basis, Ausnahme
    if (t1 == "FracNum") throw missingBracket;             // Falls Basis gebrochen, Ausnahme
    if (sy1 != syntaxOK) throw ls;                         // Falls Basis fehlerhaft, Ausnahme
    if (t2 == "Empty") this.syntax = missingExponent;      // Falls kein Exponent ...
    else if (!c) {                                         // Falls Exponent nicht leer und nicht abgeschlossen ...
      if (sy2 == syntaxOK) this.syntax = openExponent;     // Entweder unvollständiger Exponent ...
      else this.syntax = sy2;                              // ... oder Attribut syntax vom Exponenten übernehmen
      }
    else {                                                 // Falls Exponent nicht leer und abgeschlossen ...
      if (sy2 != syntaxOK) throw rs;                       // Falls endgültiger Fehler, Ausnahme
      else this.syntax = syntaxOK;                         // Sonst Syntax in Ordnung
      }
    }
    
// Abmessungen und endgültige Position des Exponenten:

  setMetrics () {
    var op1 = this.left, op2 = this.right;                 // Abkürzungen für Basis und Exponent
    this.width = op1.width+op2.width;                      // Gesamte Breite (Pixel)
    var asc1 = op1.asc, desc1 = op1.desc;                  // Senkrechte Abmessungen Basis (Pixel)
    var asc2 = op2.asc, desc2 = op2.desc;                  // Senkrechte Abmessungen Exponent (Pixel)
    this.asc = Math.max(asc2+SIZEY+desc2,asc1);            // Platzbedarf nach oben (Pixel)
    this.desc = desc1;                                     // Platzbedarf nach unten (Pixel)
    op2.move(0,-desc2-SIZEY);                              // Exponent an endgültige Position verschieben
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    var op1 = this.left, op2 = this.right;                 // Basis und Exponent
    op1.write(op1.x,op1.y,false);                          // Basis (ohne Cursor)
    op2.write(op2.x,op2.y,c&&!this.complete);              // Exponent
    var xc = x+this.width+widthPix(" ");                   // Cursorposition (Pixel)
    if (this.complete && c) cursor(xc,y);                  // Eventuell Cursor nach der Potenz
    }

  } // Ende der Klasse Power
  
//-------------------------------------------------------------------------------------------------

// Klasse Plus (Plus-Ausdruck)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, argument

class Plus extends PlusMinus {

// Konstruktor:
// a ....... Array der Bestandteile (Pluszeichen, Argument)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(a,x,y);                                          // PlusMinus-Konstruktor aufrufen
    this.type = "Plus";                                    // Typ (vermutlich unnötig)
    var arg = this.argument;                               // Abkürzung für Argument
    this.syntax = (a[1]=="" ? openPlus : arg.syntax);      // Attribut syntax
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    this.writePlusMinus("+",c);                            // Methode von PlusMinus aufrufen
    }
    
  } // Ende der Klasse Plus
  
//-------------------------------------------------------------------------------------------------
  
// Klasse Minus (Minus-Ausdruck)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, argument

class Minus extends PlusMinus {

// Konstruktor:
// a ....... Array der Bestandteile (Minuszeichen, Minuend, Subtrahend)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(a,x,y);                                          // PlusMinus-Konstruktor aufrufen
    this.type = "Minus";                                   // Typ (vermutlich unnötig)
    var arg = this.argument;                               // Abkürzung für Argument
    this.syntax = (a[1]=="" ? openMinus : arg.syntax);     // Attribut syntax
    this.value = negateRatVal(this.value);                 // Vorzeichenumkehr
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    this.writePlusMinus(symbolMinus,c);                    // Methode von PlusMinus aufrufen
    }
  
  } // Ende der Klasse Minus
  
//-------------------------------------------------------------------------------------------------

// Brack (unvollständige oder vollständige Klammer)
// Attribute type, complete, syntax, runtime, width, asc, desc, x, y, value, argument

class Brack extends UnTerm {

// Konstruktor:
// a ....... Array der Bestandteile
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(x,y);                                            // UnTerm-Konstruktor aufrufen
    this.type = "Brack";                                   // Typ (vermutlich unnötig)
    if (a[0] == "2" && a[1] == "") throw emptyBracket;     // Falls leere Klammer, Ausnahme
    var w0 = widthPix("(");                                // Breite der öffnenden Klammer (Pixel)
    var arg = this.argument = constrTerm(a[1],x+w0,y);     // Inhalt der Klammer
    var c = (a[0] == "2");                                 // Flag für vollständige Klammer
    if (arg.syntax != syntaxOK)                            // Falls Inhalt der Klammer fehlerhaft oder unvollständig ...
      this.syntax = arg.syntax;                            // Attribut syntax vom Argument übernehmen
    else if (!c) this.syntax = openBracket;                // Falls Inhalt korrekt, aber Klammer unvollständig, Syntax-Variable
    if (c && this.syntax != syntaxOK) throw this.syntax;   // Falls endgültiger Fehler, Ausnahme
    this.complete = c && arg.complete;                     // Vollständigkeit
    this.runtime = arg.runtime;                            // Attribut runtime vom Argument übernehmen
    this.width = arg.width+2*w0;                           // Breite (Pixel)
    this.asc = arg.asc; this.desc = arg.desc;              // Abmessungen senkrecht (Pixel)
    if (!c) this.value = undefined;                        // Wert einer offenen Klammer
    else this.value = arg.value;                           // Wert einer vollständigen Klammer
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    ctx.fillText("(",x,y);                                 // Klammer auf
    var co = this.complete;                                // Flag für Vollständigkeit
    var a = this.argument;                                 // Abkürzung für Inhalt der Klammer
    a.write(a.x,a.y,c&&!co);                               // Inhalt der Klammer
    if (!co) return;                                       // Falls Klammer unvollständig, abbrechen
    var xe = a.x+a.width;                                  // Position Klammerende (Pixel)
    ctx.fillText(")",xe,y);                                // Klammer zu
    var w0 = widthPix("(");                                // Breite der öffnenden Klammer (Pixel)
    if (c) cursor(xe+2*w0,y);                              // Falls gewünscht, Cursor 
    }

  } // Ende der Klasse Brack
  
//-------------------------------------------------------------------------------------------------

// Klasse Perc (Prozentsatz)
// Attribute type, complete, syntax, runtime, width, asc, desc, x, y, value, argument

class Perc extends UnTerm {

  constructor (s, x, y) {
    super(x,y);                                            // UnTerm-Konstruktor aufrufen
    this.type = "Perc";                                    // Typ (vermutlich unnötig)
    var sArg = s.substring(0,s.length-1);                  // Zeichenkette ohne Prozentzeichen
    var a = this.argument = constrTerm(sArg,x,y);          // Prozentzahl
    this.complete = a.complete;                            // Vollständigkeit
    this.syntax = a.syntax;                                // Attribut syntax vom Argument übernehmen
    this.runtime = a.runtime;                              // Attribut runtime vom Argument übernehmen 
    this.width = a.width+widthPix(" %");                   // Gesamte Breite (Pixel)
    var h = new RatVal("100");                             // Zahl 100
    this.value = divRatVal(a.value,h);                     // Wert
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    var a = this.argument;                                 // Abkürzung für Argument (Prozentzahl)
    a.write(x,y,false);                                    // Prozentzahl (ohne Cursor)
    ctx.fillText(" %",x+a.width,y);                        // Leerzeichen und Prozentzeichen
    if (c) cursor(x+this.width,y);                         // Falls gewünscht, Cursor
    }
    
  } // Ende der Klasse Perc
  
//-------------------------------------------------------------------------------------------------

// NatNum (natürliche Zahl oder 0)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, stringNat

class NatNum extends Term {

// Konstruktor:
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)

  constructor (s, x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.type = "NatNum";                                  // Typ (vermutlich unnötig)
    this.complete = (s.length > 0);                        // Vollständigkeit
    this.stringNat = (this.complete ? s : "0");            // Zahl als Zeichenkette
    if (like(this.stringNat,"0\\d+")) throw leadingZero;   // Falls führende Null, Ausnahme
    this.width = widthPix(this.stringNat);                 // Breite (Pixel)
    this.value = new RatVal(this.stringNat);               // Wert der Zahl (RatVal-Objekt)
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    ctx.fillText(this.stringNat,x,y);                      // Zahl
    if (c) cursor(x+this.width,y);                         // Falls gewünscht, Cursor
    }
    
  } // Ende der Klasse NatNum
  
//-------------------------------------------------------------------------------------------------

// Klasse FracNum (Bruch oder gemischte Zahl)
// Attribute type, complete, syntax, runtime, width, asc, desc, x, y, value, state, stringInt, stringNum, stringDenom

class FracNum extends Term {

// Konstruktor:
// a ....... Array der Bestandteile (ganze Zahl, Zähler, Nenner)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.type = "FracNum";                                 // Typ (vermutlich unnötig)
    this.state = (a.length==2 ? 1 : 2);                    // Zustand (1 für Zähler oder 2 für Nenner)
    this.stringInt = a[0];                                 // Zeichenkette für ganze Zahl
    this.stringNum = a[1];                                 // Zeichenkette für Zähler (eventuell leer)
    this.stringDenom = (a.length>2 ? a[2] : "");           // Zeichenkette für Nenner (eventuell leer)
    if (like(this.stringNum,"0\\d+")) throw leadingZero;   // Falls führende Null im Zähler, Ausnahme 
    if (like(this.stringDenom,"0\\d+")) throw leadingZero; // Falls führende Null im Nenner, Ausnahme
    this.complete = (a.length == 3 && a[2] != "");         // Vollständigkeit
    if (this.stringNum == "") {                            // Falls kein Zähler ...
      if (a.length == 3) throw missingNumerator;           // Falls Fehler endgültig, Ausnahme                    
      else this.syntax = missingNumerator;                 // Sonst Attributwert syntax
      }  
    else if (this.stringDenom == "")                       // Falls Zähler vorhanden, aber kein Nenner ...
      this.syntax = missingDenominator;                    // Attributwert syntax
    this.setMetrics();                                     // Abmessungen
    var v1 = new RatVal(this.stringInt);                   // Wert der ganzen Zahl (eventuell 0)
    if (this.stringDenom == "0")                           // Falls Nenner gleich 0 ...
      this.runtimeError(divisionByZero);                   // Laufzeitfehler
    else var v2 = new RatVal(this.stringNum,this.stringDenom); // Falls Nenner ungleich 0, Wert des Bruchs
    this.value = addRatVal(v1,v2);                         // Wert insgesamt
    if (!this.complete) this.value = undefined;            // Wert, falls Term unvollständig  
    }
    
// Abmessungen:
  
  setMetrics () {
    var w0 = widthPix(this.stringInt);                     // Breite der ganzen Zahl (Pixel)
    var w1 = widthPix(this.stringNum);                     // Breite des Zählers (Pixel)
    var w2 = widthPix(this.stringDenom);                   // Breite des Nenners (Pixel)
    this.width = w0+Math.max(w1,w2);                       // Breite insgesamt (Pixel)
    this.asc = 1.5*SIZEY; this.desc = 0.5*SIZEY;           // Abmessungen senkrecht (Pixel)
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell Verschiebung
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    var w0 = widthPix(this.stringInt);                     // Breite der ganzen Zahl (Pixel)
    ctx.fillText(this.stringInt,x,y);                      // Ganze Zahl
    var x1 = x+w0;                                         // Position am Anfang des Bruchs (Pixel)
    writeFrac2(this.stringNum,this.stringDenom,x1,y);      // Bruch
    if (!c) return;                                        // Falls kein Cursor, abbrechen
    var w1 = widthPix(this.stringNum);                     // Breite des Zählers (Pixel)
    if (this.state == 1) cursor(x1+w1,y-7);                // Gegebenenfalls Cursor im Zähler
    var h = (this.stringDenom=="" ? widthPix(" ") : 0);    // Hilfsgröße (Pixel)
    if (this.state == 2) cursor(x+this.width-h,y+7);       // Gegebenenfalls Cursor im Nenner
    }
    
  } // Ende der Klasse FracNum
  
//-------------------------------------------------------------------------------------------------

// Klasse DecNum (endlicher oder unendlicher Dezimalbruch)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value, stringInt, stringDec, stringPer

class DecNum extends Term {

// Konstruktor:
// a ....... Array der Bestandteile (ganze Zahl, normale Nachkommastellen, Periode)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.type = "DecNum";                                  // Typ (vermutlich unnötig)
    this.stringInt = a[0];                                 // Zeichenkette für ganze Zahl
    if (this.stringInt == "") throw missingInteger;        // Falls keine ganze Zahl, Ausnahme
    this.stringDec = a[1];                                 // Zeichenkette für normale Nachkommastellen
    this.stringPer = (a.length>2 ? a[2] : "");             // Zeichenkette für periodische Nachkommastellen
    var c1 = (a.length == 2 && a[1] != "");                // 1. Möglichkeit für vollständigen Term
    var c2 = (a.length == 3 && a[2] != "");                // 2. Möglichkeit für vollständigen Term
    this.complete = (c1 || c2);                            // Vollständigkeit
    if (a.length == 2 && a[1] == "")                       // Falls keine Nachkommastellen ...
      this.syntax = missingFractionalPart;                 // Syntax-Attribut    
    else if (a.length == 3 && a[2] == "")                  // Falls Strichpunkt, aber keine Periode ...
      this.syntax = missingPeriod;                         // Syntax-Attribut
    this.setWidth();                                       // Breite (Pixel)
    var n = BigInt(this.stringInt);                        // Variable für Zähler (Startwert entsprechend ganzer Zahl)
    var d = 1n;                                            // Variable für Nenner (Startwert 1)
    for (var k=0; k<this.stringDec.length; k++) d = d*10n; // Zehnerpotenz für 1. Faktor des Nenners
    n = n*d+BigInt(this.stringDec);                        // Zähler berücksichtigt normale Nachkommastellen
    var d2 = 1n;                                           // Variable für 2. Faktor des Nenners
    for (k=0; k<this.stringPer.length; k++) d2 = d2*10n;   // Zehnerpotenz für 2. Faktor des Nenners
    d2 = d2-1n;                                            // 2. Faktor gleich Zehnerpotenz minus 1
    if (d2 != 0n) {                                        // Falls periodische Stellen vorhanden ...                                    
      n = n*d2+BigInt(this.stringPer);                     // Zähler aktualisieren
      d = d*d2;                                            // Nenner aktualisieren
      }
    this.value = new RatVal(n,d);                          // Wert des gesamten Dezimalbruchs
    if (!this.complete) this.value = undefined;            // Wert, falls Term unvollständig       
    }
    
// Ermittlung des Attributwerts width:
  
  setWidth () {
    var w0 = widthPix(this.stringInt);                     // Breite Vorkommastellen (Pixel)
    var wds = widthPix(decimalSeparator);                  // Breite Dezimaltrennzeichen (Pixel)
    var w1 = widthPix(this.stringDec);                     // Breite der nicht periodischen Nachkommastellen (Pixel)
    var w2 = widthPix(this.stringPer);                     // Breite der periodischen Nachkommastellen (Pixel)
    this.width = w0+wds+w1+w2;                             // Breite insgesamt (Pixel)
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell Verschiebung
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    var w0 = widthPix(this.stringInt);                     // Breite der ganzen Zahl (Pixel)
    ctx.fillText(this.stringInt+decimalSeparator,x,y);     // Ganze Zahl und Dezimaltrennzeichen
    var x1 = x+w0+widthPix(decimalSeparator);              // Position für Anfang der Nachkommastellen (Pixel)
    ctx.fillText(this.stringDec,x1,y);                     // Nicht periodische Nachkommastellen
    var x2 = x1+widthPix(this.stringDec);                  // Position nach den normalen Nachkommastellen (Pixel)
    if (this.stringPer == "") {                            // Falls endlicher Dezimalbruch ...
      if (c) cursor(x2,y);                                 // Falls gewünscht, Cursor
      return;                                              // Abbrechen                         
      }
    overline(this.stringPer,x2,y);                         // Periodische Nachkommastellen mit Linie darüber (Metode aus ratval.js)
    if (c) cursor(x+this.width,y);                         // Gegebenfalls Cursor
    }

  } // Ende der Klasse DecNum
  
//-------------------------------------------------------------------------------------------------

// Empty (leerer Term)
// Attribute type (?), complete, syntax, runtime, width, asc, desc, x, y, value

class Empty extends Term {

// Konstruktor:
// (x,y) ... Position (Pixel)

  constructor (x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.type = "Empty";                                   // Typ (vermutlich unnötig)
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag für Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Verschiebung
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    if (c) cursor(x,y);                                    // Falls gewünscht, Cursor
    }
    
  } // Ende der Klasse Empty
  



  
 
  


