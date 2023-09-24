// Online-Rechner Aussagenlogik, deutsche Texte
// Letzte Änderung 18.08.2021

// Texte in HTML-Schreibweise:

var text01 = "Zeichen l&ouml;schen";
var text02 = "Alles l&ouml;schen";
var text03 = "Zahl der Variablen:";
var text04 = "Variable:";
var author = "W. Fendt 2021";

// Texte in Unicode-Schreibweise:

var text05 = "Term:";
var text06 = "Bemerkung:";
var text07 = "Wahrheitstabelle:";
var text08 = "Disjunktive Normalform:";
var text09 = "Konjunktive Normalform:";

var variables = ["x", "y", "z"];                           // Array-Größe variabel

var symbolFalse = "F";
var symbolTrue = "W";

var empty = "Leerer Term";
var variable = "Variable";
var constant = "Konstante";
var negation = "Negation";
var brack = "Klammer";
var conjunction = "Konjunktion (Und-Verkn\u00FCpfung)";
var disjunction = "Disjunktion (Oder-Verkn\u00FCpfung)";
var implication = "Implikation";
var equivalence = "\u00C4quivalenz";

var symbolNegation = "\u00AC";
var symbolConjunction = "\u2227";
var symbolDisjunction = "\u2228";
var symbolImplication = "\u21D2";
var symbolEquivalence = "\u21D4";

// Fehlermeldungen:

var syntaxOK = "Syntax in Ordnung!";
var missNeg = "Negation unvollst\u00E4ndig!";
var missCon1 = "Konjunktion: Erster Operand fehlt!";
var missCon2 = "Konjunktion unvollst\u00E4ndig!";
var missDis1 = "Disjunktion: Erster Operand fehlt!";
var missDis2 = "Disjunktion unvollst\u00E4ndig!";
var missImp1 = "Implikation: Erster Operand fehlt!";
var missImp2 = "Implikation unvollst\u00E4ndig!";
var missEqu1 = "\u00C4quivalenz: Erster Operand fehlt!";
var missEqu2 = "\u00C4quivalenz unvollst\u00E4ndig!";
var openBracket = "Klammer offen!";
var emptyBracket = "Leere Klammer!";
var closingBracket = "Schlie\u00DFende Klammer sinnlos!";
var missingBracket = "Klammer fehlt!";

var unknownError = "Unverst\u00E4ndlich!";




