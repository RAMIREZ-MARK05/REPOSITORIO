// Dreiecks-Labor, Umkreis, deutsche Texte
// Letzte Änderung 25.08.2022

// Texte in HTML-Schreibweise:

var text01 = "Neustart";
var text02 = "N&auml;chster Schritt";
var author = "W. Fendt 2004"; 
var translator = "";

// Texte in Unicode-Schreibweise:

var vertex1 = "A";
var vertex2 = "B";
var vertex3 = "C";
var circumcenter = "U";

var text03 = [["Zu einem gegebenen Dreieck ABC",           // step = 0
               "soll ein Kreis gefunden werden,",
               "der durch alle drei Ecken des",
               "Dreiecks geht. Einen solchen",
               "Kreis nennt man Umkreis."], 
              ["Der Mittelpunkt U des Umkreises",          // step = 1
               "muss von allen drei Ecken",
               "gleich weit entfernt sein."],
              ["Wenn der gesuchte Mittelpunkt",            // step = 2
               "U gleiche Entfernung von den",
               "Punkten A und B haben soll, ..."],
              ["... dann kann er nur auf der",             // step = 3
               "Mittelsenkrechten zu A und B",
               "liegen."],
              ["Entsprechend sollte der Umkreis-",         // step = 4
               "mittelpunkt U gleiche Entfernung",
               "von B und C haben. Er muss also",
               "auch auf der Mittelsenkrechten",
               "zu B und C liegen."],
              ["Der Punkt U ist als Schnittpunkt",         // step = 5
               "der bisher betrachteten Mittel-",
               "senkrechten eindeutig festge-",
               "legt. Weil U auch von A und C",
               "gleich weit entfernt ist, liegt U",
               "auch auf der dritten Mittel-",
               "senkrechten (n\u00E4mlich der zu",
               "A und C)."],
              ["Es m\u00FCssen also alle drei Mittel-",    // step = 6
               "senkrechten durch den Punkt U",
               "gehen."],
              ["Weil der Punkt U von den Ecken",           // step = 7
               "gleich weit entfernt ist, kann",
               "man einen Kreis um U zeichnen,",
               "der durch alle drei Ecken geht.",
               "Das ist der gesuchte Umkreis."],
              ["Frage:",                                   // step = 8
               "Im Sonderfall eines rechtwinkligen",
               "Dreiecks hat der Umkreis einen",
               "bekannten Namen. Welchen?"],
              ["Antwort:",                                 // step = 9
               "Der Umkreis eines rechtwinkligen",
               "Dreiecks ist der Thaleskreis."]];






