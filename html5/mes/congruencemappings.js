// Einfache geometrische Abbildungen (Kongruenzabbildungen)
// Java-Applet (19.06.1999) umgewandelt
// 05.03.2017 - 22.03.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel congruencemappings_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorMapping = "#c000c0";                              // Farbe für Abbildung
var colorActive = "#ff0000";                               // Farbe für aktives Objekt (Zugmodus)
var colorInactive = "#000000";                             // Farbe für gegebene Objekte (nicht aktiv)
var colorImage = "#0000ff";                                // Farbe für Bildobjekte

// Konstanten:

var REFLECTION_LINE = 0;                                   // Achsenspiegelung
var REFLECTION_POINT = 1;                                  // Punktspiegelung
var TRANSLATION = 2;                                       // Verschiebung
var ROTATION = 3;                                          // Drehung

var POINT = 10;                                            // Punkt
var LINE = 11;                                             // Gerade
var RAY = 12;                                              // Halbgerade
var SEGMENT = 13;                                          // Strecke
var CIRCLE = 14;                                           // Kreis
var TRIANGLE = 15;                                         // Dreieck
var QUADRILATERAL = 16;                                    // Viereck

var MIN = 3;                                               // Minimaler Abstand (Pixel)
var DEG = Math.PI/180;                                     // Winkelgrad (Bogenmaß)

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var ch1, ch2;                                              // Auswahlfelder
var bu1, bu2, bu3;                                         // Schaltknöpfe
var cb;                                                    // Optionsfeld
var typeMapping;                                           // Abbildungstyp
var typeObject;                                            // Objekttyp
var lr = {x1: 150, y1: 340, x2: 200, y2: 50};              // Achsenspiegelung (Punkte der Achse)
var pr = {x0: 180, y0: 230};                               // Punktspiegelung (Zentrum)
var tl = {x1: 180, y1: 180, x2: 170, y2: 240};             // Verschiebung (Endpunkte des Pfeils)
var ro = {x0: 180, y0: 210, r: 100,                        // Drehung (Zentrum, Radius)
          phi0: 40*DEG, dPhi: 25*DEG};                     // Drehung (Winkel)
var list;                                                  // Array für Daten der Abbildung (Index 0)
                                                           // und der geometrischen Objekte (Index positiv)
var nr;                                                    // Nummer für aktives Objekt
var n2;                                                    // Nummer für Objekteigenschaft (vorläufig)
var nr2;                                                   // Nummer für Objekteigenschaft
var drag;                                                  // Flag für Zugmodus

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
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  ch1 = getElement("ch1");                                 // Auswahlliste (Abbildungen)
  initSelect(ch1,text01);                                  // Auswahlliste initialisieren
  bu1 = getElement("bu1",text02);                          // Schaltknopf (Neue Zeichnung)
  ch2 = getElement("ch2");                                 // Auswahlliste (geometrische Objekte)
  initSelect(ch2,text03);                                  // Auswahlliste initialisieren
  bu2 = getElement("bu2",text04);                          // Schaltknopf (Objekt hinzufügen)
  bu3 = getElement("bu3",text05);                          // Schaltknopf (Objekt löschen)
  cb = getElement("cb");                                   // Optionsfeld (Bild)
  cb.checked = false;                                      // Optionsfeld zunächst nicht gewählt
  lb = getElement("lb",text06);                            // Erklärender Text (Bild)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  prepareMapping(REFLECTION_LINE,true);                    // Vorbereitung Achsenspiegelung, neue Liste
  typeObject = POINT;                                      // Voreinstellung Punkt
  drag = false;                                            // Zugmodus deaktiviert
  paint();                                                 // Zeichnen
  
  ch1.onchange = reactionSelect1;                          // Reaktion auf erste Auswahlliste (Abbildungstyp)
  bu1.onclick = reactionButton1;                           // Reaktion auf ersten Schaltknopf (Neue Zeichnung)
  ch2.onchange = reactionSelect2;                          // Reaktion auf zweite Auswahlliste (Objekttyp)
  bu2.onclick = reactionButton2;                           // Reaktion auf zweiten Schaltknopf (Hinzufügen)
  bu3.onclick = reactionButton3;                           // Reaktion auf dritten Schaltknopf (Objekt löschen)
  cb.onclick = paint;                                      // Reaktion auf Optionsfeld
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Drücken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Berührung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Berührung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers        
    
  } // Ende der Methode start
  
// Initialisierung einer Auswahlliste:
// ch ..... Auswahlliste
// text ... Array der Texte
  
function initSelect (ch, text) {
  for (var i=0; i<text.length; i++) {                      // Für alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = text[i];                                      // Text des Elements übernehmen 
    ch.add(o);                                             // Element zur Liste hinzufügen
    }
  }
  
// Reaktion auf erste Auswahlliste (Abbildungstyp):
// Seiteneffekt typeMapping, list, lr, pr, tl, ro, nr, nr2, n2

function reactionSelect1 () {
  prepareMapping(ch1.selectedIndex,false);                 // Vorbereitungen für Abbildung
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf ersten Schaltknopf (Neue Zeichnung):
// Seiteneffekt typeMapping, list, lr, pr, tl, ro, nr, nr2, n2
  
function reactionButton1 () {
  prepareMapping(typeMapping,true);                        // Vorbereitungen für Abbildung
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf zweite Auswahlliste (Objekttyp):
// Seiteneffekt typeObject, list
  
function reactionSelect2 () {
  typeObject = ch2.selectedIndex+10;                       // Objekttyp speichern
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf zweiten Schaltknopf (Objekt hinzufügen):
// Seiteneffekt nr, list
  
function reactionButton2 () {
  var t = typeObject;                                      // Abkürzung
  if (t == POINT) list.push(newPoint());                   // Entweder neuen Punkt ... 
  else if (t == LINE || t == RAY || t == SEGMENT)          // ... oder neue Gerade/Halbgerade/Strecke ... 
    list.push(newLine(t)); 
  else if (t == CIRCLE) list.push(newCircle());            // ... oder neuen Kreis ...
  else if (t == TRIANGLE) list.push(newPolygon(3));        // ... oder neues Dreieck ...
  else if (t == QUADRILATERAL) list.push(newPolygon(4));   // ... oder neues Viereck in die Liste aufnehmen
  nr = list.length-1;                                      // Letztes Objekt der Liste wird aktives Objekt
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf dritten Schaltknopf (Objekt löschen):
// Seiteneffekt list, nr, nr2
  
function reactionButton3 () {
  if (nr != undefined) list.splice(nr,1);                  // Aktives Objekt aus der Liste entfernen
  nr = list.length-1;                                      // Letztes Objekt der Liste wird aktives Objekt
  if (nr < 0) {nr = nr2 = undefined;}                      // Falls Liste leer, kein Objekt aktiv
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Drücken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl)                    
  }
  
// Reaktion auf Berührung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Berührpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl)
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  drag = false;                                            // Zugmodus deaktiviert
  }
  
// Reaktion auf Ende der Berührung:
  
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
  
// Hilfsroutine: Reaktion auf Mausklick oder Berühren mit dem Finger (Auswahl):
// x, y ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt drag, nr, nr2, n2, list

function reactionDown (x, y) {
  drag = true;                                             // Zugmodus aktiviert
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  var d = distanceMapping(x,y);                            // Abstand von Bestimmungsstücken der Abbildung
  var dMin = d;                                            // Minimaler Abstand (vorläufig)
  var n = 0;                                               // Index des nächstgelegenen Objekts
  nr2 = n2;                                                // Index Objekteigenschaft
  for (var i=1; i<list.length; i++) {                      // Für alle Indizes der Objektliste ...
    d = distanceObject(x,y,list[i]);                       // Abstand vom Objekt
    if (d < dMin) {dMin = d; n = i; nr2 = n2;}             // Falls näher als bisher, Variable aktualisieren
    }
  nr = (dMin<20 ? n : undefined);                          // Index des ausgewählten Objekts
  if (dMin >= 20) nr2 = undefined;                         // Index der ausgewählten Objekteigenschaft
  paint();                                                 // Neu zeichnen
  }
  
// Änderung einer Linie (Gerade, Halbgerade oder Strecke):
// o ....... Linie
// (x,y) ... Position

function updateLine (o, x, y) {
  if (nr2 == 1) {                                          // Falls 1. Punkt geändert werden soll ...
    if (distancePointPoint(o.x2,o.y2,x,y) < MIN) return;   // Falls zu nahe am 2. Punkt, abbrechen
    o.x1 = x; o.y1 = y;                                    // 1. Punkt ändern 
    }
  else if (nr2 == 2) {                                     // Falls 2. Punkt geändert werden soll ...
    if (distancePointPoint(o.x1,o.y1,x,y) < MIN) return;   // Falls zu nahe am 1. Punkt, abbrechen
    o.x2 = x; o.y2 = y;                                    // 2. Punkt ändern
    }
  }
  
// Änderung eines Kreises:
// o ....... Kreis
// (x,y) ... Position

function updateCircle (o, x, y) {
  if (nr2 == 1) {o.x = x; o.y = y;}                        // Falls gewünscht, Mittelpunkt verschieben ...
  else if (nr2 == 2) {                                     // Falls Radius geändert werden soll ...
    var r = distancePointPoint(o.x,o.y,x,y);               // Abstand vom Mittelpunkt
    if (r >= MIN) o.r = r;                                 // Falls Abstand groß genug, Radius ändern
    }    
  }
  
// Änderung eines Dreiecks:
// o ....... Dreieck
// (x,y) ... Position

function updateTriangle (o, x, y) {
  var i1 = nr2%3, i2 = (nr2+1)%3;                          // Indizes der anderen Ecken
  if (distancePointPoint(o.x[i1],o.y[i1],x,y) < MIN) return;  // Falls zu nahe an der nächsten Ecke, abbrechen
  if (distancePointPoint(o.x[i2],o.y[i2],x,y) < MIN) return;  // Falls zu nahe an der vorigen Ecke, abbrechen
  o.x[nr2-1] = x; o.y[nr2-1] = y;                          // Ecke verschieben
  } 
  
// Änderung eines Vierecks:
// o ....... Viereck
// (x,y) ... Position

function updateQuadrilateral (o, x, y) {
  var i1 = nr2%4, i2 = (nr2+1)%4, i3 = (nr2+2)%4;          // Indizes der anderen Ecken
  if (distancePointPoint(o.x[i1],o.y[i1],x,y) < MIN) return;  // Falls zu nahe an der nächsten Ecke, abbrechen
  if (distancePointPoint(o.x[i2],o.y[i2],x,y) < MIN) return;  // Falls zu nahe an der gegenüberliegenden Ecke, abbrechen
  if (distancePointPoint(o.x[i3],o.y[i3],x,y) < MIN) return;  // Falls zu nahe an der vorigen Ecke, abbrechen
  var v1x = o.x[i1]-x, v1y = o.y[i1]-y;                    // Vektor zur nächsten Ecke
  var v2x = o.x[i2]-x, v2y = o.y[i2]-y;                    // Vektor zur gegenüberliegenden Ecke
  var v3x = o.x[i3]-x, v3y = o.y[i3]-y;                    // Vektor zur vorigen Ecke
  if ((v3x*v1y-v3y*v1x >= 0)                               // Falls Viereck überschlagen (Anfang) ...
  && ((v2x*v1y-v2y*v1x >= 0) || (v3x*v2y-v3y*v2x >= 0)))   // Falls Viereck überschlagen (Fortsetzung) ...
    return;                                                // Abbrechen
  o.x[nr2-1] = x; o.y[nr2-1] = y;                          // Ecke verschieben
  }
  
// Reaktion auf Bewegung von Maus oder Finger (Änderung):
// x, y ... Bildschirmkoordinaten bezüglich Viewport
// Seiteneffekt lr, pr, tl, ro, list

function reactionMove (x, y) {
  if (nr == undefined) return;                             // Falls kein Objekt ausgewählt, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bezüglich Zeichenfläche (Pixel)
  if (nr == 0) {updateMapping(x,y); return;}               // Gegebenenfalls Abbildung ändern
  var o = list[nr];                                        // Aktives Objekt
  var t = o.type;                                          // Abkürzung für Objekttyp
  if (t == POINT) {o.x = x; o.y = y;}                      // Gegebenenfalls Punkt verschieben
  else if (t == LINE || t == RAY || t == SEGMENT)          // Falls Gerade, Halbgerade oder Strecke ...
    updateLine(o,x,y);                                     // Linie ändern
  else if (t == CIRCLE) updateCircle(o,x,y);               // Gegebenenfalls Kreis ändern
  else if (t == TRIANGLE) updateTriangle(o,x,y);           // Gegebenenfalls Dreieck ändern
  else if (t == QUADRILATERAL) updateQuadrilateral(o,x,y); // Gegebenenfalls Viereck ändern
  paint();                                                 // Neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Vorbereitung einer geometrischen Abbildung:
// t .... Abbildungstyp
// nl ... Flag für neue Liste 
// Seiteneffekt typeMapping, list, lr, pr, tl, ro, nr, nr2, n2

function prepareMapping (t, nl) {
  typeMapping = t;                                         // Abbildungstyp speichern
  if (t == REFLECTION_LINE) {                              // Falls Achsenspiegelung ...
    calcReflectionLine();                                  // Berechnungen (Seiteneffekt lr)
    if (nl) list = [lr];                                   // Entweder neue Liste (mit Daten der Achsenspiegelung) ...
    else list[0] = lr;                                     // ... oder bestehende Liste anpassen
    }
  else if (t == REFLECTION_POINT) {                        // Falls Punktspiegelung ...
    calcReflectionPoint();                                 // Berechnungen (Seiteneffekt pr)
    if (nl) list = [pr];                                   // Entweder neue Liste (mit Daten der Punktspiegelung) ...
    else list[0] = pr;                                     // ... oder bestehende Liste anpassen
    }
  else if (t == TRANSLATION) {                             // Falls Verschiebung ...
    calcTranslation();                                     // Berechnungen (Seiteneffekt tl)
    if (nl) list = [tl];                                   // Entweder neue Liste (mit Daten der Verschiebung) ...
    else list[0] = tl;                                     // ... oder bestehende Liste anpassen
    }
  else if (t == ROTATION) {                                // Falls Drehung ...
    calcRotation();                                        // Berechnungen (Seiteneffekt ro)
    if (nl) list = [ro];                                   // Entweder neue Liste (mit Daten der Drehung) ...
    else list[0] = ro;                                     // ... oder bestehende Liste anpassen
    }
  if (nl) {nr = nr2 = n2 = undefined;}                     // Falls neue Liste, kein Objekt ausgewählt
  }
  
// Eigenschaften einer geometrischen Abbildung verändern:
// (x,y) ... Position
// Seiteneffekt lr, pr, tl, ro, list
  
function updateMapping (x, y) {
  if (typeMapping == REFLECTION_LINE) {                    // Falls Achsenspiegelung ...
    if (nr2 == 1) {lr.x1 = x; lr.y1 = y;}                  // Gegebenenfalls 1. Punkt der Achse anpassen
    else if (nr2 == 2) {lr.x2 = x; lr.y2 = y;}             // Gegebenenfalls 2. Punkt der Achse anpassen
    calcReflectionLine();                                  // Berechnungen (Seiteneffekt lr)
    }
  else if (typeMapping == REFLECTION_POINT) {              // Falls Punktspiegelung ...
    pr.x0 = x; pr.y0 = y;                                  // Zentrum anpassen
    calcReflectionPoint();                                 // Berechnungen (Seiteneffekt pr)                 
    }
  else if (typeMapping == TRANSLATION) {                   // Falls Verschiebung ...
    if (nr2 == 1) {tl.x1 = x; tl.y1 = y;}                  // Gegebenenfalls Anfangspunkt des Verschiebungspfeils anpassen
    else if (nr2 == 2) {tl.x2 = x; tl.y2 = y;}             // Gegebenenfalls Endpunkt des Verschiebungspfeils anpassen
    calcTranslation();                                     // Berechnungen (Seiteneffekt tl)
    }
  else if (typeMapping == ROTATION) {                      // Falls Drehung ...
    if (nr2 == 1) {ro.x0 = x; ro.y0 = y;}                  // Gegebenenfalls Zentrum anpassen
    else if (nr2 == 2) {                                   // Gegebenenfalls Anfangspunkt des Drehpfeils anpassen
      ro.r = distancePointPoint(x,y,ro.x0,ro.y0);          // Radius anpassen
      ro.phi0 = Math.atan2(ro.y0-y,x-ro.x0);               // Startwinkel anpassen
      }
    else if (nr2 == 3) {                                   // Gegebenenfalls Endpunkt des Drehpfeils anpassen
      ro.r = distancePointPoint(x,y,ro.x0,ro.y0);          // Radius anpassen
      var a = Math.atan2(ro.y0-y,x-ro.x0);                 // Positionswinkel Pfeilspitze
      var da = a-(ro.phi0+ro.dPhi);                        // Änderung Positionswinkel Pfeilspitze
      if (da > Math.PI) da -= 2*Math.PI;                   // Winkel <= +pi erzwingen
      if (da < -Math.PI) da += 2*Math.PI;                  // Winkel >= -pi erzwingen
      ro.dPhi += da;                                       // Drehwinkel anpassen
      if (ro.dPhi > 2*Math.PI) ro.dPhi = 2*Math.PI;        // Drehwinkel über 2 pi verhindern
      if (ro.dPhi < -2*Math.PI) ro.dPhi = -2*Math.PI;      // Drehwinkel unter -2 pi verhindern
      }
    calcRotation();                                        // Berechnungen (Seiteneffekt ro)
    }
  paint();                                                 // Neu zeichnen
  }
  
// Zufällige Koordinate:

function randomCoordinate (max) {
  return max*(0.1+0.8*Math.random());                      // Rückgabewert (nicht zu nahe am Rand!)
  }
  
// Neuer Punkt (bestimmt durch Zufallsgenerator):

function newPoint () {
  var px = randomCoordinate(width);                        // x-Koordinate
  var py = randomCoordinate(height);                       // y-Koordinate
  return {type: POINT, x: px, y: py};                      // Rückgabewert
  }
  
// Neue Gerade/Halbgerade/Strecke (bestimmt durch Zufallsgenerator):
// t ... Typ (LINE, RAY oder SEGMENT)

function newLine (t) {
  var p1x = randomCoordinate(width);                       // x-Koordinate 1. Punkt
  var p1y = randomCoordinate(height);                      // y-Koordinate 1. Punkt
  var p2x = randomCoordinate(width);                       // x-Koordinate 2. Punkt
  var p2y = randomCoordinate(height);                      // y-Koordinate 2. Punkt
  return {type: t,                                         // Rückgabewert (Anfang)
    x1: p1x, y1: p1y, x2: p2x, y2: p2y};                   // Rückgabewert (Fortsetzung)
  }
  
// Neuer Kreis (bestimmt durch Zufallsgenerator):

function newCircle () {
  var mx = randomCoordinate(width);                        // x-Koordinate Mittelpunkt
  var my = randomCoordinate(height);                       // y-Koordinate Mittelpunkt
  var rc = randomCoordinate(100);                          // Radius
  return {type: CIRCLE, x: mx, y: my, r: rc};              // Rückgabewert
  }
  
// Neues Vieleck (bestimmt durch Zufallsgenerator):
// n ... Eckenzahl

function newPolygon (n) {
  var arrayX = new Array(n), arrayY = new Array(n);        // Arrays für Koordinaten der Polygonecken                             
  var arrayIX = new Array(n), arrayIY = new Array(n);      // Arrays für Koordinaten der Bildpolygonecken
  var mx = width*(0.25+0.5*Math.random());                 // x-Koordinate Bezugspunkt
  var my = height*(0.25+0.5*Math.random());                // y-Koordinate Bezugspunkt
  for (var i=0; i<n; i++) {                                // Für alle Ecken ...
    var r = Math.min(width,height)*(0.1+0.2*Math.random());// Abstand zum Bezugspunkt
  	var phi = (2*Math.PI/n)*(i+Math.random());             // Positionswinkel (Bogenmaß)
  	arrayX[i] = mx+r*Math.cos(phi);                        // x-Koordinate
  	arrayY[i] = my+r*Math.sin(phi);                        // y-Koordinate
    }  
  var t;                                                   // Variable für Objekttyp
  if (n == 3) t = TRIANGLE;                                // Dreieck
  if (n == 4) t = QUADRILATERAL;                           // Viereck
  return {type: t, x: arrayX, y: arrayY, ix: arrayIX, iy: arrayIY};  // Rückgabewert
  }
  
// Berechnung von Hilfsgrößen für Achsenspiegelung:
// Seiteneffekt lr (lr.nx, lr.ny)

function calcReflectionLine () {
  var nx = lr.y1-lr.y2, ny = lr.x2-lr.x1;                  // Vektor senkrecht zur Achse        
  var n = Math.sqrt(nx*nx+ny*ny);                          // Betrag                  
  nx /= n; ny /= n;                                        // Einheitsvektor senkrecht zur Achse
  lr.nx = nx; lr.ny = ny;                                  // lr.nx, lr.ny anpassen
  }
  
// Berechnung von Hilfsgrößen für Punktspiegelung:
// Seiteneffekt pr (pr.sumX, pr.sumY)

function calcReflectionPoint () {
  pr.sumX = 2*pr.x0;                                       // Summe der x-Werte (Punkt und Bildpunkt)
  pr.sumY = 2*pr.y0;                                       // Summe der y-Werte (Punkt und Bildpunkt)
  }
  
// Berechnung des Verschiebungsvektors einer Verschiebung:
// Seiteneffekt tl (tl.vx, tl.vy)

function calcTranslation () {
  tl.vx = tl.x2-tl.x1;                                     // x-Koordinate Verschiebungsvektor
  tl.vy = tl.y2-tl.y1;                                     // y-Koordinate Verschiebungsvektor
  }
  
// Berechnung von Hilfsgrößen für Drehung:
// Seiteneffekt ro (ro.sin, ro.cos)
  
function calcRotation () {
  ro.sin = Math.sin(ro.dPhi);                              // Sinus des Drehwinkels
  ro.cos = Math.cos(ro.dPhi);                              // Cosinus des Drehwinkels
  }
  
// Bildpunkt (allgemein), auch für Bildkreis verwendbar:
// p ... Gegebener Punkt
// m ... Abbildung (lr, pr, tl oder ro)
// Seiteneffekt p (p.ix, p.iy)

function calcImagePoint (p, m) {
  var image = m(p.x,p.y);                                  // Bildpunkt von p als Array
  p.ix = image[0]; p.iy = image[1];                        // x- und y-Koordinate
  }
  
// Bildgerade/-halbgerade/-strecke (allgemein):
// l ... Gegebene Linie (Gerade, Halbgerade oder Strecke)
// m ... Abbildung (lr, pr, tl oder ro)
// Seiteneffekt l (l.ix1, l.iy1, l.ix2, l.iy2)

function calcImageLine (l, m) {
  var image = m(l.x1,l.y1);                                // Bildpunkt des 1. Bestimmungspunkts als Array
  l.ix1 = image[0]; l.iy1 = image[1];                      // x- und y-Koordinate
  image = m(l.x2,l.y2);                                    // Bildpunkt des 2. Bestimmungspunkts als Array
  l.ix2 = image[0]; l.iy2 = image[1];                      // x- und y-Koordinate
  }
  
// Bildpolygon (allgemein):
// p ... Gegebenes Polygon
// m ... Abbildung (lr, pr, tl oder ro)
// Seiteneffekt p (p.ix[...], p.iy[...])
  
function calcImagePolygon (p, m) {
  for (var i=0; i<p.x.length; i++) {
    var image = m(p.x[i],p.y[i]);
    p.ix[i] = image[0]; p.iy[i] = image[1];
    }
  }
    
// Bildpunkt (Achsenspiegelung):
// (x,y) ... Gegebener Punkt
// Rückgabewert: Array der Größe 2 mit Koordinaten des Bildpunkts

function imageLineReflection (x, y) {
  var par = 2*(lr.nx*(x-lr.x1)+lr.ny*(y-lr.y1));           // Parameterwert
  var image = new Array(2);                                // Neues Array
  image[0] = x-par*lr.nx; image[1] = y-par*lr.ny;          // Koordinaten Bildpunkt
  return image;                                            // Rückgabewert              
  }
        
// Bildpunkt (Punktspiegelung):
// (x,y) ... Gegebener Punkt
// Rückgabewert: Array der Größe 2 mit Koordinaten des Bildpunkts

function imagePointReflection (x, y) {
  var image = new Array(2);                                // Neues Array
  image[0] = pr.sumX-x; image[1] = pr.sumY-y;              // Koordinaten Bildpunkt
  return image;                                            // Rückgabewert
  }
  
// Bildpunkt (Verschiebung):
// (x,y) ... Gegebener Punkt
// Rückgabewert: Array der Größe 2 mit Koordinaten des Bildpunkts

function imageTranslation (x, y) {
  var image = new Array(2);                                // Neues Array
  image[0] = x+tl.vx; image[1] = y+tl.vy;                  // Koordinaten Bildpunkt
  return image;                                            // Rückgabewert
  }
  
// Bildpunkt (Drehung):
// (x,y) ... Gegebener Punkt
// Rückgabewert: Array der Größe 2 mit Koordinaten des Bildpunkts

function imageRotation (x, y) {
  var image = new Array(2);                                // Neues Array
  var dx = x-ro.x0, dy = ro.y0-y;                          // Koordinatendifferenzen
  image[0] = ro.x0+(ro.cos*dx-ro.sin*dy);                  // x-Koordinate Bildpunkt
  image[1] = ro.y0-(ro.sin*dx+ro.cos*dy);                  // y-Koordinate Bildpunkt
  return image;                                            // Rückgabewert
  }
  
// Abbildung:
// t ... Abbildungstyp

function mapping (t) {
  if (t == REFLECTION_LINE) return imageLineReflection;    // Achsenspiegelung
  if (t == REFLECTION_POINT) return imagePointReflection;  // Punktspiegelung
  if (t == TRANSLATION) return imageTranslation;           // Verschiebung
  if (t == ROTATION) return imageRotation;                 // Drehung
  }
  
// Abstand von einem Punkt:
// (x,y) ..... Position
// (x0,y0) ... Punkt
  
function distancePointPoint (x, y, x0, y0) {
  var dx = x-x0, dy = y-y0;                                // Koordinatendifferenzen
  return Math.sqrt(dx*dx+dy*dy);                           // Rückgabewert
  }
  
// Abstand von einer Geraden:
// (x,y) ..... Position
// (x1,y1) ... 1. Punkt der Geraden
// (x2,y2) ... 2. Punkt der Geraden
  
function distancePointLine (x, y, x1, y1, x2, y2) {
  var ux = x2-x1, uy = y2-y1;                              // Richtungsvektor
  var vx = x-x1, vy = y-y1;                                // Verbindungsvektor
  var h = (ux*vx+uy*vy);                                   // Hilfsgröße
  h = h*h/(ux*ux+uy*uy);                                   // Hilfsgröße neu
  var d1 = distancePointPoint(x,y,x1,y1);                  // Abstand vom 1. Punkt der Geraden
  return Math.sqrt(d1*d1-h);                               // Rückgabewert
  }
  
// Abstand von einem gegebenen Punkt:
// (x,y) ... Position
// p ....... Punkt
// Seiteneffekt n2
  
function distancePoint (x, y, p) {
  n2 = 1;                                                  // Nummer Objekteigenschaft (Seiteneffekt, unwichtig)
  return distancePointPoint(x,y,p.x,p.y);                  // Rückgabewert
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
  
// Hilfsroutine: Parameterwert für Lotfußpunkt
// (x,y) ..... Position, Ausgangspunkt für Lot
// (x1,y1) ... 1. Punkt der Geraden
// (x2,y2) ... 2. Punkt der Geraden

function parameter (x, y, x1, y1, x2, y2) {
  var ux = x2-x1, uy = y2-y1;                              // Richtungsvektor
  var vx = x-x1, vy = y-y1;                                // Verbindungsvektor (x1,y1)-(x,y)
  return (ux*vx+uy*vy)/(ux*ux+uy*uy);                      // Rückgabewert
  }
  
// Abstand von einer gegebenen Halbgeraden:
// (x,y) ... Position
// l ....... Halbgerade
// Seiteneffekt n2

function distanceRay (x, y, l) {
  var p = parameter(x,y,l.x1,l.y1,l.x2,l.y2);              // Parameterwert Lotfußpunkt
  n2 = (p<0.5 ? 1 : 2);                                    // Nummer Objekteigenschaft (Seiteneffekt)
  if (p < 0) return distancePointPoint(x,y,l.x1,l.y1);     // Rückgabewert für negativen Parameterwert
  else return distancePointLine(x,y,l.x1,l.y1,l.x2,l.y2);  // Rückgabewert für nicht-negativen Parameterwert
  }

// Abstand von einer gegebenen Strecke:
// (x,y) ... Position
// l ....... Strecke
// Seiteneffekt n2

function distanceSegment (x, y, l) {
  var p = parameter(x,y,l.x1,l.y1,l.x2,l.y2);              // Parameterwert Lotfußpunkt
  n2 = (p<0.5 ? 1 : 2);                                    // Nummer Objekteigenschaft (Seiteneffekt)
  if (p > 1) return distancePointPoint(x,y,l.x2,l.y2);     // Rückgabewert für Parameterwert über 1
  else if (p < 0) return distancePointPoint(x,y,l.x1,l.y1);// Rückgabewert für Parameterwert unter 0
  else return distancePointLine(x,y,l.x1,l.y1,l.x2,l.y2);  // Rückgabewert für Parameterwert aus [0;1]
  }
  
// Abstand von einem gegebenen Kreis:
// (x,y) ... Position
// k ....... Kreis
// Seiteneffekt n2
  
function distanceCircle (x, y, k) {
  var d1 = distancePointPoint(x,y,k.x,k.y);                // Abstand vom Mittelpunkt
  var d2 = Math.abs(k.r-d1);                               // Abstand vom Rand
  n2 = (d1<d2 ? 1 : 2);                                    // Nummer Objekteigenschaft (Seiteneffekt)
  return Math.min(d1,d2);                                  // Rückgabewert
  }
  
// Abstand von einem gegebenen Polygon:
// (x,y) ... Position
// p ....... Polygon
// Seiteneffekt n2

function distancePolygon (x, y, p) {
  var dMin = 999999;                                       // Minimaler Abstand (zunächst sehr groß)
  for (var i=0; i<p.x.length; i++) {                       // Für alle Ecken ...
    var d = distancePointPoint(x,y,p.x[i],p.y[i]);         // Abstand von der Ecke
    if (d < dMin) {dMin = d; n2 = i+1;}                    // Falls näher als bisher, Werte aktualisieren
    }
   return dMin;                                            // Rückgabewert
  }
  
// Abstand von den Bestimmungsstücken einer Abbildung:
// (x,y) ... Position
// Seiteneffekt n2
  
function distanceMapping (x, y) {
  n2 = 1;                                                  // Vorläufiger Wert (Seiteneffekt n2)
  if (typeMapping == REFLECTION_LINE)                      // Falls Achsenspiegelung ... 
    return distanceLine(x,y,lr);                           // Rückgabewert: Abstand von der Achse (Seiteneffekt n2)
  else if (typeMapping == REFLECTION_POINT)                // Falls Punktspiegelung ...
    return distancePointPoint(x,y,pr.x0,pr.y0);            // Rückgabewert: Abstand vom Zentrum
  else if (typeMapping == TRANSLATION) {                   // Falls Verschiebung ...
    var dMin = distancePointPoint(x,y,tl.x1,tl.y1);        // Abstand vom Anfangspunkt des Verschiebungspfeils
    var d = distancePointPoint(x,y,tl.x2,tl.y2);           // Abstand vom Endpunkt des Verschiebungspfeils
    if (d < dMin) {dMin = d; n2 = 2;}                      // Falls kleinerer Abstand, Werte aktualisieren (Seiteneffekt n2)
    return dMin;                                           // Rückgabewert: Kleinerer Abstand     
    }                    
  else if (typeMapping == ROTATION) {                      // Falls Drehung ...
    dMin = distancePointPoint(x,y,ro.x0,ro.y0);            // Abstand vom Drehzentrum
    var x1 = ro.x0+ro.r*Math.cos(ro.phi0);                 // x-Koordinate Anfang Drehpfeil
    var y1 = ro.y0-ro.r*Math.sin(ro.phi0);                 // y-Koordinate Anfang Drehpfeil
    d = distancePointPoint(x,y,x1,y1);                     // Abstand vom Anfang des Drehpfeils       
    if (d < dMin) {dMin = d; n2 = 2;}                      // Falls kleinerer Abstand, Werte aktualisieren (Seiteneffekt n2)
    var x2 = ro.x0+ro.r*Math.cos(ro.phi0+ro.dPhi);         // x-Koordinate Spitze Drehpfeil
    var y2 = ro.y0-ro.r*Math.sin(ro.phi0+ro.dPhi);         // y-Koordinate Spitze Drehpfeil
    d = distancePointPoint(x,y,x2,y2);                     // Abstand von der Spitze des Drehpfeils
    if (d < dMin) {dMin = d; n2 = 3;}                      // Falls kleinerer Abstand, Werte aktualisieren (Seiteneffekt n2)
    return dMin;                                           // Rückgabewert
    }
  }
  
// Abstand von einem gegebenen geometrischen Objekt:
// (x,y) ... Position
// o ....... Objekt
// Seiteneffekt n2
  
function distanceObject (x, y, o) {
  n2 = undefined;                                          // Nächstgelegenes Objekt unbekannt
  var t = o.type;                                          // Abkürzung für Objekttyp
  if (t == POINT) return distancePoint(x,y,o);             // Rückgabewert für Punkt
  else if (t == LINE) return distanceLine(x,y,o);          // Rückgabewert für Gerade
  else if (t == RAY) return distanceRay(x,y,o);            // Rückgabewert für Halbgerade
  else if (t == SEGMENT) return distanceSegment(x,y,o);    // Rückgabewert für Strecke
  else if (t == CIRCLE) return distanceCircle(x,y,o);      // Rückgabewert für Kreis
  else if (t == TRIANGLE) return distancePolygon(x,y,o);   // Rückgabewert für Dreieck
  else if (t == QUADRILATERAL) return distancePolygon(x,y,o); // Rückgabewert für Viereck
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
  if (nr == undefined) return colorInactive;               // Rückgabewert, falls kein Objekt ausgewählt
  else return (o==list[nr] ? colorActive : colorInactive); // Rückgabewert, falls Objekt ausgewählt
  }
  
// Punkt zeichnen:
// (x,y) ... Koordinaten
// c ....... Farbe
  
function point (x, y, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,2,0,2*Math.PI,true);                         // Kreis vorbereiten
  ctx.fillStyle = c;                                       // Füllfarbe
  ctx.fill(); ctx.stroke();                                // Ausgefüllten Kreis mit schwarzem Rand zeichnen
  }
  
// Punkt oder Bildpunkt zeichnen:
// p .... Punkt
// c .... Farbe
// im ... Flag für Bildpunkt
  
function drawPoint (p, c, im) {
  var x = (im ? p.ix : p.x);                               // x-Koordinate (Punkt oder Bildpunkt)
  var y = (im ? p.iy : p.y);                               // y-Koordinate (Punkt oder Bildpunkt)
  point(x,y,c);                                            // Punkt oder Bildpunkt zeichnen
  }
  
// Punkt zeichnen (falls gewünscht, mit Bildpunkt):
// p .... Gegebener Punkt (Seiteneffekt)
// im ... Flag für Bildpunkt

function drawPoint2 (p, im) {
  drawPoint(p,colorObject(p),false);                       // Ursprünglichen Punkt zeichnen
  if (!im) return;                                         // Falls kein Bildpunkt gewünscht, abbrechen
  calcImagePoint(p,mapping(typeMapping));                  // Koordinatenberechnung (Seiteneffekt p)
  drawPoint(p,colorImage,true);                            // Bildpunkt zeichnen
  }
  
// Linie zeichnen:
// (x1,y1) ... 1. Punkt
// (x2,y2) ... 2. Punkt
// c ......... Farbe

function line (x1, y1, x2, y2, c) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Gerade/Halbgerade/Strecke oder Bild davon zeichnen:
// l .... Linie (Gerade, Halbgerade oder Strecke; Seiteneffekt)
// t .... Objekttyp (LINE, RAY oder SEGMENT)
// c .... Farbe
// im ... Flag für Bild

function drawLine (l, t, c, im) {
  var x1 = (im ? l.ix1 : l.x1), y1 = (im ? l.iy1 : l.y1);  // Koordinaten 1. Punkt
  var x2 = (im ? l.ix2 : l.x2), y2 = (im ? l.iy2 : l.y2);  // Koordinaten 2. Punkt
  var ux = x2-x1, uy = y2-y1;                              // Richtungsvektor
  var u = Math.sqrt(ux*ux+uy*uy);                          // Betrag Richtungsvektor
  var f = 1000/u;                                          // Faktor
  var xx1 = x1, yy1 = y1, xx2 = x2, yy2 = y2;              // Koordinaten von Anfangs- und Endpunkt (für Strecke)
  if (t == LINE || t == RAY) {                             // Falls Gerade oder Halbgerade ...
    xx2 = x2+f*ux; yy2 = y2+f*uy;                          // Koordinaten des Endpunkts anpassen
    }  
  if (t == LINE) {                                         // Falls Gerade ...
    xx1 = x1-f*ux; yy1 = y1-f*uy;                          // Koordinaten des Anfangspunkts anpassen 
    }               
  line(xx1,yy1,xx2,yy2,c);                                 // Linie zeichnen
  }
  
// Gerade/Halbgerade/Strecke zeichnen (falls gewünscht, mit Bild):
// l .... Linie (Gerade, Halbgerade oder Strecke; Seiteneffekt)
// t .... Objekttyp (LINE, RAY oder SEGMENT)
// im ... Flag für Bild

function drawLine2 (l, t, im) {
  drawLine(l,t,colorObject(l),false);                      // Ursprüngliche Gerade/Halbgerade/Strecke zeichnen
  if (!im) return;                                         // Falls kein Bild gewünscht, abbrechen
  calcImageLine(l,mapping(typeMapping));                   // Koordinatenberechnung (Seiteneffekt l)
  drawLine(l,t,colorImage,true);                           // Bildgerade/-halbgerade/-strecke zeichnen
  }
  
// Kreis oder Bild davon zeichnen (mit Mittelpunkt):
// k .... Kreis
// c .... Farbe
// im ... Flag für Bild

function drawCircle (k, c, im) {
  var x = (im ? k.ix : k.x);                               // x-Koordinate Mittelpunkt (Kreis oder Bildkreis)
  var y = (im ? k.iy : k.y);                               // y-Koordinate Mittelpunkt (Kreis oder Bildkreis)
  newPath(c);                                              // Neuer Grafikpfad
  ctx.arc(x,y,k.r,0,2*Math.PI,true);                       // Kreis vorbereiten
  ctx.stroke();                                            // Kreislinie zeichnen
  point(x,y,c);                                            // Mittelpunkt zeichnen
  }
  
// Kreis zeichnen (falls gewünscht, mit Bild):
// k .... Kreis (Seiteneffekt)
// im ... Flag für Bild

function drawCircle2 (k, im) {
  drawCircle(k,colorObject(k),false);                      // Ursprünglichen Kreis zeichnen
  if (!im) return;                                         // Falls Bild nicht gewünscht, abbrechen
  calcImagePoint(k,mapping(typeMapping));                  // Koordinatenberechnung (Seiteneffekt k)
  drawCircle(k,colorImage,true);                           // Bildkreis zeichnen
  }
  
// Polygon oder Bild davon zeichnen:
// p .... Polygon
// c .... Farbe
// im ... Flag für Bild

function drawPolygon (p, c, im) {
  var arrayX = (im ? p.ix : p.x);                          // Referenz auf Array der x-Werte 
  var arrayY = (im ? p.iy : p.y);                          // Referenz auf Array der y-Werte
  var n = arrayX.length;                                   // Eckenzahl
  newPath(c);                                              // Neuer Grafikpfad
  ctx.moveTo(arrayX[0],arrayY[0]);                         // Anfangspunkt (Ecke mit Index 0)
  for (var i=0; i<n; i++)                                  // Für alle Ecken ... 
    ctx.lineTo(arrayX[i],arrayY[i]);                       // Weiter zur naächsten Ecke
  ctx.closePath();                                         // Zurück zum Anfangspunkt
  ctx.stroke();                                            // Polygon zeichnen
  }
  
// Polygon zeichnen (falls gewünscht, mit Bild):
// p .... Polygon (Seiteneffekt)
// im ... Flag für Bild

function drawPolygon2 (p, im) {
  drawPolygon(p,colorObject(p),false);                     // Ursprüngliches Polygon zeichnen
  if (!im) return;                                         // Falls kein Bild gewünscht, abbrechen
  calcImagePolygon(p,mapping(typeMapping));                // Koordinatenberechnung (Seiteneffekt p)
  drawPolygon(p,colorImage,true);                          // Bildpolygon zeichnen
  }
  
// Objekt (eventuell mit Bildobjekt) zeichnen:
// o ... Objekt (Seiteneffekt)
  
function drawObject2 (o) {
  var im = cb.checked;                                     // Überprüfung, ob Bild gewünscht
  var t = o.type;                                          // Abkürzung für Objekttyp
  if (t == POINT) drawPoint2(o,im);                        // Entweder Punkt (ev. mit Bildpunkt) ...
  else if (t == LINE || t == RAY || t == SEGMENT)          // ... oder ... 
    drawLine2(o,t,im);                                     // ... Gerade/Halbgerade/Strecke (ev. mit Bild) ... 
  else if (t == CIRCLE) drawCircle2(o,im);                 // ... oder Kreis (ev. mit Bild) ... 
  else if (t == TRIANGLE || t == QUADRILATERAL)            // ... oder ...
    drawPolygon2(o,im);                                    // ... Dreieck/Viereck (ev. mit Bild) zeichnen
  }
  
// Pfeil zeichnen:
// (x1,y1) ... Anfangspunkt
// (x2,y2) ... Endpunkt
// c ......... Farbe

function arrow (x1, y1, x2, y2, c) {
  newPath(c);
  var dx = x2-x1, dy = y2-y1;                              // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);                     // Länge
  if (length == 0) return;                                 // Abbruch, falls Länge 0
  dx /= length; dy /= length;                              // Einheitsvektor
  var w = 1;                                               // Liniendicke
  var s = 2.5*w+7.5;                                       // Länge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;                        // Hilfspunkt für Pfeilspitze         
  var h = 0.5*w+3.5;                                       // Halbe Breite der Pfeilspitze
  var xSp1 = xSp-h*dy, ySp1 = ySp+h*dx;                    // Ecke der Pfeilspitze
  var xSp2 = xSp+h*dy, ySp2 = ySp-h*dx;                    // Ecke der Pfeilspitze
  xSp = x2-0.6*s*dx; ySp = y2-0.6*s*dy;                    // Einspringende Ecke der Pfeilspitze
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.lineWidth = w;                                       // Liniendicke
  ctx.moveTo(x1,y1);                                       // Anfangspunkt
  if (length < 5) ctx.lineTo(x2,y2);                       // Falls kurzer Pfeil, weiter zum Endpunkt, ...
  else ctx.lineTo(xSp,ySp);                                // ... sonst weiter zur einspringenden Ecke
  ctx.stroke();                                            // Linie zeichnen
  if (length < 5) return;                                  // Falls kurzer Pfeil, keine Spitze
  ctx.beginPath();                                         // Neuer Grafikpfad für Pfeilspitze
  ctx.fillStyle = ctx.strokeStyle;                         // Füllfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zurück zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Spiegelachse zeichnen:
  
function drawAxis () {
  drawLine(lr,LINE,colorMapping,false);            
  }
  
// Symmetriezentrum zeichnen:
  
function drawCenter () {
  point(pr.x0,pr.y0,colorMapping);                                                                     
  }
  
// Verschiebungspfeil zeichnen:

function drawArrow () {
  arrow(tl.x1,tl.y1,tl.x2,tl.y2,colorMapping);        
  }
  
// Drehzentrum und Drehpfeil zeichnen:

function drawCenterArrow () {
  point(ro.x0,ro.y0,colorMapping);                         // Drehzentrum
  if (ro.dPhi == 0) return;                                // Falls Drehwinkel gleich 0, abbrechen
  newPath(colorMapping);                                   // Neuer Grafikpfad
  var a0 = 2*Math.PI-ro.phi0;                              // Startwinkel (Bogenmaß, Uhrzeigersinn)
  ctx.arc(ro.x0,ro.y0,ro.r,a0,a0-ro.dPhi,ro.dPhi>0);       // Kreisbogen vorbereiten
  ctx.stroke();                                            // Kreisbogen zeichnen
  var phi1 = ro.phi0+ro.dPhi;                              // Endwinkel (Bogenmaß, Uhrzeigersinn)
  var x1 = ro.x0+ro.r*Math.cos(phi1);                      // x-Koordinate Pfeilspitze
  var y1 = ro.y0-ro.r*Math.sin(phi1);                      // y-Koordinate Pfeilspitze
  var r = (ro.dPhi>0 ? +8 : -8);                           // Hilfsgröße für Pfeilspitze
  var x2 = x1+r*Math.sin(phi1);                            // x-Koordinate Pfeilanfang
  var y2 = y1+r*Math.cos(phi1);                            // y-Koordinate Pfeilanfang
  arrow(x2,y2,x1,y1,colorMapping);                         // Pfeil zeichnen
  }
         
// Grafikausgabe:
// Seiteneffekt list
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  if (typeMapping == REFLECTION_LINE) drawAxis();          // Entweder Spiegelachse ...
  else if (typeMapping == REFLECTION_POINT) drawCenter(pr);// ... oder Symmetriezentrum 
  else if (typeMapping == TRANSLATION) drawArrow();        // ... oder Verschiebungspfeil 
  else if (typeMapping == ROTATION) drawCenterArrow();     // ... oder Drehzentrum und Drehpfeil zeichnen
  for (var i=1; i<list.length; i++) drawObject2(list[i]);  // Objekte und Bildobjekte zeichnen
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen




