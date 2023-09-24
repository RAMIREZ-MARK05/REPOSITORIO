// Dreiecks-Labor, Winkelhalbierende, deutsche Texte
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
var incenter = "I";

var text03 = [["Zu einem Dreieck ABC sollen die",          // step = 0
               "drei Winkelhalbierenden (der",
               "Innenwinkel) gezeichnet werden."], 
              ["Wir beginnen mit der Winkel-",             // step = 1
               "halbierenden von \u03B1."],
              ["Wir beginnen mit der Winkel-",             // step = 2
               "halbierenden von \u03B1.",
               "Die Punkte dieser Winkelhal-",
               "bierenden haben zu den Seiten",
               "[AB] und [AC] gleichen Abstand."],  
              ["Entsprechend haben die Punkte",            // step = 3
               "der Winkelhalbierenden von \u03B2",
               "gleichen Abstand zu [AB] und [BC]."], 
              ["Der Schnittpunkt dieser beiden",           // step = 4
               "Winkelhalbierenden (I) hat also",
               "gleichen Abstand zu allen drei",
               "Ecken."],
              ["Da der Schnittpunkt I gleichen",           // step = 5
               "Abstand zu [AC] und [BC] hat,",
               "muss er auch auf der dritten",
               "Winkelhalbierenden (von \u03B3)",
               "liegen."], 
              ["Die drei Winkelhalbierenden eines",        // step = 6
               "Dreiecks schneiden sich also in",
               "einem Punkt, der zu allen drei",
               "Seiten den gleichen Abstand hat."],
              ["Frage:",                                   // step = 7
               "In welchen Dreiecken gibt es eine",
               "Winkelhalbierende, die ihre Gegen-",
               "seite genau in der Mitte schneidet?"],
              ["Antwort:",                                 // step = 8
               "Das trifft bei gleichschenkligen",
               "Dreiecken zu."]];






