// Klasse GF (Element des Galois-Felds GF(p^n))
// 26.07.2022 - 01.08.2022
// Es wird ein Array coeff der Länge n verwendet, das die Koeffizienten (vom Typ ZP) enthält.
// Wichtig: q, p, n, coeffPower müssen definiert sein.

class GF {

  // Konstruktor:
  
  constructor (c) {
    this.coeff = c;                                        // Koeffizienten-Array übernehmen                                      
    }
    
  // Übereinstimmung mit einem anderen Element von GF(p^n):
    
  equals (e2) {
    var c1 = this.coeff, c2 = e2.coeff;                     // Koeffizienten-Arrays
    if (c1 == undefined || c2 == undefined) return false;   // Rückgabewert, falls Koeffizienten-Array nicht definiert
  	if (c1.length != n || c2.length != n) return false;     // Rückgabewert, falls Array-Größe falsch
  	for (var i=0; i<n; i++)                                 // Für alle Indizes bzw. Exponenten ...
  	  if (!c1[i].equals(c2[i])) return false;               // Rückgabewert, falls Abweichung
  	return true;                                            // Rückgabewert, falls keine Abweichung
    }
    
  // Übereinstimmung mit dem Nullelement von GF(p^n):
    
  isZero () {
    var c = this.coeff;                                    // Koeffizienten-Array
    if (c == undefined) return false;                      // Rückgabewert, falls Koeffizienten-Array nicht definiert
    if (c.length != n) return false;                       // Rückgabewert, falls Array-Größe falsch
    for (var i=0; i<n; i++)                                // Für alle Indizes bzw. Exponenten ...
  	  if (!c[i].isZero()) return false;                    // Rückgabewert, falls Koeffizient ungleich 0
  	return true;                                           // Rückgabewert, falls alle Koeffizienten gleich 0
  	}
  	
  // Übereinstimmung mit dem Einselement von GF(p^n):
  	
  isOne () {
    var c = this.coeff;                                    // Koeffizienten-Array
    if (c == undefined) return false;                      // Rückgabewert, falls Koeffizienten-Array nicht definiert
    if (c.length != n) return false;                       // Rückgabewert, falls Array-Größe falsch
  	if (!c[0].isOne()) return false;                       // Rückgabewert, falls Abweichung von 1 bei Index 0
  	else if (n == 1) return true;                          // Rückgabewert, falls Einselement von GF(p)
  	for (var i=1; i<n; i++)                                // Für alle Indizes bzw. Exponenten ab 1 ...
  	  if (!c[i].isZero()) return false;                    // Rückgabewert, falls Koeffizient ungleich 0
  	return true;                                           // Rückgabewert, falls keine Abweichung
    }
    
  // Addition eines weiteren Elements von GF(p^n):
    
  add (e2) {
    var c1 = this.coeff, c2 = e2.coeff;                    // Koeffizienten-Arrays
    if (c1 == undefined || c2 == undefined)                // Falls Koeffizienten-Array nicht definiert ...
      return undefined;                                    // Rückgabewert undefiniert
  	if (c1.length != n || c2.length != n)                  // Falls Array-Größe falsch ...
  	  return undefined;                                    // Rückgabewert undefiniert
  	var c = new Array(n);                                  // Neues Array für Koeffizienten
  	for (var i=0; i<n; i++)                                // Für alle Indizes bzw. Exponenten ...
  	  c[i] = c1[i].add(c2[i]);                             // Aktueller Koeffizient
  	return new GF(c);                                      // Rückgabewert
    }
    
  // Subtraktion eines weiteren Elements von GF(p^n):
    
  sub (e2) {
    var c1 = this.coeff, c2 = e2.coeff;                    // Koeffizienten-Arrays
    if (c1 == undefined || c2 == undefined)                // Falls Koeffizienten-Array nicht definiert ...
      return undefined;                                    // Rückgabewert undefiniert
  	if (c1.length != n || c2.length != n)                  // Falls Array-Größe falsch ...
  	  return undefined;                                    // Rückgabewert undefiniert
  	var c = new Array(n);                                  // Neues Array für Koeffizienten
  	for (var i=0; i<n; i++)                                // Für alle Indizes bzw. Exponenten ...
  	  c[i] = c1[i].sub(c2[i]);                             // Aktueller Koeffizient
  	return new GF(c);                                      // Rückgabewert
    }
    
  // Inverses Element bezüglich Addition:
  
  neg () {
    var c0 = this.coeff;                                   // Koeffizienten-Array
    if (c0 == undefined) return undefined;                 // Rückgabewert, falls Koeffizienten-Array nicht definiert
    if (c0.length != n) return undefined;                  // Rückgabewert, falls Array-Größe falsch
    var c = new Array(n);                                  // Neues Array für Koeffizienten
    for (var i=0; i<n; i++)                                // Für alle Indizes bzw. Exponenten ...
      c[i] = c0[i].neg();                                  // Aktueller Koeffizient
    return new GF(c);                                      // Rückgabewert
    } 
    
