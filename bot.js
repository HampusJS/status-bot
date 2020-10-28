const Discord = require('discord.js'); 
const fs = require('fs');
const yaml = require('js-yaml'); 
const FiveM = require('fivem')

const client = new Discord.Client({disableEveryone: true}); 

function loadFile(file){
    return myFile = yaml.safeLoad(fs.readFileSync(`${file}`, 'utf-8')); 
}

client.settings = loadFile(`./config.yml`); 

// When the bot is only run this code.
client.on('ready', async () => {
    client.user.setActivity(client.settings.setup.status)
    console.log("\u001b[1;32mConsole Log: Bot is up. Created by Hampus#0077")
})

client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return; 

    const prefix = client.settings.setup.prefix
  
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);
  
    if (!command.startsWith(prefix)){
       return;
    }

    if(command === `${prefix}status`) {

    if(message.deletable) message.delete()
    const srv = new FiveM.Server(client.settings.server.serverIP_Port)

    const players = await srv.getPlayers();
    const max = await srv.getMaxPlayers()
    const status = await srv.getServerStatus()
    const currentPlayers = await srv.getCurrentPlayers();

    const informationEmbed = new Discord.MessageEmbed()
    .setAuthor(client.settings.server.name, message.guild.iconURL())
    .setColor(client.settings.setup.embed)
    .setDescription(`This is the current information about the FiveM Server`)
    .addField("Connected Players:", `${players}/${max}`)
    .addField("Online:", status)
    .setFooter(`${client.settings.server.name} - Created by Hampus#0077`)

    message.channel.send(informationEmbed)

  }
})

client.login(client.settings.setup.token)