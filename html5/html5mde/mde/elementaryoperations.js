// Schriftliches Rechnen
// Java-Applet (23.07.1998) umgewandelt
// 26.04.2014 - 10.12.2017

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in veränderter Form - für nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabhängige Texte sind einer eigenen Datei (zum Beispiel elementaryoperations_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorMessage = "#ff0000";                              // Farbe für Meldungen
var colorDigit = "#80c0ff";                                // Farbe für Zifferntasten

// Konstanten:

var font1 = "bold 20px sans-serif";                        // Zeichensatz für Rechnung
var font2 = "bold 12px sans-serif";                        // Zeichensatz für Erfolgsmeldung
var dx = 15;                                               // Abstand zwischen benachbarten Ziffern (Pixel)
var dy = 20;                                               // Abstand zwischen benachbarten Zeilen (Pixel)
var height0 = 400;                                         // Höhe des Rechenbereichs (Pixel)
var dKeys = 45;                                            // Abstand der Ziffernfeld-Mittelpunkte (Pixel) 

// Attribute:

var maxAdd;                                                // Obergrenze für Addition (einzelner Summand)
var maxSub;                                                // Obergrenze für Subtraktion (Minuend)
var maxMult;                                               // Obergrenze für Multiplikation (einzelner Faktor)
var maxDiv1;                                               // Obergrenze für Division (Dividend)
var maxDiv2;                                               // Obergrenze für Division (Divisor)
var canvas, ctx;                                           // Zeichenfläche, Grafikkontext
var width, height;                                         // Abmessungen der gesamten Zeichenfläche (Pixel)
var type;                                                  // Nummer für Rechenart
var n1, n2;                                                // Erster und zweiter Operand
var nn;                                                    // Array für Addition von mehr als zwei Summanden
var pos;                                                   // Position der einzugebenden Ziffer (Zählung ab 0)
var step;                                                  // Nummer des Teilschritts (Zählung ab 0)
var ze0, sp0;                                              // Linke obere Ecke der Rechnung
var aufgaben;                                              // Zahl der Aufgaben
var richtigeAufgaben;                                      // Zahl der richtigen Aufgaben
var neueFehler;                                            // Zahl der neuen Fehler
var fehler;                                                // Zahl der Fehler insgesamt
var aufgabeFertig;                                         // Flag für beendete Aufgabe

var breite, hoehe;                                         // Abmessungen der Rechnung
var results;                                               // Array für Zwischenergebnisse und zugehörige Daten
var active;

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
  getElement("lb0",text01);                                // Erklärender Text (Rechenart)
  cb1 = newCheckbox("cb1");                                // Optionsfeld (Addition)
  getElement("lb1",text02);                                // Erklärender Text (Addition)                        
  cb2 = newCheckbox("cb2");                                // Optionsfeld (Addition mehrerer Summanden)
  getElement("lb2",text03);                                // Erklärender Text (Addition mehrerer Summanden)
  cb3 = newCheckbox("cb3");                                // Optionsfeld (Subtraktion)
  getElement("lb3",text04);                                // Erklärender Text (Subtraktion)
  cb4 = newCheckbox("cb4");                                // Optionsfeld (Multiplikation)
  getElement("lb4",text05);                                // Erklärender Text (Multiplikation)
  cb5 = newCheckbox("cb5");                                // Optionsfeld (Division ohne Rest)
  getElement("lb5",text06);                                // Erklärender Text (Division ohne Rest)
  cb6 = newCheckbox("cb6");                                // Optionsfeld (Division mit Rest)
  getElement("lb6",text07);                                // Erklärender Text (Division mit Rest)
  getElement("lb7",text08);                                // Erklärender Text (Schwierigkeitsgrad)
  ch = getElement("ch");                                   // Auswahlliste (Schwierigkeitsgrad) 
  ch.selectedIndex = 0;                                    // Schwierigkeitsgrad 1
  bu = getElement("bu",text09);                            // Schaltknopf (Nächste Aufgabe) 
  getElement("author",author);                             // Autor (und Übersetzer)

  setMaxima();                                             // Obergrenzen festlegen
  type = 0;                                                // Keine Rechenart ausgewählt
  aufgaben = richtigeAufgaben = 0;                         // Noch keine Aufgabe gerechnet
  fehler = neueFehler = 0;                                 // Noch keine Fehler
  step = 0;                                                // Noch kein Rechenschritt
  aufgabeFertig = true;                                    // Flag für zu Ende gerechnete Aufgabe
  active = false;
    
  paint();                                                 // Grafikausgabe
  
  bu.onclick = reactionButton;                             // Reaktion auf Schaltknopf
  ch.onchange = setMaxima;                                 // Reaktion auf Auswahlliste
  
  onkeydown = reactionKeyDown;                             // Reaktion auf Drücken einer Taste
  
  canvas.onmousedown = function (e) {                      // Reaktion auf Drücken der Maustaste
    reactionDown(e.clientX,e.clientY);                                
    }
    
  canvas.ontouchstart = function (e) {                     // Reaktion auf Berührung
    if (active) return;
    active = true;
    var obj = e.changedTouches[0];
    reactionDown(obj.clientX,obj.clientY);                 // Eventuell Zugmodus aktivieren
    e.preventDefault();                                    // Standardverhalten verhindern
    }
    
  canvas.ontouchend = function (e) {                       // Reaktion auf Ende der Berührung
    active = false;                              
    }
    
  } // Ende der Methode start
  
