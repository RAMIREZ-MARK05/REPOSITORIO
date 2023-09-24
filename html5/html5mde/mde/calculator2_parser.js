// Parser
// 21.05.2020 - 14.08.2020
    
// Suche nach einem Zeichen (au�erhalb von Klammern, m�glichst weit rechts):
// ch ... Gesuchtes Zeichen
// s .... Durchsuchte Zeichenkette
// R�ckgabewert: Position des Zeichens oder -1
    
function rightPosChar (ch, s) {
  var level = 0;                                           // Klammerebene bez�glich runder Klammern
  var level2 = 0;                                          // Klammerebene bez�glich geschweifter Klammern
  var iMax = -1;                                           // Variable f�r Position des gesuchten Zeichens
  for (var i=0; i<s.length; i++) {                         // F�r alle Zeichenpositionen ...
    var chI = s.charAt(i);                                 // Aktuelles Zeichen
    if (chI == "(") level++;                               // Falls runde Klammer auf, Klammerebene erh�hen
    if (chI == ")") level--;                               // Falls runde Klammer zu, Klammerebene erniedrigen
    if (chI == "\{") level2++;                             // Falls geschweifte Klammer auf, Klammerebene erh�hen
    if (chI == "\}") level2--;                             // Falls geschweifte Klammer zu, Klammerebene erniedrigen
    if (level == 0 && level2 == 0 && chI == ch)            // Falls richtiges Zeichen au�erhalb Klammer ...       
      iMax = i;                                            // iMax aktualisieren
    } 
  return iMax;                                             // R�ckgabewert
  }

// Suche nach einem Zeichen (au�erhalb von Klammern, m�glichst weit links):
// ch ... Gesuchtes Zeichen
// s .... Durchsuchte Zeichenkette
// R�ckgabewert: Position des Zeichens oder -1

function leftPosChar (ch, s) {
  var level = 0;                                           // Klammerebene bez�glich runder Klammern
  var level2 = 0;                                          // Klammerebene bez�glich geschweifter Klammern
  var iMin = -1;                                           // Variable f�r Position des gesuchten Zeichens
  for (var i=0; i<s.length; i++) {                         // F�r alle Zeichenpositionen ...
    var chI = s.charAt(i);                                 // Aktuelles Zeichen
    if (chI == "(") level++;                               // Falls runde Klammer auf, Klammerebene erh�hen
    if (chI == ")") level--;                               // Falls runde Klammer zu, Klammerebene erniedrigen
    if (chI == "\{") level2++;                             // Falls geschweifte Klammer auf, Klammerebene erh�hen
    if (chI == "\}") level2--;                             // Falls geschweifte Klammer zu, Klammerebene erniedrigen
    if (level == 0 && level2 == 0 && chI == ch)            // Falls richtiges Zeichen au�erhalb Klammer ...
      iMin = i;                                            // iMin aktualisieren 
    }
  return iMin;                                             // R�ckgabewert
  }
  
// Bestandteile von Summe, Differenz, Plus- oder Minus-Ausdruck:
// s ... Zeichenkette
// R�ckgabewert: Array der Bestandteile (Rechen- bzw. Vorzeichen, Operanden) oder undefined

function partsPlusMinus (s) {
  var i = rightPosChar("+",s);                             // Position Pluszeichen oder -1
  var j = rightPosChar("-",s);                             // Position Minuszeichen oder -1
  var k = Math.max(i,j);                                   // Maximum der beiden Positionen oder -1
  if (k < 0) return undefined;                             // R�ckgabewert, falls Zeichenkette unpassend
  var ch = s.charAt(k);                                    // Rechen- bzw. Vorzeichen
  var s1 = s.substring(0,k);                               // 1. Teil (eventuell leer)
  var s2 = s.substring(k+1);                               // 2. Teil
  if (k == 0) return [ch, s2];                             // R�ckgabewert f�r Plus- oder Minus-Ausdruck
  else return [ch, s1, s2];                                // R�ckgabewert f�r Summe oder Differenz
  }
  
// Bestandteile von Produkt (mit Multiplikationszeichen) oder Quotient:
// s ... Zeichenkette
// R�ckgabewert: Array der Bestandteile (Rechenzeichen, Operanden) oder undefined
  
function partsProdQuot (s) {
  var i = rightPosChar("*",s);                             // Position Multiplikationszeichen oder -1
  var j = rightPosChar(":",s);                             // Position Divisionszeichen oder -1
  var k = Math.max(i,j);                                   // Maximum der beiden Positionen oder -1
  if (k < 0) return undefined;                             // R�ckgabewert, falls Zeichenkette unpassend
  var ch = s.charAt(k);                                    // Rechenzeichen
  var s1 = s.substring(0,k);                               // 1. Teil (eventuell leer)
  var s2 = s.substring(k+1);                               // 2. Teil
  return [ch, s1, s2];                                     // R�ckgabewert f�r Produkt oder Quotient
  }
  
// Bestandteile eines Produkts ohne Multiplikationszeichen:
// s ... Zeichenkette
// R�ckgabewert: Array der Bestandteile (1. und 2. Faktor) oder undefined

function partsProd0 (s) {  
  var res = false;                                         // Flag f�r erfolgreiche Zerlegung
  for (var i=s.length-1; i>0; i--) {                       // F�r alle Zeichenpositionen von rechts nach links ...
    var chR = s.charAt(i);                                 // Aktuelles Zeichen (rechts)
    var dR = like(chR,"\\d");                              // Flag f�r Ziffer (rechts)
    var aR = like(chR,"[a-z]");                            // Flag f�r Variable (rechts)
    var brR = (chR == "(");                                // Flag f�r �ffnende Klammer (rechts)
    var chL = s.charAt(i-1);                               // Aktuelles Zeichen (links)
    var dL = like(chL,"\\d");                              // Flag f�r Ziffer (links)
    var aL = like(chL,"[a-z]");                            // Flag f�r Variable (links)
    var brL = (chL == ")" || chL == "\}");                 // Flag f�r schlie�ende Klammer, Potenz oder Bruchterm (links)
    var sL = s.substring(0,i);                             // Linker Teil der Zerlegung
    if (level(sL,"(",")") != 0) continue;                  // Falls Klammerebene ungleich 0, weiter zur n�chsten Position
    var c1 = aL && (aR || dR || brR);                      // Flag f�r Fall 1 (links Variable, rechts Variable, Ziffer oder Klammer)
    var c2 = dL && (aR || brR);                            // Flag f�r Fall 2 (links Ziffer, rechts Variable oder Klammer)
    var c3 = brL && (aR || dR || brR);                     // Flag f�r Fall 3 (links Klammer, rechts Variable, Ziffer oder Klammer)
    if (c1 || c2 || c3) {                                  // Falls passende Zerlegung gefunden ...
      var i0 = i;                                          // Position speichern                                           
      res = true;                                          // Flag f�r erfolgreiche Zerlegung setzen 
      break;                                               // for-Schleife verlassen
      }                       
    } // Ende for
  if (!res) return undefined;                              // R�ckgabewert, falls keine passende Zerlegung gefunden
  var s1 = s.substring(0,i0), s2 = s.substring(i0);        // Bestandteile der Zerlegung
  var t1 = isFracTerm(s1), t2 = isFracTerm(s2);            // Flags f�r Bruchterme 
  if (t1 || t2) return undefined;                          // R�ckgabewert, falls Bruchterm beteiligt
  return [s1, s2];                                         // R�ckgabewert (Normalfall)
  }
  
// �berpr�fung, ob eine Zeichenkette einem Produkt ohne Multiplikationszeichen entspricht:
// s ... Zeichenkette

function isProd0 (s) {
  return (partsProd0(s) != undefined);                     // R�ckgabewert
  }
  
// �berpr�fung, ob eine Zeichenkette einem vollst�ndigen Produkt ohne Multiplikationszeichen entspricht:
// s ... Zeichenkette
  
function isCompleteProd0 (s) {
  var a = partsProd0(s);                                   // Array der Bestandteile
  if (a == undefined) return false;                        // R�ckgabewert, falls kein Produkt ohne Multiplikationszeichen
  else try {                                               // Sonst Versuch ...
    var t = constrTerm(s,0,0);                             // Termkonstruktion
    return t.complete;                                     // R�ckgabewert je nach Vollst�ndigkeit
    }
  catch(err) {return false;}                               // R�ckgabewert, falls Termkonstruktion misslungen
  }
  
// Position einer schlie�enden geschweiften Klammer:
// s ..... Zeichenkette
// beg ... Position der �ffnenden geschweiften Klammer
// R�ckgabewert: Position oder -1
  
