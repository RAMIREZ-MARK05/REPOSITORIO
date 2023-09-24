// Platonische Körper
// Java-Applet (08.06.1998) umgewandelt und ergänzt
// 15.04.2014 - 19.10.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel platonicsolids_de.js) abgespeichert.

// Konstanten:

var colorBackground = "#ffff00";                 // Hintergrundfarbe
var colorCircumsphere = "#ff0000";               // Farbe für Umkugel
var colorVertices = "#ff8080";                   // Farbe für Ecken
var colorMidsphere = "#008000";                  // Farbe für Kantenkugel
var colorMidpointsEdges = "#00ff00";             // Farbe für Kantenmittelpunkte
var colorInsphere = "#0000ff";                   // Farbe für Inkugel
var colorMidpointsFaces = "#ffffff";             // Farbe für Flächenmittelpunkte

var sqrt2 = Math.sqrt(2);                        // Abkürzung für Wurzel aus 2
var sqrt3 = Math.sqrt(3);                        // Abkürzung für Wurzel aus 3
var sqrt5 = Math.sqrt(5);                        // Abkürzung für Wurzel aus 5
var r5p1 = Math.sqrt(5)+1;                       // Abkürzung für Wurzel aus 5 plus 1
var r5m1 = Math.sqrt(5)-1;                       // Abkürzung für Wurzel aus 5 minus 1
var tol = 1e-6;                                  // Tolerierter Abstand von einer Ebene (wegen Rundungsfehlern)
var radius = 150;                                // Umkugelradius (Pixel)
var omega = Math.PI/30;                          // Winkelgeschwindigkeit für Animation (rad/s)

var vertices;                                    // Zweifach indiziertes Array mit den Koordinaten der Ecken
var faces;                                       // Zweifach indiziertes Array der Flächen; zu jeder Fläche ist ein aufsteigend
                                                 // geordnetes Array der beteiligten Eckenindizes vorhanden.
var normals;                                     // Zweifach indiziertes Array mit den Koordinaten der Normalenvektoren (nach außen
                                                 // gerichtet, Indizes wie im Array faces)
var edges;                                       // Zweifach indiziertes Array der Kanten; zu jeder Kante ist ein aufsteigend geordnetes
                                                 // Array mit den beteiligten Eckenindizes und den Indizes der angrenzenden Flächen
                                                 // vorhanden.
var rotAxis;                                     // Lage im Raum (0, 1 oder 2)
                                                 // z-Achse durch Ecke (0), Kantenmittelpunkt (1) oder Flächenmittelpunkt (2)
var radMidsphere;                                // Radius der Kantenkugel
var radInsphere;                                 // Radius der Inkugel
var theta;                                       // Winkel bezüglich x-y-Ebene (Bogenmaß)
var phi;                                         // Winkel bezüglich x-Achse (Bogenmaß)
var a1, a2, b1, b2, b3, c1, c2, c3;              // Koeffizienten für Parallelprojektion

// Attribute:

var canvas, ctx;                                 // Zeichenfläche, Grafikkontext
var width, height;                               // Abmessungen der Zeichenfläche (Pixel)
var u0, v0;                                      // Bildschirmmitte (Pixel)
var rb1, rb2, rb3, rb4, rb5;                     // Radiobuttons für die verschiedenen Körper
var bu;                                          // Schaltknopf für die Lage im Raum
var bu0, bu1, bu2, bu3, bu4;                     // Schaltknöpfe für Bewegungsrichtung
var cb1, cb2, cb3;                               // Optionsfelder für Um-/Kanten-/Inkugel
var state;                                       // Bewegungsrichtung (0 ... 4)
var t0;                                          // Zeitpunkt der letzten Zeichnung (s)

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  } 

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  u0 = canvas.width/2; v0 = canvas.height/2;               // Mittelpunkt der Zeichenfläche (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  ctx.lineWidth = 1;                                       // Liniendicke (wird nicht geändert)
  rb1 = document.getElementById("rb1");                    // Radiobutton für Tetraeder
  getElement("lb1",text01);                                // Erklärender Text (Tetraeder)
  rb2 = getElement("rb2");                                 // Radiobutton für Hexaeder (Würfel)
  getElement("lb2",text02);                                // Erklärender Text (Hexaeder)
  rb3 = getElement("rb3");                                 // Radiobutton für Oktaeder
  getElement("lb3",text03);                                // Erklärender Text (Oktaeder)
  rb4 = getElement("rb4");                                 // Radiobutton für Dodekaeder
  getElement("lb4",text04);                                // Erklärender Text (Dodekaeder)
  rb5 = getElement("rb5");                                 // Radiobutton für Ikosaeder
  getElement("lb5",text05);                                // Erklärender Text (Ikodaeder)
  rb1.checked = true;                                      // Tetraeder ausgewählt
  bu = getElement("bu",text06);                            // Großer Schaltknopf (Lage im Raum)
  bu0 = getElement("stop");                                // Kleiner Schaltknopf (Stopp)
  bu1 = getElement("up");                                  // Kleiner Schaltknopf (nach oben)
  bu2 = getElement("right");                               // Kleiner Schaltknopf (nach rechts)
  bu3 = getElement("down");                                // Kleiner Schaltknopf (nach unten)
  bu4 = getElement("left");                                // Kleiner Schaltknopf (nach links)
  cb1 = getElement("cb1");                                 // Optionsfeld (Umkugel)
  getElement("lbC",text07);                                // Erklärender Text (Umkugel)
  cb2 = getElement("cb2");                                 // Optionsfeld (Kantenkugel)
  getElement("lbM",text08);                                // Erklärender Text (Kantenkugel)
  cb3 = getElement("cb3");                                 // Optionsfeld (Inkugel)
  getElement("lbI",text09);                                // Erklärender Text (Inkugel)
  cb1.checked = false;                                     // Optionsfeld Umkugel deaktiviert
  cb2.checked = false;                                     // Optionsfeld Kantenkugel deaktiviert
  cb3.checked = false;                                     // Optionsfeld Inkugel deaktiviert
  getElement("author",author);                             // Autor (und Übersetzer)
  rotAxis = 0;                                             // Rotationsachse (z-Achse) durch Ecke
  updateCoords();                                          // Berechnungen (Koordinaten usw.)
  theta = 15*Math.PI/180; phi = 15*Math.PI/180;            // Blickrichtung
  t0 = new Date();                                         // Bezugszeitpunkt
  state = 0;                                               // Animation abgeschaltet
  paint();                                                 // Zeichnen
  setInterval(paint,40);                                   // Timer-Intervall 0,040 s
  
  rb1.onchange = updateCoords;                             // Reaktion auf Radiobutton Tetraeder
  rb2.onchange = updateCoords;                             // Reaktion auf Radiobutton Würfel
  rb3.onchange = updateCoords;                             // Reaktion auf Radiobutton Oktaeder
  rb4.onchange = updateCoords;                             // Reaktion auf Radiobutton Dodekaeder
  rb5.onchange = updateCoords;                             // Reaktion auf Radiobutton Ikosaeder
  bu.onclick = reactionPosition;                           // Reaktion auf Schaltknopf (Lage im Raum)
  bu0.onclick = function (e) {state = 0;}                  // Stopp
  bu1.onclick = function (e) {reactionState(1);}           // Bewegung nach oben
  bu2.onclick = function (e) {reactionState(2);}           // Bewegung nach rechts
  bu3.onclick = function (e) {reactionState(3);}           // Bewegung nach unten
  bu4.onclick = function (e) {reactionState(4);}           // Bewegung nach links
  
  } // Ende der Methode start
   
// Reaktion auf großen Schaltknopf (Lage im Raum):
// Seiteneffekt rotAxis, vertices, faces, normals, edges, radMidsphere, radInsphere

function reactionPosition () {
  rotAxis = (rotAxis+1)%3;                       // Zyklisch weiterschalten
  updateCoords();                                // Berechnungen durchführen
  }
  
// Reaktion auf kleine Schaltknöpfe (Bewegungsrichtung):
// s ... Nummer des Schaltknopfs

function reactionState (s) {
  if (state != s) state = s;                     // Gewünschte Bewegungsrichtung
  else state = 0;                                // Bewegung stoppen (gleicher Schaltknopf wie zuletzt)
  t0 = new Date();                               // Anfangszeitpunkt aktualisieren
  }
  
// Berechnungen: Koordinaten der Ecken, Flächen, Kanten, Radien
// Seiteneffekt vertices, faces, normals, edges, radMidsphere, radInsphere
  
function updateCoords () {
  if (rb1.checked) coordsTetrahedron();          // Tetraeder
  if (rb2.checked) coordsHexahedron();           // Hexaeder (Würfel)
  if (rb3.checked) coordsOctahedron();           // Oktaeder
  if (rb4.checked) coordsDodecahedron();         // Dodekaeder
  if (rb5.checked) coordsIcosahedron();          // Ikosaeder  
  getFaces();                                    // Flächen ermitteln 
  getEdges();                                    // Kanten ermitteln
  var rC = rCircumsphere();                      // Umkugelradius (Verhältnis zur Kantenlänge)
  radMidsphere = radius*rMidsphere()/rC;         // Radius der Kantenkugel (Pixel)
  radInsphere = radius*rInsphere()/rC;           // Radius der Inkugel (Pixel)
  }
  
