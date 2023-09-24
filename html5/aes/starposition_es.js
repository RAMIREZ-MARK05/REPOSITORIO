// Position eines Gestirns, spanische Texte und Defaultwerte (Tomás Fdez de Sevilla)
// Letzte Änderung 20.11.2017

// Texte in HTML-Schreibweise:

var text01 = "Longitud Geogr.:";
var text03 = "Latitud Geogr.:";
var text05 = "Fecha:";
var text06 = "Hora:";
var text07 = "h (CET)";
var text08 = "Ascensi&oacute;n Recta:";
var text09 = "Declinaci&oacute;n:";
var text10 = "Reiniciar";
var text11 = ["Rotaci&oacute;n", "Pausa", "Reanudar"];
var text12 = "Resaltar:";

var author = "W. Fendt 1999,&nbsp; T. F. de Sevilla 2002";

// Symbole und Einheiten:

var dateSeparator = ".";
var timeSeparator = ":";
var decimalSeparator = ",";                                // Dezimaltrennzeichen (Komma/Punkt)
var degree = "&deg;";

// Texte in Unicode-Schreibweise:

var text02 = ["(longitud este)", "(longitud oeste)"];
var text04 = ["(latitud norte)", "(latitud sur)"];
var text13 = ["", "punto de observaci\u00F3n", "horizonte",
              "punto norte", "punto oeste", "punto sur", "punto este", 
              "cenit", "nadir", "meridiano", "c\u00EDrculo vertical", 
              "polo celeste norte", "polo celeste sur", "eje celeste", "ecuador celeste",
              "punto aries o vernal", "c\u00EDrculo horario", "hora sid\u00E9rea",
              "\u00E1ngulo horario", "estrella", "trayector\u00EDa de la estrella",
              "ascensi\u00F3n recta", "declinaci\u00F3n", "acimut", "altura", "tri\u00E1ngulo esf\u00E9rico NP-Ze-St"];
var text14 = "Hora:";
var text15 = "Hora sid\u00E9rea:";
var text16 = "Acimut:";
var text17 = "\u00C1ngulo horario:";
var text18 = "Altura:";

// Symbole und Einheiten:

var symbolObserver = "O";                                  // Beobachtungsort
var symbolNorth = "N";                                     // Nordpunkt
var symbolWest = "W";                                      // Westpunkt
var symbolSouth = "S";                                     // Südpunkt
var symbolEast = "E";                                      // Ostpunkt
var symbolZenith = "Ze";                                   // Zenit
var symbolNadir = "Na";                                    // Nadir
var symbolNorthPole = "NP";                                // Himmelsnordpol
var symbolSouthPole = "SP";                                // Himmelssüdpol
var symbolVernalEquinox = "V";                             // Frühlingspunkt
var symbolStar = "St";                                     // Stern
var symbolHour = "h";                                      // Stunde

// Defaultwerte:

var defaultLongitude = -4*DEG;                             // Geographische Länge (Madrid)
var defaultLatitude = 40*DEG;                              // Geographische Breite (Madrid)
var defaultDay = 1;                                        // Tag
var defaultMonth = 1;                                      // Monat
var defaultYear = 2000;                                    // Jahr
var defaultTimeZone = 1;                                   // Zeitzone relativ zu UT (h)