function searchEnd (s, beg) {
  var level = 0;                                           // Klammerebene
  for (var i=beg; i<s.length; i++) {                       // F�r alle Positionen ...
    var ch = s.charAt(i);                                  // Aktuelles Zeichen
    if (ch == "\{") level++;                               // Falls geschweifte Klammer auf, Klammerebene erh�hen
    if (ch == "\}") level--;                               // Falls geschweifte Klammer zu, Klammerebene erniedrigen
    if (level == 0 && ch == "\}") return i;                // Falls schlie�ende Klammer gefunden, R�ckgabewert
    }
  return -1;                                               // R�ckgabewert bei erfolgloser Suche
  }
  
// Bestandteile eines Bruchterms:
// s ... Zeichenkette
// R�ckgabewert: Array der Bestandteile (Zustand, Z�hler, Nenner) oder undefined
// Zustand "1", falls Z�hler nicht abgeschlossen, "2", falls Z�hler abgeschlossen, aber nicht Nenner, 
// "3", falls Z�hler und Nenner abgeschlossen 
  
function partsFracTerm (s) {
  if (s.substring(0,2) != "#\{") return undefined;         // Falls Anfang ungleich "#{", R�ckgabewert undefined
  var i = searchEnd(s,1);                                  // Position der schlie�enden geschweiften Klammer nach dem Z�hler oder -1
  var s1 = (i<0 ? s.substring(2) : s.substring(2,i));      // Zeichenkette f�r Z�hler (eventuell leer)
  if (i < 0) return ["1", s1];                             // R�ckgabewert, falls Z�hler nicht abgeschlossen
  var sb = s.substring(i,i+3);                             // Zeichenkette der L�nge 3 nach der Z�hler-Klammer
  if (sb != "\}/\{") return undefined;                     // Falls Zeichenkette ungleich "}/{", R�ckgabewert undefined
  var k = searchEnd(s,i+2);                                // Position der schlie�enden geschweiften Klammer nach dem Nenner oder -1
  if (k >= 0 && k != s.length-1) return undefined;         // R�ckgabewert, falls schlie�ende Klammer nicht am Ende
  var s2 = (k<0 ? s.substring(i+3) : s.substring(i+3,k));  // Zeichenkette f�r Nenner (eventuell leer)
  if (k < 0) return ["2", s1, s2];                         // R�ckgabewert, falls Nenner nicht abgeschlossen
  else return ["3", s1, s2];                               // R�ckgabewert, falls Nenner abgeschlossen
  }
  
// Bruchterm-Typ f�r eine gegebene Zeichenkette:
// s ... Zeichenkette
// R�ckgabewert: 0, falls kein Bruchterm; 1, falls nur Z�hler; 2, falls Nenner unvollst�ndig oder nicht abgeschlossen;
// 3, falls vollst�ndiger Bruchterm
  
function typeFracTerm (s) {
  var a = partsFracTerm(s);                                // Array der Bestandteile oder undefined
  if (a == undefined) return 0;                            // R�ckgabewert, falls kein Bruchterm
  else return Number(a[0]);                                // R�ckgabewert, falls Bruchterm
  }

// �berpr�fung, ob eine Zeichenkette einem unvollst�ndigen Bruchterm entspricht:
// s ... Zeichenkette
  
function isIncompleteFracTerm (s) {
  var a = partsFracTerm(s);                                // Array der Bestandteile oder undefined
  return (a != undefined && (a[0] == "1" || a[0] == "2")); // R�ckgabewert
  }
  
// �berpr�fung, ob eine Zeichenkette einem Bruchterm (vollst�ndig oder unvollst�ndig) entspricht:
// s ... Zeichenkette

function isFracTerm (s) {
  return (partsFracTerm(s) != undefined);                  // R�ckgabewert
  }
  
// Bestandteile einer Potenz:
// s ... Zeichenkette
// R�ckgabewert: Array der Bestandteile (Zustand, Basis, Exponent) oder undefined
// Zustand "1", falls Exponent nicht abgeschlossen; Zustand "2", falls Exponent abgeschlossen

function partsPower (s) {
  var i = leftPosChar("^",s);                              // Position von '^' (m�glichst weit links) oder -1
  if (i < 0) return undefined;                             // Falls kein '^' au�erhalb von Klammern, R�ckgabewert undefined
  if (i == s.length-1 || s.charAt(i+1) != "\{")            // Falls nach '^' keine geschweifte Klammer ...
    return undefined;                                      // R�ckgabewert undefined
  var b = s.substring(0,i);                                // Zeichenkette f�r Basis
  if (!(isNatNum(b) || isDecNum(b) || isBrack(b)           // Falls Basis ungeeignet ...
    || isVar(b) || b == ""))        
    return undefined;                                      // R�ckgabewert undefined
  var k = searchEnd(s,i+1);                                // Position der schlie�enden geschweiften Klammer oder -1
  if (k >= 0 && k != s.length-1) return undefined;         // Falls schlie�ende Klammer nicht am Ende, R�ckgabewert undefined
  var e = (k<0 ? s.substring(i+2) : s.substring(i+2,k));   // Zeichenkette f�r Exponent
  return [(k<0 ? "1" : "2"), b, e];                        // R�ckgabewert
  }
  
