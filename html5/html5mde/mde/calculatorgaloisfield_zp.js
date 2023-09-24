// Klasse ZP (Element des Primk�rpers GF(p))
// 27.07.2022 - 28.07.2022

// Attribut: z (m�gliche Werte 0 bis p-1)

// Wichtig: Die Primzahl p muss definiert sein.

class ZP {

  // Konstruktor:
	
  constructor (z) {
  	z = z%p;                                                // Zwischenergebnis (kann negativ sein)
  	if (z < 0) z += p;                                      // Negative Zahl verhindern
  	this.z = z;                                             // Zahl (0 bis p-1) �bernehmen
    }
    
  // Addition:
    
  add (z2) {
  	return new ZP((this.z+z2.z)%p);                         // R�ckgabewert
    }
    
  // Inverses Element bez�glich Addition:
  
  neg () {
  	return new ZP((p-this.z)%p);                            // R�ckgabewert
    }
    
  // Subtraktion:
  
  sub (z2) {
  	return new ZP((this.z-z2.z)%p);                         // R�ckgabewert
    }
    
  // Multiplikation:
   
  mul (z2) {
  	return new ZP((this.z*z2.z)%p);                         // R�ckgabewert
    }
    
  // Inverses Element bez�glich Multiplikation:
  
  inverse () {
  	if (this.isZero()) return undefined;                   // Inverses von 0 nicht definiert
  	for (var i=1; i<p; i++) {                              // F�r alle Zahlen von 1 bis p-1 ...
  	  var e = new ZP(i);                                   // Umwandlung in Typ ZP
  	  if (this.mul(e).isOne()) return e;                   // R�ckgabewert, falls Produkt gleich 1
  	  }
  	return undefined;                                      // R�ckgabewert, falls kein Inverses gefunden
    }
    
  // Division:
  
  div (z2) {
  	if (z2.isZero()) return undefined;                      // Falls Division durch 0, Ergebnis nicht definiert
  	return this.mul(z2.inverse());                          // R�ckgabewert (Normalfall)
    }
    
  // �bereinstimmung mit dem Nullelement von GF(p):
    
  isZero () {
    return (this.z == 0);                                  // R�ckgabewert
    }
  
  // �bereinstimmung mit dem Einselement von GF(p):
    
  isOne () {
    return (this.z == 1);                                  // R�ckgabewert
    }
    
  // Gleichheit:
  
  equals (z2) {
  	return (this.z == z2.z);                               // R�ckgabewert 
    }
    
  // Umwandlung in eine Zeichenkette:
  
  toString () {
    return String(this.z);                                 // R�ckgabewert
    }

  }