  // Multiplikation eines weiteren Elements von GF(p^n):
    
  mul (e2) {
    if (e2 == undefined) return undefined;                 // Sonderfall: Zweiter Faktor nicht definiert
    var c1 = this.coeff, c2 = e2.coeff;                    // Koeffizienten-Arrays
    if (c1 == undefined || c2 == undefined)                // Falls Koeffizienten-Array nicht definiert ...
      return undefined;                                    // Rückgabewert undefiniert
  	if (c1.length != n || c2.length != n)                  // Falls Array-Größe falsch ...
  	  return undefined;                                    // Rückgabewert undefiniert
  	var c = new Array(n);                                  // Neues Array für Koeffizienten
  	for (var k=0; k<n; k++) c[k] = new ZP(0);              // Koeffizienten zunächst gleich 0
  	for (var i=0; i<n; i++) {                              // Für alle Indizes bzw. Exponenten (1. Faktor) ...
  	  for (var j=0; j<n; j++) {                            // Für alle Indizes bzw. Exponenten (2. Faktor) ...
  	    var h = c1[i].mul(c2[j]);                          // Hilfsgröße (Produkt von Koeffizienten)
  	    for (var k=0; k<n; k++)                            // Für alle Indizes (Ergebnis) ...
  	      c[k] = c[k].add(h.mul(coeffPower[i+j][k]));      // Koeffizient aktualisieren	
  	    }
  	  } // Ende for (i)
  	return new GF(c);                                      // Rückgabewert
    }
    
  // Inverses Element bezüglich Multiplikation:
  // Systematisches Probieren, bei Misserfolg Rückgabewert undefined
  
  inverse () {
    var c = this.coeff;                                    // Koeffizienten-Array
    if (c == undefined) return undefined;                  // Rückgabewert, falls Koeffizienten-Array nicht definiert
    if (c.length != n) return undefined;                   // Rückgabewert, falls Array-Größe falsch
  	if (this.isZero()) return undefined;                   // Rückgabewert, falls Argument gleich Nullelement
  	for (var i=1; i<q; i++) {                              // Für alle Indizes von 1 bis q-1 ...
  	  var e = gfIndex(i);                                  // Zugehöriges Körperelement
  	  if (this.mul(e).isOne()) return e;                   // Rückgabewert, falls Produkt gleich 1
  	  }
  	return undefined;                                      // Rückgabewert, falls kein Inverses gefunden
    }
    
  // Division durch ein weiteres Element von GF(p^n):
  // Zur Verringerung der Rechenzeit wird das Array inv verwendet, in dem die inversen Elemente gespeichert sind.
  
  div (e2) {
    var c1 = this.coeff, c2 = e2.coeff;                    // Koeffizienten-Arrays
    if (c1 == undefined || c2 == undefined)                // Falls Koeffizienten-Array nicht definiert ...
      return undefined;                                    // Rückgabewert undefiniert
  	if (c1.length != n || c2.length != n)                  // Falls Array-Größe falsch ...
  	  return undefined;                                    // Rückgabewert undefiniert
  	if (e2.isZero()) return undefined;                     // Rückgabewert, falls Division durch Nullelement
  	if (n > 1) return this.mul(inv[e2.index()]);           // Rückgabewert (Normalfall)
    }
    
  // Monom als Zeichenkette:
  // i ... Exponent bzw. Index (0 bis n-1)
  	
  stringMonomial (i) {
  	var c = this.coeff[i];                                 // Koeffizient
  	var s = String(c);                                     // Koeffizient als Zeichenkette
  	if (i == 0) return s;                                  // Rückgabewert, falls Exponent gleich 0
  	if (c.isZero()) return "0";                            // Rückgabewert, falls Koeffizient gleich 0
  	if (c.isOne()) s = "";                                 // Falls Koeffizient gleich 1, weglassen
  	s += root;                                             // Symbol für Wurzel des Minimalpolynoms
  	if (i > 1) s += "^"+i;                                 // Falls sinnvoll, Potenz
  	return s;                                              // Rückgabewert
    }
    
  // Umwandlung in eine Zeichenkette:
    
  toString () {
    if (this.coeff == undefined) return "?";               // Rückgabewert, falls Koeffizienten-Array nicht definiert
  	if (this.isZero()) return "0";                         // Rückgabewert, falls Nullelement
  	var s = "";                                            // Startwert Zeichenkette
  	var first = true;                                      // Flag für 1. Summand, Startwert                                     
  	for (var i=0; i<n; i++) {                              // Für alle Indizes bzw. Exponenten ...
  	  var m = this.stringMonomial(i);                      // Aktueles Monom als Zeichenkette
  	  if (m == "0") continue;                              // Falls Nullmonom, weiter zum nächsten Index
  	  if (first) first = false;                            // Entweder Falg für 1. Summand löschen ...
  	  else s += " + ";                                     // ... oder Pluszeichen sowie Leerzeichen hinzufügen
  	  s += m;                                              // Zeichenkette für aktuelles Monom hinzufügen
  	  }
  	return s;                                              // Rückgabewert
    }  
    