// Reaktion auf Schaltknopf:
    
function reactionButton () {
  if (aufgaben == 0 && !aufgabeFertig && step < results.length) return; // Erste Aufgabe abgebrochen?
  if (aufgaben != 0 && step < results.length) return; // Aufgabe abgebrochen?
  type = selectType();                           // Auswahl der Rechenart (Zufallsgenerator)
  neueAufgabe();                                 // Auswahl der Aufgabe (Zufallsgenerator)
  }
 
// Reaktion auf Drücken einer Taste:
// Seiteneffekt pos, step, neueFehler, fehler, aufgaben, richtigeAufgaben, aufgabeFertig
  
function reactionKeyDown (e) {
  var key = Number(e.keyCode);                   // Tastaturcode der eingegebenen Ziffer
  if (key >= 48 && key <= 57)                    // Falls Ziffer mit normaler Tastatur eingegeben ...
    key -= 48;                                   // Ziffer ermitteln                            
  else if (key >= 96 && key <= 105)              // Falls Ziffer mit Ziffernblock eingegeben ...
    key -= 96;                                   // Ziffer ermitteln
  else return;                                   // Falls andere Taste, abbrechen
  input(key);                                    // Eingabe
  }
  
// Reaktion auf Anklicken mit der Maus oder Berührung mit dem Finger:

function reactionDown (x, y) {
  var re = canvas.getBoundingClientRect();       // Lage der Zeichenfläche bezüglich Viewport
  x -= re.left; y -= re.top;                     // Koordinaten bezüglich Zeichenfläche
  var y0 = height0+25;                           // y-Koordinate der Zifferntasten
  if (Math.abs(y-y0) > 20) return;               // Abbruch, falls zu weit oben oder unten
  for (var n=0; n<10; n++) {                     // Für alle Ziffern (0 bis 9) ...
    var x0 = (width+(2*n-9)*dKeys)/2;            // x-Koordinate des Ziffernfeld-Mittelpunkts
    if (Math.abs(x-x0) <= 20) {                  // Falls Zifferntaste getroffen ...
      input(n); break;                           // Eingabe und Abbruch der for-Schleife
      }         
    }
  }
  
// Eingabe einer Ziffer:
// n ... Eingegebene Ziffer (0 bis 9)
// Seiteneffekt pos, neueFehler, fehler, step, aufgabeFertig 

