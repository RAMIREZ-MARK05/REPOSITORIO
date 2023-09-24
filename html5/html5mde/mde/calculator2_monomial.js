// Klasse Monomial (Monom mit Variablen a bis z, ganzzahliger Koeffizient)
// Der Koeffizient wird als BigInt-Objekt mit dem Bezeichner coeff gespeichert. Nullmonome (mit coeff == 0n) sind erlaubt. 
// Für die Exponenten der vorkommenden Variablen wird ein Array mit dem Bezeichner expo angelegt; dieses Array
// enthält normale, nicht negative Zahlen (keine BigInt-Objekte!).
// 01.07.2020 - 16.08.2020

class Monomial {

// Konstruktor für ein Monom mit höchstens einer Variablen:
// c ... Zeichenkette für Koeffizient (ganzzahlig, Defaultwert 1)
// v ... Zeichenkette für Variable ('a' bis 'z', optional)
// e ... Zeichenkette für Exponent (natürliche Zahl oder 0, optinal, Defaultwert 1)

  constructor (c, v, e) {
    this.coeff = (c!=undefined ? BigInt(c) : 1n);          // Koeffizient übernehmen oder Koeffizient 1
    var n = variables.length;                              // Zahl der vorkommenden Variablen (höchstens 26)
    this.expo = new Array(n);                              // Neues Array für Exponenten
    for (var i=0; i<n; i++) this.expo[i] = 0;              // Exponenten zunächst gleich 0
    if (v == undefined) return;                            // Falls Variable undefiniert, abbrechen (Monom ohne Variable)
    i = variables.indexOf(v);                              // Index der Variablen v (0 bis variables.length-1)
    this.expo[i] = (e ? Number(e) : 1);                    // Exponent übernehmen oder gleich 1 setzen
    }
    
// Kopie:

  clone () {
    var r = new Monomial();                                // Neues Monom
    r.coeff = this.coeff;                                  // Koeffizient übernehmen
    for (var i=0; i<variables.length; i++)                 // Für alle Variablen-Indizes ...
      r.expo[i] = this.expo[i];                            // Exponent übernehmen
    return r;                                              // Rückgabewert
    }
    
// Vorzeichenumkehr: Das Monom wird dabei geändert.

  changeSign () {
    this.coeff = 0n-this.coeff;                            // Umgekehrtes Vorzeichen beim Koeffizienten
    }
    
// Umgekehrtes Monom:

  negate () {
    var r = this.clone();                                  // Kopie des gegebenen Monoms
    r.coeff = 0n-r.coeff;                                  // Vorzeichen des Koeffizienten umkehren
    return r;                                              // Rückgabewert
    }
    
// Überprüfung, ob Monom gleich 0:

  isZero () {return (this.coeff == 0n);}                   
  
// Überprüfung, ob ganze Zahl:

  isInt () {
    if (this.isZero()) return true;                        // Rückgabewert, falls Nullmonom
    for (var i=0; i<variables.length; i++)                 // Für alle Variablen-Indizes ...
      if (this.expo[i] != 0) return false;                 // Rückgabewert, falls Exponent ungleich 0
    return true;                                           // Rückgabewert, falls alle Exponenten gleich 0
    }
    
// Überprüfung, ob Monom gleich 1:

  isOne () {
    return (this.isInt() && this.coeff == 1n);             // Rückgabewert 
    }
    
// Summe des gegebenen Monoms und eines weiteren Monoms:
// m ... Zweites Monom
// Bei nicht gleichartigen Monomen Rückgabewert undefined

  add (m) {
    var r = new Monomial();                                // Neues Monom (für Summe)
    for (var i=0; i<variables.length; i++) {               // Für alle Variablen-Indizes ...
      var e = this.expo[i];                                // Aktueller Exponent
      r.expo[i] = e;                                       // Exponent vom gegebenen Monom übernehmen
      if (m.expo[i] != e) return undefined;                // Falls abweichende Exponenten, Rückgabewert undefined
      }
    r.coeff = this.coeff+m.coeff;                          // Koeffizienten addieren
    return r;                                              // Rückgabewert
    }
    
// Überprüfung der Gleichartigkeit:
// m ... Vergleichsmonom

  isEquiv (m) {
    if (this.coeff == 0n) return true;                     // Rückgabewert, falls gegebenes Monom gleich 0
    if (m.coeff == 0n) return true;                        // Rückgabewert, falls Vergleichsmonom gleich 0
    for (var i=0; i<variables.length; i++)                 // Für alle Variablen-Indizes ...
      if (this.expo[i] != m.expo[i]) return false;         // Rückgabewert, falls abweichender Exponent
    return true;                                           // Rückgabewert, falls alle Exponenten gleich                                         
    }
    
// Produkt des gegebenen Monoms und eines weiteren Monoms:
// m ... Zweites Monom

  mul (m) {
    var r = new Monomial();                                // Neues Monom (für Produkt)
    r.coeff = this.coeff*m.coeff;                          // Koeffizient (Produkt der gegebenen Koeffizienten)
    for (var i=0; i<variables.length; i++)                 // Für alle Variablen-Indizes ...
      r.expo[i] = this.expo[i]+m.expo[i];                  // Exponent (Summe der gegebenen Exponenten)
    return r;                                              // Rückgabewert
    }
    
// Quotient des gegebenen Monoms und eines weiteren Monoms:
// Es wird vorausgesetzt, dass der Koeffizient des ersten Monoms durch den des zweiten Monoms teilbar ist
// und dass die Exponenten im zweiten Monom höchstens so groß sind wie die im ersten. Trifft diese Voraussetzung nicht zu,
// so ist der Rückgabewert undefined.
// m ... Zweites Monom (Divisor)
  
  div (m) {
    var r = new Monomial();                                // Neues Monom (für Quotient)
    if (this.coeff%m.coeff != 0n) return undefined;        // Rückgabewert, falls Koeffizientendivision nicht aufgeht
    r.coeff = this.coeff/m.coeff;                          // Quotient der Koeffizienten als Koeffizient des Ergebnis-Monoms
    for (var v=0; v<variables.length; v++) {               // Für alle Variablen-Indizes ...
      var e = this.expo[v]-m.expo[v];                      // Differenz der Exponenten
      if (e < 0) return undefined;                         // Rückgabewert, falls Differenz negativ
      r.expo[v] = e;                                       // Differenz der gegebenen Exponenten als Exponent im Ergebnis-Monom
      }
    return r;                                              // Rückgabewert
    }
    
// Umwandlung in eine Zeichenkette (Provisorium für Testzwecke):
// f ... Flag für erstes Monom innerhalb eines Polynoms

  toString (f) {
    if (this.coeff == 0n) return (f ? "0" : "");           // Rückgabewert, falls Nullmonom
    var s = String(this.coeff);                            // Zeichenkette für Koeffizient
    if (s.charAt(0) == "-") s = "- "+s.substring(1);       // Falls Minuszeichen, Leerzeichen einfügen
    else if (!f) s = "+ "+s;                               // Falls Pluszeichen nicht am Anfang, Pluszeichen und Leerzeichen einfügen 
    for (var i=0; i<variables.length; i++) {               // Für alle Variablen-Indizes ...
      var e = this.expo[i];                                // Aktueller Exponent
      if (e != 0) {                                        // Falls Exponent ungleich 0 ...
        s += " "+variables.charAt(i);                      // Variable hinzufügen
        if (e != 1) s += "^"+e;                            // Falls Exponent größer als 1, '^' und Exponent hinzufügen
        }
      }
    return s;                                              // Rückgabewert
    }
    
// Hilfsroutine: Umwandlung des Koeffizienten (ungleich 0) in eine Zeichenkette
// f ... Flag für erstes Monom innerhalb eines Polynoms; im Falle f == true werden Pluszeichen weggelassen 
// und Minuszeichen mit Zwischenraum vorangestellt; im Falle f == false wird auf jeden Fall ein Plus- oder Minuszeichen
// als Rechenzeichen vorangestellt, und zwar mit Zwischenraum.
  
  coeffToString (f) {
    var c = this.coeff;                                    // Abkürzung für Koeffizient (Typ BigInt)
    var sign = (c>0 ? 1 : -1);                             // Vorzeichenfaktor
    var s = String(c);                                     // Koeffizient als Zeichenkette
    if (sign < 0) s = s.substring(1);                      // Gegebenenfalls Minuszeichen weglassen
    if (s == "1" && !this.isInt()) s = "";                 // Gegebenenfalls Koeffizient 1 weglassen
    if (f && sign < 0) s = "- "+s;                         // Gegebenenfalls Vorzeichen - mit Leerzeichen
    if (!f) {                                              // Falls nicht erstes Monom ...
      if (sign > 0) s = "+ "+s;                            // Rechenzeichen + und Betrag
      if (sign < 0) s = "- "+s;                            // Rechenzeichen - und Betrag
      } 
    return s;                                              // Rückgabewert 
    }
    
// Breite in Pixeln:
// f ... Flag für erstes Monom innerhalb des Polynoms; im Falle f == true werden Pluszeichen weggelassen 
// und Minuszeichen mit Zwischenraum vorangestellt; im Falle f == false wird auf jeden Fall ein Plus- oder Minuszeichen
// als Rechenzeichen vorangestellt, und zwar mit Zwischenraum.
// Die Methode width sollte der Methode write entsprechen.

  width (f) {
    var w0 = widthPix(" ")/2;                              // Zwischenraum (Pixel)
    var s = this.coeffToString(f);                         // Zeichenkette für Koeffizient (kann leer sein)
    var w = widthPix(s);                                   // Breite des Koeffizienten (Pixel)
    if (s != "" && !this.isInt()) w += w0;                 // Eventuell Zwischenraum zwischen Koeffizient und Variablen addieren
    for (var i=0; i<variables.length; i++) {               // Für alle Variablen-Indizes ...
      var e = this.expo[i];                                // Zugehöriger Exponent
      if (e == 0) continue;                                // Falls Exponent gleich 0, weiter zum nächsten Index
      w += widthPix(variables.charAt(i));                  // Breite der aktuellen Variablen addieren
      if (e == 1) {w += w0; continue;}                     // Falls Exponent gleich 1, weiter zum nächsten Index (Zwischenraum)
      w += widthPix(String(e));                            // Breite des Exponenten addieren
      w += w0;                                             // Breite des Zwischenraums addieren
      }
    if (!this.isInt()) w -= w0;                            // Falls Variable vorhanden, letzte Zwischenraum-Breite wieder subtrahieren   
    return w;                                              // Rückgabewert
    }
    
// Grafikausgabe:
// (x,y) ... Position (Pixel)
// f ....... Flag für ersten Summanden
// Die vorkommenden Variablen werden alphabetisch geordnet.
// Rückgabewert: Position am Ende des Monoms (Pixel)

  write (x, y, f) {
    var w0 = widthPix(" ")/2;                              // Zwischenraum (Pixel)
    var s = this.coeffToString(f);                         // Zeichenkette für Koeffizient (kann leer sein)
    x = writeString(s,x,y);                                // Zeichenkette ausgeben, neue Position
    if (s != "" && !this.isInt()) x += w0;                 // Eventuell Zwischenraum zwischen Koeffizient und Variablen
    for (var i=0; i<variables0.length; i++) {              // Für alle Buchstaben-Indizes ...
      var ch = variables0.charAt(i);                       // Aktueller Buchstabe
      var v = variables.indexOf(ch);                       // Position in variables oder -1
      if (v < 0) continue;                                 // Falls Buchstabe nicht vorkommt, weiter zum nächsten
      var e = this.expo[v];                                // Zugehöriger Exponent
      if (e == 0) continue;                                // Falls Exponent 0, weiter zum nächsten Buchstaben
      x = writeString(ch,x,y);                             // Variable ausgeben, neue Position
      if (e == 1) {x += w0; continue;}                     // Falls Exponent 1, neue Position und weiter zum nächsten Buchstaben
      x = writeString(""+e,x,y-8);                         // Exponent ausgeben
      x += w0;                                             // Neue Position
      } // Ende for (i)
    if (!this.isInt()) x -= w0;                            // Falls Variable vorhanden, letzte Positionsänderung rückgängig machen
    return x;                                              // Rückgabewert
    }
    
// Einsetzen einer Zahl für eine Variable:
// v ... Index der Variablen (0 bis variables.length-1)
// n ... Zahl (Typ BigInt)

  subst (v, n) {
    var m = this.clone();                                  // Kopie des gegebenen Monoms
    m.coeff = m.coeff*n**BigInt(this.expo[v]);             // Koeffizient
    m.expo[v] = 0;                                         // Exponent bezüglich der Variablen
    return m;                                              // Rückgabewert
    }

  } // Ende der Klasse Monomial
  
//-------------------------------------------------------------------------------------------------
  
// Konstruktor-Ersatz für Testzwecke:
// s ... Zeichenkette

function newMonomial (s) {
  var neg = false;                                         // Flag für Minuszeichen (gelöscht)
  var ch = s.charAt(0);                                    // Erstes Zeichen
  if (ch == "-") neg = true;                               // Falls Minuszeichen, Flag setzen
  if (ch == "+" || ch == "-") s = s.substring(1);          // Gegebenenfalls Plus- oder Minuszeichen weglassen
  for (var i=0; i<s.length; i++)                           // Für alle Zeichen-Indizes ...
    if (!like(s.charAt(i),"\\d")) break;                   // Falls keine Ziffer, for-Schleife abbrechen
  var m = new Monomial(s.substring(0,i));                  // Neues Monom (Koeffizient)
  if (i == 0) m.coeff = 1n;                                // Falls keine Ziffern am Anfang, Koeffizient 1
  if (neg) m.changeSign();                                 // Falls Minuszeichen, Monom umkehren
  s = s.substring(i);                                      // Zeichenkette nach dem Koeffizienten
  while (s.length > 0) {                                   // Solange Zeichenkette nicht leer ... 
    ch = s.charAt(0);                                      // Erstes Zeichen
    var v = variables.indexOf(ch);                         // Index der Variablen
    for (i=1; i<s.length; i++)                             // Für alle Zeichen-Indizes ab 1 ...
      if (like(s.charAt(i),"[a-z]")) break;                // Falls Buchstabe, for-Schleife abbrechen
    m.expo[v] = 1;                                         // Exponent zunächst gleich 1
    if (i == 1) {s = s.substring(i); continue;}            // Falls kein Exponent, while-Schleife fortsetzen
    m.expo[v] = Number(s.substring(2,i));                  // Exponent anpassen
    s = s.substring(i);                                    // Rest der Zeichenkette
    } // Ende while
  return m;                                                // Rückgabewert
  }
  
