// Regelmäßige Vielecke (1), konvex
// 25.04.2018 - 27.04.2018

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel polygon_de.js) abgespeichert.

// Attribute:

var canvas1, ctx1;                                         // Zeichenfläche, Grafikkontext
var ip;                                                    // Eingabefeld (Eckenzahl)
var cb1, cb2, cb3, cb4;                                    // Optionsfelder
var n;                                                     // Eckenzahl
var v1;                                                    // Array mit den Koordinaten der Ecken
  
// Neues Optionsfeld:
// idCB ... ID des Optionsfelds im HTML-Befehl
// idLB ... ID des Labels im HTML-Befehl
// text ... Erklärender Text

function newCheckbox (idCB, idLB, text) {
  var cb = getElement(idCB);                               // Optionsfeld
  cb.checked = false;                                      // Optionsfeld zunächst nicht ausgewählt
  cb.onchange = paint1;                                    // Reaktion: Neu zeichnen
  getElement(idLB,text);                                   // Erklärender Text
  return cb;                                               // Rückgabewert
  } 

// Start:

function start1 () {
  canvas1 = getElement("cv1");                             // Zeichenfläche
  ctx1 = canvas1.getContext("2d");                         // Grafikkontext
  width = canvas1.width; height = canvas1.height;          // Abmessungen (Pixel)
  getElement("lb1",text11);                                // Erklärender Text (Eckenzahl)
  n = 3;                                                   // Startwert für Eckenzahl
  ip = getElement("ip");                                   // Eingabefeld (Eckenzahl)
  ip.value = String(n);                                    // Eingabefeld anpassen
  cb1 = newCheckbox("cb1","cb1a",text12);                  // Optionsfeld (Umkreis)
  cb2 = newCheckbox("cb2","cb2a",text13);                  // Optionsfeld (Inkreis)
  cb3 = newCheckbox("cb3","cb3a",text14);                  // Optionsfeld (Bestimmungsdreiecke)
  cb4 = newCheckbox("cb4","cb4a",text15);                  // Optionsfeld (Diagonalen)   
  getElement("author1",author);                            // Autor
  getElement("translator1",translator1);                   // Übersetzer
  xM = width/2; yM = height/2;                             // Koordinaten des Mittelpunkts  
  paint1();                                                // Zeichnen
  
  ip.onkeydown = reactionEnter1;                           // Reaktion auf Enter-Taste

  } // Ende der Methode start1
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt n, v1
  
function reactionEnter1 (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13)                                      // Falls Entertaste (Chrome) ...
    input1();                                              // Daten übernehmen                          
  paint1();                                                // Neu zeichnen
  }
    
//-------------------------------------------------------------------------------------------------

// Eingabe:
// Seiteneffekt n 

function input1 () {
  n = inputNumber(ip,3,100);                               // Eckenzahl                   
  }
   
//-------------------------------------------------------------------------------------------------
  
// Grafikausgabe:
// Seiteneffekt v1
  
function paint1 () {
  v1 = coords(n);                                          // Array mit den Koordinaten der Ecken (Seiteneffekt)
  ctx1.fillStyle = colorBackground;                        // Hintergrundfarbe
  ctx1.fillRect(0,0,width,height);                         // Hintergrund ausfüllen
  newPath(ctx1);                                           // Neuer Grafikpfad (Standardwerte)
  ctx1.moveTo(xM,yM-R);                                    // Anfangspunkt (oben)
  for (var i=1; i<=n; i++)                                 // Für alle Indizes ...
    ctx1.lineTo(v1[i%n].x,v1[i%n].y);                      // Linie zum Grafikpfad hinzufügen
  ctx1.stroke();                                           // Vieleck zeichnen
  if (cb1.checked)                                         // Falls gewünscht ...
    circle(ctx1,xM,yM,R);                                  // Umkreis zeichnen
  if (cb2.checked)                                         // Falls gewünscht ... 
    circle(ctx1,xM,yM,R*Math.cos(Math.PI/n));              // Inkreis zeichnen
  if (cb3.checked) {                                       // Falls gewünscht ...
    for (var i=0; i<n; i++)                                // Alle Ecken ... 
      line(ctx1,xM,yM,v1[i].x,v1[i].y);                    // ... mit Mittelpunkt verbinden
    }
  if (cb4.checked) {                                       // Falls gewünscht ...
    for (i=0; i<n-2; i++)                                  // Für alle sinnvollen Anfangspunkte ...
    for (var k=i+2; k<n; k++)                              // Für alle sinnvollen Endpunkte ...
      line(ctx1,v1[i].x,v1[i].y,v1[k].x,v1[k].y);          // Diagonale zeichnen
    }
  }
  
document.addEventListener("DOMContentLoaded",start1,false); // Nach dem Laden der Seite Methode start1 aufrufen

