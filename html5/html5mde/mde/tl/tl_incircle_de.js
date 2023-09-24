// Dreiecks-Labor, Inkreis, deutsche Texte
// Letzte Änderung 22.08.2022

// Texte in HTML-Schreibweise:

var text01 = "Neustart";
var text02 = "N&auml;chster Schritt";
var author = "W. Fendt 2004"; 
var translator = "";

// Texte in Unicode-Schreibweise:

var vertex1 = "A";
var vertex2 = "B";
var vertex3 = "C";
var incenter = "I";

var text03 = [["Zu einem gegebenen Dreieck ABC",           // step = 0
               "soll ein Kreis gefunden werden,",
               "der alle drei Seiten des Dreiecks",
               "ber\u00FChrt. Einen solchen Kreis",
               "nennt man Inkreis."], 
              ["Der Mittelpunkt I des Inkreises",          // step = 1
               "muss von allen drei Seiten glei-",
               "chen Abstand haben."],
              ["Wenn der gesuchte Mittelpunkt I",          // step = 2
               "gleichen Abstand von den Seiten",
               "[AB] und [AC] haben soll, ..."],  
              ["..., dann muss er auf der Winkel-",        // step = 3
               "halbierenden von \u03B1 liegen."], 
              ["Entsprechend sollte der Inkreis-",         // step = 4
               "mittelpunkt I gleichen Abstand von",
               "[AB] und [BC] haben. Er muss also",
               "auch auf der Winkelhalbierenden",
               "von \u03B2 liegen."],
              ["Der Punkt I ist als Schnittpunkt",         // step = 5
               "der bisher betrachteten Winkel-",
               "halbierenden eindeutig festgelegt.",
               "Da I auch von [AC] und [BC]",
               "gleichen Abstand hat, liegt I auch",
               "auf der dritten Winkelhalbierenden",
               "(n\u00E4mlich der von \u03B3)."], 
              ["Es m\u00FCssen also alle drei Winkel-",    // step = 6
               "halbierenden durch den Punkt I",
               "gehen."],
              ["Weil der Punkt I von den Seiten",          // step = 7
               "gleichen Abstand hat, kann man",
               "einen Kreis um I zeichnen, der",
               "alle drei Seiten ber\u00FChrt.",
               "Das ist der gesuchte Inkreis."]];






