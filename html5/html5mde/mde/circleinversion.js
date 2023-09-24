// Kreisspiegelung
// 22.03.2017 - 23.03.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel circleinversion_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorMapping = "#c000c0";                              // Farbe f�r Abbildung
var colorActive = "#ff0000";                               // Farbe f�r aktives Objekt (Zugmodus)
var colorInactive = "#000000";                             // Farbe f�r gegebene Objekte (nicht aktiv)
var colorImage = "#0000ff";                                // Farbe f�r Bildobjekte

// Konstanten:

var POINT = 0;                                             // Punkt
var LINE = 1;                                              // Gerade
var RAY = 2;                                               // Halbgerade
var SEGMENT = 3;                                           // Strecke
var CIRCLE = 4;                                            // Kreis
var TRIANGLE = 5;                                          // Dreieck
var QUADRILATERAL = 6;                                     // Viereck

var MIN = 3;                                               // Minimaler Abstand (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var ch;                                                    // Auswahlfeld
var bu1, bu2, bu3;                                         // Schaltkn�pfe
var cb;                                                    // Optionsfeld
var typeObject;                                            // Objekttyp
var ci = {x0: 200, y0: 200, r: 100};                       // Kreisspiegelung
var list;                                                  // Array f�r Daten der Abbildung (Index 0)
                                                           // und der geometrischen Objekte (Index positiv)
var nr;                                                    // Nummer f�r aktives Objekt
var n2;                                                    // Nummer f�r Objekteigenschaft (vorl�ufig)
var nr2;                                                   // Nummer f�r Objekteigenschaft
var drag;                                                  // Flag f�r Zugmodus

// Element der Schaltfl�che (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  } 

// Start:

function start () {
  canvas = getElement("cv");                               // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  bu1 = getElement("bu1",text01);                          // Schaltknopf (Neue Zeichnung)
  ch = getElement("ch");                                   // Auswahlliste (geometrische Objekte)
  initSelect(ch,text02);                                   // Auswahlliste initialisieren
  bu2 = getElement("bu2",text03);                          // Schaltknopf (Objekt hinzuf�gen)
  bu3 = getElement("bu3",text04);                          // Schaltknopf (Objekt l�schen)
  cb = getElement("cb");                                   // Optionsfeld (Bild)
  cb.checked = false;                                      // Optionsfeld zun�chst nicht gew�hlt
  lb = getElement("lb",text05);                            // Erkl�render Text (Bild)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  newList();                                               // Neue Liste
  typeObject = POINT;                                      // Voreinstellung Punkt
  drag = false;                                            // Zugmodus deaktiviert
  paint();                                                 // Zeichnen
  
  bu1.onclick = reactionButton1;                           // Reaktion auf ersten Schaltknopf (Neue Zeichnung)
  ch.onchange = reactionSelect;                            // Reaktion auf Auswahlliste (Objekttyp)
  bu2.onclick = reactionButton2;                           // Reaktion auf zweiten Schaltknopf (Hinzuf�gen)
  bu3.onclick = reactionButton3;                           // Reaktion auf dritten Schaltknopf (Objekt l�schen)
  cb.onclick = paint;                                      // Reaktion auf Optionsfeld
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
    
  } // Ende der Methode start
  
// Initialisierung einer Auswahlliste:
// ch ..... Auswahlliste
// text ... Array der Texte
  
function initSelect (ch, text) {
  for (var i=0; i<text.length; i++) {                      // F�r alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = text[i];                                      // Text des Elements �bernehmen 
    ch.add(o);                                             // Element zur Liste hinzuf�gen
    }
  }
  
// Reaktion auf ersten Schaltknopf (Neue Zeichnung):
// Seiteneffekt
  
function reactionButton1 () {
  newList();                                               // Neue Liste
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Auswahlliste (Objekttyp):
// Seiteneffekt typeObject, list
  
function reactionSelect () {
  typeObject = ch.selectedIndex;                           // Objekttyp speichern
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf zweiten Schaltknopf (Objekt hinzuf�gen):
// Seiteneffekt nr, list
  
function reactionButton2 () {
  var t = typeObject;                                      // Abk�rzung
  if (t == POINT) list.push(newPoint());                   // Entweder neuen Punkt ... 
  else if (t == LINE || t == RAY || t == SEGMENT)          // ... oder neue Gerade/Halbgerade/Strecke ... 
    list.push(newLine(t)); 
  else if (t == CIRCLE) list.push(newCircle());            // ... oder neuen Kreis ...
  else if (t == TRIANGLE) list.push(newPolygon(3));        // ... oder neues Dreieck ...
  else if (t == QUADRILATERAL) list.push(newPolygon(4));   // ... oder neues Viereck in die Liste aufnehmen
  nr = list.length-1;                                      // Letztes Objekt der Liste wird aktives Objekt
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf dritten Schaltknopf (Objekt l�schen):
// Seiteneffekt list, nr, nr2
  
function reactionButton3 () {
  if (nr != undefined) list.splice(nr,1);                  // Aktives Objekt aus der Liste entfernen
  nr = list.length-1;                                      // Letztes Objekt der Liste wird aktives Objekt
  if (nr < 0) {nr = nr2 = undefined;}                      // Falls Liste leer, kein Objekt aktiv
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl)                    
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl)
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  drag = false;                                            // Zugmodus deaktiviert
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  drag = false;                                            // Zugmodus deaktiviert
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus deaktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus deaktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  } 
  
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// x, y ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt drag, nr, nr2, n2, list

function reactionDown (x, y) {
  drag = true;                                             // Zugmodus aktiviert
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  var d = distanceMapping(x,y);                            // Abstand vom Rand des Inversionskreises
  var dMin = d;                                            // Minimaler Abstand (vorl�ufig)
  var n = 0;                                               // Index des n�chstgelegenen Objekts
  nr2 = n2;                                                // Index Objekteigenschaft
  for (var i=1; i<list.length; i++) {                      // F�r alle Indizes der Objektliste ...
    d = distanceObject(x,y,list[i]);                       // Abstand vom Objekt
    if (d < dMin) {dMin = d; n = i; nr2 = n2;}             // Falls n�her als bisher, Variable aktualisieren
    }
  nr = (dMin<20 ? n : undefined);                          // Index des ausgew�hlten Objekts
  if (dMin >= 20) nr2 = undefined;                         // Index der ausgew�hlten Objekteigenschaft
  paint();                                                 // Neu zeichnen
  }
  
// �nderung einer Linie (Gerade, Halbgerade oder Strecke):
// o ....... Linie
// (x,y) ... Position

function updateLine (o, x, y) {
  if (nr2 == 1) {                                          // Falls 1. Punkt ge�ndert werden soll ...
    if (distancePointPoint(o.x2,o.y2,x,y) < MIN) return;   // Falls zu nahe am 2. Punkt, abbrechen
    o.x1 = x; o.y1 = y;                                    // 1. Punkt �ndern 
    }
  else if (nr2 == 2) {                                     // Falls 2. Punkt ge�ndert werden soll ...
    if (distancePointPoint(o.x1,o.y1,x,y) < MIN) return;   // Falls zu nahe am 1. Punkt, abbrechen
    o.x2 = x; o.y2 = y;                                    // 2. Punkt �ndern
    }
  }
  
// �nderung eines Kreises:
// o ....... Kreis
// (x,y) ... Position

function updateCircle (o, x, y) {
  if (nr2 == 1) {o.x = x; o.y = y;}                        // Falls gew�nscht, Mittelpunkt verschieben ...
  else if (nr2 == 2) {                                     // Falls Radius ge�ndert werden soll ...
    var r = distancePointPoint(o.x,o.y,x,y);               // Abstand vom Mittelpunkt
    if (r >= MIN) o.r = r;                                 // Falls Abstand gro� genug, Radius �ndern
    }    
  }
  
// �nderung eines Dreiecks:
// o ....... Dreieck
// (x,y) ... Position

function updateTriangle (o, x, y) {
  var i1 = nr2%3, i2 = (nr2+1)%3;                          // Indizes der anderen Ecken
  if (distancePointPoint(o.x[i1],o.y[i1],x,y) < MIN) return;  // Falls zu nahe an der n�chsten Ecke, abbrechen
  if (distancePointPoint(o.x[i2],o.y[i2],x,y) < MIN) return;  // Falls zu nahe an der vorigen Ecke, abbrechen
  o.x[nr2-1] = x; o.y[nr2-1] = y;                          // Ecke verschieben
  } 
  
// �nderung eines Vierecks:
// o ....... Viereck
// (x,y) ... Position

function updateQuadrilateral (o, x, y) {
  var i1 = nr2%4, i2 = (nr2+1)%4, i3 = (nr2+2)%4;          // Indizes der anderen Ecken
  if (distancePointPoint(o.x[i1],o.y[i1],x,y) < MIN) return;  // Falls zu nahe an der n�chsten Ecke, abbrechen
  if (distancePointPoint(o.x[i2],o.y[i2],x,y) < MIN) return;  // Falls zu nahe an der gegen�berliegenden Ecke, abbrechen
  if (distancePointPoint(o.x[i3],o.y[i3],x,y) < MIN) return;  // Falls zu nahe an der vorigen Ecke, abbrechen
  var v1x = o.x[i1]-x, v1y = o.y[i1]-y;                    // Vektor zur n�chsten Ecke
  var v2x = o.x[i2]-x, v2y = o.y[i2]-y;                    // Vektor zur gegen�berliegenden Ecke
  var v3x = o.x[i3]-x, v3y = o.y[i3]-y;                    // Vektor zur vorigen Ecke
  if ((v3x*v1y-v3y*v1x >= 0)                               // Falls Viereck �berschlagen (Anfang) ...
  && ((v2x*v1y-v2y*v1x >= 0) || (v3x*v2y-v3y*v2x >= 0)))   // Falls Viereck �berschlagen (Fortsetzung) ...
    return;                                                // Abbrechen
  o.x[nr2-1] = x; o.y[nr2-1] = y;                          // Ecke verschieben
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// x, y ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt lr, pr, tl, ro, list

function reactionMove (x, y) {
  if (nr == undefined) return;                             // Falls kein Objekt ausgew�hlt, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (nr == 0) {updateMapping(x,y); return;}               // Gegebenenfalls Abbildung �ndern
  var o = list[nr];                                        // Aktives Objekt
  var t = o.type;                                          // Abk�rzung f�r Objekttyp
  if (t == POINT) {o.x = x; o.y = y;}                      // Gegebenenfalls Punkt verschieben
  else if (t == LINE || t == RAY || t == SEGMENT)          // Falls Gerade, Halbgerade oder Strecke ...
    updateLine(o,x,y);                                     // Linie �ndern
  else if (t == CIRCLE) updateCircle(o,x,y);               // Gegebenenfalls Kreis �ndern
  else if (t == TRIANGLE) updateTriangle(o,x,y);           // Gegebenenfalls Dreieck �ndern
  else if (t == QUADRILATERAL) updateQuadrilateral(o,x,y); // Gegebenenfalls Viereck �ndern
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Neue Liste (Daten der Kreisspiegelung und der Objekte: 
// Seiteneffekt list, nr, nr2, n2

function newList () {
  list = [ci];                                             // Neue Liste (mit Daten der Kreisspiegelung) ...
  nr = nr2 = n2 = undefined;                               // Kein Objekt ausgew�hlt
  }
  
// Radius des Inversionskreises ver�ndern:
// (x,y) ... Position
// Seiteneffekt ci, list
  
function updateMapping (x, y) {
  ci.r = distancePointPoint(ci.x0,ci.y0,x,y);
  paint();                                                 // Neu zeichnen
  }
  
// Zuf�llige Koordinate:

function randomCoordinate (max) {
  return max*(0.1+0.8*Math.random());                      // R�ckgabewert (nicht zu nahe am Rand!)
  }
  
// Neuer Punkt (bestimmt durch Zufallsgenerator):

function newPoint () {
  var px = randomCoordinate(width);                        // x-Koordinate
  var py = randomCoordinate(height);                       // y-Koordinate
  return {type: POINT, x: px, y: py};                      // R�ckgabewert
  }
  
// Neue Gerade/Halbgerade/Strecke (bestimmt durch Zufallsgenerator):
// t ... Typ (LINE, RAY oder SEGMENT)

function newLine (t) {
  var p1x = randomCoordinate(width);                       // x-Koordinate 1. Punkt
  var p1y = randomCoordinate(height);                      // y-Koordinate 1. Punkt
  var p2x = randomCoordinate(width);                       // x-Koordinate 2. Punkt
  var p2y = randomCoordinate(height);                      // y-Koordinate 2. Punkt
  return {type: t,                                         // R�ckgabewert (Anfang)
    x1: p1x, y1: p1y, x2: p2x, y2: p2y};                   // R�ckgabewert (Fortsetzung)
  }
  
// Neuer Kreis (bestimmt durch Zufallsgenerator):

function newCircle () {
  var mx = randomCoordinate(width);                        // x-Koordinate Mittelpunkt
  var my = randomCoordinate(height);                       // y-Koordinate Mittelpunkt
  var rc = randomCoordinate(100);                          // Radius
  return {type: CIRCLE, x: mx, y: my, r: rc};              // R�ckgabewert
  }
  
// Neues Vieleck (bestimmt durch Zufallsgenerator):
// n ... Eckenzahl

function newPolygon (n) {
  var arrayX = new Array(n), arrayY = new Array(n);        // Arrays f�r Koordinaten der Polygonecken                             
  var arrayIX = new Array(n), arrayIY = new Array(n);      // Arrays f�r Koordinaten der Bildpolygonecken
  var arrayIMX = new Array(n), arrayIMY = new Array(n);    // Arrays f�r die Bildpunkte der Seitenmittelpunkte
  var mx = width*(0.25+0.5*Math.random());                 // x-Koordinate Bezugspunkt
  var my = height*(0.25+0.5*Math.random());                // y-Koordinate Bezugspunkt
  for (var i=0; i<n; i++) {                                // F�r alle Ecken ...
    var r = Math.min(width,height)*(0.1+0.2*Math.random());// Abstand zum Bezugspunkt
  	var phi = (2*Math.PI/n)*(i+Math.random());             // Positionswinkel (Bogenma�)
  	arrayX[i] = mx+r*Math.cos(phi);                        // x-Koordinate
  	arrayY[i] = my+r*Math.sin(phi);                        // y-Koordinate
    }  
  var t;                                                   // Variable f�r Objekttyp
  if (n == 3) t = TRIANGLE;                                // Dreieck
  if (n == 4) t = QUADRILATERAL;                           // Viereck
  return {type: t, x: arrayX, y: arrayY,                   // R�ckgabewert Anfang (Typ, Ecken) 
    ix: arrayIX, iy: arrayIY,                              // R�ckgabewert Fortsetzung (Bildpunkte der Ecken)
    imx: arrayIMX, imy: arrayIMY};                         // R�ckgabewert Fortsetzung (Bildpunkte der Seitenmittelpunkte)
  }
  
// Bildpunkt (Kreisspiegelung):
// (x,y) ... Koordinaten des gegebenen Punkts
// R�ckgabewert: Koordinaten des Bildpunkts als Array der Gr��e 2

function imageCircleInversion (x, y) {
  var dx = x-ci.x0, dy = y-ci.y0;                          // Radiusvektor des gegebenen Punkts
  var r = Math.sqrt(dx*dx+dy*dy);                          // Betrag
  var f = (ci.r*ci.r)/(r*r);                               // Faktor
  dx *= f; dy *= f;                                        // Radiusvektor des Bildpunkts
  var image = new Array(2);                                // Neues Array
  image[0] = ci.x0+dx; image[1] = ci.y0+dy;                // Koordinaten des Bildpunkts
  return image;                                            // R�ckgabewert
  }
  
// Bildpunkt:
// p ... Gegebener Punkt
// Seiteneffekt p (p.ix, p.iy)

function calcImagePoint (p) {
  var image = imageCircleInversion(p.x,p.y);               // Bildpunkt von p als Array
  p.ix = image[0]; p.iy = image[1];                        // x- und y-Koordinate
  }
  
// Bildgerade/-halbgerade/-strecke:
// l ... Gegebene Linie (Gerade, Halbgerade oder Strecke)
// Seiteneffekt l (l.ix1, l.iy1, l.ix2, l.iy2, l.ix, l.iy)

function calcImageLine (l) {
  var image = imageCircleInversion(l.x1,l.y1);             // Bildpunkt des 1. Bestimmungspunkts als Array
  l.ix1 = image[0]; l.iy1 = image[1];                      // x- und y-Koordinate
  image = imageCircleInversion(l.x2,l.y2);                 // Bildpunkt des 2. Bestimmungspunkts als Array
  l.ix2 = image[0]; l.iy2 = image[1];                      // x- und y-Koordinate
  var x = (l.x1+l.x2)/2, y = (l.y1+l.y2)/2;                // Mitte zwischen Bestimmungspunkten
  image = imageCircleInversion(x,y);                       // Bildpunkt als Array
  l.ix = image[0]; l.iy = image[1];                        // x- und y-Koordinate
  }
  
// Bildkreis:
// k ... Gegebener Kreis
// Seiteneffekt k (k.ix, k.iy, k.ir)

function calcImageCircle (k) {
  var dx = k.x-ci.x0, dy = ci.y0-k.y;                      // Radiusvektor Mittelpunkt
  var phi = Math.atan2(dy,dx);                             // Positionswinkel Mittelpunkt (Gegenuhrzeiger)
  var d = Math.sqrt(dx*dx+dy*dy);                          // Abstand Inversionszentrum - Mittelpunkt
  var h1 = ci.r*ci.r/(d-k.r);                              // Hilfsgr��e
  var h2 = ci.r*ci.r/(d+k.r);                              // Hilfsgr��e
  var dd = (h1+h2)/2;                                      // Abstand Inversionszentrum - Mittelpunkt Bildkreis
  k.ix = ci.x0+dd*Math.cos(phi);                           // x-Koordinate Mittelpunkt Bildkreis
  k.iy = ci.y0-dd*Math.sin(phi);                           // y-Koordinate Mittelpunkt Bildkreis
  k.ir = Math.abs(h1-h2)/2;                                // Radius Bildkreis
  }
  
// Bildpolygon:
// p ... Gegebenes Polygon
// Seiteneffekt p (p.ix, p.iy, p.imx, p.imy)
  
function calcImagePolygon (p) {
  var n = p.x.length;                                      // Eckenzahl
  for (var i=0; i<n; i++) {                                // F�r alle Indizes ...
    var image = imageCircleInversion(p.x[i],p.y[i]);       // Bildpunkt Ecke als Array
    p.ix[i] = image[0]; p.iy[i] = image[1];                // Koordinaten speichern
    }
  for (i=0; i<n; i++) {                                    // F�r alle Indizes ...
    var ii = (i+1)%n;                                      // Index der n�chsten Ecke
    var mx = (p.x[i]+p.x[ii])/2, my = (p.y[i]+p.y[ii])/2;  // Koordinaten Seitenmittelpunkt
    image = imageCircleInversion(mx,my);                   // Bildpunkt Seitenmittelpunkt als Array
    p.imx[i] = image[0]; p.imy[i] = image[1];              // Koordinaten speichern
    }
  }
  
// Abstand von einem Punkt:
// (x,y) ..... Position
// (x0,y0) ... Punkt
  
function distancePointPoint (x, y, x0, y0) {
  var dx = x-x0, dy = y-y0;                                // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // R�ckgabewert
  }
  
// Abstand von einer Geraden:
// (x,y) ..... Position
// (x1,y1) ... 1. Punkt der Geraden
// (x2,y2) ... 2. Punkt der Geraden
  
function distancePointLine (x, y, x1, y1, x2, y2) {
  var ux = x2-x1, uy = y2-y1;                              // Richtungsvektor
  var vx = x-x1, vy = y-y1;                                // Verbindungsvektor
  var h = (ux*vx+uy*vy);                                   // Hilfsgr��e
  h = h*h/(ux*ux+uy*uy);                                   // Hilfsgr��e neu
  var d1 = distancePointPoint(x,y,x1,y1);                  // Abstand vom 1. Punkt der Geraden
  return Math.sqrt(d1*d1-h);                               // R�ckgabewert
  }
  
// Abstand von einem gegebenen Punkt:
// (x,y) ... Position
// p ....... Punkt
// Seiteneffekt n2
  
function distancePoint (x, y, p) {
  n2 = 1;                                                  // Nummer Objekteigenschaft (Seiteneffekt, unwichtig)
  return distancePointPoint(x,y,p.x,p.y);                  // R�ckgabewert
  } 
  
// Abstand von einer gegebenen Geraden:
// (x,y) ... Position
// l ....... Gerade
// Seiteneffekt n2

function distanceLine (x, y, l) {
  var d1 = distancePointPoint(x,y,l.x1,l.y1);              // Abstand vom 1. Punkt der Geraden
  var d2 = distancePointPoint(x,y,l.x2,l.y2);              // Abstand vom 2. Punkt der Geraden
  n2 = (d1<d2 ? 1 : 2);                                    // Nummer Objekteigenschaft (Seiteneffekt)
  return distancePointLine(x,y,l.x1,l.y1,l.x2,l.y2);       // Abstand von der Geraden
  }
  
// Hilfsroutine: Parameterwert f�r Lotfu�punkt
// (x,y) ..... Position, Ausgangspunkt f�r Lot
// (x1,y1) ... 1. Punkt der Geraden
// (x2,y2) ... 2. Punkt der Geraden

function parameter (x, y, x1, y1, x2, y2) {
  var ux = x2-x1, uy = y2-y1;                              // Richtungsvektor
  var vx = x-x1, vy = y-y1;                                // Verbindungsvektor (x1,y1)-(x,y)
  return (ux*vx+uy*vy)/(ux*ux+uy*uy);                      // R�ckgabewert
  }
  
// Abstand von einer gegebenen Halbgeraden:
// (x,y) ... Position
// l ....... Halbgerade
// Seiteneffekt n2

function distanceRay (x, y, l) {
  var p = parameter(x,y,l.x1,l.y1,l.x2,l.y2);              // Parameterwert Lotfu�punkt
  n2 = (p<0.5 ? 1 : 2);                                    // Nummer Objekteigenschaft (Seiteneffekt)
  if (p < 0) return distancePointPoint(x,y,l.x1,l.y1);     // R�ckgabewert f�r negativen Parameterwert
  else return distancePointLine(x,y,l.x1,l.y1,l.x2,l.y2);  // R�ckgabewert f�r nicht-negativen Parameterwert
  }

// Abstand von einer gegebenen Strecke:
// (x,y) ... Position
// l ....... Strecke
// Seiteneffekt n2

function distanceSegment (x, y, l) {
  var p = parameter(x,y,l.x1,l.y1,l.x2,l.y2);              // Parameterwert Lotfu�punkt
  n2 = (p<0.5 ? 1 : 2);                                    // Nummer Objekteigenschaft (Seiteneffekt)
  if (p > 1) return distancePointPoint(x,y,l.x2,l.y2);     // R�ckgabewert f�r Parameterwert �ber 1
  else if (p < 0) return distancePointPoint(x,y,l.x1,l.y1);// R�ckgabewert f�r Parameterwert unter 0
  else return distancePointLine(x,y,l.x1,l.y1,l.x2,l.y2);  // R�ckgabewert f�r Parameterwert aus [0;1]
  }
  
// Abstand von einem gegebenen Kreis:
// (x,y) ... Position
// k ....... Kreis
// Seiteneffekt n2
  
function distanceCircle (x, y, k) {
  var d1 = distancePointPoint(x,y,k.x,k.y);                // Abstand vom Mittelpunkt
  var d2 = Math.abs(k.r-d1);                               // Abstand vom Rand
  n2 = (d1<d2 ? 1 : 2);                                    // Nummer Objekteigenschaft (Seiteneffekt)
  return Math.min(d1,d2);                                  // R�ckgabewert
  }
  
// Abstand von einem gegebenen Polygon:
// (x,y) ... Position
// p ....... Polygon
// Seiteneffekt n2

function distancePolygon (x, y, p) {
  var dMin = 999999;                                       // Minimaler Abstand (zun�chst sehr gro�)
  for (var i=0; i<p.x.length; i++) {                       // F�r alle Ecken ...
    var d = distancePointPoint(x,y,p.x[i],p.y[i]);         // Abstand von der Ecke
    if (d < dMin) {dMin = d; n2 = i+1;}                    // Falls n�her als bisher, Werte aktualisieren
    }
   return dMin;                                            // R�ckgabewert
  }
  
// Abstand vom Rand des Inversionskreises:
// (x,y) ... Position
// Seiteneffekt n2
  
function distanceMapping (x, y) {
  n2 = 2;                                                  // Nummer Objekteigenschaft (unwichtig, Seiteneffekt)
  var d = distancePointPoint(ci.x0,ci.y0,x,y);             // Abstand vom Inversionszentrum
  return Math.abs(d-ci.r);                                 // R�ckgabewert
  }
  
// Abstand von einem gegebenen geometrischen Objekt:
// (x,y) ... Position
// o ....... Objekt
// Seiteneffekt n2
  
function distanceObject (x, y, o) {
  n2 = undefined;                                          // N�chstgelegenes Objekt unbekannt
  var t = o.type;                                          // Abk�rzung f�r Objekttyp
  if (t == POINT) return distancePoint(x,y,o);             // R�ckgabewert f�r Punkt
  else if (t == LINE) return distanceLine(x,y,o);          // R�ckgabewert f�r Gerade
  else if (t == RAY) return distanceRay(x,y,o);            // R�ckgabewert f�r Halbgerade
  else if (t == SEGMENT) return distanceSegment(x,y,o);    // R�ckgabewert f�r Strecke
  else if (t == CIRCLE) return distanceCircle(x,y,o);      // R�ckgabewert f�r Kreis
  else if (t == TRIANGLE) return distancePolygon(x,y,o);   // R�ckgabewert f�r Dreieck
  else if (t == QUADRILATERAL) return distancePolygon(x,y,o); // R�ckgabewert f�r Viereck
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath(c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Farbe eines gegebenen Objekts:
// o ... Objekt
  
function colorObject (o) {
  if (nr == undefined) return colorInactive;               // R�ckgabewert, falls kein Objekt ausgew�hlt
  else return (o==list[nr] ? colorActive : colorInactive); // R�ckgabewert, falls Objekt ausgew�hlt
  }
  
// Punkt zeichnen:
// (x,y) ... Koordinaten
// c ....... Farbe
  
function point (x, y, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,2,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.fillStyle = c;                                       // F�llfarbe
  ctx.fill(); ctx.stroke();                                // Ausgef�llten Kreis mit schwarzem Rand zeichnen
  }
  
// Punkt oder Bildpunkt zeichnen:
// p .... Punkt
// c .... Farbe
// im ... Flag f�r Bildpunkt
  
function drawPoint (p, c, im) {
  var x = (im ? p.ix : p.x);                               // x-Koordinate (Punkt oder Bildpunkt)
  var y = (im ? p.iy : p.y);                               // y-Koordinate (Punkt oder Bildpunkt)
  point(x,y,c);                                            // Punkt oder Bildpunkt zeichnen
  }
  
// Punkt zeichnen (falls gew�nscht, mit Bildpunkt):
// p .... Gegebener Punkt (Seiteneffekt)
// im ... Flag f�r Bildpunkt

function drawPoint2 (p, im) {
  drawPoint(p,colorObject(p),false);                       // Urspr�nglichen Punkt zeichnen
  if (!im) return;                                         // Falls kein Bildpunkt gew�nscht, abbrechen
  calcImagePoint(p);                                       // Koordinatenberechnung (Seiteneffekt p)
  drawPoint(p,colorImage,true);                            // Bildpunkt zeichnen
  }
  
// Linie zeichnen:
// (x1,y1) ... 1. Bestimmungspunkt
// (x2,y2) ... 2. Bestimmungspunkt
// c ......... Farbe

function line (x1, y1, x2, y2, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Gerade/Halbgerade/Strecke zeichnen:
// l .... Linie (Gerade, Halbgerade oder Strecke; Seiteneffekt)
// t .... Objekttyp (LINE, RAY oder SEGMENT)
// c .... Farbe

function drawLine (l, t, c) {
  var x1 = l.x1, y1 = l.y1;                                // Koordinaten 1. Punkt
  var x2 = l.x2, y2 = l.y2;                                // Koordinaten 2. Punkt
  var ux = x2-x1, uy = y2-y1;                              // Richtungsvektor
  var u = Math.sqrt(ux*ux+uy*uy);                          // Betrag Richtungsvektor
  var f = 1000/u;                                          // Faktor
  var xx1 = x1, yy1 = y1, xx2 = x2, yy2 = y2;              // Koordinaten von Anfangs- und Endpunkt (f�r Strecke)
  if (t == LINE || t == RAY) {                             // Falls Gerade oder Halbgerade ...
    xx2 = x2+f*ux; yy2 = y2+f*uy;                          // Koordinaten des Endpunkts anpassen
    }  
  if (t == LINE) {                                         // Falls Gerade ...
    xx1 = x1-f*ux; yy1 = y1-f*uy;                          // Koordinaten des Anfangspunkts anpassen 
    }               
  line(xx1,yy1,xx2,yy2,c);                                 // Linie zeichnen
  }
  
// Kreisbogen oder Strecke:
// (x1,y1) ... 1. Endpunkt
// (x2,y2) ... 2. Endpunkt
// col ....... Farbe
// (xM,yM) ... Zwischenpunkt (optional)

function arc (x1, y1, x2, y2, col, xM, yM) {
  if (xM == undefined || yM == undefined)                  // Falls kein Zwischenpunkt ...
    {line(x1,y1,x2,y2,c); return;}                         // Strecke zeichnen
  var a = distancePointPoint(x2,y2,xM,yM);                 // 1. Seitenl�nge
  var b = distancePointPoint(xM,yM,x1,y1);                 // 2. Seitenl�nge
  var c = distancePointPoint(x1,y1,x2,y2);                 // 3. Seitenl�nge
  var bcc1 = a*a*(b*b+c*c-a*a);                            // 1. baryzentrische Koordinate
  var bcc2 = b*b*(c*c+a*a-b*b);                            // 2. baryzentrische Koordinate
  var bcc3 = c*c*(a*a+b*b-c*c);                            // 3. baryzentrische Koordinate
  var sum = bcc1+bcc2+bcc3;                                // Summe der baryzentrischen Koordinaten
  var xCC = (bcc1*x1+bcc2*x2+bcc3*xM)/sum;                 // x-Koordinate Umkreismittelpunkt
  var yCC = (bcc1*y1+bcc2*y2+bcc3*yM)/sum;                 // y-Koordinate Umkreismittelpunkt
  var rCC = distancePointPoint(xCC,yCC,x1,y1);             // Umkreisradius
  var w1 = Math.atan2(y1-yCC,x1-xCC);                      // Positionswinkel 1. Endpunkt (Uhrzeigersinn)
  var wM = Math.atan2(yM-yCC,xM-xCC);                      // Positionswinkel Zwischenpunkt (Uhrzeigersinn)
  if (wM > w1+Math.PI) wM -= 2*Math.PI;                    // Abweichung von w1 soll kleiner als pi sein
  if (wM < w1-Math.PI) wM += 2*Math.PI;                    // Abweichung von w1 soll kleiner als pi sein
  var w2 = Math.atan2(y2-yCC,x2-xCC);                      // Positionswinkel 2. Endpunkt (Uhrzeigersinn)
  if (w2 > wM+Math.PI) w2 -= 2*Math.PI;                    // Abweichung von wM soll kleiner als pi sein
  if (w2 < wM-Math.PI) w2 += 2*Math.PI;                    // Abweichung von wM soll kleiner als pi sein
  var pos = true;                                          // Zun�chst positiver Drehsinn
  if (w1 < wM && wM < w2) pos = false;                     // 1. Ausnahmefall
  if (w2 < w1 && w1 < wM) pos = false;                     // 2. Ausnahmefall
  if (wM < w2 && w2 < w1) pos = false;                     // 3. Ausnahmefall
  newPath(col);                                            // Neuer Grafikpfad
  ctx.arc(xCC,yCC,rCC,w1,w2,pos);                          // Kreisbogen vorbereiten
  ctx.stroke();                                            // Kreisbogen zeichnen
  }
  
// Gerade/Halbgerade/Strecke zeichnen (falls gew�nscht, mit Bild):
// l .... Linie (Gerade, Halbgerade oder Strecke; Seiteneffekt)
// t .... Objekttyp (LINE, RAY oder SEGMENT)
// im ... Flag f�r Bild

function drawLine2 (l, t, im) {
  drawLine(l,t,colorObject(l));                            // Urspr�ngliche Gerade/Halbgerade/Strecke zeichnen
  if (!im) return;                                         // Falls kein Bild gew�nscht, abbrechen
  calcImageLine(l,ci);                                     // Koordinatenberechnung (Seiteneffekt l)
  if (t == LINE) {                                         // Falls Gerade ...
    var ux = l.x2-l.x1, uy = l.y2-l.y1;                    // Richtungsvektor
    var p = ux*(ci.x0-l.x1)+uy*(ci.y0-l.y1);               // Z�hler f�r Parameterwert
    p /= (ux*ux+uy*uy);                                    // Parameterwert Lotfu�punkt 
    var fx = l.x1+p*ux, fy = l.y1+p*uy;                    // Lotfu�punkt
    var image = imageCircleInversion(fx,fy);               // Bildpunkt Lotfu�punkt als Array
    var px = image[0], py = image[1];                      // Bildpunkt Lotfu�punkt
    var mx = (px+ci.x0)/2, my = (py+ci.y0)/2;              // Mittelpunkt
    var r = distancePointPoint(ci.x0,ci.y0,mx,my);         // Radius
    circle(mx,my,r,colorImage);                            // Bild (vollst�ndiger Kreis)
    }
  else if (t == RAY)                                       // Falls Halbgerade ... 
    arc(l.ix1,l.iy1,ci.x0,ci.y0,colorImage,l.ix2,l.iy2);   // Bild (Kreisbogen bis Zentrum)
  else if (t == SEGMENT)                                   // Falls Strecke ...
    arc(l.ix1,l.iy1,l.ix2,l.iy2,colorImage,l.ix,l.iy);     // Bild (Kreisbogen)
  }
  
// Kreis zeichnen (eventuell mit Mittelpunkt):
// (x,y) ... Mittelpunkt
// r ....... Radius
// c ....... Farbe
// m ....... Flag f�r Mittelpunkt

function circle (x, y, r, c, m) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.stroke();                                            // Kreis zeichnen
  if (m) point(x,y,c);                                     // Falls gew�nscht, Mittelpunkt zeichnen
  }
  
// Kreis oder Bild davon zeichnen (mit Mittelpunkt):
// k .... Kreis
// c .... Farbe
// im ... Flag f�r Bild

function drawCircle (k, c, im) {
  var x = (im ? k.ix : k.x);                               // x-Koordinate Mittelpunkt (Kreis oder Bildkreis)
  var y = (im ? k.iy : k.y);                               // y-Koordinate Mittelpunkt (Kreis oder Bildkreis)
  var r = (im ? k.ir : k.r);                               // Radius (Kreis oder Bildkreis)
  circle(x,y,r,c,k==list[nr]);                             // Kreis zeichnen (falls aktives Objekt, mit Mittelpunkt)
  }
  
// Kreis zeichnen (falls gew�nscht, mit Bild):
// k .... Kreis (Seiteneffekt)
// im ... Flag f�r Bild

function drawCircle2 (k, im) {
  drawCircle(k,colorObject(k),false);                      // Urspr�nglichen Kreis zeichnen
  if (!im) return;                                         // Falls Bild nicht gew�nscht, abbrechen
  calcImageCircle(k);                                      // Koordinatenberechnung (Seiteneffekt k)
  drawCircle(k,colorImage,true);                           // Bildkreis zeichnen
  }
  
// Polygon zeichnen:
// x ... Array der x-Koordinaten
// y ... Array der y-Koordinaten
// c ... Farbe

function polygon (x, y, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(x[0],y[0]);                                   // Anfangspunkt
  for (var i=1; i<x.length; i++) ctx.lineTo(x[i],y[i]);    // Seiten vorbereiten
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.stroke();                                            // Polygon zeichnen
  }
  
// Polygon oder Bild davon zeichnen:
// p .... Polygon
// c .... Farbe
// im ... Flag f�r Bild

function drawPolygon (p, c, im) {
  var ax = (im ? p.ix : p.x);                              // Array der x-Werte 
  var ay = (im ? p.iy : p.y);                              // Array der y-Werte
  var n = ax.length;                                       // Eckenzahl
  if (im) {                                                // Falls Bild gew�nscht ...
    for (var i=0; i<n; i++) {                              // F�r alle Indizes ...
      var ii = (i+1)%n;                                    // Index der n�chsten Ecke
      arc(ax[i],ay[i],ax[ii],ay[ii],c,p.imx[i],p.imy[i]);  // Kreisbogen zeichnen
      }
    }
  else polygon(ax,ay,c);                                   // Andernfalls urspr�ngliches Polygon zeichnen
  }
  
// Polygon zeichnen (falls gew�nscht, mit Bild):
// p .... Polygon (Seiteneffekt)
// im ... Flag f�r Bild

function drawPolygon2 (p, im) {
  drawPolygon(p,colorObject(p),false);                     // Urspr�ngliches Polygon zeichnen
  if (!im) return;                                         // Falls kein Bild gew�nscht, abbrechen
  calcImagePolygon(p);                                     // Koordinatenberechnung (Seiteneffekt p)
  drawPolygon(p,colorImage,true);                          // Bildpolygon zeichnen
  }
  
// Objekt (eventuell mit Bildobjekt) zeichnen:
// o ... Objekt (Seiteneffekt)
  
function drawObject2 (o) {
  var im = cb.checked;                                     // �berpr�fung, ob Bild gew�nscht
  var t = o.type;                                          // Abk�rzung f�r Objekttyp
  if (t == POINT) drawPoint2(o,im);                        // Entweder Punkt (ev. mit Bildpunkt) ...
  else if (t == LINE || t == RAY || t == SEGMENT)          // ... oder ... 
    drawLine2(o,t,im);                                     // ... Gerade/Halbgerade/Strecke (ev. mit Bild) ... 
  else if (t == CIRCLE) drawCircle2(o,im);                 // ... oder Kreis (ev. mit Bild) ... 
  else if (t == TRIANGLE || t == QUADRILATERAL)            // ... oder ...
    drawPolygon2(o,im);                                    // ... Dreieck/Viereck (ev. mit Bild) zeichnen
  }
         
// Grafikausgabe:
// Seiteneffekt list
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  circle(ci.x0,ci.y0,ci.r,colorMapping,true);              // Inversionskreis zeichnen (mit Mittelpunkt)
  for (var i=1; i<list.length; i++) drawObject2(list[i]);  // Objekte und Bildobjekte zeichnen    
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen




