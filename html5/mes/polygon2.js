// Regelmäßige Vielecke (2), überschlagen
// 26.04.2018 - 27.04.2018

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel polygon_de.js) abgespeichert.

// Attribute:

var canvas2, ctx2;                                         // Zeichenfläche, Grafikkontext
var ip1, ip2;                                              // Eingabefelder
var n1;                                                    // 1. Zahl Schläfli-Symbol (Eckenzahl)
var n2;                                                    // 2. Zahl Schläfli-Symbol
var v2;                                                    // Array mit den Koordinaten der Ecken

// Start:

function start2 () {
  canvas2 = getElement("cv2");                             // Zeichenfläche
  ctx2 = canvas2.getContext("2d");                         // Grafikkontext
  if (canvas2.width != width || canvas2.height != height)  // Falls abweichende Abmessungen ...
    alert("Falsche Abmessungen!");                         // Fehlermeldung
  getElement("lb2",text21);                                // Erklärender Text (Schläfli-Symbol)
  n1 = 5; n2 = 2;                                          // Startwerte für Schläfli-Symbol
  ip1 = getElement("ip1");                                 // Eingabefeld (1. Zahl Schläfli-Symbol)
  ip1.value = String(n1);                                  // Eingabefeld anpassen
  ip2 = getElement("ip2");                                 // Eingabefeld (2. Zahl Schläfli-Symbol)
  ip2.value = String(n2);                                  // Eingabefeld anpassen
  getElement("author2",author);                            // Autor
  getElement("translator2",translator2);                   // Übersetzer  
  paint2();                                                // Zeichnen
  
  ip1.onkeydown = reactionEnter2;                          // Reaktion auf Enter-Taste
  ip2.onkeydown = reactionEnter2;                          // Reaktion auf Enter-Taste

  } // Ende der Methode start
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt n1, n2, v2
  
function reactionEnter2 (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13)                                      // Falls Entertaste (Chrome) ...
    input2();                                              // Daten übernehmen                          
  paint2();                                                // Neu zeichnen
  }
    
//-------------------------------------------------------------------------------------------------

// Eingabe:
// Seiteneffekt n1, n2

function input2 () {
  n1 = inputNumber(ip1,5,100);                             // 1. Zahl Schläfli-Symbol
  n2 = inputNumber(ip2,1,n1-1);                            // 2. Zahl Schläfli-Symbol                  
  }
  
// Größter gemeinsamer Teiler (euklidischer Algorithmus):
// a, b ... Gegebene (natürliche) Zahlen

function gcd (a, b) {
  if (a != Math.floor(a) || b != Math.floor(b))            // Falls keine ganze Zahl ...
    return undefined;                                      // Rückgabewert undefiniert
  if (a <= 0 || b <= 0) return undefined;                  // Falls Zahl(en) nicht natürlich, Rückgabewert undefiniert
  while (true) {                                           // Endlosschleife ...
    var c = a%b;                                           // Divisionsrest
    if (c == 0) return b;                                  // Rückgabewert, falls Rest 0
    a = b; b = c;                                          // Zahlen für den nächsten Durchlauf
    }
  }
   
//-------------------------------------------------------------------------------------------------
  
// Grafikausgabe:
// Seiteneffekt v2
  
function paint2 () {
  v2 = coords(n1);                                         // Array mit den Koordinaten der Ecken (Seiteneffekt)
  ctx2.fillStyle = colorBackground;                        // Hintergrundfarbe
  ctx2.fillRect(0,0,width,height);                         // Hintergrund ausfüllen
  newPath(ctx2);                                           // Neuer Grafikpfad (Standardwerte)
  for (var i=0; i<gcd(n1,n2); i++) {                       // Für alle zusammenhängenden Polygone ...
    var k = i;                                             // Index Startpunkt                                       
    ctx2.moveTo(v2[k].x,v2[k].y);                          // Startpunkt
    while (true) {                                         // Endlosschleife ...
      k = (k+n2)%n1;                                       // Index des nächsten Punktes
      ctx2.lineTo(v2[k].x,v2[k].y);                        // Linie zum Grafikpfad hinzufügen
      if (k == i) break;                                   // Falls Startpunkt wieder erreicht, abbrechen
      }
    }
  ctx2.stroke();                                           // Sternpolygon zeichnen
  }
  
document.addEventListener("DOMContentLoaded",start2,false);// Nach dem Laden der Seite Methode start2 aufrufen