//-----------------------------------------------------------------------------

// Array vertices (zweifach indiziert) vorbereiten:
// n ... Eckenzahl

function initVertices (n) {
  vertices = new Array(n);                       // Neues Array            
  for (var i=0; i<n; i++)                        // Für alle Indizes ... 
    vertices[i] = new Array(3);                  // Neues Array (Dimension 3) für Koordinaten 
  }
  
// Ecke festlegen:
// i ......... Index der Ecke (im Array vertices)
// x, y, z ... Koordinaten

function setVertex (i, x, y, z) {
  vertices[i][0] = x;                            // x-Koordinate
  vertices[i][1] = y;                            // y-Koordinate
  vertices[i][2] = z;                            // z-Koordinate
  }

// Koordinaten der Tetraeder-Ecken berechnen:
// Seiteneffekt vertices 

function coordsTetrahedron () {
  initVertices(4);                               // Array vorbereiten
  // Lage im Raum (rotAxis == 0): z-Achse durch Ecke
  setVertex(0,2,0,-sqrt2/2);                     // 1. Ecke
  setVertex(1,-1,sqrt3,-sqrt2/2);                // 2. Ecke
  setVertex(2,-1,-sqrt3,-sqrt2/2);               // 3. Ecke
  setVertex(3,0,0,3*sqrt2/2);                    // 4. Ecke
  var f = sqrt2/3;                               // Faktor für Skalierung
  for (var i=0; i<4; i++) mult(f,vertices[i]);   // Skalierung durchführen  
  if (rotAxis == 1)                              // Falls z-Achse durch Kantenmittelpunkt ... 
    flip(Math.PI/2,Math.acos(1/sqrt3));          // Kippen
  else if (rotAxis == 2)                         // Falls z-Achse durch Flächenmittelpunkt ... 
    flip(0,Math.PI);                             // Kippen
  }
  
// Koordinaten der Hexaeder-(Würfel-)Ecken berechnen:
// Seiteneffekt vertices

function coordsHexahedron () {
  initVertices(8);                               // Array vorbereiten
  // Lage im Raum (rotAxis == 2): z-Achse durch Flächenmittelpunkte 
  setVertex(0,1,1,-1);                           // 1. Ecke
  setVertex(1,-1,1,-1);                          // 2. Ecke
  setVertex(2,-1,-1,-1);                         // 3. Ecke
  setVertex(3,1,-1,-1);                          // 4. Ecke
  setVertex(4,1,1,1);                            // 5. Ecke
  setVertex(5,-1,1,1);                           // 6. Ecke
  setVertex(6,-1,-1,1);                          // 7. Ecke
  setVertex(7,1,-1,1);                           // 8. Ecke
  var f = 1/sqrt3;                               // Faktor für Skalierung
  for (var i=0; i<8; i++) mult(f,vertices[i]);   // Skalierung durchführen
  if (rotAxis == 0)                              // Falls z-Achse durch Ecken ... 
    flip(Math.PI/4,Math.acos(1/sqrt3));          // Kippen
  else if (rotAxis == 1)                         // Falls z-Achse durch Kantenmittelpunkte ... 
    flip(Math.PI/4,Math.PI/2);                   // Kippen
  } 
  
// Koordinaten der Oktaeder-Ecken berechnen:
// Seiteneffekt vertices

function coordsOctahedron () {
  initVertices(6);                               // Array vorbereiten
  // Lage im Raum (rotAxis == 0): z-Achse durch Ecken
  setVertex(0,1,0,0);                            // 1. Ecke
  setVertex(1,0,1,0);                            // 2. Ecke
  setVertex(2,-1,0,0);                           // 3. Ecke
  setVertex(3,0,-1,0);                           // 4. Ecke
  setVertex(4,0,0,1);                            // 5. Ecke
  setVertex(5,0,0,-1);                           // 6. Ecke
  if (rotAxis == 1)                              // Falls z-Achse durch Kantenmittelpunkte ...
    flip(0,Math.PI/4);                           // Kippen
  else if (rotAxis == 2)                         // Falls z-Achse durch Flächenmittelpunkte ...
    flip(Math.PI/4,Math.acos(1/sqrt3));          // Kippen
  }
  
// Koordinaten der Dodekaeder-Ecken berechnen:

