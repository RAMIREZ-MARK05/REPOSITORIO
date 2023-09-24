// Rechnen mit beliebiger Genauigkeit, spanische Texte
// Letzte Änderung 18.08.2020

// Texte in HTML-Schreibweise:

var text01 = "Borrar s&iacute;mbolo"; // ?
var text02 = "Borrar todo"; // ?
var text03 = "Fracci&oacute;n:";                           // text04 siehe unten!
var text05 = "N\u00FAmero decimal:";                       // text06 siehe unten!
var text07 = "Fracci&oacute;n algebraica:";                // text08 siehe unten!
var text09 = "Potencia:";                                  // text10 siehe unten!
var author = "W. Fendt 2020";

// Texte in Unicode-Schreibweise:

var text04 = ["", "Numerador", "Denominador"];
var text06 = ["", "Parte decimal", "Per\u00EDodo"];
var text08 = ["", "Nueva fracci\u00F3n", "Editar numerador", "Editar denominador", "Terminar fracci\u00F3n algebraica"]; // ?
var text10 = ["", "Nuevo exponente", "Editar exponente", "Terminar exponente"]; // ?
var text11 = ["Resultado como fracci\u00F3n", "Resultado como n\u00FAmero mixto", "Resultado como n\u00FAmero decimal"]; // ?

var text21 = "Cadena de caracteres:";
var text22 = "Expresi\u00F3n:"; // ?
var text23 = "Tipo:";
var text24 = "Comentario:";
var text25 = "Resultado:";

var decimalSeparator = ",";                                // Dezimaltrennzeichen (Komma/Punkt)
var symbolMinus = "\u2212";                                // Minuszeichen
var symbolMult = "\u00B7";                                 // Multiplikationszeichen
var symbolDiv = "\u00F7";                                  // Divisionszeichen

// Termarten:

var empty = "Expresi\u00F3n vac\u00EDa"; // ?
var natNum = "N\u00FAmero natural";
var fracNum = "Fracci\u00F3n o n\u00FAmero mixto";
var decNum = "N\u00FAmero decimal";
var plus = "M\u00E1s unario"; // ?
var minus = "Menos unario"; // ?
var brack = "Par\u00E9ntesis";
var perc = "Porcentaje";
var sum = "Suma";
var diff = "Diferencia";
var prod = "Producto";
var prod0 = "Producto sin signo de multiplicaci\u00F3n"; // ?
var quot = "Cociente";
var fracTerm = "Fracci\u00F3n algebraica"; // ?
var pow = "Potencia";

// Fehlermeldungen:

var syntaxOK = "\u00A1Sintaxis OK!";
var leadingZero = "\u00A1Cero a la izquierda!";
var missingSummand = "\u00A1Falta el segundo sumando!";
var missingSubtrahend = "\u00A1Falta el sustraendo!";
var missingFactor1 = "\u00A2Falta el primer factor!";
var missingFactor2 = "\u00A1Falta el segundo factor!";
var missingDividend = "\u00A1Falta el dividendo!"; 
var missingDivisor = "\u00A1Falta el divisor!";
var missingNumerator = "\u00A1Falta el numerador!"; 
var openNumerator = "\u00A1Numerador no terminado!"; 
var missingDenominator = "\u00A1Falta el denominador!"; 
var openDenominator = "\u00A1Denominador no terminado!";
var missingBase = "\u00A1Falta la base!"; 
var missingExponent = "\u00A1Falta el exponente!";
var openExponent = "\u00A1Exponente no terminado!";
var openPlus = "\u00A1Expresi\u00F3n M\u00E1s incompleta!"; // ???
var openMinus = "\u00A1Expresi\u00F3n Menos incompleta!"; // ???
var openBracket = "\u00A1Par\u00E9ntesis no terminado!"; 
var emptyBracket = "\u00A1Par\u00E9ntesis vac\u00EDa!"; // ?
var closingBracket = "\u00A1Par\u00E9ntesis de cierre sin sentido!"; // ?
var missingBracket = "\u00A1Falta el par\u00E9ntesis!"; // ?
var missingInteger = "\u00A1Falta el n\u00FAmero entero!";
var missingFractionalPart = "\u00A1Faltan los decimales!"; // ?
var missingPeriod = "\u00A1Falta el per\u00EDodo!"; // ?

var runtimeOK = "\u00A1No error en tiempo de ejecuci\u00F3n!"; // ?
var divisionByZero = "\u00A1Divisi\u00F3n por cero!";
var notIntegerExponent = "\u00A1Exponente no entero!";
var tooBigExponent = "\u00A1Exponente demasiado grande!";

var unknownError = "\u00A1Incomprensible!";


