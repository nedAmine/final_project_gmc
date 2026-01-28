import "dotenv/config";
import mongoose from "mongoose";
import Settings from "../models/Settings.model";

async function run() {
  try {
    // 1. Connecter à MongoDB
    await mongoose.connect(process.env.MONGO_URI as string);

    // 2. Supprimer tous les settings existants
    await Settings.deleteMany({});

    // 3. Créer un nouveau document avec les valeurs par défaut
    await Settings.create({});
    console.log("Settings initialized with defaults");

    // 4. Fermer la connexion proprement
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();