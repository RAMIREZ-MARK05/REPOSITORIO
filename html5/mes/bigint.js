// Ganzzahlige Arithmetik
// 01.10.2014 - 16.04.2017

// Konstanten:

var BASE = 1048576;                                        // 2 hoch 20
var NAT0 = [0];                                            // Zahl 0
var NAT1 = [1];                                            // Zahl 1
var NAT2 = [2];                                            // Zahl 2
var NAT10 = [10];                                          // Zahl 10

// Fehlermeldung:
// f ... Name der Funktion
// w ... Text der Fehlermeldung

function error (f, w) {
  alert("Fehler in Funktion "+f+":\n"+w);
  }

// Eine nat�rliche Zahl wird als Array a von Zahlen dargestellt.
// Die Zahl ist gleich a[0] + a[1]*BASE + a[2]*BASE^2 + ..., wobei alle Koeffizienten kleiner als BASE sein sollen. 

// Neues Array, gef�llt mit Nullen:
// n ... Zahl der Elemente

function newArray (n) {
  var a = new Array(n);                                    // Neues Array der Dimension n
  for (var i=0; i<n; i++) a[i] = 0;                        // Array mit Nullen f�llen
  return a;                                                // R�ckgabewert
  }
  
// Kopie eines Arrays:
// a ... Urspr�ngliches Array
  
function clone (a) {
  if (!a) {                                                // Falls Array nicht definiert ...
    error("clone","Array nicht definiert!");               // ... Fehlermeldung
    return undefined;                                      // ... R�ckgabewert
    }
  var n = a.length;                                        // Zahl der Arrayelemente
  var c = newArray(n);                                     // Neues Array, gef�llt mit Nullen
  for (var i=0; i<n; i++) c[i] = a[i];                     // Alle Elemente kopieren
  return c;                                                // R�ckgabewert
  }
  
// Array einer Zahl:
// s ... Gegebene Zahl (als Zeichenkette)

function array (s) {
  if (s.length == 0) {                                     // Falls Zeichenkette leer ...
    error("array","Leere Zeichenkette!");                  // ... Fehlermeldung
    return undefined;                                      // ... R�ckgabewert
    }
  var a = NAT0;                                            // Zahl 0 als Array
  for (var i=0; i<s.length; i++) {                         // F�r alle Zeichen von s ...
    if (i > 0) a = mul(a,NAT10);                           // Bisherige Zahl mit 10 multiplizieren
    var c = s.charAt(i);                                   // Einzelnes Zeichen von s
    if ("0123456789".indexOf(c) < 0) {                     // Falls keine Ziffer ...
      error("array","Keine nat\u00fcrliche Zahl!");        // ... Fehlermeldung
      return undefined;                                    // ... R�ckgabewert
      }
    a = add(a,[Number(c)]);                                // Ziffer zur bisherigen Zahl addieren
    }
  return a;                                                // R�ckgabewert
  }

// Zeichenkette zu einem Array:
// a ... Gegebenes Array

function stringArray (a) {
  if (!a) {                                                // Falls Array nicht definiert ...
    error("stringArray","Array nicht definiert!");         // ... Fehlermeldung
    return undefined;                                      // ... R�ckgabewert
    }
  var s = "[";                                             // Start mit �ffnender eckiger Klammer
  for (var i=0; i<a.length; i++) {                         // F�r alle Elemente des Arrays ...
    s += a[i];                                             // Element hinzuf�gen
    if (i < a.length-1) s += ", ";                         // Falls n�tig, Komma und Leerzeichen hinzuf�gen
    else s += "]";                                         // Andernfalls schlie�ende eckige Klammer hinzuf�gen
    }
  return s;                                                // R�ckgabewert
  }
  
// Normalisierung eines Arrays:
// a ... Gegebenes Array
// Vorausgesetzt werden Arrayelemente, deren Betr�ge kleiner als BASE^2 sind.
// Folgende Forderungen sollen erf�llt werden:
// 1. Die Elemente d�rfen nicht negativ sein.
// 2. Die Elemente m�ssen kleiner als BASE sein.
// 3. Falls es mehr als ein Element gibt, muss das h�chstwertige Element gr��er als 0 sein.
  
function norm (a) {
  if (!a) {                                                // Falls Array nicht definiert ...
    error("norm","Array nicht definiert!");                // ... Fehlermeldung
    return undefined;                                      // ... R�ckgabewert
    }
  if (a.length == 1 && a[0] == 0) return;                  // Sonderfall 0
  // Forderung 1 erf�llen:
  for (var i=0; i<a.length; i++) {                         // F�r alle Arrayelemente ...
    if (a[i] < 0) {                                        // Falls Arrayelement negativ ...
      var m = Math.floor(a[i]/BASE);                       // ... Hilfsgr��e berechnen
      a[i] += -m*BASE;                                     // ... Element nicht-negativ machen
      if (i < a.length-1) a[i+1] += m;                     // ... N�chsth�heres Element korrigieren
      }
    }
  // Forderung 2 erf�llen: 
  for (i=0; i<a.length; i++) {                             // F�r alle Arrayelemente ...
    if (a[i] >= BASE) {                                    // Falls Arrayelement zu gro� ...
      var q = Math.floor(a[i]/BASE);                       // ... Hilfsgr��e berechnen
      a[i] -= q*BASE;                                      // ... Element verkleinern
      if (i < a.length-1) a[i+1] += q;                     // ... N�chsth�heres Element korrigieren
      else a[i+1] = q;                                     // ... bzw. zum Array hinzuf�gen
      }
    }
  // Forderung 3 erf�llen:
  i = a.length-1;
  while (a[i] == 0) {
    a.length--;
    i--; if (i == 0) break;
    }
  }
  
// Vergleich zweier Zahlen:
// a, b ... Gegebene Zahlen (normalisiert vorausgesetzt)
// R�ckgabewert: 0 f�r a = b, 1 f�r a > b, -1 f�r a < b

function compare (a, b) {
  var n1 = a.length, n2 = b.length;                        // Dimensionen der Arrays
  if (n1 < n2) return -1;                                  // Falls erstes Array kleiner, Entscheidung f�r a < b
  if (n1 > n2) return 1;                                   // Falls erstes Array gr��er, Entscheidung f�r a > b
  for (var i=n1; i>=0; i--) {                              // F�r alle Elemente (wichtigste zuerst) der beiden Arrays ...
    if (a[i] < b[i]) return -1;                            // Entscheidung f�r a < b
    if (a[i] > b[i]) return 1;                             // Entscheidung f�r a > b
    }
  return 0;                                                // Entscheidung f�r a = b
  }
  
// Addition:
// a, b ... Summanden (als normalisierte Arrays vorausgesetzt)
// R�ckgabewert: Summe (als normalisiertes Array)

function add (a, b) {
  if (!a) {                                               
    error("add","1. Summand nicht definiert!");
    return undefined;
    }
  if (!b) {
    error("add","2. Summand nicht definiert!");
    return undefined;
    }
  var n = Math.max(a.length,b.length);                     // Gr��ere Dimension der beiden Arrays
  var s = newArray(n);                                     // Neues Array, gef�llt mit Nullen
  for (var i=0; i<n; i++) {                                // F�r alle Elemente des Summen-Arrays ...
    if (a[i] != undefined && b[i] != undefined)            // Falls entsprechende Elemente definiert ...
      s[i] = a[i]+b[i];                                    // ... Summe der gegebenen Elemente berechnen
    else if (a[i] == undefined) s[i] = b[i];               // ... oder Element von a �benehmen
    else s[i] = a[i];                                      // ... oder Element von b �bernehmen
    }
  norm(s);                                                 // Normalisierung
  return s;                                                // R�ckgabewert
  }
  
// Subtraktion:
// a ... Minuend (als normalisiertes Array vorausgesetzt)
// b ... Subtrahend (als normalisiertes Array vorausgesetzt)
// R�ckgabewert: Differenz (als normalisiertes Array)

function sub (a, b) {
  if (!a) {
    error("sub","Minuend nicht definiert!");
    return undefined;
    }
  if (!b) {
    error("sub","Subtrahend nicht definiert!");
    return undefined;
    }
  if (compare(a,b) < 0) {
    error("sub","Subtrahend gr\u00f6\u00dfer als Minuend!");
    return undefined;
    }
  var n = Math.max(a.length,b.length);                     // Gr��ere Dimension der beiden Arrays
  var d = newArray(n);                                     // Neues Array, gef�llt mit Nullen
  for (var i=0; i<n; i++) {                                // F�r alle Elemente des neuen Arrays ...
    if (a[i] != undefined && b[i] != undefined)            // Falls entsprechende Elemente definiert ...
      d[i] = a[i]-b[i];                                    // ... Differenz der gegebenen Elemente berechnen ...
    else if (b[i] == undefined) d[i] = a[i];               // ... oder Element von a �bernehmen
    }
  norm(d);                                                 // Normalisierung
  return d;                                                // R�ckgabewert
  }
  