// �berpr�fung, ob eine Zeichenkette einer vollst�ndigen Potenz entspricht:
// s ... Zeichenkette
  
function isCompletePower (s) {
  var a = partsPower(s);                                   // Array der Bestandteile oder undefined
  return (a != undefined && a[0] == "2");                  // R�ckgabewert
  }

// �berpr�fung, ob eine Zeichenkette einer unvollst�ndigen Potenz entspricht:
// s ... Zeichenkette
  
function isIncompletePower (s) {
  var a = partsPower(s);                                   // Array der Bestandteile oder undefined
  return (a != undefined && a[0] == "1");                  // R�ckgabewert
  }
  
// �berpr�fung, ob eine Zeichenkette einer Potenz (vollst�ndig oder unvollst�ndig) entspricht:
// s ... Zeichenkette

function isPower (s) {
  return (partsPower(s) != undefined);                     // R�ckgabewert
  }
  
// �berpr�fung, ob eine Zeichenkette einer Potenz einer Variablen oder einer Potenz einer vollst�ndigen Klammer entspricht:

function isPower1 (s) {
  var a = partsPower(s);
  if (a == undefined) return false;
  if (isVar(a[1])) return true;
  if (isCompleteBrack(a[1])) return true;
  return false;
  }
  
// Bestandteile einer runden Klammer:
// s ... Zeichenkette
// R�ckgabewert: Array der Bestandteile (Zustand, Inhalt) oder undefined
// Zustand "1", falls Klammer nicht geschlossen, Zustand "2", falls Klammer geschlossen

function partsBrack (s) {
  if (s.charAt(0) != "(") return undefined;                // Falls nicht Klammer auf am Anfang, R�ckgabewert undefined
  var level = 0;                                           // Klammerebene
  for (var i=0; i<s.length; i++) {                         // F�r alle Zeichenpositionen ...
    var ch = s.charAt(i);                                  // Aktuelles Zeichen
    if (ch == "(") level++;                                // Falls Klammer auf, Klammerebene erh�hen
    if (ch == ")") level--;                                // Falls Klammer zu, Klammerebene erniedrigen
    if (level == 0 && ch == ")" && i < s.length-1)         // Falls vorzeitig Klammer zu ... 
      return undefined;                                    // R�ckgabewert undefined
    }
  if (level > 0) return ["1", s.substring(1)];            // R�ckgabewert f�r unvollst�ndige runde Klammer
  else return ["2", s.substring(1,s.length-1)];           // R�ckgabewert f�r vollst�ndige runde Klammer 
  }

// �berpr�fung, ob eine Zeichenkette einer Klammer (vollst�ndig oder unvollst�ndig) entspricht:
// s ... Zeichenkette
  
function isBrack (s) {
  return (partsBrack(s) != undefined);                     // R�ckgabewert
  }
  
// �berpr�fung, ob eine Zeichenkette einer vollst�ndigen Klammer entspricht:

function isCompleteBrack (s) {
  var a = partsBrack(s);                                   // Array der Bestandteile
  return (a != undefined && a[0] == "2");                  // R�ckgabewert
  }

// �berpr�fung, ob eine Zeichenkette einem Prozentsatz entspricht:
// s ... Zeichenkette
  
function isPerc (s) {
  if (s.charAt(s.length-1) != "%") return false;           // Falls kein Prozentzeichen am Ende, R�ckgabewert false
  var z = s.substring(0,s.length-1);                       // Zeichenkette ohne Prozentzeichen
  if (isNatNum(z)) return true;                            // R�ckgabewert f�r nat�rliche Zahl mit Prozentzeichen
  if (isFracNum(z)) return true;                           // R�ckgabewert f�r Bruchzahl mit Prozentzeichen
  if (isDecNum(z)) return true;                            // R�ckgabewert f�r Dezimalbruch mit Prozentzeichen
  return false;                                            // R�ckgabewert in allen anderen F�llen
  }
  
