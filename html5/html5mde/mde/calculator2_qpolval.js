// Klasse QPolVal (Quotient zweier multivariater Polynome mit ganzzahligen Koeffizienten)
// Die Klasse verwendet zwei Attribute, numerator für das Zählerpolynom, denominator für das Nennerpolynom (beide vom Typ Polynomial).
// Gemeinsame Faktoren von Zähler- und Nennerpolynom werden herausgekürzt.
// 02.07.2020 - 15.08.2020

class QPolVal {

// Konstruktor:
// n ... Zählerpolynom (Typ Polynomial)
// d ... Nennerpolynom (Typ Polynomial)

  constructor (n, d) {
    this.numerator = n;                                    // Zähler übernehmen
    this.denominator = d;                                  // Nenner übernehmen
    this.normal();                                         // Normalisierung (Kürzen)
    }
    
// Vereinfachung (Kürzen, Vermeidung eines einfachen negativen Nenners); das gegebene QPolVal-Objekt wird hierbei verändert! 

  normal () {
    var n = this.numerator, d = this.denominator;          // Abkürzungen für Zähler- und Nennerpolynom
    if (d.isZero()) return;                                // Falls Nennerpolynom gleich 0, abbrechen
    if (n.isZero()) {                                      // Falls Zählerpolynom gleich 0 ...
      this.denominator = newPolynomialInt(1n);             // Nennerpolynom gleich 1
      return;                                              // Abbrechen
      }
    var b1 = n.gcdCoeff(), b2 = d.gcdCoeff();              // ggTs der Koeffizienten in Zähler und Nenner (Typ BigInt)
    var b = gcd(b1,b2);                                    // ggT der beiden Zwischenergebnisse (Typ BigInt)
    n.divBigInt(b); d.divBigInt(b);                        // Zähler- und Nennerpolynom durch b dividieren
    for (var i=0; i<variables.length; i++) {               // Für alle Variablen-Indizes ... 
      var e1 = n.minExpo(i), e2 = d.minExpo(i);            // Minimale Exponenten bezüglich Variable in Zähler und Nenner
      var e = (e2<e1?e2:e1);                               // Minimaler Exponent bezüglich Variable
      n.divVarPow(i,e); d.divVarPow(i,e);                  // Zähler- und Nennerpolynom durch Variablenpotenz dividieren
      }
    if (d.list.length == 1) {                              // Falls nur ein Monom im Nenner ...
      b = d.list[0].coeff;                                 // Koeffizient dieses Monoms
      if (b < 0n) {                                        // Falls Koeffizient negativ ...
        this.numerator = n.negate();                       // Zählerpolynom umkehren
        this.denominator = d.negate();                     // Nennerpolynom umkehren
        }
      }
    var f = n.gcd(d);                                      // ggT von Zähler- und Nennerpolynom (Typ Polynomial)
    this.numerator = n.div(f);                             // Zählerpolynom durch f dividieren
    this.denominator = d.div(f);                           // Nennerpolynom durch f dividieren
    this.numerator.factorize(0);                           // Faktorisierung des Zählerpolynoms
    this.denominator.factorize(0);                         // Faktorisierung des Nennerpolynoms
    }
    
// Kopie:

  clone () {
    var n = this.numerator.clone();                        // Kopie des Zählers
    var d = this.denominator.clone();                      // Kopie des Nenners
    return new QPolVal(n,d);                               // Rückgabewert
    }
    
// Vorzeichenumkehr (neues QPolVal-Objekt):

  negate () {
    var n = this.numerator.negate();                       // Umgekehrtes Zählerpolynom
    var d = this.denominator.clone();                      // Kopie des Nennerpolynoms
    return new QPolVal(n,d);                               // Rückgabewert
    }
    
// Summe des gegebenen QPolVal-Objekts und eines weiteren QPolVal-Objekts:
// qp ... Zweites QPolVal-Objekt (zweiter Summand)

  add (qp) {
    if (qp == undefined) return undefined;                 // Falls 2. Summand undefiniert, Summe undefiniert
    var n1 = this.numerator, n2 = qp.numerator;            // Gegebene Zähler
    var d1 = this.denominator, d2 = qp.denominator;        // Gegebene Nenner
    var n = n1.mul(d2).add(n2.mul(d1)), d = d1.mul(d2);    // Zähler und Nenner der Summe
    return new QPolVal(n,d);                               // Rückgabewert (normalisiert)  
    }
    
// Differenz des gegebenen QPolVal-Objekts und eines weiteren QPolVal-Objekts:
// qp ... Zweites QPolVal-Objekt (Subtrahend)

  sub (qp) {
    if (qp == undefined) return undefined;                 // Falls Subtrahend undefiniert, Differenz undefiniert
    var n1 = this.numerator, n2 = qp.numerator;            // Gegebene Zähler
    var d1 = this.denominator, d2 = qp.denominator;        // Gegebene Nenner
    var n = n1.mul(d2).sub(n2.mul(d1)), d = d1.mul(d2);    // Zähler und Nenner der Differenz  
    return new QPolVal(n,d);                               // Rückgabewert (normalisiert)  
    }
    
// Produkt des gegebenen QPolVal-Objekts und eines weiteren QPolVal-Objekts:
// qp ... Zweites QPolVal-Objekt (zweiter Faktor)

  mul (qp) {
    if (qp == undefined) return undefined;                 // Falls 2. Faktor undefiniert, Produkt undefiniert
    var n1 = this.numerator, n2 = qp.numerator;            // Gegebene Zähler
    var d1 = this.denominator, d2 = qp.denominator;        // Gegebene Nenner
    var n = n1.mul(n2), d = d1.mul(d2);                    // Zähler und Nenner des Produkts
    return new QPolVal(n,d);                               // Rückgabewert (normalisiert)
    }
    
// Quotient des gegebenen QPolVal-Objekts und eines weiteren QPolVal-Objekts:
// qp ... Zweites QPolVal-Objekt (Divisor)

  div (qp) {
    if (qp == undefined) return undefined;                 // Falls Divisor undefiniert, Quotient undefiniert
    if (qp.isZero()) return undefined;                     // Falls Divisor gleich 0, Quotient undefiniert
    var n1 = this.numerator, n2 = qp.numerator;            // Gegebene Zähler
    var d1 = this.denominator, d2 = qp.denominator;        // Gegebene Nenner
    var n = n1.mul(d2), d = d1.mul(n2);                    // Zähler und Nenner des Quotienten
    return new QPolVal(n,d);                               // Rückgabewert (normalisiert)
    }
    
// Kehrwert:

  reciprocal () {
    if (this.isZero()) return undefined;                   // Kehrwert von 0 undefiniert
    var n = this.denominator.clone();                      // Nenner des gegebenen QPolVal-Objekts (Kopie)
    var d = this.numerator.clone();                        // Zähler des gegebenen QPolVal-Objekts (Kopie)
    return new QPolVal(n,d);                               // Rückgabewert (normalisiert)
    }
    
// Potenz des gegebenen QPolVal-Objekts und einer ganzen Zahl:
// e ... Exponent (ganzzahlig, Typ BigInt, nicht Number!)

  pow (e) {
    if (e == undefined) return undefined;                  // Falls Exponent undefiniert, Potenz undefiniert
    var pos = true;                                        // Flag für positiven Exponenten
    var p = qpRatVal(1n);                                  // Variable für Produkt (Typ QPolVal), Startwert 1
    if (e  < 0n) {                                         // Falls Exponent negativ ...
      pos = false;                                         // Flag für positiven Exponenten löschen 
      e = 0n-e;                                            // Exponent durch Betrag ersetzen
      }
    while (e > 0n) {                                       // Solange e positiv ...
      p = p.mul(this);                                     // Bisheriges Produkt mit Basis multiplizieren
      e = e-1n;                                            // e um 1 erniedrigen
      }
    return (pos ? p : p.reciprocal());                     // Rückgabewert
    }
    
// Überprüfung, ob QPolVal-Objekt gleich 0:

  isZero () {
    var n = this.numerator, d = this.denominator;          // Abkürzungen für Zähler und Nenner
    var z1 = (n != undefined && n.isZero());               // Zähler definiert und gleich 0?
    var z2 = (d != undefined && !d.isZero());              // Nenner definiert und ungleich 0?
    return (z1 && z2);                                     // Rückgabewert
    }
    
// Überprüfung, ob das gegebene QPolVal-Objekt mit einem anderen übereinstimmt:

  equals (qp) {
    return this.sub(qp).isZero();                          // Rückgabewert
    }
    
// Umwandlung in ein BigInt-Objekt (für Exponent einer Potenz):
// Bei Misserfolg Rückgabewert undefined

  toBigInt () {
    var n = this.numerator, d = this.denominator;          // Abkürzungen für Zähler und Nenner
    if (!n.isInt() || !d.isInt()) return undefined;        // Rückgabewert, falls Zähler oder Nenner nicht ganzzahlig
    if (n.isZero()) return 0n;                             // Rückgabewert, falls gegebenes QPolVal-Objekt gleich 0
    var q1 = n.list[0].coeff, q2 = d.list[0].coeff;        // Zähler und Nenner als BigInt-Objekte
    return (q1%q2==0n ? q1/q2 : undefined);                // Rückgabewert
    }
    
// Grafikausgabe:
// (x,y) ... Position (Pixel)

  write (x, y) {
    var n = this.numerator, d = this.denominator;          // Zähler- und Nennerpolynom (Typ Polynomial)
    if (d.isOne()) n.write(x,y);                           // Falls Nennerpolynom gleich 1, nur Zählerpolynom ausgeben
    else {                                                 // Falls Nennerpolynom ungleich 1 ...
      if (d.isNegative()) {
        n.changeSign(); d.changeSign();
        }
      var w1 = n.width(), w2 = d.width();                  // Breite von Zähler- und Nennerpolynom (Pixel)
      var w = Math.max(w1,w2)+widthPix(" ");               // Breite des Bruchstrichs (Pixel)
      n.write(x+(w-w1)/2,y-10);                            // Zählerpolynom
      d.write(x+(w-w2)/2,y+14);                            // Nennerpolynom
      line(x,y-4,x+w,y-4);                                 // Bruchstrich
      }
    }
    
// Grafikausgabe (Faktorisierung):
// (x,y) ... Position (Pixel)

  writeFactors (x, y) {
    var n = this.numerator, d = this.denominator;          // Zähler- und Nennerpolynom (Typ Polynomial)
    if (d.isOne()) n.writeFactors(x,y);                    // Falls Nennerpolynom gleich 1, nur Zählerpolynom ausgeben
    else {                                                 // Falls Nennerpolynom ungleich 1 ...
      if (d.signFactor0() < 0) {                           // Falls negativer Vorfaktor im Nenner ...
        n.factors[0].changeSign();                         // Vorfaktor im Zähler umkehren
        d.factors[0].changeSign();                         // Vorfaktor im Nenner umkehren
        } 
      var w1 = n.widthFactors(), w2 = d.widthFactors();    // Breite von Zähler- und Nennerpolynom (Pixel)
      var w = Math.max(w1,w2)+widthPix(" ");               // Breite des Bruchstrichs (Pixel)
      n.writeFactors(x+(w-w1)/2,y-10);                     // Zählerpolynom, faktorisiert
      d.writeFactors(x+(w-w2)/2,y+14);                     // Nennerpolynom, faktorisiert
      line(x,y-4,x+w,y-4);                                 // Bruchstrich
      }
    }
    
  } // Ende der Klasse QPolVal
  
//-------------------------------------------------------------------------------------------------

// Konstruktor-Ersatz für rationale Zahl:
// n ... Zähler (Typ BigInt)
// d ... Nenner (Typ BigInt, optional, Defaultwert 1)

function qpRatVal (n, d) {
  if (d == undefined) d = 1n;                              // Falls Nenner undefiniert, Defaultwert 1
  if (d == 0n) return undefined;                           // Falls Nenner gleich 0, Rückgabewert undefiniert
  var f = gcd(n,d);                                        // Größter gemeinsamer Teiler von Zähler und Nenner
  n = n/f; d = d/f;                                        // Bruch kürzen (Typ BigInt)
  var p1 = newPolynomialInt(n);                            // Zählerpolynom (Typ Polynomial)
  var p2 = newPolynomialInt(d);                            // Nennerpolynom (Typ Polynomial)
  return new QPolVal(p1,p2);                               // Rückgabewert
  }
  

  
  