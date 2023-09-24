// Klassen f�r Online-Rechner Aussagenlogik
// 11.08.2021 - 14.08.2021

// Klasse Term
// Attribute type, complete, syntax, width, x, y

class Term {

// Konstruktor:
// (x,y) ... Position (Pixel)

  constructor (x, y) {
    this.type = undefined;                                 // Termart
    this.complete = false;                                 // Vollst�ndigkeit
    this.syntax = syntaxOK;                                // Syntaxvariable
    this.width = 0;                                        // Breite (Pixel)
    this.x = x; this.y = y;                                // Position (Pixel) �bernehmen
    }
    
// Verschiebung:
// (dx,dy) ... Verschiebungsvektor (Pixel)

  move (dx, dy) {
    this.x += dx; this.y += dy;                            // Verschiebung f�r den Term ohne untergeordnete Teile
    }
    
// Kommentar zu einem Term bzw. zu einer Gleichung:
// R�ckgabewert: Termart oder Kommentar zur Syntax
  
  comment () {
    if (this.type == "Empty") return empty;                // R�ckgabewert, falls leerer Term
    if (this.syntax == syntaxOK && this.complete)          // Falls Term korrekt und vollst�ndig ... 
      switch(this.type) {                                  // Je nach Termart ...                                
        case "Var": return variable;                       // Variable
        case "False": case "True": return constant;        // Konstante
        case "Brack": return brack;                        // Klammer
        case "Negation": return negation;                  // Negation
        case "Conjunction": return conjunction;            // Konjunktion
        case "Disjunction": return disjunction;            // Disjunktion
        case "Implication": return implication;            // Implikation
        case "Equivalence": return equivalence;            // �quivalenz
        }
    return this.syntax;                                    // R�ckgabewert bei Syntaxfehler oder unvollst�ndigem Term
    }
    
  } // Ende der Klasse Term
  
//-------------------------------------------------------------------------------------------------

// Klasse BinTerm (bin�rer Term)
// Attribute type, complete, syntax, width, x, y, left, right

class BinTerm extends Term {

// Konstruktor:
// a ....... Array der Bestandteile (Kennbuchstabe, Operanden als Zeichenketten)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    var ch = undefined;                                    // Variable f�r Junktor
    switch (a[0]) {                                        // Je nach Kennbuchstabe ...
      case "E": ch = symbolEquivalence; break;             // �quivalenz
      case "I": ch = symbolImplication; break;             // Implikation
      case "O": ch = symbolDisjunction; break;             // Disjunktion
      case "U": ch = symbolConjunction; break;             // Konjunktion
      }
    var w0 = widthPix(" "+ch+" ");                         // Breite von Junktor und Leerzeichen (Pixel)
    this.left = constrTerm(a[1],x,y);                      // 1. Operand
    var w1 = this.left.width;                              // Breite des 1. Operanden (Pixel)
    this.right = constrTerm(a[2],x+w1+w0,y);               // 2. Operand
    this.width = w1+w0+this.right.width;                   // Breite des gesamten Terms (Pixel)
    var op1 = this.left, op2 = this.right;                 // Abk�rzungen f�r Operanden
    this.complete = op1.complete && op2.complete;          // Vollst�ndigkeit
    }
    
// Attributwert von syntax setzen: 
// e .... Flag f�r Ausl�sung einer Ausnahme
// m1 ... Fehlermeldung, falls 1. Operand fehlt
// m2 ... Fehlermeldung, falls 2. Operand fehlt
  
  setSyntax (e, m1, m2) {
    var op1 = this.left, op2 = this.right;                 // Operanden
    var sy1 = op1.syntax, sy2 = op2.syntax;                // Attributwerte syntax f�r Operanden
    if (op1.type == "Empty") sy1 = m1;                     // Falls 1. Operand fehlt, sy1 anpassen
    if (op2.type == "Empty") sy2 = m2;                     // Falls 2. Operand fehlt, sy2 anpassen
    if (sy1 == syntaxOK) this.syntax = sy2;                // Falls 1. Operand okay, Attributwert vom 2. Operanden �bernehmen
    else if (e) throw sy1;                                 // Falls Flag gesetzt und 1. Operand endg�ltig fehlerhaft, Ausnahme
    else this.syntax = sy1;                                // Falls 1. Operand nicht okay, Attributwert �bernehmen
    }
    