// Betrag der Differenz:

function abssub (a, b) {
  if (compare(a,b) >= 0) return sub(a,b);
  else return sub(b,a);
  }
  
// Multiplikation:

function mul (a, b) {
  var n = a.length+b.length;
  var r = newArray(n);
  for (var i=0; i<b.length; i++) {
    var p = newArray(a.length+i);
    for (var j=i; j<a.length+i; j++) p[j] = b[i]*a[j-i];      
    r = add(r,p);
    }
  norm(r);
  return r;
  }
  
// Division mit Rest:
// a ... Dividend (als normalisiertes Array)
// b ... Divisor (als normalisiertes Array)
// R�ckgabewert: Array mit zwei Elementen, n�mlich normalisiertes Array f�r den Quotienten und normalisiertes Array f�r den Rest
  
function divmod (a, b) {
  if (!a) {
    error("divmod","Dividend nicht definiert!");
    return undefined;
    }
  if (!b) {
    error("divmod","Divisor nicht definiert!");
    return undefined;
    }
  var r = clone(a);                                        // Kopie des Dividenden (als Array)
  var n1 = a.length, n2 = b.length;                        // Dimensionen der gegebenen Arrays
  // Im Folgenden wird ein m�glichst gro�es Produkt (q) aus dem Dividenden b und einer Zweierpotenz gesucht,
  // das h�chstens so gro� ist wie der Dividend.
  if (n2 < n1) {                                           // Falls Divisor-Array kleiner als Dividenden-Array ...
    var q = newArray(n1-1);                                // ... Neues Array aus Nullen
    for (var i=0; i<n2; i++) q[i+n1-n2-1] = b[i];          // ... Kopie des Divisor-Arrays (verschoben)
    }
  else q = clone(b);                                       // ... Andernfalls Kopie des Divisor-Arrays                                      
  while (compare(q,a) < 0) {                               // Solange Produkt q kleiner als Dividend ...
    var h = mul(q,NAT2);                                   // 2*q berechnen
    if (compare(h,a) > 0) break;                           // Falls 2*q gr��er als a, abbrechen
    q = h;                                                 // Wert �bernehmen (q verdoppeln)
    }
  // Divisionsalgorithmus (Bin�rsystem):  
  var res = NAT0;                                          // Startwert 0 f�r Ergebnis
  while (compare(q,b) >= 0) {                              // Solange q gr��er oder gleich b ...
    //alert("r = "+string(r)+"; q = "+string(q));
    if (compare(r,q) >= 0) {                               // Falls r gr��er oder gleich q ...
      res = add(res,NAT1);                                 // ... Ergebnisvariable um 1 erh�hen
      r = sub(r,q);                                        // ... r entsprechend vermindern
      }
    //alert("res = "+string(res));
    if (compare(q,b) == 0) break;                          // Falls q gleich Divisor b, abbrechen 
    res = mul(res,NAT2);                                   // Ergebnisvariable verdoppeln   
    div2(q);                                               // q halbieren
    }
  norm(r);                                                 // Array r f�r Rest normalisieren
  norm(res);                                               // Array res f�r Ergebnis normalisieren
  return [res, r];                                         // R�ckgabewert
  }
  
// Division (Rest f�llt unter den Tisch):
  
function div (a, b) {
  return divmod(a,b)[0];
  }
  
// Rest:
  
function mod (a, b) {
  return divmod(a,b)[1];
  }
  
// Fakult�t:
// n ... Gegebene Zahl (nat�rliche Zahl oder 0)

function fac (n) {
  var p = NAT1;                                            // Startwert f�r das Produkt
  var f = NAT1;                                            // Startwert f�r Faktor                                            
  for (var i=1; i<=n; i++) {                               // F�r alle Zahlen von 1 bis n ...
    p = mul(p,f);                                          // Produkt mit neuem Faktor multiplizieren
    if (i < n) f = add(f,NAT1);                            // Faktor um 1 erh�hen
    }
  return p;                                                // R�ckgabewert
  }
  
// Binomialkoeffizient:
// n ... Obere Zahl (normalisiertes Array)
// k ... Untere Zahl (normalisiertes Array)

function bincoeff (n, k) {
  if (compare(n,k) < 0) return NAT0;                       // Sonderfall n < k
  var bc = NAT1;                                           // Startwert 1 f�r Ergebnis
  var f1 = clone(n);                                       // Startwert n f�r Faktor im Z�hler
  var f2 = NAT1;                                           // Startwert 1 f�r Faktor im Nenner
  while (compare(f2,k) <= 0) {                             // Solange Faktor im Nenner kleiner oder gleich k ...
    bc = div(mul(bc,f1),f2);                               // Neue Faktoren ber�cksichtigen 
    f1 = sub(f1,NAT1);                                     // Faktor im Z�hler um 1 erh�hen 
    f2 = add(f2,NAT1);                                     // Faktor im Nenner um 1 erh�hen
    }
  return bc;                                               // R�ckgabewert
  }
  
// Division einer nat�rlichen Zahl durch 10 mit Rest:
// a ... Array der Zahl (normalisiert vorausgesetzt)

function div10mod (a) {
  var c = clone(a);                                        // Kopie des Arrays
  for (var i=a.length-1; i>=0; i--) {                      // Wiederhole vom h�chstwertigen Element an abw�rts ...
    var re = c[i]%10;                                      //   Rest der ganzzahligen Division durch 10
    c[i] = Math.floor(c[i]/10);                            //   Quotient der ganzzahligen Division durch 10
    if (i > 0) c[i-1] += re*BASE;                          //   N�chsttieferes Element korrigieren
    }
  norm(c);                                                 // Array normalisieren (Elemente < BASE, keine unn�tigen Elemente)
  return {q: c, r: re};                                    // R�ckgabewert (Quotient als Array, Rest)
  }
  
// Halbierung einer geraden nat�rlichen Zahl:

function div2 (a) {
  for (var i=a.length-1; i>=0; i--) {
    var re = a[i]%2;
    a[i] = Math.floor(a[i]/2);
    if (re != 0) a[i-1] += re*BASE;
    }
  norm(a);
  }
  
// �berpr�fung, ob eine nat�rliche Zahl kleiner als 10 ist:
// a ... Array der Zahl (normalisiert vorausgesetzt)
  
function less10 (a) {
  if (a.length > 1) return false;
  if (a.length == 0) return true; // ???
  return (a[0] < 10);
  }
  
// Gr��ter gemeinsamer Teiler (euklidischer Algorithmus):

function gcd (a, b) {
  var aa = clone(a), bb = clone(b);
  while (compare(bb,NAT0) != 0) {
    var h = mod(aa,bb);
    aa = bb;
    bb = h;
    }
  return aa;
  }
  
// Kleinstes gemeinsames Vielfaches:

function lcm (a, b) {
  return mul(div(a,gcd(a,b)),b);
  }
  
// Umwandlung einer nat�rlichen Zahl in eine Zeichenkette (Schreibweise im Dezimalsystem):
// a ... Array der Zahl (normalisiert vorausgesetzt)
// n ... Zahl der Zeichen pro Zeile (optional)

function string (a, n) {
  var s = "";                                              // Leere Zeichenkette
  var q = clone(a);                                        // Kopie des Arrays a als Dividend
  while (!less10(q)) {                                     // Solange Dividend gr��er oder gleich 10 ...
    var dm = div10mod(q);                                  // Division durch 10 mit Rest
    s = String(dm.r)+s;                                    // Zeichenkette durch neue Anfangsziffer erg�nzen
    q = dm.q;                                              // Dividend aktualisieren 
    }
  s = String(q[0])+s;                                      // Zeichenkette durch Anfangsziffer erg�nzen
  if (!n) return s;                                        // R�ckgabewert (ohne Zeilenumbruch)
  var t = "";                                              // Neue Zeichenkette (zun�chst leer)
  while (s.length > n) {                                   // Solange noch mehr als eine Zeile auszugeben ist ...
    t += s.substring(0,n)+"\n";                            // Neue Zeile hinzuf�gen
    s = s.substring(n);                                    // Bisherige Zeichenkette entsprechend k�rzen
    }
  t += s.substring(0);                                     // Letzte Zeile hinzuf�gen
  return t;                                                // R�ckgabewert (mit Zeilenumbruch)
  }
  
//-------------------------------------------------------------------------------------------------
// Klasse Integer (ganze Zahl)
//-------------------------------------------------------------------------------------------------

