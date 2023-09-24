// Bragg-Reflexion
// 28.02.2020 - 17.08.2023

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe (oben)
var colorFront = "#0000ff";                                // Farbe für Wellenfront
var colorDS = "#ff0000";                                   // Farbe für Gangunterschied
var colorAngle = "#80ff80";                                // Farbe für Winkelmarkierungen

// Weitere Konstanten:

var PI2 = 2*Math.PI;                                       // Abkürzung für 2 pi
var DEG = Math.PI/180;                                     // 1 Grad (Bogenmaß)
var C = 20;                                                // Lichtgeschwindigkeit (Pixel pro Sekunde)
var PIX = 2.5e11;                                          // Umrechnungsfaktor (Pixel pro Meter)
var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfläche (Pixel)
var bu1, bu2;                                              // Schaltknöpfe (Reset, Start/Pause/Weiter)
var cbSlow;                                                // Optionsfeld (Zeitlupe)
var ipD, ipLambda, ipTheta, ipN;                           // Eingabefelder
var opDS;                                                  // Ausgabefeld
var x0, y0;                                                // Ursprung (Pixel)
var d;                                                     // Netzebenenabstand (m)
var lambda;                                                // Wellenlänge (m)
var theta;                                                 // Glanzwinkel (Bogenmaß)
var sin, cos;                                              // Zugehörige trigonometrische Werte
var n;                                                     // Zahl der Netzebenen (ohne Kristalloberfläche)
var on;                                                    // Flag für Bewegung
var slow;                                                  // Flag für Zeitlupe
var t0;                                                    // Bezugszeitpunkt
var t;                                                     // Aktuelle Zeit (s)
var timer;                                                 // Timer für Animation
var drx, dry;                                              // Komponenten des Strahlenabstands (Pixel)
var hwx, hwy;                                              // Komponenten der halben Wellenfront-Breite (Pixel)
var wvx, wvy;                                              // Komponenten der Wellenlänge (Pixel)
var tStart;                                                // Vorlaufzeit (s)

// Element der Schaltfläche (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // Rückgabewert
  } 

