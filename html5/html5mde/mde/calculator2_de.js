// Algebra-Rechner, deutsche Texte
// Letzte Änderung 15.08.2022

// Texte in HTML-Schreibweise:

var text01 = "Zeichen l&ouml;schen";
var text02 = "Alles l&ouml;schen";
var text03 = "Bruch:";                                     // text04 siehe unten!
var text05 = "Dezimalbruch:";                              // text06 siehe unten!
var text07 = "Bruchterm:";                                 // text08 siehe unten!
var text09 = "Potenz:";                                    // text10 siehe unten!
var text12 = "Variable:";                                  // text13 siehe unten!
var author = "W. Fendt 2020";

// Texte in Unicode-Schreibweise:

var text04 = ["", "Z\u00E4hler", "Nenner"];
var text06 = ["", "Nachkommastellen", "Periode"];
var text08 = ["", "Neuer Bruchterm", "Z\u00E4hler bearbeiten", "Nenner bearbeiten", "Bruchterm abschlie\u00DFen"];
var text10 = ["", "Neuer Exponent", "Exponent bearbeiten", "Exponent abschlie\u00DFen"];
var text13 = ["", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
                  "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

var text21 = "Zeichenkette:";
var text22 = "Term:";
var text23 = "Typ:";
var text24 = "Kommentar:";
var text25 = "Ergebnis:";
var text26 = "Faktorisiert:";

var decimalSeparator = ",";                                // Dezimaltrennzeichen (Komma/Punkt)
var symbolMinus = "\u2212";                                // Minuszeichen
var symbolMult = "\u00B7";                                 // Multiplikationszeichen
var symbolDiv = ":";                                       // Divisionszeichen

// Termarten:

var empty = "Leerer Term";
var variable = "Variable";
var natNum = "Nat\u00FCrliche Zahl";
var fracNum = "Bruch oder gemischte Zahl";
var decNum = "Dezimalbruch";
var plus = "Plus-Ausdruck";
var minus = "Minus-Ausdruck";
var brack = "Klammer";
var perc = "Prozentsatz";
var sum = "Summe";
var diff = "Differenz";
var prod = "Produkt";
var prod0 = "Produkt ohne Multiplikationszeichen";
var quot = "Quotient";
var fracTerm = "Bruchterm";
var pow = "Potenz";

// Fehlermeldungen:

var syntaxOK = "Syntax in Ordnung!";
var leadingZero = "F\u00FChrende Null!";
var missingSummand = "2. Summand fehlt!";
var missingSubtrahend = "Subtrahend fehlt!";
var missingFactor1 = "1. Faktor fehlt!";
var missingFactor2 = "2. Faktor fehlt!";
var missingDividend = "Dividend fehlt!";
var missingDivisor = "Divisor fehlt!";
var missingNumerator = "Z\u00E4hler fehlt!";
var openNumerator = "Z\u00E4hler nicht abgeschlossen!";
var missingDenominator = "Nenner fehlt!";
var openDenominator = "Nenner nicht abgeschlossen!";
var missingBase = "Basis fehlt!";
var missingExponent = "Exponent fehlt!";
var openExponent = "Exponent nicht abgeschlossen!";
var openPlus = "Plus-Ausdruck unvollst\u00E4ndig!";
var openMinus = "Minus-Ausdruck unvollst\u00E4ndig!";
var openBracket = "Klammer offen!";
var emptyBracket = "Leere Klammer!";
var closingBracket = "Schlie\u00DFende Klammer sinnlos!";
var missingBracket = "Klammer fehlt!";
var missingInteger = "Ganze Zahl fehlt!";
var missingFractionalPart = "Nachkommastellen fehlen!";
var missingPeriod = "Periodische Nachkommastellen fehlen!";
var incompleteFactorization = "Faktorisierung m\u00F6glicherweise unvollst\u00E4ndig!";

var runtimeOK = "Kein Laufzeitfehler!";
var divisionByZero = "Division durch Null!";
var notIntegerExponent = "Exponent nicht ganzzahlig!";
var tooBigExponent = "Exponent zu gro\u00DF!";

var unknownError = "Unverst\u00E4ndlich!";


