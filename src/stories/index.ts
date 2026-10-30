import { StoryDef } from "../engine/types";
import { dasKlopfen } from "./horror-das-klopfen";
import { derBus } from "./liebe-der-bus";
import { spotlightEffekt } from "./psycho-spotlight";

// Neue Story: Datei in src/stories/ anlegen und hier eintragen.
export const STORIES: StoryDef[] = [dasKlopfen, spotlightEffekt, derBus];
