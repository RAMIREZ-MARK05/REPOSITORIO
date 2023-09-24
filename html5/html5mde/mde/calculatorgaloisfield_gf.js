// Klasse GF (Element des Galois-Felds GF(p^n))
// 26.07.2022 - 01.08.2022
// Es wird ein Array coeff der L�nge n verwendet, das die Koeffizienten (vom Typ ZP) enth�lt.
// Wichtig: q, p, n, coeffPower m�ssen definiert sein.

class GF {

  // Konstruktor:
  
  constructor (c) {
    this.coeff = c;                                        // Koeffizienten-Array �bernehmen                                      
    }
    
  // �bereinstimmung mit einem anderen Element von GF(p^n):
    
  equals (e2) {
    var c1 = this.coeff, c2 = e2.coeff;                     // Koeffizienten-Arrays
    if (c1 == undefined || c2 == undefined) return false;   // R�ckgabewert, falls Koeffizienten-Array nicht definiert
  	if (c1.length != n || c2.length != n) return false;     // R�ckgabewert, falls Array-Gr��e falsch
  	for (var i=0; i<n; i++)                                 // F�r alle Indizes bzw. Exponenten ...
  	  if (!c1[i].equals(c2[i])) return false;               // R�ckgabewert, falls Abweichung
  	return true;                                            // R�ckgabewert, falls keine Abweichung
    }
    
  // �bereinstimmung mit dem Nullelement von GF(p^n):
    
  isZero () {
    var c = this.coeff;                                    // Koeffizienten-Array
    if (c == undefined) return false;                      // R�ckgabewert, falls Koeffizienten-Array nicht definiert
    if (c.length != n) return false;                       // R�ckgabewert, falls Array-Gr��e falsch
    for (var i=0; i<n; i++)                                // F�r alle Indizes bzw. Exponenten ...
  	  if (!c[i].isZero()) return false;                    // R�ckgabewert, falls Koeffizient ungleich 0
  	return true;                                           // R�ckgabewert, falls alle Koeffizienten gleich 0
  	}
  	
  // �bereinstimmung mit dem Einselement von GF(p^n):
  	
  isOne () {
    var c = this.coeff;                                    // Koeffizienten-Array
    if (c == undefined) return false;                      // R�ckgabewert, falls Koeffizienten-Array nicht definiert
    if (c.length != n) return false;                       // R�ckgabewert, falls Array-Gr��e falsch
  	if (!c[0].isOne()) return false;                       // R�ckgabewert, falls Abweichung von 1 bei Index 0
  	else if (n == 1) return true;                          // R�ckgabewert, falls Einselement von GF(p)
  	for (var i=1; i<n; i++)                                // F�r alle Indizes bzw. Exponenten ab 1 ...
  	  if (!c[i].isZero()) return false;                    // R�ckgabewert, falls Koeffizient ungleich 0
  	return true;                                           // R�ckgabewert, falls keine Abweichung
    }
    
  // Addition eines weiteren Elements von GF(p^n):
    
  add (e2) {
    var c1 = this.coeff, c2 = e2.coeff;                    // Koeffizienten-Arrays
    if (c1 == undefined || c2 == undefined)                // Falls Koeffizienten-Array nicht definiert ...
      return undefined;                                    // R�ckgabewert undefiniert
  	if (c1.length != n || c2.length != n)                  // Falls Array-Gr��e falsch ...
  	  return undefined;                                    // R�ckgabewert undefiniert
  	var c = new Array(n);                                  // Neues Array f�r Koeffizienten
  	for (var i=0; i<n; i++)                                // F�r alle Indizes bzw. Exponenten ...
  	  c[i] = c1[i].add(c2[i]);                             // Aktueller Koeffizient
  	return new GF(c);                                      // R�ckgabewert
    }
    
  // Subtraktion eines weiteren Elements von GF(p^n):
    
  sub (e2) {
    var c1 = this.coeff, c2 = e2.coeff;                    // Koeffizienten-Arrays
    if (c1 == undefined || c2 == undefined)                // Falls Koeffizienten-Array nicht definiert ...
      return undefined;                                    // R�ckgabewert undefiniert
  	if (c1.length != n || c2.length != n)                  // Falls Array-Gr��e falsch ...
  	  return undefined;                                    // R�ckgabewert undefiniert
  	var c = new Array(n);                                  // Neues Array f�r Koeffizienten
  	for (var i=0; i<n; i++)                                // F�r alle Indizes bzw. Exponenten ...
  	  c[i] = c1[i].sub(c2[i]);                             // Aktueller Koeffizient
  	return new GF(c);                                      // R�ckgabewert
    }
    
  // Inverses Element bez�glich Addition:
  
  neg () {
    var c0 = this.coeff;                                   // Koeffizienten-Array
    if (c0 == undefined) return undefined;                 // R�ckgabewert, falls Koeffizienten-Array nicht definiert
    if (c0.length != n) return undefined;                  // R�ckgabewert, falls Array-Gr��e falsch
    var c = new Array(n);                                  // Neues Array f�r Koeffizienten
    for (var i=0; i<n; i++)                                // F�r alle Indizes bzw. Exponenten ...
      c[i] = c0[i].neg();                                  // Aktueller Koeffizient
    return new GF(c);                                      // R�ckgabewert
    } 
    
