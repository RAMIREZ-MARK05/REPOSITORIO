// Regelm��ige Vielecke (1), konvex
// 25.04.2018 - 27.04.2018

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel polygon_de.js) abgespeichert.

// Attribute:

var canvas1, ctx1;                                         // Zeichenfl�che, Grafikkontext
var ip;                                                    // Eingabefeld (Eckenzahl)
var cb1, cb2, cb3, cb4;                                    // Optionsfelder
var n;                                                     // Eckenzahl
var v1;                                                    // Array mit den Koordinaten der Ecken
  
// Neues Optionsfeld:
// idCB ... ID des Optionsfelds im HTML-Befehl
// idLB ... ID des Labels im HTML-Befehl
// text ... Erkl�render Text

function newCheckbox (idCB, idLB, text) {
  var cb = getElement(idCB);                               // Optionsfeld
  cb.checked = false;                                      // Optionsfeld zun�chst nicht ausgew�hlt
  cb.onchange = paint1;                                    // Reaktion: Neu zeichnen
  getElement(idLB,text);                                   // Erkl�render Text
  return cb;                                               // R�ckgabewert
  } 

// Start:

function start1 () {
  canvas1 = getElement("cv1");                             // Zeichenfl�che
  ctx1 = canvas1.getContext("2d");                         // Grafikkontext
  width = canvas1.width; height = canvas1.height;          // Abmessungen (Pixel)
  getElement("lb1",text11);                                // Erkl�render Text (Eckenzahl)
  n = 3;                                                   // Startwert f�r Eckenzahl
  ip = getElement("ip");                                   // Eingabefeld (Eckenzahl)
  ip.value = String(n);                                    // Eingabefeld anpassen
  cb1 = newCheckbox("cb1","cb1a",text12);                  // Optionsfeld (Umkreis)
  cb2 = newCheckbox("cb2","cb2a",text13);                  // Optionsfeld (Inkreis)
  cb3 = newCheckbox("cb3","cb3a",text14);                  // Optionsfeld (Bestimmungsdreiecke)
  cb4 = newCheckbox("cb4","cb4a",text15);                  // Optionsfeld (Diagonalen)   
  getElement("author1",author);                            // Autor
  getElement("translator1",translator1);                   // �bersetzer
  xM = width/2; yM = height/2;                             // Koordinaten des Mittelpunkts  
  paint1();                                                // Zeichnen
  
  ip.onkeydown = reactionEnter1;                           // Reaktion auf Enter-Taste

  } // Ende der Methode start1
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt n, v1
  
function reactionEnter1 (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13)                                      // Falls Entertaste (Chrome) ...
    input1();                                              // Daten �bernehmen                          
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
  ctx1.fillRect(0,0,width,height);                         // Hintergrund ausf�llen
  newPath(ctx1);                                           // Neuer Grafikpfad (Standardwerte)
  ctx1.moveTo(xM,yM-R);                                    // Anfangspunkt (oben)
  for (var i=1; i<=n; i++)                                 // F�r alle Indizes ...
    ctx1.lineTo(v1[i%n].x,v1[i%n].y);                      // Linie zum Grafikpfad hinzuf�gen
  ctx1.stroke();                                           // Vieleck zeichnen
  if (cb1.checked)                                         // Falls gew�nscht ...
    circle(ctx1,xM,yM,R);                                  // Umkreis zeichnen
  if (cb2.checked)                                         // Falls gew�nscht ... 
    circle(ctx1,xM,yM,R*Math.cos(Math.PI/n));              // Inkreis zeichnen
  if (cb3.checked) {                                       // Falls gew�nscht ...
    for (var i=0; i<n; i++)                                // Alle Ecken ... 
      line(ctx1,xM,yM,v1[i].x,v1[i].y);                    // ... mit Mittelpunkt verbinden
    }
  if (cb4.checked) {                                       // Falls gew�nscht ...
    for (i=0; i<n-2; i++)                                  // F�r alle sinnvollen Anfangspunkte ...
    for (var k=i+2; k<n; k++)                              // F�r alle sinnvollen Endpunkte ...
      line(ctx1,v1[i].x,v1[i].y,v1[k].x,v1[k].y);          // Diagonale zeichnen
    }
  }
  
document.addEventListener("DOMContentLoaded",start1,false); // Nach dem Laden der Seite Methode start1 aufrufen