// Wert eines bin�ren Terms:
// v ... Array der Variablenwerte (0 oder 1)
// f ... Funktion zur Berechnung des Wahrheitswertes
// R�ckgabewert: Wahrheitswert (0 oder 1) oder undefined

  getValue (v, f) {
    var v1 = this.left.getValue(v);                        // Wert des 1. Operanden
    var v2 = this.right.getValue(v);                       // Wert des 2. Operanden
    if (v1 == undefined) return undefined;                 // R�ckgabewert, falls Wert des 1. Operanden undefiniert
    if (v2 == undefined) return undefined;                 // R�ckgabewert, falls Wert des 2. Operanden undefiniert
    return f(v1,v2);                                       // R�ckgabewert im Normalfall
    }
    
// Verschiebung:
// (dx,dy) ... Verschiebungsvektor (Pixel)

  move (dx, dy) {
    super.move(dx,dy);                                     // Term insgesamt verschieben (Methode von Term)
    this.left.move(dx,dy);                                 // 1. Operanden verschieben
    this.right.move(dx,dy);                                // 2. Operanden verschieben
    }
    
// Grafikausgabe:
// ch ... Rechenzeichen
// c .... Flag f�r Cursor (optional, Defaultwert true)
  
  writeBT (ch, c) {
    var op1 = this.left, op2 = this.right;                 // Operanden
    op1.write(op1.x,op1.y,false);                          // 1. Operand (ohne Cursor)
    var x = this.x+op1.width+widthPix(" ");                // Position des Rechenzeichens (Pixel)
    ctx.fillText(ch,x,this.y);                             // Rechenzeichen
    op2.write(op2.x,op2.y,c);                              // 2. Operand (eventuell mit Cursor)
    }
    
  } // Ende der Klasse BinTerm
  
//-------------------------------------------------------------------------------------------------

// Klasse Equivalence

class Equivalence extends BinTerm {

// Konstruktor:
// a ....... Array der Bestandteile (Rechenzeichen und Operanden als Zeichenketten)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(a,x,y);                                          // BinTerm-Konstruktor aufrufen
    this.type = "Equivalence";                             // Termart
    super.setSyntax(true,missEqu1,missEqu2);               // Attribut syntax (Methode von BinTerm)
    }
    
// Wert der �quivalenz:
// v ... Array der Variablenwerte von (0 oder 1)
// R�ckgabewert: Wahrheitswert (0 oder 1) oder undefined
    
 getValue (v) {
    return super.getValue(v,equiv);                        // R�ckgabewert (Methode von BinTerm)
    }

// Grafikausgabe:
// (x,y) ... Position (Pixel)
// c ....... Flag f�r Cursor

  write (x, y, c) {
    super.move(x-this.x,y-this.y);                         // Eventuell verschieben (Methode von BinTerm)
    super.writeBT(symbolEquivalence,c);                    // Ausgabemethode von BinTerm aufrufen
    }

  } // Ende der Klasse Equivalence
  
//-------------------------------------------------------------------------------------------------

// Klasse Implication

class Implication extends BinTerm {

// Konstruktor:
// a ....... Array der Bestandteile (Rechenzeichen und Operanden als Zeichenketten)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(a,x,y);                                          // BinTerm-Konstruktor aufrufen
    this.type = "Implication";                             // Termart
    super.setSyntax(true,missImp1,missImp2);               // Attribut syntax (Methode von BinTerm)
    }
    
// Wert der Implikation:
// v ... Array der Variablenwerte (0 oder 1)
// R�ckgabewert: Wahrheitswert (0 oder 1) oder undefined
    
 getValue (v) {
    return super.getValue(v,impl);                         // R�ckgabewert (Methode von BinTerm)
    }

// Grafikausgabe:
// (x,y) ... Position (Pixel)
// c ....... Flag f�r Cursor

  write (x, y, c) {
    super.move(x-this.x,y-this.y);                         // Eventuell verschieben (Methode von BinTerm)
    super.writeBT(symbolImplication,c);                    // Ausgabemethode von BinTerm aufrufen
    }

  } // Ende der Klasse Implication
  
//-------------------------------------------------------------------------------------------------

// Klasse Disjunction

class Disjunction extends BinTerm {

// Konstruktor:
// a ....... Array der Bestandteile (Rechenzeichen und Operanden als Zeichenketten)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(a,x,y);                                          // BinTerm-Konstruktor aufrufen
    this.type = "Disjunction";                             // Termart
    super.setSyntax(true,missDis1,missDis2);               // Attribut syntax (Methode von BinTerm)
    }
    
