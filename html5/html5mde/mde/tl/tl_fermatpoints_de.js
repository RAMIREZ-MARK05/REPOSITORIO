// Dreiecks-Labor, Fermat-Punkte, deutsche Texte
// Letzte Änderung 27.08.2022

// Texte in HTML-Schreibweise:

var text02 = "Neustart";
var text03 = "N&auml;chster Schritt";
var author = "W. Fendt 2004"; 
var translator = "";

// Texte in Unicode-Schreibweise:

var vertex1 = "A";
var vertex2 = "B";
var vertex3 = "C";
var fermatpoint1 = "F";
var fermatpoint2 = "F'";

// Text für das Auswahlfeld:

var text01 = ["1. Fermat-Punkt", "2. Fermat-Punkt"];

// Text für den 1. Fermat-Punkt:

var text04 = [["\u00DCber den Seiten eines beliebigen",    // step = 0
               "Dreiecks werden nach au\u00DFen",
               "drei gleichseitige Dreiecke ge-",
               "zeichnet."],
              ["\u00DCber den Seiten eines beliebigen",    // step = 1
               "Dreiecks werden nach au\u00DFen",
               "drei gleichseitige Dreiecke ge-",
               "zeichnet."],
              ["\u00DCber den Seiten eines beliebigen",    // step = 2
               "Dreiecks werden nach au\u00DFen",
               "drei gleichseitige Dreiecke ge-",
               "zeichnet."],
              ["\u00DCber den Seiten eines beliebigen",    // step = 3
               "Dreiecks werden nach au\u00DFen",
               "drei gleichseitige Dreiecke ge-",
               "zeichnet."],
              ["Die neu dazugekommenen Ecken",             // step = 4
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "gegen\u00FCberliegenden Ecken des",
               "urspr\u00FCnglichen Dreiecks."],
              ["Die neu dazugekommenen Ecken",             // step = 5
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "gegen\u00FCberliegenden Ecken des",
               "urspr\u00FCnglichen Dreiecks."],
              ["Die neu dazugekommenen Ecken",             // step = 6
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "gegen\u00FCberliegenden Ecken des",
               "urspr\u00FCnglichen Dreiecks."],
              ["Die neu dazugekommenen Ecken",             // step = 7
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "gegen\u00FCberliegenden Ecken des",
               "urspr\u00FCnglichen Dreiecks."],
              ["Die neu dazugekommenen Ecken",             // step = 8
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "gegen\u00FCberliegenden Ecken des",
               "urspr\u00FCnglichen Dreiecks."],
              ["Die neu dazugekommenen Ecken",             // step = 9
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "gegen\u00FCberliegenden Ecken des",
               "urspr\u00FCnglichen Dreiecks."],
              ["Die gezeichneten Verbindungs-",            // step = 10
               "geraden schneiden sich in einem",
               "einzigen Punkt F. Man bezeichnet",
               "ihn als den 1. Fermat-Punkt des",
               "Dreiecks ABC."],
              ["Frage:",                                   // step = 11
               "Unter welcher Voraussetzung",
               "stimmt der 1. Fermat-Punkt F",
               "mit einer Ecke des gegebenen",
               "Dreiecks ABC \u00FCberein?"],
              ["Antwort:",                                 // step = 12
               "Wenn das gegebene Dreieck ABC",
               "einen 120\u00B0-Winkel besitzt, dann",
               "stimmt der 1. Fermat-Punkt mit",
               "dem Scheitel des 120\u00B0-Winkels",
               "\u00FCberein."]];
               
// Text für den 2. Fermat-Punkt:

var text05 = [["\u00DCber den Seiten eines beliebigen",    // step = 0
               "Dreiecks werden nach innen",
               "drei gleichseitige Dreiecke ge-",
               "zeichnet."],
              ["\u00DCber den Seiten eines beliebigen",    // step = 1
               "Dreiecks werden nach innen",
               "drei gleichseitige Dreiecke ge-",
               "zeichnet."],
              ["\u00DCber den Seiten eines beliebigen",    // step = 2
               "Dreiecks werden nach innen",
               "drei gleichseitige Dreiecke ge-",
               "zeichnet."],
              ["\u00DCber den Seiten eines beliebigen",    // step = 3
               "Dreiecks werden nach innen",
               "drei gleichseitige Dreiecke ge-",
               "zeichnet."],
              ["Die neu dazugekommenen Ecken",             // step = 4
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "entsprechenden Ecken des ur-",
               "spr\u00FCnglichen Dreiecks."],
              ["Die neu dazugekommenen Ecken",             // step = 5
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "entsprechenden Ecken des ur-",
               "spr\u00FCnglichen Dreiecks."],
              ["Die neu dazugekommenen Ecken",             // step = 6
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "entsprechenden Ecken des ur-",
               "spr\u00FCnglichen Dreiecks."],
              ["Die neu dazugekommenen Ecken",             // step = 7
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "entsprechenden Ecken des ur-",
               "spr\u00FCnglichen Dreiecks."],
              ["Die neu dazugekommenen Ecken",             // step = 8
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "entsprechenden Ecken des ur-",
               "spr\u00FCnglichen Dreiecks."],
              ["Die neu dazugekommenen Ecken",             // step = 9
               "der aufgesetzten gleichseitigen",
               "Dreiecke verbindet man mit den",
               "entsprechenden Ecken des ur-",
               "spr\u00FCnglichen Dreiecks."],
              ["Die gezeichneten Verbindungs-",            // step = 10
               "geraden schneiden sich in einem",
               "einzigen Punkt F'. Man bezeichnet",
               "ihn als den 2. Fermat-Punkt des",
               "Dreiecks ABC."],
              ["Frage:",                                   // step = 11
               "Unter welcher Voraussetzung",
               "stimmt der 2. Fermat-Punkt F'",
               "mit einer Ecke des gegebenen",
               "Dreiecks ABC \u00FCberein?"],
              ["Antwort:",                                 // step = 12
               "Wenn das gegebene Dreieck ABC",
               "einen 60\u00B0-Winkel besitzt, dann",
               "stimmt der 2. Fermat-Punkt mit",
               "dem Scheitel des 60\u00B0-Winkels",
               "\u00FCberein."]];
               






