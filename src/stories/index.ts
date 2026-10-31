import { StoryDef } from "../engine/types";
import { dasKlopfen } from "./horror-das-klopfen";
import { derBus } from "./liebe-der-bus";
import { spotlightEffekt } from "./psycho-spotlight";
import { weltenTour } from "./demo-welten-tour";
import { dieLetzteUBahn } from "./horror-die-letzte-ubahn";

// Neue Story: Datei in src/stories/ anlegen und hier eintragen.
export const STORIES: StoryDef[] = [dasKlopfen, dieLetzteUBahn, spotlightEffekt, derBus, weltenTour];