// Wert der Disjunktion:
// v ... Array der Variablenwerte (0 oder 1)
// R�ckgabewert: Wahrheitswert (0 oder 1) oder undefined
    
 getValue (v) {
    return super.getValue(v,or);                           // R�ckgabewert (Methode von BinTerm)
    }

// Grafikausgabe:
// (x,y) ... Position (Pixel)
// c ....... Flag f�r Cursor

  write (x, y, c) {
    super.move(x-this.x,y-this.y);                         // Eventuell verschieben (Methode von BinTerm)
    super.writeBT(symbolDisjunction,c);                    // Ausgabemethode von BinTerm aufrufen
    }

  } // Ende der Klasse Disjunction
  
//-------------------------------------------------------------------------------------------------

// Klasse Conjunction

class Conjunction extends BinTerm {

// Konstruktor:
// a ....... Array der Bestandteile (Rechenzeichen und Operanden als Zeichenketten)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(a,x,y);                                          // BinTerm-Konstruktor aufrufen
    this.type = "Conjunction";                             // Termart
    super.setSyntax(true,missCon1,missCon2);               // Attribut syntax (Methode von BinTerm)
    }
    
// Wert der Konjunktion:
// v ... Array der Variablenwerte (0 oder 1)
// R�ckgabewert: Wahrheitswert (0 oder 1) oder undefined
    
  getValue (v) {
    return super.getValue(v,and);                          // R�ckgabewert (Methode von BinTerm)
    }

// Grafikausgabe:
// (x,y) ... Position (Pixel)
// c ....... Flag f�r Cursor

  write (x, y, c) {
    super.move(x-this.x,y-this.y);                         // Eventuell verschieben (Methode von BinTerm)
    super.writeBT(symbolConjunction,c);                    // Ausgabemethode von BinTerm aufrufen
    }

  } // Ende der Klasse Conjunction
  
//-------------------------------------------------------------------------------------------------

// Klasse UnTerm (un�rer Term)
// Attribute type, complete, syntax, width, x, y, argument

class UnTerm extends Term {

// Konstruktor:
// (x,y) ... Position (Pixel)

  constructor (x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.argument = undefined;                             // Argument undefiniert
    }
    
// Verschiebung:
// (dx,dy) ... Verschiebungsvektor (optional)

  move (dx, dy) {
    super.move(dx,dy);                                     // Term insgesamt verschieben (Methode von Term)
    this.argument.move(dx,dy);                             // Argument verschieben
    }

  } // Ende der Klasse UnTerm
  
//-------------------------------------------------------------------------------------------------

// Klasse Negation

class Negation extends UnTerm {

// Konstruktor:
// a ... Array der Bestandteile (Negationszeichen und Argument als Zeichenketten)
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(x,y);                                            // UnTerm-Konstruktor aufrufen
    this.type = "Negation";                                // Termart
    var w0 = widthPix(symbolNegation)+2;                   // Breite des Negationszeichens
    var arg = this.argument = constrTerm(a[1],x+w0,y);     // Argument
    this.complete = arg.complete;                          // Vollst�ndigkeit
    if (arg.syntax != syntaxOK)                            // Falls Argument fehlerhaft ...
      this.syntax = arg.syntax;                            // Attribut syntax vom Argument �bernehmen
    else if (arg.type == "Empty")                          // Falls kein Argument vorhanden ...
      this.syntax = missNeg;                               // Attribut syntax anpassen
    this.width = w0+arg.width;                             // Breite (Pixel)
    }
    
// Wert der Negation:
// v ... Array der Variablenwerte (0 oder 1)
// R�ckgabewert: Wahrheitswert (0 oder 1)
    
  getValue (v) {
    var v0 = this.argument.getValue(v);                    // Wert des Arguments
    if (v0 == undefined) return undefined;                 // R�ckgabewert, falls Wert des Arguments undefiniert
    return 1-v0;                                           // R�ckgabewert im Normalfall
    }
    
// Grafikausgabe:
// (x,y) ... Position (Pixel)
// c ....... Flag f�r Cursor

  write (x, y, c) {
    this.move(x-this.x,y-this.y);                          // Eventuell verschieben
    x = writeString(symbolNegation,x,y)+2;                 // Negationszeichen, neue Position
    this.argument.write(x,y,c);                            // Argument
    }
    
  } // Ende der Klasse Negation
  
//-------------------------------------------------------------------------------------------------

// Brack (unvollst�ndige oder vollst�ndige Klammer)
// Attribute type, complete, syntax, width, x, y, argument

class Brack extends UnTerm {

// Konstruktor:
// a ....... Array der Bestandteile
// (x,y) ... Position (Pixel)