function coordsDodecahedron () {
  initVertices(20);                              // Array vorbereiten
  // Lage im Raum (rotAxis == 1): z-Achse durch Kantenmittelpunkte
  setVertex(0,2,2,2);                            // 1. Ecke
  setVertex(1,-2,2,2);                           // 2. Ecke
  setVertex(2,2,-2,2);                           // 3. Ecke
  setVertex(3,2,2,-2);                           // 4. Ecke
  setVertex(4,0,r5p1,r5m1);                      // 5. Ecke
  setVertex(5,0,r5p1,-r5m1);                     // 6. Ecke
  setVertex(6,r5m1,0,r5p1);                      // 7. Ecke
  setVertex(7,-r5m1,0,r5p1);                     // 8. Ecke
  setVertex(8,r5p1,r5m1,0);                      // 9. Ecke
  setVertex(9,r5p1,-r5m1,0);                     // 10. Ecke
  for (var i=0; i<10; i++) {                     // 11. bis 20. Ecke (Spiegelung am Zentrum)
    vertices[10+i][0] = -vertices[i][0];         // x-Koordinate
    vertices[10+i][1] = -vertices[i][1];         // y-Koordinate
    vertices[10+i][2] = -vertices[i][2];         // z-Koordinate
    }  
  var f = 1/Math.sqrt(12);                       // Faktor für Skalierung
  for (var i=0; i<20; i++) mult(f,vertices[i]);  // Skalierung durchführen                   
  if (rotAxis == 0)                              // Falls z-Achse durch Ecken ...
    flip(Math.PI/2,Math.asin(2/(r5p1*sqrt3)));   // Kippen
  else if (rotAxis == 2)                         // Falls z-Achse durch Flächenmittelpunkte ...
    flip(0,Math.atan(r5m1/2));                   // Kippen
    }

// Koordinaten der Ikosaeder-Ecken berechnen:

function coordsIcosahedron () {
  initVertices(12);                              // Array vorbereiten
  // Lage im Raum (rotAxis == 1): z-Achse durch Kantenmittelpunkte
  setVertex(0,0,2,r5m1);                         // 1. Ecke
  setVertex(1,0,2,-r5m1);                        // 2. Ecke
  setVertex(2,r5m1,0,2);                         // 3. Ecke
  setVertex(3,-r5m1,0,2);                        // 4. Ecke
  setVertex(4,2,r5m1,0);                         // 5. Ecke
  setVertex(5,2,-r5m1,0);                        // 6. Ecke
  for (var i=0; i<6; i++) {                      // 7. bis 12. Ecke (Spiegelung am Zentrum)
    vertices[6+i][0] = -vertices[i][0];          // x-Koordinate
    vertices[6+i][1] = -vertices[i][1];          // y-Koordinate
    vertices[6+i][2] = -vertices[i][2];          // z-Koordinate
    }
  var f = 1/Math.sqrt(10-2*Math.sqrt(5));        // Faktor für Skalierung    
  for (var i=0; i<12; i++) mult(f,vertices[i]);  // Skalierung durchführen
  if (rotAxis == 0)                              // Falls z-Achse durch Ecken ...
      flip(Math.PI/2,Math.asin(Math.sqrt(2/(5+sqrt5))));   // Kippen
  else if (rotAxis == 2)                         // Falls z-Achse durch Flächenmittelpunkte ...
    flip(0,Math.atan(Math.sqrt(2/(7+3*sqrt5)))); // Kippen
  }
  
// Polyeder kippen:
// angleZ ... Winkel der Drehung um die z-Achse (Bogenmaß)
// angleX ... Winkel der Drehung um die x-Achse (Bogenmaß)

function flip (angleZ, angleX) { 
  var cos = Math.cos(angleZ);                    // Cosinuswert des ersten Drehwinkels
  var sin = Math.sin(angleZ);                    // Sinuswert des ersten Drehwinkels
  for (var i=0; i<vertices.length; i++) {        // Für alle Ecken: Drehung um z-Achse
    var x = vertices[i][0], y = vertices[i][1];  // Bisherige Koordinaten
    vertices[i][0] = x*cos-y*sin;                // Neue x-Koordinate 
    vertices[i][1] = x*sin+y*cos;                // Neue y-Koordinate
    }
  cos = Math.cos(angleX);                        // Cosinuswert des zweiten Drehwinkels  
  sin = Math.sin(angleX);                        // Sinuswert des zweiten Drehwinkels
  for (var i=0; i<vertices.length; i++) {        // Für alle Ecken: Drehung um x-Achse
    var y = vertices[i][1], z = vertices[i][2];  // Bisherige Koordinaten
    vertices[i][1] = y*cos-z*sin;                // Neue y-Koordinate
    vertices[i][2] = y*sin+z*cos;                // Neue z-Koordinate
    }
  }
  
// S-Multiplikation (Skalar mal Vektor):
// f ... Skalar
// v ... Vektor (wird verändert)

function mult (f, v) {
  v[0] *= f; v[1] *= f; v[2] *= f;
  }
  