// Hilfsroutine: Vergleich einer Zeichenkette mit einem Muster
// s ... Zeichenkette
// p ... Zeichenkette f�r Muster (regul�rer Ausdruck); Vorsicht bei bestimmten Zeichen (Punkt)!
// R�ckgabewert: Bei �bereinstimmung true, sonst false

function like (s, p) {
  var a = s.match(new RegExp(p));                          // Array von passenden Teilstrings
  return (a != null && a.length == 1 && a[0] == s);        // R�ckgabewert
  }
  
// �berpr�fung, ob eine Zeichenkette eine nat�rliche Zahl einschlie�lich 0 darstellen kann:
// s ... Zeichenkette
// R�ckgabewert true genau dann, wenn Zeichenkette nicht leer und ausschlie�lich aus Ziffern bestehend;
// f�hrende Nullen erlaubt
    
function isNatNum (s) {
  return like(s,"\\d+");                                   // R�ckgabewert                
  }
  
// Bestandteile eines Bruchs oder einer gemischten Zahl:
// s ... Zeichenkette
// R�ckgabewert: Array der Bestandteile (ganze Zahl, Z�hler, Nenner) oder undefined
  
function partsFracNum (s) {
  var f1 = like(s,"\\d*#\\d*");                            // Vergleich Ziffern # Ziffern
  var f2 = like(s,"\\d*#\\d*/\\d*");                       // Vergleich Ziffern # Ziffern / Ziffern
  if (!f1 && !f2) return undefined;                        // Falls beide Vergleiche negativ, R�ckgabewert undefined
  var i1 = s.indexOf("#");                                 // Position Rautenzeichen (Anfang des Bruchs) 
  var s1 = s.substring(0,i1);                              // Zeichenkette ganze Zahl (eventuell leer)
  var i2 = s.indexOf("/");                                 // Position Slash (Bruchstrich) oder -1
  var s2 = (i2>0 ? s.substring(i1+1,i2) : s.substring(i1+1)); // Zeichenkette Z�hler (eventuell leer)
  if (i2 < 0) return [s1, s2];                             // R�ckgabewert, falls kein Slash vorhanden
  else {
    var s3 = s.substring(i2+1);                            // Zeichenkette Nenner (eventuell leer)
    return [s1, s2, s3];                                   // R�ckgabewert, falls Slash vorhanden
    }
  }
  
// �berpr�fung, ob eine Zeichenkette einem Bruch oder einer gemischten Zahl entspricht:
// s ..... Zeichenkette

function isFracNum (s) {
  return (partsFracNum(s) != undefined);                   // R�ckgabewert
  }
  
// Bestandteile eines Dezimalbruchs (endlich oder unendlich):
// s ..... Zeichenkette
// R�ckgabewert: Array der Bestandteile (ganze Zahl, normale Nachkommastellen, Periode) oder undefined

function partsDecNum (s) {
  var f1 = like(s,"\\d*,\\d*");                            // Vergleich Ziffern Komma Ziffern
  var f2 = like(s,"\\d*,\\d*;\\d*");                       // Vergleich Ziffern Komma Ziffern Strichpunkt Ziffern
  if (!f1 && !f2) return undefined;                        // Falls beide Vergleich negativ, R�ckgabewert undefined
  var i1 = s.indexOf(",");                                 // Position Komma
  var s1 = s.substring(0,i1);                              // Zeichenkette ganze Zahl (eventuell leer)
  var i2 = s.indexOf(";");                                 // Position Strichpunkt (Anfang Periode) oder -1
  var s2 = (i2>0 ? s.substring(i1+1,i2) : s.substring(i1+1)); // Normale Nachkommastellen (eventuell leer)
  if (i2 < 0) return [s1, s2];                             // R�ckgabewert, falls keine Periode
  else {                                                   // Falls Periode ...
    var s3 = s.substring(i2+1);                            // Periodische Nachkommastellen (eventuell leer)
    return [s1, s2, s3];                                   // R�ckgabewert, falls Periode
    }
  }
  
// �berpr�fung, ob eine Zeichenkette einem Dezimalbruch (endlich oder unendlich) entspricht:

function isDecNum (s) {
  return (partsDecNum(s) != undefined);                    // R�ckgabewert
  }
  
// Typ einer Zahl:
// s ..... Zeichenkette

function typeNum (s) {
  if (isNatNum(s)) return "NatNum";                        // Nat�rliche Zahl oder 0
  if (isFracNum(s)) return "FracNum";                      // Bruch oder gemischte Zahl (Seiteneffekt)
  if (isDecNum(s)) return "DecNum";                        // Endlicher oder unendlicher Dezimalbruch (Seiteneffekt)
  }
  
