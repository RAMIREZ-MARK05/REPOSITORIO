// Radioaktive Zerfallsreihen
// Java-Applet (20.07.1998) umgewandelt
// 23.12.2017 - 26.12.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel decaychains_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorAlpha = "#ffff00";                                // Farbe für Alphazerfall
var colorBeta = "#00ffff";                                 // Farbe für Betazerfall (Beta Minus)
var colorArrow = "#00c000";                                // Farbe für Pfeil (aktueller Zerfall)

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Normaler Zeichensatz (Tabelle)
var FONT1 = "normal normal bold 16px sans-serif";          // Großer Zeichensatz (Reaktionsgleichung)
var FONT2 = "normal normal normal 12px sans-serif";        // Kleiner Zeichensatz (Reaktionsgleichung)
var WF = 50, HF = 20;                                      // Abmessungen eines Feldes (Pixel)  
var symb = [                                               // Elemente 70 bis 99
    "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au",
    "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac",
    "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es"]; 

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var ch;                                                    // Auswahlfeld (Zerfallreihe)
var bu;                                                    // Schaltknopf (Nächster Zerfall)
var timer;                                                 // Timer für Animation
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Zeitvariable (s)
var on;                                                    // Flag für Bewegung

var type;                                                  // Array für Zerfallsarten der Nuklide (ab 70 e / 120 n)
var series;                                                // Nummer der Zerfallsreihe (0 bis 3)
var ord;                                                   // Ordnungszahl Mutterkern
var ordNew;                                                // Ordnungszahl Tochterkern
var nuc;                                                   // Nukleonenzahl Mutterkern
var nucNew;                                                // Nukleonenzahl Tochterkern

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
  getElement("lb",text01);                                 // Erklärender Text (Zerfallsreihe)
  ch = getElement("ch");                                   // Auswahlfeld (Zerfallreihe)
  initSelect(ch,text02);                                   // Auswahlfeld vorbereiten
  bu = getElement("bu",text03);                            // Schaltknopf (Nächster Zerfall)
  bu.disabled = false;                                     // Schaltknopf zunächst aktiviert
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  initNuc();                                               // Nuklidtabelle vorbereiten
  prepareSeries(0);                                        // Zunächst Thorium-Serie

  t0 = new Date();                                         // Bezugszeitpunkt
  t = 0;                                                   // Zeitvariable (s) 
  on = false;                                              // Animation zunächst abgeschaltet
  paint();                                                 // Zeichnen
  
  ch.onchange = reactionSelect;                            // Reaktion auf Auswahlfeld (Zerfallsreihe)
  bu.onclick = reactionButton;                             // Reaktion auf Schaltknopf (Nächster Zerfall)
  
  } // Ende der Methode start
  
// Initialisierung des Auswahlfeldes:
// ch ... Auswahlfeld
// t .... Array der Texte
  
function initSelect (ch, t) {
  for (var i=0; i<t.length; i++) {                         // Für alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = t[i];                                         // Text des Elements übernehmen 
    ch.add(o);                                             // Element zur Liste hinzufügen
    }
  ch.selectedIndex = 0;                                    // Index gleich 0 (Thorium-Reihe)
  }
  
// Reaktion auf Auswahlfeld:
// Seiteneffekt t, on, bu, series, ord, nuc, ordNew, nucNew, t0, timer

function reactionSelect () {
  t = 0;                                                   // Zeitvariable zurücksetzen
  on = false;                                              // Animation ausgeschaltet
  bu.disabled = false;                                     // Schaltknopf aktiviert
  prepareSeries(ch.selectedIndex);                         // Zerfallsreihe vorbereiten                    
  paint();                                                 // Neu zeichnen
  }
     
// Reaktion auf Schaltknopf:
// Seiteneffekt on, timer, t0, ord, nuc, ordNew, nucNew, bu, t
   
function reactionButton () {
  t = 0;                                                   // Zeitvariable zurücksetzen
  startAnimation();                                        // Animation einschalten
  ord = ordNew;                                            // Ordnungszahl Mutterkern 
  nuc = nucNew;                                            // Nukleonenzahl Mutterkern
  var typ = type[ord-70][nuc-ord-120];                     // Zerfallsart aus Array übernehmen
  if (typ == 0) return;                                    // Falls Isotop stabil, abbrechen
  if (typ >= 1 && typ <= 1.5) {                            // Falls Alphazerfall ...
    ordNew = ord-2;                                        // Ordnungszahl Tochterkern
    nucNew = nuc-4;                                        // Nukleonenzahl Tochterkern
    }     
  if (typ > 1.5 && typ <= 2)                               // Falls Betazerfall ...
    ordNew = ord+1;                                        // Ordnungszahl Tochterkern                              
  if (type[ordNew-70][nucNew-ordNew-120] == 0)             // Falls Tochterkern stabil ... 
    bu.disabled = true;                                    // Schaltknopf deaktivieren
  paint();                                                 // Neu zeichnen
  }
      
