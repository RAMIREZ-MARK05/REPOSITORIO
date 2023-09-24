// Inkreis eines Dreiecks, deutsche Texte
// Letzte Änderung 29.03.2020

// Texte in HTML-Schreibweise:

var text01 = "Neustart";
var text02 = "N&auml;chster Schritt";
var author = "W. Fendt 1998"; 
var translator = "";

// Texte in Unicode-Schreibweise:

var text03 = [["Links ist ein Dreieck ABC",                // step == 0
               "abgebildet. Du kannst",
               "die Ecken dieses Dreiecks",
               "mit gedr\u00FCckter Maustaste",
               "verschieben."],
              ["Die Punkte der Winkel-",                   // step == 1
               "halbierenden w_(\u03B1) haben",
               "von den Geraden AB und AC",
               "den gleichen Abstand."],
              ["Entsprechend haben die",                   // step == 2
               "Punkte der Winkelhalbierenden",
               "w_(\u03B2) von den Geraden AB und",
               "BC den gleichen Abstand."],
              ["Der Schnittpunkt I dieser beiden",         // step == 3
               "Winkelhalbierenden hat daher",
               "auch von AC und BC den gleichen",
               "Abstand."],
              ["Dieser Schnittpunkt I muss",            // step == 4
               "folglich auch auf der dritten",
               "Winkelhalbierenden (w_(\u03B3))",
               "liegen."],
              ["Da der Punkt I von allen drei",            // step == 5
               "Seiten des Dreiecks denselben",
               "Abstand hat, gibt es einen",
               "Kreis um I, der zugleich alle",
               "drei Seiten ber\u00FChrt."],
              ["Diesen Kreis bezeichnet man",              // step == 6
               "als Inkreis."]];
               
var vertex1 = "A";
var vertex2 = "B";
var vertex3 = "C";
var angle1 = "\u03B1";                                     // alpha
var angle2 = "\u03B2";                                     // beta
var angle3 = "\u03B3";                                     // gamma
var incenter = "I";






