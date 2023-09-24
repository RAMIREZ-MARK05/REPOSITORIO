// Parser f�r Online-Rechner Ausgabenlogik
// 11.08.2021 - 14.08.2021
    
// Suche nach einem Zeichen (au�erhalb von Klammern, m�glichst weit rechts):
// ch ... Gesuchtes Zeichen
// s .... Durchsuchte Zeichenkette
// R�ckgabewert: Position des Zeichens oder (bei erfolgloser Suche) -1
    
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
  
// Bestandteile eines bin�ren Terms (Kennbuchstabe E, I, O oder U):
// s .... Zeichenkette
// ch ... Kennbuchstabe
// R�ckgabewert: Array der Bestandteile (Kennbuchstabe, 1. Teilstring, 2. Teilstring) oder undefined

function partsBinTerm (s, ch) {
  var i = rightPosChar(ch,s);                              // Position des Rechenzeichens (m�glichst weit rechts)
  if (i < 0) return undefined;                             // Falls Rechenzeichen nicht vorhanden, R�ckgabewert undefiniert
  var s1 = s.substring(0,i);                               // 1. Teil
  var s2 = s.substring(i+1);                               // 2. Teil
  return [ch, s1, s2];                                     // R�ckgabewert im Normalfall
  }
  
// Bestandteile einer Negation (Kennbuchstabe N):
// s ... Zeichenkette
// R�ckgabewert: Array der Bestandteile (Buchstabe N, Teilstring) oder undefined

function partsNeg (s) {
  if (!s.startsWith("N")) return undefined;                // Falls kein N am Anfang, R�ckgabewert undefiniert
  return ["N", s.substring(1)];                            // R�ckgabewert im Normalfall
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
  
// Hilfsroutine: Vergleich einer Zeichenkette mit einem Muster
// s ... Zeichenkette
// p ... Zeichenkette f�r Muster (regul�rer Ausdruck); Vorsicht bei bestimmten Zeichen (Punkt)!
// R�ckgabewert: Bei �bereinstimmung true, sonst false

function like (s, p) {
  var a = s.match(new RegExp(p));                          // Array von passenden Teilstrings
  return (a != null && a.length == 1 && a[0] == s);        // R�ckgabewert
  }
  
// �berpr�fung, ob eine Zeichenkette einer Variablen entspricht:
// s ... Zeichenkette
// R�ckgabewert: Bei Variable true, sonst false

function isVar (s) {
  return like(s,"[a-z]");                                  // R�ckgabewert
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
  var a = partsBinTerm(s,"E");                             // Bestandteile einer �quivalenz oder undefined
  if (a != undefined) return new Equivalence(a,x,y);       // R�ckgabewert (�quivalenz)
  a = partsBinTerm(s,"I");                                 // Bestandteile einer Implikation oder undefined
  if (a != undefined) return new Implication(a,x,y);       // R�ckgabewert (Implikation)
  a = partsBinTerm(s,"O");                                 // Bestandteile einer Disjunktion oder undefined
  if (a != undefined) return new Disjunction(a,x,y);       // R�ckgabewert (Disjunktion)
  a = partsBinTerm(s,"U");                                 // Bestandteile einer Konjunktion oder undefined
  if (a != undefined) return new Conjunction(a,x,y);       // R�ckgabewert (Konjunktion)
  a = partsNeg(s);                                         // Bestandteile einer Negation oder undefined
  if (a != undefined) return new Negation(a,x,y);          // R�ckgabewert (Negation)
  a = partsBrack(s);                                       // Bestandteile einer runden Klammer
  if (a != undefined) return new Brack(a,x,y);             // R�ckgabewert (unvollst�ndige oder vollst�ndige runde Klammer)
  if (isVar(s)) return new Var(s,x,y);                     // R�ckgabewert (Variable)
  if (s == "F") return new False(s,x,y);                   // R�ckgabewert (Konstante False)
  if (s == "W") return new True(s,x,y);                    // R�ckgabewert (Konstante True)
  if (level(s,"(",")") < 0) throw closingBracket;          // Falls �berz�hlige schlie�ende Klammer, Ausnahme
  throw unknownError;                                      // Falls unverst�ndlich, Ausnahme
  }
  