// Skalarprodukt zweier Vektoren:
// a, b ... Gegebene Vektoren (Dimension 3)

function dot (a, b) {
  return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  }
  
// Kreuzprodukt zweier Vektoren:
// a, b ... Gegebene Vektoren (Dimension 3)
  
function cross (a, b) {
  v = new Array(3);
  v[0] = a[1]*b[2]-a[2]*b[1];
  v[1] = a[2]*b[0]-a[0]*b[2];
  v[2] = a[0]*b[1]-a[1]*b[0];
  return v;
  }
  
// Vektor in Einheitsvektor verwandeln:
// v ... Gegebener Vektor (Dimension 3)

function unitVector (v) {
  var q = v[0]*v[0]+v[1]*v[1]+v[2]*v[2];         // Betragsquadrat
  if (q == 0) return;                            // Abbruch, falls Betrag 0
  var len = Math.sqrt(q);                        // Betrag des Vektors
  for (var i=0; i<3; i++) v[i] /= len;           // Division der Koordinaten durch den Betrag
  }
  
// Verbindungsvektor zweier Ecken:
// i1, i2 ... Indizes (im Array vertices)

function connectingVector (i1, i2) {
  var v = new Array(3);                          // Neuer Vektor
  for (var i=0; i<3; i++)                        // Für alle drei Koordinaten ...
    v[i] = vertices[i2][i]-vertices[i1][i];      // Koordinate berechnen
  return v;                                      // Rückgabewert (Verbindungsvektor)
  }
  
// Überprüfung, ob eine Zahl in einem Array vorkommt:
// z ... Zahl
// a ... Array

function isElement (z, a) {
  for (var i=0; i<a.length; i++)                 // Für alle Komponenten des Arrays ...
    if (z == a[i]) return true;                  // Übereinstimmung?
  return false;                                  // Keine Übereinstimmung
  }
  
// Überprüfung, ob eine Fläche mit drei gegebenen Eckenindizes schon bekannt (also in faces vorhanden) ist:
// i1, i2, i3 ... Indizes

function isKnown (i1, i2, i3) {
  for (var i=0; i<faces.length; i++) {           // Für alle schon bekannten Flächen ...
    var f = faces[i];                            // Fläche aus dem Array faces
    if (isElement(i1,f) && isElement(i2,f) && isElement(i3,f))  // Falls alle Indizes vorkommen ...
      return true;                               // Fläche schon bekannt
    }
  return false;                                  // Fläche noch nicht bekannt
  }
  
// Neue Begrenzungsfläche:
// i1, i2, i3 ... Indizes dreier Ecken
// Voraussetzungen: i1 < i2 < i3; die Ecken zu Indizes < i3, die sich von i1 und i2 unterscheiden, dürfen nicht zu dieser Fläche gehören.
// Seiteneffekt: Wenn die Ebene durch die drei gegebenen Ecken den Körper nicht durchschneidet und im Array faces bisher noch nicht
// vorkmmt, wird faces durch eine neue, numerisch geordnete Liste der beteiligten Eckenindizes ergänzt. Außerdem wird in diesem
// Fall der Normalenvektor der Ebene (nach außen gerichtet) zum Array normals hinzugefügt. 
  
function newFace (i1, i2, i3) {
  if (isKnown(i1,i2,i3)) return;                 // Ebene schon bekannt?
  var a = connectingVector(i1,i2);               // 1. Verbindungsvektor (Ecke 1 -> Ecke 2)
  var b = connectingVector(i1,i3);               // 2. Verbindungsvektor (Ecke 1 -> Ecke 3)
  var n = cross(a,b);                            // Normalenvektor der gegebenen Ebene (Kreuzprodukt)
  unitVector(n);                                 // In Normaleneinheitsvektor verwandeln
  var pos = [], neg = [];
  var f = [i1, i2, i3];
  for (var i=0; i<vertices.length; i++) {       // Für alle Ecken ...
    if (i == i1 || i == i2 || i == i3)          // ... bis auf die drei gegebenen ... 
      continue;
    var v = connectingVector(i1,i);              // Verbindungsvektor (Ecke 1 -> neue Ecke)
    var d = dot(v,n);                            // Abstand zur gegebenen Ebene (Hessesche Normalenform)
    if (d > tol) pos.push(i);                    // Ecke im ersten Halbraum? 
    else if (d < -tol) neg.push(i);              // Ecke im zweiten Halbraum?
    else f.push(i);                              // Ecke in der gegebenen Ebene?
    }
  if (neg.length == 0 && pos.length > 0) {       // Falls alle Abstände positiv oder gleich 0 ...    
    faces.push(f);                               // Neue Fläche hinzufügen
    n[0] = -n[0]; n[1] = -n[1]; n[2] = -n[2];    // Normalenvektor umdrehen
    normals.push(n);                             // Neuen Normalenvektor hinzufügen
    }
  if (pos.length == 0 && neg.length > 0) {       // Falls alle Abstände negativ oder gleich 0 ...
    faces.push(f);                               // Neue Fläche hinzufügen
    normals.push(n);                             // Neuen Normalenvektor hinzufügen
    }
  }
  
// Flächen ermitteln:
// Seiteneffekt faces, normals

function getFaces () {
  faces = [];                                    // Leeres Array für Flächen
  normals = [];                                  // Leeres Array für Normalenvektoren
  for (var i1=0; i1<vertices.length-2; i1++)     // Für alle Indizes i1 ...
  for (var i2=i1+1; i2<vertices.length-1; i2++)  // Für alle größeren Indizes i2 ...
  for (var i3=i2+1; i3<vertices.length; i3++)    // Für alle größeren Indizes i3 ...
    newFace(i1,i2,i3);                           // Gegebenenfalls Fläche hinzufügen
  } 
  
// Neue Kante:

function newEdge (i1, i2) {
  var n = 0;
  var i3 = -1, i4 = -1;
  for (var i=0; i<faces.length; i++) {           // Für alle Flächenindizes ...
    var f = faces[i];                            // Fläche
    if (isElement(i1,f) && isElement(i2,f)) {    // Falls beide Endpunkte auf Fläche ... 
      n++;                                       // Zahl der Ebenen erhöhen
      if (n == 1) i3 = i;                        // Index der Fläche 
      else if (n == 2) i4 = i;                   // Index der Fläche
      }
    }
  if (n > 2) alert("Zu viele Ebenen: "+i1+", "+i2);   // Das sollte eigentlich nicht passieren!
  if (n == 2) edges.push([i1,i2,i3,i4]);         // Falls Kante auf genau zwei Ebenen, Kante hinzufügen
  }
  
// Kanten ermitteln:
// Seiteneffekt edges

function getEdges () {
  edges = [];                                    // Leeres Array
  for (var i1=0; i1<vertices.length-1; i1++)     // Für alle Indizes i1 ...
  for (var i2=i1+1; i2<vertices.length; i2++)    // Für alle größeren Indizes i2 ...
    newEdge(i1,i2);                              // Gegebenenfalls Kante hinzufügen
  }
  
// Koeffizienten für die Parallelprojektion berechnen:
// Seiteneffekt a1, a2, b1, b2, b3, c1, c2, c3

function calcCoeff () { 
  var sin = Math.sin(theta), cos = Math.cos(theta);
  a1 = Math.sin(phi); a2 = -Math.cos(phi);       // Nach "rechts" 
  b1 = sin*a2; b2 = -sin*a1; b3 = -cos;          // Nach "oben"           
  c1 = -cos*a2; c2 = cos*a1; c3 = -sin;          // Projektionsrichtung
  }
  
// Waagrechte Bildschirmkoordinate:
// p ... Punkt (Array der Dimension 3)

function screenU (p) {
  return u0+radius*(a1*p[0]+a2*p[1]);
  }
  
// Senkrechte Bildschirmkoordinate:
// p ... Punkt (Array der Dimension 3)

function screenV (p) {
  return v0+radius*(b1*p[0]+b2*p[1]+b3*p[2]);
  }
  
// Radius der Umkugel (im Verhältnis zur Kantenlänge):

function rCircumsphere () {
  if (rb1.checked) return Math.sqrt(6)/4;        // Tetraeder
  if (rb2.checked) return sqrt3/2;               // Würfel
  if (rb3.checked) return sqrt2/2;               // Oktaeder
  if (rb4.checked) return sqrt3*r5p1/4;          // Dodekaeder
  if (rb5.checked) return Math.sqrt(2*(5+sqrt5))/4;   // Ikosaeder
  }
  
// Radius der Kantenkugel (im Verhältnis zur Kantenlänge):

function rMidsphere () {
  if (rb1.checked) return sqrt2/4;               // Tetraeder
  if (rb2.checked) return sqrt2/2;               // Würfel
  if (rb3.checked) return 1/2;                   // Oktaeder
  if (rb4.checked) return (3+sqrt5)/4;           // Dodekaeder
  if (rb5.checked) return r5p1/4;                // Ikosaeder
  }
  
// Radius der Inkugel (im Verhältnis zur Kantenlänge):
  
