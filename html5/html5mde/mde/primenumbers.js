// Primzahlentabelle
// Java-Applet (17.10.2003) umgewandelt
// 29.07.2015 - 18.10.2015

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe f�r Tabelle
var colorPrime = "#ffc040";                                // Hintergrundfarbe f�r Primzahlen
var colorNumber = "#0000ff";                               // Farbe f�r Rahmen (aktuelle Zahl)

// Weitere Konstanten:

var widthCell = 100;                                       // Breite einer Tabellenzelle (Pixel)
var heightCell = 20;                                       // H�he einer Tabellenzelle (Pixel)
var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var ip;                                                    // Eingabefeld (Zahl)
var op1, op2;                                              // Ausgabefelder (Primzahleigenschaft oder Primfaktorzerlegung)
var dx, dy;                                                // Position des Zelleninhalts (Pixel)
var offsetX;                                               // Waagrechte Verschiebung der Tabelle (Pixel)
var offsetY;                                               // Senkrechte Verschiebung der Tabelle (Pixel)
var drag;                                                  // Flag f�r Zugmodus
var number;                                                // Aktuelle Zahl
var ipf;                                                   // Flag f�r Verwendung des Eingabefelds (normalerweise true)
var dn;                                                    // Hilfsgr��e
var prime;                                                 // Array mit Flags f�r Primzahleigenschaft
var xMouse, yMouse;                                        // Position des Mauszeigers (Pixel)

// Start:

function start () {
  canvas = document.getElementById("cv");                  // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen der Zeichenfl�che (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  ip = document.getElementById("ip");                      // Eingabefeld (Zahl)
  ip.value = "2";                                          // Default-Wert f�r Eingabefeld
  ip.focus();                                              // Fokus f�r Eingabefeld
  op1 = document.getElementById("op1");                    // Oberes Ausgabefeld
  op2 = document.getElementById("op2");                    // Unteres Ausgabefeld
  ipf = true;                                              // Flag f�r Verwendung des Eingabefelds
  dx = widthCell/2;                                        // Waagrechte Position des Zelleninhalts (Pixel)  
  dy = heightCell/2+4;                                     // Senkrechte Position des Zelleninhalts (Pixel)
  dn = 10*Math.ceil(height/heightCell);                    // Hilfsgr��e
  prime = new Array(2*dn+1);                               // Array f�r Primzahleigenschaft
  reaction();                                              // Reaktion auf Eingabe
  drag = false;                                            // Zugmodus zun�chst ausgeschaltet
  ip.onkeydown = reactionEnter;                            // Reaktion auf Eingabefeld
  
  canvas.onmousedown = function (e) {                      // Reaktion auf Dr�cken der Maustaste
    reactionDown(e.clientX,e.clientY);           
    }
    
  canvas.ontouchstart = function (e) {                     // Reaktion auf Ber�hrung
    var obj = e.changedTouches[0];
    reactionDown(obj.clientX,obj.clientY);     
    if (drag) e.preventDefault();                          // Standardverhalten verhindern
    }
      
  canvas.onmouseup = function (e) {                        // Reaktion auf Loslassen der Maustaste
    drag = false;                        
    }
    
  canvas.ontouchend = function (e) {                       // Reaktion auf Ende der Ber�hrung
    drag = false;                       
    }
    
  canvas.onmousemove = function (e) {                      // Reaktion auf Bewegen der Maus
    reactionMove(e.clientX,e.clientY);                     // Position ermitteln und neu zeichnen
    }
    
  canvas.ontouchmove = function (e) {                      // Reaktion auf Bewegung mit Finger
    var obj = e.changedTouches[0];
    reactionMove(obj.clientX,obj.clientY);                 // Position ermitteln und neu zeichnen
    e.preventDefault();                                    // Standardverhalten verhindern                          
    }
  }
  
// Reaktion auf Tastendruck (nur auf Enter-Taste):
  
function reactionEnter (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13)                                      // Falls Entertaste (Chrome) ...
    reaction();                                            // ... Daten �bernehmen, rechnen, Tabelle neu zeichnen                          
  }
  
// Reaktion auf Eingabe einer Zahl:
// Seiteneffekt number, prime, offsetX, offsetY
// Wirkung auf Ein- und Ausgabefelder
  
function reaction () {
  var n = Number(ip.value);                                // Zahl im Eingabefeld
  if (!n || n != Math.floor(n)) {                          // Falls sinnlose Eingabe ...
    alert(textError);                                      // Fehlermeldung
    ip.value = number;                                     // Bisherige Zahl im Eingabefeld
    return;                                                // Abbruch
    }                 
  number = n;                                              // Gegebene Zahl aktualisieren
  if (number < 1) {                                        // Falls Zahl zu klein ...
    number = 1;                                            // Zahl korrigieren
    ip.value = 1;                                          // Eingabe korrigieren
    }
  if (number > 1e12) {                                     // Falls Zahl zu gro� ...
    number = 1e12;                                         // Zahl korrigieren
    ip.value = 1e12;                                       // Eingabe korrigieren
    }
  for (var i=0; i<=2*dn; i++)                              // F�r alle Indizes ...
    prime[i] = isPrime(number-dn+i);                       // Flags f�r Primzahleigenschaft setzen
  var a = arrayFactors(number);                            // Array der Primfaktoren (aufsteigend sortiert)
  op1.innerHTML = output1(a);                              // Obere Ausgabezeile (Schreibweise ohne Potenzen)
  op2.innerHTML = output2(a);                              // Untere Ausgabezeile (Schreibweise mit Potenzen)
  if (ipf) calcOffset();                                   // Falls n�tig, neue Werte von offsetX und offsetY berechnen
  paint();                                                 // Tabellenabschnitt neu zeichnen
  }
  
// Reaktion auf Mausklick oder Ber�hrung mit dem Finger:
// Seiteneffekt drag, xMouse, yMouse, ipf, number, prime, offsetX, offsetY
// Wirkung auf Ein- und Ausgabefelder
  
function reactionDown (x, y) {
  drag = true;                                             // Zugmodus eingeschaltet
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che
  xMouse = x; yMouse = y;                                  // Mausposition abspeichern
  x += offsetX; y += offsetY;                              // Koordinaten gegen�ber Ursprung des Tabellenabschnitts
  var n = 1+Math.floor(x/widthCell)+10*Math.floor(y/heightCell); // Neue Zahl
  ip.value = n;                                            // Eingabefeld aktualisieren
  ipf = false;                                             // Flag f�r Verwendung des Eingabefelds
  reaction();                                              // Reaktion auf Eingabe
  ipf = true;                                              // Flag f�r Verwendung des Eingabefelds zur�cksetzen  
  }
  
// Reaktion auf Bewegung der Maus oder des Fingers:
// Seiteneffekt offsetX, offsetY, xMouse, yMouse
  
function reactionMove (x, y) {
  if (!drag) return;                                       // Falls kein Zugmodus, abbrechen  
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  x -= re.left; y -= re.top;                               // Koordinaten bez�glich Zeichenfl�che  
  offsetX += (xMouse-x);                                   // Neuer Wert der waagrechten Verschiebung
  offsetY += (yMouse-y);                                   // Neuer Wert der senkrechten Verschiebung
  restrictOffset();                                        // Zu gro�e Verschiebung verhindern  
  xMouse = x; yMouse = y;                                  // Neue Mausposition speichern
  paint();                                                 // Tabellenabschnitt neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Kleinster Primfaktor:
// z ... Gegebene Zahl
// R�ckgabewert: Kleinster Primfaktor der gegebenen Zahl, falls definiert; andernfalls undefined 
  
function firstPrime (z) {
  if (z <= 1) return undefined;                            // Falls Zahl zu klein, R�ckgabewert undefined
  if (Math.floor(z) != z) return undefined;                // Falls Zahl nicht nat�rlich, R�ckgabewert undefined
  for (var t=2; t*t<=z; t++)                               // F�r alle denkbaren Teiler ab 2 ...
    if (z%t == 0) return t;                                // Teiler als R�ckgabewert
  return z;                                                // Gegebene Zahl (Primzahl) als R�ckgabewert
  } 
  	
// Primzahleigenschaft:
// z ... Gegebene Zahl
// R�ckgabewert: true f�r Primzahl, sonst false
  
function isPrime (z) {
  return (firstPrime(z) == z);                             // R�ckgabewert
  }
  
// Array f�r Faktorenzerlegung:
// n ... Gegebene nat�rliche Zahl

function arrayFactors (n) {
  var a = new Array();                                     // Leeres Array
  var f = firstPrime(n);                                   // Kleinster Primfaktor
  while (f) {                                              // Solange Primfaktor vorhanden ...
    a.push(f);                                             // Faktor zum Array hinzuf�gen
    n /= f;                                                // Durch diesen Faktor dividieren
    f = firstPrime(n);                                     // Kleinster Primfaktor
    }
  return a;                                                // R�ckgabewert
  }
  
// Zeichenkette f�r Faktorisierung (Schreibweise ohne Potenzen):
// a ... Array der Primfaktoren (aufsteigend sortiert)

function output1 (a) {
  var n = a.length;                                        // Gr��e des Arrays (Anzahl der Faktoren)
  if (n == 0) return "";                                   // Sonderfall (leeres Array f�r 1)
  if (n == 1) return textPrime;                            // Sonderfall (Array mit einem Element f�r Primzahl)
  var s = "= ";                                            // Anfang der Zeichenkette f�r Normalfall
  for (var i=0; i<n; i++) {                                // F�r alle Elemente des Arrays ...
    s += a[i];                                             // Faktor zur Zeichenkette hinzuf�gen
    if (i < n-1)  s += " "+symbolMult+" ";                 // Falls n�tig, Multiplikationszeichen hinzuf�gen
    }
  return s;                                                // R�ckgabewert
  }
  
// Zeichenkette f�r Faktorisierung (Schreibweise mit Potenzen):
// a ... Array der Primfaktoren (aufsteigend sortiert)
// Falls sich die Schreibweise mit Potenzen nicht auswirkt, wird eine leere Zeichenkette zur�ckgegeben.

function output2 (a) {
  var n = a.length;                                        // Gr��e des Arrays (Anzahl der Faktoren)
  if (n <= 1) return "";                                   // Sonderfall (leere Zeichenkette f�r 1 und Primzahlen)
  var s = "= ";                                            // Anfang der Zeichenkette f�r Normalfall
  var o = false;                                           // Flag f�r Unterschied zur Schreibweise ohne Potenzen
  var f = 0;                                               // Variable f�r aktuellen Primfaktor
  for (var i=0; i<n; i++) {                                // F�r alle Indizes ...
    var ff = a[i];                                         // Faktor aus dem gegebenen Array
    if (ff != f) {                                         // Falls Faktor bisher nicht vorgekommen ...
      if (i > 0) s += " "+symbolMult+" ";                  // Multiplikationszeichen hinzuf�gen (au�er beim ersten Faktor)
      f = ff;                                              // Aktuellen Faktor �bernehmen
      s += f;                                              // Aktuellen Faktor zur Zeichenkette hinzuf�gen                                              
      var e = 0;                                           // Exponent zum aktuellen Faktor
      do {i++; ff = a[i]; e++;} while (ff == f);           // Index und Exponent hochz�hlen, bis ein anderer Faktor auftaucht
      i--;                                                 // Index f�r den letzten der gleichen Faktoren 
      if (e > 1) {                                         // Falls Exponent gr��er als 1 ...
        s += "<sup>"+e+"</sup>";                           // HTML f�r den Exponenten zur Zeichenkette hinzuf�gen 
        o = true;                                          // Flag f�r Unterschied zur Schreibweise ohne Potenzen setzen
        }
      }
    }
  return (o ? s : "");                                     // R�ckgabewert
  }
  
// Berechnung der Tabellen-Verschiebung nach Verwendung des Eingabefelds:
// Seiteneffekt offsetX, offsetY
// Die Zelle der aktuellen Zahl soll in der Mitte liegen, wenn dies ohne extreme Verschiebung m�glich ist.
  
function calcOffset () {
  offsetX = ((number-1)%10)*widthCell-(width-widthCell)/2; // Waagrechte Verschiebung (Pixel)
  offsetY = Math.floor((number-1)/10)*heightCell;          // Senkrechte Verschiebung (Pixel)
  offsetY -= (height-heightCell)/2;
  restrictOffset();                                        // Zu gro�e Verschiebung verhindern
  }
  
// Begrenzung der Tabellen-Verschiebung:
// Seiteneffekt offsetX, offsetY

function restrictOffset () {
  if (offsetX < -widthCell) offsetX = -widthCell;          // Verschiebung nach rechts begrenzen
  var max = 11*widthCell-width;                            // Maximum f�r offsetX
  if (offsetX > max) offsetX = max;                        // Verschiebung nach links begrenzen
  if (offsetY < 0) offsetY = 0;                            // Verschiebung nach unten begrenzen
  max = 1e11*heightCell-height;                            // Maximum f�r offsetY
  if (offsetY > max) offsetY = max;                        // Verschiebung nach oben begrenzen
  }
  
// Berechnung der waagrechten Koordinate der linken oberen Ecke einer Zelle:
// n ... Gegebene Zahl

function xCell (n) {
  var c = (n-1)%10;                                        // Index der Spalte (Z�hlung ab 0)
  return c*widthCell-offsetX;                              // R�ckgabewert
  }
  
// Berechnung der senkrechten Koordinate der linken oberen Ecke einer Zelle:
// n ... Gegebene Zahl

function yCell (n) {
  var r = Math.floor((n-1)/10);                            // Index der Zeile (Z�hlung ab 0)
  return r*heightCell-offsetY;                             // R�ckgabewert
  }
    
//-------------------------------------------------------------------------------------------------

// Ausgabe des sichtbaren Tabellenabschnitts:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz
  ctx.strokeStyle = "#000000";                             // Farbe f�r Rand einer Zelle (schwarz)
  ctx.lineWidth = 1;                                       // Liniendicke
  ctx.textAlign = "center";                                // Zentrierung innerhalb einer Zelle
  var min = number-dn;                                     // Sch�tzwert f�r die kleinste Zahl des sichtbaren Tabellenabschnitts
  var max = number+dn;                                     // Sch�tzwert f�r die gr��te Zahl des sichtbaren Tabellenabschnitts
  if (max > 1e12) max = 1e12;                              // Gr��te Zahl h�chstens 1 000 000 000 000
  for (var n=min; n<=max; n++) {                           // F�r alle Zahlen des sichtbaren Tabellenabschnitts ...                   
    var x = xCell(n), y = yCell(n);                        // Koordinaten der linken oberen Ecke der Zelle (Pixel)
    if (prime[n-min]) {                                    // Falls Primzahl ...
      ctx.fillStyle = colorPrime;                          // Hintergrundfarbe f�r Primzahlen
      ctx.fillRect(x,y,widthCell,heightCell);              // Hintergrund der Zelle ausf�llen
      }
    ctx.strokeRect(x,y,widthCell,heightCell);              // Rand der Zelle
    ctx.fillStyle = "#000000";                             // Schriftfarbe (schwarz)
    ctx.fillText(""+n,x+dx,y+dy);                          // Zahl in die Mitte der Zelle schreiben  
    }
  ctx.strokeStyle = colorNumber;                           // Farbe f�r Rahmen (aktuelle Zahl)
  ctx.lineWidth = 3;                                       // Liniendicke
  x = xCell(number); y = yCell(number);                    // Koordinaten der linken oberen Ecke der hervorgehobenen Zelle
  ctx.strokeRect(x,y,widthCell,heightCell);                // Rahmen zeichnen 
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen


