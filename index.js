var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { Bot } = require("./adb/index");
const cfg = require("./config.json");
const secret = require("./secret.json");
const bot = new Bot("a!");

let leaklocserver;
let commandchannel;

let serv;
let chan;

const riotAuth = `?api_key=${secret.riotkey}`;

bot.client.login(secret.discord.token); // Starts the bot.

bot.client.on("message", message => {
  if (message.channel.id == cfg.abbchan && message.content == "hello sir") {
    chan.send("ey wudup");
  }
});

bot.registerCommand({
  name: "tg",
  description: "Sends a Tokyo Ghoul GIF",
  handler: message => {
    var x = Math.floor(Math.random() * tg.length);
    while (x === tgi) {
      x = Math.floor(Math.random() * tg.length);
    }
    tgi = x;
    return message.channel.send("", {
      file: tg[tgi]
    });
  }
});

bot.registerCommand({
  name: "emoji",
  description: "Sends an emoji GIF",
  handler: message => {
    var x = Math.floor(Math.random() * emoji.length);
    while (x === emojii) {
      x = Math.floor(Math.random() * emoji.length);
    }
    emojii = x;
    return message.channel.send("", {
      file: emoji[emojii]
    });
  }
});

bot.registerCommand({
  name: "oof",
  description: "Oof.jpg",
  handler: message => {
    return message.channel.send("Oof", {
      file:
        "https://is3-ssl.mzstatic.com/image/thumb/Purple128/v4/8a/43/ac/8a43ac4b-a90f-53be-0bc5-5ca104cfc227/mzl.aczcvcde.png/246x0w.jpg"
    });
  }
});

bot.registerCommand({
  name: "lol",
  description: "Latest game retriever (names case-sensitive)",
  handler: (message, args) => {
    if (args.length < 2)
      return message.reply("Please specify correct arguments");
    else if (args[0] == "game") {
      var name = "";
      for (var i = 1; i < args.length; i++) {
        name += args[i] + "%20";
      }
      name = name.substring(0, name.length - 3);

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open(
        "GET",
        `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name +
          riotAuth}`,
        false
      );
      xmlHttp.send(null);
      var json = JSON.parse(xmlHttp.responseText.toString());
      var accId = json.accountId;
      xmlHttp.open(
        "GET",
        `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accId +
          riotAuth}`,
        false
      );
      xmlHttp.send(null);
      var gameList = JSON.parse(xmlHttp.responseText.toString());
      var gameId = gameList.matches[0].gameId;
      xmlHttp.open(
        "GET",
        `https://na1.api.riotgames.com/lol/match/v4/matches/${gameId +
          riotAuth}`,
        false
      );
      xmlHttp.send(null);
      var game = JSON.parse(xmlHttp.responseText.toString());
      var gp = gameParse(game, name);
      return message.reply(gp.substring(gp.indexOf("\n")), {
        file: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${gp.substring(
          0,
          gp.indexOf("\n")
        )}_0.jpg`
      });
    }
  }
});

bot.registerCommand({
  name: "tft",
  description: "TFT Teams: Alex, Yak, Pirates, BVoid",
  handler: (message, args) => {
    if (args[0] == "Alex") {
      return message.reply(
        "```md\n# Alex\n\n* Ahri\n* Lulu\n* Kassadin\n* Cho'Gath\n* Rek'Sai\n* Warwick\n* Blitzcrank\n```"
      );
    } else if (args[0] == "Yak") {
      return message.reply(
        "```md\n# Yak\n\n* Ashe\n* Kindred\n* Varus\n* Vayne\n* Braum\n* Leona\n* Mordekaiser\n```"
      );
    } else if (args[0] == "Pirates") {
      return message.reply(
        "```md\n# Pirates\n\n* Graves\n* Gangplank\n* Tristana\n* Camille\n* Miss Fortune\n* Jinx\n* Lucian\n```"
      );
    } else if (args[0] == "BVoid") {
      return message.reply(
        "```md\n# BVoid\n\n* Kassadin\n* Blitzcrank\n* Lucian\n* Rek'Sai\n* Vi\n* Cho'Gath\n* Jinx\n```"
      );
    }
  }
});

var emoji = [
  "JCP1p4Q",
  "NYqewdu",
  "jJY7wG7",
  "o21sWFi",
  "VEUFuzK",
  "kOKvRvr",
  "hZRsWM1",
  "FVyRUK5",
  "2kwiHO4",
  "ST5KHLz"
].map(pic => `https://imgur.com/${pic}.gif`);
var emojii = Math.floor(Math.random() * emoji.length);
var tg = [
  "l3DbXvQ",
  "EY1YCrp",
  "jZOk7yc",
  "eN1ON13",
  "gyPCqat",
  "8rg6w3m",
  "b8xC9Jg",
  "duZe5hK",
  "Ssgybo2",
  "auOO8e2"
].map(pic => `https://imgur.com/${pic}.gif`);
var tgi = Math.floor(Math.random() * tg.length);

bot.client.on("ready", () => {
  try {
    serv = bot.client.guilds.get(cfg.abbserv);
    chan = serv.channels.get(cfg.abbchan);
    console.log("Successfully initialized ABB. ");
  } catch (err) {
    console.log("Error initializing ABB. ");
  }

  leaklocserver = bot.client.guilds.get(cfg.leaklocserver);
  commandchannel = leaklocserver.channels.get(cfg.commandchannel);

  console.log("Bot online!");
  commandchannel.send("Akira is now `online`. ");
});

bot.client.on("message", message => {
  if (
    message.channel.id === cfg.commandchannel ||
    message.channel.id === cfg.abbchan
  ) {
    if (message.content === "PING") {
      commandchannel.send("PONG");
    } else if (message.content === "ping") {
      commandchannel.send("pong");
    } else if (
      message.content === "owo" ||
      message.content === "OwO" ||
      message.content === "OWO"
    ) {
      commandchannel.send("What's this?");
    }
  }
});

function gameParse(game, meme) {
  var player = meme.replace(/%20/g, " ");

  var gVers = game.gameVersion.substring(
    0,
    getPosition(game.gameVersion, ".", 2)
  );

  var finalt = "";
  var t1 = "";
  var t2 = "";

  var pId = -1;
  for (var i = 0; i < 10; i++) {
    if (game.participantIdentities[i].player.summonerName == player) {
      pId = i;
    }
    if (i > 4) {
      t1 += game.participantIdentities[i].player.summonerName + ", ";
    } else {
      t2 += game.participantIdentities[i].player.summonerName + ", ";
    }
  }

  t1 = t1.substring(0, t1.length - 2);
  t2 = t2.substring(0, t2.length - 2);

  if (game.participants[pId].stats.win == true) {
    if (pId > 4) {
      finalt = `[ Team:  ]( W )\t${t1}\n[ Enemy: ]( L )\t${t2}`;
    } else {
      finalt = `[ Team:  ]( W )\t${t2}\n[ Enemy: ]( L )\t${t1}`;
    }
  } else {
    if (pId > 4) {
      finalt = `[ Team:  ]( L )\t${t1}\n[ Enemy: ]( W )\t${t2}`;
    } else {
      finalt = `[ Team:  ]( L )\t${t2}\n[ Enemy: ]( W )\t${t1}`;
    }
  }

  const champId = game.participants[pId].championId;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
    "GET",
    `http://ddragon.leagueoflegends.com/cdn/${gVers}.1/data/en_US/champion.json`,
    false
  );
  xmlHttp.send(null);
  var champions = JSON.parse(xmlHttp.responseText.toString());
  var champName = "oof";
  for (var name in champions.data) {
    if (champions.data[name].key == champId) {
      champName = name;
      break;
    }
  }

  var utcSeconds = game.gameCreation;
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);

  return `${champName}\n\`\`\`md\n# ${player}\n\n* ${
    game.gameMode
  }\n* ${d}\n\n${finalt}\n\n< K >\t${
    game.participants[pId].stats.kills
  }\n< D >\t${game.participants[pId].stats.deaths}\n< A >\t${
    game.participants[pId].stats.assists
  }\`\`\``;
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}