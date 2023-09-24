// Klasse Polynomial (Polynom mit Koeffizienten aus GF(p))
// 27.07.2022 - 04.08.2022

// Attribut coeff (Array der Koeffizienten aus GF(p), so klein wie m�glich, aber nicht leer)

// Wichtig: q, p, n m�ssen definiert sein.

class Polynomial {

  // Konstruktor:

  constructor (c) {
    this.coeff = c;                                        // Koeffizienten-Array �bernehmen
    this.normalize();                                      // Normalisierung
    }
    
  // Normalisierung: Der Leitkoeffizient soll nicht 0 sein. Ausnahme Nullpolynom!
    
  normalize () {
  	var dim = this.coeff.length;                           // L�nge des Koeffizienten-Arrays
  	var max = dim-1;                                       // Maximaler Exponent, Startwert
  	for (var i=max; i>=0; i--) {                           // F�r alle Exponenten (absteigend) ...
  	  if (this.coeff[i].isZero()) max = i-1;               // Falls Koeffizient 0, maximalen Exponenten aktualisieren
  	  else break;                                          // Sonst abbrechen
  	  }
  	if (max == dim-1) return;                              // Falls Bereinigung unn�tig, abbrechen
  	if (max == -1) return;                                 // Falls Bereinigung sinnlos (Nullpolynom), abbrechen
  	var c = new Array(max+1);                              // Neues Koeffizienten-Array
  	for (i=0; i<=max; i++)                                 // F�r alle Exponenten ...
  	  c[i] = this.coeff[i];                                // Koeffizient �bernehmen                       
  	this.coeff = c;                                        // Neues Koeffizienten-Array �bernehmen
    }
    
  // Grad des Polynoms (f�r das Nullpolynom 0):
    
  degree () {
  	return this.coeff.length-1;                             // R�ckgabewert
    }
    
  // Gleichheit mit dem Nullpolynom:
  
  isZero () {
    var c = this.coeff;
  	return (c.length == 1 && c[0].isZero());                // R�ckgabewert
    }
    
  // Addition eines weiteren Polynoms:
    
  add (p2) {
  	var n1 = this.degree();                                // Grad des gegebenen Polynoms
  	var n2 = p2.degree();                                  // Grad des zweiten Polynoms
  	var n = Math.max(n1,n2);                               // Vorl�ufiger Grad des neuen Polynoms
  	var c = new Array(n+1);                                // Neues Koeffizienten-Array
  	for (var i=0; i<=n; i++) {                             // F�r alle Exponenten ...
  	  var c1 = this.coeff[i], c2 = p2.coeff[i];            // Koeffizienten der Summanden
  	  if (i > n1) c[i] = c2;                               // Berechnung des neuen Koeffizienten, 1. Sonderfall
  	  else if (i > n2) c[i] = c1;                          // Berechnung des neuen Koeffizienten, 2. Sonderfall
  	  else c[i] = c1.add(c2);                              // Berechnung des neuen Koeffizienten, Normalfall
  	  }
  	return new Polynomial(c);                              // R�ckgabewert 
    }
    
  // Subtraktion eines weiteren Polynoms:
    
  sub (p2) {
  	var n1 = this.degree();                                // Grad des gegebenen Polynoms
  	var n2 = p2.degree();                                  // Grad des zweiten Polynoms
  	var n = Math.max(n1,n2);                               // Vorl�ufiger Grad des neuen Polynoms
  	var c = new Array(n+1);                                // Neues Koeffizienten-Array
  	for (var i=0; i<=n; i++) {                             // F�r alle Exponenten ...
  	  var c1 = this.coeff[i], c2 = p2.coeff[i];            // Koeffizienten von Minuend und Subtrahend
  	  if (i > n1) c[i] = c2.neg();                         // Berechnung des neuen Koeffizienten, 1. Sonderfall
  	  else if (i > n2) c[i] = c1;                          // Berechnung des neuen Koeffizienten, 2. Sonderfall
  	  else c[i] = c1.sub(c2);                              // Berechnung des neuen Koeffizienten, Normalfall
  	  }
  	var k = n;                                             // Variable f�r den tats�chlichen Grad
  	while (k > 0 && c[k].isZero()) k--;                    // Tats�chlichen Grad ermitteln
  	if (k < n) {                                           // Falls Koeffizienten-Array bisher zu gro� ...
  	  var d = new Array(k+1);                              // Neues Koeffizienten-Array
  	  for (i=0; i<=k; i++) d[i] = c[i];                    // Koeffizienten �bernehmen
  	  c = d;                                               // Koeffizienten-Array �bernehmen
  	  }
  	return new Polynomial(c);                              // R�ckgabewert 
    }
    
  // Multiplikation eines weiteren Polynoms:
  
  mul (p2) {
  	var n1 = this.degree();                                // Grad des gegebenen Polynoms
  	var n2 = p2.degree();                                  // Grad des zweiten Polynoms
  	var n = n1+n2;                                         // Vorl�ufiger Grad des neuen Polynoms
  	var c = new Array(n+1);                                // Neues Koeffizienten-Array
  	for (var k = 0; k <= n; k++) {                         // F�r alle Exponenten (Ergebnispolynom) ...
  	  var su = new ZP(0);                                  // Startwert Summe
  	  for (var i=0; i<= n1; i++)                           // F�r alle Exponenten (1. Polynom) ... 
  	  	if (k-i >= 0 && k-i <= n2)                         // Falls 2. Koeffizient definiert ... 
  	  	  su = su.add(this.coeff[i].mul(p2.coeff[k-i]));   // Summe aktualisieren
  	  c[k] = su;                                           // Summe als Koeffizient �bernehmen
  	  }
  	return new Polynomial(c);                              // R�ckgabewert
    }
    
  // Monom als Zeichenkette:
  // i ... Exponent bzw. Index (0 bis n)
  
  stringMonomial (i) {
  	var c = this.coeff[i];                                 // Koeffizient
  	if (c.isZero()) return "0";                            // R�ckgabewert, falls Monom gleich 0
  	var s = "";                                            // Startwert Zeichenkette
  	if (!c.isOne() || i == 0) s += c;                      // Falls sinnvoll, Koeffizient hinzuf�gen 
  	if (i > 0) {                                           // Falls Exponent gr��er als 0 ...
  	  if (!c.isOne()) s += " ";                            // Falls sinnvoll, Leerzeichen hinzuf�gen
  	  s += varPoly;                                        // Variable hinzuf�gen
  	  }
  	if (i > 1) s += "^"+i;                                 // Exponent hinzuf�gen, falls gr��er als 1
  	return s;                                              // R�ckgabewert
    }
    
  // Umwandlung in eine Zeichenkette:
    
  toString () {
  	if (this.isZero()) return "0";                         // Sonderfall Nullpolynom
  	var n = this.degree();                                 // Grad des Polynoms
  	var s = this.stringMonomial(n);                        // Zeichenkette f�r Leitmonom
  	for (var i=n-1; i>=0; i--) {                           // F�r alle Exponenten (absteigend) ...
  	  var m = this.stringMonomial(i);                      // Zeichenkette Monom
  	  if (m != "0") s += " + "+m;                          // Falls Monom ungleich 0, Zeichenkette erg�nzen
  	  }
  	return s;                                              // R�ckgabewert
    }
    
  // Grafikausgabe eines Monoms:
  // i ....... Index
  // (x,y) ... Position (Pixel)
  // R�ckgabewert: Neue x-Koordinate (Pixel)
    
  writeMonomial (i, x, y) {
  	var c = this.coeff[i];                                 // Koeffizient
  	var s = String(c);                                     // Koeffizient als Zeichenkette
  	if (i == 0 || c.isZero()) return writeString(s,x,y);   // Exponent oder Koeffizient gleich 0
  	if (c.isOne()) s = "";                                 // Falls Koeffizient gleich 1, weglassen
  	else x = writeString(s,x,y)+5;                         // Andernfalls ausgeben, Abstand zur Variable 
  	x = writeString(varPoly,x,y);                          // Variable ausgeben
  	if (i > 1) x = writeString(String(i),x,y-5);           // Falls sinnvoll, Exponent ausgeben
  	return x;                                              // Neue x-Koordinate als R�ckgabewert
    }
    
  // Grafikausgabe:
  // (x,y) ... Position (Pixel)
  // R�ckgabewert: Neue x-Koordinate (Pixel)
  
  write (x, y) {
    var c = this.coeff;                                    // Koeffizienten-Array
    if (c == undefined) return writeString("?",x,y);       // Sonderfall: Koeffizienten-Array nicht definiert
    if (this.isZero()) return writeString("0",x,y);        // Sonderfall: Nullpolynom
    var n = this.degree();                                 // Grad des Polynoms
    x = this.writeMonomial(n,x,y);                         // Leitmonom ausgeben, neue x-Koordinate
    for (var i=n-1; i>=0; i--) {                           // F�r alle Indizes bzw. Exponenten (absteigend) ...
      if (c[i].isZero()) continue;                         // Falls Koeffizient 0, weiter zum n�chsten Index
      x = writeString(" + ",x,y);                          // Pluszeichen und Leerzeichen ausgeben
      x = this.writeMonomial(i,x,y);                       // Monom ausgeben, neue x-Koordinate
      }
    return x;                                              // Neue x-Koordinate als R�ckgabewert
    }

  } // Ende der Klasse Polynomial
  
