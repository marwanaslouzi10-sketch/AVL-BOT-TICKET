
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  throw new Error("Missing DISCORD_BOT_TOKEN or CLIENT_ID");
}

const commands = [
  new SlashCommandBuilder()
    .setName("ticketsetup")
    .setDescription("Create the AVL ticket panel")
    .toJSON()
];

const rest = new REST({ version: "10" }).setToken(token);

async function main() {
  try {
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log("Global ticket command registered successfully!");
  } catch (error) {
    console.error("Command registration failed:", error.message);
    process.exitCode = 1;
  }
}

main();
    