function input (n) {
  var r = results[step];                         // Aktuelles Zwischenergebnis mit zugehörigen Angaben
  var l = laenge(r.n);                           // Länge des Zwischenergebnisses
  var c;                                         // Variable für richtige Ziffer
  if (r.d < 0) c = ziffer(r.n,l-1-pos);          // Richtige Ziffer (für Rechts-Links-Eingabe)
  if (r.d > 0) c = ziffer(r.n,pos);              // Richtige Ziffer (für Links-Rechts-Eingabe)
  if (n == c) pos++;                             // Falls Eingabe richtig, Position aktualisieren
  else {neueFehler++; fehler++;}                 // Andernfalls Fehlerzahl aktualisieren
  if (pos >= l) {                                // Falls Eingabe des Zwischenergebnisses fertig ...
    step++; pos = 0;                             // Nächsten Zwischenschritt beginnen
    aufgabeFertig = (step < results.length);     // Feststellen, ob Aufgabe beendet
    }
  if (step < results.length) {                   // Falls letztes Zwischenergebnis noch nicht eingegeben ...                
    r = results[step];                           // Aktuelles Zwischenergebnis
    if (String(r.n).indexOf('-') >= 0) step++;   // Falls Linie, keine Eingabe, also nächster Schritt 
    }
  else if (!aufgabeFertig) {                     // Falls letzte Eingabe abgeschlossen ...
    aufgaben++;                                  // Aufgabenzahl aktualisieren
    if (neueFehler == 0) richtigeAufgaben++;     // Zahl der richtigen Aufgaben aktualisieren
    neueFehler = 0;                              // Zahl der neuen Fehler zurückstellen
    }
  //enableCB(true); bWeiter.setEnabled(true);
  paint();                                       // Grafikausgabe
  }
  
// Festlegung der Obergrenzen:

function setMaxima () {
  switch (ch.selectedIndex) {
    case 0:                                      // Schwierigkeitsgrad 1
      maxAdd = maxSub = 1000;
      maxMult = 100; 
      maxDiv1 = 10000; maxDiv2 = 20;
      break;
    case 1:                                      // Schwierigkeitsgrad 2
      maxAdd = maxSub = 100000;
      maxMult = 1000;
      maxDiv1 = 100000; maxDiv2 = 100;
      break;
    case 2:                                      // Schwierigkeitsgrad 3
      maxAdd = maxSub = 10000000;
      maxMult = 10000;
      maxDiv1 = 1000000; maxDiv2 = 1000;
      break;
    }
  }
  
//-----------------------------------------------------------------------------

// Neues Optionsfeld (nicht ausgewählt):

function newCheckbox (id) {
  var cb = getElement(id);
  cb.checked = false;
  return cb;
  }
  
// Länge einer natürlichen Zahl (Anzahl der Ziffern):

function laenge (n) {return (""+n).length;}
  
// Ziffer einer natürlichen Zahl:
// n ... gegebene Zahl
// pos .... Position (von links, ab 0)

function ziffer (n, pos) {return (""+n).charAt(pos);}
  
// Zentrieren der Aufgabe:
// Seiteneffekt ze0, sp0

function zentrieren (breite, hoehe) {
  ze0 = -1+(height-50-hoehe*dy)/(2*dy); 
  sp0 = (width-40-breite*dx)/(2*dx);
  }
  
// Auswahl einer Rechenart:
// Seiteneffekt type

function selectType () {
  var a = [];
  if (cb1.checked) a.push(1);
  if (cb2.checked) a.push(2);
  if (cb3.checked) a.push(3);
  if (cb4.checked) a.push(4);
  if (cb5.checked) a.push(5);
  if (cb6.checked) a.push(6);
  var n = a.length;
  if (n > 0) return a[Math.floor(n*Math.random())];
  else return 0;
  }
  
// Strich vorbereiten:

function line (n) {
  var l = "";
  for (var i=0; i<n; i++) l += "-";
  return l;
  }
  
// Zahl oder waagrechte Linie mit zugehörigen Angaben zum Array results hinzufügen:

function addToResults (n, x, y, d) {
  var res = {n: n, x: x, y: y, d: d};
  results.push(res);
  }
  
// Addition/Subtraktion vorbereiten:
// rz ... Rechenzeichen (+ oder -)
// Seiteneffekt results[], breite, hoehe, ze0, sp0

function prepareAddSub (rz) {
  if (rz != '+' && rz != '-') return;            // Abbruch, falls falsches Rechenzeichen
  var l1 = laenge(n1), l2 = laenge(n2);          // Längen der Summanden
  var result = (rz=='+' ? n1+n2 : n1-n2);        // Ergebnis
  var l3 = laenge(result);                       // Länge des Ergebnisses
  breite = Math.max(l1,l2,l3)+2;                 // Breite der Rechnung (Zahl der Zeichen)
  hoehe = 4;                                     // Höhe der Rechnung (Zahl der Zeilen)
  zentrieren(breite,hoehe);                      // Berechnung von ze0 und sp0
  addToResults(line(breite),0,2,0);              // Waagrechte Linie zwischen Angabe und Ergebnis
  addToResults(result,breite-l3,3,-1);           // Ergebnis, Position, Rechts-Links-Eingabe
  }
  
// Addition von mehr als zwei Summanden vorbereiten:
// Seiteneffekt results[], breite, hoehe, ze0, sp0

function prepareAddMore () {
  var sum = 0, zs = nn.length;                   // Summe, Zahl der Summanden
  for (var i=0; i<zs; i++) sum += nn[i];         // Summe berechnen
  breite = laenge(sum)+2;                        // Breite der Rechnung (Zahl der Zeichen)
  hoehe = nn.length+2;                           // Höhe der Rechnung (Zahl der Zeilen)
  zentrieren(breite,hoehe);                      // Berechnung von ze0 und sp0
  addToResults(line(breite),0,zs,0);             // Waagrechte Linie zwischen Angabe und Ergebnis
  addToResults(sum,2,zs+1,-1);                   // Ergebnis, Position, Rechts-Links-Eingabe 
  }
  
// Multiplikation vorbereiten:
// Seiteneffekt results[], breite, hoehe, ze0, sp0

function prepareMult () {
  var l1 = laenge(n1), l2 = laenge(n2);          // Längen der Faktoren
  var np = 0;                                    // Zahl der Produkte zwischen den Strichen
  for (var i=0; i<l2; i++)                       // Für alle Ziffern des zweiten Faktors ...
    if (ziffer(n2,i) != 0) np++;                 // Zahl der Produkte aktualisieren
  breite = l1+3+l2;                              // Breite der Rechnung (Zahl der Zeichen)
  hoehe = 2+np+2;                                // Höhe der Rechnung (Zahl der Zeilen)
  zentrieren(breite,hoehe);                      // Berechnung von ze0 und sp0
  addToResults(line(breite),0,1,0);              // Waagrechte Linie unter der Angabe
  var yp = 1;                                    // Zeilennummer eines Zwischenergebnisses (relativ zu ze0)
  for (var i=0; i<l2; i++) {                     // Für alle Ziffern des zweiten Faktors ...
    var p = ziffer(n2,i)*n1;                     // Produkt: Ziffer mal erster Faktor
    if (p != 0 || n2 == 0) yp++;                 // Zeilennummer hochzählen (außer bei Produkt 0)  
    addToResults(p,l1+4-laenge(p)+i,yp,-1);      // Zwischenergebnis, Position, Rechts-Links-Eingabe
    }
  if (np <= 1) return;                           // Abbruch, wenn keine Addition nötig
  addToResults(line(breite),0,yp+1,0);           // Waagrechte Linie vor dem Ergebnis
  var n = n1*n2;                                 // Endergebnis
  addToResults(n,breite-laenge(n),yp+2,-1);      // Endergebnis, Position, Rechts-Links-Eingabe
  }
  
// Zahl der Ziffern, mit denen die Division beginnt:

function beginDiv () {
  var l1 = laenge(n1);
  var lq = laenge(Math.floor(n1/n2));
  return l1-lq+1;
  }
  
// Division vorbereiten:
// Seiteneffekt results[], breite, hoehe, ze0, sp0, step