  constructor (a, x, y) {
    super(x,y);                                            // UnTerm-Konstruktor aufrufen
    this.type = "Brack";                                   // Termart
    if (a[0] == "2" && a[1] == "") throw emptyBracket;     // Falls leere Klammer, Ausnahme
    var w0 = widthPix("(");                                // Breite der �ffnenden Klammer (Pixel)
    var arg = this.argument = constrTerm(a[1],x+w0,y);     // Inhalt der Klammer
    var c = (a[0] == "2");                                 // Flag f�r vollst�ndige Klammer
    if (arg.syntax != syntaxOK)                            // Falls Inhalt der Klammer fehlerhaft oder unvollst�ndig ...
      this.syntax = arg.syntax;                            // Attribut syntax vom Argument �bernehmen
    else if (!c) this.syntax = openBracket;                // Falls Inhalt korrekt, aber Klammer unvollst�ndig, Syntax-Variable
    if (c && this.syntax != syntaxOK) throw this.syntax;   // Falls endg�ltiger Fehler, Ausnahme
    this.complete = c && arg.complete;                     // Vollst�ndigkeit
    this.width = arg.width+2*w0;                           // Breite (Pixel)
    }
    
// Wert der Klammer:
// v ... Array der Variablenwerte (0 oder 1)
// R�ckgabewert: Wahrheitswert (0 oder 1)
    
  getValue (v) {
    if (!this.complete) return undefined;                  // R�ckgabewert, falls Klammer unvollst�ndig
    return this.argument.getValue(v);                      // R�ckgabewert im Normalfall (vom Argument �bernommen)
    }
    
// Grafikausgabe:
// (x,y) ... Position (Pixel)
// c ....... Flag f�r Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    super.move(x-this.x,y-this.y);                         // Eventuell verschieben (Methode von UnTerm)
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    ctx.fillText("(",x,y);                                 // Klammer auf
    var co = this.complete;                                // Flag f�r Vollst�ndigkeit
    var a = this.argument;                                 // Abk�rzung f�r Inhalt der Klammer
    a.write(a.x,a.y,c&&!co);                               // Inhalt der Klammer
    if (!co) return;                                       // Falls Klammer unvollst�ndig, abbrechen
    var xe = a.x+a.width;                                  // Position Klammerende (Pixel)
    ctx.fillText(")",xe,y);                                // Klammer zu
    var w0 = widthPix("(");                                // Breite der �ffnenden Klammer (Pixel)
    if (c) cursor(xe+2*w0,y);                              // Falls gew�nscht, Cursor 
    }

  } // Ende der Klasse Brack
  
//-------------------------------------------------------------------------------------------------

// Klasse Var (Variable):
// Attribute type, ch, complete, syntax, width, x, y

class Var extends Term {

// Konstruktor:
// s ....... Zeichenkette (Variable)
// (x,y) ... Position (Pixel)

  constructor (s, x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.type = "Var";                                     // Termart
    this.ch = s;                                           // Variable
    this.complete = true;                                  // Vollst�ndigkeit
    this.width = widthPix(s);                              // Breite (Pixel)
    }
    
// Wert der Variable:
// v ... Array der Variablenwerte (0 oder 1)
// R�ckgabewert: Wahrheitswert (0 oder 1)
    
  getValue (v) {
    for (var i=0; i<nVar; i++)                             // F�r alle Variablen-Indizes ...
      if (this.ch == variables[i]) break;                  // Falls aktuelle Variable, Schleife abbrechen
    return v[i];                                           // R�ckgabewert
    }
    
// Grafikausgabe:
// (x,y) ... Position (Pixel)
// c ....... Flag f�r Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    super.move(x-this.x,y-this.y);                         // Verschiebung (Methode von Term)
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    ctx.fillText(this.ch,x,y);                             // Variable
    if (c) cursor(x+widthPix(this.ch),y);                  // Falls gew�nscht, Cursor
    }

  } // Ende der Klasse Var
  
//-------------------------------------------------------------------------------------------------

// Klasse False (Konstante):
// Attribute type, ch, complete, syntax, width, x, y

class False extends Term {

// Konstruktor:
// s ....... Zeichenkette (Variable)
// (x,y) ... Position (Pixel)

  constructor (s, x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.type = "False";                                   // Termart
    this.ch = symbolFalse;                                 // Symbol
    this.complete = true;                                  // Vollst�ndigkeit
    this.width = widthPix(symbolFalse);                    // Breite (Pixel)
    }
    
// Wert der Konstante:
// v ... Array der Variablenwerte (0 oder 1)
// R�ckgabewert: Wahrheitswert (0)
    