  // Multiplikation eines weiteren Elements von GF(p^n):
    
  mul (e2) {
    if (e2 == undefined) return undefined;                 // Sonderfall: Zweiter Faktor nicht definiert
    var c1 = this.coeff, c2 = e2.coeff;                    // Koeffizienten-Arrays
    if (c1 == undefined || c2 == undefined)                // Falls Koeffizienten-Array nicht definiert ...
      return undefined;                                    // R�ckgabewert undefiniert
  	if (c1.length != n || c2.length != n)                  // Falls Array-Gr��e falsch ...
  	  return undefined;                                    // R�ckgabewert undefiniert
  	var c = new Array(n);                                  // Neues Array f�r Koeffizienten
  	for (var k=0; k<n; k++) c[k] = new ZP(0);              // Koeffizienten zun�chst gleich 0
  	for (var i=0; i<n; i++) {                              // F�r alle Indizes bzw. Exponenten (1. Faktor) ...
  	  for (var j=0; j<n; j++) {                            // F�r alle Indizes bzw. Exponenten (2. Faktor) ...
  	    var h = c1[i].mul(c2[j]);                          // Hilfsgr��e (Produkt von Koeffizienten)
  	    for (var k=0; k<n; k++)                            // F�r alle Indizes (Ergebnis) ...
  	      c[k] = c[k].add(h.mul(coeffPower[i+j][k]));      // Koeffizient aktualisieren	
  	    }
  	  } // Ende for (i)
  	return new GF(c);                                      // R�ckgabewert
    }
    
  // Inverses Element bez�glich Multiplikation:
  // Systematisches Probieren, bei Misserfolg R�ckgabewert undefined
  
  inverse () {
    var c = this.coeff;                                    // Koeffizienten-Array
    if (c == undefined) return undefined;                  // R�ckgabewert, falls Koeffizienten-Array nicht definiert
    if (c.length != n) return undefined;                   // R�ckgabewert, falls Array-Gr��e falsch
  	if (this.isZero()) return undefined;                   // R�ckgabewert, falls Argument gleich Nullelement
  	for (var i=1; i<q; i++) {                              // F�r alle Indizes von 1 bis q-1 ...
  	  var e = gfIndex(i);                                  // Zugeh�riges K�rperelement
  	  if (this.mul(e).isOne()) return e;                   // R�ckgabewert, falls Produkt gleich 1
  	  }
  	return undefined;                                      // R�ckgabewert, falls kein Inverses gefunden
    }
    
  // Division durch ein weiteres Element von GF(p^n):
  // Zur Verringerung der Rechenzeit wird das Array inv verwendet, in dem die inversen Elemente gespeichert sind.
  
  div (e2) {
    var c1 = this.coeff, c2 = e2.coeff;                    // Koeffizienten-Arrays
    if (c1 == undefined || c2 == undefined)                // Falls Koeffizienten-Array nicht definiert ...
      return undefined;                                    // R�ckgabewert undefiniert
  	if (c1.length != n || c2.length != n)                  // Falls Array-Gr��e falsch ...
  	  return undefined;                                    // R�ckgabewert undefiniert
  	if (e2.isZero()) return undefined;                     // R�ckgabewert, falls Division durch Nullelement
  	if (n > 1) return this.mul(inv[e2.index()]);           // R�ckgabewert (Normalfall)
    }
    
  // Monom als Zeichenkette:
  // i ... Exponent bzw. Index (0 bis n-1)
  	
  stringMonomial (i) {
  	var c = this.coeff[i];                                 // Koeffizient
  	var s = String(c);                                     // Koeffizient als Zeichenkette
  	if (i == 0) return s;                                  // R�ckgabewert, falls Exponent gleich 0
  	if (c.isZero()) return "0";                            // R�ckgabewert, falls Koeffizient gleich 0
  	if (c.isOne()) s = "";                                 // Falls Koeffizient gleich 1, weglassen
  	s += root;                                             // Symbol f�r Wurzel des Minimalpolynoms
  	if (i > 1) s += "^"+i;                                 // Falls sinnvoll, Potenz
  	return s;                                              // R�ckgabewert
    }
    
  // Umwandlung in eine Zeichenkette:
    
  toString () {
    if (this.coeff == undefined) return "?";               // R�ckgabewert, falls Koeffizienten-Array nicht definiert
  	if (this.isZero()) return "0";                         // R�ckgabewert, falls Nullelement
  	var s = "";                                            // Startwert Zeichenkette
  	var first = true;                                      // Flag f�r 1. Summand, Startwert                                     
  	for (var i=0; i<n; i++) {                              // F�r alle Indizes bzw. Exponenten ...
  	  var m = this.stringMonomial(i);                      // Aktueles Monom als Zeichenkette
  	  if (m == "0") continue;                              // Falls Nullmonom, weiter zum n�chsten Index
  	  if (first) first = false;                            // Entweder Falg f�r 1. Summand l�schen ...
  	  else s += " + ";                                     // ... oder Pluszeichen sowie Leerzeichen hinzuf�gen
  	  s += m;                                              // Zeichenkette f�r aktuelles Monom hinzuf�gen
  	  }
  	return s;                                              // R�ckgabewert
    }  
    
