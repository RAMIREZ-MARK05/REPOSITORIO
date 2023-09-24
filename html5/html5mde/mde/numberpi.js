// Pi-Berechnung (N�herung durch ein- und umbeschriebene Vielecke)
// Java-Applet (22.11.2002) umgewandelt
// 31.01.2021 - 03.02.2021

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel numberpi_de.js) abgespeichert.

// Farben:

var colorBackground = "#ffff00";                           // Hintergrundfarbe
var colorInside = "#ff0000";                               // Farbe f�r einbeschriebenes Vieleck
var colorOutside = "#0000ff";                              // Farbe f�r umbeschriebenes Vieleck
var colorCircle = "#00ff00";                               // Farbe f�r Kreisinneres

// Konstanten:

var R = 120;                                               // Kreisradius (Pixel)
var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var DIG = 50;                                              // Zahl der Nachkommastellen (Endergebnisse)
var DIG2 = 200;                                            // Zahl der Nachkommastellen (Zwischenergebnisse) 

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var opN;                                                   // Ausgabefeld (Eckenzahl)
var bu1, bu2, bu3;                                         // Schaltkn�pfe
var rb1, rb2, rb3;                                         // Radiobuttons
var x0, y0;                                                // Kreismittelpunkt (Pixel)
var n;                                                     // Eckenzahl (Typ BigInt)
var s1, s2;                                                // Seitenl�nge (ein- und umbeschriebenes Vieleck, Typ BigDec)
var u1, u2;                                                // Umfang (ein- und umbeschriebenes Vieleck, Typ BigDec)
var a1, a2;                                                // Fl�cheninhalt (ein- und umbeschriebenes Vieleck, Typ BigDec)

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
  x0 = width/2; y0 = (height-100)/2;                       // Kreismittelpunkt (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  getElement("lb0",text01);                                // Erkl�render Text (Eckenzahl)
  opN = getElement("n");                                   // Ausgabefeld (Eckenzahl)
  opN.readOnly = true;                                     // Keine Eingabe m�glich
  bu1 = getElement("bu1",text02);                          // Schaltknopf (Viereck)
  bu2 = getElement("bu2",text03);                          // Schaltknopf (Sechseck)
  bu3 = getElement("bu3",text04);                          // Schaltknopf (Eckenzahl verdoppeln)
  rb1 = getElement("rb1");                                 // Radiobutton (Seitenl�nge)
  rb1.checked = true;                                      // Radiobutton zun�chst ausgew�hlt
  getElement("lb1",text05);                                // Erkl�render Text (Seitenl�nge)
  rb2 = getElement("rb2");                                 // Radiobutton (Umfang)
  getElement("lb2",text06);                                // Erkl�render Text (Umfang)
  rb3 = getElement("rb3");                                 // Radiobutton (Fl�cheninhalt)
  getElement("lb3",text07);                                // Erkl�render Text (Fl�cheninhalt)
  getElement("author",author);                             // Autor
  getElement("translator",translator);                     // �bersetzer
  
  reaction6();                                             // Start mit Eckenzahl 6
  
  bu1.onclick = reaction4;                                 // Reaktion auf Schaltknopf (Viereck)
  bu2.onclick = reaction6;                                 // Reaktion auf Schaltknopf (Sechseck)
  bu3.onclick = reactionDouble;                            // Reaktion auf Schaltknopf (Eckenzahl verdoppeln)
  rb1.onclick = paint;                                     // Reaktion auf Radiobutton (Seitenl�nge)
  rb2.onclick = paint;                                     // Reaktion auf Radiobutton (Umfang)
  rb3.onclick = paint;                                     // Reaktion auf Radiobutton (Fl�cheninhalt)
    
  } // Ende der Methode start
  
// Hilfsroutine: Rechnen, Eckenzahl ausgeben, neu zeichnen
// Seiteneffekt s2, u1, u2, a1, a2
  
function reaction () {
  calculation();                                           // Berechnungen                            
  opN.value = ""+n;                                        // Eckenzahl ausgeben
  paint();                                                 // Neu zeichnen
  }
  
// Reaktion auf Schaltknopf (Eckenzahl 4):
// Seiteneffekt n, s1, s2, u1, u2, a1, a2
  
function reaction4 () {
  n = 4n;                                                  // Eckenzahl 4
  bu3.disabled = false;                                    // Schaltknopf f�r Verdopplung aktiviert
  s1 = new BigDec("2");                                    // Zahl 2 als BigDec-Objekt
  s1 = s1.sqrt(DIG2);                                      // Seitenl�nge Wurzel(2) f�r einbeschriebenes Vieleck
  reaction();                                              // Eckenzahl ausgeben, rechnen, neu zeichnen
  }
  
