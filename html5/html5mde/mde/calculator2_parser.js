// Parser
// 21.05.2020 - 14.08.2020
    
// Suche nach einem Zeichen (außerhalb von Klammern, möglichst weit rechts):
// ch ... Gesuchtes Zeichen
// s .... Durchsuchte Zeichenkette
// Rückgabewert: Position des Zeichens oder -1
    
function rightPosChar (ch, s) {
  var level = 0;                                           // Klammerebene bezüglich runder Klammern
  var level2 = 0;                                          // Klammerebene bezüglich geschweifter Klammern
  var iMax = -1;                                           // Variable für Position des gesuchten Zeichens
  for (var i=0; i<s.length; i++) {                         // Für alle Zeichenpositionen ...
    var chI = s.charAt(i);                                 // Aktuelles Zeichen
    if (chI == "(") level++;                               // Falls runde Klammer auf, Klammerebene erhöhen
    if (chI == ")") level--;                               // Falls runde Klammer zu, Klammerebene erniedrigen
    if (chI == "\{") level2++;                             // Falls geschweifte Klammer auf, Klammerebene erhöhen
    if (chI == "\}") level2--;                             // Falls geschweifte Klammer zu, Klammerebene erniedrigen
    if (level == 0 && level2 == 0 && chI == ch)            // Falls richtiges Zeichen außerhalb Klammer ...       
      iMax = i;                                            // iMax aktualisieren
    } 
  return iMax;                                             // Rückgabewert
  }

// Suche nach einem Zeichen (außerhalb von Klammern, möglichst weit links):
// ch ... Gesuchtes Zeichen
// s .... Durchsuchte Zeichenkette
// Rückgabewert: Position des Zeichens oder -1

function leftPosChar (ch, s) {
  var level = 0;                                           // Klammerebene bezüglich runder Klammern
  var level2 = 0;                                          // Klammerebene bezüglich geschweifter Klammern
  var iMin = -1;                                           // Variable für Position des gesuchten Zeichens
  for (var i=0; i<s.length; i++) {                         // Für alle Zeichenpositionen ...
    var chI = s.charAt(i);                                 // Aktuelles Zeichen
    if (chI == "(") level++;                               // Falls runde Klammer auf, Klammerebene erhöhen
    if (chI == ")") level--;                               // Falls runde Klammer zu, Klammerebene erniedrigen
    if (chI == "\{") level2++;                             // Falls geschweifte Klammer auf, Klammerebene erhöhen
    if (chI == "\}") level2--;                             // Falls geschweifte Klammer zu, Klammerebene erniedrigen
    if (level == 0 && level2 == 0 && chI == ch)            // Falls richtiges Zeichen außerhalb Klammer ...
      iMin = i;                                            // iMin aktualisieren 
    }
  return iMin;                                             // Rückgabewert
  }
  
// Bestandteile von Summe, Differenz, Plus- oder Minus-Ausdruck:
// s ... Zeichenkette
// Rückgabewert: Array der Bestandteile (Rechen- bzw. Vorzeichen, Operanden) oder undefined

function partsPlusMinus (s) {
  var i = rightPosChar("+",s);                             // Position Pluszeichen oder -1
  var j = rightPosChar("-",s);                             // Position Minuszeichen oder -1
  var k = Math.max(i,j);                                   // Maximum der beiden Positionen oder -1
  if (k < 0) return undefined;                             // Rückgabewert, falls Zeichenkette unpassend
  var ch = s.charAt(k);                                    // Rechen- bzw. Vorzeichen
  var s1 = s.substring(0,k);                               // 1. Teil (eventuell leer)
  var s2 = s.substring(k+1);                               // 2. Teil
  if (k == 0) return [ch, s2];                             // Rückgabewert für Plus- oder Minus-Ausdruck
  else return [ch, s1, s2];                                // Rückgabewert für Summe oder Differenz
  }
  
// Bestandteile von Produkt (mit Multiplikationszeichen) oder Quotient:
// s ... Zeichenkette
// Rückgabewert: Array der Bestandteile (Rechenzeichen, Operanden) oder undefined
  
function partsProdQuot (s) {
  var i = rightPosChar("*",s);                             // Position Multiplikationszeichen oder -1
  var j = rightPosChar(":",s);                             // Position Divisionszeichen oder -1
  var k = Math.max(i,j);                                   // Maximum der beiden Positionen oder -1
  if (k < 0) return undefined;                             // Rückgabewert, falls Zeichenkette unpassend
  var ch = s.charAt(k);                                    // Rechenzeichen
  var s1 = s.substring(0,k);                               // 1. Teil (eventuell leer)
  var s2 = s.substring(k+1);                               // 2. Teil
  return [ch, s1, s2];                                     // Rückgabewert für Produkt oder Quotient
  }
  
// Bestandteile eines Produkts ohne Multiplikationszeichen:
// s ... Zeichenkette
// Rückgabewert: Array der Bestandteile (1. und 2. Faktor) oder undefined

function partsProd0 (s) {  
  var res = false;                                         // Flag für erfolgreiche Zerlegung
  for (var i=s.length-1; i>0; i--) {                       // Für alle Zeichenpositionen von rechts nach links ...
    var chR = s.charAt(i);                                 // Aktuelles Zeichen (rechts)
    var dR = like(chR,"\\d");                              // Flag für Ziffer (rechts)
    var aR = like(chR,"[a-z]");                            // Flag für Variable (rechts)
    var brR = (chR == "(");                                // Flag für öffnende Klammer (rechts)
    var chL = s.charAt(i-1);                               // Aktuelles Zeichen (links)
    var dL = like(chL,"\\d");                              // Flag für Ziffer (links)
    var aL = like(chL,"[a-z]");                            // Flag für Variable (links)
    var brL = (chL == ")" || chL == "\}");                 // Flag für schließende Klammer, Potenz oder Bruchterm (links)
    var sL = s.substring(0,i);                             // Linker Teil der Zerlegung
    if (level(sL,"(",")") != 0) continue;                  // Falls Klammerebene ungleich 0, weiter zur nächsten Position
    var c1 = aL && (aR || dR || brR);                      // Flag für Fall 1 (links Variable, rechts Variable, Ziffer oder Klammer)
    var c2 = dL && (aR || brR);                            // Flag für Fall 2 (links Ziffer, rechts Variable oder Klammer)
    var c3 = brL && (aR || dR || brR);                     // Flag für Fall 3 (links Klammer, rechts Variable, Ziffer oder Klammer)
    if (c1 || c2 || c3) {                                  // Falls passende Zerlegung gefunden ...
      var i0 = i;                                          // Position speichern                                           
      res = true;                                          // Flag für erfolgreiche Zerlegung setzen 
      break;                                               // for-Schleife verlassen
      }                       
    } // Ende for
  if (!res) return undefined;                              // Rückgabewert, falls keine passende Zerlegung gefunden
  var s1 = s.substring(0,i0), s2 = s.substring(i0);        // Bestandteile der Zerlegung
  var t1 = isFracTerm(s1), t2 = isFracTerm(s2);            // Flags für Bruchterme 
  if (t1 || t2) return undefined;                          // Rückgabewert, falls Bruchterm beteiligt
  return [s1, s2];                                         // Rückgabewert (Normalfall)
  }
  
// Überprüfung, ob eine Zeichenkette einem Produkt ohne Multiplikationszeichen entspricht:
// s ... Zeichenkette

function isProd0 (s) {
  return (partsProd0(s) != undefined);                     // Rückgabewert
  }
  
// Überprüfung, ob eine Zeichenkette einem vollständigen Produkt ohne Multiplikationszeichen entspricht:
// s ... Zeichenkette
  
function isCompleteProd0 (s) {
  var a = partsProd0(s);                                   // Array der Bestandteile
  if (a == undefined) return false;                        // Rückgabewert, falls kein Produkt ohne Multiplikationszeichen
  else try {                                               // Sonst Versuch ...
    var t = constrTerm(s,0,0);                             // Termkonstruktion
    return t.complete;                                     // Rückgabewert je nach Vollständigkeit
    }
  catch(err) {return false;}                               // Rückgabewert, falls Termkonstruktion misslungen
  }
  
// Position einer schließenden geschweiften Klammer:
// s ..... Zeichenkette
// beg ... Position der öffnenden geschweiften Klammer
// Rückgabewert: Position oder -1
  
function searchEnd (s, beg) {
  var level = 0;                                           // Klammerebene
  for (var i=beg; i<s.length; i++) {                       // Für alle Positionen ...
    var ch = s.charAt(i);                                  // Aktuelles Zeichen
    if (ch == "\{") level++;                               // Falls geschweifte Klammer auf, Klammerebene erhöhen
    if (ch == "\}") level--;                               // Falls geschweifte Klammer zu, Klammerebene erniedrigen
    if (level == 0 && ch == "\}") return i;                // Falls schließende Klammer gefunden, Rückgabewert
    }
  return -1;                                               // Rückgabewert bei erfolgloser Suche
  }
  
// Bestandteile eines Bruchterms:
// s ... Zeichenkette
// Rückgabewert: Array der Bestandteile (Zustand, Zähler, Nenner) oder undefined
// Zustand "1", falls Zähler nicht abgeschlossen, "2", falls Zähler abgeschlossen, aber nicht Nenner, 
// "3", falls Zähler und Nenner abgeschlossen 
  
function partsFracTerm (s) {
  if (s.substring(0,2) != "#\{") return undefined;         // Falls Anfang ungleich "#{", Rückgabewert undefined
  var i = searchEnd(s,1);                                  // Position der schließenden geschweiften Klammer nach dem Zähler oder -1
  var s1 = (i<0 ? s.substring(2) : s.substring(2,i));      // Zeichenkette für Zähler (eventuell leer)
  if (i < 0) return ["1", s1];                             // Rückgabewert, falls Zähler nicht abgeschlossen
  var sb = s.substring(i,i+3);                             // Zeichenkette der Länge 3 nach der Zähler-Klammer
  if (sb != "\}/\{") return undefined;                     // Falls Zeichenkette ungleich "}/{", Rückgabewert undefined
  var k = searchEnd(s,i+2);                                // Position der schließenden geschweiften Klammer nach dem Nenner oder -1
  if (k >= 0 && k != s.length-1) return undefined;         // Rückgabewert, falls schließende Klammer nicht am Ende
  var s2 = (k<0 ? s.substring(i+3) : s.substring(i+3,k));  // Zeichenkette für Nenner (eventuell leer)
  if (k < 0) return ["2", s1, s2];                         // Rückgabewert, falls Nenner nicht abgeschlossen
  else return ["3", s1, s2];                               // Rückgabewert, falls Nenner abgeschlossen
  }
  
// Bruchterm-Typ für eine gegebene Zeichenkette:
// s ... Zeichenkette
// Rückgabewert: 0, falls kein Bruchterm; 1, falls nur Zähler; 2, falls Nenner unvollständig oder nicht abgeschlossen;
// 3, falls vollständiger Bruchterm
  
function typeFracTerm (s) {
  var a = partsFracTerm(s);                                // Array der Bestandteile oder undefined
  if (a == undefined) return 0;                            // Rückgabewert, falls kein Bruchterm
  else return Number(a[0]);                                // Rückgabewert, falls Bruchterm
  }

// Überprüfung, ob eine Zeichenkette einem unvollständigen Bruchterm entspricht:
// s ... Zeichenkette
  
function isIncompleteFracTerm (s) {
  var a = partsFracTerm(s);                                // Array der Bestandteile oder undefined
  return (a != undefined && (a[0] == "1" || a[0] == "2")); // Rückgabewert
  }
  
// Überprüfung, ob eine Zeichenkette einem Bruchterm (vollständig oder unvollständig) entspricht:
// s ... Zeichenkette

function isFracTerm (s) {
  return (partsFracTerm(s) != undefined);                  // Rückgabewert
  }
  
// Bestandteile einer Potenz:
// s ... Zeichenkette
// Rückgabewert: Array der Bestandteile (Zustand, Basis, Exponent) oder undefined
// Zustand "1", falls Exponent nicht abgeschlossen; Zustand "2", falls Exponent abgeschlossen

function partsPower (s) {
  var i = leftPosChar("^",s);                              // Position von '^' (möglichst weit links) oder -1
  if (i < 0) return undefined;                             // Falls kein '^' außerhalb von Klammern, Rückgabewert undefined
  if (i == s.length-1 || s.charAt(i+1) != "\{")            // Falls nach '^' keine geschweifte Klammer ...
    return undefined;                                      // Rückgabewert undefined
  var b = s.substring(0,i);                                // Zeichenkette für Basis
  if (!(isNatNum(b) || isDecNum(b) || isBrack(b)           // Falls Basis ungeeignet ...
    || isVar(b) || b == ""))        
    return undefined;                                      // Rückgabewert undefined
  var k = searchEnd(s,i+1);                                // Position der schließenden geschweiften Klammer oder -1
  if (k >= 0 && k != s.length-1) return undefined;         // Falls schließende Klammer nicht am Ende, Rückgabewert undefined
  var e = (k<0 ? s.substring(i+2) : s.substring(i+2,k));   // Zeichenkette für Exponent
  return [(k<0 ? "1" : "2"), b, e];                        // Rückgabewert
  }
  
// Überprüfung, ob eine Zeichenkette einer vollständigen Potenz entspricht:
// s ... Zeichenkette
  
function isCompletePower (s) {
  var a = partsPower(s);                                   // Array der Bestandteile oder undefined
  return (a != undefined && a[0] == "2");                  // Rückgabewert
  }

// Überprüfung, ob eine Zeichenkette einer unvollständigen Potenz entspricht:
// s ... Zeichenkette
  
function isIncompletePower (s) {
  var a = partsPower(s);                                   // Array der Bestandteile oder undefined
  return (a != undefined && a[0] == "1");                  // Rückgabewert
  }
  
// Überprüfung, ob eine Zeichenkette einer Potenz (vollständig oder unvollständig) entspricht:
// s ... Zeichenkette

function isPower (s) {
  return (partsPower(s) != undefined);                     // Rückgabewert
  }
  
// Überprüfung, ob eine Zeichenkette einer Potenz einer Variablen oder einer Potenz einer vollständigen Klammer entspricht:

function isPower1 (s) {
  var a = partsPower(s);
  if (a == undefined) return false;
  if (isVar(a[1])) return true;
  if (isCompleteBrack(a[1])) return true;
  return false;
  }
  
// Bestandteile einer runden Klammer:
// s ... Zeichenkette
// Rückgabewert: Array der Bestandteile (Zustand, Inhalt) oder undefined
// Zustand "1", falls Klammer nicht geschlossen, Zustand "2", falls Klammer geschlossen

function partsBrack (s) {
  if (s.charAt(0) != "(") return undefined;                // Falls nicht Klammer auf am Anfang, Rückgabewert undefined
  var level = 0;                                           // Klammerebene
  for (var i=0; i<s.length; i++) {                         // Für alle Zeichenpositionen ...
    var ch = s.charAt(i);                                  // Aktuelles Zeichen
    if (ch == "(") level++;                                // Falls Klammer auf, Klammerebene erhöhen
    if (ch == ")") level--;                                // Falls Klammer zu, Klammerebene erniedrigen
    if (level == 0 && ch == ")" && i < s.length-1)         // Falls vorzeitig Klammer zu ... 
      return undefined;                                    // Rückgabewert undefined
    }
  if (level > 0) return ["1", s.substring(1)];            // Rückgabewert für unvollständige runde Klammer
  else return ["2", s.substring(1,s.length-1)];           // Rückgabewert für vollständige runde Klammer 
  }

// Überprüfung, ob eine Zeichenkette einer Klammer (vollständig oder unvollständig) entspricht:
// s ... Zeichenkette
  
function isBrack (s) {
  return (partsBrack(s) != undefined);                     // Rückgabewert
  }
  
// Überprüfung, ob eine Zeichenkette einer vollständigen Klammer entspricht:

function isCompleteBrack (s) {
  var a = partsBrack(s);                                   // Array der Bestandteile
  return (a != undefined && a[0] == "2");                  // Rückgabewert
  }

// Überprüfung, ob eine Zeichenkette einem Prozentsatz entspricht:
// s ... Zeichenkette
  
function isPerc (s) {
  if (s.charAt(s.length-1) != "%") return false;           // Falls kein Prozentzeichen am Ende, Rückgabewert false
  var z = s.substring(0,s.length-1);                       // Zeichenkette ohne Prozentzeichen
  if (isNatNum(z)) return true;                            // Rückgabewert für natürliche Zahl mit Prozentzeichen
  if (isFracNum(z)) return true;                           // Rückgabewert für Bruchzahl mit Prozentzeichen
  if (isDecNum(z)) return true;                            // Rückgabewert für Dezimalbruch mit Prozentzeichen
  return false;                                            // Rückgabewert in allen anderen Fällen
  }
  
// Hilfsroutine: Vergleich einer Zeichenkette mit einem Muster
// s ... Zeichenkette
// p ... Zeichenkette für Muster (regulärer Ausdruck); Vorsicht bei bestimmten Zeichen (Punkt)!
// Rückgabewert: Bei Übereinstimmung true, sonst false

function like (s, p) {
  var a = s.match(new RegExp(p));                          // Array von passenden Teilstrings
  return (a != null && a.length == 1 && a[0] == s);        // Rückgabewert
  }
  
// Überprüfung, ob eine Zeichenkette eine natürliche Zahl einschließlich 0 darstellen kann:
// s ... Zeichenkette
// Rückgabewert true genau dann, wenn Zeichenkette nicht leer und ausschließlich aus Ziffern bestehend;
// führende Nullen erlaubt
    
function isNatNum (s) {
  return like(s,"\\d+");                                   // Rückgabewert                
  }
  
// Bestandteile eines Bruchs oder einer gemischten Zahl:
// s ... Zeichenkette
// Rückgabewert: Array der Bestandteile (ganze Zahl, Zähler, Nenner) oder undefined
  
function partsFracNum (s) {
  var f1 = like(s,"\\d*#\\d*");                            // Vergleich Ziffern # Ziffern
  var f2 = like(s,"\\d*#\\d*/\\d*");                       // Vergleich Ziffern # Ziffern / Ziffern
  if (!f1 && !f2) return undefined;                        // Falls beide Vergleiche negativ, Rückgabewert undefined
  var i1 = s.indexOf("#");                                 // Position Rautenzeichen (Anfang des Bruchs) 
  var s1 = s.substring(0,i1);                              // Zeichenkette ganze Zahl (eventuell leer)
  var i2 = s.indexOf("/");                                 // Position Slash (Bruchstrich) oder -1
  var s2 = (i2>0 ? s.substring(i1+1,i2) : s.substring(i1+1)); // Zeichenkette Zähler (eventuell leer)
  if (i2 < 0) return [s1, s2];                             // Rückgabewert, falls kein Slash vorhanden
  else {
    var s3 = s.substring(i2+1);                            // Zeichenkette Nenner (eventuell leer)
    return [s1, s2, s3];                                   // Rückgabewert, falls Slash vorhanden
    }
  }
  
// Überprüfung, ob eine Zeichenkette einem Bruch oder einer gemischten Zahl entspricht:
// s ..... Zeichenkette

function isFracNum (s) {
  return (partsFracNum(s) != undefined);                   // Rückgabewert
  }
  
// Bestandteile eines Dezimalbruchs (endlich oder unendlich):
// s ..... Zeichenkette
// Rückgabewert: Array der Bestandteile (ganze Zahl, normale Nachkommastellen, Periode) oder undefined

function partsDecNum (s) {
  var f1 = like(s,"\\d*,\\d*");                            // Vergleich Ziffern Komma Ziffern
  var f2 = like(s,"\\d*,\\d*;\\d*");                       // Vergleich Ziffern Komma Ziffern Strichpunkt Ziffern
  if (!f1 && !f2) return undefined;                        // Falls beide Vergleich negativ, Rückgabewert undefined
  var i1 = s.indexOf(",");                                 // Position Komma
  var s1 = s.substring(0,i1);                              // Zeichenkette ganze Zahl (eventuell leer)
  var i2 = s.indexOf(";");                                 // Position Strichpunkt (Anfang Periode) oder -1
  var s2 = (i2>0 ? s.substring(i1+1,i2) : s.substring(i1+1)); // Normale Nachkommastellen (eventuell leer)
  if (i2 < 0) return [s1, s2];                             // Rückgabewert, falls keine Periode
  else {                                                   // Falls Periode ...
    var s3 = s.substring(i2+1);                            // Periodische Nachkommastellen (eventuell leer)
    return [s1, s2, s3];                                   // Rückgabewert, falls Periode
    }
  }
  
// Überprüfung, ob eine Zeichenkette einem Dezimalbruch (endlich oder unendlich) entspricht:

function isDecNum (s) {
  return (partsDecNum(s) != undefined);                    // Rückgabewert
  }
  
// Typ einer Zahl:
// s ..... Zeichenkette

function typeNum (s) {
  if (isNatNum(s)) return "NatNum";                        // Natürliche Zahl oder 0
  if (isFracNum(s)) return "FracNum";                      // Bruch oder gemischte Zahl (Seiteneffekt)
  if (isDecNum(s)) return "DecNum";                        // Endlicher oder unendlicher Dezimalbruch (Seiteneffekt)
  }
  
