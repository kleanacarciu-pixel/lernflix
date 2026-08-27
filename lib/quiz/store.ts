// ============================================================================
// QUIZ-STORE (nur Server) — liefert die geprüften Aufgaben aus.
// Keine Live-KI, kein Supabase, keine Umgebungsvariablen nötig.
//
// Prototyp-Phase: Das Quiz stellt interaktive Aufgaben (Anton-Stil) — Eintippen,
// Lückentext, Zuordnen, Sortieren, Multiple Choice. Zuerst ist EIN Thema fertig
// (Bruchrechnen, Gymnasium Klasse 6); alle anderen erscheinen "Bald verfügbar".
// ============================================================================

import { themaKey } from "@/lib/quiz/catalog";
import type { Fach, SchulartId } from "@/lib/quiz/catalog";
import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

import bruchrechnenGym6 from "@/lib/quiz/interaktiv/bruchrechnen-gym6";
import dezimalbruecheGym6 from "@/lib/quiz/interaktiv/dezimalbrueche-gym6";
import prozentGym6 from "@/lib/quiz/interaktiv/prozent-gym6";
import teilbarkeitGym6 from "@/lib/quiz/interaktiv/teilbarkeit-gym6";
import ganzeZahlenGym6 from "@/lib/quiz/interaktiv/ganze-zahlen-gym6";
import groessenGym6 from "@/lib/quiz/interaktiv/groessen-gym6";
import flaecheGym6 from "@/lib/quiz/interaktiv/flaeche-gym6";
import volumenGym6 from "@/lib/quiz/interaktiv/volumen-gym6";
import winkelGym6 from "@/lib/quiz/interaktiv/winkel-gym6";
import symmetrieGym6 from "@/lib/quiz/interaktiv/symmetrie-gym6";
import datenGym6 from "@/lib/quiz/interaktiv/daten-gym6";

import natZahlenGym5 from "@/lib/quiz/interaktiv/nat-zahlen-gym5";
import rechnenGym5 from "@/lib/quiz/interaktiv/rechnen-gym5";
import malnehmenGym5 from "@/lib/quiz/interaktiv/malnehmen-gym5";
import teilbarkeitGym5 from "@/lib/quiz/interaktiv/teilbarkeit-gym5";
import groessenGym5 from "@/lib/quiz/interaktiv/groessen-gym5";
import flaecheGym5 from "@/lib/quiz/interaktiv/flaeche-gym5";
import geometrieGym5 from "@/lib/quiz/interaktiv/geometrie-gym5";
import symmetrieGym5 from "@/lib/quiz/interaktiv/symmetrie-gym5";

import prozentZinsGym7 from "@/lib/quiz/interaktiv/prozent-zins-gym7";
import dreisatzGym7 from "@/lib/quiz/interaktiv/dreisatz-gym7";
import termeGym7 from "@/lib/quiz/interaktiv/terme-gym7";
import gleichungenGym7 from "@/lib/quiz/interaktiv/gleichungen-gym7";
import winkelDreieckeGym7 from "@/lib/quiz/interaktiv/winkel-dreiecke-gym7";
import wahrscheinlichkeitGym7 from "@/lib/quiz/interaktiv/wahrscheinlichkeit-gym7";

import lineareFunktionenGym8 from "@/lib/quiz/interaktiv/lineare-funktionen-gym8";
import lgsGym8 from "@/lib/quiz/interaktiv/lgs-gym8";
import binomeGym8 from "@/lib/quiz/interaktiv/binome-gym8";
import wurzelnGym8 from "@/lib/quiz/interaktiv/wurzeln-gym8";
import kreisGym8 from "@/lib/quiz/interaktiv/kreis-gym8";
import wahrscheinlichkeit2Gym8 from "@/lib/quiz/interaktiv/wahrscheinlichkeit2-gym8";

import pythagorasGym9 from "@/lib/quiz/interaktiv/pythagoras-gym9";
import quadrFunktionenGym9 from "@/lib/quiz/interaktiv/quadr-funktionen-gym9";
import pqFormelGym9 from "@/lib/quiz/interaktiv/pq-formel-gym9";
import strahlensatzGym9 from "@/lib/quiz/interaktiv/strahlensatz-gym9";
import potenzenGym9 from "@/lib/quiz/interaktiv/potenzen-gym9";
import trigonometrieGym9 from "@/lib/quiz/interaktiv/trigonometrie-gym9";

