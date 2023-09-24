// Klasse RatVal (rationale Zahl)
// Attribute numerator, denominator
// 21.05.2020 - 01.07.2020

class RatVal {

// Konstruktor:
// n ... Zeichenkette Z�hler (optional, Defaultwert "0")
// d ... Zeichenkette Nenner (optional, Defaultwert "1")
// Statt Zeichenketten sind wegen der automatischen Typumwandlung auch BigInt-Objekte m�glich.

  constructor (n, d) {
    this.numerator = BigInt(n?n:"0");                      // Z�hler (BigInt-Objekt)
    this.denominator = BigInt(d?d:"1");                    // Nenner (BigInt-Objekt)
    this.normal();                                         // Normalisierung (K�rzen, Nenner positiv)
    }
    
// Normalisierung: Bruch vollst�ndig gek�rzt, Nenner positiv
    
  normal () {
    var f = gcd(this.numerator,this.denominator);          // Gr��ter gemeinsamer Teiler von Z�hler und Nenner
    this.numerator = this.numerator/f;                     // Z�hler durch ggT dividieren
    this.denominator = this.denominator/f;                 // Nenner durch ggT dividieren
    if (this.denominator < 0n) {                           // Falls Nenner negativ ...
      this.numerator = -this.numerator;                    // Vorzeichen Z�hler umkehren
      this.denominator = -this.denominator;                // Vorzeichen Nenner umkehren
      }
    }
    
  } // Ende der Klasse RatVal
  
// Absolutbetrag eines BigInt-Objekts:
// n ... Gegebene Zahl (Typ BigInt)

function abs (n) {
  return (n<0n ? -n : n);                                  // R�ckgabewert
  }
  
// Gr��ter gemeinsamer Teiler von zwei BigInt-Objekten (euklidischer Algorithmus):
// n1, n2 ... Gegebene nat�rliche Zahlen

function gcd (n1, n2) {
  var a = n1, b = n2;                                      // Argumente �bernehmen
  while (true) {                                           // Endlosschleife ...
    var c = a%b;                                           // Divisionsrest
    if (c == 0n) return b;                                 // Falls Rest gleich 0, R�ckgabewert
    a = b; b = c;                                          // Operanden der n�chsten Division
    }
  }
  
// Addition:
// q1, q2 ... Summanden (RatVal-Objekte)
  
function addRatVal (q1, q2) {
  if (q1 == undefined || q2 == undefined)                  // Falls mindestens ein Summand undefiniert ...
    return undefined;                                      // Ergebnis undefiniert
  var d = q1.denominator*q2.denominator;                   // Nenner
  var s1 = q1.numerator*q2.denominator;                    // Z�hler 1. Summand
  var s2 = q2.numerator*q1.denominator;                    // Z�hler 2. Summand
  var n = s1+s2;                                           // Z�hler insgesamt
  return new RatVal(n,d);                                  // Summe (normalisiert) als R�ckgabewert
  }
  
// Subtraktion:
// q1 ... Minuend (RatVal-Objekt)
// q2 ... Subtrahend (RatVal-Objekt)
  
function subRatVal (q1, q2) {
  if (q1 == undefined || q2 == undefined)                  // Falls Minuend oder Subtrahend undefiniert .. 
    return undefined;                                      // Ergebnis undefiniert
  var d = q1.denominator*q2.denominator;                   // Nenner 
  var s1 = q1.numerator*q2.denominator;                    // Z�hler Minuend
  var s2 = q2.numerator*q1.denominator;                    // Z�hler Subtrahend
  var n = s1-s2;                                           // Z�hler insgesamt
  return new RatVal(n,d);                                  // Differenz (normalisiert) als R�ckgabewert
  }
  
// Multiplikation:
// q1, q2 ... Faktoren (RatVal-Objekte)

function mulRatVal (q1, q2) {
  if (q1 == undefined || q2 == undefined)                  // Falls mindestens ein Faktor undefiniert ... 
    return undefined;                                      // Ergebnis undefiniert
  var n = q1.numerator*q2.numerator;                       // Z�hler
  var d = q1.denominator*q2.denominator;                   // Nenner
  return new RatVal(n,d);                                  // Produkt (normalisiert) als R�ckgabewert
  }
  
// Division:
// q1 ... Dividend (RatVal-Objekt)
// q2 ... Divisor (RatVal-Objekt)

function divRatVal (q1, q2) {
  if (q1 == undefined || q2 == undefined)                  // Falls Dividend oder Divisor undefiniert ...
    return undefined;                                      // Ergebnis undefiniert
  var n = q1.numerator*q2.denominator;                     // Z�hler
  var d = q1.denominator*q2.numerator;                     // Nenner
  return new RatVal(n,d);                                  // Quotient (normalisiert) als R�ckgabewert
  }
  
// Kehrwert:
// q ... Gegebene Zahl (RatVal-Objekt)

function recRatVal (q) {
  if (q == undefined) return undefined;                    // Falls Zahl undefiniert, Ergebnis undefiniert
  return new RatVal(q.denominator,q.numerator);            // Kehrwert (normalisiert) als R�ckgabewert
  }
  
// �berpr�fung der Ganzzahligkeit:

function isInteger (q) {
  return (q.numerator%q.denominator == 0n);                // R�ckgabewert
  }
  
// Signum-Funktion:
// q ... Gegebene Zahl (RatVal-Objekt, normalisiert)

function signum (q) {
  if (q.numerator == 0n) return 0;                         // R�ckgabewert, falls Z�hler gleich 0
  return (q.numerator>0n ? 1 : -1);                        // R�ckgabewert, falls Z�hler ungleich 0
  }  
  
// Vergleich zweier Zahlen
// q1, q2 ... Gegebene Zahlen (RatVal-Objekte)
// R�ckgabewert 0 f�r q1 = q2, -1 f�r q1 < q2, +1 f�r q1 > q2

function compare (q1, q2) {
  return (signum(subRatVal(q1,q2)));                       // R�ckgabewert
  }
  
// Potenzierung:
// q1 ... Basis (RatVal-Objekt)
// q2 ... Exponent (RatVal-Objekt, ganzzahlig)

function powRatVal (q1, q2) {
  if (q1 == undefined || q2 == undefined)                  // Falls Basis oder Exponent undefiniert ... 
    return undefined;                                      // Ergebnis undefiniert
  var pos = true;                                          // Flag f�r positiven Exponenten
  var p = new RatVal("1");                                 // Variable f�r Produkt, Startwert 1
  var e = q2.numerator/q2.denominator;                     // Exponent als BigInt-Objekt
  if (e  < 0n) {                                           // Falls Exponent negativ ...
      pos = false;                                         // Flag f�r positiven Exponenten l�schen 
      e = abs(e);                                          // Exponent durch Betrag ersetzen
      }
  while (e > 0n) {                                         // Solange e positiv ...
    p = mulRatVal(p,q1);                                   // Bisheriges Produkt mit Basis multiplizieren
    e = e-1n;                                              // e um 1 erniedrigen
    }
  if (!pos) p = recRatVal(p);                              // Falls Exponent negativ, Kehrwert bilden
  return p;                                                // R�ckgabewert
  }
  
// Vorzeichenumkehr:
// q ... Gegebene Zahl (Typ RatVal)

function negateRatVal (q) {
  if (q == undefined) return undefined;                      // Falls Argument undefiniert, Ergebnis undefiniert
  return new RatVal(-q.numerator,q.denominator);             // R�ckgabewert (Normalfall)
  }
  
// Ausgabe eines Bruchs (Z�hler und Nenner gegeben):
// n ... Z�hler (BigInt, positiv vorausgesetzt)
// d ... Nenner (BigInt, positiv vorausgesetzt)
// x ... Waagrechte Koordinate (Pixel)
// y ... Senkrechte Koordinate (Pixel)

function writeFrac2 (n, d, x, y) {
  var w1 = widthPix(n), w2 = widthPix(d);                  // Breite von Z�hler und Nenner (Pixel)
  var w = Math.max(w1,w2);                                 // Breite des Bruchstrichs (Pixel)
  ctx.fillText(n,x+w-w1,y-7);                              // Z�hler
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
  if (q.numerator < 0n) {                                  // Falls Bruch bzw. Z�hler negativ ...
    ctx.fillText(symbolMinus,x,y);                         // Minuszeichen ausgeben
    x += widthPix(symbolMinus)+2;                          // Waagrechte Koordinate erh�hen
    }
  var n = abs(q.numerator), d = q.denominator;             // Betrag des Z�hlers, Nenner  
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
    x += widthPix(symbolMinus)+2;                          // Waagrechte Koordinate erh�hen
    }
  var n = abs(q.numerator), d = q.denominator;             // Betrag des Z�hlers, Nenner
  var i = n/d;                                             // Ganzzahliger Anteil
  if (i > 0n) {                                            // Falls sinnvoll ... 
    ctx.fillText(i,x,y);                                   // Ganzzahligen Anteil ausgeben
    x += widthPix(i);                                      // Waagrechte Koordinate erh�hen
    }
  var r = n%d;                                             // Z�hler des Bruchs
  if (r > 0n) writeFrac2(r,d,x,y);                         // Falls sinnvoll, Bruch ausgeben
  }

// Vorbereitende Zerlegung f�r Dezimalbruch-Schreibweise:
// q ... Gegebene rationale Zahl (RatVal-Objekt, normalisiert)
// R�ckgabewert: Array von drei Zeichenketten; ganzzahliger Anteil (eventuell mit Minuszeichen), 
// normale Nachkommastellen (eventuell leere Zeichenkette), periodische Nachkommastellen (eventuell leere Zeichenkette)
  
function fragmentationDec (q) {
  if (q == undefined) return undefined;
  var a = new Array(3);                                    // Neues Array f�r drei Zeichenketten
  var s0 = (q.numerator < 0n ? symbolMinus : "");          // Zeichenkette f�r Ganze (eventuell mit Minuszeichen)
  var n = abs(q.numerator), d = abs(q.denominator);        // Betr�ge von Z�hler und Nenner (Typ BigInt)  
  a[0] = s0+(n/d);                                         // Arrayelement mit Index 0                                            
  n = n%d;                                                 // Z�hler des verbleibenden Bruchs  
  a[1] = a[2] = "";                                        // Weitere Arrayelemente
  if (n == 0n) return a;                                   // Falls ganze Zahl, abbrechen  
  var e2 = 0, e5 = 0;                                      // Exponenten der Faktoren 2 und 5 im Nenner, Startwerte 
  var h = d;                                               // Hilfsvariable h (Typ BigInt), zun�chst gleich Nenner   
  while (h%2n == 0n) {                                     // Solange h durch 2 teilbar ...
    e2++; h = h/2n;                                        // Exponent erh�hen, h durch 2 dividieren
    }
  while (h%5n == 0n) {                                     // Solange h durch 5 teilbar ...
    e5++; h = h/5n;                                        // Exponent erh�hen, h durch 5 dividieren    
    }
  var e = Math.max(e2,e5);                                 // Maximum der beiden Exponenten    
  var s1 = "";                                             // Zeichenkette f�r normale Nachkommastellen   
  for (var i=0; i<e; i++) {                                // F�r alle normalen Nachkommastellen ...
    n = n*10n;                                             // Z�hler mit 10 multiplizieren
    s1 += n/d;                                             // Stelle hinzuf�gen
    n = n%d;                                               // Z�hler aktualisieren
    }         
  a[1] = s1;                                               // Arrayelement mit Index 1
  if (n == 0n) return a;                                   // Falls endlicher Dezimalbruch, abbrechen  
  var s2 = "";                                             // Zeichenkette f�r Periode
  var lp = 0;                                              // Variable f�r Periodenl�nge
  h = n;                                                   // Bisheriger Z�hler
  do {                                                     // Wiederhole ...
    lp++;                                                  // Periodenl�nge erh�hen
    if (lp > 1000) {s2 += "..."; break;}                   // Eventuell Nothalt
    n = n*10n;                                             // Z�hler mit 10 multiplizieren
    s2 += n/d;                                             // Stelle hinzuf�gen
    n = n%d;                                               // Z�hler aktualisieren                      
    }
  while (n != h);                                          // ... solange Z�hler verschieden vom fr�heren Z�hler
  a[2] = s2;                                               // Arrayelement mit Index 2
  return a;                                                // R�ckgabewert
  }
  
// Hilfsroutine: Zeichenkette mit Linie dar�ber
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
  x += widthPix(a[0]);                                     // Waagrechte Koordinate erh�hen
  ctx.fillText(decimalSeparator,x,y);                      // Dezimaltrennzeichen (Komma oder Punkt)
  x += widthPix(decimalSeparator);                         // Waagrechte Koordinate erh�hen
  ctx.fillText(a[1],x,y);                                  // Normale Nachkommastellen
  x += widthPix(a[1]);                                     // Waagrechte Koordinate erh�hen
  overline(a[2],x,y);                                      // Periodische Nachkommastellen (mit Strich dar�ber)
  }
  