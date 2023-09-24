// Umkreis eines Dreiecks, deutsche Texte
// Letzte Änderung 25.03.2020

// Texte in HTML-Schreibweise:

var text01 = "Neustart";
var text02 = "N&auml;chster Schritt";
var author = "W. Fendt 1997"; 
var translator = "";

// Texte in Unicode-Schreibweise:

var text03 = [["Links ist ein Dreieck ABC",                // step == 0
               "abgebildet. Du kannst",
               "die Ecken dieses Dreiecks",
               "mit gedr\u00FCckter Maustaste",
               "verschieben."],
              ["Die Punkte der Mittel-",                   // step == 1
               "senkrechten m_(c) haben",
               "von den Punkten A und B",
               "die gleiche Entfernung."],
              ["Entsprechend haben die",                   // step == 2
               "Punkte der Mittelsenkrechten",
               "m_(a) von den Punkten B und C",
               "die gleiche Entfernung."],
              ["Der Schnittpunkt U dieser",                // step == 3
               "beiden Mittelsenkrechten",
               "hat daher auch von A und C",
               "die gleiche Entfernung."],
              ["Dieser Schnittpunkt U muss",               // step == 4
               "folglich auch auf der dritten",
               "Mittelsenkrechten (m_(b)) liegen."],
              ["Da der Punkt U von allen drei",            // step == 5
               "Ecken des Dreiecks dieselbe",
               "Entfernung hat, gibt es einen",
               "Kreis um U, der zugleich durch",
               "alle drei Ecken geht."],
              ["Diesen Kreis bezeichnet man",              // step == 6
               "als Umkreis."]];
               
var vertex1 = "A";
var vertex2 = "B";
var vertex3 = "C";
var circumcenter = "U";