  // Index (gemäß Horner-Schema):
  
  index () {
    var s = 0;                                             // Startwert
    for (var i=n-1; i>=0; i--) {                           // Für alle Indizes bzw. Exponenten (absteigend) ...
      s *= p;                                              // Mit Charakteristik p multiplizieren 
      s += this.coeff[i].z;                                // Index des aktuellen Summanden addieren
      }
    return s;                                              // Rückgabewert
    }
    
  // Grafikausgabe eines Monoms:
  // i ....... Index bzw. Exponent
  // (x,y) ... Position (Pixel)
  // Rückgabewert: Neue x-Koordinate (Pixel)
    
  writeMonomial (i, x, y) {  	
  	var c = this.coeff[i];                                 // Koeffizient
  	var s = String(c);                                     // Koeffizient als Zeichenkette
  	if (i == 0 || c.isZero()) return writeString(s,x,y);   // Exponent oder Koeffizient gleich 0  	
  	if (c.isOne()) s = "";                                 // Falls Koeffizient gleich 1, weglassen
  	else x = writeString(s,x,y)+5;                         // Ausgabe eines Koeffizienten ungleich 1, neue x-Koordinate
  	x = writeString(root,x,y);                             // Symbol für Wurzel des Minimalpolynoms, neue x-Koordinate
  	if (i > 1) x = writeString(String(i),x,y-5);           // Ausgabe des Exponenten, falls sinnvoll, neue x-Koordinate
  	return x;                                              // Rückgabewert
    }
    
  // Breite eines Monoms (kompatibel mit writeMonomial):
  // i ... Index bzw. Exponent
    
  widthMonomial (i) {
  	var w = 0;                                              // Startwert Breite
  	var c = this.coeff[i];                                  // Koeffizient
  	var dw = widthString(String(c));                        // Breite Koeffizient (Pixel)
  	if (i == 0 || c.isZero()) return dw;                    // Rückgabewert, falls Exponent oder Koeffizient gleich 0
  	if (!c.isOne()) w = dw+5;                               // Breite von Koeffizient und Abstand (Pixel)
  	w += widthString(root);                                 // Breite des Wurzelsymbols addieren (Pixel)
  	if (i > 1) w += widthString(String(i));                 // Breite des Exponenten addieren (Pixel)
  	return w;                                               // Rückgabewert
    }
    
  // Grafikausgabe des Körperelements (als Summe von Monomen bezüglich Alpha):
  // (x,y) ... Position (Pixel)
  // Rückgabewert: Neue x-Koordinate (Pixel)
  
  write (x, y) {
    var c = this.coeff;                                    // Koeffizienten-Array
  	if (c == undefined) return writeString("?",x,y);       // Sonderfall: Koeffizienten-Array nicht definiert
  	if (this.isZero()) return writeString("0",x,y);        // Sonderfall: Nullelement
  	var first = true;                                      // Flag für 1. Summand, Startwert 
  	for (var i=0; i<c.length; i++) {                       // Für alle Indizes bzw. Exponenten ...
  	  if (c[i].isZero()) continue;                         // Falls Nullmonom, weiter zum nächsten Index
  	  if (first) first = false;                            // Entweder Flag für 1. Summand löschen ...
  	  else x = writeString(" + ",x,y);                     // ... oder Pluszeichen mit Leerzeichen, neue x-Koordinate                   
  	  x = this.writeMonomial(i,x,y);                       // Monom ausgeben, neue x-Koordinate
  	  }
  	return x;                                              // Rückgabewert
    }
    
  // Gesamtbreite (Pixel, kompatibel zur vorhergehenden Methode write):
    
  width () {
    var c = this.coeff;                                    // Koeffizienten-Array
  	if (c == undefined) return widthString("?");           // Sonderfall: Koeffizienten-Array nicht definiert
  	if (this.isZero()) return widthString("0");            // Sonderfall: Nullelement
  	var first = true;                                      // Flag für 1. Summand, Startwert
  	var w = 0;                                             // Startwert Breite
  	for (var i=0; i<c.length; i++) {                       // Für alle Indizes bzw. Exponenten ...
  	  if (c[i].isZero()) continue;                         // Falls Nullmonom, weiter zum nächsten Index
  	  if (first) first = false;                            // Entweder Flag für 1. Summand löschen ...
  	  else w += widthString(" + ");                        // ... oder Breite erhöhen (Pluszeichen mit Leerzeichen)
  	  w += this.widthMonomial(i);                          // Breite des aktuellen Monoms addieren 
  	  }
  	return w;                                              // Rückgabewert
    }
    
  // Zentrierte Grafikausgabe:
  // (x,y) ... Position (Pixel)
  
  center (x, y) {
    this.write(x-this.width()/2,y);                        // Methode für linksbündige Ausgabe aufrufen
    }

  } // Ende der Klasse GF
  
