// Javascript f�r HTML5-Apps (Astronomie spanisch)
// 13.08.2014 - 11.02.2019

// Konstanten:

var language = "es";                                                 // Abk�rzung f�r Sprache
var textAstronomy = "Astronom&iacute;a";                             // Bezeichnung f�r Astronomie
var textCollection = "Apps Astronom&iacute;a";                       // Bezeichnung f�r Programmsammlung
var textModification = "&Uacute;ltima modificaci&oacute;n";          // Bezeichnung f�r letzte �nderung
var textTranslation = "Traducci&oacute;n";                           // Bezeichnung f�r �bersetzung

// Array der Monatsnamen:

var month = ["enero", "febrero", "marzo", "abril", "mayo", "junio", 
             "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// Logo Astronomie-Apps:

function logo (filename) {
  var t = document.createElement("div");                             // Neues div-Element (�bergeordnet)
  t.setAttribute("id","Index");                                      // Attribut id setzen (Layout-Festlegung durch CSS-Datei)
  var t1 = document.createElement("div");                            // Neues div-Element (oben)
  t1.setAttribute("id","Index1");                                    // Attribut id setzen (Layout-Festlegung durch CSS-Datei)
  t.appendChild(t1);                                                 // div-Element hinzuf�gen
  var t2 = document.createElement("div");                            // Neues div-Element (unten)
  t2.setAttribute("id","Index2");                                    // Attribut id setzen (Layout-Festlegung durch CSS-Datei)
  t.appendChild(t2);                                                 // div-Element hinzuf�gen
  var a1 = document.createElement("a");                              // Neuer Link (f�r Logo)
  a1.setAttribute("href","index.html");                              // Adresse f�r Inhaltsverzeichnis
  var i = document.createElement("img");                             // Neues Bild (Logo Astronomie)
  i.setAttribute("src","../a/javaastr.gif");                         // Pfadangabe (Bilddatei)
  i.setAttribute("alt",textAstronomy);                               // Alternativer Text
  a1.appendChild(i);                                                 // Bild zum Link hinzuf�gen
  t1.appendChild(a1);                                                // Link zum oberen div-Element hinzuf�gen
  var a2 = document.createElement("a");                              // Neuer Link (f�r Text)
  a2.setAttribute("href","index.html");                              // Adresse f�r Inhaltsverzeichnis
  a2.innerHTML = textCollection;                                     // Text f�r Link
  t2.appendChild(a2);                                                // Link zum unteren div-Element hinzuf�gen
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  body.appendChild(t);                                               // �bergeordnetes div-Element hinzuf�gen
  }
  
// Datum nach dem Muster "1 de enero 2000"
// d ... Tag (1 bis 31)
// m ... Monat (1 bis 12)
// y ... Jahr
  
function date (d, m, y) {
  return ""+d+" de "+month[m-1]+" "+y;
  }
  
// Daten am Ende der Seite (URL, Autor, �bersetzer, letzte �nderung, CC-Lizenz)

function data (filename, d1, m1, y1, d2, m2, y2, trl) {
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  var p = document.createElement("p");                               // Neuer Absatz
  p.setAttribute("class","Ende");                                    // Klasse (Layout-Festlegung durch CSS-Datei)
  var f0 = "https://www.walter-fendt.de/html5/a"+language;           // Verzeichnis in eigener Homepage  
  var f = filename+"_"+language+".htm";                              // Dateiname
  var s = "URL: "+f0+"/"+f+"<br>";                                   // URL (eigene Homepage)
  s += "Walter Fendt, "+date(d1,m1,y1)+"<br>";                       // Autorenname mit Datum, Zeilenumbruch
  if (trl) s += textTranslation+": "+trl+"<br>";                     // Gegebenenfalls �bersetzer
  s += textModification+": "+date(d2,m2,y2)+"<br>&nbsp;<br>";        // Datum der letzten �nderung
  var a = '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">';
  s += a+'<img alt="Creative Commons License" style="border-width:0" ';
  s += 'src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />';
  s += 'This work is licensed under a ';
  s += a+'Creative Commons Attribution-NonCommercial-ShareAlike ';
  s += '4.0 International License</a>.';
  p.innerHTML = s;                                                   // Inhalt des Absatzes
  body.appendChild(p);                                               // Absatz hinzuf�gen
  }
  
// Leere Zeile 
  
function emptyLine () {
  var e = document.createElement("div");                             // Neues Div-Element
  e.setAttribute("class","Abstand");                                 // Klasse (Layout-Festlegung durch CSS-Datei)
  e.innerHTML = "\u0020";                                            // Leerzeichen
  return e;                                                          // R�ckgabewert
  }
  
// Seitenende insgesamt
// filename ..... Dateiname (ohne Erweiterungen)
// d1, m1, y1 ... Datum der Erstver�ffentlichung
// d2, m2, y2 ... Datum der letzten �nderung

function endPage (filename, d1, m1, y1, d2, m2, y2, trl) {
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  body.appendChild(emptyLine());                                     // Leere Zeile hinzuf�gen
  var hr = document.createElement("hr");                             // Trennstrich
  hr.setAttribute("class","Trennlinie");                             // Klasse (Layout-Festlegung durch CSS-Datei)
  body.appendChild(hr);                                              // Trennstrich hinzuf�gen
  body.appendChild(emptyLine());                                     // Leere Zeile hinzuf�gen
  logo(filename);                                                    // Logo
  data(filename,d1,m1,y1,d2,m2,y2,trl);                              // Daten am Ende (URL, Autor, �bersetzer, letzte �nderung, Lizenz)
  }
  
  
  
