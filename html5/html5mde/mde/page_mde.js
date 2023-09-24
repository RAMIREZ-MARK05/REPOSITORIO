// Javascript f�r HTML5-Apps (Mathematik deutsch)
// 13.08.2014 - 11.02.2019

// Konstanten:

var language = "de";                                                 // Abk�rzung f�r Sprache
var textMath = "Mathematik";                                         // Bezeichnung f�r Mathematik
var textCollection = "Mathematik-Apps";                              // Bezeichnung f�r Programmsammlung
var textModification = "Letzte &Auml;nderung";                       // Bezeichnung f�r letzte �nderung

// Array der Monatsnamen:

var month = ["Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", 
             "Juli", "August", "September", "Oktober", "November", "Dezember"];

// Logo Mathematik-Apps:

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
  var i = document.createElement("img");                             // Neues Bild (Logo Mathematik)
  i.setAttribute("src","../m/javamath.gif");                         // Pfadangabe (Bilddatei)
  i.setAttribute("alt",textMath);                                    // Alternativer Text
  a1.appendChild(i);                                                 // Bild zum Link hinzuf�gen
  t1.appendChild(a1);                                                // Link zum oberen div-Element hinzuf�gen
  var a2 = document.createElement("a");                              // Neuer Link (f�r Text)
  a2.setAttribute("href","index.html");                              // Adresse f�r Inhaltsverzeichnis
  a2.innerHTML = textCollection;                                     // Text f�r Link
  t2.appendChild(a2);                                                // Link zum unteren div-Element hinzuf�gen
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  body.appendChild(t);                                               // �bergeordnetes div-Element hinzuf�gen
  }
  
// Datum nach dem Muster "1. Januar 2000"
// d ... Tag (1 bis 31)
// m ... Monat (1 bis 12)
// y ... Jahr
  
function date (d, m, y) {
  return ""+d+". "+month[m-1]+" "+y;
  }
  
// Daten am Ende der Seite (URL, Autor, letzte �nderung, Lizenz)

function data (filename, d1, m1, y1, d2, m2, y2, zum) {
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  var p = document.createElement("p");                               // Neuer Absatz
  p.setAttribute("class","Ende");                                    // Klasse (Layout-Festlegung durch CSS-Datei)  
  var f1 = "https://www.walter-fendt.de/html5/m"+language;           // Verzeichnis in eigener Homepage
  var f2 = "https://www.zum.de/ma/fendt/m"+language;                 // Verzeichnis bei ZUM  
  var f = filename+"_"+language+".htm";                              // Dateiname
  var s = "URL: "+f1+"/"+f;                                          // URL Homepage
  if (zum == undefined || zum == true)                               // Falls ZUM-Ver�ffentlichung ...                               
    s += ", "+f2+"/"+f;                                              // URL ZUM
  s += "<br>";                                                       // Zeilenumbruch
  s += "Walter Fendt, "+date(d1,m1,y1)+"<br>";                       // Autorenname mit Datum, Zeilenumbruch
  s += textModification+": "+date(d2,m2,y2)+"<br>&nbsp;<br>";        // Datum der letzten �nderung
  var a = '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/de/">';
  s += a+'<img alt="Creative Commons Lizenzvertrag" style="border-width:0" ';
  s += 'src="https://i.creativecommons.org/l/by-nc-sa/3.0/de/88x31.png" /></a><br />';
  s += 'Dieses Werk ist lizensiert unter einer ';
  s += a+'Creative Commons Namensnennung - Nicht-kommerziell - ';
  s += 'Weitergabe unter gleichen Bedingungen 3.0 Deutschland Lizenz</a>.';
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
// zum .......... ZUM-Ver�ffentlichung (true oder false)

function endPage (filename, d1, m1, y1, d2, m2, y2, zum) {
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  body.appendChild(emptyLine());                                     // Leere Zeile hinzuf�gen
  var hr = document.createElement("hr");                             // Trennstrich
  hr.setAttribute("class","Trennlinie");                             // Klasse (Layout-Festlegung durch CSS-Datei)
  body.appendChild(hr);                                              // Trennstrich hinzuf�gen
  body.appendChild(emptyLine());                                     // Leere Zeile hinzuf�gen
  logo(filename);                                                    // Logo
  data(filename,d1,m1,y1,d2,m2,y2,zum);                              // Daten am Ende (URL, Copyright, letzte �nderung)
  }
  
  
  