// Animation starten oder fortsetzen:
// Seiteneffekt on, timer, t0

function startAnimation () {
  on = true;                                               // Animation angeschaltet
  timer = setInterval(paint,40);                           // Timer mit Intervall 0,040 s aktivieren
  t0 = new Date();                                         // Neuer Anfangszeitpunkt 
  }
  
// Animation stoppen:
// Seiteneffekt on, timer

function stopAnimation () {
  on = false;                                              // Animation abgeschaltet
  clearInterval(timer);                                    // Timer deaktivieren
  }

//-------------------------------------------------------------------------------------------------

// Zerfallsreihe vorbereiten:
// s ... Nummer der Zerfallsreihe (0 bis 3)
// Seiteneffekt series, ord, nuc, ordNew, nucNew

function prepareSeries (s) {
  series = s;                                              // Nummer der Zerfallsreihe
  if (s == 0) {ord = 90; nuc = 232;}                       // Entweder Thorium-Reihe ...
  else if (s == 1) {ord = 94; nuc = 241;}                  // ... oder Neptunium-Reihe ...
  else if (s == 2) {ord = 92; nuc = 238;}                  // ... oder Uran-Radium-Reihe ...
  else if (s == 3) {ord = 92; nuc = 235;}                  // ... oder Uran-Actinium-Reihe
  ordNew = ord; nucNew = nuc;                              // Vorläufige Werte für Tochterkern
  }

// Nuklidtypen (Zerfallsart, Halbwertszeit):
// Seiteneffekt type
// -1 ... nicht vorkommend
// 0 .... stabil
// 1 .... Alpha
// 2 .... Beta Minus
// 1+x (mit 0 <= x <= 1) bedeutet, dass das Nuklid mit Wahrscheinlichkeit x einen Betazerfall hat
// und mit Wahrscheinlichkeit 1-x einen Alphazerfall

function initNuc () {
  type = new Array(30);                                    // Neues Array (1. Index, Ordnungszahl - 70)
  for (var i=0; i<30; i++) type[i] = new Array(40);        // Neue Arrays (2. Index, Neutronenzahl - 120)
  for (i=0; i<30; i++)                                     // Für alle Werte von Index 1 ...
    for (var j=0; j<40; j++)                               // Für alle Werte von Index 2 ...
      type[i][j] = -1;                                     // Voreinstellung nicht vorkommend
  // Americium:
  type[25][26] = 1;
  // Plutonium:
  type[24][27] = 2;
  // Neptunium:
  type[23][24] = 1;
  // Uran:
  type[22][20] = -1; type[22][21] = 1; type[22][22] = 1; 
  type[22][23] = 1; type[22][26] = 1;
  // Protactinium:
  type[21][20] = 1; type[21][21] = -1; type[21][22] = 2;
  type[21][23] = 2;
  // Thorium:
  type[20][17] = 1; type[20][18] = 1; type[20][19] = 1;
  type[20][20] = 1; type[20][21] = 2; type[20][22] = 1; 
  type[20][24] = 2;
  // Actinium:
  type[19][16] = 1; type[19][18] = 1.9862; type[19][19] = 2;
  // Radium:
  type[18][15] = 1; type[18][16] = 1; type[18][17] = 2;
  type[18][18] = 1; type[18][20] = 2;
  // Francium:
  type[17][14] = 1; type[17][16] = 2;
  // Radon:
  type[16][13] = 1; type[16][14] = 1; type[16][16] = 1;
  // Astatin:
  type[15][12] = 1;
  // Polonium:
  type[14][6] = 1; type[14][7] = 1; type[14][8] = 1; 
  type[14][9] = 1; type[14][10] = 1; type[14][11] = 1; 
  type[14][12] = 1; type[14][14] = 1;
  // Wismut:
  type[13][6] = 0; type[13][7] = 2; type[13][8] = 1.0028; 
  type[13][9] = 1.6406; type[13][10] = 1.9791; type[13][11] = 1.9998;
  // Blei:
  type[12][4] = 0;  type[12][5] = 0; type[12][6] = 0; 
  type[12][7] = 2;  type[12][8] = 2; type[12][9] = 2; 
  type[12][10] = 2; type[12][12] = 2;
  // Thallium:
  type[11][6] = 2; type[11][7] = 2; type[11][8] = 2;
  type[11][9] = 2;
  }

   
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:

function newPath () {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Linie:
// (x1,y1) ... Anfangspunkt
// (x2,y2) ... Endpunkt
// c ......... Farbe (optional)
// w ......... Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  if (c) ctx.strokeStyle = c;                              // Linienfarbe, falls angegeben
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)
// Zu beachten: Die Farbe wird durch ctx.strokeStyle bestimmt.

function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                           // Falls Liniendicke nicht definiert, Defaultwert                          
  var dx = x2-x1, dy = y2-y1;                              // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);                     // Länge
  if (length == 0) return;                                 // Abbruch, falls Länge 0
  dx /= length; dy /= length;                              // Einheitsvektor
  var s = 2.5*w+7.5;                                       // Länge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;                        // Hilfspunkt für Pfeilspitze         
  var h = 0.5*w+3.5;                                       // Halbe Breite der Pfeilspitze
  var xSp1 = xSp-h*dy, ySp1 = ySp+h*dx;                    // Ecke der Pfeilspitze
  var xSp2 = xSp+h*dy, ySp2 = ySp-h*dx;                    // Ecke der Pfeilspitze
  xSp = x2-0.6*s*dx; ySp = y2-0.6*s*dy;                    // Einspringende Ecke der Pfeilspitze
  ctx.beginPath();                                         // Neuer Pfad
  ctx.lineWidth = w;                                       // Liniendicke
  ctx.moveTo(x1,y1);                                       // Anfangspunkt
  if (length < 5) ctx.lineTo(x2,y2);                       // Falls kurzer Pfeil, weiter zum Endpunkt, ...
  else ctx.lineTo(xSp,ySp);                                // ... sonst weiter zur einspringenden Ecke
  ctx.stroke();                                            // Linie zeichnen
  if (length < 5) return;                                  // Falls kurzer Pfeil, keine Spitze
  ctx.beginPath();                                         // Neuer Pfad für Pfeilspitze
  ctx.lineWidth = 1;                                       // Liniendicke zurücksetzen
  ctx.fillStyle = ctx.strokeStyle;                         // Füllfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zurück zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Textausgabe:
// s ....... Text
// (x,y) ... Position
// a ....... Ausrichtung ("left", "center" oder "right")

function writeText (s, x, y, a) {
  ctx.textAlign = a;                                       // Textausrichtung übernehmen
  ctx.fillText(s,x,y);                                     // Text ausgeben
  }
  
// Einzelnes Feld der Nuklidtabelle:
// ord ..... Ordnungszahl
// neutr ... Neutronenzahl
// (x,y) ... Position des linken oberen Randes

function field (ord, neutr, x, y) {
  if (ord < 70 || ord >= 100) return;                      // Falls Ordnungszahl ungeeignet, abbrechen
  else if (neutr < 120 || neutr >= 160) return;
  var colorField = "#ffffff";                              // Hintergrundfarbe
  var colorFont = "#000000";                               // Schriftfarbe  
  var typeRad = type[ord-70][neutr-120];                   // Zerfallsart
  if (typeRad == 0) {                                      // Falls stabiles Nuklid ...
    colorField = "#000000";                                // Hintergrundfarbe 
    colorFont = "#ffffff";                                 // Schriftfarbe 
    }
  if (typeRad >= 1 && typeRad <= 1.5)                      // Falls Alphazerfall ...
    colorField = colorAlpha;                               // Hintergrundfarbe
  if (typeRad > 1.5 && typeRad <= 2)                       // Falls Betazerfall ...
    colorField = colorBeta;                                // Hintergrundfarbe
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = colorField;                              // Füllfarbe
  ctx.fillRect(x,y,WF,HF);                                 // Rechteck ausfüllen
  if (typeRad > 1 && typeRad < 2) {                        // Falls zwei Zerfallsmöglichkeiten ...
    var q = 0.5-Math.abs(1.5-typeRad);                     // Hilfsgröße für Dreieck
    ctx.moveTo(x,y);                                       // Ecke links oben als Anfangspunkt
    ctx.lineTo(x+q*WF,y);                                  // Weiter nach rechts
    ctx.lineTo(x,y+q*HF);                                  // Weiter nach links unten
    ctx.lineTo(x,y);                                       // Zurück zum Anfangspunkt
    ctx.fillStyle = (typeRad<=1.5 ? colorBeta : colorAlpha);  // Farbe für Dreieck links oben
    ctx.fill();                                            // Dreieck ausfüllen
    }
  ctx.strokeRect(x,y,WF,HF);                               // Rechtecksrand
  if (typeRad == -1) return;                               // Falls Nuklid nicht vorkommt, abbrechen
  ctx.fillStyle = colorFont;                               // Schriftfarbe
  writeText(symb[ord-70],x+5,y+14,"left");                 // Elementsymbol (linksbündig)
  writeText(""+(ord+neutr),x+WF-5,y+14,"right");           // Nukleonenzahl (rechtsbündig)
  }
  
// Hervorhebung eines Feldes:
// dx ... Spaltennummer (relativ zur mittleren Spalte)
// dy ... Zeilennummer (relativ zur mittleren Zeile)
  
function emphasize (dx, dy) {
  var x = (width-WF)/2+dx*WF;                              // x-Koordinate linker Rand
  var y = 6*HF+dy*HF;                                      // y-Koordinate oberer Rand                        
  ctx.strokeStyle = "#ff0000";                             // Linienfarbe
  ctx.lineWidth = 3;                                       // Liniendicke
  ctx.strokeRect(x,y,WF,HF);                               // Rechtecksrand
  }

// Pfeil für Alphazerfall:  
// o ... Ordnungszahl
// n ... Neutronenzahl
// w ... Liniendicke
  
function arrowAlpha (o, n, w) {
  var q = 0.25, dx = q*WF, dy = q*HF;                      // Hilfsgrößen
  var x0 = width/2+(n-(nuc-ord))*WF;                       // Mittelpunkt der Ausgangszelle, x-Koordinate
  var y0 = 6.5*HF-(o-ord)*HF;                              // Mittelpunkt der Ausgangszelle, y-Koordinate
  var x1 = x0-2*WF;                                        // Mittelpunkt der Zielzelle, x-Koordinate
  var y1 = y0+2*HF;                                        // Mittelpunkt der Zielzelle, y-Koordinate
  arrow(x0-dx,y0+dy,x0-2*WF+dx,y0+2*HF-dy,w);              // Pfeil
  }
  
// Pfeil für Betazerfall:
// o ... Ordnungszahl
// n ... Neutronenzahl
// w ... Liniendicke

function arrowBeta (o, n, w) {
  var q = 0.25, dx = q*WF, dy = q*HF;                      // Hilfsgrößen
  var x0 = width/2+(n-(nuc-ord))*WF;                       // Mittelpunkt der Ausgangszelle, x-Koordinate
  var y0 = 6.5*HF-(o-ord)*HF;                              // Mittelpunkt der Ausgangszelle, y-Koordinate
  var x1 = x0-WF;                                          // Mittelpunkt der Zielzelle, x-Koordinate
  var y1 = y0-HF;                                          // Mittelpunkt der Zielzelle, y-Koordinate
  arrow(x0-dx,y0-dy,x1+dx,y1+dy,w);                        // Pfeil
  }
  
// Ausschnitt der Nuklidtabelle:
// ord ..... Ordnungszahl (Mitte)
// neutr ... Neutronenzahl (Mitte)

function table (ord, neutr) {
  ctx.font = FONT;                                         // Zeichensatz
  var x0 = (width-WF)/2;                                   // x-Koordinate für linken Rand der mittleren Spalte
  var y0 = 6*HF;                                           // y-Koordinate für oberen Rand der mittleren Zeile
  for (var ze=ord+4; ze>=ord-4; ze--)                      // Für alle sichtbaren Zeilen ...
    for (var sp=neutr-4; sp<=neutr+4; sp++)                // Für alle sichtbaren Spalten ...
      field(ze,sp,x0+(sp-neutr)*WF,y0+(ord-ze)*HF);        // Tabellenfeld ausgeben    
  var alpha = (nucNew != nuc);                             // Flag für Alphazerfall        
  if (t < 2) emphasize(0,0);                               // Falls t < 2, Mutterkern hervorheben
  else emphasize(alpha?-2:-1,alpha?2:-1);                  // Andernfalls Tochterkern hervorheben
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  for (ze=ord+4; ze>=ord-4; ze--)                          // Für alle sichtbaren Zeilen ...
    writeText(""+ze,x0-4*WF-4,15+y0+(ord-ze)*HF,"right");  // Ordnungszahl angeben (links)
  for (sp=neutr-4; sp<=neutr+4; sp++)                      // Für alle sichtbaren Spalten ...
    writeText(""+sp,WF/2+x0+(sp-neutr)*WF,2*HF-3,"center");// Neutronenanzahl angeben (oben)
  ctx.strokeStyle = "#000000";                             // Linienfarbe
  for (ze=ord+4; ze>=ord-4; ze--)                          // Für alle sichtbaren Zeilen ...
    for (sp=neutr-4; sp<=neutr+4; sp++) {                  // Für alle sichtbaren Spalten außer ganz links ...
      if ((ze+sp)%4 != series) continue;                   // Falls andere Zerfallsreihe, weiterzählen
      var typeCell = type[ze-70][sp-120];                  // Zerfallstyp
      if (typeCell <= 0) continue;                         // Falls kein Zerfall, weiterzählen
      var w = 4.5-2*typeCell;                              // Liniendicke für Alphazerfall
      if (w > 0.5 && sp > neutr-3 && ze > ord-3)           // Falls sinnvoll ...
        arrowAlpha(ze,sp,w);                               // Pfeil für Alphazerfall
      w = 2*typeCell-1.5;                                  // Liniendicke für Betazerfall
      if (w > 0.5 && sp > neutr-4 && ze < ord+4)           // Falls sinnvoll ... 
        arrowBeta(ze,sp,w);                                // Pfeil für Betazerfall
      }          
  if (t < 1) return;                                       // Falls t < 1, abbrechen
  ctx.strokeStyle = colorArrow;                            // Farbe für aktuellen Zerfallspfeil   
  if (alpha) arrowAlpha(ord,neutr,3);                      // Entweder Pfeil für aktuellen Alphazerfall ...
  else arrowBeta(ord,neutr,3);                             // ... oder Pfeil für aktuellen Betazerfall
  }
  
// Nuklidschreibweise:
// nuc ..... Nukleonenzahl
// ord ..... Ordnungszahl
// e ....... Symbol (Element, Elektron oder Neutrino)
// (x,y) ... Position
  
function writeNuclide (nuc, ord, e, x, y) {
  ctx.font = FONT2;                                        // Kleiner Zeichensatz
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  writeText(""+nuc,x-2,y-7,"right");                       // Nukleonenzahl (links oben)
  writeText(""+ord,x-2,y+3,"right");                       // Ordnungszahl (links unten)
  ctx.font = FONT1;                                        // Großer Zeichensatz
  writeText(e,x,y,"left");                                 // Symbol
  }   
  
// Reaktionsgleichung:
  
function writeReaction () {
  var x0 = width/2, y0 = 270;                              // Mittelposition
  writeNuclide(nuc,ord,symb[ord-70],x0-50,y0);             // Mutterkern (Nuklidschreibweise)
  ctx.strokeStyle = "#000000";                             // Farbe für Reaktionspfeil
  arrow(x0-20,y0-5,x0+20,y0-5);                            // Reaktionspfeil
  writeNuclide(nucNew,ordNew,symb[ordNew-70],x0+50,y0);    // Tochterkern (Nuklidschreibweise)
  writeText("+",x0+85,y0,"center");                        // Pluszeichen
  if (ordNew < ord)                                        // Falls Alphazerfall ...
    writeNuclide(4,2,"He",x0+110,y0);                      // (4,2)-Helium (Nuklidschreibweise)
  else {                                                   // Falls Betazerfall ...
    writeNuclide(0,-1,"e",x0+110,y0);                      // (0,-1)-Elektron (Nuklidschreibweise)
    writeText("+",x0+135,y0,"center");                     // Pluszeichen
    writeNuclide(0,0,"\u03bd",x0+160,y0);                  // (0,0)-Neutrino (Nuklidschreibweise)
    ctx.font = FONT2;                                      // Zeichensatz für Index
    writeText("e",x0+167,y0+3,"left");                     // Index e für Elektronneutrino
    line(x0+159,y0-12,x0+171,y0-12);                       // Strich für Antineutrino
    }
  }

// Grafikausgabe:
// Seiteneffekt t, t0, on, timer 
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // Aktuelle Zeit
    t += (t1-t0)/1000;                                     // Zeitvariable aktualisieren
    t0 = t1;                                               // Neuer Bezugszeitpunkt
    }
  table(ord,nuc-ord);                                      // Ausschnitt der Nuklidtabelle
  if (t > 0) writeReaction();                              // Reaktionsgleichung
  if (t > 2) stopAnimation();                              // Nach 2 Sekunden Animation beenden
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen


