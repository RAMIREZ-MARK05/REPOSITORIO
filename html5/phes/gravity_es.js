// Gravitation, spanische Texte (Wikipedia, DeepL)
// Letzte Änderung 01.01.2021

// Texte in HTML-Schreibweise:

var text01 = "Restablecer";                    
var text02 = ["Iniciar", "Pausa", "Reanudar"];
var text03 = "Animaci&oacute;n lenta";
var text04 = "Distancia:";
var text05 = "Masa 1:";
var text06 = "Velocidad 1:";
var text07 = "Masa 2:";
var text08 = "Velocidad 2:";

var text09 = "&Oacute;rbita circular";
var text10 = "&Oacute;rbita parab&oacute;lica";

var author = "W. Fendt 2020";                              // Autor (und Übersetzer)

// Texte in Unicode-Schreibweise:

var textSelect = ["",
              "Datos de la \u00F3rbita",
              "Posici\u00F3n",
              "Distancia",
              "Velocidad",
              "Aceleraci\u00f3n",
              "Fuerza",
              "Energ\u00EDa",
              "Momento angular",
              "Per\u00EDodo orbital"];
              
var text11 = "Tipo de \u00F3rbita:";
var text12 = ["recta",
              "elipse", 
              "circunferencia (elipse)", 
              "elipse", 
              "par\u00E1bola", 
              "hip\u00E9rbola"];
var text13 = ["Semiejes mayores:",
              "Radios:",
              "Semiejes mayores:",
              "Lados rectos:",
              "Semiejes transversales:"];
var text14 = "Excentricidad:";

var text21 = "\u00C1ngulo de posici\u00F3n:";
var text22 = "Coordenadas:";

var text31 = "Distancia:";

var text41 = "M\u00F3dulos de la velocidad:";
var text42 = "Componentes de la velocidad:";

var text51 = "M\u00F3dulos de la aceleraci\u00F3n:";
var text52 = "Componentes de la aceleraci\u00F3n:";

var text61 = "M\u00F3dulos de la fuerza:";
var text62 = "Componentes de la fuerza:";

var text71 = "Energ\u00EDa total:";
var text72 = "Energ\u00EDa potencial:";
var text73 = "Energ\u00EDa cin\u00E9tica:";

var text81 = "Momento angular total:";
var text82 = "Momentos angulares individuales:";

var text91 = "Per\u00EDodo orbital:";

var text101 = "Tiempo:";
var text102 = "Valor m\u00EDnimo:";
var text103 = "Valor m\u00E1ximo:";
var text104 = "Valores m\u00EDnimos:";
var text105 = "Valores m\u00E1ximos:";

var undef = "no definido";
var inf = "infinito";
var body1 = "Cuerpo 1";
var body2 = "Cuerpo 2";

// Symbole und Einheiten (Unicode-Schreibweise):

var decimalSeparator = ",";                                // Dezimaltrennzeichen (Komma/Punkt)
var power10 = "\u00B7 10";                                 // Mal 10 hoch
var kilogram = "kg";
var second = "s";
var minute = "min";
var hour = "h";
var day = "d";
var year = "a";
var meter = "m";
var meterPerSecond = "m/s";
var meterPerSecond2 = "m/s\u00B2";
var newton = "N";
var joule = "J";
var kilogramMeter2PerSecond = "kg m\u00B2 / s";
var degree = "\u00B0";

var symbolAE1 = "a_E1";                                    // Große Halbachse (Ellipse) für Körper 1
var symbolAE2 = "a_E2";                                    // Große Halbachse (Ellipse) für Körper 2
var symbolAH1 = "a_H1";                                    // Reelle Halbachse (Hyperbel) für Körper 1
var symbolAH2 = "a_H2";                                    // Reelle Halbachse (Hyperbel) für Körper 2
var symbolR1 = "r_1";                                      // Radius (Kreis) für Körper 1
var symbolR2 = "r_2";                                      // Radius (Kreis) für Körper 2
var symbolHP1 = "p_1";                                     // Halbparameter (Parabel) für Körper 1
var symbolHP2 = "p_2";                                     // Halbparameter (Parabel) für Körper 2
var symbolEpsilon = "\u03B5";                              // Numerische Exzentrizität
var symbolTime = "t";                                      // Aktuelle Zeit

var symbolPhi1 = "\u03C6_1";                               // Positionswinkel für Körper 1
var symbolPhi2 = "\u03C6_2";                               // Positionswinkel für Körper 2

var symbolX1 = "x_1";                                      // x-Koordinate von Körper 1
var symbolY1 = "y_1";                                      // y-Koordinate von Körper 1
var symbolX2 = "x_2";                                      // x-Koordinate von Körper 2
var symbolY2 = "y_2";                                      // y-Koordinate von Körper 2

var symbolD = "d";                                         // Abstand
var symbolDMin = "d_min";                                  // Minimaler Abstand
var symbolDMax = "d_max";                                  // Maximaler Abstand

var symbolV1 = "v_1";                                      // Geschwindigkeit von Körper 1
var symbolV2 = "v_2";                                      // Geschwindigkeit von Körper 2
var symbolV1Min = "v_1 min";                               // Minimale Geschwindigkeit von Körper 1
var symbolV2Min = "v_2 min";                               // Minimale Geschwindigkeit von Körper 2
var symbolV1Max = "v_1 max";                               // Maximale Geschwindigkeit von Körper 1
var symbolV2Max = "v_2 max";                               // Maximale Geschwindigkeit von Körper 2
var symbolV1x = "v_1x";                                    // Geschwindigkeit von Körper 1 in x-Richtung
var symbolV1y = "v_1y";                                    // Geschwindigkeit von Körper 1 in y-Richtung
var symbolV2x = "v_2x";                                    // Geschwindigkeit von Körper 2 in x-Richtung
var symbolV2y = "v_2y";                                    // Geschwindigkeit von Körper 2 in y-Richtung

var symbolA1 = "a_1";                                      // Beschleunigung von Körper 1
var symbolA2 = "a_2";                                      // Beschleunigung von Körper 2
var symbolA1Min = "a_1 min";                               // Minimale Beschleunigung von Körper 1
var symbolA2Min = "a_2 min";                               // Minimale Beschleunigung von Körper 2 
var symbolA1Max = "a_1 max";                               // Maximale Beschleunigung von Körper 1
var symbolA2Max = "a_2 max";                               // Maximale Beschleunigung von Körper 1 
var symbolA1Tang = "a_1 tang";                             // Tangentiale Beschleunigung von Körper 1
var symbolA1Rad = "a_1 rad";                               // Radiale Beschleunigung von Körper 1
var symbolA2Tang = "a_2 tang";                             // Tangentiale Beschleunigung von Körper 2
var symbolA2Rad = "a_2 rad";                               // Radiale Beschleunigung von Körper 2

var symbolF1 = "F_1";                                      // Kraft auf Körper 1
var symbolF2 = "F_2";                                      // Kraft auf Körper 2
var symbolFMin = "F_min";                                  // Minimale Kraft
var symbolFMax = "F_max";                                  // Maximale Kraft
var symbolF1Tang = "F_1 tang";                             // Tangentiale Komponente der Kraft auf Körper 1
var symbolF1Rad = "F_1 rad";                               // Radiale Komponente der Kraft auf Körper 1
var symbolF2Tang = "F_2 tang";                             // Tangentiale Komponente der Kraft auf Körper 2
var symbolF2Rad = "F_2 rad";                               // Radiale Komponente der Kraft auf Körper 2

var symbolEnergy = "E";                                    // Gesamtenergie
var symbolEnergyPot = "E_pot";                             // Potentielle Energie
var symbolEnergy1Kin = "E_1 kin";                          // Kinetische Energie von Körper 1
var symbolEnergy2Kin = "E_2 kin";                          // Kinetische Energie von Körper 1

var symbolAngMom = "L";                                    // Gesamtdrehimpuls
var symbolAngMom1 = "L_1";                                 // Drehimpuls von Körper 1
var symbolAngMom2 = "L_2";                                 // Drehimpuls von Körper 2

var symbolPeriod = "T";                                    // Umlaufdauer