// �berpr�fung, ob eine Zeichenkette einer Zahl entspricht:
// s ... Zeichenkette

function isNum (s) {
  return (typeNum(s) != undefined);                        // R�ckgabewert
  }
  
// �berpr�fung, ob eine Zeichenkette einer Variablen entspricht:

function isVar (s) {
  return like(s,"[a-z]");
  }

// Hilfsroutine: Klammerebene am Ende einer Zeichenkette
// s ..... Zeichenkette
// ch1 ... Zeichen f�r �ffnende Klammer
// ch2 ... Zeichen f�r schlie�ende Klammer

function level (s, ch1, ch2) {
  var lev = 0;                                             // Klammerebene, Startwert
  for (var i=0; i<s.length; i++) {                         // F�r alle Zeichenpositionen ...
    if (s.charAt(i) == ch1) lev++;                         // Falls �ffnende Klammer, Klammerebene erh�hen
    if (s.charAt(i) == ch2) lev--;                         // Falls schlie�ende Klammer, Klammerebene erniedrigen
    }
  return lev;                                              // R�ckgabewert
  }
  
// Konstruktion eines Terms (rekursiv):
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)

function constrTerm (s, x, y) {
  if (s == "") return new Empty(x,y);                      // R�ckgabewert (leerer Term)
  var a = partsPlusMinus(s);                               // Bestandteile eines Ausdrucks mit Plus- oder Minuszeichen
  if (a != undefined) {                                    // Falls Plus- oder Minuszeichen gefunden ...
    if (a[0] == "+") {                                     // Falls Pluszeichen ...
      if (a.length == 2) return new Plus(a,x,y);           // R�ckgabewert (Plus-Ausdruck)
      else return new Sum(a,x,y);                          // R�ckgabewert (Summe)
      }
    else {                                                 // Falls Minuszeichen ...
      if (a.length == 2) return new Minus(a,x,y);          // R�ckgabewert (Minus-Ausdruck)
      else return new Diff(a,x,y);                         // R�ckgabewert (Differenz)
      }
    }
  a = partsProdQuot(s);                                    // Bestandteile eines Produkts oder Quotienten
  if (a != undefined) {                                    // Falls Produkt oder Quotient ...
    if (a[0] == "*") return new Prod(a,x,y);               // R�ckgabewert (Produkt)
    else return new Quot(a,x,y);                           // R�ckgabewert (Quotient)
    }
  a = partsProd0(s);                                       // Bestandteile eines Produkts ohne Multiplikationszeichen
  if (a != undefined) return new Prod0(a,x,y);             // R�ckgabewert (Produkt ohne Multipikationszeichen)
  a = partsPower(s);                                       // Bestandteile einer Potenz
  if (a != undefined) return new Power(a,x,y);             // R�ckgabewert (Potenz)
  a = partsFracTerm(s);                                    // Bestandteile eines Bruchterms 
  if (a != undefined) return new FracTerm(a,x,y);          // R�ckgabewert (Bruchterm)
  a = partsBrack(s);                                       // Bestandteile einer runden Klammer
  if (a != undefined) return new Brack(a,x,y);             // R�ckgabewert (unvollst�ndige oder vollst�ndige runde Klammer)
  if (isPerc(s)) return new Perc(s,x,y);                   // R�ckgabewert (Prozentsatz)  
  switch (typeNum(s)) {                                    // Typ NatNum, FracNum oder DecNum?
    case "NatNum": return new NatNum(s,x,y);               // R�ckgabewert (nat�rliche Zahl oder 0)
    case "FracNum":                                        // Falls Typ FracNum ...
      a = partsFracNum(s);                                 // Bestandteile
      if (a != undefined) return new FracNum(a,x,y);       // R�ckgabewert (Bruch oder gemischte Zahl)
    case "DecNum":                                         // Falls Typ DecNum ...
      a = partsDecNum(s);                                  // Bestandteile
      if (a != undefined) return new DecNum(a,x,y);        // R�ckgabewert (Dezimalbruch endlich/unendlich)
    }
  if (isVar(s)) return new Var(s,x,y);                     // R�ckgabewert (Variable)
  if (level(s,"(",")") < 0) throw closingBracket;          // Falls �berz�hlige schlie�ende Klammer, Ausnahme
  throw unknownError;                                      // Falls unverst�ndlich, Ausnahme
  }
  