import exponentialGym10 from "@/lib/quiz/interaktiv/exponential-gym10";
import logarithmenGym10 from "@/lib/quiz/interaktiv/logarithmen-gym10";
import wachstumGym10 from "@/lib/quiz/interaktiv/wachstum-gym10";
import koerperGym10 from "@/lib/quiz/interaktiv/koerper-gym10";
import trigSeitenGym10 from "@/lib/quiz/interaktiv/trig-seiten-gym10";
import stochastikGym10 from "@/lib/quiz/interaktiv/stochastik-gym10";

import ableitungGym11 from "@/lib/quiz/interaktiv/ableitung-gym11";
import ableitungsregelnGym11 from "@/lib/quiz/interaktiv/ableitungsregeln-gym11";
import kurvendiskussionGym11 from "@/lib/quiz/interaktiv/kurvendiskussion-gym11";
import integralGym11 from "@/lib/quiz/interaktiv/integral-gym11";
import vektorenGym11 from "@/lib/quiz/interaktiv/vektoren-gym11";

import integral2Gym12 from "@/lib/quiz/interaktiv/integral2-gym12";
import elnGym12 from "@/lib/quiz/interaktiv/eln-gym12";
import raumGym12 from "@/lib/quiz/interaktiv/raum-gym12";
import binomialGym12 from "@/lib/quiz/interaktiv/binomial-gym12";

import analysisGym13 from "@/lib/quiz/interaktiv/analysis-gym13";
import geometrieGym13 from "@/lib/quiz/interaktiv/geometrie-gym13";
import stochastikGym13 from "@/lib/quiz/interaktiv/stochastik-gym13";

import natZahlenRs5 from "@/lib/quiz/interaktiv/nat-zahlen-rs5";
import rechnenRs5 from "@/lib/quiz/interaktiv/rechnen-rs5";
import groessenRs5 from "@/lib/quiz/interaktiv/groessen-rs5";
import flaecheRs5 from "@/lib/quiz/interaktiv/flaeche-rs5";
import teilbarkeitRs5 from "@/lib/quiz/interaktiv/teilbarkeit-rs5";
import bruchrechnenRs6 from "@/lib/quiz/interaktiv/bruchrechnen-rs6";
import dezimalRs6 from "@/lib/quiz/interaktiv/dezimal-rs6";
import prozentRs6 from "@/lib/quiz/interaktiv/prozent-rs6";
import ganzeZahlenRs6 from "@/lib/quiz/interaktiv/ganze-zahlen-rs6";
import flaechenWinkelRs6 from "@/lib/quiz/interaktiv/flaechen-winkel-rs6";
import prozentZinsRs7 from "@/lib/quiz/interaktiv/prozent-zins-rs7";
import dreisatzRs7 from "@/lib/quiz/interaktiv/dreisatz-rs7";
import termeRs7 from "@/lib/quiz/interaktiv/terme-rs7";
import dreieckeRs7 from "@/lib/quiz/interaktiv/dreiecke-rs7";
import wahrscheinlichkeitRs7 from "@/lib/quiz/interaktiv/wahrscheinlichkeit-rs7";
import lineareFunktionenRs8 from "@/lib/quiz/interaktiv/lineare-funktionen-rs8";
import gleichungssystemeRs8 from "@/lib/quiz/interaktiv/gleichungssysteme-rs8";
import potenzenWurzelnRs8 from "@/lib/quiz/interaktiv/potenzen-wurzeln-rs8";
import koerperRs8 from "@/lib/quiz/interaktiv/koerper-rs8";
import statistikRs8 from "@/lib/quiz/interaktiv/statistik-rs8";
import pythagorasRs9 from "@/lib/quiz/interaktiv/pythagoras-rs9";
import trigonometrieRs9 from "@/lib/quiz/interaktiv/trigonometrie-rs9";
import kreisRs9 from "@/lib/quiz/interaktiv/kreis-rs9";
import quadrFunktionenRs9 from "@/lib/quiz/interaktiv/quadr-funktionen-rs9";
import prismaZylinderRs9 from "@/lib/quiz/interaktiv/prisma-zylinder-rs9";
import quadrGleichungenRs10 from "@/lib/quiz/interaktiv/quadr-gleichungen-rs10";
import expWachstumRs10 from "@/lib/quiz/interaktiv/exp-wachstum-rs10";
import trigonometrie2Rs10 from "@/lib/quiz/interaktiv/trigonometrie2-rs10";
import kugelKegelRs10 from "@/lib/quiz/interaktiv/kugel-kegel-rs10";
import stochastikRs10 from "@/lib/quiz/interaktiv/stochastik-rs10";
import natZahlenMs5 from "@/lib/quiz/interaktiv/nat-zahlen-ms5";
import grundrechenartenMs5 from "@/lib/quiz/interaktiv/grundrechenarten-ms5";
import groessenMs5 from "@/lib/quiz/interaktiv/groessen-ms5";
import flaecheMs5 from "@/lib/quiz/interaktiv/flaeche-ms5";
import teilbarkeitMs5 from "@/lib/quiz/interaktiv/teilbarkeit-ms5";
import bruchrechnenMs6 from "@/lib/quiz/interaktiv/bruchrechnen-ms6";
import dezimalzahlenMs6 from "@/lib/quiz/interaktiv/dezimalzahlen-ms6";
import prozentMs6 from "@/lib/quiz/interaktiv/prozent-ms6";
import massstabMs6 from "@/lib/quiz/interaktiv/massstab-ms6";
import flaechenKoerperMs6 from "@/lib/quiz/interaktiv/flaechen-koerper-ms6";
import prozentrechnungMs7 from "@/lib/quiz/interaktiv/prozentrechnung-ms7";
import dreisatzMs7 from "@/lib/quiz/interaktiv/dreisatz-ms7";
import negativeZahlenMs7 from "@/lib/quiz/interaktiv/negative-zahlen-ms7";
import termeGleichungenMs7 from "@/lib/quiz/interaktiv/terme-gleichungen-ms7";
import flaechenMs7 from "@/lib/quiz/interaktiv/flaechen-ms7";
import zinsrechnungMs8 from "@/lib/quiz/interaktiv/zinsrechnung-ms8";
import zuordnungenMs8 from "@/lib/quiz/interaktiv/zuordnungen-ms8";
import gleichungenMs8 from "@/lib/quiz/interaktiv/gleichungen-ms8";
import volumenMs8 from "@/lib/quiz/interaktiv/volumen-ms8";
import wahrscheinlichkeitMs8 from "@/lib/quiz/interaktiv/wahrscheinlichkeit-ms8";
import pythagorasMs9 from "@/lib/quiz/interaktiv/pythagoras-ms9";
import kreisMs9 from "@/lib/quiz/interaktiv/kreis-ms9";
import zinsen2Ms9 from "@/lib/quiz/interaktiv/zinsen2-ms9";
import oberflaecheVolumenMs9 from "@/lib/quiz/interaktiv/oberflaeche-volumen-ms9";
import statistikMs9 from "@/lib/quiz/interaktiv/statistik-ms9";
import lineareFunktionenMs10 from "@/lib/quiz/interaktiv/lineare-funktionen-ms10";
import quadratischMs10 from "@/lib/quiz/interaktiv/quadratisch-ms10";
import trigonometrieMs10 from "@/lib/quiz/interaktiv/trigonometrie-ms10";
import prozentZinsMs10 from "@/lib/quiz/interaktiv/prozent-zins-ms10";
import wahrscheinlichkeitMs10 from "@/lib/quiz/interaktiv/wahrscheinlichkeit-ms10";
import natZahlenHs5 from "@/lib/quiz/interaktiv/nat-zahlen-hs5";
import grundrechenartenHs5 from "@/lib/quiz/interaktiv/grundrechenarten-hs5";
import groessenHs5 from "@/lib/quiz/interaktiv/groessen-hs5";
import flaecheHs5 from "@/lib/quiz/interaktiv/flaeche-hs5";
import bruchrechnenHs6 from "@/lib/quiz/interaktiv/bruchrechnen-hs6";
import dezimalzahlenHs6 from "@/lib/quiz/interaktiv/dezimalzahlen-hs6";
import prozentHs6 from "@/lib/quiz/interaktiv/prozent-hs6";
import massstabHs6 from "@/lib/quiz/interaktiv/massstab-hs6";
import prozentrechnungHs7 from "@/lib/quiz/interaktiv/prozentrechnung-hs7";
import dreisatzHs7 from "@/lib/quiz/interaktiv/dreisatz-hs7";
import negativeZahlenHs7 from "@/lib/quiz/interaktiv/negative-zahlen-hs7";
import flaechenHs7 from "@/lib/quiz/interaktiv/flaechen-hs7";
import zinsrechnungHs8 from "@/lib/quiz/interaktiv/zinsrechnung-hs8";
import gleichungenHs8 from "@/lib/quiz/interaktiv/gleichungen-hs8";
import volumenHs8 from "@/lib/quiz/interaktiv/volumen-hs8";
import zuordnungenHs8 from "@/lib/quiz/interaktiv/zuordnungen-hs8";
import pythagorasHs9 from "@/lib/quiz/interaktiv/pythagoras-hs9";
import kreisHs9 from "@/lib/quiz/interaktiv/kreis-hs9";
import alltagHs9 from "@/lib/quiz/interaktiv/alltag-hs9";
import datenHs9 from "@/lib/quiz/interaktiv/daten-hs9";
import zahlen20Gs1 from "@/lib/quiz/interaktiv/zahlen20-gs1";
import plusminus20Gs1 from "@/lib/quiz/interaktiv/plusminus20-gs1";
import zerlegenGs1 from "@/lib/quiz/interaktiv/zerlegen-gs1";
import laengenGs1 from "@/lib/quiz/interaktiv/laengen-gs1";
import geldGs1 from "@/lib/quiz/interaktiv/geld-gs1";
import formenGs1 from "@/lib/quiz/interaktiv/formen-gs1";
import zahlen100Gs2 from "@/lib/quiz/interaktiv/zahlen100-gs2";
import plusminus100Gs2 from "@/lib/quiz/interaktiv/plusminus100-gs2";
import einmaleinsGs2 from "@/lib/quiz/interaktiv/einmaleins-gs2";
import uhrzeitGs2 from "@/lib/quiz/interaktiv/uhrzeit-gs2";
import laengenGs2 from "@/lib/quiz/interaktiv/laengen-gs2";
import geldrechnenGs2 from "@/lib/quiz/interaktiv/geldrechnen-gs2";
import zahlen1000Gs3 from "@/lib/quiz/interaktiv/zahlen1000-gs3";
import schriftlichGs3 from "@/lib/quiz/interaktiv/schriftlich-gs3";
import malteilenGs3 from "@/lib/quiz/interaktiv/malteilen-gs3";
import laengenGewichteGs3 from "@/lib/quiz/interaktiv/laengen-gewichte-gs3";
import zeitspannenGs3 from "@/lib/quiz/interaktiv/zeitspannen-gs3";
import geometrieGs3 from "@/lib/quiz/interaktiv/geometrie-gs3";
import millionGs4 from "@/lib/quiz/interaktiv/million-gs4";
import multiplizierenGs4 from "@/lib/quiz/interaktiv/multiplizieren-gs4";
import dividierenGs4 from "@/lib/quiz/interaktiv/dividieren-gs4";
import umrechnenGs4 from "@/lib/quiz/interaktiv/umrechnen-gs4";
import sachaufgabenGs4 from "@/lib/quiz/interaktiv/sachaufgaben-gs4";
import flaecheGs4 from "@/lib/quiz/interaktiv/flaeche-gs4";

// Interaktive Aufgabensätze. Schlüssel = fach|schulart|klasse|thema(ohne Emoji).
// Gymnasium Klasse 6 (alle Themen) und Klasse 5 (alle Themen) sind fertig.
const INTERAKTIV: Record<string, Aufgabe[]> = {
  [themaKey("mathe", "gymnasium", 5, "Natürliche Zahlen & Stellenwert")]: natZahlenGym5,
  [themaKey("mathe", "gymnasium", 5, "Rechnen mit natürlichen Zahlen")]: rechnenGym5,
  [themaKey("mathe", "gymnasium", 5, "Multiplizieren & Dividieren")]: malnehmenGym5,
  [themaKey("mathe", "gymnasium", 5, "Teilbarkeit & Primzahlen")]: teilbarkeitGym5,
  [themaKey("mathe", "gymnasium", 5, "Größen & Einheiten")]: groessenGym5,
  [themaKey("mathe", "gymnasium", 5, "Umfang & Flächeninhalt")]: flaecheGym5,
  [themaKey("mathe", "gymnasium", 5, "Geometrie & Koordinaten")]: geometrieGym5,
  [themaKey("mathe", "gymnasium", 5, "Achsensymmetrie")]: symmetrieGym5,

  [themaKey("mathe", "gymnasium", 7, "Prozent- & Zinsrechnung")]: prozentZinsGym7,
  [themaKey("mathe", "gymnasium", 7, "Proportionalität & Dreisatz")]: dreisatzGym7,
  [themaKey("mathe", "gymnasium", 7, "Terme & Termumformung")]: termeGym7,
  [themaKey("mathe", "gymnasium", 7, "Lineare Gleichungen")]: gleichungenGym7,
  [themaKey("mathe", "gymnasium", 7, "Winkel & Dreiecke")]: winkelDreieckeGym7,
  [themaKey("mathe", "gymnasium", 7, "Wahrscheinlichkeit")]: wahrscheinlichkeitGym7,

  [themaKey("mathe", "gymnasium", 8, "Lineare Funktionen")]: lineareFunktionenGym8,
  [themaKey("mathe", "gymnasium", 8, "Lineare Gleichungssysteme")]: lgsGym8,
  [themaKey("mathe", "gymnasium", 8, "Binomische Formeln")]: binomeGym8,
  [themaKey("mathe", "gymnasium", 8, "Wurzeln & reelle Zahlen")]: wurzelnGym8,
  [themaKey("mathe", "gymnasium", 8, "Kreis: Umfang & Fläche")]: kreisGym8,
  [themaKey("mathe", "gymnasium", 8, "Wahrscheinlichkeit (mehrstufig)")]: wahrscheinlichkeit2Gym8,

  [themaKey("mathe", "gymnasium", 9, "Satz des Pythagoras")]: pythagorasGym9,
  [themaKey("mathe", "gymnasium", 9, "Quadratische Funktionen")]: quadrFunktionenGym9,
  [themaKey("mathe", "gymnasium", 9, "pq-Formel & quadratische Gleichungen")]: pqFormelGym9,
  [themaKey("mathe", "gymnasium", 9, "Strahlensätze & Ähnlichkeit")]: strahlensatzGym9,
  [themaKey("mathe", "gymnasium", 9, "Potenzen & Potenzgesetze")]: potenzenGym9,
  [themaKey("mathe", "gymnasium", 9, "Trigonometrie (sin, cos, tan)")]: trigonometrieGym9,

  [themaKey("mathe", "gymnasium", 10, "Exponentialfunktionen")]: exponentialGym10,
  [themaKey("mathe", "gymnasium", 10, "Logarithmen")]: logarithmenGym10,
  [themaKey("mathe", "gymnasium", 10, "Wachstum & Zerfall")]: wachstumGym10,
  [themaKey("mathe", "gymnasium", 10, "Körper: Pyramide, Kegel, Kugel")]: koerperGym10,
  [themaKey("mathe", "gymnasium", 10, "Trigonometrie: Seiten & Winkel")]: trigSeitenGym10,
  [themaKey("mathe", "gymnasium", 10, "Stochastik")]: stochastikGym10,

  [themaKey("mathe", "gymnasium", 11, "Ableitung — Grundlagen")]: ableitungGym11,
  [themaKey("mathe", "gymnasium", 11, "Ableitungsregeln (Produkt- & Kettenregel)")]: ableitungsregelnGym11,
  [themaKey("mathe", "gymnasium", 11, "Kurvendiskussion")]: kurvendiskussionGym11,
  [themaKey("mathe", "gymnasium", 11, "Integralrechnung — Einstieg")]: integralGym11,
  [themaKey("mathe", "gymnasium", 11, "Vektoren — Grundlagen")]: vektorenGym11,

  [themaKey("mathe", "gymnasium", 12, "Integralrechnung vertieft")]: integral2Gym12,
  [themaKey("mathe", "gymnasium", 12, "e- und ln-Funktion")]: elnGym12,
  [themaKey("mathe", "gymnasium", 12, "Geraden & Ebenen im Raum")]: raumGym12,
  [themaKey("mathe", "gymnasium", 12, "Stochastik (Binomialverteilung)")]: binomialGym12,

  [themaKey("mathe", "gymnasium", 13, "Analysis (Abitur)")]: analysisGym13,
  [themaKey("mathe", "gymnasium", 13, "Analytische Geometrie (Abitur)")]: geometrieGym13,
  [themaKey("mathe", "gymnasium", 13, "Stochastik (Abitur)")]: stochastikGym13,

  [themaKey("mathe", "realschule", 5, "Natürliche Zahlen & Stellenwert")]: natZahlenRs5,
  [themaKey("mathe", "realschule", 5, "Rechnen mit natürlichen Zahlen")]: rechnenRs5,
  [themaKey("mathe", "realschule", 5, "Größen & Einheiten")]: groessenRs5,
  [themaKey("mathe", "realschule", 5, "Umfang & Flächeninhalt (Rechteck)")]: flaecheRs5,
  [themaKey("mathe", "realschule", 5, "Teilbarkeit & Primzahlen")]: teilbarkeitRs5,

  [themaKey("mathe", "realschule", 6, "Bruchrechnen")]: bruchrechnenRs6,
  [themaKey("mathe", "realschule", 6, "Dezimalbrüche")]: dezimalRs6,
  [themaKey("mathe", "realschule", 6, "Prozent — Grundlagen")]: prozentRs6,
  [themaKey("mathe", "realschule", 6, "Ganze Zahlen (negativ)")]: ganzeZahlenRs6,
  [themaKey("mathe", "realschule", 6, "Flächen & Winkel")]: flaechenWinkelRs6,

  [themaKey("mathe", "realschule", 7, "Prozent- & Zinsrechnung")]: prozentZinsRs7,
  [themaKey("mathe", "realschule", 7, "Dreisatz & Proportionalität")]: dreisatzRs7,
  [themaKey("mathe", "realschule", 7, "Terme & Gleichungen")]: termeRs7,
  [themaKey("mathe", "realschule", 7, "Dreiecke & Flächen")]: dreieckeRs7,
  [themaKey("mathe", "realschule", 7, "Wahrscheinlichkeit")]: wahrscheinlichkeitRs7,

  [themaKey("mathe", "realschule", 8, "Lineare Funktionen")]: lineareFunktionenRs8,
  [themaKey("mathe", "realschule", 8, "Gleichungssysteme")]: gleichungssystemeRs8,
  [themaKey("mathe", "realschule", 8, "Potenzen & Wurzeln")]: potenzenWurzelnRs8,
  [themaKey("mathe", "realschule", 8, "Körper: Volumen & Oberfläche")]: koerperRs8,
  [themaKey("mathe", "realschule", 8, "Statistik")]: statistikRs8,

  [themaKey("mathe", "realschule", 9, "Satz des Pythagoras")]: pythagorasRs9,
  [themaKey("mathe", "realschule", 9, "Trigonometrie (sin, cos, tan)")]: trigonometrieRs9,
  [themaKey("mathe", "realschule", 9, "Kreis & Kreisteile")]: kreisRs9,
  [themaKey("mathe", "realschule", 9, "Quadratische Funktionen")]: quadrFunktionenRs9,
  [themaKey("mathe", "realschule", 9, "Prisma, Zylinder")]: prismaZylinderRs9,

  [themaKey("mathe", "realschule", 10, "Quadratische Gleichungen")]: quadrGleichungenRs10,
  [themaKey("mathe", "realschule", 10, "Exponentielles Wachstum")]: expWachstumRs10,
  [themaKey("mathe", "realschule", 10, "Trigonometrie vertieft")]: trigonometrie2Rs10,
  [themaKey("mathe", "realschule", 10, "Kugel, Kegel, Pyramide")]: kugelKegelRs10,
  [themaKey("mathe", "realschule", 10, "Stochastik")]: stochastikRs10,

  [themaKey("mathe", "mittelschule", 5, "Natürliche Zahlen")]: natZahlenMs5,
  [themaKey("mathe", "mittelschule", 5, "Grundrechenarten")]: grundrechenartenMs5,
  [themaKey("mathe", "mittelschule", 5, "Größen & Einheiten")]: groessenMs5,
  [themaKey("mathe", "mittelschule", 5, "Umfang & Fläche")]: flaecheMs5,
  [themaKey("mathe", "mittelschule", 5, "Teilbarkeit")]: teilbarkeitMs5,

  [themaKey("mathe", "mittelschule", 6, "Bruchrechnen — Grundlagen")]: bruchrechnenMs6,
  [themaKey("mathe", "mittelschule", 6, "Dezimalzahlen")]: dezimalzahlenMs6,
  [themaKey("mathe", "mittelschule", 6, "Prozent — Einstieg")]: prozentMs6,
  [themaKey("mathe", "mittelschule", 6, "Maßstab & Größen")]: massstabMs6,
  [themaKey("mathe", "mittelschule", 6, "Flächen & Körper")]: flaechenKoerperMs6,

  [themaKey("mathe", "mittelschule", 7, "Prozentrechnung")]: prozentrechnungMs7,
  [themaKey("mathe", "mittelschule", 7, "Dreisatz")]: dreisatzMs7,
  [themaKey("mathe", "mittelschule", 7, "Rechnen mit negativen Zahlen")]: negativeZahlenMs7,
  [themaKey("mathe", "mittelschule", 7, "Terme & Gleichungen (Einstieg)")]: termeGleichungenMs7,
  [themaKey("mathe", "mittelschule", 7, "Flächen (Dreieck, Parallelogramm)")]: flaechenMs7,

  [themaKey("mathe", "mittelschule", 8, "Zinsrechnung")]: zinsrechnungMs8,
  [themaKey("mathe", "mittelschule", 8, "Zuordnungen & Diagramme")]: zuordnungenMs8,
  [themaKey("mathe", "mittelschule", 8, "Gleichungen lösen")]: gleichungenMs8,
  [themaKey("mathe", "mittelschule", 8, "Volumen (Quader, Prisma)")]: volumenMs8,
  [themaKey("mathe", "mittelschule", 8, "Wahrscheinlichkeit (Einstieg)")]: wahrscheinlichkeitMs8,

  [themaKey("mathe", "mittelschule", 9, "Satz des Pythagoras")]: pythagorasMs9,
  [themaKey("mathe", "mittelschule", 9, "Kreis: Umfang & Fläche")]: kreisMs9,
  [themaKey("mathe", "mittelschule", 9, "Zinsrechnung vertieft")]: zinsen2Ms9,
  [themaKey("mathe", "mittelschule", 9, "Oberfläche & Volumen")]: oberflaecheVolumenMs9,
  [themaKey("mathe", "mittelschule", 9, "Daten & Statistik")]: statistikMs9,

  [themaKey("mathe", "mittelschule", 10, "Lineare Funktionen")]: lineareFunktionenMs10,
  [themaKey("mathe", "mittelschule", 10, "Quadratische Zusammenhänge")]: quadratischMs10,
  [themaKey("mathe", "mittelschule", 10, "Trigonometrie (Einstieg)")]: trigonometrieMs10,
  [themaKey("mathe", "mittelschule", 10, "Prozent & Zins im Alltag")]: prozentZinsMs10,
  [themaKey("mathe", "mittelschule", 10, "Wahrscheinlichkeit")]: wahrscheinlichkeitMs10,

  [themaKey("mathe", "hauptschule", 5, "Natürliche Zahlen")]: natZahlenHs5,
  [themaKey("mathe", "hauptschule", 5, "Grundrechenarten")]: grundrechenartenHs5,
  [themaKey("mathe", "hauptschule", 5, "Größen & Einheiten")]: groessenHs5,
  [themaKey("mathe", "hauptschule", 5, "Umfang & Fläche")]: flaecheHs5,

  [themaKey("mathe", "hauptschule", 6, "Bruchrechnen — Grundlagen")]: bruchrechnenHs6,
  [themaKey("mathe", "hauptschule", 6, "Dezimalzahlen")]: dezimalzahlenHs6,
  [themaKey("mathe", "hauptschule", 6, "Prozent — Einstieg")]: prozentHs6,
  [themaKey("mathe", "hauptschule", 6, "Maßstab & Größen")]: massstabHs6,

  [themaKey("mathe", "hauptschule", 7, "Prozentrechnung")]: prozentrechnungHs7,
  [themaKey("mathe", "hauptschule", 7, "Dreisatz")]: dreisatzHs7,
  [themaKey("mathe", "hauptschule", 7, "Negative Zahlen")]: negativeZahlenHs7,
  [themaKey("mathe", "hauptschule", 7, "Flächenberechnung")]: flaechenHs7,

  [themaKey("mathe", "hauptschule", 8, "Zinsrechnung")]: zinsrechnungHs8,
  [themaKey("mathe", "hauptschule", 8, "Gleichungen (Einstieg)")]: gleichungenHs8,
  [themaKey("mathe", "hauptschule", 8, "Volumen (Quader)")]: volumenHs8,
  [themaKey("mathe", "hauptschule", 8, "Zuordnungen")]: zuordnungenHs8,

  [themaKey("mathe", "hauptschule", 9, "Satz des Pythagoras")]: pythagorasHs9,
  [themaKey("mathe", "hauptschule", 9, "Kreis: Umfang & Fläche")]: kreisHs9,
  [themaKey("mathe", "hauptschule", 9, "Rechnen im Alltag")]: alltagHs9,
  [themaKey("mathe", "hauptschule", 9, "Daten & Diagramme")]: datenHs9,

  [themaKey("mathe", "grundschule", 1, "Zahlen bis 20")]: zahlen20Gs1,
  [themaKey("mathe", "grundschule", 1, "Plus & Minus bis 20")]: plusminus20Gs1,
  [themaKey("mathe", "grundschule", 1, "Zahlen zerlegen")]: zerlegenGs1,
  [themaKey("mathe", "grundschule", 1, "Längen & Größenvergleich")]: laengenGs1,
  [themaKey("mathe", "grundschule", 1, "Geld bis 20 Cent/Euro")]: geldGs1,
  [themaKey("mathe", "grundschule", 1, "Formen & Muster")]: formenGs1,

  [themaKey("mathe", "grundschule", 2, "Zahlen bis 100")]: zahlen100Gs2,
  [themaKey("mathe", "grundschule", 2, "Addieren & Subtrahieren bis 100")]: plusminus100Gs2,
  [themaKey("mathe", "grundschule", 2, "Einmaleins")]: einmaleinsGs2,
  [themaKey("mathe", "grundschule", 2, "Uhrzeit ablesen")]: uhrzeitGs2,
  [themaKey("mathe", "grundschule", 2, "Längen (m, cm)")]: laengenGs2,
  [themaKey("mathe", "grundschule", 2, "Geld rechnen")]: geldrechnenGs2,

  [themaKey("mathe", "grundschule", 3, "Zahlen bis 1000")]: zahlen1000Gs3,
  [themaKey("mathe", "grundschule", 3, "Schriftlich Addieren & Subtrahieren")]: schriftlichGs3,
  [themaKey("mathe", "grundschule", 3, "Malnehmen & Teilen")]: malteilenGs3,
  [themaKey("mathe", "grundschule", 3, "Längen & Gewichte")]: laengenGewichteGs3,
  [themaKey("mathe", "grundschule", 3, "Zeitspannen")]: zeitspannenGs3,
  [themaKey("mathe", "grundschule", 3, "Geometrie: Formen & Flächen")]: geometrieGs3,

  [themaKey("mathe", "grundschule", 4, "Zahlen bis 1 Million")]: millionGs4,
  [themaKey("mathe", "grundschule", 4, "Schriftlich Multiplizieren")]: multiplizierenGs4,
  [themaKey("mathe", "grundschule", 4, "Schriftlich Dividieren")]: dividierenGs4,
  [themaKey("mathe", "grundschule", 4, "Größen umrechnen")]: umrechnenGs4,
  [themaKey("mathe", "grundschule", 4, "Sachaufgaben")]: sachaufgabenGs4,
  [themaKey("mathe", "grundschule", 4, "Umfang & Fläche (Rechteck)")]: flaecheGs4,
  [themaKey("mathe", "gymnasium", 6, "Bruchrechnen")]: bruchrechnenGym6,
  [themaKey("mathe", "gymnasium", 6, "Dezimalbrüche")]: dezimalbruecheGym6,
  [themaKey("mathe", "gymnasium", 6, "Ganze Zahlen (negativ)")]: ganzeZahlenGym6,
  [themaKey("mathe", "gymnasium", 6, "Prozent — Grundlagen")]: prozentGym6,
  [themaKey("mathe", "gymnasium", 6, "Teilbarkeit & Primfaktoren")]: teilbarkeitGym6,
  [themaKey("mathe", "gymnasium", 6, "Rechnen mit Größen")]: groessenGym6,
  [themaKey("mathe", "gymnasium", 6, "Flächeninhalt & Umfang")]: flaecheGym6,
  [themaKey("mathe", "gymnasium", 6, "Volumen & Oberfläche")]: volumenGym6,
  [themaKey("mathe", "gymnasium", 6, "Winkel")]: winkelGym6,
  [themaKey("mathe", "gymnasium", 6, "Symmetrie")]: symmetrieGym6,
  [themaKey("mathe", "gymnasium", 6, "Daten & Diagramme")]: datenGym6,
};

/** Interaktive Aufgaben für eine Auswahl (null, wenn noch nichts hinterlegt). */
export function getAufgaben(
  fach: Fach,
  schulart: SchulartId,
  klasse: number,
  thema: string,
): Aufgabe[] | null {
  const key = themaKey(fach, schulart, klasse, thema);
  return INTERAKTIV[key] ?? null;
}

/**
 * Liste aller Auswahl-Schlüssel (fach|schulart|klasse|thema), die spielbar sind.
 * Damit blendet die Oberfläche „Bald verfügbar" korrekt ein.
 */
export function verfuegbareKeys(): string[] {
  return Object.keys(INTERAKTIV).filter((k) => INTERAKTIV[k].length > 0);
}

/** Kleine Statistik (nur für Logging/Übersicht). */
export function bestand(): { themen: number; aufgaben: number } {
  let themen = 0;
  let aufgaben = 0;
  for (const liste of Object.values(INTERAKTIV)) {
    if (liste.length > 0) {
      themen += 1;
      aufgaben += liste.length;
    }
  }
  return { themen, aufgaben };
}
