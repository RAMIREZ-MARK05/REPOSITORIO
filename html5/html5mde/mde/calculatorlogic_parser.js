// Parser für Online-Rechner Ausgabenlogik
// 11.08.2021 - 14.08.2021
    
// Suche nach einem Zeichen (außerhalb von Klammern, möglichst weit rechts):
// ch ... Gesuchtes Zeichen
// s .... Durchsuchte Zeichenkette
// Rückgabewert: Position des Zeichens oder (bei erfolgloser Suche) -1
    
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
  
// Bestandteile eines binären Terms (Kennbuchstabe E, I, O oder U):
// s .... Zeichenkette
// ch ... Kennbuchstabe
// Rückgabewert: Array der Bestandteile (Kennbuchstabe, 1. Teilstring, 2. Teilstring) oder undefined

function partsBinTerm (s, ch) {
  var i = rightPosChar(ch,s);                              // Position des Rechenzeichens (möglichst weit rechts)
  if (i < 0) return undefined;                             // Falls Rechenzeichen nicht vorhanden, Rückgabewert undefiniert
  var s1 = s.substring(0,i);                               // 1. Teil
  var s2 = s.substring(i+1);                               // 2. Teil
  return [ch, s1, s2];                                     // Rückgabewert im Normalfall
  }
  
// Bestandteile einer Negation (Kennbuchstabe N):
// s ... Zeichenkette
// Rückgabewert: Array der Bestandteile (Buchstabe N, Teilstring) oder undefined

function partsNeg (s) {
  if (!s.startsWith("N")) return undefined;                // Falls kein N am Anfang, Rückgabewert undefiniert
  return ["N", s.substring(1)];                            // Rückgabewert im Normalfall
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
  
// Hilfsroutine: Vergleich einer Zeichenkette mit einem Muster
// s ... Zeichenkette
// p ... Zeichenkette für Muster (regulärer Ausdruck); Vorsicht bei bestimmten Zeichen (Punkt)!
// Rückgabewert: Bei Übereinstimmung true, sonst false

function like (s, p) {
  var a = s.match(new RegExp(p));                          // Array von passenden Teilstrings
  return (a != null && a.length == 1 && a[0] == s);        // Rückgabewert
  }
  
// Überprüfung, ob eine Zeichenkette einer Variablen entspricht:
// s ... Zeichenkette
// Rückgabewert: Bei Variable true, sonst false

function isVar (s) {
  return like(s,"[a-z]");                                  // Rückgabewert
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
  var a = partsBinTerm(s,"E");                             // Bestandteile einer Äquivalenz oder undefined
  if (a != undefined) return new Equivalence(a,x,y);       // Rückgabewert (Äquivalenz)
  a = partsBinTerm(s,"I");                                 // Bestandteile einer Implikation oder undefined
  if (a != undefined) return new Implication(a,x,y);       // Rückgabewert (Implikation)
  a = partsBinTerm(s,"O");                                 // Bestandteile einer Disjunktion oder undefined
  if (a != undefined) return new Disjunction(a,x,y);       // Rückgabewert (Disjunktion)
  a = partsBinTerm(s,"U");                                 // Bestandteile einer Konjunktion oder undefined
  if (a != undefined) return new Conjunction(a,x,y);       // Rückgabewert (Konjunktion)
  a = partsNeg(s);                                         // Bestandteile einer Negation oder undefined
  if (a != undefined) return new Negation(a,x,y);          // Rückgabewert (Negation)
  a = partsBrack(s);                                       // Bestandteile einer runden Klammer
  if (a != undefined) return new Brack(a,x,y);             // Rückgabewert (unvollständige oder vollständige runde Klammer)
  if (isVar(s)) return new Var(s,x,y);                     // Rückgabewert (Variable)
  if (s == "F") return new False(s,x,y);                   // Rückgabewert (Konstante False)
  if (s == "W") return new True(s,x,y);                    // Rückgabewert (Konstante True)
  if (level(s,"(",")") < 0) throw closingBracket;          // Falls überzählige schließende Klammer, Ausnahme
  throw unknownError;                                      // Falls unverständlich, Ausnahme
  }
  