function prepareDiv () {
  if (n2 == 0) return;                           // Abbruch, falls Division durch 0
  var quot = Math.floor(n1/n2);                  // Quotient (ganzzahlig) 
  var lq = laenge(quot);                         // Länge des Quotienten
  var rest = n1%n2, lr = laenge(rest);           // Rest, Länge des Restes
  var l1 = laenge(n1), l2 = laenge(n2);          // Längen von Dividend und Divisor
  breite = l1+6+l2+lq;                           // Breite der Rechnung (Zahl der Zeichen)
  hoehe = 3*lq+1;                                // Höhe der Rechnung (Zahl der Zeichen)
  if (rest > 0) breite += (3+lr);                // Falls nötig, Breite korrigieren   
  for (var i=0; i<lq; i++)                       // Für alle Ziffern des Quotienten ...
    if (ziffer(quot,i) == 0) hoehe -= 3;         // Falls nötig, Höhe korrigieren
  zentrieren(breite,hoehe);                      // ze0 und sp0 berechnen
  var ze = 0;                                    // Zeilennummer (relativ zu ze0)
  var beg = beginDiv();                          // Länge des aktuellen Dividenden
  var spE = l1+l2+6, spZ = beg;                  // Spaltennummern (relativ zu sp0)
  var d0 = (""+n1).substring(0,beg);             // Aktueller Dividend (Zeichenkette)
  for (var i=0; i<lq; i++) {
    var digit = ziffer(quot,i);                  // Ziffer des Quotienten
    addToResults(digit,spE,0,-1);                // Ziffer, Position, Rechts-Links-Eingabe
    if (digit == 0) ze -= 3;                     // Korrektur der Zeilennummer, falls nötig
    else {                                       // Andernfalls ...
      var prod = digit*n2;                       // Produkt
      addToResults(prod,spZ-laenge(prod),ze+1,-1); // Produkt, Position, Rechts-Links-Eingabe
      var ld = laenge(d0);                       // Länge des aktuellen Dividenden
      addToResults(line(ld),spZ-ld,ze+2,0);      // Waagrechte Linie zwischen Produkt und Differenz
      d0 -= prod;                                // Differenz (vorübergehende Umwandlung in eine Zahl)
      addToResults(d0,spZ-laenge(d0),ze+3,-1);   // Differenz, Position, Rechts-Links-Eingabe
      }
    if (i == lq-1) break;                        // Abbruch, wenn keine neue Stelle mehr vorhanden
    digit = ziffer(n1,spZ);                      // Anzuhängende Ziffer des ursprünglichen Dividenden
    d0 += digit;                                 // Neuer Dividend (Umwandlung in Zeichenkette)
    addToResults(digit,spZ,ze+3,-1);             // Aktueller Dividend, Position, Rechts-Links-Eingabe
    ze += 3; spE++; spZ++;                       // Position aktualisieren
    } // Ende der for-Schleife
  if (rest > 0) addToResults(rest,spE+4,0,1);    // Rest, falls vorhanden (Links-Rechts-Eingabe)
  step = 0;                                      // Index des ersten Zwischenergebnisses
  }
  
// Aufgabe vorbereiten:
// Seiteneffekt results[], breite, hoehe, ze0, sp0, step

function prepareItem () {
  results = [];                                  // Leeres Array für Zwischenergebnisse
  step = 1;                                      // Index des ersten Zwischenergebnisses (Ausnahme Division!)
  switch (type) {                                // Je nach Rechenart ...
    case 1: prepareAddSub('+'); break;           // Addition mit zwei Summanden vorbereiten
    case 2: prepareAddMore(); break;             // Addition mit mehr als zwei Summanden vorbereiten
    case 3: prepareAddSub('-'); break;           // Subtraktion vorbereiten
    case 4: prepareMult(); break;                // Multiplikation vorbereiten
    case 5: case 6: prepareDiv(); break;         // Division ohne/mit Rest vorbereiten
    }
  }
  
// Zufallszahl:
// min ... Minimum
// max ... Maximum
// exp ... Exponent (optimal); exp > 1 bewirkt, dass kleine Zahlen häufiger vorkommen

function random (min, max, exp) {
  if (!exp) exp = 1;                             // Exponent 1, falls nichts anderes angegeben
  return Math.floor(min+(max+1-min)*Math.pow(Math.random(),exp)); // Zufallszahl im angegebenen Bereich
  }
  
// Neue Aufgabe (Zufallsgenerator):
// Seiteneffekt n1, n2, nn

function neueAufgabe () {
  switch (type) {                                // Je nach Rechenart ...
    case 1:                                      // Addition von zwei Summanden 
      n1 = random(0,maxAdd);                     // Erster Summand 
      n2 = random(0,maxAdd);                     // Zweiter Summand
      break;
    case 2:                                      // Addition von mehr als zwei Summanden
      var dim = random(3,6);                     // Zahl der Summanden
      nn = new Array(dim);                       // Array für die Summanden
      for (var i=0; i<dim; i++)                  // Für alle Indizes ...
        nn[i] = random(1,maxAdd,2.5);            // Neuer Summand
      break;
    case 3:                                      // Subtraktion
      n1 = random(0,maxSub);                     // Minuend
      n2 = random(0,n1);                         // Subtrahend
      break;
    case 4:                                      // Multiplikation
      n1 = random(0,maxMult);                    // Erster Faktor
      n2 = random(0,maxMult);                    // Zweiter Faktor
      break;
    case 5: case 6:                              // Division
      n1 = random(maxDiv2,maxDiv1);              // Dividend
      n2 = random(2,Math.min(n1,maxDiv2));       // Divisor
      if (type == 5) n1 -= n1%n2;                // Rest 0 erzwingen
      break;
    } // Ende switch
  prepareItem();                                 // Aufgabe vorbereiten
  pos = 0;                                       // Noch keine Ziffer eingegeben 
  aufgabeFertig = false;                         // Aufgabe nicht beendet
  //enableCB(false); bWeiter.setEnabled(false);
  paint();
  }
  
//-----------------------------------------------------------------------------

// Grafikausgabe eines Zeichens:
// c .... Zeichen (als String)
// ze ... Zeile (relativ zu ze0)
// sp ... Spalte (relativ zu sp0)

function drawChar (c, ze, sp) {
  ctx.fillText(c,(sp0+sp)*dx,(ze0+ze+1)*dy);
  }

// Grafikausgabe einer Zahl:
// z .... Zahl
// ze ... Zeile (relativ zu ze0)
// sp ... Spalte (höchste Stelle, relativ zu sp0)

function drawNumber (z, ze, sp) {
  var s = ""+z;
  for (var i=0; i<s.length; i++) 
    drawChar(s.charAt(i),ze,sp+i);
  }

// Grafikausgabe einer Zahl:
// z .... Zahl
// ze ... Zeile (relativ zu ze0)
// sp ... Spalte (Platz rechts von Einerstelle, relativ zu sp0)

function drawNumberRight (z, ze, sp) {
  if (z < 0) return;
  var l = (""+z).length;
  drawNumber(z,ze,sp-l);
  }
  
// Grafikausgabe einer Zahl (Rechts-Links-Eingabe):
// Es werden die schon eingegebenen Ziffern sowie ein Cursor an der aktuellen Position ausgegeben. 
  
function writeRightPart () {
  if (step >= results.length) return;            // Abbruch, falls step zu groß
  var r = results[step];                         // Aktuelle Zahl, Position, Eingaberichtung
  var right = laenge(r.n)-1;                     // Position der Einerziffer (relativ zur ersten Ziffer)
  var x = r.x+right;                             // Position der Einerziffer (relativ zu sp0)
  for (var i=0; i<pos; i++) {                    // Für alle schon eingegebenen Ziffern ...
    var z = ziffer(r.n,right-i);                 // Ziffer ermitteln
    drawChar(z,r.y,x);                           // Ziffer ausgeben
    x--;                                         // Neue Position (ein Zeichen weiter links)
    }
  if (pos <= right) drawChar('_',r.y,x);         // Cursor an aktueller Position
  }
  
// Grafikausgabe einer Zahl (Links-Rechts-Eingabe):
// Es werden die schon eingegebenen Ziffern sowie ein Cursor an der aktuellen Position ausgegeben.
  
function writeLeftPart () {
  if (step >= results.length) return;            // Abbruch, falls step zu groß
  var r = results[step];                         // Aktuelle Zahl, Position, Eingaberichtung
  var x = r.x;                                   // Aktuelle Position (relativ zu sp0)
  for (var i=0; i<pos; i++) {                    // Für alle schon eingegebenen Ziffern ...
    var z = ziffer(r.n,i);                       // Ziffer ermitteln
    drawChar(z,r.y,x);                           // Ziffer ausgeben
    x++;                                         // Neue Position (ein Zeichen weiter rechts)
    }
  if (pos < laenge(r.n)) drawChar('_',r.y,x);    // Cursor an aktueller Position
  }
  
// Waagrechte Linie zeichnen:
// x, y ... Position (linker Rand, relativ zu ze0, sp0)
// l ...... Länge (Zahl der Stellen)

function drawLine (ze, sp, l) {
  var yy = (2*(ze0+ze)+1)*dy/2, x0 = (sp0+sp)*dx-8;
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(x0,yy); ctx.lineTo(x0+l*dx,yy); 
  ctx.stroke();
  }
  
// Grafikausgabe für beliebige Rechenart:

function writeCalculation () {
  if (step > results.length) {                   // Falls Nummer des Zwischenschritts zu groß ...
    alert("Fehler in writeCalculation!");        // Fehlermeldung
    return;                                      // Abbruch
    }
  for (var i=0; i<step; i++) {                   // Für alle Zwischenschritte ...
    var ri = results[i];                         // Einzelangaben
    var n = ri.n.toString();                     // Zeichenkette lesen         
    if (n.indexOf('-') >= 0) {                   // Falls waagrechte Linie ...
      drawLine(ri.y,ri.x,laenge(n));             // Linie zeichnen
      }
    else drawNumber(ri.n,ri.y,ri.x);             // Andernfalls Zahl ausgeben
    }
  if (step == results.length) return;            // Falls Nummer des Zwischenschritts zu groß ...            
  if (results[step].d == 1) writeLeftPart();     // Teil der Zahl ausgeben (für Rechts-Links-Eingabe)
  else writeRightPart();                         // Teil der Zahl ausgeben (für Links-Rechts-Eingabe)                         
  }

// Angabe für Addition/Subtraktion:
// rz ... Rechenzeichen (+ oder -)

function addsub (rz) {
  if (rz != '+' && rz != '-') return;            // Abbruch, falls falsches Rechenzeichen
  if (rz == '-') rz = '\u2212';                  // Längeres Minuszeichen
  drawNumberRight(n1,0,breite);                  // Erster Operand
  drawNumberRight(n2,1,breite);                  // Zweiter Operand
  drawChar(""+rz,1,0);                           // Rechenzeichen
  }
  
// Angabe für Addition von mehr als zwei Summanden:

function addMore () {
  for (var i=0; i<nn.length; i++)                // Für jeden Summanden ...
    drawNumberRight(nn[i],i,breite);             // Summanden hinschreiben
  drawChar('+',nn.length-1,0);                   // Pluszeichen
  }
  
// Angabe für Multiplikation:

function mult () {
  var l1 = laenge(n1);                           // Länge des ersten Faktors
  drawNumber(n1,0,0);                            // Erster Faktor
  drawChar('\u00b7',0,l1+1);                     // Malpunkt
  drawNumber(n2,0,l1+3);                         // Zweiter Faktor
  }
  
// Bogen über die ersten Ziffern (für Division):
// n ... Anzahl der Ziffern

function bogen (n) {
  var h = n*dx/2;                                // Hälfte der waagrechten Ausdehnung (Pixel)
  var r = (25+h*h)/10;                           // Radius (Pixel); Höhensatz: h*h = 5*(2*r-5)
  var wi = Math.asin(h/r);                       // Mittelpunktswinkel zum halben Bogen (Bogenmaß)
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.arc(sp0*dx+h-8,ze0*dy+r-5,r,3*Math.PI/2-wi,3*Math.PI/2+wi,false);
  ctx.stroke();
  }
    
// Angabe für Division:

function div () {
  var l1 = laenge(n1), l2 = laenge(n2);          // Länge des Dividenden
  drawNumber(n1,0,0);                            // Dividend
  drawChar(':',0,l1+1);                          // Divisionszeichen
  drawNumber(n2,0,l1+3);                         // Divisor
  drawChar('=',0,l1+l2+4);                       // Gleichheitszeichen
  bogen(beginDiv());                             // Bogen über die ersten Ziffern
  var last = results.length-1;                   // Letzter Index für Array der Zwischenergebnisse
  if (n1%n2 != 0 && step >= last)                // Falls Rest einzugeben oder Division mit Rest beendet ...
    drawChar('R',0,results[last].x-2);           // Buchstabe R für Rest
  }
  
// Auswahl der richtigen Form eines Substantivs:
// a ... Array der Form ["0 ...", "1 ...", "2 ...", ... , "x ..."]
// n ... Anzahl

function form (a, n) {
  for (var i=0; i<a.length; i++) 
    if (Number(a[i].substring(0,1)) == n) return a[i];
  return ""+n+a[a.length-1].substring(1);  
  }
    
// Ein- und Ausgabebereich:

function ioRange () {
  ctx.lineWidth = 1;                                       // Liniendicke
  ctx.font = font1;                                        // Größerer Zeichensatz 
  var y = height0+10;                                      // Oberer Rand der Ziffernfelder
  var a = 30;                                              // Seitenlänge der Ziffernfelder
  for (var i=0; i<10; i++) {                               // Für alle Ziffern (0 bis 9) ...
    ctx.fillStyle = colorDigit;                            // Füllfarbe für Hintergrund
    var x = (width+(2*i-9)*dKeys)/2;                       // x-Koordinate des Ziffernfeld-Mittelpunkts
    ctx.fillRect(x-a/2,y,a,a);                             // Quadrat als Hintergrund
    ctx.strokeRect(x-a/2,y,a,a);                           // Rand des Quadrats
    ctx.fillStyle = "#000000";                             // Füllfarbe für Text
    ctx.fillText(i,x,y+a/2+7);                             // Ziffer
    }
  ctx.font = font2;                                        // Kleinerer Zeichensatz
  ctx.fillStyle = colorMessage;                            // Füllfarbe
  var s = form(text12,aufgaben)+",";                       // Zahl der Aufgaben
  s += " "+text13+" "+form(text14,richtigeAufgaben)+"  ";  // Zahl der richtigen Aufgaben
  s += "("+form(text15,fehler)+")";                        // Zahl der Fehler
  ctx.fillText(s,width/2,height-10);                       // Meldung ausgeben
  ctx.fillStyle = "#000000";                               // Füllfarbe zurücksetzen (schwarz)
  }

// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausfüllen
  ctx.fillStyle = "#000000";                               // Normale Füllfarbe schwarz (muss eventuell zurückgesetzt werden)
  ctx.textAlign = "center";                                // Textausrichtung (zentriert)
  ioRange();                                               // Ein- und Ausgabebereich (unten)
  ctx.font = font1;                                        // Zeichensatz für Rechnung
  if (type == 0) {                                         // Falls keine Rechenart ausgewählt ...
    ctx.fillStyle = colorMessage;                          // Füllfarbe
    ctx.fillText(text11,width/2,height0/2);                // Meldung
    return;                                                // Abbruch
    } 
  switch (type) {                                          // Je nach Rechenart ...
    case 1: addsub('+'); break;                            // Angabe für Addition zweier Zahlen
    case 2: addMore(); break;                              // Angabe für Addition von mehr als zwei Zahlen
    case 3: addsub('-'); break;                            // Angabe für Subtraktion
    case 4: mult(); break;                                 // Angabe für Multiplikation
    case 5: case 6: div(); break;                          // Angabe für Division ohne/mit Rest
    }
  writeCalculation();                                      // Schon erledigte Rechenschritte und Cursor ausgeben    
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Methode start aufrufen