function rInsphere () {
  if (rb1.checked) return Math.sqrt(6)/12;       // Tetraeder
  if (rb2.checked) return 1/2;                   // Würfel
  if (rb3.checked) return Math.sqrt(6)/6;        // Oktaeder
  if (rb4.checked) return Math.sqrt(10*(25+11*sqrt5))/20;  // Dodekaeder
  if (rb5.checked) return sqrt3*(3+sqrt5)/12;    // Ikosaeder
  }
  
// Sichtbarkeit einer Kante überprüfen:
// i ... Index der Kante im Array edges

function isVisible (i) {
  var i1 = edges[i][2], i2 = edges[i][3];        // Indizes der angrenzenden Flächen
  var n1 = normals[i1], n2 = normals[i2];        // Normalenvektoren
  if (c1*n1[0]+c2*n1[1]+c3*n1[2] < tol) return true;  // 1. Normalenvektor zum Betrachter gerichtet? (Skalarprodukt)
  if (c1*n2[0]+c2*n2[1]+c3*n2[2] < tol) return true;  // 2. Normalenvektor zum Betrachter gerichtet? (Skalarprodukt)
  return false;                                  // Beide Normalenvektoren vom Betrachter weg gerichtet
  }
  
//-----------------------------------------------------------------------------

// Punkt markieren:
// u, v ... Bildschirmkoordinaten
// c ...... Füllfarbe (optional)

function drawPoint (u, v, c) {
  ctx.beginPath();                               // Neuer Pfad
  ctx.arc(u,v,2,0,2*Math.PI,true);               // Kleinen Kreis vorbereiten
  if (c) {ctx.fillStyle = c; ctx.fill();}        // Kreis ausfüllen, falls Füllfarbe definiert
  ctx.strokeStyle = "#000000";                   // Linienfarbe schwarz
  ctx.stroke();                                  // Kreisrand zeichnen
  }
  
// Gestrichelte Linie vorbereiten:
// u1, v1 ... Anfangspunkt
// u2, v2 ... Endpunkt

function prepareDashes (u1, v1, u2, v2) {
  var du = u2-u1, dv = v2-v1;                    // Koordinatendifferenzen
  var l = Math.sqrt(du*du+dv*dv);                // Länge
  var n = Math.floor((l-4)/6);                   // Zahl der Lücken
  var p = (l/2+2-3*n)/l;                         // Parameter am Ende der ersten Linie
  ctx.moveTo(u1,v1);                             // Zum Anfangspunkt
  ctx.lineTo(u1+p*du,v1+p*dv);                   // Weiter zum Ende der ersten Linie
  while (p < 1) {                                // Solange Endpunkt noch nicht erreicht ...
    p += 2/l; if (p >= 1) break;                 // Parameter für Ende der nächsten Lücke
    ctx.moveTo(u1+p*du,v1+p*dv);                 // Zum Anfangspunkt der nächsten Linie
    p += 4/l; if (p > 1) p = 1;                  // Parameter für Ende der Linie
    ctx.lineTo(u1+p*du,v1+p*dv);                 // Linie hinzufügen
    }
  }
      
// Kante für Zeichnung vorbereiten:
// i ... Index der Kante im Array edges

function prepareEdge (i) {
  var i1 = edges[i][0], i2 = edges[i][1];        // Indizes der Ecken im Array vertices
  var p1 = vertices[i1], p2 = vertices[i2];      // Endpunkte der Kante
  var u1 = screenU(p1); var v1 = screenV(p1);    // Bildschirmkoordinaten der ersten Ecke
  var u2 = screenU(p2); var v2 = screenV(p2);    // Bildschirmkoordinaten der zweiten Ecke
  if (isVisible(i)) {                            // Falls Kante sichtbar ...
    ctx.moveTo(u1,v1);                           // Zum Anfangspunkt
    ctx.lineTo(u2,v2);                           // Weiter zum Endpunkt (durchgezogene Linie)
    }
  else prepareDashes (u1,v1,u2,v2);              // Andernfalls gestrichelte Linie vorbereiten
  }
    
// Kugel um den Mittelpunkt des Polyeders zeichnen, Mittelpunkt markieren:
// r ... Radius (Pixel)
// c ... Linienfarbe (optional)

function drawSphere (r, c) {
  ctx.beginPath();                               // Neuer Pfad
  ctx.strokeStyle = (c ? c : "#000000");         // Linienfarbe (übernehmen oder schwarz)
  ctx.arc(u0,v0,r,0,2*Math.PI,true);             // Kreis vorbereiten
  ctx.stroke();                                  // Kreis zeichnen
  drawPoint(u0,v0);                              // Mittelpunkt markieren
  }
  
// Ecke markieren:
// i ... Index im Array vertices
  
function drawVertex (i) {
  var p = vertices[i];                           // Koordinaten der Ecke (Array der Dimension 3)
  var u = screenU(p), v = screenV(p);            // Bildschirmkoordinaten berechnen
  drawPoint(u,v,colorVertices);                  // Ecke markieren
  }
  
// Mittelpunkt einer Menge von Ecken:
// a ... Array mit Indizes der Punkte (bezogen auf vertices), entspricht einer Kante oder einer Fläche
// e ... Flag für Kante (nötig, da das Array edges neben zwei Eckenindizes auch zwei Flächenindizes enthält)

function midpoint (a, e) {
  var n = (e ? 2 : a.length);                    // Zahl der Ecken
  var mp = new Array(3);                         // Neues Array für Mittelpunkt
  for (var k=0; k<3; k++) {                      // Für x-, y- und z-Koordinate ...
    var sum = 0;                                 // Variable für Summe
    for (var i=0; i<n; i++) {                    // Für alle beteiligten Ecken ...
      sum += vertices[a[i]][k];                  // Koordinate der Ecke zur bisherigen Summe addieren
      }
    mp[k] = sum/n;                               // Arithmetisches Mittel bilden
    }
  return mp;                                     // Rückgabewert: Mittelpunkt als Array der Dimension 3
  }
  
// Mittelpunkt eines Arrays von Punkten markieren:
// a ... Array mit Indizes der Punkte (bezogen auf vertices)
// e ... Flag für Kante (nötig, da das Array edges neben zwei Eckenindizes auch zwei Flächenindizes enthält)
// c ... Füllfarbe

function drawMidpoint (a, e, c) {
  var mp = midpoint(a,e);                        // Mittelpunkt berechnen
  var u = screenU(mp), v = screenV(mp);          // Bildschirmkoordinaten
  drawPoint(u,v,c);                              // Mittelpunkt markieren
  }
  
// Umkugel und Ecken zeichnen:
    
function drawVertices () {
  drawSphere(radius,colorCircumsphere);          // Umkugel zeichnen 
  for (var i=0; i<vertices.length; i++)          // Für alle Ecken ...
    drawVertex(i);                               // Ecke markieren
  }
  
// Kantenkugel und Kantenmittelpunkte zeichnen:

function drawMidpointsEdges () {
  drawSphere(radMidsphere,colorMidsphere);       // Kantenkugel zeichnen
  for (var i=0; i<edges.length; i++)             // Für alle Kanten ...
    drawMidpoint(edges[i],true,colorMidpointsEdges);  // Mittelpunkt markieren
  }
  
// Inkugel und Flächenmittelpunkte zeichnen:

function drawMidpointsFaces () {
  drawSphere(radInsphere,colorInsphere);         // Inkugel zeichnen
  for (var i=0; i<faces.length; i++)             // Für alle Flächen ...
    drawMidpoint(faces[i],false,colorMidpointsFaces); // Mittelpunkt markieren
  }
  
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;               // Hintergrundfarbe
  ctx.fillRect(0,0,canvas.width,canvas.height);  // Hintergrund ausfüllen
  if (state != 0) {                              // Falls Animation eingeschaltet ...
    var t = (new Date()-t0)/1000;                // Verstrichene Zeit seit Bezugszeitpunkt (s)
    var angle = omega*t;                         // Drehwinkel (Bogenmaß)
    t0 = new Date();                             // Neuer Bezugszeitpunkt
    if (state == 1) theta += angle;              // Drehung nach oben
    else if (state == 2) phi += angle;           // Drehung nach rechts
    else if (state == 3) theta -= angle;         // Drehung nach unten
    else if (state == 4) phi -= angle;           // Drehung nach links
    if (theta > Math.PI/2) {                     // "Nordpol" erreicht?
      theta = Math.PI/2; state = 0;              // In diesem Fall Drehung beenden
      }
    if (theta < -Math.PI/2) {                    // "Südpol" erreicht?
      theta = -Math.PI/2; state = 0;             // In diesem Fall Drehung beenden
      }
    } 
  calcCoeff();                                   // Koeffizienten für Projektion
  ctx.beginPath();                               // Neuer Pfad
  ctx.strokeStyle = "#000000";                   // Linienfarbe schwarz
  for (var i=0; i<edges.length; i++)             // Für alle Kantenindizes (im Array edges) ...
    prepareEdge(i);                              // Kante vorbereiten
  ctx.stroke();                                  // Alle Kanten zeichnen
  if (cb1.checked) drawVertices();               // Umkugel und Ecken zeichnen
  if (cb2.checked) drawMidpointsEdges();         // Kantenkugel und Kantenmittelpunkte zeichnen
  if (cb3.checked) drawMidpointsFaces();         // Inkugel und Flächenmittelpunkte zeichnen
  }
  
document.addEventListener("DOMContentLoaded",start,false);