  getValue (v) {
    return 0;                                              // R�ckgabewert
    }
    
// Grafikausgabe:
// (x,y) ... Position (Pixel)
// c ....... Flag f�r Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    super.move(x-this.x,y-this.y);                         // Verschiebung (Methode von Term)
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    ctx.fillText(this.ch,x,y);                             // Symbol f�r "falsch"
    if (c) cursor(x+widthPix(this.ch),y);                  // Falls gew�nscht, Cursor
    }

  } // Ende der Klasse False
  
//-------------------------------------------------------------------------------------------------

// Klasse True (Konstante):
// Attribute type, ch, complete, syntax, width, x, y

class True extends Term {

// Konstruktor:
// s ....... Zeichenkette (Variable)
// (x,y) ... Position (Pixel)

  constructor (s, x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.type = "True";                                    // Termart
    this.ch = symbolTrue;                                  // Symbol
    this.complete = true;                                  // Vollst�ndigkeit
    this.width = widthPix(symbolTrue);                     // Breite (Pixel)
    }
    
// Wert der Konstante:
// v ... Array der Variablenwerte (0 oder 1)
// R�ckgabewert: Wahrheitswert (1)
    
  getValue (v) {
    return 1;                                              // R�ckgabewert
    }
    
// Grafikausgabe:
// (x,y) ... Position (Pixel)
// c ....... Flag f�r Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    super.move(x-this.x,y-this.y);                         // Verschiebung (Methode von Term)
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    ctx.fillText(this.ch,x,y);                             // Symbol f�r "wahr"
    if (c) cursor(x+widthPix(this.ch),y);                  // Falls gew�nscht, Cursor
    }

  } // Ende der Klasse True
  
//-------------------------------------------------------------------------------------------------

// Empty (leerer Term)
// Attribute type, complete, syntax, width, x, y

class Empty extends Term {

// Konstruktor:
// (x,y) ... Position (Pixel)

  constructor (x, y) {
    super(x,y);                                            // Term-Konstruktor aufrufen
    this.type = "Empty";                                   // Termart
    }
    
// Wert des leeren Terms:
// v ... Array der Variablenwerte (0 oder 1)
// R�ckgabewert: undefined
    
  getValue (v) {
    return undefined;
    }
    
// Grafikausgabe:
// (x,y) ... Position (optional)
// c ....... Flag f�r Cursor (optional, Defaultwert true)
    
  write (x, y, c) {
    super.move(x-this.x,y-this.y);                         // Verschiebung (Methode von Term)
    if (c == undefined) c = true;                          // Falls Flag undefiniert, Defaultwert
    if (c) cursor(x,y);                                    // Falls gew�nscht, Cursor
    }
    
  } // Ende der Klasse Empty
  
//-------------------------------------------------------------------------------------------------

// GLOBALE METHODEN:

// Wert einer Konjunktion:
// v1, v2 ... Operanden (0 oder 1)
// R�ckgabewert: Wert der Konjunktion (0 oder 1)

function and (v1, v2) {
  return (v1 && v2 ? 1 : 0);                               // R�ckgabewert
  }
  
// Wert einer Disjunktion:
// v1, v2 ... Operanden (0 oder 1)
// R�ckgabewert: Wert der Konjunktion (0 oder 1)
  
function or (v1, v2) {
  return (v1 || v2 ? 1 : 0);                               // R�ckgabewert
  }
  
// Wert einer Implikation:
// v1, v2 ... Operanden (0 oder 1)
// R�ckgabewert: Wert der Implikation (0 oder 1)

function impl (v1, v2) {
  return (!v1 || v2 ? 1 : 0);                              // R�ckgabewert
  }
  
// Wert einer �quivalenz:
// v1, v2 ... Operanden (0 oder 1)
// R�ckgabewert: Wert der �quivalenz (0 oder 1)

function equiv (v1, v2) {
  return (v1 == v2 ? 1 : 0);                               // R�ckgabewert
  }
   
// Breite einer Zeichenkette (Pixel):
// s ... Zeichenkette
  
function widthPix (s) {
  return ctx.measureText(s).width;                         // R�ckgabewert
  }
  
// Ausgabe einer Zeichenkette:
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)
// R�ckgabewert: Position am Ende (Pixel)
  
function writeString (s, x, y) {
  ctx.fillText(s,x,y);                                     // Zeichenkette ausgeben
  return x+widthPix(s);                                    // R�ckgabewert
  }



  
 
  


