require("dotenv").config()
const { Client, Collection } = require("discord.js")
const fs = require("fs")
const client = new Client({intents: []})
client.commands = new Collection()

const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"))

commandFiles.forEach(commandFile => {
    const command = require(`"./commands/${commandFile}"`)
    client.commands.set(command.data.name, command)
})
client.once("ready", () => {
    console.log(`Ready! Logged in as ${client.user.tag}! I am on ${client.guilds.cache.size} server(s)!`)
    client.user.setActivity({name: "mit dem dreckscode", type: "PLAYING"})
})
client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if(command) {

        try {
            await command.execute(interaction)
        } catch(error) {
            console.error(error)

            if(interaction.deferred || interaction.replied) {
                interaction.editReply("Oops! Something went wrong while trying to execute this command")
            }else {
                interaction.reply("Oops! Something went wrong while trying to execute this command")
            }
        }

    }
})

client.login(process.env.DISCORD_BOT_TOKEN)