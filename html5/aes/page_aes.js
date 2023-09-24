// Javascript für HTML5-Apps (Astronomie spanisch)
// 13.08.2014 - 11.02.2019

// Konstanten:

var language = "es";                                                 // Abkürzung für Sprache
var textAstronomy = "Astronom&iacute;a";                             // Bezeichnung für Astronomie
var textCollection = "Apps Astronom&iacute;a";                       // Bezeichnung für Programmsammlung
var textModification = "&Uacute;ltima modificaci&oacute;n";          // Bezeichnung für letzte Änderung
var textTranslation = "Traducci&oacute;n";                           // Bezeichnung für Übersetzung

// Array der Monatsnamen:

var month = ["enero", "febrero", "marzo", "abril", "mayo", "junio", 
             "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// Logo Astronomie-Apps:

function logo (filename) {
  var t = document.createElement("div");                             // Neues div-Element (übergeordnet)
  t.setAttribute("id","Index");                                      // Attribut id setzen (Layout-Festlegung durch CSS-Datei)
  var t1 = document.createElement("div");                            // Neues div-Element (oben)
  t1.setAttribute("id","Index1");                                    // Attribut id setzen (Layout-Festlegung durch CSS-Datei)
  t.appendChild(t1);                                                 // div-Element hinzufügen
  var t2 = document.createElement("div");                            // Neues div-Element (unten)
  t2.setAttribute("id","Index2");                                    // Attribut id setzen (Layout-Festlegung durch CSS-Datei)
  t.appendChild(t2);                                                 // div-Element hinzufügen
  var a1 = document.createElement("a");                              // Neuer Link (für Logo)
  a1.setAttribute("href","index.html");                              // Adresse für Inhaltsverzeichnis
  var i = document.createElement("img");                             // Neues Bild (Logo Astronomie)
  i.setAttribute("src","../a/javaastr.gif");                         // Pfadangabe (Bilddatei)
  i.setAttribute("alt",textAstronomy);                               // Alternativer Text
  a1.appendChild(i);                                                 // Bild zum Link hinzufügen
  t1.appendChild(a1);                                                // Link zum oberen div-Element hinzufügen
  var a2 = document.createElement("a");                              // Neuer Link (für Text)
  a2.setAttribute("href","index.html");                              // Adresse für Inhaltsverzeichnis
  a2.innerHTML = textCollection;                                     // Text für Link
  t2.appendChild(a2);                                                // Link zum unteren div-Element hinzufügen
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  body.appendChild(t);                                               // Übergeordnetes div-Element hinzufügen
  }
  
// Datum nach dem Muster "1 de enero 2000"
// d ... Tag (1 bis 31)
// m ... Monat (1 bis 12)
// y ... Jahr
  
function date (d, m, y) {
  return ""+d+" de "+month[m-1]+" "+y;
  }
  
// Daten am Ende der Seite (URL, Autor, Übersetzer, letzte Änderung, CC-Lizenz)

function data (filename, d1, m1, y1, d2, m2, y2, trl) {
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  var p = document.createElement("p");                               // Neuer Absatz
  p.setAttribute("class","Ende");                                    // Klasse (Layout-Festlegung durch CSS-Datei)
  var f0 = "https://www.walter-fendt.de/html5/a"+language;           // Verzeichnis in eigener Homepage  
  var f = filename+"_"+language+".htm";                              // Dateiname
  var s = "URL: "+f0+"/"+f+"<br>";                                   // URL (eigene Homepage)
  s += "Walter Fendt, "+date(d1,m1,y1)+"<br>";                       // Autorenname mit Datum, Zeilenumbruch
  if (trl) s += textTranslation+": "+trl+"<br>";                     // Gegebenenfalls Übersetzer
  s += textModification+": "+date(d2,m2,y2)+"<br>&nbsp;<br>";        // Datum der letzten Änderung
  var a = '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">';
  s += a+'<img alt="Creative Commons License" style="border-width:0" ';
  s += 'src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />';
  s += 'This work is licensed under a ';
  s += a+'Creative Commons Attribution-NonCommercial-ShareAlike ';
  s += '4.0 International License</a>.';
  p.innerHTML = s;                                                   // Inhalt des Absatzes
  body.appendChild(p);                                               // Absatz hinzufügen
  }
  
// Leere Zeile 
  
function emptyLine () {
  var e = document.createElement("div");                             // Neues Div-Element
  e.setAttribute("class","Abstand");                                 // Klasse (Layout-Festlegung durch CSS-Datei)
  e.innerHTML = "\u0020";                                            // Leerzeichen
  return e;                                                          // Rückgabewert
  }
  
// Seitenende insgesamt
// filename ..... Dateiname (ohne Erweiterungen)
// d1, m1, y1 ... Datum der Erstveröffentlichung
// d2, m2, y2 ... Datum der letzten Änderung

function endPage (filename, d1, m1, y1, d2, m2, y2, trl) {
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  body.appendChild(emptyLine());                                     // Leere Zeile hinzufügen
  var hr = document.createElement("hr");                             // Trennstrich
  hr.setAttribute("class","Trennlinie");                             // Klasse (Layout-Festlegung durch CSS-Datei)
  body.appendChild(hr);                                              // Trennstrich hinzufügen
  body.appendChild(emptyLine());                                     // Leere Zeile hinzufügen
  logo(filename);                                                    // Logo
  data(filename,d1,m1,y1,d2,m2,y2,trl);                              // Daten am Ende (URL, Autor, Übersetzer, letzte Änderung, Lizenz)
  }
  
  
  
