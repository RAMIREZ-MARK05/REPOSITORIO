// Klasse Polynomial (multivariates Polynom der Variablen a bis z mit ganzzahligen Koeffizienten)

// Das Attribut list realisiert eine Liste von Monomen, die nicht zueinander äquivalent sein sollen. Beim Nullpolynom
// ist diese Liste leer.

// Das Attribut factors ist ein im Wesentlichen zweifach indiziertes Array, das die Zerlegung in irreduzible Faktoren
// beschreibt: Das Element mit Index 0 ist der Vorfaktor (ggT der Koeffizienten mal ggT der Variablenpotenzen).
// Die weiteren Elemente (Index ab 1) sind entweder Arrays, die sich aus den Faktoren der quadratfreien Zerlegung durch weitere Zerlegung
// ergeben, oder undefined. Der erste Index ist zugleich der Exponent, der zu einem Faktor gehört.

// 01.07.2020 - 17.08.2020

class Polynomial {

// Konstruktor für ein Polynom mit höchstens einem Monom:
// m ... Gegebenes Monom (optional); ist m nicht definiert, liefert der Konstruktor ein Nullpolynom.

  constructor (m) {
    this.list = [];                                        // Leere Liste von Monomen
    if (m != undefined) this.list.push(m);                 // Falls Monom definiert, zur Liste hinzufügen
    this.factors = undefined;                              // Zerlegung in Faktoren noch undefiniert
    }
    
// Kopie:

  clone () {
    var r = new Polynomial();                              // Neues Polynom 
    var li = this.list;                                    // Abkürzung für die Liste der Monome
    for (var i=0; i<li.length; i++)                        // Für alle Monom-Indizes ...
      r.list.push(li[i].clone());                          // Kopie des Monoms hinzufügen
    return r;                                              // Rückgabewert
    }
    
// Löschung von Nullmonomen; das gegebene Polynom wird dabei geändert.

  clearZeros () {
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++) {                      // Für alle Monom-Indizes ...
      var m = li[i];                                       // Aktuelles Monom
      if (m.isZero()) {                                    // Falls Nullmonom ...
        for (var k=i; k<li.length-1; k++)                  // Für alle folgenden Monom-Indizes ...
          li[k] = li[k+1];                                 // Aktuelles Monom nach links verschieben
        li.pop();                                          // Liste der Monome am Ende abschneiden
        i--;                                               // Index um 1 verkleinern (Schleife mit gleichem Index fortsetzen)
        } // Ende if
      } // Ende for (i)
    }
    
// Vorzeichenumkehr; das gegebene Polynom wird dabei geändert.

  changeSign () {
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++)                        // Für alle Monom-Indizes ...
      li[i].changeSign();                                  // Vorzeichen des aktuellen Monoms umkehren
    }
    
// Polynom mit umgekehrten Vor- bzw. Rechenzeichen:

  negate () {
    var r = this.clone();                                  // Kopie des gegebenen Polynoms
    r.changeSign();                                        // Vorzeichenumkehr
    return r;                                              // Rückgabewert
    }
    
// Addition eines Monoms; das gegebene Polynom wird dabei geändert.
// m ... Zusätzliches Monom (2. Summand)

  addMonomial (m) {
    if (m.isZero()) return;                                // Falls Nullmonom, abbrechen
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++) {                      // Für alle Monom-Indizes ...
      if (li[i].isEquiv(m)) {                              // Falls aktuelles Monom äquivalent zum neuen Monom ...
        li[i] = li[i].add(m);                              // Neues Monom zum aktuellen Monom addieren
        break;                                             // for-Schleife abbrechen
        }
      }
    if (i == li.length) li.push(m);                        // Falls kein gleichartiges Monom, am Ende der Liste hinzufügen
    this.clearZeros();                                     // Eventuell Nullmonome löschen 
    }
    
// Summe des gegebenen Polynoms und eines weiteren Polynoms:
// p ... Zweites Polynom (2. Summand)

  add (p) {
    var r = this.clone();                                  // Kopie des gegebenen Polynoms
    for (var i=0; i<p.list.length; i++)                    // Für alle Monom-Indizes des anderen Polynoms ...
      r.addMonomial(p.list[i]);                            // Monom addieren
    return r;                                              // Rückgabewert
    }
    
// Subtraktion eines Monoms; das gegebene Polynom wird dabei geändert.
// m ... Zusätzliches Monom (Subtrahend)

  subMonomial (m) {
    this.addMonomial(m.negate());                          // Entgegengesetztes Monom addieren                    
    }
    
// Differenz des gegebenen Polynoms und eines weiteren Polynoms:
// p ... Zweites Polynom (Subtrahend)

  sub (p) {
    var r = this.clone();                                  // Kopie des gegebenen Polynoms
    for (var i=0; i<p.list.length; i++)                    // Für alle Monom-Indizes des anderen Polynoms ...
      r.subMonomial(p.list[i]);                            // Monom subtrahieren
    return r;                                              // Rückgabewert
    }
    
// Produkt des gegebenen Polynoms und eines Monoms
// m ... Monom (2. Faktor)

  mulMonomial (m) {
    var r = this.clone();                                  // Kopie des gegebenen Polynoms
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++)                        // Für alle Monom-Indizes ...
      r.list[i] = li[i].mul(m);                            // Aktuelles Monom mit neuem Monom multiplizieren
    return r;                                              // Rückgabewert
    }
    
// Produkt des gegebenen Polynoms und eines weiteren Polynoms:
// p ... Weiteres Polynom (2. Faktor)

  mul (p) {
    var r = new Polynomial();                              // Neues Polynom für Ergebnis
    var li1 = this.list, li2 = p.list;                     // Abkürzungen für Monom-Listen
    for (var i=0; i<li1.length; i++) {                     // Für alle Monom-Indizes des gegebenen Polynoms ...
      for (var k=0; k<li2.length; k++) {                   // Für alle Monom-Indizes des anderen Polynoms ...
        var m = li1[i].mul(li2[k]);                        // Neues Monom (Produkt zweier Monome)
        r.addMonomial(m);                                  // Zum Zwischenergebnis addieren
        }
      }
    return r;                                              // Rückgabewert
    }
    
// Potenz des gegebenen Polynoms und einer nicht-negativen ganzen Zahl:
// e ... Exponent (Typ Number, ganzzahlig)
    
  pow (e) {
    if (e == undefined) return undefined;                  // Rückgabewert, falls Exponent undefiniert
    if (e < 0) return undefined;                           // Rückgabewert, falls Exponent negativ
    var p = newPolynomialInt(1n);                          // Variable für Produkt (Typ Polynomial), Startwert 1
    while (e > 0) {                                        // Solange e positiv ...
      p = p.mul(this);                                     // Bisheriges Produkt mit Basis multiplizieren
      e--;                                                 // e um 1 erniedrigen
      }
    return p;                                              // Rückgabewert
    }
    
// Division durch eine BigInt-Zahl; das gegebene Polynom wird dabei geändert.
// z ... BigInt-Zahl (Divisor, ungleich 0)

  divBigInt (z) {
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++)                        // Für alle Monom-Indizes ...
      li[i].coeff = li[i].coeff/z;                         // Koeffizient des aktuellen Monoms durch z dividieren
    }
    
// Division durch eine Potenz einer Variablen; das gegebene Polynom wird dabei geändert.
// v ... Index der Variablen (0 bis variables.length-1)
// e ... Exponent (Typ Number, ganzzahlig, nicht so groß, dass negative Exponenten herauskommen!)

  divVarPow (v, e) {
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++)                        // Für alle Monom-Indizes ...
      li[i].expo[v] = li[i].expo[v]-e;                     // Exponent aktualisieren (darf nicht negativ sein!)
    }
    
// Größter gemeinsamer Teiler aller Koeffizienten:
// Rückgabewert vom Typ BigInt und positiv, im Falle des Nullpolynoms undefined
  
  gcdCoeff () {
    var li = this.list, n = li.length;                     // Abkürzungen
    if (n == 0) return undefined;                          // Rückgabewert, falls Nullpolynom
    var r = li[0].coeff;                                   // Startwert (Koeffizient des ersten Monoms)
    for (var i=1; i<n; i++) r = gcd(r,li[i].coeff);        // Für alle weiteren Monom-Indizes aktualisieren
    return (r>=0n ? r : 0n-r);                             // Rückgabewert (Betrag)
    }
    