function start () {
  canvas = getElement("cv");                               // Zeichenfläche
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  bu1 = getElement("bu1",text01);                          // Schaltknopf (Reset)
  bu2 = getElement("bu2");                                 // Schaltknopf (Start/Pause/Weiter)
  setButton2State(0);                                      // Anfangszustand (vor dem Start)
  cbSlow = getElement("cbSlow");                           // Optionsfeld (Zeitlupe)
  cbSlow.checked = false;                                  // Zeitlupe zunächst abgeschaltet
  getElement("lbSlow",text03);                             // Erklärender Text (Zeitlupe)
  getElement("ipD1",text04);                               // Erklärender Text (Netzebenenabstand)
  ipD = getElement("ipD2");                                // Eingabefeld (Netzebenenabstand)
  getElement("ipD3",picometer);                            // Einheit (Netzebenenabstand)
  getElement("ipLambda1",text05);                          // Erklärender Text (Wellenlänge)
  ipLambda = getElement("ipLambda2");                      // Eingabefeld (Wellenlänge)
  getElement("ipLambda3",picometer);                       // Einheit (Wellenlänge)
  getElement("ipTheta1",text06);                           // Erklärender Text (Glanzwinkel)
  ipTheta = getElement("ipTheta2");                        // Eingabefeld (Glanzwinkel)
  getElement("ipTheta3",degree);                           // Einheit (Glanzwinkel)
  getElement("ipN1",text07);                               // Erklärender Text (Zahl der Netzebenen)
  ipN = getElement("ipN2");                                // Eingabefeld (Zahl der Netzebenen)
  getElement("opDS1",text08);                              // Erklärender Text (Gangunterschied)
  opDS = getElement("opDS2");                              // Ausgabefeld (Gangunterschied)
  getElement("opDS3",picometer);                           // Einheit (Gangunterschied)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // Übersetzer
  x0 = width/2; y0 = height/2;                             // Koordinaten des Ursprungs (Pixel)
  d = 2e-10;                                               // Startwert für Netzebenenabstand (m)
  lambda = 1e-10;                                          // Startwert für Wellenlänge (m)
  theta = 20*DEG;                                          // Startwert für Glanzwinkel (Bogenmaß)
  n = 2;                                                   // Startwert für Zahl der Netzebenen (ohne Oberfläche)
  t = 0;                                                   // Startwert für Zeitvariable (s)       
  slow = false;                                            // Zunächst keine Zeitlupe            
  updateInput();                                           // Eingabefelder aktualisieren
  enableInput(true);                                       // Eingabefelder aktivieren
  calculation();                                           // Zeitunabhängige Berechnungen
  focus(ipD);                                              // Fokus für erstes Eingabefeld
  paint();                                                 // Neu zeichnen  
  
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Reset)
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf (Start/Pause/Weiter)
  cbSlow.onclick = reactionSlow;                           // Reaktion auf Optionsfeld (Zeitlupe)
  ipD.onkeydown = reactionEnter;                           // Reaktion auf Entertaste (Abstand der Netzebenen)
  ipLambda.onkeydown = reactionEnter;                      // Reaktion auf Entertaste (Wellenlänge)
  ipTheta.onkeydown = reactionEnter;                       // Reaktion auf Entertaste (Glanzwinkel)
  ipN.onkeydown = reactionEnter;                           // Reaktion auf Entertaste (Zahl der Netzebenen)
  ipD.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Abstand der Netzebenen)
  ipLambda.onblur = reaction;                              // Reaktion auf Verlust des Fokus (Wellenlänge)
  ipTheta.onblur = reaction;                               // Reaktion auf Verlust des Fokus (Glanzwinkel)
  ipN.onblur = reaction;                                   // Reaktion auf Verlust des Fokus (Zahl der Netzebenen)
  
  } // Ende der Methode start
  
// Zustandsfestlegung für Schaltknopf Start/Pause/Weiter:
  
function setButton2State (st) {
  bu2.state = st;                                          // Zustand speichern
  bu2.innerHTML = text02[st];                              // Text aktualisieren
  }
  
// Umschalten des Schaltknopfs Start/Pause/Weiter:
  
function switchButton2 () {
  var st = bu2.state;                                      // Momentaner Zustand
  if (st == 0) st = 1;                                     // Falls Ausgangszustand, starten
  else st = 3-st;                                          // Wechsel zwischen Animation und Unterbrechung
  setButton2State(st);                                     // Neuen Zustand speichern, Text ändern
  }
  
// Eingabe, zeitunabhängige Berechnungen, neu zeichnen:
// Seiteneffekt d, lambda, theta, n, sin, cos, drx, dry, wvx, wvy, Ausgabefeld Gangunterschied

function reaction () {
  input();                                                 // Eingabe
  calculation();                                           // Zeitunabhängige Berechnungen
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Resetknopf:
// Seiteneffekt bu2, on, timer, t0, t, d, lambda, theta, n, sin, cos, drx, dry, wvx, wvy, Ausgabefeld Gangunterschied
   
function reactionReset () {
  setButton2State(0);                                      // Zustand des Schaltknopfs Start/Pause/Weiter
  enableInput(true);                                       // Eingabefelder aktivieren
  stopAnimation();                                         // Animation abschalten
  t = 0;                                                   // Zeitvariable zurücksetzen
  reaction();                                              // Eingegebene Werte übernehmen, rechnen, neu zeichnen
  focus(ipD);                                              // Fokus für erstes Eingabefeld
  }
  
// Reaktion auf den Schaltknopf Start/Pause/Weiter:
// Seiteneffekt bu2, on, timer, t0, d, lambda, theta, n, sin, cos, drx, dry, wvx, wvy, Ausgabefeld Gangunterschied

function reactionStart () {
  switchButton2();                                         // Zustand des Schaltknopfs ändern
  enableInput(false);                                      // Eingabefelder deaktivieren
  if (bu2.state == 1) startAnimation();                    // Entweder Animation starten bzw. fortsetzen ...
  else stopAnimation();                                    // ... oder stoppen
  reaction();                                              // Eingegebene Werte übernehmen, rechnen, neu zeichnen
  }
  
// Reaktion auf Optionsfeld Zeitlupe:
// Seiteneffekt slow

function reactionSlow () {
  slow = cbSlow.checked;                                   // Flag setzen
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt d, lambda, theta, n, sin, cos, drx, dry, wvx, wvy, Ausgabefeld Gangunterschied, t0, t
  
function reactionEnter (e) {
  var enter = (e.key == "Enter" || e.code == "Enter");     // Flag für Enter-Taste
  if (enter) reaction();                                   // Falls Enter-Taste, Daten übernehmen, rechnen und neu zeichnen
  }
  
// Fokus für Eingabefeld, Cursor am Ende:
// ip ... Eingabefeld
  
function focus (ip) {
  ip.focus();                                              // Fokus für Eingabefeld
  var n = ip.value.length;                                 // Länge der Zeichenkette
  ip.setSelectionRange(n,n);                               // Cursor setzen
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

// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen
// fix ... Flag für Nachkommastellen (im Gegensatz zu gültigen Ziffern)

function ToString (n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d));         // Zeichenkette mit Dezimalpunkt
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Aktualisierung der Eingabefelder:

function updateInput () {
  ipD.value = ToString(d*1e12,0,true);                     // Eingabefeld für Netzebenenabstand
  ipLambda.value = ToString(lambda*1e12,0,true);           // Eingabefeld für Wellenlänge
  ipTheta.value = ToString(theta/DEG,0,true);              // Eingabefeld für Glanzwinkel
  ipN.value = ToString(n+1,0,true);                        // Eingabefeld für Zahl der Netzebenen
  }
  
// Eingabefelder aktivieren/deaktivieren:
// f ... Flag für erlaubte Eingabe

function enableInput (f) {
  ipD.readOnly = !f;                                      // Eingabefeld für Netzebenenabstand
  ipLambda.readOnly = !f;                                 // Eingabefeld für Wellenlänge
  ipTheta.readOnly = !f;                                  // Eingabefeld für Glanzwinkel
  ipN.readOnly = !f;                                      // Eingabfeld für Zahl der Netzebenen
  }
  
// Eingabe einer Zahl
// ef .... Eingabefeld
// d ..... Zahl der Stellen
// fix ... Flag für Nachkommastellen (im Gegensatz zu gültigen Ziffern)
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// Rückgabewert: Zahl oder NaN
  
function inputNumber (ef, d, fix, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls möglich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu groß, korrigieren
  ef.value = ToString(n,d,fix);                            // Eingabefeld eventuell korrigieren
  return n;                                                // Rückgabewert
  }
  
// Abstand eines Punkts vom Ursprung (Pixel):
// (x,y) ... Gegebener Punkt (Pixel)
  
function distance (x, y) {
  var dx = x-x0, dy = y-y0;                                // Verbindungsvektor (Pixel)
  return Math.sqrt(dx*dx+dy*dy);                           // Rückgabewert (Pixel)
  }
  
// Vorlaufzeit (Zeit, bis erstmals eine Wellenfront den Ursprung erreicht):
  
function getDT () {
  var m = sin/cos;                                         // Steigung
  var max = 0;                                             // Startwert für maximalen Abstand (Pixel)
  for (var k=0; k<=n; k++) {                               // Für alle Netzebenen-Indizes ...
    var yK = y0+k*d*PIX;                                   // Schnittpunkt Strahl/Einfallslot
    var y = yK-m*x0;                                       // y-Koordinate am linken Bildrand
    if (y >= 0) {                                          // Falls y-Koordinate nicht negativ ...
      var di = distance(0,y);                              // Abstand vom Ursprung (Pixel)
      if (di > max) max = di;                              // Gegebenenfalls maximalen Abstand aktualisieren
      }
    var x = x0-yK/m;                                       // x-Koordinate am oberen Bildrand
    if (x >= 0) {                                          // Falls x-Koordinate nicht negativ ...
      di = distance(x,0);                                  // Abstand vom Ursprung (Pixel)
      if (di > max) max = di;                              // Gegebenenfalls maximalen Abstand aktualisieren
      }
    } // Ende for (k)
  return (max+10)/C;                                       // Rückgabewert
  }
  
// Zeitunabhängige Berechnungen:
// Seiteneffekt sin, cos, drx, dry, hwx, hwy, wvx, wvy, tStart, Ausgabefeld Gangunterschied

function calculation () {
  sin = Math.sin(theta); cos = Math.cos(theta);            // Trigonometrische Werte für Glanzwinkel
  var dd = d*PIX*cos;                                      // Abstand benachbarter Strahlen (Pixel)
  drx = dd*sin; dry = dd*cos;                              // Komponenten des Strahlenabstands (Pixel)
  var hw = 0.4*dd;                                         // Halbe Breite einer Wellenfront (Pixel)
  hwx = hw*sin; hwy = hw*cos;                              // Komponenten der halben Wellenfront-Breite (Pixel)
  var wv = lambda*PIX;                                     // Wellenlänge (Pixel)
  wvx = wv*cos; wvy = wv*sin;                              // Zugehörige Komponenten (Pixel)
  tStart = getDT();                                        // Vorlaufzeit (s)
  var ds = 2*d*sin*1e12;                                   // Gangunterschied (pm)
  opDS.innerHTML = ToString(ds,0,true);                    // Ausgabefeld Gangunterschied aktualisieren
  }
  
// Gesamte Eingabe:
// Seiteneffekt d, manbda, theta, n

function input () {
  var ae = document.activeElement;                         // Aktives Element
  d = 1e-12*inputNumber(ipD,0,true,100,1000);              // Abstand benachbarter Netzebenen (m)
  lambda = 1e-12*inputNumber(ipLambda,0,true,100,1000);    // Wellenlänge (m)
  theta = DEG*inputNumber(ipTheta,0,true,1,89);            // Glanzwinkel (Bogenmaß)
  n = inputNumber(ipN,0,true,2,10)-1;                      // Zahl der Netzebenen (ohne Kristalloberfläche)
  if (n*d*PIX >= y0-10) {                                  // Falls zu viele Netzebenen ...
    n = Math.floor((y0-10)/(d*PIX));                       // Zahl korrigieren
    ipN.value = ToString(n+1,0,true);                      // Eingabefeld aktualisieren
    }
  if (ae == ipD) focus(ipLambda);                          // Fokus für nächstes Eingabefeld
  if (ae == ipLambda) focus(ipTheta);                      // Fokus für nächstes Eingabefeld
  if (ae == ipTheta) focus(ipN);                           // Fokus für nächstes Eingabefeld
  if (ae == ipN) ipN.blur();                               // Fokus abgeben
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath (c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke 1
  }
  
// Linie:
// (x1,y1) ... Anfangspunkt
// (x2,y2) ... Endpunkt
// c ......... Farbe (optional, Defaultwert schwarz)
// w ......... Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  newPath(c);                                              // Neuer Grafikpfad
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke, falls angegeben
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Schwarz ausgefüllter Kreis (für Atome bzw. Ionen):

function circle (x, y, r) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,PI2,true);                               // Kreis vorbereiten
  ctx.fillStyle = "#000000";                               // Füllfarbe
  ctx.fill();                                              // Kreis ausfüllen
  }
  
// Winkelmarkierung im Gegenuhrzeigersinn:
// (x,y) ... Scheitel (Pixel)
// r ....... Radius (Pixel)
// a0 ...... Startwinkel (Bogenmaß)
// a ....... Winkelbetrag (Bogenmaß) 

function angle (x, y, r, a0, a) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = colorAngle;                              // Füllfarbe
  ctx.moveTo(x,y);                                         // Scheitel als Anfangspunkt
  ctx.lineTo(x+r*Math.cos(a0),y-r*Math.sin(a0));           // Linie auf dem ersten Schenkel
  ctx.arc(x,y,r,PI2-a0,PI2-a0-a,true);                     // Kreisbogen
  ctx.closePath();                                         // Zurück zum Scheitel
  ctx.fill(); ctx.stroke();                                // Kreissektor ausfüllen, Rand zeichnen
  }
  