// Konstruktor:
// s ... Zeichenkette

function Integer (s) {
  if (s.length == 0) throw new TypeError();
  if (s.charAt(0) == "+") {
    this.sign = 1; 
    this.modulus = array(s.substring(1));
    }
  else if (s.charAt(0) == "-") {
    this.sign = -1;
    this.modulus = array(s.substring(1));
    }
  else {
    var z = array(s);
    this.sign = compare(z,NAT0);
    this.modulus = z;
    }
  if (compare(this.modulus,NAT0) == 0) this.sign = 0;
  }
  
// Umwandlung einer nat�rlichen Zahl (Array) in Integer:

function natToInteger (n) {
  var i = new Integer("0");
  i.sign = 1; i.modulus = clone(n);
  return i;
  }
  
// Umwandlung in eine Zeichenkette:

Integer.prototype.toString = function () {
  var s = (this.sign>=0 ? "" : "-");
  return s+string(this.modulus);
  }
  
// Addition einer weiteren ganzen Zahl:

Integer.prototype.add = function (z) {
  var s1 = this.sign, s2 = z.sign;                         // Vorzeichen
  var gr12 = compare(this.modulus,z.modulus);              // Vergleich der Betr�ge
  var m = new Integer("0");                                // Neue ganze Zahl (f�r R�ckgabewert)
  if (s1 >= 0 && s2 >= 0) {                                // Falls positive Zahl plus positive Zahl ...
    m.sign = Math.max(s1,s2);                              // ... Vorzeichen + oder 0
    m.modulus = add(this.modulus,z.modulus);               // ... Summe der Betr�ge
    }
  else if (s1 <= 0 && s2 <= 0) {                           // Falls negative Zahl plus negative Zahl ...
    m.sign = Math.min(s1,s2);                              // ... Vorzeichen - oder 0
    m.modulus = add(this.modulus,z.modulus);               // ... Summe der Betr�ge
    }
  else if (s1 > 0 && s2 < 0) {                             // Falls positive Zahl plus negative Zahl ...
    m.sign = gr12;                                         // ... Vorzeichen je nach gr��erem Betrag
    m.modulus = abssub(this.modulus,z.modulus);            // ... Differenz der Betr�ge                                            
    }
  else if (s1 < 0 && s2 > 0) {                             // Falls negative Zahl plus positive Zahl ...
    m.sign = -gr12;                                        // ... Vorzeichen je nach gr��erem Betrag
    m.modulus = abssub(this.modulus,z.modulus);            // ... Differenz der Betr�ge  
    }
  return m;                                                // R�ckgabewert
  }
  
// Subtraktion einer weiteren ganzen Zahl:

Integer.prototype.subtract = function (z) {
  var s1 = this.sign, s2 = z.sign;                         // Vorzeichen
  var gr12 = compare(this.modulus,z.modulus);              // Vergleich der Betr�ge
  var m = new Integer("0");                                // Neue ganze Zahl (f�r R�ckgabewert)
  if (s1 >= 0 && s2 <= 0) {                                // Falls positive Zahl minus negative Zahl ...
    m.sign = Math.max(s1,-s2);                             // ... Vorzeichen + oder 0
    m.modulus = add(this.modulus,z.modulus);               // ... Summe der Betr�ge
    }
  else if (s1 <= 0 && s2 >= 0) {                           // Falls negative Zahl minus positive Zahl ...
    m.sign = Math.min(s1,-s2);                             // ... Vorzeichen - oder 0
    m.modulus = add(this.modulus,z.modulus);               // ... Summe der Betr�ge
    }
  else if (s1 > 0 && s2 > 0) {                             // Falls positive Zahl minus positive Zahl ...
    m.sign = gr12;                                         // ... Vorzeichen je nach gr��erem Betrag
    m.modulus = abssub(this.modulus,z.modulus);            // ... Differenz der Betr�ge
    }
  else if (s1 < 0 && s2 < 0) {                             // Falls negative Zahl minus negative Zahl ...
    m.sign = -gr12;                                        // ... Vorzeichen je nach gr��erem Betrag
    m.modulus = abssub(this.modulus,z.modulus);            // ... Differenz der Betr�ge
    }
  return m;
  }
  
// Multiplikation einer weiteren ganzen Zahl:

Integer.prototype.multiply = function (z) {
  var m = new Integer("0");                                // Neue ganze Zahl (f�r R�ckgabewert)
  m.sign = this.sign*z.sign;                               // Vorzeichen
  m.modulus = mul(this.modulus,z.modulus);                 // Betrag
  return m;                                                // R�ckgabewert
  }
  
// Vergleich mit einer weiteren ganzen Zahl:
// R�ckgabewert: 0 bei Gleichheit; +1, wenn gegebene Zahl gr��er; -1, wenn gegebene Zahl kleiner

Integer.prototype.compareTo = function (z) {
  var s1 = this.sign, s2 = z.sign;
  if (s1 > 0 && s2 < 0) return +1;                         // 1. Fall: +/-
  if (s1 < 0 && s2 > 0) return -1;                         // 2. Fall: -/+
  if (s1 == 0) return -s2;                                 // 3. Fall: 0/-, 0/0, 0/+
  if (s2 == 0) return s1;                                  // 4. Fall: -/0, +/0
  if (s1 > 0 && s2 > 0)                                    // 5. Fall: +/+
    return compare(this.modulus,z.modulus);
  if (s1 < 0 && s2 < 0)                                    // 6. Fall: -/-
    return -compare(this.modulus,z.modulus);
  }
  
//-------------------------------------------------------------------------------------------------
// Klasse Rational (rationale Zahl)
//-------------------------------------------------------------------------------------------------

// Konstruktor:

function Rational (s) {
  var i = s.indexOf("/");
  if (i < 0) throw new TypeError();
  this.num = new Integer(s.substring(0,i));
  this.denom = array(s.substring(i+1));
  }
  
// Umwandlung in eine Zeichenkette:

Rational.prototype.toString = function () {
  var s = this.num.toString()+"/";
  s += string(this.denom);
  return s;
  }
  
// K�rzen:

Rational.prototype.reduce = function () {
  var f = gcd(this.num.modulus,this.denom);
  var res = new Rational("0/1"); 
  res.num.sign = this.num.sign;
  res.num.modulus = div(this.num.modulus,f);
  res.denom = div(this.denom,f);
  return res;
  }
  
// Addition einer weiteren rationalen Zahl:

Rational.prototype.add = function (z) {
  var n = lcm(this.denom,z.denom);                         // Hauptnenner
  var ef1 = natToInteger(div(n,this.denom));               // Erster Erweiterungsfaktor
  var ef2 = natToInteger(div(n,z.denom));                  // Zweiter Erweiterungsfaktor
  var z1 = ef1.multiply(this.num);                         // Neuer Z�hler des ersten Bruchs
  var z2 = ef2.multiply(z.num);                            // Neuer Z�hler des zweiten Bruchs
  var res = new Rational("0/1");                           // Neue rationale Zahl
  res.num = z1.add(z2);                                    // Z�hler
  res.denom = n;                                           // Nenner
  return res.reduce();                                     // R�ckgabewert (gek�rzt)
  }
  
// Subtraktion einer weiteren rationalen Zahl:

Rational.prototype.subtract = function (z) {
  var n = lcm(this.denom,z.denom);                         // Hauptnenner
  var ef1 = natToInteger(div(n,this.denom));               // Erster Erweiterungsfaktor
  var ef2 = natToInteger(div(n,z.denom));                  // Zweiter Erweiterungsfaktor
  var z1 = ef1.multiply(this.num);                         // Neuer Z�hler des ersten Bruchs
  var z2 = ef2.multiply(z.num);                            // Neuer Z�hler des zweiten Bruchs
  var res = new Rational("0/1");                           // Neue rationale Zahl
  res.num = z1.subtract(z2);                               // Z�hler
  res.denom = n;                                           // Nenner
  return res.reduce();                                     // R�ckgabewert (gek�rzt)
  }
  
// Multiplikation einer weiteren rationalen Zahl:

Rational.prototype.multiply = function (z) { 
  var n = this.num.multiply(z.num); 
  var d = mul(this.denom,z.denom); 
  var res = new Rational("0/1");
  res.num = n;
  res.denom = d;
  return res.reduce();
  }
  
// Division durch eine weitere rationale Zahl:

Rational.prototype.divide = function (z) {
  var n = this.num.multiply(natToInteger(z.denom));
  if (z.num.sign == -1) n.sign = -n.sign;
  var d = mul(this.denom,z.num.modulus);
  var res = new Rational("0/1");
  res.num = n;
  res.denom = d;
  return res.reduce();
  }
  