// Überprüfung, ob eine Zeichenkette einer Zahl entspricht:
// s ... Zeichenkette

function isNum (s) {
  return (typeNum(s) != undefined);                        // Rückgabewert
  }
  
// Überprüfung, ob eine Zeichenkette einer Variablen entspricht:

function isVar (s) {
  return like(s,"[a-z]");
  }

// Hilfsroutine: Klammerebene am Ende einer Zeichenkette
// s ..... Zeichenkette
// ch1 ... Zeichen für öffnende Klammer
// ch2 ... Zeichen für schließende Klammer

function level (s, ch1, ch2) {
  var lev = 0;                                             // Klammerebene, Startwert
  for (var i=0; i<s.length; i++) {                         // Für alle Zeichenpositionen ...
    if (s.charAt(i) == ch1) lev++;                         // Falls öffnende Klammer, Klammerebene erhöhen
    if (s.charAt(i) == ch2) lev--;                         // Falls schließende Klammer, Klammerebene erniedrigen
    }
  return lev;                                              // Rückgabewert
  }
  
// Konstruktion eines Terms (rekursiv):
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)

function constrTerm (s, x, y) {
  if (s == "") return new Empty(x,y);                      // Rückgabewert (leerer Term)
  var a = partsPlusMinus(s);                               // Bestandteile eines Ausdrucks mit Plus- oder Minuszeichen
  if (a != undefined) {                                    // Falls Plus- oder Minuszeichen gefunden ...
    if (a[0] == "+") {                                     // Falls Pluszeichen ...
      if (a.length == 2) return new Plus(a,x,y);           // Rückgabewert (Plus-Ausdruck)
      else return new Sum(a,x,y);                          // Rückgabewert (Summe)
      }
    else {                                                 // Falls Minuszeichen ...
      if (a.length == 2) return new Minus(a,x,y);          // Rückgabewert (Minus-Ausdruck)
      else return new Diff(a,x,y);                         // Rückgabewert (Differenz)
      }
    }
  a = partsProdQuot(s);                                    // Bestandteile eines Produkts oder Quotienten
  if (a != undefined) {                                    // Falls Produkt oder Quotient ...
    if (a[0] == "*") return new Prod(a,x,y);               // Rückgabewert (Produkt)
    else return new Quot(a,x,y);                           // Rückgabewert (Quotient)
    }
  a = partsProd0(s);                                       // Bestandteile eines Produkts ohne Multiplikationszeichen
  if (a != undefined) return new Prod0(a,x,y);             // Rückgabewert (Produkt ohne Multipikationszeichen)
  a = partsPower(s);                                       // Bestandteile einer Potenz
  if (a != undefined) return new Power(a,x,y);             // Rückgabewert (Potenz)
  a = partsFracTerm(s);                                    // Bestandteile eines Bruchterms 
  if (a != undefined) return new FracTerm(a,x,y);          // Rückgabewert (Bruchterm)
  a = partsBrack(s);                                       // Bestandteile einer runden Klammer
  if (a != undefined) return new Brack(a,x,y);             // Rückgabewert (unvollständige oder vollständige runde Klammer)
  if (isPerc(s)) return new Perc(s,x,y);                   // Rückgabewert (Prozentsatz)  
  switch (typeNum(s)) {                                    // Typ NatNum, FracNum oder DecNum?
    case "NatNum": return new NatNum(s,x,y);               // Rückgabewert (natürliche Zahl oder 0)
    case "FracNum":                                        // Falls Typ FracNum ...
      a = partsFracNum(s);                                 // Bestandteile
      if (a != undefined) return new FracNum(a,x,y);       // Rückgabewert (Bruch oder gemischte Zahl)
    case "DecNum":                                         // Falls Typ DecNum ...
      a = partsDecNum(s);                                  // Bestandteile
      if (a != undefined) return new DecNum(a,x,y);        // Rückgabewert (Dezimalbruch endlich/unendlich)
    }
  if (isVar(s)) return new Var(s,x,y);                     // Rückgabewert (Variable)
  if (level(s,"(",")") < 0) throw closingBracket;          // Falls überzählige schließende Klammer, Ausnahme
  throw unknownError;                                      // Falls unverständlich, Ausnahme
  }
  
