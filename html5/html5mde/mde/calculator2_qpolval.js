// Klasse QPolVal (Quotient zweier multivariater Polynome mit ganzzahligen Koeffizienten)
// Die Klasse verwendet zwei Attribute, numerator f�r das Z�hlerpolynom, denominator f�r das Nennerpolynom (beide vom Typ Polynomial).
// Gemeinsame Faktoren von Z�hler- und Nennerpolynom werden herausgek�rzt.
// 02.07.2020 - 15.08.2020

class QPolVal {

// Konstruktor:
// n ... Z�hlerpolynom (Typ Polynomial)
// d ... Nennerpolynom (Typ Polynomial)

  constructor (n, d) {
    this.numerator = n;                                    // Z�hler �bernehmen
    this.denominator = d;                                  // Nenner �bernehmen
    this.normal();                                         // Normalisierung (K�rzen)
    }
    
// Vereinfachung (K�rzen, Vermeidung eines einfachen negativen Nenners); das gegebene QPolVal-Objekt wird hierbei ver�ndert! 

  normal () {
    var n = this.numerator, d = this.denominator;          // Abk�rzungen f�r Z�hler- und Nennerpolynom
    if (d.isZero()) return;                                // Falls Nennerpolynom gleich 0, abbrechen
    if (n.isZero()) {                                      // Falls Z�hlerpolynom gleich 0 ...
      this.denominator = newPolynomialInt(1n);             // Nennerpolynom gleich 1
      return;                                              // Abbrechen
      }
    var b1 = n.gcdCoeff(), b2 = d.gcdCoeff();              // ggTs der Koeffizienten in Z�hler und Nenner (Typ BigInt)
    var b = gcd(b1,b2);                                    // ggT der beiden Zwischenergebnisse (Typ BigInt)
    n.divBigInt(b); d.divBigInt(b);                        // Z�hler- und Nennerpolynom durch b dividieren
    for (var i=0; i<variables.length; i++) {               // F�r alle Variablen-Indizes ... 
      var e1 = n.minExpo(i), e2 = d.minExpo(i);            // Minimale Exponenten bez�glich Variable in Z�hler und Nenner
      var e = (e2<e1?e2:e1);                               // Minimaler Exponent bez�glich Variable
      n.divVarPow(i,e); d.divVarPow(i,e);                  // Z�hler- und Nennerpolynom durch Variablenpotenz dividieren
      }
    if (d.list.length == 1) {                              // Falls nur ein Monom im Nenner ...
      b = d.list[0].coeff;                                 // Koeffizient dieses Monoms
      if (b < 0n) {                                        // Falls Koeffizient negativ ...
        this.numerator = n.negate();                       // Z�hlerpolynom umkehren
        this.denominator = d.negate();                     // Nennerpolynom umkehren
        }
      }
    var f = n.gcd(d);                                      // ggT von Z�hler- und Nennerpolynom (Typ Polynomial)
    this.numerator = n.div(f);                             // Z�hlerpolynom durch f dividieren
    this.denominator = d.div(f);                           // Nennerpolynom durch f dividieren
    this.numerator.factorize(0);                           // Faktorisierung des Z�hlerpolynoms
    this.denominator.factorize(0);                         // Faktorisierung des Nennerpolynoms
    }
    
// Kopie:

  clone () {
    var n = this.numerator.clone();                        // Kopie des Z�hlers
    var d = this.denominator.clone();                      // Kopie des Nenners
    return new QPolVal(n,d);                               // R�ckgabewert
    }
    
// Vorzeichenumkehr (neues QPolVal-Objekt):

  negate () {
    var n = this.numerator.negate();                       // Umgekehrtes Z�hlerpolynom
    var d = this.denominator.clone();                      // Kopie des Nennerpolynoms
    return new QPolVal(n,d);                               // R�ckgabewert
    }
    
// Summe des gegebenen QPolVal-Objekts und eines weiteren QPolVal-Objekts:
// qp ... Zweites QPolVal-Objekt (zweiter Summand)

  add (qp) {
    if (qp == undefined) return undefined;                 // Falls 2. Summand undefiniert, Summe undefiniert
    var n1 = this.numerator, n2 = qp.numerator;            // Gegebene Z�hler
    var d1 = this.denominator, d2 = qp.denominator;        // Gegebene Nenner
    var n = n1.mul(d2).add(n2.mul(d1)), d = d1.mul(d2);    // Z�hler und Nenner der Summe
    return new QPolVal(n,d);                               // R�ckgabewert (normalisiert)  
    }
    
// Differenz des gegebenen QPolVal-Objekts und eines weiteren QPolVal-Objekts:
// qp ... Zweites QPolVal-Objekt (Subtrahend)

  sub (qp) {
    if (qp == undefined) return undefined;                 // Falls Subtrahend undefiniert, Differenz undefiniert
    var n1 = this.numerator, n2 = qp.numerator;            // Gegebene Z�hler
    var d1 = this.denominator, d2 = qp.denominator;        // Gegebene Nenner
    var n = n1.mul(d2).sub(n2.mul(d1)), d = d1.mul(d2);    // Z�hler und Nenner der Differenz  
    return new QPolVal(n,d);                               // R�ckgabewert (normalisiert)  
    }
    
// Produkt des gegebenen QPolVal-Objekts und eines weiteren QPolVal-Objekts:
// qp ... Zweites QPolVal-Objekt (zweiter Faktor)

  mul (qp) {
    if (qp == undefined) return undefined;                 // Falls 2. Faktor undefiniert, Produkt undefiniert
    var n1 = this.numerator, n2 = qp.numerator;            // Gegebene Z�hler
    var d1 = this.denominator, d2 = qp.denominator;        // Gegebene Nenner
    var n = n1.mul(n2), d = d1.mul(d2);                    // Z�hler und Nenner des Produkts
    return new QPolVal(n,d);                               // R�ckgabewert (normalisiert)
    }
    
// Quotient des gegebenen QPolVal-Objekts und eines weiteren QPolVal-Objekts:
// qp ... Zweites QPolVal-Objekt (Divisor)

  div (qp) {
    if (qp == undefined) return undefined;                 // Falls Divisor undefiniert, Quotient undefiniert
    if (qp.isZero()) return undefined;                     // Falls Divisor gleich 0, Quotient undefiniert
    var n1 = this.numerator, n2 = qp.numerator;            // Gegebene Z�hler
    var d1 = this.denominator, d2 = qp.denominator;        // Gegebene Nenner
    var n = n1.mul(d2), d = d1.mul(n2);                    // Z�hler und Nenner des Quotienten
    return new QPolVal(n,d);                               // R�ckgabewert (normalisiert)
    }
    
// Kehrwert:

  reciprocal () {
    if (this.isZero()) return undefined;                   // Kehrwert von 0 undefiniert
    var n = this.denominator.clone();                      // Nenner des gegebenen QPolVal-Objekts (Kopie)
    var d = this.numerator.clone();                        // Z�hler des gegebenen QPolVal-Objekts (Kopie)
    return new QPolVal(n,d);                               // R�ckgabewert (normalisiert)
    }
    
// Potenz des gegebenen QPolVal-Objekts und einer ganzen Zahl:
// e ... Exponent (ganzzahlig, Typ BigInt, nicht Number!)

  pow (e) {
    if (e == undefined) return undefined;                  // Falls Exponent undefiniert, Potenz undefiniert
    var pos = true;                                        // Flag f�r positiven Exponenten
    var p = qpRatVal(1n);                                  // Variable f�r Produkt (Typ QPolVal), Startwert 1
    if (e  < 0n) {                                         // Falls Exponent negativ ...
      pos = false;                                         // Flag f�r positiven Exponenten l�schen 
      e = 0n-e;                                            // Exponent durch Betrag ersetzen
      }
    while (e > 0n) {                                       // Solange e positiv ...
      p = p.mul(this);                                     // Bisheriges Produkt mit Basis multiplizieren
      e = e-1n;                                            // e um 1 erniedrigen
      }
    return (pos ? p : p.reciprocal());                     // R�ckgabewert
    }
    
// �berpr�fung, ob QPolVal-Objekt gleich 0:

  isZero () {
    var n = this.numerator, d = this.denominator;          // Abk�rzungen f�r Z�hler und Nenner
    var z1 = (n != undefined && n.isZero());               // Z�hler definiert und gleich 0?
    var z2 = (d != undefined && !d.isZero());              // Nenner definiert und ungleich 0?
    return (z1 && z2);                                     // R�ckgabewert
    }
    
// �berpr�fung, ob das gegebene QPolVal-Objekt mit einem anderen �bereinstimmt:

  equals (qp) {
    return this.sub(qp).isZero();                          // R�ckgabewert
    }
    
// Umwandlung in ein BigInt-Objekt (f�r Exponent einer Potenz):
// Bei Misserfolg R�ckgabewert undefined

  toBigInt () {
    var n = this.numerator, d = this.denominator;          // Abk�rzungen f�r Z�hler und Nenner
    if (!n.isInt() || !d.isInt()) return undefined;        // R�ckgabewert, falls Z�hler oder Nenner nicht ganzzahlig
    if (n.isZero()) return 0n;                             // R�ckgabewert, falls gegebenes QPolVal-Objekt gleich 0
    var q1 = n.list[0].coeff, q2 = d.list[0].coeff;        // Z�hler und Nenner als BigInt-Objekte
    return (q1%q2==0n ? q1/q2 : undefined);                // R�ckgabewert
    }
    
// Grafikausgabe:
// (x,y) ... Position (Pixel)

  write (x, y) {
    var n = this.numerator, d = this.denominator;          // Z�hler- und Nennerpolynom (Typ Polynomial)
    if (d.isOne()) n.write(x,y);                           // Falls Nennerpolynom gleich 1, nur Z�hlerpolynom ausgeben
    else {                                                 // Falls Nennerpolynom ungleich 1 ...
      if (d.isNegative()) {
        n.changeSign(); d.changeSign();
        }
      var w1 = n.width(), w2 = d.width();                  // Breite von Z�hler- und Nennerpolynom (Pixel)
      var w = Math.max(w1,w2)+widthPix(" ");               // Breite des Bruchstrichs (Pixel)
      n.write(x+(w-w1)/2,y-10);                            // Z�hlerpolynom
      d.write(x+(w-w2)/2,y+14);                            // Nennerpolynom
      line(x,y-4,x+w,y-4);                                 // Bruchstrich
      }
    }
    
// Grafikausgabe (Faktorisierung):
// (x,y) ... Position (Pixel)

  writeFactors (x, y) {
    var n = this.numerator, d = this.denominator;          // Z�hler- und Nennerpolynom (Typ Polynomial)
    if (d.isOne()) n.writeFactors(x,y);                    // Falls Nennerpolynom gleich 1, nur Z�hlerpolynom ausgeben
    else {                                                 // Falls Nennerpolynom ungleich 1 ...
      if (d.signFactor0() < 0) {                           // Falls negativer Vorfaktor im Nenner ...
        n.factors[0].changeSign();                         // Vorfaktor im Z�hler umkehren
        d.factors[0].changeSign();                         // Vorfaktor im Nenner umkehren
        } 
      var w1 = n.widthFactors(), w2 = d.widthFactors();    // Breite von Z�hler- und Nennerpolynom (Pixel)
      var w = Math.max(w1,w2)+widthPix(" ");               // Breite des Bruchstrichs (Pixel)
      n.writeFactors(x+(w-w1)/2,y-10);                     // Z�hlerpolynom, faktorisiert
      d.writeFactors(x+(w-w2)/2,y+14);                     // Nennerpolynom, faktorisiert
      line(x,y-4,x+w,y-4);                                 // Bruchstrich
      }
    }
    
  } // Ende der Klasse QPolVal
  
//-------------------------------------------------------------------------------------------------

// Konstruktor-Ersatz f�r rationale Zahl:
// n ... Z�hler (Typ BigInt)
// d ... Nenner (Typ BigInt, optional, Defaultwert 1)

function qpRatVal (n, d) {
  if (d == undefined) d = 1n;                              // Falls Nenner undefiniert, Defaultwert 1
  if (d == 0n) return undefined;                           // Falls Nenner gleich 0, R�ckgabewert undefiniert
  var f = gcd(n,d);                                        // Gr��ter gemeinsamer Teiler von Z�hler und Nenner
  n = n/f; d = d/f;                                        // Bruch k�rzen (Typ BigInt)
  var p1 = newPolynomialInt(n);                            // Z�hlerpolynom (Typ Polynomial)
  var p2 = newPolynomialInt(d);                            // Nennerpolynom (Typ Polynomial)
  return new QPolVal(p1,p2);                               // R�ckgabewert
  }
  

  
  