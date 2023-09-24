// Klasse RatVal (rationale Zahl)
// Attribute numerator, denominator
// 21.05.2020 - 01.07.2020

class RatVal {

// Konstruktor:
// n ... Zeichenkette Zähler (optional, Defaultwert "0")
// d ... Zeichenkette Nenner (optional, Defaultwert "1")
// Statt Zeichenketten sind wegen der automatischen Typumwandlung auch BigInt-Objekte möglich.

  constructor (n, d) {
    this.numerator = BigInt(n?n:"0");                      // Zähler (BigInt-Objekt)
    this.denominator = BigInt(d?d:"1");                    // Nenner (BigInt-Objekt)
    this.normal();                                         // Normalisierung (Kürzen, Nenner positiv)
    }
    
// Normalisierung: Bruch vollständig gekürzt, Nenner positiv
    
  normal () {
    var f = gcd(this.numerator,this.denominator);          // Größter gemeinsamer Teiler von Zähler und Nenner
    this.numerator = this.numerator/f;                     // Zähler durch ggT dividieren
    this.denominator = this.denominator/f;                 // Nenner durch ggT dividieren
    if (this.denominator < 0n) {                           // Falls Nenner negativ ...
      this.numerator = -this.numerator;                    // Vorzeichen Zähler umkehren
      this.denominator = -this.denominator;                // Vorzeichen Nenner umkehren
      }
    }
    
  } // Ende der Klasse RatVal
  
// Absolutbetrag eines BigInt-Objekts:
// n ... Gegebene Zahl (Typ BigInt)

function abs (n) {
  return (n<0n ? -n : n);                                  // Rückgabewert
  }
  
// Größter gemeinsamer Teiler von zwei BigInt-Objekten (euklidischer Algorithmus):
// n1, n2 ... Gegebene natürliche Zahlen

function gcd (n1, n2) {
  var a = n1, b = n2;                                      // Argumente übernehmen
  while (true) {                                           // Endlosschleife ...
    var c = a%b;                                           // Divisionsrest
    if (c == 0n) return b;                                 // Falls Rest gleich 0, Rückgabewert
    a = b; b = c;                                          // Operanden der nächsten Division
    }
  }
  
// Addition:
// q1, q2 ... Summanden (RatVal-Objekte)
  
function addRatVal (q1, q2) {
  if (q1 == undefined || q2 == undefined)                  // Falls mindestens ein Summand undefiniert ...
    return undefined;                                      // Ergebnis undefiniert
  var d = q1.denominator*q2.denominator;                   // Nenner
  var s1 = q1.numerator*q2.denominator;                    // Zähler 1. Summand
  var s2 = q2.numerator*q1.denominator;                    // Zähler 2. Summand
  var n = s1+s2;                                           // Zähler insgesamt
  return new RatVal(n,d);                                  // Summe (normalisiert) als Rückgabewert
  }
  
// Subtraktion:
// q1 ... Minuend (RatVal-Objekt)
// q2 ... Subtrahend (RatVal-Objekt)
  
function subRatVal (q1, q2) {
  if (q1 == undefined || q2 == undefined)                  // Falls Minuend oder Subtrahend undefiniert .. 
    return undefined;                                      // Ergebnis undefiniert
  var d = q1.denominator*q2.denominator;                   // Nenner 
  var s1 = q1.numerator*q2.denominator;                    // Zähler Minuend
  var s2 = q2.numerator*q1.denominator;                    // Zähler Subtrahend
  var n = s1-s2;                                           // Zähler insgesamt
  return new RatVal(n,d);                                  // Differenz (normalisiert) als Rückgabewert
  }
  
// Multiplikation:
// q1, q2 ... Faktoren (RatVal-Objekte)

function mulRatVal (q1, q2) {
  if (q1 == undefined || q2 == undefined)                  // Falls mindestens ein Faktor undefiniert ... 
    return undefined;                                      // Ergebnis undefiniert
  var n = q1.numerator*q2.numerator;                       // Zähler
  var d = q1.denominator*q2.denominator;                   // Nenner
  return new RatVal(n,d);                                  // Produkt (normalisiert) als Rückgabewert
  }
  
// Division:
// q1 ... Dividend (RatVal-Objekt)
// q2 ... Divisor (RatVal-Objekt)

function divRatVal (q1, q2) {
  if (q1 == undefined || q2 == undefined)                  // Falls Dividend oder Divisor undefiniert ...
    return undefined;                                      // Ergebnis undefiniert
  var n = q1.numerator*q2.denominator;                     // Zähler
  var d = q1.denominator*q2.numerator;                     // Nenner
  return new RatVal(n,d);                                  // Quotient (normalisiert) als Rückgabewert
  }
  
// Kehrwert:
// q ... Gegebene Zahl (RatVal-Objekt)

function recRatVal (q) {
  if (q == undefined) return undefined;                    // Falls Zahl undefiniert, Ergebnis undefiniert
  return new RatVal(q.denominator,q.numerator);            // Kehrwert (normalisiert) als Rückgabewert
  }
  
// Überprüfung der Ganzzahligkeit:

function isInteger (q) {
  return (q.numerator%q.denominator == 0n);                // Rückgabewert
  }
  
// Signum-Funktion:
// q ... Gegebene Zahl (RatVal-Objekt, normalisiert)

function signum (q) {
  if (q.numerator == 0n) return 0;                         // Rückgabewert, falls Zähler gleich 0
  return (q.numerator>0n ? 1 : -1);                        // Rückgabewert, falls Zähler ungleich 0
  }  
  
// Vergleich zweier Zahlen
// q1, q2 ... Gegebene Zahlen (RatVal-Objekte)
// Rückgabewert 0 für q1 = q2, -1 für q1 < q2, +1 für q1 > q2

function compare (q1, q2) {
  return (signum(subRatVal(q1,q2)));                       // Rückgabewert
  }
  
// Potenzierung:
// q1 ... Basis (RatVal-Objekt)
// q2 ... Exponent (RatVal-Objekt, ganzzahlig)

function powRatVal (q1, q2) {
  if (q1 == undefined || q2 == undefined)                  // Falls Basis oder Exponent undefiniert ... 
    return undefined;                                      // Ergebnis undefiniert
  var pos = true;                                          // Flag für positiven Exponenten
  var p = new RatVal("1");                                 // Variable für Produkt, Startwert 1
  var e = q2.numerator/q2.denominator;                     // Exponent als BigInt-Objekt
  if (e  < 0n) {                                           // Falls Exponent negativ ...
      pos = false;                                         // Flag für positiven Exponenten löschen 
      e = abs(e);                                          // Exponent durch Betrag ersetzen
      }
  while (e > 0n) {                                         // Solange e positiv ...
    p = mulRatVal(p,q1);                                   // Bisheriges Produkt mit Basis multiplizieren
    e = e-1n;                                              // e um 1 erniedrigen
    }
  if (!pos) p = recRatVal(p);                              // Falls Exponent negativ, Kehrwert bilden
  return p;                                                // Rückgabewert
  }
  
// Vorzeichenumkehr:
// q ... Gegebene Zahl (Typ RatVal)

function negateRatVal (q) {
  if (q == undefined) return undefined;                      // Falls Argument undefiniert, Ergebnis undefiniert
  return new RatVal(-q.numerator,q.denominator);             // Rückgabewert (Normalfall)
  }
  
// Ausgabe eines Bruchs (Zähler und Nenner gegeben):
// n ... Zähler (BigInt, positiv vorausgesetzt)
// d ... Nenner (BigInt, positiv vorausgesetzt)
// x ... Waagrechte Koordinate (Pixel)
// y ... Senkrechte Koordinate (Pixel)

function writeFrac2 (n, d, x, y) {
  var w1 = widthPix(n), w2 = widthPix(d);                  // Breite von Zähler und Nenner (Pixel)
  var w = Math.max(w1,w2);                                 // Breite des Bruchstrichs (Pixel)
  ctx.fillText(n,x+w-w1,y-7);                              // Zähler
  ctx.fillText(d,x+w-w2,y+7);                              // Nenner
  line(x,y-4,x+w,y-4);                                     // Bruchstrich
  }
  
// Ausgabe als Bruch (auch unecht):
// q ... Rationale Zahl (RatVal-Objekt, normalisiert)
// x ... Waagrechte Koordinate (Pixel)
// y ... Senkrechte Koordinate (Pixel)

function writeFrac (q, x, y) {
  if (!q) {                                                // Falls Bruch undefiniert ...
    ctx.fillText("?",x,y);                                 // Fragezeichen ausgeben 
    return;                                                // Abbrechen
    }  
  if (q.numerator < 0n) {                                  // Falls Bruch bzw. Zähler negativ ...
    ctx.fillText(symbolMinus,x,y);                         // Minuszeichen ausgeben
    x += widthPix(symbolMinus)+2;                          // Waagrechte Koordinate erhöhen
    }
  var n = abs(q.numerator), d = q.denominator;             // Betrag des Zählers, Nenner  
  if (d == 1n) ctx.fillText(n,x,y);                        // Entweder ganze Zahl ...
  else writeFrac2(n,d,x,y);                                // ... oder Bruch ausgeben
  }
  
// Ausgabe einer rationalen Zahl als Bruch oder gemischte Zahl:
// q ... Rationale Zahl (RatVal-Objekt, normalisiert)
// x ... Waagrechte Koordinate (Pixel)
// y ... Senkrechte Koordinate (Pixel)
 
function writeMix (q, x, y) {
  if (!q) {                                                // Falls Zahl undefiniert ...
    ctx.fillText("?",x,y);                                 // Fragezeichen ausgeben 
    return;                                                // Abbrechen
    } 
  if (q.numerator == 0n) {                                 // Falls Zahl gleich 0 ...
    ctx.fillText("0",x,y);                                 // Null ausgeben
    return;                                                // Abbrechen
    }      
  if (q.numerator < 0n) {                                  // Falls negative Zahl ...
    ctx.fillText(symbolMinus,x,y);                         // Minuszeichen ausgeben
    x += widthPix(symbolMinus)+2;                          // Waagrechte Koordinate erhöhen
    }
  var n = abs(q.numerator), d = q.denominator;             // Betrag des Zählers, Nenner
  var i = n/d;                                             // Ganzzahliger Anteil
  if (i > 0n) {                                            // Falls sinnvoll ... 
    ctx.fillText(i,x,y);                                   // Ganzzahligen Anteil ausgeben
    x += widthPix(i);                                      // Waagrechte Koordinate erhöhen
    }
  var r = n%d;                                             // Zähler des Bruchs
  if (r > 0n) writeFrac2(r,d,x,y);                         // Falls sinnvoll, Bruch ausgeben
  }

// Vorbereitende Zerlegung für Dezimalbruch-Schreibweise:
// q ... Gegebene rationale Zahl (RatVal-Objekt, normalisiert)
// Rückgabewert: Array von drei Zeichenketten; ganzzahliger Anteil (eventuell mit Minuszeichen), 
// normale Nachkommastellen (eventuell leere Zeichenkette), periodische Nachkommastellen (eventuell leere Zeichenkette)
  
function fragmentationDec (q) {
  if (q == undefined) return undefined;
  var a = new Array(3);                                    // Neues Array für drei Zeichenketten
  var s0 = (q.numerator < 0n ? symbolMinus : "");          // Zeichenkette für Ganze (eventuell mit Minuszeichen)
  var n = abs(q.numerator), d = abs(q.denominator);        // Beträge von Zähler und Nenner (Typ BigInt)  
  a[0] = s0+(n/d);                                         // Arrayelement mit Index 0                                            
  n = n%d;                                                 // Zähler des verbleibenden Bruchs  
  a[1] = a[2] = "";                                        // Weitere Arrayelemente
  if (n == 0n) return a;                                   // Falls ganze Zahl, abbrechen  
  var e2 = 0, e5 = 0;                                      // Exponenten der Faktoren 2 und 5 im Nenner, Startwerte 
  var h = d;                                               // Hilfsvariable h (Typ BigInt), zunächst gleich Nenner   
  while (h%2n == 0n) {                                     // Solange h durch 2 teilbar ...
    e2++; h = h/2n;                                        // Exponent erhöhen, h durch 2 dividieren
    }
  while (h%5n == 0n) {                                     // Solange h durch 5 teilbar ...
    e5++; h = h/5n;                                        // Exponent erhöhen, h durch 5 dividieren    
    }
  var e = Math.max(e2,e5);                                 // Maximum der beiden Exponenten    
  var s1 = "";                                             // Zeichenkette für normale Nachkommastellen   
  for (var i=0; i<e; i++) {                                // Für alle normalen Nachkommastellen ...
    n = n*10n;                                             // Zähler mit 10 multiplizieren
    s1 += n/d;                                             // Stelle hinzufügen
    n = n%d;                                               // Zähler aktualisieren
    }         
  a[1] = s1;                                               // Arrayelement mit Index 1
  if (n == 0n) return a;                                   // Falls endlicher Dezimalbruch, abbrechen  
  var s2 = "";                                             // Zeichenkette für Periode
  var lp = 0;                                              // Variable für Periodenlänge
  h = n;                                                   // Bisheriger Zähler
  do {                                                     // Wiederhole ...
    lp++;                                                  // Periodenlänge erhöhen
    if (lp > 1000) {s2 += "..."; break;}                   // Eventuell Nothalt
    n = n*10n;                                             // Zähler mit 10 multiplizieren
    s2 += n/d;                                             // Stelle hinzufügen
    n = n%d;                                               // Zähler aktualisieren                      
    }
  while (n != h);                                          // ... solange Zähler verschieden vom früheren Zähler
  a[2] = s2;                                               // Arrayelement mit Index 2
  return a;                                                // Rückgabewert
  }
  
// Hilfsroutine: Zeichenkette mit Linie darüber
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)

function overline (s, x, y) {
  var w = widthPix(s);                                     // Breite (Pixel)  
  ctx.fillText(s,x,y);                                     // Zeichenkette ausgeben
  line(x,y-11,x+w,y-11);                                   // Linie zeichnen
  }
    
// Ausgabe als Dezimalbruch:
// q ....... Gegebene rationale Zahl (RatVal-Objekt) oder undefined
// (x,y) ... Position (Pixel)
  
function writeDec (q, x, y) {
  if (q == undefined) {                                    // Falls Zahl undefiniert ... 
    ctx.fillText("?",x,y);                                 // Fragezeichen
    return;                                                // Abbrechen
    }
  var a = fragmentationDec(q);                             // Array der drei Teilzeichenketten
  ctx.fillText(a[0],x,y);                                  // Ganzzahliger Anteil (eventuell mit Minuszeichen)
  if (a[1]+a[2] == "") return;                             // Falls keine Nachkommastellen, abbrechen
  x += widthPix(a[0]);                                     // Waagrechte Koordinate erhöhen
  ctx.fillText(decimalSeparator,x,y);                      // Dezimaltrennzeichen (Komma oder Punkt)
  x += widthPix(decimalSeparator);                         // Waagrechte Koordinate erhöhen
  ctx.fillText(a[1],x,y);                                  // Normale Nachkommastellen
  x += widthPix(a[1]);                                     // Waagrechte Koordinate erhöhen
  overline(a[2],x,y);                                      // Periodische Nachkommastellen (mit Strich darüber)
  }
  