  // Index (gem�� Horner-Schema):
  
  index () {
    var s = 0;                                             // Startwert
    for (var i=n-1; i>=0; i--) {                           // F�r alle Indizes bzw. Exponenten (absteigend) ...
      s *= p;                                              // Mit Charakteristik p multiplizieren 
      s += this.coeff[i].z;                                // Index des aktuellen Summanden addieren
      }
    return s;                                              // R�ckgabewert
    }
    
  // Grafikausgabe eines Monoms:
  // i ....... Index bzw. Exponent
  // (x,y) ... Position (Pixel)
  // R�ckgabewert: Neue x-Koordinate (Pixel)
    
  writeMonomial (i, x, y) {  	
  	var c = this.coeff[i];                                 // Koeffizient
  	var s = String(c);                                     // Koeffizient als Zeichenkette
  	if (i == 0 || c.isZero()) return writeString(s,x,y);   // Exponent oder Koeffizient gleich 0  	
  	if (c.isOne()) s = "";                                 // Falls Koeffizient gleich 1, weglassen
  	else x = writeString(s,x,y)+5;                         // Ausgabe eines Koeffizienten ungleich 1, neue x-Koordinate
  	x = writeString(root,x,y);                             // Symbol f�r Wurzel des Minimalpolynoms, neue x-Koordinate
  	if (i > 1) x = writeString(String(i),x,y-5);           // Ausgabe des Exponenten, falls sinnvoll, neue x-Koordinate
  	return x;                                              // R�ckgabewert
    }
    
  // Breite eines Monoms (kompatibel mit writeMonomial):
  // i ... Index bzw. Exponent
    
  widthMonomial (i) {
  	var w = 0;                                              // Startwert Breite
  	var c = this.coeff[i];                                  // Koeffizient
  	var dw = widthString(String(c));                        // Breite Koeffizient (Pixel)
  	if (i == 0 || c.isZero()) return dw;                    // R�ckgabewert, falls Exponent oder Koeffizient gleich 0
  	if (!c.isOne()) w = dw+5;                               // Breite von Koeffizient und Abstand (Pixel)
  	w += widthString(root);                                 // Breite des Wurzelsymbols addieren (Pixel)
  	if (i > 1) w += widthString(String(i));                 // Breite des Exponenten addieren (Pixel)
  	return w;                                               // R�ckgabewert
    }
    
  // Grafikausgabe des K�rperelements (als Summe von Monomen bez�glich Alpha):
  // (x,y) ... Position (Pixel)
  // R�ckgabewert: Neue x-Koordinate (Pixel)
  
  write (x, y) {
    var c = this.coeff;                                    // Koeffizienten-Array
  	if (c == undefined) return writeString("?",x,y);       // Sonderfall: Koeffizienten-Array nicht definiert
  	if (this.isZero()) return writeString("0",x,y);        // Sonderfall: Nullelement
  	var first = true;                                      // Flag f�r 1. Summand, Startwert 
  	for (var i=0; i<c.length; i++) {                       // F�r alle Indizes bzw. Exponenten ...
  	  if (c[i].isZero()) continue;                         // Falls Nullmonom, weiter zum n�chsten Index
  	  if (first) first = false;                            // Entweder Flag f�r 1. Summand l�schen ...
  	  else x = writeString(" + ",x,y);                     // ... oder Pluszeichen mit Leerzeichen, neue x-Koordinate                   
  	  x = this.writeMonomial(i,x,y);                       // Monom ausgeben, neue x-Koordinate
  	  }
  	return x;                                              // R�ckgabewert
    }
    
  // Gesamtbreite (Pixel, kompatibel zur vorhergehenden Methode write):
    
  width () {
    var c = this.coeff;                                    // Koeffizienten-Array
  	if (c == undefined) return widthString("?");           // Sonderfall: Koeffizienten-Array nicht definiert
  	if (this.isZero()) return widthString("0");            // Sonderfall: Nullelement
  	var first = true;                                      // Flag f�r 1. Summand, Startwert
  	var w = 0;                                             // Startwert Breite
  	for (var i=0; i<c.length; i++) {                       // F�r alle Indizes bzw. Exponenten ...
  	  if (c[i].isZero()) continue;                         // Falls Nullmonom, weiter zum n�chsten Index
  	  if (first) first = false;                            // Entweder Flag f�r 1. Summand l�schen ...
  	  else w += widthString(" + ");                        // ... oder Breite erh�hen (Pluszeichen mit Leerzeichen)
  	  w += this.widthMonomial(i);                          // Breite des aktuellen Monoms addieren 
  	  }
  	return w;                                              // R�ckgabewert
    }
    
  // Zentrierte Grafikausgabe:
  // (x,y) ... Position (Pixel)
  
  center (x, y) {
    this.write(x-this.width()/2,y);                        // Methode f�r linksb�ndige Ausgabe aufrufen
    }

  } // Ende der Klasse GF
  