// Minimaler Exponent bezüglich einer Variablen:
// v ... Index der Variablen (0 bis variables.length-1)

  minExpo (v) {
    var li = this.list, n = li.length;                     // Abkürzungen
    if (n == 0) return 0;                                  // Rückgabewert, falls Nullpolynom
    var min = li[0].expo[v];                               // Startwert (Exponent im ersten Monom)
    for (var i=1; i<n; i++) {                              // Für alle Monom-Indizes ...
      var e = li[i].expo[v];                               // Exponent bezüglich Variable im aktuellen Monom
      if (e < min) min = e;                                // Falls Exponent kleiner als bisher, Minimum aktualisieren
      }       
    return min;                                            // Rückgabewert  
    }
    
// Überprüfung, ob Polynom gleich 0:

  isZero () {
    return (this.list.length == 0);                        // Rückgabewert
    }
    
// Überprüfung, ob Polynom gleich 1:

  isOne () {
    var li = this.list;                                    // Abkürzung für Liste der Monome
    return (li.length == 1 && li[0].isOne());              // Rückgabewert
    }
    
// Überprüfung, ob das gegebene Polynom eine Einheit ist (+1 oder -1)

  isUnit () {
    if (this.isOne()) return true;                         // Rückgabewert, falls Polynom gleich 1
    if (this.negate().isOne()) return true;                // Rückgabewert, falls Polynom gleich -1
    return false;                                          // Rückgabewert, falls weder 1 noch -1
    }
    
// Überprüfung, ob Polynom konstant (ganze Zahl):

  isInt () {
    var li = this.list, n = li.length;                     // Abkürzungen
    if (n > 1) return false;                               // Rückgabewert, falls mehr als ein Monom
    if (n == 1) return li[0].isInt();                      // Rückgabewert, falls genau ein Monom
    return true;                                           // Rückgabewert, falls kein Monom vorhanden (Nullpolynom)
    }
    
// Überprüfung der Gleichheit für das gegebene Polynom und ein weiteres Polynom:
// p ... Weiteres Polynom

  equals (p) {
    return this.sub(p).isZero();                           // Rückgabewert (Differenz gleich 0?)
    }
    
// Grad in Bezug auf eine Hauptvariable:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Rückgabewert: Grad, im Falle des Nullpolynoms (leere Liste) -1
  
  degree (v) {
    var li = this.list, n = li.length;                     // Abkürzungen
    if (n == 0) return -1;                                 // Rückgabewert, falls Nullpolynom
    var max = li[0].expo[v];                               // Startwert (Exponent im ersten Monom)
    for (var i=1; i<n; i++) {                              // Für alle weiteren Monom-Indizes ...
      var e = li[i].expo[v];                               // Aktueller Exponent                                 
      if (e > max) max = e;                                // Falls größer als bisher, Maximum aktualisieren
      }
    return max;                                            // Rückgabewert
    }
    
// Leitmonom (lexikographische Ordnung entsprechend der Reihenfolge in variables):

  leadingMonomial () {
    var li = this.list, n = li.length;                     // Abkürzungen
    if (n == 0) return undefined;                          // Rückgabewert undefined, falls Nullpolynom
    var iMax = 0;                                          // Variable für entscheidenden Monom-Index, Startwert 
    var eMax = li[0].expo;                                 // Array der Exponenten für erstes Monom als Startwert für "Maximum"
    for (var i=1; i<n; i++) {                              // Für alle weiteren Monom-Indizes ...
      var e = li[i].expo;                                  // Array der Exponenten für aktuelles Monom
      for (var v=0; v<variables.length; v++) {             // Für alle Variablenindizes ...
        if (e[v] < eMax[v]) break;                         // Falls Exponent kleiner als bisher, v-Schleife verlassen
        else if (e[v] > eMax[v]) {                         // Falls Exponent größer als bisher ...
          iMax = i;                                        // Variable für entscheidenden Monom-Index aktualisieren
          eMax = e;                                        // "Maximales" Exponenten-Array aktualisieren
          break;                                           // v-Schleife verlassen 
          } 
        } // Ende for (v)
      } // Ende for (i)
    return li[iMax];                                       // Rückgabewert
    }
    
// Koeffizient in Bezug auf eine Hauptvariable (im Allgemeinen Polynom der anderen Variablen):
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// e ... Exponent in Bezug auf die Hauptvariable

  getCoefficient (v, e) {
  	var r = new Polynomial();                               // Neues Polynom
  	var li = this.list;                                     // Abkürzung für Liste der Monome
  	for (var i=0; i<li.length; i++) {                       // Für alle Monom-Indizes ...
  	  var m = li[i];                                        // Aktuelles Monom
  	  if (m.expo[v] != e) continue;                         // Falls anderer Exponent, weiter zum nächsten Monom-Index
  	  m = m.clone();                                        // Kopie des aktuellen Monoms
  	  m.expo[v] = 0;                                        // Exponent bezüglich der Hauptvariablen gleich 0
  	  r.addMonomial(m);                                     // Monom zum Ergebnis-Polynom addieren
  	  }
  	return r;                                               // Rückgabewert
    }
    
// Leitkoeffizient in Bezug auf eine Hauptvariable:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Rückgabewert: Leitkoeffizient (Polynom in den anderen Variablen)

  leadingCoefficient (v) {
    var r = new Polynomial();                              // Neues Polynom (Nullpolynom)
    var d = this.degree(v);                                // Grad bezüglich der Hauptvariablen                
    if (d == 0) return r;                                  // Falls Hauptvariable nicht vorkommt, Nullpolynom als Rückgabewert
    return this.getCoefficient(v,d);                       // Rückgabewert (Normalfall)
    }
    
// Quotient des gegebenen Polynoms und eines weiteren Polynoms:
// p ... Weiteres Polynom (Divisor)
// Vorbedingung: Teilbarkeit ohne Rest; Algorithmus nach Leonid Kof (WWW-Seite zum Projekt SPOCK)
// Ist diese Bedingung nicht erfüllt, wird undefined zurückgegeben.
  
  div (p) {
    var f = this.clone();                                  // Kopie des Dividenden (Typ Polynomial)
    var q = new Polynomial();                              // Variable für Ergebnis-Polynom, Startwert 0
    while (!f.isZero()) {                                  // Solange f verschieden vom Nullpolynom ...
      var lm1 = f.leadingMonomial();                       // Leitmonom von f
      var lm2 = p.leadingMonomial();                       // Leitmonom von p
      var m = lm1.div(lm2);                                // Quotient der Leitmonome oder undefined
      if (m == undefined) return undefined;                // Rückgabewert bei Misserfolg
      q.addMonomial(m);                                    // Zum Ergebnis-Polynom addieren
      f = f.sub(p.mulMonomial(m));                         // f aktualisieren
      }
    return q;                                              // Rückgabewert (Normalfall)
    }
    
// Rest bezüglich Pseudodivision:
// Algorithmus nach Leonid Kof (WWW-Seite zum Projekt SPOCK); Änderung im ersten Teil
// p ... Divisor (Typ Polynomial)
// v ... Index der Hauptvariablen (0 bis variables.length-1)
  
  pseudoRemainder (p, v) {
    var degP = p.degree(v);                                // Grad von p bezüglich der Hauptvariablen
    if (degP == 0) return new Polynomial();                // Falls Hauptvariable im Divisor nicht vorkommt, Rückgabewert Nullpolynom
    var r = this.clone();                                  // Kopie des Dividenden
    var k = r.degree(v)-degP;                              // Grad-Differenz bezüglich der Hauptvariablen
    if (k < 0) return r;                                   // Rückgabewert, falls Differenz negativ
    var leadP = p.leadingCoefficient(v);                   // Leitkoeffizient von p bezüglich der Hauptvariablen
    while (k >= 0) {                                       // Solange Grad-Differenz nicht negativ ...
      var m = new Monomial();                              // Neues Monom mit Wert 1
      m.expo[v] = k;                                       // Exponent bezüglich der Hauptvariablen
      var leadR = r.leadingCoefficient(v);                 // Leitkoeffizient von r bezüglich der Hauptvariablen
      var t = leadR.mulMonomial(m);                        // Leitkoeffizient von r mal Monom m     
      var r1 = leadP.mul(r);                               // Leitkoeffizient von p mal Polynom r
      var r2 = t.mul(p);                                   // Produkt von t und p
      r = r1.sub(r2);                                      // Differenz der Produkte r1 und r2
      k = r.degree(v)-degP;                                // Neue Grad-Differenz bezüglich der Hauptvariablen
      }
    return r;                                              // Rückgabewert
    }
    
// Hauptvariable für das gegebene Polynom und ein weiteres Polynom:
// Noch nicht optimal! (Im gegebenen Polynom, danach im zweiten Polynom wird die erste Variable gesucht, die dort vorkommt.)
// p ... Weiteres Polynom
  
  getMainVariable (p) {
    var li = this.list;                                    // Abkürzung für Liste der Monome (gegebenes Polynom)
    for (var i=0; i<li.length; i++) {                      // Für alle Monom-Indizes (gegebenes Polynom) ...
      var m = li[i];                                       // Aktuelles Monom (gegebenes Polynom)
      for (var v=0; v<variables.length; v++)               // Für alle Variablen-Indizes ...
        if (m.expo[v] > 0) return v;                       // Rückgabewert, falls zugehöriger Exponent positiv 
      }
    li = p.list;                                           // Abkürzung für Liste der Monome (zweites Polynom)
    for (i=0; i<li.length; i++) {                          // Für alle Monom-Indizes (zweites Polynom) ...
      m = li[i];                                           // Aktuelles Monom (zweites Polynom)
      for (v=0; v<variables.length; v++)                   // Für alle Variablen-Indizes ...
        if (m.expo[v] > 0) return v;                       // Rückgabewert, falls zugehöriger Exponent positiv
      }
    return 0;                                              // Rückgabewert, falls bisherige Suche erfolglos
    }
    
// Inhalt in Bezug auf eine Hauptvariable:
// Algorithmus nach Leonid Kof (WWW-Seite zum Projekt SPOCK); die Methode ist indirekt rekursiv, da die Methode gcd 
// für den größten gemeinsamen Teiler zweier multivariater Polynome aufgerufen wird und diese Methode wiederum 
// die Methode content verwendet.
// v ... Index der Hauptvariablen (0 bis variables.length-1)
  
  content (v) {
    if (this.isInt()) return this.clone();                 // Kopie des gegebenen Polynoms als Rückgabewert, falls ganze Zahl    
    var r = this.leadingCoefficient(v);                    // Leitkoeffizient des gegebenen Polynoms bezüglich der Hauptvariablen
    var m = new Monomial();                                // Neues Monom mit Koeffizient 1
    m.expo[v] = this.degree(v);                            // Exponent bezüglich der Hauptvariablen
    var f = this.sub(r.mulMonomial(m));                    // Gegebenes Polynom minus r mal m
    while (!f.isZero() && !r.isUnit()) {                   // Solange f ungleich 0 und r keine Einheit ...
      var t = f.leadingCoefficient(v);                     // Hauptkoeffizient von f bezüglich der Hauptvariablen
      if (t.isZero()) return r.gcd(f);                     // Rückgabewert, falls t gleich 0
      if (t.isUnit()) return newPolynomialInt(1n);         // Rückgabewert, falls t Einheit (1 oder -1)
      r = r.gcd(t);                                        // ggT von r und t als neues r (indirekte Rekursion!)
      m = new Monomial();                                  // Neues Monom mit Koeffizient 1 
      m.expo[v] = f.degree(v);                             // Exponent bezüglich Hauptvariable
      f = f.sub(t.mulMonomial(m));                         // Polynom f minus t mal m
      } // Ende while
    return r;                                              // Rückgabewert
    }
    
// Größter gemeinsamer Teiler des gegebenen Polynoms und eines weiteren Polynoms:
// Algorithmus nach Leonid Kof (WWW-Seite zum Projekt SPOCK); Änderungen im ersten Teil (Spezialfälle)
// Die Methode ist direkt und indirekt rekursiv: Zum einen wird die Methode gcd verwendet, 
// zum anderen wird die Methode content aufgerufen, die wiederum auf gcd zurückgreift.
// p ... Zweites Polynom
  
  gcd (p) {
    var g = p.clone();                                     // Kopie des zweiten Polynoms
    if (this.isZero()) return g;                           // Rückgabewert, falls erstes Polynom gleich 0
    if (g.isZero()) return this.clone();                   // Rückgabewert, falls zweites Polynom gleich 0
    // Ab hier werden zwei Polynome ungleich 0 vorausgesetzt.
    if (this.isInt() || g.isInt()) {                       // Falls mindestens eines der Polynome konstant ...
      var c1 = this.gcdCoeff();                            // ggT der Koeffizienten des ersten Polynoms
      var c2 = g.gcdCoeff();                               // ggT der Koeffizienten des zweiten Polynoms
      return newPolynomialInt(gcd(c1,c2));                 // Rückgabewert
      }    
    // Ab hier werden zwei nicht konstante Polynome vorausgesetzt.
    var v = this.getMainVariable(g);                       // Index der Hauptvariablen
    var cf = this.content(v);                              // Inhalt des ersten Polynoms bezüglich der Hauptvariablen (Typ Polynomial) 
    var f = this.div(cf);                                  // Quotient erstes Polynom durch Inhalt cf (Typ Polynomial)
    var cg = g.content(v);                                 // Inhalt des zweiten Polynoms bezüglich der Hauptvariablen (Typ Polynomial) 
    g = g.div(cg);                                         // Quotient zweites Polynom durch Inhalt cg (Typ Polynomial)
    var leadF = f.leadingCoefficient(v);                   // Leitkoeffizient von f bezüglich der Hauptvariablen (Typ Polynomial)
    var leadG = g.leadingCoefficient(v);                   // Leitkoeffizient von g bezüglich der Hauptvariablen (Typ Polynomial)
    var gamma = leadF.gcd(leadG);                          // ggT der beiden Leitkoeffizienten (Typ Polynomial) 
    var c = cf.gcd(cg);                                    // ggT der beiden Inhalte (Rekursion!)
    while (!g.isZero()) {                                  // Solange g ungleich 0 ...
      var t = f.pseudoRemainder(g,v);                      // Pseudorest von f durch g bezüglich der Hauptvariablen 
      f = g; g = t;                                        // Rollentausch wie beim euklidischen Algorithmus
      }
    if (f.degree(v) == 0) return c;                        // Rückgabewert, falls Hauptvariable in f nicht vorkommt
    var f1 = gamma.mul(f);                                 // Produkt gamma mal f
    f = f1.div(f.leadingCoefficient(v));                   // f1 durch Hauptkoeffizient von f
    f = f.div(f.content(v));                               // f durch Inhalt von f
    return c.mul(f);                                       // Rückgabewert
    }
    
// Formale Ableitung nach einer Hauptvariablen:
// v ... Index der Hauptvariablen (0 bis variables.length-1) oder variables.length (konstantes Polynom)

  deriv (v) {
    if (v == variables.length) return new Polynomial();    // Rückgabewert, falls konstantes Polynom
    var d = new Polynomial();                              // Neues Polynom für Ableitung
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++) {                      // Für alle Monom-Indizes ...
      var m = li[i];                                       // Aktuelles Monom des gegebenen Polynoms
      var dm = new Monomial();                             // Neues Monom für Ableitung
      dm.coeff = m.coeff*BigInt(m.expo[v]);                // Koeffizient für Ableitung
      for (var k=0; k<variables.length; k++) {             // Für alle Variablen-Indizes ...
        if (k != v) dm.expo[k] = m.expo[k];                // Falls nicht Hauptvariable, Exponent übernehmen
        else dm.expo[k] = Math.max(m.expo[k]-1,0);         // Sonst Exponent erniedrigen, aber nicht unter 0              
        } // Ende for (k)
      d.addMonomial(dm);                                   // Monom addieren
      } // Ende for (i)
    return d;                                              // Rückgabewert
    }
    
// Vorfaktor, bestehend aus dem ggT der Koeffizienten und den in allen Monomen enthaltenen Variablenpotenzen:

  factor0 () {
    if (this.isZero()) return newPolynomialInt(1n);        // Rückgabewert für Nullpolynom
    var m = new Monomial();                                // Neues Monom
    m.coeff = this.gcdCoeff();                             // ggT der Polynom-Koeffizienten als Monom-Koeffizient
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var v=0; v<variables.length; v++) {               // Für alle Variablen-Indizes ...
      var e = li[0].expo[v];                               // Exponent im ersten Monom
      for (var i=1; i<li.length; i++)                      // Für alle weiteren Monom-Indizes ... 
        e = Math.min(e,li[i].expo[v]);                     // Falls Exponent kleiner als bisher, aktualisieren     
      m.expo[v] = e;                                       // Exponent bezüglich der aktuellen Variablen
      } // Ende for (v)
    var f0 = new Polynomial(m);                            // Polynom zum Monom m
    if (this.div(f0).negate().isOne())                     // Falls m entgegengesetzt gleich zum gegebenen Polynom ...
      m.changeSign();                                      // Vorzeichen umkehren
    return new Polynomial(m);                              // Rückgabewert
    }
    
// Quadratfreie Faktorisierung (verallgemeinert nach Michael Kaplan, Computeralgebra):
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Es wird vorausgesetzt, dass keine Variablen mit Index kleiner als v vorkommen.
// Rückgabewert: Array von Polynomen, bestehend aus Vorfaktor und quadratfreien Faktoren zu den Exponenten 1, 2 usw.
// Zahlenfaktoren und gemeinsame Variablenpotenzen kommen in den Vorfaktor.
    
  squarefree (v) {
    var p = this.clone();                                  // Kopie des gegebenen Polynoms
    if (variables == "") return [p];                       // Rückgabewert, falls keine Variable vorhanden
    if (this.degree(v) < 1) {                              // Falls Hauptvariable nicht vorkommt ...
      if (v == variables.length-1) return [p];             // Rückgabewert, falls letzte Variable (Rekursionsende) ...
      else return p.squarefree(v+1);                       // Rückgabewert, falls nicht letzte Variable (Rekursion)
      }
    var f = [undefined];                                   // Array mit einem undefinierten Element (Vorfaktor)
    var t1 = this;                                         // 1. Hilfspolynom, Startwert
    var t2 = t1.gcd(t1.deriv(v));                          // 2. Hilfspolynom, Startwert
    var t3 = t2.gcd(t2.deriv(v));                          // 3. Hilfspolynom, Startwert
    var i = 1;                                             // Zähler, Startwert
    while (!t2.equals(t3)) {                               // Solange t2 und t3 verschieden ...
      var t = t1.mul(t3).div(t2).div(t2);                  // t1 * t3 / (t2)^2
      f.push(t);                                           // Array der quadratfreien Faktoren ergänzen
      p = p.div(t.pow(i));                                 // p durch Potenz des neuen Faktors dividieren
      t1 = t2; t2 = t3;                                    // Rollentausch Hilfspolynome
      t3 = t2.gcd(t2.deriv(v));                            // 3. Hilfspolynom neu
      i++;                                                 // Zähler erhöhen
      } // Ende while
    t = t1.mul(t3).div(t2).div(t2);                        // t1 * t3 / (t2)^2
    f.push(t1.mul(t3).div(t2).div(t2));                    // Array der quadratfreien Faktoren ergänzen
    p = p.div(t.pow(i));                                   // Restfaktor (Polynom der Variablen mit höherem Index)
    if (v == variables.length-1) f[0] = p;                 // Falls letzte Variable, Vorfaktor setzen (Rekursionsende)
    else {                                                 // Falls nicht letzte Variable ...
      var f0 = p.squarefree(v+1);                          // Quadratfreie Zerlegung des Restfaktors (Rekursion)  
      var ff = [f0[0]];                                    // Neues Array mit übernommenem Vorfaktor
      for (var e=1; e<Math.max(f.length,f0.length); e++) { // Für alle Indizes bzw. Exponenten ...
        ff[e] = undefined;                                 // Arrayelement zunächst undefiniert
        if (f[e] == undefined) ff[e] = f0[e];              // Entweder Arrayelement von f0 übernehmen ...
        else if (f0[e] == undefined) ff[e] = f[e];         // ... oder von f übernehmen ...
        else ff[e] = f0[e].mul(f[e]);                      // ... oder Produkt von f0 und f übernehmen
        }
      f = ff;                                              // Bisheriges Array durch neues Array ersetzen
      }
    for (e=1; e<f.length; e++) {                           // Für alle Indizes bzw. Exponenten ...
      var y = f[e].factor0();                              // Gemeinsamer Faktor (Zahl mal Variablenpotenz)
      f[0] = f[0].mul(y.pow(e));                           // In den Vorfaktor verschieben
      f[e] = f[e].div(y);                                  // Quadratfreien Faktor entsprechend reduzieren
      }
    while (f[f.length-1] == undefined || f[f.length-1].isOne()) // Solange letzter Faktor unnötig ...
      f.pop();                                             // Letzten Faktor weglassen
    return f;                                              // Rückgabewert
    }
    
// Array der Teiler für ein konstantes Polynom (Typ Polynomial[]):
// Die Teiler sind nicht nach Größe sortiert.

  allDivisorsInt () {
    if (!this.isInt()) return undefined;                   // Falls Polynom nicht konstant, Rückgabewert undefiniert
    if (this.isZero()) return undefined;                   // Falls Nullpolynom, Rückgabewert undefiniert
    var aBig = allDivisorsBig(this.list[0].coeff);         // Array der Teiler (Typ BigInt[])
    var a = new Array(aBig.length);                        // Neues Array (Typ Polynomial[])
    for (var i=0; i<aBig.length; i++)                      // Für alle Indizes ...
      a[i] = newPolynomialInt(aBig[i]);                    // Konstantes Polynom als Array-Element
    return a;                                              // Rückgabewert
    }
    
// Hilfsroutine: Potenz einer Variablen (Typ Polynomial)
// v ... Index der Variablen (0 bis variables.length-1)
// e ... Exponent (Typ Number)
    
  powerVar (v, e) {
    var m = new Monomial();                                // Neues Monom mit Koeffizient 1
    m.expo[v] = e;                                         // Exponent übernehmen
    return new Polynomial(m);                              // Rückgabewert (Typ Polynomial)
    }
    
// Hilfsroutine: Array von Variablenpotenzen
// v ...... Index der Variablen (0 bis variables.length-1)
// eMax ... Maximaler Exponent

  powersVar (v, eMax) {
    var a = [];                                            // Leeres Array
    for (var e=0; e<=eMax; e++)                            // Für alle möglichen Exponenten ...
      a.push(this.powerVar(v,e));                          // Variablenpotenz zum Array hinzufügen
    return a;                                              // Rückgabewert
    }
    
// Hilfsroutine: Array aller Produkte von Elementen zweier Arrays:
// a1 ... 1. Array (Typ Polynomial[])
// a2 ... 2. Array (Typ Polynomial[])

  prodArrays (a1, a2) {
    var a = [];                                            // Leeres Array
    for (var i=0; i<a1.length; i++)                        // Für alle Indizes zum Array a1 ...
      for (var j=0; j<a2.length; j++)                      // Für alle Indizes zum Array a2 ...
        a.push(a1[i].mul(a2[j]));                          // Produkt zum Array a hinzufügen
    return a;                                              // Rückgabewert
    } 
    
// Array von Potenzen des gegebenen Polynoms:
// eMax ... Maximaler Exponent (natürliche Zahl oder 0)

  arrayPowers (eMax) {
    var a = [];                                            // Leeres Array
    var p = newPolynomialInt(1n);                          // Startwert 1 für Produkt
    for (var e=0; e<=eMax; e++) {                          // Für alle Exponenten von 0 bis eMax ...
      a.push(p);                                           // Potenz zum Array hinzufügen
      if (e < eMax) p = p.mul(this);                       // Falls sinnvoll, bisheriges Produkt mit Basis multiplizieren
      } // Ende for (e)
    return a;                                              // Rückgabewert
    }
    
// Array der Teiler:
// v ... Index der Hauptvariablen (0 bis variables.length-1) oder (bei konstantem Polynom) variables.length
// Es wird vorausgesetzt, dass das gegebene Polynom keine Variablen mit kleinerem Index als v enthält.
// Die Methode wird benötigt für den (ineffizienten) Von-Schubert- beziehungsweise Kronecker-Algorithmus.

  allDivisors (v) {
    if (v == variables.length)                             // Falls Polynom konstant ...
      return this.allDivisorsInt();                        // Rückgabewert
    var c = this.factor0();                                // Vorfaktor (Typ Polynomial)
    var m = c.list[0];                                     // Entsprechendes Monom
    var a0 = allDivisorsBig(m.coeff);                      // Array der konstanten Teiler (Typ BigInt[])
    var a = new Array(a0.length);                          // Neues Array für Teiler (Typ Polynomial[])
    for (var i=0; i<a0.length; i++)                        // Für alle Indizes ...
      a[i] = newPolynomialInt(a0[i]);                      // Array-Element (Typ Polynomial)
    for (var k=v; k<variables.length; k++) {               // Für alle Variablen-Indizes ab v ...
      var a2 = this.powersVar(k,m.expo[k]);                // Array der Variablenpotenzen
      aa = this.prodArrays(a,a2);                          // Array der Produkte von a-Elementen und a2-Elementen
      a = aa;                                              // Zwischenergebnis-Array wird aktuelles Array
      }
    var p = this.div(c);                                   // Division des aktuellen Arrays durch den Vorfaktor
    var f = p.factorize(v);                                // Faktorisierung von p (Seiteneffekt factors)
    for (i=1; i<f.length; i++) {                           // Für alle Exponenten der quadratfreien Zerlegung ...
      if (f[i] == undefined) continue;                     // Falls Exponent nicht vorkommt, weiter zum nächsten
      for (var j=0; j<f[i].length; j++) {                  // Für alle Indizes zur Zerlegung des quadratfreien Faktors f[i] ...
        a2 = f[i][j].arrayPowers(i);                       // Array der möglichen Potenzen von f[i][j]
        var aa = this.prodArrays(a,a2);                    // Array der Produkte von a-Elementen und a2-Elementen
        a = aa;                                            // Zwischenergebnis-Array wird aktuelles Array 
        }
      } 
    return a;                                              // Rückgabewert
    }
    
// Einsetzen einer Zahl für eine Variable:
// v ... Index der Variablen (0 bis variables.length-1)
// n ... Zahl (Typ BigInt)

  subst (v, n) {
    var r = new Polynomial();                              // Neues Polynom
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++) {                      // Für alle Monom-Indizes ...
      var m = li[i].subst(v,n);                            // Einsetzen der Zahl ins aktuelle Monom
      r.addMonomial(m);                                    // Zum Ergebnispolynom addieren
      }
    return r;                                              // Rückgabewert
    }
    
// Überprüfung, ob sämtliche Monome negative Koeffizienten haben:
    
  isNegative () {
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++)                        // Für alle Monom-Indizes ...
      if (li[i].coeff > 0n) return false;                  // Falls Koeffizient positiv, Rückgabewert false
    return true;                                           // Falls nur negative Koeffizienten, Rückgabewert true
    }
    
// Linearfaktor bezüglich einer Hauptvariablen:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Es wird vorausgesetzt, dass Variable mit einem kleineren Index als v nicht vorkommen.
// Der in den Kommentaren vorkommende Ring R ist der Ring der Polynome mit ganzzahligen Koeffizienten
// und Variablen mit Index größer als v.
// Falls kein Linearfaktor gefunden wird, ist der Rückgabewert undefined.

  linearFactor (v) {
    while (this.degree(v) < 1 && v < variables.length-1)   // Solange Hauptvariable nicht vorkommt ...
      v++;                                                 // Index der Hauptvariablen hochzählen
    var x = newPolynomialInt(1n);                          // Polynom mit Wert 1
    x.list[0].expo[v] = 1;                                 // Polynom für Hauptvariable
    var f0 = this.subst(v,0n);                             // Für Hauptvariable 0 einsetzen 
    var d0 = f0.allDivisors(v+1);                          // Array der Teiler von f0 (im Ring R) 
    var f1 = this.subst(v,1n);                             // Für Hauptvariable 1 einsetzen
    if (f1.isZero())                                       // Falls Ergebnis gleich 0 ...
      return x.sub(newPolynomialInt(1n));                  // Rückgabewert Hauptvariable minus 1
    var d1 = f1.allDivisors(v+1);                          // Array der Teiler von f1 (im Ring R)
    for (var i=0; i<d0.length; i++) {                      // Für alle Indizes zum Array d0 ...
      var c0 = d0[i];                                      // Koeffizient Grad 0 für Linearfaktor (Typ Polynomial)
      for (var k=0; k<d1.length; k++) {                    // Für alle Indizes zum Array d1 ...
        var c1 = d1[k].sub(c0);                            // Koeffizient Grad 1 für Linearfaktor (Typ Polynomial)
        if (c1.isZero()) continue;                         // Falls Koeffizient 0, weiter zur nächsten Index-Kombination
        var p = c1.mul(x).add(c0);                         // c1 mal Hauptvariable plus c0
        if (this.div(p) == undefined) continue;            // Falls kein Teiler, weiter zur nächsten Index-Kombination
        if (p.leadingCoefficient(v).isNegative())          // Eventuell ...
          p.changeSign();                                  // Vorzeichenumkehr
        return p;                                          // Falls Teiler, Rückgabewert
        } // Ende for (k)
      } // Ende for (i)
    }
    
// Hilfsroutine: Produkt des gegebenen Polynoms und einer BigInt-Zahl
// n ... Gegebene BigInt-Zahl (Faktor)

  mulInt (n) {
    var p = this.clone();                                  // Kopie des gegebenen Polynoms
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++)                        // Für alle Monom-Indizes ...
      p.list[i].coeff = li[i].coeff*n;                     // Koeffizient
    return p;                                              // Rückgabewert
    }
    
// Hilfsroutine: Quotient des gegebenen Polynoms und einer BigInt-Zahl
// n ... Gegebene BigInt-Zahl (Divisor)
// Falls der Divisor gleich 0 ist oder die ganzzahlige Division nicht aufgeht, ist der Rückgabewert undefined. 

  divInt (n) {
    if (n == 0n) return undefined;                         // Rückgabewert, falls Divisor gleich 0
    var p = this.clone();                                  // Kopie des gegebenen Polynoms
    var li = this.list;                                    // Abkürzung für Liste der Monome
    for (var i=0; i<li.length; i++) {                      // Für alle Monom-Indizes ...
      var c = li[i].coeff;                                 // Koeffizient des aktuellen Monoms
      if (c%n != 0n) return undefined;                     // Rückgabewert, falls Division nicht aufgeht
      p.list[i].coeff = c/n;                               // Neuer Koeffizient
      }
    return p;                                              // Rückgabewert (Normalfall)
    }
    
// Quadratischer Faktor bezüglich einer Hauptvariablen:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Es wird vorausgesetzt, dass Variable mit einem kleineren Index als v nicht vorkommen und dass kein linearer Faktor vorhanden ist.
// Der in den Kommentaren vorkommende Ring R ist der Ring der Polynome mit ganzzahligen Koeffizienten
// und Variablen mit Index größer als v.
// Falls kein quadratischer Faktor gefunden wird, ist der Rückgabewert undefined.

  quadraticFactor (v) {
    while (this.degree(v) < 1 && v < variables.length-1)   // Solange Hauptvariable nicht vorkommt ...
      v++;                                                 // Index der Hauptvariablen hochzählen
    var f0 = this.subst(v,0n);                             // Für Hauptvariable 0 einsetzen 
    var d0 = f0.allDivisors(v+1);                          // Array der Teiler von f0 (in R)
    var f1 = this.subst(v,1n);                             // Für Hauptvariable 1 einsetzen
    var d1 = f1.allDivisors(v+1);                          // Array der Teiler von f1 (in R)
    var f2 = this.subst(v,2n);                             // Für Hauptvariable 2 einsetzen
    var d2 = f2.allDivisors(v+1);                          // Array der Teiler von f2 (in R)
    for (var i=0; i<d0.length; i++) {                      // Für alle Indizes zum Array d0 ...
      var dd0 = d0[i];                                     // Aktueller Teiler von f0 (Typ Polynomial)
      for (var k=0; k<d1.length; k++) {                    // Für alle Indizes zum Array d1 ...
        var dd1 = d1[k];                                   // Aktueller Teiler von f1 (Typ Polynomial)
        for (var m=0; m<d2.length; m++) {                  // Für alle Indizes zum Array d2 ...
          var dd2 = d2[m];                                 // Aktueller Teiler von f2 (Typ Polynomial)
          var c0 = dd0;                                    // Koeffizient Grad 0 (Typ Polynomial)
          var c1 = dd0.mulInt(-3n);                        // Koeffizient Grad 1, Zwischenergebnis (Typ Polynomial)
          c1 = c1.add(dd1.mulInt(4n));                     // Koeffizient Grad 1, Zwischenergebnis (Typ Polynomial)
          c1 = c1.sub(dd2);                                // Koeffizient Grad 1, Zwischenergebnis (Typ Polynomial)
          c1 = c1.divInt(2n);                              // Koeffizient Grad 1 (Typ Polynomial) oder undefined
          if (c1 == undefined) continue;                   // Falls Koeffizient undefiniert, weiter zur nächsten Index-Kombination
          var c2 = dd0;                                    // Koeffizient Grad 2, Zwischenergebnis (Typ Polynomial)
          c2 = c2.sub(dd1.mulInt(2n));                     // Koeffizient Grad 2, Zwischenergebnis (Typ Polynomial)
          c2 = c2.add(dd2);                                // Koeffizient Grad 2, Zwischenergebnis (Typ Polynomial)
          c2 = c2.divInt(2n);                              // Koeffizient Grad 2 (Typ Polynomial) oder undefined
          if (c2 == undefined) continue;                   // Falls Koeffizient undefiniert, weiter zur nächsten Index-Kombination
          var x = newPolynomialInt(1n);                    // Polynom mit Wert 1
          x.list[0].expo[v] = 1;                           // Polynom für Hauptvariable
          var q = c2.mul(x).add(c1).mul(x).add(c0);        // Horner-Schema für quadratischen Faktor
          if (q.degree(v) < 2) continue;                   // Falls Grad zu klein, weiter zur nächsten Index-Kombination
          if (this.div(q) == undefined) continue;          // Falls kein Teiler, weiter zur nächsten Index-Kombination
          if (q.leadingCoefficient(v).isNegative())        // Eventuell ... 
            q.changeSign();                                // Vorzeichenumkehr
          return q;                                        // Falls Teiler gefunden, Rückgabewert
          } // Ende for (m)
        } // Ende for (k)
      } // Ende for (i)
    }
    
// Lagrange-Polynom:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// d ... Array der Stützwerte (Polynome der Variablen mit Index größer als v)
// n sei die um 1 verkleinerte Länge des Arrays d. Als Stützstellen werden die ganzen Zahlen 0 bis n verwendet.
// Die Methode liefert ein Polynom, dessen Grad höchstens gleich n ist. Falls das Lagrange-Polynom nicht-ganzzahlige Koeffizienten
// hätte, ist der Rückgabewert undefined.

  lagrange (v, d) {
    var x = newPolynomialInt(1n);                          // Neues Polynom mit Wert 1
    x.list[0].expo[v] = 1;                                 // Polynom für Hauptvariable
    var p = new Polynomial();                              // Neues Polynom für Lagrange-Interpolation
    var f = 1n;                                            // Faktor zur Erzwingung ganzzahliger Koeffizienten
    for (var i=0; i<d.length; i++) {                       // Für alle Stützwert-Indizes ...
      var s = d[i].mulInt(f);                              // Startwert für Produkt
      for (var j=0; j<d.length; j++) {                     // Für alle Faktoren-Indizes ...
        if (j == i) continue;                              // Falls Indizes gleich, weiter zum nächsten
        var y = x.sub(newPolynomialInt(BigInt(j)));        // Zähler des aktuellen Faktors           
        s = s.mul(y);                                      // Zwischenergebnis Produkt aktualisieren
        var q = s.divInt(BigInt(i-j));                     // Nenner des aktuellen Faktors
        if (q != undefined) s = q;                         // Falls Division aufgeht, Produkt aktualisieren
        else {                                             // Falls Division nicht aufgeht ...
          var ff = BigInt(i-j);                            // Neuer Faktor
          f = f*ff;                                        // Gesamtfaktor f aktualisieren
          p = p.mulInt(ff);                                // Polynom mit neuem Faktor multiplizieren         
          }
        } // Ende for (j)
      p = p.add(s);                                        // Aktuellen Summanden addieren                          
      } // Ende for (i)         
    p = p.divInt(f);                                       // Endgültiges Lagrange-Polynom oder undefined     
    return p;                                              // Rückgabewert
    }

// Faktor mit gegebenem Grad bezüglich der Hauptvariablen:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// n ... Grad des Faktors bezüglich der Hauptvariablen

  factorDegree (v, n) {
    while (this.degree(v) < 1 && v < variables.length-1)   // Solange Hauptvariable nicht vorkommt ...
      v++;                                                 // Index der Hauptvariablen hochzählen  
    var d = [];                                            // Leeres Array (später zweifach indiziert)
    for (var i=0; i<=n; i++) {                             // Für alle ganzen Zahlen von 0 bis n ...
      var f = this.subst(v,BigInt(i));                     // Zahl i für Hauptvariable einsetzen
      var df = f.allDivisors(v+1);                         // Array der Teiler von f (im Ring R)
      d.push(df);                                          // Zum Array d hinzufügen
      }
    var iMax = 1;                                          // Startwert für Anzahl der Index-Kombinationen
    for (i=0; i<=n; i++) iMax = iMax*d[i].length;          // Anzahl der Index-Kombinationen
    if (iMax > 100000) alert("Zahl der Index-Kombinationen sehr gro\u00DF!");
    // In der folgenden Schleife repräsentiert i eine Index-Kombination.
    for (i=0; i<iMax; i++) {                               // Für alle Index-Kombinationen ...
      var a = [];                                          // Neues Array für Index-Kombination
      var q2 = iMax;                                       // Hilfsgröße
      var ii = i;                                          // Index als Hilfsgröße übernehmen
      for (var k=0; k<=n; k++) {                           // Für alle Stützwert-Indizes ...
        q2 = q2/d[k].length;                               // Hilfsgröße aktualisieren
        a.push(Math.floor(ii/q2));                         // Neuer Index der Kombination
        ii = ii%q2;                                        // Hilfsgröße aktualisieren
        } // Ende for (k)
      var dd = new Array(n+1);                             // Neues Array für Stützwerte
      for (k=0; k<=n; k++) dd[k] = d[k][a[k]];             // Einzelne Stützwerte als Array-Elemente
      var p = this.lagrange(v,dd);                         // Lagrange-Polynom
      if (p == undefined) continue;                        // Falls undefiniert, weiter zur nächsten Index-Kombination
      if (p.degree(v) < n) continue;                       // Falls Grad zu klein, weiter zur nächsten Index-Kombination
      if (this.div(p) == undefined) continue;              // Falls kein Teiler von p, weiter zur nächsten Index-Kombination
      return p;                                            // Rückgabewert
      } // Ende for (i)
    }
    
// Faktoren eines primitiven, quadratfreien Polynoms:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Rückgabewert: Array der Faktoren
    
  factorsSquareFree (v) {
    var p = this.clone();                                  // Kopie des gegebenen Polynoms
    while (v < variables.length && p.degree(v) < 1)        // Solange Variable nicht vorkommt ...
      v++;                                                 // Index der Hauptvariablen hochzählen
    var a = [];                                            // Leeres Array
    var lf = p.linearFactor(v);                            // Linearfaktor oder undefined
    while (lf != undefined) {                              // Solange Linearfaktor definiert ...
      a.push(lf);                                          // Zum Array hinzufügen
      p = p.div(lf);                                       // Polynomdivision
      lf = p.linearFactor(v);                              // Neuer Linearfaktor oder undefined 
      }
    var qf = p.quadraticFactor(v);                         // Quadratischer Faktor oder undefined
    while (qf != undefined) {                              // Solange quadratischer Faktor definiert ...
      a.push(qf);                                          // Zum Array hinzufügen
      p = p.div(qf);                                       // Polynomdivision
      qf = p.quadraticFactor(v);                           // Neuer quadratischer Faktor oder undefined                
      }
    for (var n=3; n<=p.degree(v)/2; n++) {                 // Für mögliche Grade ab 3 ...
      if (n > 4) {                                         // Falls Grad über 4 (Rechenzeit!) ...
        alert(incompleteFactorization);                    // Fehlermeldung
        a.push(p);                                         // Polynom unzerlegt zum Array hinzufügen
        return a;                                          // Rückgabewert
        }
      var ff = p.factorDegree(v,n);                        // Faktor vom Grad n oder undefined
      while (ff != undefined) {                            // Solange Faktor definiert ...
        a.push(ff);                                        // Zum Array hinzufügen
        p = p.div(ff);                                     // Polynomdivision
        ff = p.factorDegree(v,n);                          // Neuer Faktor vom Grad n oder undefined
        }
      } // Ende for (n)
    if (!p.isInt()) a.push(p);                             // Eventuell weiteren Faktor hohen Grades zum Array hinzufügen
    if (p.negate().isOne()) {                              // Falls verbleibendes Polynom gleich -1 ...
      var f = a.pop();                                     // Letztes Array-Element
      a.push(f.negate());                                  // Mit umgekehrtem Vorzeichen wieder hinzufügen
      }
    return a;                                              // Rückgabewert
    }
    
// Hilfsroutine: Optimierung der Vor- bzw. Rechenzeichen in der Faktorisierung;
// a ... Array der Faktorisierung, aufgebaut wie das Attribut factors; das Array wird verändert

  optimizeSigns (a) {
    var sign = 1;                                          // Vorzeichenfaktor, Startwert
    for (var i=1; i<a.length; i++) {                       // Für alle Indizes (Exponenten) der quadratfreien Zerlegung ...
      if (a[i] == undefined) continue;                     // Falls Faktor 1, weiter zum nächsten Index
      var odd = (i%2 != 0);                                // Flag für ungeraden Exponenten
      for (var k=0; k<a[i].length; k++) {                  // Für alle Indizes der weiteren Zerlegung ...
        if (a[i][k].isNegative()) {                        // Falls Einzelfaktor ungünstig ...
          a[i][k].changeSign();                            // Vorzeichenumkehr
          if (odd) sign = -sign;                           // Falls ungerader Exponent, Vorzeichenfaktor umkehren
          } 
        } // Ende for (k)
      } // Ende for (i)
    if (sign < 0) a[0].changeSign();                       // Falls nötig, Vorfaktor umkehren
    }
    
// Hilfsroutine: Überprüfung der Faktorisierung
// a ... Array der Faktorisierung, aufgebaut wie das Attribut factors

  testFactors (a) {
    var p = a[0];                                          // Vorfaktor
    for (var i=1; i<a.length; i++) {                       // Für alle Indizes (Exponenten) der quadratfreien Zerlegung ...
      if (a[i] == undefined) continue;                     // Falls Faktor 1, weiter zum nächsten Index
      var q = newPolynomialInt(1n);                        // Neues Polynom mit Wert 1
      for (var k=0; k<a[i].length; k++)                    // Für alle Indizes der weiteren Zerlegung ...
        q = q.mul(a[i][k]);                                // Einzelfaktor multiplizieren
      p = p.mul(q.pow(i));                                 // Mit Potenz des Produkts q multiplizieren
      } // Ende for (i)
    if (!p.equals(this))                                   // Falls Probe falsch ...
      alert("Abweichung: "+this+"; "+p);                   // Fehlermeldung
    }
    
// Faktorisierung des Polynoms:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Der Rückgabewert ist ein Array, das folgendermaßen aufgebaut ist: Das erste Array-Element (mit Index 0) ist
// der Vorfaktor, bestehend aus dem ggT der Koeffizienten und dem ggT der Variablenpotenzen. Die weiteren
// Array-Elemente (Index ab 1) entsprechen der quadratfreien Zerlegung, wobei der Index jeweils mit dem zugehörigen Exponenten
// übereinstimmt. Die genannten Array-Elemente sind undefiniert, wenn es keinen Faktor zu dem betreffenden Index (Exponent) gibt,
// andernfalls Arrays der irreduziblen Faktoren, die sich aus einem Faktor der quadratfreien Zerlegung durch weitere Zerlegung 
// ergeben.
// Seiteneffekt factors

  factorize (v) {
    var a = this.squarefree(v);                            // Quadratfreie Zerlegung
    var aa = [a[0]];                                       // Neues Array mit übernommenem Vorfaktor
    for (var i=1; i<a.length; i++) {                       // Für alle Exponenten der quadratfreien Zerlegung ...
      if (a[i].isOne()) aa.push(undefined);                // Falls a[i] gleich 1, undefined hinzufügen
      else aa.push(a[i].factorsSquareFree(v));             // Sonst Array für Zerlegung von a[i] hinzufügen
      }
    this.optimizeSigns(aa);                                // Vorzeichen optimieren
    this.factors = aa;                                     // Ergebnis als Attribut factors abspeichern
    this.testFactors(aa);                                  // Überprüfung der Faktorisierung
    return aa;                                             // Rückgabewert
    }
    
// Umwandlung in eine Zeichenkette (Provisorium für Testzwecke):

  toString () {
    var li = this.list, n = li.length;                     // Abkürzungen
    if (n == 0) return "0";                                // Rückgabewert für Nullpolynom
    var s = "";                                            // Leere Zeichenkette
    for (var i=0; i<n; i++) {                              // Für alle Monom-Indizes ...
      if (i > 0) s += " ";                                 // Falls nicht erstes Monom, Leerzeichen
      s += li[i].toString(i==0);                           // Zeichenkette für Monom hinzufügen
      }
    return s;                                              // Rückgabewert
    }
    
// Breite in Pixeln für ausmultipliziertes Polynom:
// Wichtig: Die Methode width sollte der Methode write entsprechen.

  width () {
    var li = this.list, n = li.length;                     // Abkürzungen
    if (n == 0) return widthPix("0");                      // Rückgabewert für Nullpolynom
    var w0 = widthPix(" ");                                // Breite eines Leerzeichens (Pixel)
    var w = 0;                                             // Startwert Breite
    for (var i=0; i<n; i++) {                              // Für alle Monom-Indizes ...
      w += li[i].width(i==0);                              // Breite des aktuellen Monoms addieren
      if (i < n-1) w += w0;                                // Falls nicht letztes Monom, Leerzeichenbreite addieren
      }
    return w;                                              // Rückgabewert
    }
    
// Grafikausgabe für ausmultipliziertes Polynom:
// (x,y) ... Position (Pixel)
// Rückgabewert: Position am Ende (Pixel)

  write (x, y) {
    var li = this.list, n = li.length;                     // Abkürzungen
    if (n == 0) return writeString("0",x,y);               // Falls Nullpolynom, Null ausgeben, Rückgabewert
    var w0 = widthPix(" ");                                // Breite eines Leerzeichens (Pixel)
    for (var i=0; i<n; i++) {                              // Für alle Monom-Indizes ...
      x = li[i].write(x,y,i==0);                           // Monom ausgeben, neue Position
      if (i < n-1) x += w0;
      }
    return x;                                              // Rückgabewert (Position am Ende des Polynoms) 
    }
    
// Hilfsroutine: Breite in Pixeln für einen eingeklammerten Faktor:
// e ... Exponent (natürliche Zahl, nicht 0, Typ Number)
// Die Methode widthBrackPow sollte der Methode writeBrackPow entsprechen.

  widthBrackPow (e) {
    var w0 = widthPix(" ")/2;                              // Halbe Breite eines Leerzeichens (Pixel)
    var w = this.width();                                  // Breite des Klammerinhalts (Pixel)
    w += widthPix("()");                                   // Breite der Klammer addieren
    if (e > 1) w += widthPix(String(e));                   // Breite des Exponenten addieren
    return w;                                              // Rückgabewert
    }
    
// Hilfsroutine für Methode writeFactors: Potenz eines eingeklammerten Faktors:
// e ....... Exponent (natürliche Zahl, nicht 0, Typ Number)
// (x,y) ... Position (Pixel)
// Rückgabewert: Position am Ende (Pixel)

  writeBrackPow (e, x, y) {
    var w0 = widthPix(" ")/2;                              // Halbe Breite eines Leerzeichens (Pixel)
    x = writeString("(",x,y);                              // Klammer auf, neue Position (Pixel)
    x = this.write(x,y);                                   // Inhalt der Klammer, neue Position (Pixel)
    x = writeString(")",x,y);                              // Klammer zu, neue Position (Pixel)
    if (e > 1) x = writeString(String(e),x,y-8);           // Exponent größer als 1, neue Position (Pixel)
    return x;                                              // Rückgabewert (Position am Ende der Polynom-Potenz)
    }
    
// Breite in Pixeln für faktorisiertes Polynom:
// Wichtig: Die Methode widthFactors sollte der Methode writeFactors entsprechen.

  widthFactors () {
    if (this.isZero()) return widthPix("0");               // Sonderfall 0
    if (this.isOne()) return widthPix("1");                // Sonderfall 1
    if (this.negate().isOne()) return widthPix("- 1");     // Sonderfall -1
    var w0 = widthPix(" ")/2;                              // Halbe Breite eines Leerzeichens (Pixel)
    var w = 0;                                             // Startwert Breite
    var a = this.factors;                                  // Array für Faktorisierung
    if (a[0].negate().isOne()) w += widthPix("-");         // Falls Vorfaktor -1, w erhöhen (Minuszeichen)
    if (!a[0].isUnit()) w += a[0].width();                 // Falls Vorfaktor keine Einheit, w erhöhen (Vorfaktor)
    var n = a.length;                                      // Länge von Array a
    var br = !a[0].isOne() || (n > 2);                     // Flag für Klammer, Zwischenergebnis
    br = br || (n == 2 && a[1].length > 1);                // Flag für Klammer
    for (var i=1; i<a.length; i++) {                       // Für alle Indizes ab 1 ...
      var f = a[i];                                        // Aktueller Faktor (quadratfrei)
      if (f == undefined) continue;                        // Falls Faktor gleich 1, weiter zum nächsten Faktor
      for (var k=0; k<f.length; k++) {                     // Für alle Faktoren-Indizes ...
        if (br) w += f[k].widthBrackPow(i);                // Entweder w für Klammer (eventuell mit Exponent) erhöhen ...
        else w += f[k].width();                            // ... oder für alleinstehenden Faktor ohne Klammer
        } // Ende for (k)
      } // Ende for (i)
    return w;                                              // Rückgabewert
    }
    
// Hilfsroutine: Überprüfung der Breite in Pixeln für die Faktorisierung
// x0 ... Anfangsposition (Pixel)
// x .... Endposition (Pixel)

  testWidthFactors (x0, x) {
    var w = this.widthFactors();                           // Berechnete Breite (Pixel)
    var s = "Abweichende Breite bei "+this+":\n"           // Text der Fehlermeldung
      + w+"; "+(x-x0);
    if (x0+w != x) alert(s);                               // Falls Abweichung, Fehlermeldung
    }
    
// Grafikausgabe für faktorisiertes Polynom:
// (x,y) ... Position (Pixel)

  writeFactors (x, y) {
    var x0 = x;                                            // Waagrechte Koordinate (Anfangsposition) speichern
    if (this.isZero()) {writeString("0",x,y); return;}     // Sonderfall 0
    if (this.isOne()) {writeString("1",x,y); return;}      // Sonderfall 1
    if (this.negate().isOne()) {                           // Sonderfall -1
      writeString("- 1",x,y); return;
      }    
    var w0 = widthPix(" ")/2;                              // Halbe Breite eines Leerzeichens (Pixel)                             
    var a = this.factors;                                  // Array für Faktorisierung
    if (a[0].negate().isOne())                             // Falls Vorfaktor gleich -1 ...
      x = writeString("-",x,y);                            // Minuszeichen ausgeben, neue Position (Pixel)   
    if (!a[0].isUnit()) x = a[0].write(x,y);               // Falls sinnvoll, Vorfaktor ausgeben; neue Position (Pixel)
    var n = a.length;                                      // Länge von Array a
    var br = !a[0].isOne() || (n > 2);                     // Flag für Klammer, Zwischenergebnis
    br = br || (n == 2 && a[1].length > 1);                // Flag für Klammer
    for (var i=1; i<a.length; i++) {                       // Für alle Indizes ab 1 ...
      var f = a[i];                                        // Aktueller Faktor (quadratfrei)
      if (f == undefined) continue;                        // Falls Faktor gleich 1, weiter zum nächsten Faktor
      for (var k=0; k<f.length; k++) {                     // Für alle Faktoren-Indizes ...
        if (br) x = f[k].writeBrackPow(i,x,y);             // Entweder Klammer mit zugehörigem Exponenten ...
        else x = f[k].write(x,y);                          // ... oder alleinstehender Faktor ohne Klammer
        } // Ende for (k)
      } // Ende for (i)
    this.widthFactors(x0,x);                               // Eventuell Fehlermeldung wegen Breite 
    }
    
// Vorzeichen des Vorfaktors:
// Rückgabewert (Typ Number) +1 (für positiven Vorfaktor, -1 (für negativen Vorfaktor) oder 0 (für Nullpolynom)

  signFactor0 () {
    if (this.isZero()) return 0;                           // Rückgabewert, falls Nullpolynom
    var m = this.factors[0].list[0];                       // Monom des Vorfaktors
    return (m.coeff>0n ? 1 : -1);                          // Rückgabewert (Normalfall)
    }
    
  } // Ende der Klasse Polynomial
  
//-------------------------------------------------------------------------------------------------

// Globale Methoden:

// Hilfsroutine: Position des nächsten Plus- oder Minuszeichens nach einer gegebenen Position
// s ... Zeichenkette
// i ... Anfangsposition (gesucht wird ab dem folgenden Zeichen)
// Rückgabewert: Im Normalfall Position des ersten Plus- oder Minuszeichens; 
// falls kein Plus- oder Minuszeichen vorhanden, Position am Ende der Zeichenkette
  
function positionPM (s, i) {
  for (var k=i+1; k<s.length; k++) {                       // Für alle Zeichen-Indizes ab Anfangsposition ...
    var ch = s.charAt(k);                                  // Aktuelles Zeichen
    if (ch == "+" || ch == "-") return k;                  // Falls Plus- oder Minuszeichen, Rückgabewert
    }
  return s.length;                                         // Rückgabewert, falls kein Plus- oder Minuszeichen gefunden
  }
  
// Konstruktor-Ersatz:
// s ... Zeichenkette

function newPolynomial (s) {
  var p = new Polynomial();                                // Neues Polynom
  for (var i=0; i<s.length; i++) {                         // Für alle Zeichen-Indizes ...
    var k = positionPM(s,i);                               // Position des nächsten Plus- oder Minuszeichens bzw. Endposition
    var m = newMonomial(s.substring(i,k));                 // Neues Monom entsprechend der Teilzeichenkette
    p.addMonomial(m);                                      // Monom zum Polynom addieren
    i = k-1;                                               // Anfangsposition für nächstes Monom (Ausgleich für i++)
    }
  return p;                                                // Rückgabewert
  }
  
// Konstruktor-Ersatz für konstantes Polynom:
// c ... Konstante (Typ BigInt)

function newPolynomialInt (c) {
  if (c == 0n) return new Polynomial();                    // Rückgabewert, falls c gleich 0
  var m = new Monomial();                                  // Neues Monom mit Wert 1
  m.coeff = c;                                             // Koeffizient des Monoms
  return new Polynomial(m);                                // Rückgabewert
  }
  
// Array der Primfaktoren und zugehörigen Vielfachheiten für eine ganze Zahl:
// n ... Gegebene Zahl (Typ BigInt)
// Im Normalfall enthält das Ergebnis-Array Verbunde mit den Attributen f (Primfaktor, Typ BigInt) und e (Vielfachheit, Typ Number).
// Falls die gegebene Zahl gleich 0 ist, ist der Rückgabewert undefined.
  
function factorsBig (n) {
  if (n == 0n) return undefined;                           // Rückgabewert, falls Zahl 0 gegeben
  var c = (n>=0 ? n : 0n-n);                               // Betrag von n
  var a = [];                                              // Leeres Array
  var t0 = 0n;                                             // Startwert für aktuellen Teiler
  while (c > 1n) {                                         // Solange c größer als 1 ...
    var t = firstPrime(c);                                 // Kleinster Primfaktor
    if (t > t0) {                                          // Falls neuer Primfaktor ...
      a.push({f: t, e: 1});                                // Mit Vielfachheit 1 zum Array hinzufügen
      t0 = t;                                              // Aktueller Teiler neu
      }
    else {                                                 // Falls letzter Primfaktor nochmal ...
      var p = a.pop();                                     // Bisheriger Verbund (Primfaktor/Vielfachheit)
      p.e++;                                               // Vielfachheit erhöhen
      a.push(p);                                           // Veränderten Verbund (Primfaktor/Vielfachheit) zum Array hinzufügen
      }
    c = c/t;                                               // Durch den Primfaktor dividieren
    }   
  return a;                                                // Rückgabewert
  }
  
// Array der Teiler einer ganzen Zahl:
// n ... Gegebene Zahl (Typ BigInt)
// Rückgabewert: Array aller Teiler (Typ BigInt[]); für die Zahl 0 ist der Rückgabewert undefined. 

function allDivisorsBig (n) {
  if (n == 0n) return undefined;                           // Falls Zahl 0, Rückgabewert undefined
  var a1 = factorsBig(n);                                  // Array der Primfaktoren und Vielfachheiten
  var e1 = 1n, e2 = -1n;                                   // Einheiten +1 und -1 (Typ BigInt)
  var a = [e1, e2];                                        // Array für Rückgabewert, zunächst mit Einheiten 
  for (var i=0; i<a1.length; i++) {                        // Für alle Indizes ...               
    var f = a1[i].f, e = a1[i].e;                          // Aktueller Primfaktor (BigInt) und zugehörige Vielfachheit (Number)
    var a2 = [];                                           // Leeres Array für Potenzen des aktuellen Primfaktors
    for (var k=0; k<=e; k++)                               // Für alle Exponenten ... 
      a2.push(f**BigInt(k));                               // Element (Primzahlpotenz, Typ BigInt) zum Array hinzufügen
    var aa = [];                                           // Leeres Array für neues Zwischenergebnis
    for (var n=0; n<a.length; n++)                         // Für alle Indizes zum bisher ermittelten Array ...
      for (var m=0; m<a2.length; m++)                      // Für alle Indizes zum Array der Primzahlpotenzen ... 
        aa.push(a[n]*a2[m]);                               // Produkt (Typ BigInt) zum neuen Array hinzufügen
    a = aa;                                                // Neues Array als aktuelles Zwischenergebnis
    } // Ende for (i)
  return a;                                                // Rückgabewert
  }
  

  

  