// Reaktion auf Schaltknopf (Eckenzahl 6):
// Seiteneffekt n, s1, s2, u1, u2, a1, a2

function reaction6 () {
  n = 6n;                                                  // Eckenzahl 6
  bu3.disabled = false;                                    // Schaltknopf f�r Verdopplung aktiviert
  s1 = new BigDec("1");                                    // Seitenl�nge 1 f�r einbeschriebenes Vieleck
  reaction();                                              // Eckenzahl ausgeben, rechnen, neu zeichnen
  }
  
// Reaktion auf Schaltknopf (Eckenzahl verdoppeln):
// Seiteneffekt n, s1, s2, u1, u2, a1, a2
// Verwendete Formel: s1' = Wurzel (2 - Wurzel (4 - s1^2))
  
function reactionDouble () {
  n = n*2n;                                                // Eckenzahl verdoppeln
  if (ready()) bu3.disabled = true;                        // Falls Genauigkeit ausreichend, Schaltknopf deaktivieren
  var big2 = new BigDec("2"), big4 = new BigDec("4");      // Zahlen 2 und 4 als BigDec-Objekte
  var h = big4.sub(s1.mul(s1));                            // Zwischenergebnis: 4 - s1^2
  h.round(DIG2);                                           // Runden
  h = h.sqrt(DIG2);                                        // Zwischenergebnis: Wurzel(4 - s1^2)
  h = big2.sub(h);                                         // Zwischenergebnis: 2 - Wurzel(4 - s1^2)
  s1 = h.sqrt(DIG2);                                       // Neue Seitenl�nge (eingeschriebenes Vieleck)
  reaction();                                              // Eckenzahl ausgeben, rechnen, neu zeichnen
  }
  
//-------------------------------------------------------------------------------------------------

// Berechnungen (auf Grundlage von n und s1):
// Seiteneffekt s2, u1, u2, a1, a2

function calculation () {
  var big2 = new BigDec("2");                              // Zahl 2 als BigDec-Objekt
  var h = s1.div(big2,DIG2);                               // Zwischenergebnis: s1/2
  h = h.mul(h);                                            // Zwischenergebnis: (s1/2)^2
  h.round(DIG2);                                           // Runden
  h = (new BigDec("1")).sub(h);                            // Zwischenergebnis: 1 - (s1/2)^2
  h = h.sqrt(DIG2);                                        // Zwischenergebnis: Wurzel(1-(s1/2)^2)
  s2 = s1.div(h,DIG2);                                     // Seitenl�nge des umbeschriebenen Vielecks          
  var decN = new BigDec(""+n);                             // Zahl n als BigDec-Objekt
  u1 = decN.mul(s1); u1.round(DIG2);                       // Umfang des einbeschriebenen Vielecks
  u2 = decN.mul(s2); u2.round(DIG2);                       // Umfang des umbeschriebenen Vielecks
  a1 = u1.mul(h); a1.round(DIG2);                          // Zwischenergebnis: u1*h
  a1 = a1.div(big2,DIG2);                                  // Fl�cheninhalt des einbeschriebenen Vielecks
  a2 = u2.div(big2,DIG2);                                  // Fl�cheninhalt des umbeschriebenen Vielecks
  }
  
// �berpr�fung, ob die gew�nschte Genauigkeit erreicht ist:
  
function ready () {
  var du = u2.sub(u1);                                     // Differenz Umfang
  du.round(DIG);                                           // Runden
  return (du.num*power10(du.exp) < 1n);                    // R�ckgabewert
  }
  
// Zeichenkette f�r gerundeten Wert einer BigDec-Zahl:

function stringBigDec (n) {
  var num = n.num, exp = n.exp;                            // Ganze Zahl und Zehnerexponent
  if (exp < DIG) {                                         // Falls Zehnerexponent zu klein ...
    num = num*power10(DIG-exp);                            // Ganze Zahl mit Zehnerpotenz multiplizieren
    exp = DIG;                                             // Zehnerexponent anpassen 
    }
  // Ab hier kann exp >= DIG vorausgesetzt werden.
  var p10 = power10(exp-DIG);                              // Zehnerpotenz (Typ BigInt)
  var q = num/p10;                                         // Quotient (Typ BigInt)
  var r = num%p10;                                         // Rest (Typ BigInt)
  if (2n*r >= p10) q = q+1n;                               // Gegebenenfalls aufrunden
  var s = ""+q;                                            // Zeichenkette f�r Quotient q
  while (s.length < DIG) s = "0"+s;                        // Gegebenenfalls Nullen am Anfang erg�nzen
  var len = s.length;                                      // L�nge der Zeichenkette
  var s1 = s.substring(0,len-DIG);                         // Zeichenkette der Vorkommastellen
  if (s1 == "") s1 = "0";                                  // Falls leere Zeichenkette, Null erg�nzen
  var s2 = s.substring(len-DIG);                           // Zeichenkette f�r Nachkommastellen
  return s1+decimalSeparator+s2;                           // R�ckgabewert
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad:
// c ... Linienfarbe (optional, Defaultwert schwarz)

function newPath(c) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (c ? c : "#000000");                   // Linienfarbe
  ctx.lineWidth = 1;                                       // Liniendicke
  }
  
// Kreis:

function circle () {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x0,y0,R,0,2*Math.PI,true);                       // Kreis vorbereiten
  if (rb3.checked && n <= 100n) {                          // Falls ausgef�llter Kreis sinnvoll ...
    ctx.fillStyle = colorCircle;                           // F�llfarbe
    ctx.fill();                                            // Kreis ausf�llen
    }
  ctx.stroke();                                            // Kreisrand (schwarz)
  }
  
// Regelm��iges Vieleck:
// r ... Umkreisradius (Pixel)
// c ... Farbe

function polygon (r, c) {
  newPath(rb3.checked ? "#000000" : c);                    // Neuer Grafikpfad
  if (n <= 100n) {                                         // Falls Eckenzahl h�chstens 100 ...
    var nn = Number(""+n);                                 // Eckenzahl in Typ Number umwandeln
    var dw = 2*Math.PI/nn;                                 // Schrittweite Winkel (Bogenma�)
    ctx.moveTo(x0,y0-r);                                   // Anfangspunkt (oben)
    for (var i=1; i<=nn; i++) {                            // F�r alle Ecken-Indizes ...
      var w = i*dw;                                        // Winkel (Bogenma�)
      ctx.lineTo(x0-r*Math.sin(w),y0-r*Math.cos(w));       // Linie zum Grafikpfad hinzuf�gen
      }
    }
  else ctx.arc(x0,y0,r,0,2*Math.PI,true);                  // Falls gro�e Eckenzahl, Kreis vorbereiten
  if (rb3.checked && (n <= 100n || r == R)) {              // Falls ausgef�lltes Vieleck sinnvoll ...
    ctx.fillStyle = c;                                     // F�llfarbe
    ctx.fill();                                            // Vieleck bzw. Kreis ausf�llen
    }
  ctx.stroke();                                            // Rand des Vielecks (schwarz)
  }
  
// Ausgabe einer BigDec-Zahl:
// b1, b2, b3 ... Alternativen f�r auszugebende Zahl
// y ............ Senkrechte Bildschirmkoordinate (Pixel)

function writeBigDec (b1, b2, b3, y) {
  var b;                                                   // Variable f�r Zahl
  if (rb1.checked) b = b1;                                 // Falls Radiobutton rb1 ausgew�hlt, Zahl b1
  if (rb2.checked) b = b2;                                 // Falls Radiobutton rb2 ausgew�hlt, Zahl b2
  if (rb3.checked) b = b3;                                 // Falls Radiobutton rb3 ausgew�hlt, Zahl b3
  var s = stringBigDec(b);                                 // Zeichenkette f�r die Zahl
  s += (rb3.checked ? " r\u00B2" : " r");                  // Leerzeichen und "Einheit" hinzuf�gen
  ctx.fillText(s,20,y);                                    // Ausgabe
  }
          
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  if (n <= 100n) {                                         // Falls Eckenzahl h�chstens 100 ...
    var nn = Number(""+n);                                 // Eckenzahl in Typ Number umwandeln
    var r = R/Math.cos(Math.PI/nn);                        // Umkreisradius
    polygon(r,colorOutside);                               // Umbeschriebenes Vieleck
    }  
  circle();                                                // Kreis
  polygon(R,colorInside);                                  // Einbeschriebenes Vieleck
  ctx.font = FONT;                                         // Zeichensatz
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  var t1, t2;                                              // Variable f�r erkl�rende Texte
  if (rb1.checked) {t1 = text11; t2 = text12;}             // Entweder Texte f�r Seitenl�nge ...
  else if (rb2.checked) {t1 = text13; t2 = text14;}        // ... oder Texte f�r Umfang ...
  else {t1 = text15; t2 = text16;}                         // ... oder Texte f�r Fl�cheninhalt
  ctx.fillStyle = colorInside;                             // Farbe f�r einbeschriebenes Vieleck
  ctx.fillText(t1,20,height-90);                           // Text f�r einbeschriebenes Vieleck
  ctx.fillStyle = colorOutside;                            // Farbe f�r umbeschriebenes Vieleck
  ctx.fillText(t2,20,height-40);                           // Text f�r umbeschriebenes Vieleck
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  writeBigDec(s1,u1,a1,height-70);                         // Zahlenwert f�r einbeschriebenes Vieleck
  writeBigDec(s2,u2,a2,height-20);                         // Zahlenwert f�r umbeschriebenes Vieleck
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen

//-------------------------------------------------------------------------------------------------

// Hilfsroutine: Zehnerpotenz f�r BigInt-Zahlen
// e ... Exponent (darf nicht negativ sein!)

function power10 (e) {
  return 10n**BigInt(e);                                   // R�ckgabewert
  }
  
// Hilfsroutine: Umwandlung einer Zeichenkette in eine BigInt-Zahl
// Sinnlose Zeichenketten f�hren zum Ergebnis 0, ebenso Zeichenketten f�r negative Zahlen.
// s ... Zeichenkette

function toBigInt (s) {
  try {var n = BigInt(s);}                                 // Versuch: Umwandlung in BigInt
  catch(ex) {n = 0n;}                                      // Ausnahmebehandlung
  return (n>=0n ? n : 0n);                                 // R�ckgabewert (nicht negativ)
  }
  
// Klasse BigDec (nicht-negativer Dezimalbruch):

class BigDec {

  // Konstruktor:
  // Die Attribute num (vom Typ BigInt) und exp werden so festgelegt, dass die dargestellte Zahl gleich
  // num / (10 hoch exp) ist.
  // s ... Zeichenkette
  // Bei einer sinnlosen Zeichenkette s f�hrt der Konstruktoraufruf zu einer Exception.
  
  constructor (s) {
    s = s.replace(decimalSeparator,".");                   // Eventuell Komma durch Punkt ersetzen
    var i = s.indexOf(".");                                // Index des Dezimaltrennzeichens oder -1
    if (i >= 0) {                                          // Falls Dezimaltrennzeichen vorhanden ...
      s = s.substring(0,i)+s.substring(i+1);               // Ziffernfolge ohne Dezimaltrennzeichen
      this.num = toBigInt(s);                              // Ganze Zahl
      this.exp = s.length-i;                               // Zehnerexponent
      if (this.num == 0n && this.exp > 0) this.exp = 0;    // Zehnerexponent 0 f�r Zahl 0
      }
    else {                                                 // Falls kein Dezimaltrennzeichen ...
      this.num = toBigInt(s);                              // Ganze Zahl
      this.exp = 0;                                        // Zehnerexponent
      }
    }
    
  // Umwandlung in eine Zeichenkette:
    
  toString () {
    var n = ""+this.num;                                   // Zeichenkette f�r ganze Zahl num
    var len = n.length;                                    // L�nge der Zeichenkette
    var e = this.exp;                                      // Zehnerexponent
    if (e == 0) return n;                                  // R�ckgabewert, falls kein Dezimaltrennzeichen
    for (var i=len; i<e; i++) n = "0"+n;                   // Falls n�tig, am Anfang Nullen erg�nzen
    var s1 = (len <= e ? "0" : n.substring(0,len-e));      // Zeichenkette vor dem Dezimaltrennzeichen
    var s2 = n.substring(len-e);                           // Zeichenkette nach dem Dezimaltrennzeichen      
    return s1+decimalSeparator+s2;                         // R�ckgabewert
    }
    
  // Differenz des gegebenen Dezimalbruchs und eines weiteren Dezimalbruchs:
  // n ... Weiterer Dezimalbruch (Subtrahend, Typ BigDec)
    
  sub (n) {
    var eMax = Math.max(this.exp,n.exp);                   // Zehnerexponent bzw. Zahl der Nachkommastellen
    var r1 = this.num*power10(eMax-this.exp);              // Erweitern, Minuend
    var r2 = n.num*power10(eMax-n.exp);                    // Erweitern, Subtrahend
    var r = new BigDec("0");                               // Neues BigDec-Objekt
    r.num = r1-r2;                                         // Attribut num (ganze Zahl)
    r.exp = eMax;                                          // Attribut exp (Zehnerexponent bzw. Zahl der Nachkommastellen)
    return r;                                              // R�ckgabewert
    }
    
  // Produkt des gegebenen Dezimalbruchs und eines weiteren Dezimalbruchs:
  // n ... Weiterer Dezimalbruch (2. Faktor, Typ BigDec)
    
  mul (n) {
    var r = new BigDec("0");                               // Neues BigDec-Objekt
    r.num = this.num*n.num;                                // Attribut num (ganze Zahl)
    r.exp = this.exp+n.exp;                                // Attribut exp (Zehnerexponent bzw. Zahl der Nachkommastellen)
    return r;                                              // R�ckgabewert
    }
    
  // Quotient des gegebenen Dezimalbruchs und eines weiteren Dezimalbruchs:
  // n ...... Weiterer Dezimalbruch (Divisor, Typ BigDec)
  // eMin ... Mindestzahl der Nachkommastellen im Ergebnis
    
  div (n, eMin) {
    var r = new BigDec("0");                               // Neues BigDec-Objekt
    var e = eMin+n.exp-this.exp;                           // Zehnerexponent
    r.num = power10(e<0?0:e)*this.num/n.num;               // Attribut num (ganze Zahl)
    r.exp = (e<0?eMin-e:eMin);                             // Attribut exp (Zehnerexponent bzw. Zahl der Nachkommastellen)
    return r;                                              // R�ckgabewert
    }
    
  // Quadratwurzel des gegebenen Dezimalbruchs:
  // eMin ... Mindestzahl der Nachkommastellen im Ergebnis
    
  sqrt (eMin) {
    if (this.num < 0n) return undefined;                   // Wurzel aus negativer Zahl undefiniert
    if (this.exp < 2*eMin) {                               // Falls zu wenige Nachkommastellen ...
      var d = 2*eMin-this.exp;                             // Differenz
      this.num = this.num*power10(d);                      // Am Ende Nullen hinzuf�gen
      this.exp = 2*eMin;                                   // Zehnerexponent anpassen
      }
    if (this.exp%2 == 1) {                                 // Falls Zahl der Nachkommastellen ungerade ...
      this.num = this.num*10n;                             // Am Ende eine Null hinzuf�gen
      this.exp = this.exp+1;                               // Zehnerexponent anpassen
      eMin++;                                              // Mindestzahl der Nachkommastellen um 1 h�her
      }
    var a = 0n;                                            // Startwert f�r untere Intervallgrenze
    var b = 1n;                                            // Variable f�r obere Intervallgrenze
    while (b < power10(this.exp)) b = b*2n;                // Startwert f�r obere Intervallgrenze (Zweierpotenz)
    while (b-a > 1n) {                                     // Solange Genauigkeit noch nicht ausreichend ...
      var x = (a+b)/2n;                                    // Mitte des Intervalls
      if (x*x >= this.num) b = x;                          // Entweder linke H�lfte ...
      else a = x;                                          // ... oder rechte H�lfte des bisherigen Intervalls
      }
    var d0 = x*x-this.num;                                 // Fehler f�r Quadrat von x
    if (d0 < 0n) d0 = -d0;                                 // Betrag des Fehlers
    var d1 = (x+1n)*(x+1n)-this.num;                       // Fehler f�r Quadrat von x+1
    if (d1 < 0n) d1 = -d1;                                 // Betrag des Fehlers
    if (d1 < d0) x = x+1n;                                 // Falls Fehler f�r x+1 kleiner, x anpassen
    var r = new BigDec("0");                               // Neues BigDec-Objekt
    r.num = x; r.exp = eMin;                               // Attributwerte                            
    return r;                                              // R�ckgabewert
    }
    
  // Runden des gegebenen Dezimalbruchs:
  // d ... Gew�nschte Zahl der Nachkommastellen
    
  round (d) {
    var e = this.exp-d;                                    // Hilfsgr��e
    if (e > 0) {                                           // Falls �berz�hlige Nachkommastellen ...
      var p = power10(e);                                  // Zehnerpotenz
      var q = this.num/p, r = this.num%p;                  // Quotient und Rest
      if (r*2n >= p) q = q+1n;                             // Bei Aufrundung Quotient um 1 erh�hen
      this.num = q;                                        // Attribut num (ganze Zahl)
      this.exp = this.exp-e;                               // Attribut exp (Zehnerexponent bzw. Zahl der Nachkommastellen)
      }
    if (e <= 0) {                                          // Falls keine �berz�hligen Nachkommastellen ...
      this.num = this.num*power10(-e);                     // Eventuell zus�tzliche Nullen am Ende
      this.exp = this.exp-e;                               // Zehnerexponent anpassen
      }
    }
    
  } // Ende der Klasse BigDec