// Netzebene mit Teilchen sowie einfallendem und reflektiertem Strahl: 
// y ... Senkrechte Bildschirmkoordinate (Pixel)
  
function plane (y) {
  line(0,y,width,y);                                       // Netzebene
  line(x0-500*cos,y-500*sin,x0,y);                         // Einfallender Strahl
  line(x0+500*cos,y-500*sin,x0,y);                         // Reflektierter Strahl
  var iMax = Math.floor(x0/(d*PIX));                       // Maximaler Index für Atome bzw. Ionen
  for (var i=-iMax; i<=iMax; i++)                          // Für alle Indizes ...
    circle(x0+i*d*PIX,y,2);                                // Atom bzw. Ion zeichnen
  }
  
// Wellenfront für einfallenden Strahl:
// (x,y) ... Mitte der vordersten Wellenfront (Pixel)
// i ....... Index der aktuellen Wellenfront (ab 0)
  
function  front1 (x, y, i) {
  var x1 = x-i*wvx, y1 = y-i*wvy;                          // Mittelpunkt der aktuellen (nachfolgenden) Wellenfront (Pixel)
  var x2 = x1-hwx, y2 = y1+hwy;                            // Endpunkt links unten
  var x3 = x1+hwx, y3 = y1-hwy;                            // Endpunkt rechts oben
  line(x2,y2,x3,y3,colorFront);                            // Wellenfront zeichnen  
  }
  
// Wellenfront für reflektierten Strahl:
// (x,y) ... Mitte der vordersten Wellenfront (Pixel)
// i ....... Index der aktuellen Wellenfront (ab 0)
  
function  front2 (x, y, i) {
  var x1 = x-i*wvx, y1 = y+i*wvy;                          // Mittelpunkt der aktuellen (nachfolgenden) Wellenfront (Pixel)
  var x2 = x1-hwx, y2 = y1-hwy;                            // Endpunkt links oben
  var x3 = x1+hwx, y3 = y1+hwy;                            // Endpunkt rechts unten
  line(x2,y2,x3,y3,colorFront);                            // Wellenfront zeichnen  
  }
  
// Ausgabe einer Zeile (Zeichensatz und Textausrichtung vorausgesetzt):
// s ... Zeichenkette
// y ... Senkrechte Bildschirmkoordinate (Pixel)

function centerText (s, y) {
  var w = ctx.measureText(s).width;                        // Breite (Pixel)
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(x0-w/2,y-15,w,20);                          // Hintergrund löschen
  ctx.fillStyle = colorDS;                                 // Schriftfarbe
  ctx.fillText(s,x0,y);                                    // Zeile ausgeben
  }
  
// Datenausgabe Gangunterschied:

function dataDS () {
  var z = 2*d*sin/lambda;                                  // Quotient Gangunterschied durch Wellenlänge
  var bragg = (Math.abs(z-Math.round(z)) < 0.05);          // Flag für Bragg-Bedingung
  var sz = ToString(z,1,true);                             // Zeichenkette für Koeffizient
  var s = symbolDeltaS+" = "+sz+" "+symbolLambda;          // Komplette Zeichenkette
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "center";                                // Textausrichtung
  centerText(s,15);                                        // Gangunterschied als Vielfaches der Wellenlänge
  if (bragg) centerText(text09,35);                        // Eventuell Aussage, dass Bragg-Bedingung erfüllt
  }
  
// Grafikausgabe:
// Seiteneffekt t, t0
  
function paint () {
  if (on) {                                                // Falls Animation angeschaltet ...
    var t1 = new Date();                                   // ... Aktuelle Zeit
    var dt = (t1-t0)/1000;                                 // ... Länge des Zeitintervalls (s)
    if (slow) dt /= 5;                                     // ... Falls Zeitlupe, Zeitintervall durch 5 dividieren
    t += dt;                                               // ... Zeitvariable aktualisieren
    t0 = t1;                                               // ... Neuer Bezugszeitpunkt
    }
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe (oben)
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  var r = 20;                                              // Radius für Winkelmarkierungen (Pixel)
  angle(x0,y0,r,Math.PI-theta,theta);                      // Winkelmarkierung für einfallenden Strahl
  angle(x0,y0,r,0,theta);                                  // Winkelmarkierung für reflektierten Strahl
  if (dry < 5) r = 0;                                      // Radius 0, falls extrem wenig Platz für Winkelmarkierung
  else if (dry < 30) r = 2*dry/3;                          // Radius, falls wenig Platz für Winkelmarkierung
  if (r > 0) angle(x0,y0,r,1.5*Math.PI-theta,2*theta);     // Winkelmarkierung unten (zwei gleich große Winkel)
  line(x0,0,x0,height);                                    // Einfallslot
  line(x0,y0,x0-drx,y0+dry);                               // Lot zu 2. Strahl, links
  line(x0,y0,x0+drx,y0+dry);                               // Lot zu 2. Strahl, rechts  
  for (var k=0; k<=n; k++) {                               // Für alle Netzebenen-Indizes ...
    var y = y0+PIX*k*d;                                    // Senkrechte Bildschirmkoordinate (Pixel)
    plane(y);                                              // Netzebene, Teilchen, einfallender und reflektierter Strahl
    var s = C*(t-tStart);                                  // Zurückgelegte Strecke seit Ursprung (Pixel)
    var x = x0+s*cos-k*drx, y = y0+s*sin+k*dry;            // Mittelpunkt der vordersten Wellenfront
    var iMin = Math.ceil((x-x0)/wvx);                      // Minimaler Wellenfront-Index
    if (iMin < 0) iMin = 0;                                // Negativen Index verhindern
    var iMax = Math.floor(x/wvx)+1;                        // Maximaler Wellenfront-Index
    for (var i=iMin; i<=iMax; i++) front1(x,y,i);          // Einfallende Wellenfronten zeichnen
    if (x <= x0) continue;                                 // Falls noch keine Reflexion, weiter zur nächsten Netzebene
    y = 2*(y0+PIX*k*d)-y;                                  // Spiegelung an Netzebene
    iMin = Math.ceil((x-width)/wvx)-1;                     // Minimaler Wellenfront-Index
    if (iMin < 0) iMin = 0;                                // Negativen Index verhindern
    iMax = Math.floor((x-x0)/wvx);                         // Maximaler Wellenfront-Index
    for (i=iMin; i<=iMax; i++) front2(x,y,i);              // Reflektierte Wellenfronten zeichnen
    } // Ende for (k)
  line(x0,y0+PIX*d,x0-drx,y0+dry,colorDS,2);               // Gangunterschied, linker Teil
  line(x0,y0+PIX*d,x0+drx,y0+dry,colorDS,2);               // Gangunterschied, rechter Teil
  dataDS();                                                // Angaben zum Gangunterschied
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen