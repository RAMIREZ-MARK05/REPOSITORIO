// Klasse Polynomial (multivariates Polynom der Variablen a bis z mit ganzzahligen Koeffizienten)

// Das Attribut list realisiert eine Liste von Monomen, die nicht zueinander �quivalent sein sollen. Beim Nullpolynom
// ist diese Liste leer.

// Das Attribut factors ist ein im Wesentlichen zweifach indiziertes Array, das die Zerlegung in irreduzible Faktoren
// beschreibt: Das Element mit Index 0 ist der Vorfaktor (ggT der Koeffizienten mal ggT der Variablenpotenzen).
// Die weiteren Elemente (Index ab 1) sind entweder Arrays, die sich aus den Faktoren der quadratfreien Zerlegung durch weitere Zerlegung
// ergeben, oder undefined. Der erste Index ist zugleich der Exponent, der zu einem Faktor geh�rt.

// 01.07.2020 - 17.08.2020

class Polynomial {

// Konstruktor f�r ein Polynom mit h�chstens einem Monom:
// m ... Gegebenes Monom (optional); ist m nicht definiert, liefert der Konstruktor ein Nullpolynom.

  constructor (m) {
    this.list = [];                                        // Leere Liste von Monomen
    if (m != undefined) this.list.push(m);                 // Falls Monom definiert, zur Liste hinzuf�gen
    this.factors = undefined;                              // Zerlegung in Faktoren noch undefiniert
    }
    
// Kopie:

  clone () {
    var r = new Polynomial();                              // Neues Polynom 
    var li = this.list;                                    // Abk�rzung f�r die Liste der Monome
    for (var i=0; i<li.length; i++)                        // F�r alle Monom-Indizes ...
      r.list.push(li[i].clone());                          // Kopie des Monoms hinzuf�gen
    return r;                                              // R�ckgabewert
    }
    
// L�schung von Nullmonomen; das gegebene Polynom wird dabei ge�ndert.

  clearZeros () {
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++) {                      // F�r alle Monom-Indizes ...
      var m = li[i];                                       // Aktuelles Monom
      if (m.isZero()) {                                    // Falls Nullmonom ...
        for (var k=i; k<li.length-1; k++)                  // F�r alle folgenden Monom-Indizes ...
          li[k] = li[k+1];                                 // Aktuelles Monom nach links verschieben
        li.pop();                                          // Liste der Monome am Ende abschneiden
        i--;                                               // Index um 1 verkleinern (Schleife mit gleichem Index fortsetzen)
        } // Ende if
      } // Ende for (i)
    }
    
// Vorzeichenumkehr; das gegebene Polynom wird dabei ge�ndert.

  changeSign () {
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++)                        // F�r alle Monom-Indizes ...
      li[i].changeSign();                                  // Vorzeichen des aktuellen Monoms umkehren
    }
    
// Polynom mit umgekehrten Vor- bzw. Rechenzeichen:

  negate () {
    var r = this.clone();                                  // Kopie des gegebenen Polynoms
    r.changeSign();                                        // Vorzeichenumkehr
    return r;                                              // R�ckgabewert
    }
    
// Addition eines Monoms; das gegebene Polynom wird dabei ge�ndert.
// m ... Zus�tzliches Monom (2. Summand)

  addMonomial (m) {
    if (m.isZero()) return;                                // Falls Nullmonom, abbrechen
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++) {                      // F�r alle Monom-Indizes ...
      if (li[i].isEquiv(m)) {                              // Falls aktuelles Monom �quivalent zum neuen Monom ...
        li[i] = li[i].add(m);                              // Neues Monom zum aktuellen Monom addieren
        break;                                             // for-Schleife abbrechen
        }
      }
    if (i == li.length) li.push(m);                        // Falls kein gleichartiges Monom, am Ende der Liste hinzuf�gen
    this.clearZeros();                                     // Eventuell Nullmonome l�schen 
    }
    
// Summe des gegebenen Polynoms und eines weiteren Polynoms:
// p ... Zweites Polynom (2. Summand)

  add (p) {
    var r = this.clone();                                  // Kopie des gegebenen Polynoms
    for (var i=0; i<p.list.length; i++)                    // F�r alle Monom-Indizes des anderen Polynoms ...
      r.addMonomial(p.list[i]);                            // Monom addieren
    return r;                                              // R�ckgabewert
    }
    
// Subtraktion eines Monoms; das gegebene Polynom wird dabei ge�ndert.
// m ... Zus�tzliches Monom (Subtrahend)

  subMonomial (m) {
    this.addMonomial(m.negate());                          // Entgegengesetztes Monom addieren                    
    }
    
// Differenz des gegebenen Polynoms und eines weiteren Polynoms:
// p ... Zweites Polynom (Subtrahend)

  sub (p) {
    var r = this.clone();                                  // Kopie des gegebenen Polynoms
    for (var i=0; i<p.list.length; i++)                    // F�r alle Monom-Indizes des anderen Polynoms ...
      r.subMonomial(p.list[i]);                            // Monom subtrahieren
    return r;                                              // R�ckgabewert
    }
    
// Produkt des gegebenen Polynoms und eines Monoms
// m ... Monom (2. Faktor)

  mulMonomial (m) {
    var r = this.clone();                                  // Kopie des gegebenen Polynoms
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++)                        // F�r alle Monom-Indizes ...
      r.list[i] = li[i].mul(m);                            // Aktuelles Monom mit neuem Monom multiplizieren
    return r;                                              // R�ckgabewert
    }
    
// Produkt des gegebenen Polynoms und eines weiteren Polynoms:
// p ... Weiteres Polynom (2. Faktor)

  mul (p) {
    var r = new Polynomial();                              // Neues Polynom f�r Ergebnis
    var li1 = this.list, li2 = p.list;                     // Abk�rzungen f�r Monom-Listen
    for (var i=0; i<li1.length; i++) {                     // F�r alle Monom-Indizes des gegebenen Polynoms ...
      for (var k=0; k<li2.length; k++) {                   // F�r alle Monom-Indizes des anderen Polynoms ...
        var m = li1[i].mul(li2[k]);                        // Neues Monom (Produkt zweier Monome)
        r.addMonomial(m);                                  // Zum Zwischenergebnis addieren
        }
      }
    return r;                                              // R�ckgabewert
    }
    
// Potenz des gegebenen Polynoms und einer nicht-negativen ganzen Zahl:
// e ... Exponent (Typ Number, ganzzahlig)
    
  pow (e) {
    if (e == undefined) return undefined;                  // R�ckgabewert, falls Exponent undefiniert
    if (e < 0) return undefined;                           // R�ckgabewert, falls Exponent negativ
    var p = newPolynomialInt(1n);                          // Variable f�r Produkt (Typ Polynomial), Startwert 1
    while (e > 0) {                                        // Solange e positiv ...
      p = p.mul(this);                                     // Bisheriges Produkt mit Basis multiplizieren
      e--;                                                 // e um 1 erniedrigen
      }
    return p;                                              // R�ckgabewert
    }
    
// Division durch eine BigInt-Zahl; das gegebene Polynom wird dabei ge�ndert.
// z ... BigInt-Zahl (Divisor, ungleich 0)

  divBigInt (z) {
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++)                        // F�r alle Monom-Indizes ...
      li[i].coeff = li[i].coeff/z;                         // Koeffizient des aktuellen Monoms durch z dividieren
    }
    
// Division durch eine Potenz einer Variablen; das gegebene Polynom wird dabei ge�ndert.
// v ... Index der Variablen (0 bis variables.length-1)
// e ... Exponent (Typ Number, ganzzahlig, nicht so gro�, dass negative Exponenten herauskommen!)

  divVarPow (v, e) {
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++)                        // F�r alle Monom-Indizes ...
      li[i].expo[v] = li[i].expo[v]-e;                     // Exponent aktualisieren (darf nicht negativ sein!)
    }
    
// Gr��ter gemeinsamer Teiler aller Koeffizienten:
// R�ckgabewert vom Typ BigInt und positiv, im Falle des Nullpolynoms undefined
  
  gcdCoeff () {
    var li = this.list, n = li.length;                     // Abk�rzungen
    if (n == 0) return undefined;                          // R�ckgabewert, falls Nullpolynom
    var r = li[0].coeff;                                   // Startwert (Koeffizient des ersten Monoms)
    for (var i=1; i<n; i++) r = gcd(r,li[i].coeff);        // F�r alle weiteren Monom-Indizes aktualisieren
    return (r>=0n ? r : 0n-r);                             // R�ckgabewert (Betrag)
    }
    
// Minimaler Exponent bez�glich einer Variablen:
// v ... Index der Variablen (0 bis variables.length-1)

  minExpo (v) {
    var li = this.list, n = li.length;                     // Abk�rzungen
    if (n == 0) return 0;                                  // R�ckgabewert, falls Nullpolynom
    var min = li[0].expo[v];                               // Startwert (Exponent im ersten Monom)
    for (var i=1; i<n; i++) {                              // F�r alle Monom-Indizes ...
      var e = li[i].expo[v];                               // Exponent bez�glich Variable im aktuellen Monom
      if (e < min) min = e;                                // Falls Exponent kleiner als bisher, Minimum aktualisieren
      }       
    return min;                                            // R�ckgabewert  
    }
    
// �berpr�fung, ob Polynom gleich 0:

  isZero () {
    return (this.list.length == 0);                        // R�ckgabewert
    }
    
// �berpr�fung, ob Polynom gleich 1:

  isOne () {
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    return (li.length == 1 && li[0].isOne());              // R�ckgabewert
    }
    
// �berpr�fung, ob das gegebene Polynom eine Einheit ist (+1 oder -1)

  isUnit () {
    if (this.isOne()) return true;                         // R�ckgabewert, falls Polynom gleich 1
    if (this.negate().isOne()) return true;                // R�ckgabewert, falls Polynom gleich -1
    return false;                                          // R�ckgabewert, falls weder 1 noch -1
    }
    
// �berpr�fung, ob Polynom konstant (ganze Zahl):

  isInt () {
    var li = this.list, n = li.length;                     // Abk�rzungen
    if (n > 1) return false;                               // R�ckgabewert, falls mehr als ein Monom
    if (n == 1) return li[0].isInt();                      // R�ckgabewert, falls genau ein Monom
    return true;                                           // R�ckgabewert, falls kein Monom vorhanden (Nullpolynom)
    }
    
// �berpr�fung der Gleichheit f�r das gegebene Polynom und ein weiteres Polynom:
// p ... Weiteres Polynom

  equals (p) {
    return this.sub(p).isZero();                           // R�ckgabewert (Differenz gleich 0?)
    }
    
// Grad in Bezug auf eine Hauptvariable:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// R�ckgabewert: Grad, im Falle des Nullpolynoms (leere Liste) -1
  
  degree (v) {
    var li = this.list, n = li.length;                     // Abk�rzungen
    if (n == 0) return -1;                                 // R�ckgabewert, falls Nullpolynom
    var max = li[0].expo[v];                               // Startwert (Exponent im ersten Monom)
    for (var i=1; i<n; i++) {                              // F�r alle weiteren Monom-Indizes ...
      var e = li[i].expo[v];                               // Aktueller Exponent                                 
      if (e > max) max = e;                                // Falls gr��er als bisher, Maximum aktualisieren
      }
    return max;                                            // R�ckgabewert
    }
    
// Leitmonom (lexikographische Ordnung entsprechend der Reihenfolge in variables):

  leadingMonomial () {
    var li = this.list, n = li.length;                     // Abk�rzungen
    if (n == 0) return undefined;                          // R�ckgabewert undefined, falls Nullpolynom
    var iMax = 0;                                          // Variable f�r entscheidenden Monom-Index, Startwert 
    var eMax = li[0].expo;                                 // Array der Exponenten f�r erstes Monom als Startwert f�r "Maximum"
    for (var i=1; i<n; i++) {                              // F�r alle weiteren Monom-Indizes ...
      var e = li[i].expo;                                  // Array der Exponenten f�r aktuelles Monom
      for (var v=0; v<variables.length; v++) {             // F�r alle Variablenindizes ...
        if (e[v] < eMax[v]) break;                         // Falls Exponent kleiner als bisher, v-Schleife verlassen
        else if (e[v] > eMax[v]) {                         // Falls Exponent gr��er als bisher ...
          iMax = i;                                        // Variable f�r entscheidenden Monom-Index aktualisieren
          eMax = e;                                        // "Maximales" Exponenten-Array aktualisieren
          break;                                           // v-Schleife verlassen 
          } 
        } // Ende for (v)
      } // Ende for (i)
    return li[iMax];                                       // R�ckgabewert
    }
    
// Koeffizient in Bezug auf eine Hauptvariable (im Allgemeinen Polynom der anderen Variablen):
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// e ... Exponent in Bezug auf die Hauptvariable

  getCoefficient (v, e) {
  	var r = new Polynomial();                               // Neues Polynom
  	var li = this.list;                                     // Abk�rzung f�r Liste der Monome
  	for (var i=0; i<li.length; i++) {                       // F�r alle Monom-Indizes ...
  	  var m = li[i];                                        // Aktuelles Monom
  	  if (m.expo[v] != e) continue;                         // Falls anderer Exponent, weiter zum n�chsten Monom-Index
  	  m = m.clone();                                        // Kopie des aktuellen Monoms
  	  m.expo[v] = 0;                                        // Exponent bez�glich der Hauptvariablen gleich 0
  	  r.addMonomial(m);                                     // Monom zum Ergebnis-Polynom addieren
  	  }
  	return r;                                               // R�ckgabewert
    }
    
// Leitkoeffizient in Bezug auf eine Hauptvariable:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// R�ckgabewert: Leitkoeffizient (Polynom in den anderen Variablen)

  leadingCoefficient (v) {
    var r = new Polynomial();                              // Neues Polynom (Nullpolynom)
    var d = this.degree(v);                                // Grad bez�glich der Hauptvariablen                
    if (d == 0) return r;                                  // Falls Hauptvariable nicht vorkommt, Nullpolynom als R�ckgabewert
    return this.getCoefficient(v,d);                       // R�ckgabewert (Normalfall)
    }
    
// Quotient des gegebenen Polynoms und eines weiteren Polynoms:
// p ... Weiteres Polynom (Divisor)
// Vorbedingung: Teilbarkeit ohne Rest; Algorithmus nach Leonid Kof (WWW-Seite zum Projekt SPOCK)
// Ist diese Bedingung nicht erf�llt, wird undefined zur�ckgegeben.
  
  div (p) {
    var f = this.clone();                                  // Kopie des Dividenden (Typ Polynomial)
    var q = new Polynomial();                              // Variable f�r Ergebnis-Polynom, Startwert 0
    while (!f.isZero()) {                                  // Solange f verschieden vom Nullpolynom ...
      var lm1 = f.leadingMonomial();                       // Leitmonom von f
      var lm2 = p.leadingMonomial();                       // Leitmonom von p
      var m = lm1.div(lm2);                                // Quotient der Leitmonome oder undefined
      if (m == undefined) return undefined;                // R�ckgabewert bei Misserfolg
      q.addMonomial(m);                                    // Zum Ergebnis-Polynom addieren
      f = f.sub(p.mulMonomial(m));                         // f aktualisieren
      }
    return q;                                              // R�ckgabewert (Normalfall)
    }
    
// Rest bez�glich Pseudodivision:
// Algorithmus nach Leonid Kof (WWW-Seite zum Projekt SPOCK); �nderung im ersten Teil
// p ... Divisor (Typ Polynomial)
// v ... Index der Hauptvariablen (0 bis variables.length-1)
  
  pseudoRemainder (p, v) {
    var degP = p.degree(v);                                // Grad von p bez�glich der Hauptvariablen
    if (degP == 0) return new Polynomial();                // Falls Hauptvariable im Divisor nicht vorkommt, R�ckgabewert Nullpolynom
    var r = this.clone();                                  // Kopie des Dividenden
    var k = r.degree(v)-degP;                              // Grad-Differenz bez�glich der Hauptvariablen
    if (k < 0) return r;                                   // R�ckgabewert, falls Differenz negativ
    var leadP = p.leadingCoefficient(v);                   // Leitkoeffizient von p bez�glich der Hauptvariablen
    while (k >= 0) {                                       // Solange Grad-Differenz nicht negativ ...
      var m = new Monomial();                              // Neues Monom mit Wert 1
      m.expo[v] = k;                                       // Exponent bez�glich der Hauptvariablen
      var leadR = r.leadingCoefficient(v);                 // Leitkoeffizient von r bez�glich der Hauptvariablen
      var t = leadR.mulMonomial(m);                        // Leitkoeffizient von r mal Monom m     
      var r1 = leadP.mul(r);                               // Leitkoeffizient von p mal Polynom r
      var r2 = t.mul(p);                                   // Produkt von t und p
      r = r1.sub(r2);                                      // Differenz der Produkte r1 und r2
      k = r.degree(v)-degP;                                // Neue Grad-Differenz bez�glich der Hauptvariablen
      }
    return r;                                              // R�ckgabewert
    }
    
// Hauptvariable f�r das gegebene Polynom und ein weiteres Polynom:
// Noch nicht optimal! (Im gegebenen Polynom, danach im zweiten Polynom wird die erste Variable gesucht, die dort vorkommt.)
// p ... Weiteres Polynom
  
  getMainVariable (p) {
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome (gegebenes Polynom)
    for (var i=0; i<li.length; i++) {                      // F�r alle Monom-Indizes (gegebenes Polynom) ...
      var m = li[i];                                       // Aktuelles Monom (gegebenes Polynom)
      for (var v=0; v<variables.length; v++)               // F�r alle Variablen-Indizes ...
        if (m.expo[v] > 0) return v;                       // R�ckgabewert, falls zugeh�riger Exponent positiv 
      }
    li = p.list;                                           // Abk�rzung f�r Liste der Monome (zweites Polynom)
    for (i=0; i<li.length; i++) {                          // F�r alle Monom-Indizes (zweites Polynom) ...
      m = li[i];                                           // Aktuelles Monom (zweites Polynom)
      for (v=0; v<variables.length; v++)                   // F�r alle Variablen-Indizes ...
        if (m.expo[v] > 0) return v;                       // R�ckgabewert, falls zugeh�riger Exponent positiv
      }
    return 0;                                              // R�ckgabewert, falls bisherige Suche erfolglos
    }
    
// Inhalt in Bezug auf eine Hauptvariable:
// Algorithmus nach Leonid Kof (WWW-Seite zum Projekt SPOCK); die Methode ist indirekt rekursiv, da die Methode gcd 
// f�r den gr��ten gemeinsamen Teiler zweier multivariater Polynome aufgerufen wird und diese Methode wiederum 
// die Methode content verwendet.
// v ... Index der Hauptvariablen (0 bis variables.length-1)
  
  content (v) {
    if (this.isInt()) return this.clone();                 // Kopie des gegebenen Polynoms als R�ckgabewert, falls ganze Zahl    
    var r = this.leadingCoefficient(v);                    // Leitkoeffizient des gegebenen Polynoms bez�glich der Hauptvariablen
    var m = new Monomial();                                // Neues Monom mit Koeffizient 1
    m.expo[v] = this.degree(v);                            // Exponent bez�glich der Hauptvariablen
    var f = this.sub(r.mulMonomial(m));                    // Gegebenes Polynom minus r mal m
    while (!f.isZero() && !r.isUnit()) {                   // Solange f ungleich 0 und r keine Einheit ...
      var t = f.leadingCoefficient(v);                     // Hauptkoeffizient von f bez�glich der Hauptvariablen
      if (t.isZero()) return r.gcd(f);                     // R�ckgabewert, falls t gleich 0
      if (t.isUnit()) return newPolynomialInt(1n);         // R�ckgabewert, falls t Einheit (1 oder -1)
      r = r.gcd(t);                                        // ggT von r und t als neues r (indirekte Rekursion!)
      m = new Monomial();                                  // Neues Monom mit Koeffizient 1 
      m.expo[v] = f.degree(v);                             // Exponent bez�glich Hauptvariable
      f = f.sub(t.mulMonomial(m));                         // Polynom f minus t mal m
      } // Ende while
    return r;                                              // R�ckgabewert
    }
    
// Gr��ter gemeinsamer Teiler des gegebenen Polynoms und eines weiteren Polynoms:
// Algorithmus nach Leonid Kof (WWW-Seite zum Projekt SPOCK); �nderungen im ersten Teil (Spezialf�lle)
// Die Methode ist direkt und indirekt rekursiv: Zum einen wird die Methode gcd verwendet, 
// zum anderen wird die Methode content aufgerufen, die wiederum auf gcd zur�ckgreift.
// p ... Zweites Polynom
  
  gcd (p) {
    var g = p.clone();                                     // Kopie des zweiten Polynoms
    if (this.isZero()) return g;                           // R�ckgabewert, falls erstes Polynom gleich 0
    if (g.isZero()) return this.clone();                   // R�ckgabewert, falls zweites Polynom gleich 0
    // Ab hier werden zwei Polynome ungleich 0 vorausgesetzt.
    if (this.isInt() || g.isInt()) {                       // Falls mindestens eines der Polynome konstant ...
      var c1 = this.gcdCoeff();                            // ggT der Koeffizienten des ersten Polynoms
      var c2 = g.gcdCoeff();                               // ggT der Koeffizienten des zweiten Polynoms
      return newPolynomialInt(gcd(c1,c2));                 // R�ckgabewert
      }    
    // Ab hier werden zwei nicht konstante Polynome vorausgesetzt.
    var v = this.getMainVariable(g);                       // Index der Hauptvariablen
    var cf = this.content(v);                              // Inhalt des ersten Polynoms bez�glich der Hauptvariablen (Typ Polynomial) 
    var f = this.div(cf);                                  // Quotient erstes Polynom durch Inhalt cf (Typ Polynomial)
    var cg = g.content(v);                                 // Inhalt des zweiten Polynoms bez�glich der Hauptvariablen (Typ Polynomial) 
    g = g.div(cg);                                         // Quotient zweites Polynom durch Inhalt cg (Typ Polynomial)
    var leadF = f.leadingCoefficient(v);                   // Leitkoeffizient von f bez�glich der Hauptvariablen (Typ Polynomial)
    var leadG = g.leadingCoefficient(v);                   // Leitkoeffizient von g bez�glich der Hauptvariablen (Typ Polynomial)
    var gamma = leadF.gcd(leadG);                          // ggT der beiden Leitkoeffizienten (Typ Polynomial) 
    var c = cf.gcd(cg);                                    // ggT der beiden Inhalte (Rekursion!)
    while (!g.isZero()) {                                  // Solange g ungleich 0 ...
      var t = f.pseudoRemainder(g,v);                      // Pseudorest von f durch g bez�glich der Hauptvariablen 
      f = g; g = t;                                        // Rollentausch wie beim euklidischen Algorithmus
      }
    if (f.degree(v) == 0) return c;                        // R�ckgabewert, falls Hauptvariable in f nicht vorkommt
    var f1 = gamma.mul(f);                                 // Produkt gamma mal f
    f = f1.div(f.leadingCoefficient(v));                   // f1 durch Hauptkoeffizient von f
    f = f.div(f.content(v));                               // f durch Inhalt von f
    return c.mul(f);                                       // R�ckgabewert
    }
    
// Formale Ableitung nach einer Hauptvariablen:
// v ... Index der Hauptvariablen (0 bis variables.length-1) oder variables.length (konstantes Polynom)

  deriv (v) {
    if (v == variables.length) return new Polynomial();    // R�ckgabewert, falls konstantes Polynom
    var d = new Polynomial();                              // Neues Polynom f�r Ableitung
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++) {                      // F�r alle Monom-Indizes ...
      var m = li[i];                                       // Aktuelles Monom des gegebenen Polynoms
      var dm = new Monomial();                             // Neues Monom f�r Ableitung
      dm.coeff = m.coeff*BigInt(m.expo[v]);                // Koeffizient f�r Ableitung
      for (var k=0; k<variables.length; k++) {             // F�r alle Variablen-Indizes ...
        if (k != v) dm.expo[k] = m.expo[k];                // Falls nicht Hauptvariable, Exponent �bernehmen
        else dm.expo[k] = Math.max(m.expo[k]-1,0);         // Sonst Exponent erniedrigen, aber nicht unter 0              
        } // Ende for (k)
      d.addMonomial(dm);                                   // Monom addieren
      } // Ende for (i)
    return d;                                              // R�ckgabewert
    }
    
// Vorfaktor, bestehend aus dem ggT der Koeffizienten und den in allen Monomen enthaltenen Variablenpotenzen:

  factor0 () {
    if (this.isZero()) return newPolynomialInt(1n);        // R�ckgabewert f�r Nullpolynom
    var m = new Monomial();                                // Neues Monom
    m.coeff = this.gcdCoeff();                             // ggT der Polynom-Koeffizienten als Monom-Koeffizient
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var v=0; v<variables.length; v++) {               // F�r alle Variablen-Indizes ...
      var e = li[0].expo[v];                               // Exponent im ersten Monom
      for (var i=1; i<li.length; i++)                      // F�r alle weiteren Monom-Indizes ... 
        e = Math.min(e,li[i].expo[v]);                     // Falls Exponent kleiner als bisher, aktualisieren     
      m.expo[v] = e;                                       // Exponent bez�glich der aktuellen Variablen
      } // Ende for (v)
    var f0 = new Polynomial(m);                            // Polynom zum Monom m
    if (this.div(f0).negate().isOne())                     // Falls m entgegengesetzt gleich zum gegebenen Polynom ...
      m.changeSign();                                      // Vorzeichen umkehren
    return new Polynomial(m);                              // R�ckgabewert
    }
    
// Quadratfreie Faktorisierung (verallgemeinert nach Michael Kaplan, Computeralgebra):
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Es wird vorausgesetzt, dass keine Variablen mit Index kleiner als v vorkommen.
// R�ckgabewert: Array von Polynomen, bestehend aus Vorfaktor und quadratfreien Faktoren zu den Exponenten 1, 2 usw.
// Zahlenfaktoren und gemeinsame Variablenpotenzen kommen in den Vorfaktor.
    
  squarefree (v) {
    var p = this.clone();                                  // Kopie des gegebenen Polynoms
    if (variables == "") return [p];                       // R�ckgabewert, falls keine Variable vorhanden
    if (this.degree(v) < 1) {                              // Falls Hauptvariable nicht vorkommt ...
      if (v == variables.length-1) return [p];             // R�ckgabewert, falls letzte Variable (Rekursionsende) ...
      else return p.squarefree(v+1);                       // R�ckgabewert, falls nicht letzte Variable (Rekursion)
      }
    var f = [undefined];                                   // Array mit einem undefinierten Element (Vorfaktor)
    var t1 = this;                                         // 1. Hilfspolynom, Startwert
    var t2 = t1.gcd(t1.deriv(v));                          // 2. Hilfspolynom, Startwert
    var t3 = t2.gcd(t2.deriv(v));                          // 3. Hilfspolynom, Startwert
    var i = 1;                                             // Z�hler, Startwert
    while (!t2.equals(t3)) {                               // Solange t2 und t3 verschieden ...
      var t = t1.mul(t3).div(t2).div(t2);                  // t1 * t3 / (t2)^2
      f.push(t);                                           // Array der quadratfreien Faktoren erg�nzen
      p = p.div(t.pow(i));                                 // p durch Potenz des neuen Faktors dividieren
      t1 = t2; t2 = t3;                                    // Rollentausch Hilfspolynome
      t3 = t2.gcd(t2.deriv(v));                            // 3. Hilfspolynom neu
      i++;                                                 // Z�hler erh�hen
      } // Ende while
    t = t1.mul(t3).div(t2).div(t2);                        // t1 * t3 / (t2)^2
    f.push(t1.mul(t3).div(t2).div(t2));                    // Array der quadratfreien Faktoren erg�nzen
    p = p.div(t.pow(i));                                   // Restfaktor (Polynom der Variablen mit h�herem Index)
    if (v == variables.length-1) f[0] = p;                 // Falls letzte Variable, Vorfaktor setzen (Rekursionsende)
    else {                                                 // Falls nicht letzte Variable ...
      var f0 = p.squarefree(v+1);                          // Quadratfreie Zerlegung des Restfaktors (Rekursion)  
      var ff = [f0[0]];                                    // Neues Array mit �bernommenem Vorfaktor
      for (var e=1; e<Math.max(f.length,f0.length); e++) { // F�r alle Indizes bzw. Exponenten ...
        ff[e] = undefined;                                 // Arrayelement zun�chst undefiniert
        if (f[e] == undefined) ff[e] = f0[e];              // Entweder Arrayelement von f0 �bernehmen ...
        else if (f0[e] == undefined) ff[e] = f[e];         // ... oder von f �bernehmen ...
        else ff[e] = f0[e].mul(f[e]);                      // ... oder Produkt von f0 und f �bernehmen
        }
      f = ff;                                              // Bisheriges Array durch neues Array ersetzen
      }
    for (e=1; e<f.length; e++) {                           // F�r alle Indizes bzw. Exponenten ...
      var y = f[e].factor0();                              // Gemeinsamer Faktor (Zahl mal Variablenpotenz)
      f[0] = f[0].mul(y.pow(e));                           // In den Vorfaktor verschieben
      f[e] = f[e].div(y);                                  // Quadratfreien Faktor entsprechend reduzieren
      }
    while (f[f.length-1] == undefined || f[f.length-1].isOne()) // Solange letzter Faktor unn�tig ...
      f.pop();                                             // Letzten Faktor weglassen
    return f;                                              // R�ckgabewert
    }
    
// Array der Teiler f�r ein konstantes Polynom (Typ Polynomial[]):
// Die Teiler sind nicht nach Gr��e sortiert.

  allDivisorsInt () {
    if (!this.isInt()) return undefined;                   // Falls Polynom nicht konstant, R�ckgabewert undefiniert
    if (this.isZero()) return undefined;                   // Falls Nullpolynom, R�ckgabewert undefiniert
    var aBig = allDivisorsBig(this.list[0].coeff);         // Array der Teiler (Typ BigInt[])
    var a = new Array(aBig.length);                        // Neues Array (Typ Polynomial[])
    for (var i=0; i<aBig.length; i++)                      // F�r alle Indizes ...
      a[i] = newPolynomialInt(aBig[i]);                    // Konstantes Polynom als Array-Element
    return a;                                              // R�ckgabewert
    }
    
// Hilfsroutine: Potenz einer Variablen (Typ Polynomial)
// v ... Index der Variablen (0 bis variables.length-1)
// e ... Exponent (Typ Number)
    
  powerVar (v, e) {
    var m = new Monomial();                                // Neues Monom mit Koeffizient 1
    m.expo[v] = e;                                         // Exponent �bernehmen
    return new Polynomial(m);                              // R�ckgabewert (Typ Polynomial)
    }
    
// Hilfsroutine: Array von Variablenpotenzen
// v ...... Index der Variablen (0 bis variables.length-1)
// eMax ... Maximaler Exponent

  powersVar (v, eMax) {
    var a = [];                                            // Leeres Array
    for (var e=0; e<=eMax; e++)                            // F�r alle m�glichen Exponenten ...
      a.push(this.powerVar(v,e));                          // Variablenpotenz zum Array hinzuf�gen
    return a;                                              // R�ckgabewert
    }
    
// Hilfsroutine: Array aller Produkte von Elementen zweier Arrays:
// a1 ... 1. Array (Typ Polynomial[])
// a2 ... 2. Array (Typ Polynomial[])

  prodArrays (a1, a2) {
    var a = [];                                            // Leeres Array
    for (var i=0; i<a1.length; i++)                        // F�r alle Indizes zum Array a1 ...
      for (var j=0; j<a2.length; j++)                      // F�r alle Indizes zum Array a2 ...
        a.push(a1[i].mul(a2[j]));                          // Produkt zum Array a hinzuf�gen
    return a;                                              // R�ckgabewert
    } 
    
// Array von Potenzen des gegebenen Polynoms:
// eMax ... Maximaler Exponent (nat�rliche Zahl oder 0)

  arrayPowers (eMax) {
    var a = [];                                            // Leeres Array
    var p = newPolynomialInt(1n);                          // Startwert 1 f�r Produkt
    for (var e=0; e<=eMax; e++) {                          // F�r alle Exponenten von 0 bis eMax ...
      a.push(p);                                           // Potenz zum Array hinzuf�gen
      if (e < eMax) p = p.mul(this);                       // Falls sinnvoll, bisheriges Produkt mit Basis multiplizieren
      } // Ende for (e)
    return a;                                              // R�ckgabewert
    }
    
// Array der Teiler:
// v ... Index der Hauptvariablen (0 bis variables.length-1) oder (bei konstantem Polynom) variables.length
// Es wird vorausgesetzt, dass das gegebene Polynom keine Variablen mit kleinerem Index als v enth�lt.
// Die Methode wird ben�tigt f�r den (ineffizienten) Von-Schubert- beziehungsweise Kronecker-Algorithmus.

  allDivisors (v) {
    if (v == variables.length)                             // Falls Polynom konstant ...
      return this.allDivisorsInt();                        // R�ckgabewert
    var c = this.factor0();                                // Vorfaktor (Typ Polynomial)
    var m = c.list[0];                                     // Entsprechendes Monom
    var a0 = allDivisorsBig(m.coeff);                      // Array der konstanten Teiler (Typ BigInt[])
    var a = new Array(a0.length);                          // Neues Array f�r Teiler (Typ Polynomial[])
    for (var i=0; i<a0.length; i++)                        // F�r alle Indizes ...
      a[i] = newPolynomialInt(a0[i]);                      // Array-Element (Typ Polynomial)
    for (var k=v; k<variables.length; k++) {               // F�r alle Variablen-Indizes ab v ...
      var a2 = this.powersVar(k,m.expo[k]);                // Array der Variablenpotenzen
      aa = this.prodArrays(a,a2);                          // Array der Produkte von a-Elementen und a2-Elementen
      a = aa;                                              // Zwischenergebnis-Array wird aktuelles Array
      }
    var p = this.div(c);                                   // Division des aktuellen Arrays durch den Vorfaktor
    var f = p.factorize(v);                                // Faktorisierung von p (Seiteneffekt factors)
    for (i=1; i<f.length; i++) {                           // F�r alle Exponenten der quadratfreien Zerlegung ...
      if (f[i] == undefined) continue;                     // Falls Exponent nicht vorkommt, weiter zum n�chsten
      for (var j=0; j<f[i].length; j++) {                  // F�r alle Indizes zur Zerlegung des quadratfreien Faktors f[i] ...
        a2 = f[i][j].arrayPowers(i);                       // Array der m�glichen Potenzen von f[i][j]
        var aa = this.prodArrays(a,a2);                    // Array der Produkte von a-Elementen und a2-Elementen
        a = aa;                                            // Zwischenergebnis-Array wird aktuelles Array 
        }
      } 
    return a;                                              // R�ckgabewert
    }
    
// Einsetzen einer Zahl f�r eine Variable:
// v ... Index der Variablen (0 bis variables.length-1)
// n ... Zahl (Typ BigInt)

  subst (v, n) {
    var r = new Polynomial();                              // Neues Polynom
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++) {                      // F�r alle Monom-Indizes ...
      var m = li[i].subst(v,n);                            // Einsetzen der Zahl ins aktuelle Monom
      r.addMonomial(m);                                    // Zum Ergebnispolynom addieren
      }
    return r;                                              // R�ckgabewert
    }
    
// �berpr�fung, ob s�mtliche Monome negative Koeffizienten haben:
    
  isNegative () {
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++)                        // F�r alle Monom-Indizes ...
      if (li[i].coeff > 0n) return false;                  // Falls Koeffizient positiv, R�ckgabewert false
    return true;                                           // Falls nur negative Koeffizienten, R�ckgabewert true
    }
    
// Linearfaktor bez�glich einer Hauptvariablen:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Es wird vorausgesetzt, dass Variable mit einem kleineren Index als v nicht vorkommen.
// Der in den Kommentaren vorkommende Ring R ist der Ring der Polynome mit ganzzahligen Koeffizienten
// und Variablen mit Index gr��er als v.
// Falls kein Linearfaktor gefunden wird, ist der R�ckgabewert undefined.

  linearFactor (v) {
    while (this.degree(v) < 1 && v < variables.length-1)   // Solange Hauptvariable nicht vorkommt ...
      v++;                                                 // Index der Hauptvariablen hochz�hlen
    var x = newPolynomialInt(1n);                          // Polynom mit Wert 1
    x.list[0].expo[v] = 1;                                 // Polynom f�r Hauptvariable
    var f0 = this.subst(v,0n);                             // F�r Hauptvariable 0 einsetzen 
    var d0 = f0.allDivisors(v+1);                          // Array der Teiler von f0 (im Ring R) 
    var f1 = this.subst(v,1n);                             // F�r Hauptvariable 1 einsetzen
    if (f1.isZero())                                       // Falls Ergebnis gleich 0 ...
      return x.sub(newPolynomialInt(1n));                  // R�ckgabewert Hauptvariable minus 1
    var d1 = f1.allDivisors(v+1);                          // Array der Teiler von f1 (im Ring R)
    for (var i=0; i<d0.length; i++) {                      // F�r alle Indizes zum Array d0 ...
      var c0 = d0[i];                                      // Koeffizient Grad 0 f�r Linearfaktor (Typ Polynomial)
      for (var k=0; k<d1.length; k++) {                    // F�r alle Indizes zum Array d1 ...
        var c1 = d1[k].sub(c0);                            // Koeffizient Grad 1 f�r Linearfaktor (Typ Polynomial)
        if (c1.isZero()) continue;                         // Falls Koeffizient 0, weiter zur n�chsten Index-Kombination
        var p = c1.mul(x).add(c0);                         // c1 mal Hauptvariable plus c0
        if (this.div(p) == undefined) continue;            // Falls kein Teiler, weiter zur n�chsten Index-Kombination
        if (p.leadingCoefficient(v).isNegative())          // Eventuell ...
          p.changeSign();                                  // Vorzeichenumkehr
        return p;                                          // Falls Teiler, R�ckgabewert
        } // Ende for (k)
      } // Ende for (i)
    }
    
// Hilfsroutine: Produkt des gegebenen Polynoms und einer BigInt-Zahl
// n ... Gegebene BigInt-Zahl (Faktor)

  mulInt (n) {
    var p = this.clone();                                  // Kopie des gegebenen Polynoms
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++)                        // F�r alle Monom-Indizes ...
      p.list[i].coeff = li[i].coeff*n;                     // Koeffizient
    return p;                                              // R�ckgabewert
    }
    
// Hilfsroutine: Quotient des gegebenen Polynoms und einer BigInt-Zahl
// n ... Gegebene BigInt-Zahl (Divisor)
// Falls der Divisor gleich 0 ist oder die ganzzahlige Division nicht aufgeht, ist der R�ckgabewert undefined. 

  divInt (n) {
    if (n == 0n) return undefined;                         // R�ckgabewert, falls Divisor gleich 0
    var p = this.clone();                                  // Kopie des gegebenen Polynoms
    var li = this.list;                                    // Abk�rzung f�r Liste der Monome
    for (var i=0; i<li.length; i++) {                      // F�r alle Monom-Indizes ...
      var c = li[i].coeff;                                 // Koeffizient des aktuellen Monoms
      if (c%n != 0n) return undefined;                     // R�ckgabewert, falls Division nicht aufgeht
      p.list[i].coeff = c/n;                               // Neuer Koeffizient
      }
    return p;                                              // R�ckgabewert (Normalfall)
    }
    
// Quadratischer Faktor bez�glich einer Hauptvariablen:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Es wird vorausgesetzt, dass Variable mit einem kleineren Index als v nicht vorkommen und dass kein linearer Faktor vorhanden ist.
// Der in den Kommentaren vorkommende Ring R ist der Ring der Polynome mit ganzzahligen Koeffizienten
// und Variablen mit Index gr��er als v.
// Falls kein quadratischer Faktor gefunden wird, ist der R�ckgabewert undefined.

  quadraticFactor (v) {
    while (this.degree(v) < 1 && v < variables.length-1)   // Solange Hauptvariable nicht vorkommt ...
      v++;                                                 // Index der Hauptvariablen hochz�hlen
    var f0 = this.subst(v,0n);                             // F�r Hauptvariable 0 einsetzen 
    var d0 = f0.allDivisors(v+1);                          // Array der Teiler von f0 (in R)
    var f1 = this.subst(v,1n);                             // F�r Hauptvariable 1 einsetzen
    var d1 = f1.allDivisors(v+1);                          // Array der Teiler von f1 (in R)
    var f2 = this.subst(v,2n);                             // F�r Hauptvariable 2 einsetzen
    var d2 = f2.allDivisors(v+1);                          // Array der Teiler von f2 (in R)
    for (var i=0; i<d0.length; i++) {                      // F�r alle Indizes zum Array d0 ...
      var dd0 = d0[i];                                     // Aktueller Teiler von f0 (Typ Polynomial)
      for (var k=0; k<d1.length; k++) {                    // F�r alle Indizes zum Array d1 ...
        var dd1 = d1[k];                                   // Aktueller Teiler von f1 (Typ Polynomial)
        for (var m=0; m<d2.length; m++) {                  // F�r alle Indizes zum Array d2 ...
          var dd2 = d2[m];                                 // Aktueller Teiler von f2 (Typ Polynomial)
          var c0 = dd0;                                    // Koeffizient Grad 0 (Typ Polynomial)
          var c1 = dd0.mulInt(-3n);                        // Koeffizient Grad 1, Zwischenergebnis (Typ Polynomial)
          c1 = c1.add(dd1.mulInt(4n));                     // Koeffizient Grad 1, Zwischenergebnis (Typ Polynomial)
          c1 = c1.sub(dd2);                                // Koeffizient Grad 1, Zwischenergebnis (Typ Polynomial)
          c1 = c1.divInt(2n);                              // Koeffizient Grad 1 (Typ Polynomial) oder undefined
          if (c1 == undefined) continue;                   // Falls Koeffizient undefiniert, weiter zur n�chsten Index-Kombination
          var c2 = dd0;                                    // Koeffizient Grad 2, Zwischenergebnis (Typ Polynomial)
          c2 = c2.sub(dd1.mulInt(2n));                     // Koeffizient Grad 2, Zwischenergebnis (Typ Polynomial)
          c2 = c2.add(dd2);                                // Koeffizient Grad 2, Zwischenergebnis (Typ Polynomial)
          c2 = c2.divInt(2n);                              // Koeffizient Grad 2 (Typ Polynomial) oder undefined
          if (c2 == undefined) continue;                   // Falls Koeffizient undefiniert, weiter zur n�chsten Index-Kombination
          var x = newPolynomialInt(1n);                    // Polynom mit Wert 1
          x.list[0].expo[v] = 1;                           // Polynom f�r Hauptvariable
          var q = c2.mul(x).add(c1).mul(x).add(c0);        // Horner-Schema f�r quadratischen Faktor
          if (q.degree(v) < 2) continue;                   // Falls Grad zu klein, weiter zur n�chsten Index-Kombination
          if (this.div(q) == undefined) continue;          // Falls kein Teiler, weiter zur n�chsten Index-Kombination
          if (q.leadingCoefficient(v).isNegative())        // Eventuell ... 
            q.changeSign();                                // Vorzeichenumkehr
          return q;                                        // Falls Teiler gefunden, R�ckgabewert
          } // Ende for (m)
        } // Ende for (k)
      } // Ende for (i)
    }
    
// Lagrange-Polynom:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// d ... Array der St�tzwerte (Polynome der Variablen mit Index gr��er als v)
// n sei die um 1 verkleinerte L�nge des Arrays d. Als St�tzstellen werden die ganzen Zahlen 0 bis n verwendet.
// Die Methode liefert ein Polynom, dessen Grad h�chstens gleich n ist. Falls das Lagrange-Polynom nicht-ganzzahlige Koeffizienten
// h�tte, ist der R�ckgabewert undefined.

  lagrange (v, d) {
    var x = newPolynomialInt(1n);                          // Neues Polynom mit Wert 1
    x.list[0].expo[v] = 1;                                 // Polynom f�r Hauptvariable
    var p = new Polynomial();                              // Neues Polynom f�r Lagrange-Interpolation
    var f = 1n;                                            // Faktor zur Erzwingung ganzzahliger Koeffizienten
    for (var i=0; i<d.length; i++) {                       // F�r alle St�tzwert-Indizes ...
      var s = d[i].mulInt(f);                              // Startwert f�r Produkt
      for (var j=0; j<d.length; j++) {                     // F�r alle Faktoren-Indizes ...
        if (j == i) continue;                              // Falls Indizes gleich, weiter zum n�chsten
        var y = x.sub(newPolynomialInt(BigInt(j)));        // Z�hler des aktuellen Faktors           
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
    p = p.divInt(f);                                       // Endg�ltiges Lagrange-Polynom oder undefined     
    return p;                                              // R�ckgabewert
    }

// Faktor mit gegebenem Grad bez�glich der Hauptvariablen:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// n ... Grad des Faktors bez�glich der Hauptvariablen

  factorDegree (v, n) {
    while (this.degree(v) < 1 && v < variables.length-1)   // Solange Hauptvariable nicht vorkommt ...
      v++;                                                 // Index der Hauptvariablen hochz�hlen  
    var d = [];                                            // Leeres Array (sp�ter zweifach indiziert)
    for (var i=0; i<=n; i++) {                             // F�r alle ganzen Zahlen von 0 bis n ...
      var f = this.subst(v,BigInt(i));                     // Zahl i f�r Hauptvariable einsetzen
      var df = f.allDivisors(v+1);                         // Array der Teiler von f (im Ring R)
      d.push(df);                                          // Zum Array d hinzuf�gen
      }
    var iMax = 1;                                          // Startwert f�r Anzahl der Index-Kombinationen
    for (i=0; i<=n; i++) iMax = iMax*d[i].length;          // Anzahl der Index-Kombinationen
    if (iMax > 100000) alert("Zahl der Index-Kombinationen sehr gro\u00DF!");
    // In der folgenden Schleife repr�sentiert i eine Index-Kombination.
    for (i=0; i<iMax; i++) {                               // F�r alle Index-Kombinationen ...
      var a = [];                                          // Neues Array f�r Index-Kombination
      var q2 = iMax;                                       // Hilfsgr��e
      var ii = i;                                          // Index als Hilfsgr��e �bernehmen
      for (var k=0; k<=n; k++) {                           // F�r alle St�tzwert-Indizes ...
        q2 = q2/d[k].length;                               // Hilfsgr��e aktualisieren
        a.push(Math.floor(ii/q2));                         // Neuer Index der Kombination
        ii = ii%q2;                                        // Hilfsgr��e aktualisieren
        } // Ende for (k)
      var dd = new Array(n+1);                             // Neues Array f�r St�tzwerte
      for (k=0; k<=n; k++) dd[k] = d[k][a[k]];             // Einzelne St�tzwerte als Array-Elemente
      var p = this.lagrange(v,dd);                         // Lagrange-Polynom
      if (p == undefined) continue;                        // Falls undefiniert, weiter zur n�chsten Index-Kombination
      if (p.degree(v) < n) continue;                       // Falls Grad zu klein, weiter zur n�chsten Index-Kombination
      if (this.div(p) == undefined) continue;              // Falls kein Teiler von p, weiter zur n�chsten Index-Kombination
      return p;                                            // R�ckgabewert
      } // Ende for (i)
    }
    
// Faktoren eines primitiven, quadratfreien Polynoms:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// R�ckgabewert: Array der Faktoren
    
  factorsSquareFree (v) {
    var p = this.clone();                                  // Kopie des gegebenen Polynoms
    while (v < variables.length && p.degree(v) < 1)        // Solange Variable nicht vorkommt ...
      v++;                                                 // Index der Hauptvariablen hochz�hlen
    var a = [];                                            // Leeres Array
    var lf = p.linearFactor(v);                            // Linearfaktor oder undefined
    while (lf != undefined) {                              // Solange Linearfaktor definiert ...
      a.push(lf);                                          // Zum Array hinzuf�gen
      p = p.div(lf);                                       // Polynomdivision
      lf = p.linearFactor(v);                              // Neuer Linearfaktor oder undefined 
      }
    var qf = p.quadraticFactor(v);                         // Quadratischer Faktor oder undefined
    while (qf != undefined) {                              // Solange quadratischer Faktor definiert ...
      a.push(qf);                                          // Zum Array hinzuf�gen
      p = p.div(qf);                                       // Polynomdivision
      qf = p.quadraticFactor(v);                           // Neuer quadratischer Faktor oder undefined                
      }
    for (var n=3; n<=p.degree(v)/2; n++) {                 // F�r m�gliche Grade ab 3 ...
      if (n > 4) {                                         // Falls Grad �ber 4 (Rechenzeit!) ...
        alert(incompleteFactorization);                    // Fehlermeldung
        a.push(p);                                         // Polynom unzerlegt zum Array hinzuf�gen
        return a;                                          // R�ckgabewert
        }
      var ff = p.factorDegree(v,n);                        // Faktor vom Grad n oder undefined
      while (ff != undefined) {                            // Solange Faktor definiert ...
        a.push(ff);                                        // Zum Array hinzuf�gen
        p = p.div(ff);                                     // Polynomdivision
        ff = p.factorDegree(v,n);                          // Neuer Faktor vom Grad n oder undefined
        }
      } // Ende for (n)
    if (!p.isInt()) a.push(p);                             // Eventuell weiteren Faktor hohen Grades zum Array hinzuf�gen
    if (p.negate().isOne()) {                              // Falls verbleibendes Polynom gleich -1 ...
      var f = a.pop();                                     // Letztes Array-Element
      a.push(f.negate());                                  // Mit umgekehrtem Vorzeichen wieder hinzuf�gen
      }
    return a;                                              // R�ckgabewert
    }
    
// Hilfsroutine: Optimierung der Vor- bzw. Rechenzeichen in der Faktorisierung;
// a ... Array der Faktorisierung, aufgebaut wie das Attribut factors; das Array wird ver�ndert

  optimizeSigns (a) {
    var sign = 1;                                          // Vorzeichenfaktor, Startwert
    for (var i=1; i<a.length; i++) {                       // F�r alle Indizes (Exponenten) der quadratfreien Zerlegung ...
      if (a[i] == undefined) continue;                     // Falls Faktor 1, weiter zum n�chsten Index
      var odd = (i%2 != 0);                                // Flag f�r ungeraden Exponenten
      for (var k=0; k<a[i].length; k++) {                  // F�r alle Indizes der weiteren Zerlegung ...
        if (a[i][k].isNegative()) {                        // Falls Einzelfaktor ung�nstig ...
          a[i][k].changeSign();                            // Vorzeichenumkehr
          if (odd) sign = -sign;                           // Falls ungerader Exponent, Vorzeichenfaktor umkehren
          } 
        } // Ende for (k)
      } // Ende for (i)
    if (sign < 0) a[0].changeSign();                       // Falls n�tig, Vorfaktor umkehren
    }
    
// Hilfsroutine: �berpr�fung der Faktorisierung
// a ... Array der Faktorisierung, aufgebaut wie das Attribut factors

  testFactors (a) {
    var p = a[0];                                          // Vorfaktor
    for (var i=1; i<a.length; i++) {                       // F�r alle Indizes (Exponenten) der quadratfreien Zerlegung ...
      if (a[i] == undefined) continue;                     // Falls Faktor 1, weiter zum n�chsten Index
      var q = newPolynomialInt(1n);                        // Neues Polynom mit Wert 1
      for (var k=0; k<a[i].length; k++)                    // F�r alle Indizes der weiteren Zerlegung ...
        q = q.mul(a[i][k]);                                // Einzelfaktor multiplizieren
      p = p.mul(q.pow(i));                                 // Mit Potenz des Produkts q multiplizieren
      } // Ende for (i)
    if (!p.equals(this))                                   // Falls Probe falsch ...
      alert("Abweichung: "+this+"; "+p);                   // Fehlermeldung
    }
    
// Faktorisierung des Polynoms:
// v ... Index der Hauptvariablen (0 bis variables.length-1)
// Der R�ckgabewert ist ein Array, das folgenderma�en aufgebaut ist: Das erste Array-Element (mit Index 0) ist
// der Vorfaktor, bestehend aus dem ggT der Koeffizienten und dem ggT der Variablenpotenzen. Die weiteren
// Array-Elemente (Index ab 1) entsprechen der quadratfreien Zerlegung, wobei der Index jeweils mit dem zugeh�rigen Exponenten
// �bereinstimmt. Die genannten Array-Elemente sind undefiniert, wenn es keinen Faktor zu dem betreffenden Index (Exponent) gibt,
// andernfalls Arrays der irreduziblen Faktoren, die sich aus einem Faktor der quadratfreien Zerlegung durch weitere Zerlegung 
// ergeben.
// Seiteneffekt factors

  factorize (v) {
    var a = this.squarefree(v);                            // Quadratfreie Zerlegung
    var aa = [a[0]];                                       // Neues Array mit �bernommenem Vorfaktor
    for (var i=1; i<a.length; i++) {                       // F�r alle Exponenten der quadratfreien Zerlegung ...
      if (a[i].isOne()) aa.push(undefined);                // Falls a[i] gleich 1, undefined hinzuf�gen
      else aa.push(a[i].factorsSquareFree(v));             // Sonst Array f�r Zerlegung von a[i] hinzuf�gen
      }
    this.optimizeSigns(aa);                                // Vorzeichen optimieren
    this.factors = aa;                                     // Ergebnis als Attribut factors abspeichern
    this.testFactors(aa);                                  // �berpr�fung der Faktorisierung
    return aa;                                             // R�ckgabewert
    }
    
// Umwandlung in eine Zeichenkette (Provisorium f�r Testzwecke):

  toString () {
    var li = this.list, n = li.length;                     // Abk�rzungen
    if (n == 0) return "0";                                // R�ckgabewert f�r Nullpolynom
    var s = "";                                            // Leere Zeichenkette
    for (var i=0; i<n; i++) {                              // F�r alle Monom-Indizes ...
      if (i > 0) s += " ";                                 // Falls nicht erstes Monom, Leerzeichen
      s += li[i].toString(i==0);                           // Zeichenkette f�r Monom hinzuf�gen
      }
    return s;                                              // R�ckgabewert
    }
    
// Breite in Pixeln f�r ausmultipliziertes Polynom:
// Wichtig: Die Methode width sollte der Methode write entsprechen.

  width () {
    var li = this.list, n = li.length;                     // Abk�rzungen
    if (n == 0) return widthPix("0");                      // R�ckgabewert f�r Nullpolynom
    var w0 = widthPix(" ");                                // Breite eines Leerzeichens (Pixel)
    var w = 0;                                             // Startwert Breite
    for (var i=0; i<n; i++) {                              // F�r alle Monom-Indizes ...
      w += li[i].width(i==0);                              // Breite des aktuellen Monoms addieren
      if (i < n-1) w += w0;                                // Falls nicht letztes Monom, Leerzeichenbreite addieren
      }
    return w;                                              // R�ckgabewert
    }
    
// Grafikausgabe f�r ausmultipliziertes Polynom:
// (x,y) ... Position (Pixel)
// R�ckgabewert: Position am Ende (Pixel)

  write (x, y) {
    var li = this.list, n = li.length;                     // Abk�rzungen
    if (n == 0) return writeString("0",x,y);               // Falls Nullpolynom, Null ausgeben, R�ckgabewert
    var w0 = widthPix(" ");                                // Breite eines Leerzeichens (Pixel)
    for (var i=0; i<n; i++) {                              // F�r alle Monom-Indizes ...
      x = li[i].write(x,y,i==0);                           // Monom ausgeben, neue Position
      if (i < n-1) x += w0;
      }
    return x;                                              // R�ckgabewert (Position am Ende des Polynoms) 
    }
    
// Hilfsroutine: Breite in Pixeln f�r einen eingeklammerten Faktor:
// e ... Exponent (nat�rliche Zahl, nicht 0, Typ Number)
// Die Methode widthBrackPow sollte der Methode writeBrackPow entsprechen.

  widthBrackPow (e) {
    var w0 = widthPix(" ")/2;                              // Halbe Breite eines Leerzeichens (Pixel)
    var w = this.width();                                  // Breite des Klammerinhalts (Pixel)
    w += widthPix("()");                                   // Breite der Klammer addieren
    if (e > 1) w += widthPix(String(e));                   // Breite des Exponenten addieren
    return w;                                              // R�ckgabewert
    }
    
// Hilfsroutine f�r Methode writeFactors: Potenz eines eingeklammerten Faktors:
// e ....... Exponent (nat�rliche Zahl, nicht 0, Typ Number)
// (x,y) ... Position (Pixel)
// R�ckgabewert: Position am Ende (Pixel)

  writeBrackPow (e, x, y) {
    var w0 = widthPix(" ")/2;                              // Halbe Breite eines Leerzeichens (Pixel)
    x = writeString("(",x,y);                              // Klammer auf, neue Position (Pixel)
    x = this.write(x,y);                                   // Inhalt der Klammer, neue Position (Pixel)
    x = writeString(")",x,y);                              // Klammer zu, neue Position (Pixel)
    if (e > 1) x = writeString(String(e),x,y-8);           // Exponent gr��er als 1, neue Position (Pixel)
    return x;                                              // R�ckgabewert (Position am Ende der Polynom-Potenz)
    }
    
// Breite in Pixeln f�r faktorisiertes Polynom:
// Wichtig: Die Methode widthFactors sollte der Methode writeFactors entsprechen.

  widthFactors () {
    if (this.isZero()) return widthPix("0");               // Sonderfall 0
    if (this.isOne()) return widthPix("1");                // Sonderfall 1
    if (this.negate().isOne()) return widthPix("- 1");     // Sonderfall -1
    var w0 = widthPix(" ")/2;                              // Halbe Breite eines Leerzeichens (Pixel)
    var w = 0;                                             // Startwert Breite
    var a = this.factors;                                  // Array f�r Faktorisierung
    if (a[0].negate().isOne()) w += widthPix("-");         // Falls Vorfaktor -1, w erh�hen (Minuszeichen)
    if (!a[0].isUnit()) w += a[0].width();                 // Falls Vorfaktor keine Einheit, w erh�hen (Vorfaktor)
    var n = a.length;                                      // L�nge von Array a
    var br = !a[0].isOne() || (n > 2);                     // Flag f�r Klammer, Zwischenergebnis
    br = br || (n == 2 && a[1].length > 1);                // Flag f�r Klammer
    for (var i=1; i<a.length; i++) {                       // F�r alle Indizes ab 1 ...
      var f = a[i];                                        // Aktueller Faktor (quadratfrei)
      if (f == undefined) continue;                        // Falls Faktor gleich 1, weiter zum n�chsten Faktor
      for (var k=0; k<f.length; k++) {                     // F�r alle Faktoren-Indizes ...
        if (br) w += f[k].widthBrackPow(i);                // Entweder w f�r Klammer (eventuell mit Exponent) erh�hen ...
        else w += f[k].width();                            // ... oder f�r alleinstehenden Faktor ohne Klammer
        } // Ende for (k)
      } // Ende for (i)
    return w;                                              // R�ckgabewert
    }
    
// Hilfsroutine: �berpr�fung der Breite in Pixeln f�r die Faktorisierung
// x0 ... Anfangsposition (Pixel)
// x .... Endposition (Pixel)

  testWidthFactors (x0, x) {
    var w = this.widthFactors();                           // Berechnete Breite (Pixel)
    var s = "Abweichende Breite bei "+this+":\n"           // Text der Fehlermeldung
      + w+"; "+(x-x0);
    if (x0+w != x) alert(s);                               // Falls Abweichung, Fehlermeldung
    }
    
// Grafikausgabe f�r faktorisiertes Polynom:
// (x,y) ... Position (Pixel)

  writeFactors (x, y) {
    var x0 = x;                                            // Waagrechte Koordinate (Anfangsposition) speichern
    if (this.isZero()) {writeString("0",x,y); return;}     // Sonderfall 0
    if (this.isOne()) {writeString("1",x,y); return;}      // Sonderfall 1
    if (this.negate().isOne()) {                           // Sonderfall -1
      writeString("- 1",x,y); return;
      }    
    var w0 = widthPix(" ")/2;                              // Halbe Breite eines Leerzeichens (Pixel)                             
    var a = this.factors;                                  // Array f�r Faktorisierung
    if (a[0].negate().isOne())                             // Falls Vorfaktor gleich -1 ...
      x = writeString("-",x,y);                            // Minuszeichen ausgeben, neue Position (Pixel)   
    if (!a[0].isUnit()) x = a[0].write(x,y);               // Falls sinnvoll, Vorfaktor ausgeben; neue Position (Pixel)
    var n = a.length;                                      // L�nge von Array a
    var br = !a[0].isOne() || (n > 2);                     // Flag f�r Klammer, Zwischenergebnis
    br = br || (n == 2 && a[1].length > 1);                // Flag f�r Klammer
    for (var i=1; i<a.length; i++) {                       // F�r alle Indizes ab 1 ...
      var f = a[i];                                        // Aktueller Faktor (quadratfrei)
      if (f == undefined) continue;                        // Falls Faktor gleich 1, weiter zum n�chsten Faktor
      for (var k=0; k<f.length; k++) {                     // F�r alle Faktoren-Indizes ...
        if (br) x = f[k].writeBrackPow(i,x,y);             // Entweder Klammer mit zugeh�rigem Exponenten ...
        else x = f[k].write(x,y);                          // ... oder alleinstehender Faktor ohne Klammer
        } // Ende for (k)
      } // Ende for (i)
    this.widthFactors(x0,x);                               // Eventuell Fehlermeldung wegen Breite 
    }
    
// Vorzeichen des Vorfaktors:
// R�ckgabewert (Typ Number) +1 (f�r positiven Vorfaktor, -1 (f�r negativen Vorfaktor) oder 0 (f�r Nullpolynom)

  signFactor0 () {
    if (this.isZero()) return 0;                           // R�ckgabewert, falls Nullpolynom
    var m = this.factors[0].list[0];                       // Monom des Vorfaktors
    return (m.coeff>0n ? 1 : -1);                          // R�ckgabewert (Normalfall)
    }
    
  } // Ende der Klasse Polynomial
  
//-------------------------------------------------------------------------------------------------

// Globale Methoden:

// Hilfsroutine: Position des n�chsten Plus- oder Minuszeichens nach einer gegebenen Position
// s ... Zeichenkette
// i ... Anfangsposition (gesucht wird ab dem folgenden Zeichen)
// R�ckgabewert: Im Normalfall Position des ersten Plus- oder Minuszeichens; 
// falls kein Plus- oder Minuszeichen vorhanden, Position am Ende der Zeichenkette
  
function positionPM (s, i) {
  for (var k=i+1; k<s.length; k++) {                       // F�r alle Zeichen-Indizes ab Anfangsposition ...
    var ch = s.charAt(k);                                  // Aktuelles Zeichen
    if (ch == "+" || ch == "-") return k;                  // Falls Plus- oder Minuszeichen, R�ckgabewert
    }
  return s.length;                                         // R�ckgabewert, falls kein Plus- oder Minuszeichen gefunden
  }
  
// Konstruktor-Ersatz:
// s ... Zeichenkette

function newPolynomial (s) {
  var p = new Polynomial();                                // Neues Polynom
  for (var i=0; i<s.length; i++) {                         // F�r alle Zeichen-Indizes ...
    var k = positionPM(s,i);                               // Position des n�chsten Plus- oder Minuszeichens bzw. Endposition
    var m = newMonomial(s.substring(i,k));                 // Neues Monom entsprechend der Teilzeichenkette
    p.addMonomial(m);                                      // Monom zum Polynom addieren
    i = k-1;                                               // Anfangsposition f�r n�chstes Monom (Ausgleich f�r i++)
    }
  return p;                                                // R�ckgabewert
  }
  
// Konstruktor-Ersatz f�r konstantes Polynom:
// c ... Konstante (Typ BigInt)

function newPolynomialInt (c) {
  if (c == 0n) return new Polynomial();                    // R�ckgabewert, falls c gleich 0
  var m = new Monomial();                                  // Neues Monom mit Wert 1
  m.coeff = c;                                             // Koeffizient des Monoms
  return new Polynomial(m);                                // R�ckgabewert
  }
  
// Array der Primfaktoren und zugeh�rigen Vielfachheiten f�r eine ganze Zahl:
// n ... Gegebene Zahl (Typ BigInt)
// Im Normalfall enth�lt das Ergebnis-Array Verbunde mit den Attributen f (Primfaktor, Typ BigInt) und e (Vielfachheit, Typ Number).
// Falls die gegebene Zahl gleich 0 ist, ist der R�ckgabewert undefined.
  
function factorsBig (n) {
  if (n == 0n) return undefined;                           // R�ckgabewert, falls Zahl 0 gegeben
  var c = (n>=0 ? n : 0n-n);                               // Betrag von n
  var a = [];                                              // Leeres Array
  var t0 = 0n;                                             // Startwert f�r aktuellen Teiler
  while (c > 1n) {                                         // Solange c gr��er als 1 ...
    var t = firstPrime(c);                                 // Kleinster Primfaktor
    if (t > t0) {                                          // Falls neuer Primfaktor ...
      a.push({f: t, e: 1});                                // Mit Vielfachheit 1 zum Array hinzuf�gen
      t0 = t;                                              // Aktueller Teiler neu
      }
    else {                                                 // Falls letzter Primfaktor nochmal ...
      var p = a.pop();                                     // Bisheriger Verbund (Primfaktor/Vielfachheit)
      p.e++;                                               // Vielfachheit erh�hen
      a.push(p);                                           // Ver�nderten Verbund (Primfaktor/Vielfachheit) zum Array hinzuf�gen
      }
    c = c/t;                                               // Durch den Primfaktor dividieren
    }   
  return a;                                                // R�ckgabewert
  }
  
// Array der Teiler einer ganzen Zahl:
// n ... Gegebene Zahl (Typ BigInt)
// R�ckgabewert: Array aller Teiler (Typ BigInt[]); f�r die Zahl 0 ist der R�ckgabewert undefined. 

function allDivisorsBig (n) {
  if (n == 0n) return undefined;                           // Falls Zahl 0, R�ckgabewert undefined
  var a1 = factorsBig(n);                                  // Array der Primfaktoren und Vielfachheiten
  var e1 = 1n, e2 = -1n;                                   // Einheiten +1 und -1 (Typ BigInt)
  var a = [e1, e2];                                        // Array f�r R�ckgabewert, zun�chst mit Einheiten 
  for (var i=0; i<a1.length; i++) {                        // F�r alle Indizes ...               
    var f = a1[i].f, e = a1[i].e;                          // Aktueller Primfaktor (BigInt) und zugeh�rige Vielfachheit (Number)
    var a2 = [];                                           // Leeres Array f�r Potenzen des aktuellen Primfaktors
    for (var k=0; k<=e; k++)                               // F�r alle Exponenten ... 
      a2.push(f**BigInt(k));                               // Element (Primzahlpotenz, Typ BigInt) zum Array hinzuf�gen
    var aa = [];                                           // Leeres Array f�r neues Zwischenergebnis
    for (var n=0; n<a.length; n++)                         // F�r alle Indizes zum bisher ermittelten Array ...
      for (var m=0; m<a2.length; m++)                      // F�r alle Indizes zum Array der Primzahlpotenzen ... 
        aa.push(a[n]*a2[m]);                               // Produkt (Typ BigInt) zum neuen Array hinzuf�gen
    a = aa;                                                // Neues Array als aktuelles Zwischenergebnis
    } // Ende for (i)
  return a;                                                // R�ckgabewert
  }
  

  

  
