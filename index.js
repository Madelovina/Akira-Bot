var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { Bot } = require("./adb/index");
const cfg = require("./config.json");
const secret = require("./secret.json");
const bot = new Bot("a!");
const { Builder, By } = require("selenium-webdriver");

var md5 = require("md5");
const { google } = require("googleapis");
const keys = require("./keys.json");

var fileId = {};

const riotAuth = `?api_key=${secret.riotkey}`;

const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file"
]);

client.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }
});

let serv;
let spam;
let dump;
let flex;
let missed;
let removes = cfg.removes;
let lastImageLink = "";

const gsapi = google.sheets({ version: "v4", auth: client });
const gdapi = google.drive({ version: "v3", auth: client });

updateId(gdapi);

bot.client.login(secret.discord.token); // Starts the bot.

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
    name: "academy",
    description:
        "new [First] [Last]\n\t\t\t share [First] [Last] [Email]\n\t\t\t returnId [First] [Last]" +
        "\n\t\t\t change [First] [Last] [Balance Change] [Reason] : [Note]\n\t\t\t gambit [First] [Last]\n\t\t\t leaderboards" +
        "\n\n\t\t\t STAY AWAY FROM THESE:\n\t\t\t dupes\n\t\t\t fileId\n\t\t\t update\n\t\t\t refreshMaster\n\t\t\t restart\n\t\t\t restart2\n\t\t\t restart3",
    handler: (message, args) => {
        if (message.channel.id == "678102017226309644") {
            if (args[0] == "new") {
                var firstName = args[1];
                var lastName = args[2];
                try {
                    newCopy(firstName + " " + lastName);
                    return message.reply(
                        "Added " +
                            firstName +
                            " " +
                            lastName +
                            ". Don't forget to share it! "
                    );
                } catch (e) {
                    return message.reply(
                        "Could not add " + firstName + " " + lastName
                    );
                }
            } else if (args[0] == "fileId") {
                const fileIdKeys = Object.keys(fileId);
                var msg = "\n";
                for (var i = 0; i < fileIdKeys.length; i++) {
                    msg += fileIdKeys[i] + " : " + fileId[fileIdKeys[i]] + "\n";
                }
                console.log(msg);
                return message.reply("Printed IDs to console. ");
            } else if (args[0] == "update") {
                updateId();
                return message.reply("Updated IDs. ");
            } else if (args[0] == "share") {
                shareFile(
                    fileId[`${args[1]} ${args[2]} Accounting Sheet`],
                    args[3]
                );
                return message.reply("Shared to " + args[3]);
            } else if (args[0] == "returnId") {
                return message.reply(
                    args[1] +
                        " " +
                        args[2] +
                        "'s Spreadsheet ID is: " +
                        fileId[`${args[1]} ${args[2]} Accounting Sheet`]
                );
            } else if (args[0] == "refreshMaster") {
                addToMaster();
                return message.reply("Refreshed master!");
            } else if (args[0] == "change") {
                var reason = "";
                var note = "";
                var startIndex = 9999;
                for (var i = 4; i < args.length; i++) {
                    if (args[i] == ":") {
                        startIndex = i + 1;
                        break;
                    }
                    reason += args[i] + " ";
                }
                for (var i = startIndex; i < args.length; i++) {
                    note += args[i] + " ";
                }

                reason = reason.trim();
                note = note.trim();

                changeValue(args[1], args[2], args[3], reason, note);
                return message.reply(
                    "Balance change of " +
                        args[3] +
                        " applied to " +
                        args[1] +
                        " " +
                        args[2]
                );
            } else if (args[0] == "gambit") {
                const roll = Math.floor(Math.random() * 1000000000000);
                let money = "";
                if (roll <= 149999999999) money = "*2";
                else if (roll <= 349999999999) money = "2500";
                else if (roll <= 599999999999) money = "1000";
                else money = "/2";
                changeValue(
                    args[1],
                    args[2],
                    money,
                    "Gambit",
                    "hash: " + md5(roll)
                );
                return message.reply(
                    "Gambit resulted in a change of " +
                        money +
                        " to " +
                        args[1] +
                        " " +
                        args[2] +
                        "'s balance"
                );
            } else if (args[0] == "leaderboards") {
                leaderboards();
                return message.reply("Printed leaderboards to console");
            } else if (args[0] == "dupes") {
                removeGhost();
                return message.reply("Removed broken files. ");
            } else if (args[0] == "restart") {
                newCopyy();
                return message.reply("Done");
            } else if (args[0] == "restart2") {
                newSharee();
                return message.reply("Done");
            } else if (args[0] == "restart3") {
                fixA2();
                return message.reply("Done");
            }
        } else {
            return message.reply("You don't have perms dumbass...");
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

    return `${champName}\n\`\`\`md\n# ${player}\n\n* ${game.gameMode}\n* ${d}\n\n${finalt}\n\n< K >\t${game.participants[pId].stats.kills}\n< D >\t${game.participants[pId].stats.deaths}\n< A >\t${game.participants[pId].stats.assists}\`\`\``;
}

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}

async function newCopy(name) {
    var body = {
        name: `${name} Accounting Sheet`,
        parents: [`${fileId[name.charAt(0)]}`]
    };
    let ph = await gdapi.files.copy({
        fileId: `${fileId["Example Accounting Sheet"]}`,
        resource: body
    });
    addToMaster();
}

function updateId() {
    gdapi.files.list(
        {
            pageSize: 1000,
            fields: "nextPageToken, files(id, name)"
        },
        (err, res) => {
            if (err) return console.log("The API returned an error: " + err);
            const files = res.data.files;
            if (files.length) {
                files.map(file => {
                    var fname = file.name.toString();
                    var fid = file.id.toString();
                    fileId[fname] = fid;
                });
            } else {
                console.log("No files found.");
            }
        }
    );
}

async function shareFile(id, email) {
    let ph = await gdapi.permissions.create({
        fileId: id,
        resource: {
            role: "reader",
            type: "user",
            emailAddress: email
        }
    });
}

async function addToMaster() {
    const opt = {
        spreadsheetId: "10T8oLOKDj-C6Y4sGdfjxm-84qxikrKNv5hfByF8Cx-4",
        range: "Sheet1!A2:B"
    };

    const values = await gsapi.spreadsheets.values.get(opt);

    let dataArray = values.data.values;
    let newDataArray = [];
    for (var i = 0; i < dataArray.length; i++) {
        var name = dataArray[i][0];
        if (name.charAt(name.length - 1) == " ")
            name = name.substring(0, name.length - 1);
        var cellData = [
            '=IMPORTRANGE("https://docs.google.com/spreadsheets/d/' +
                fileId[`${name} Accounting Sheet`] +
                '/","A2:A2")'
        ];
        if (cellData[0].includes("undefined")) {
            newDataArray.push(["0"]);
        } else {
            newDataArray.push(cellData);
        }
    }

    const updateOptions = {
        spreadsheetId: "10T8oLOKDj-C6Y4sGdfjxm-84qxikrKNv5hfByF8Cx-4",
        range: "Sheet1!B2:B",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: newDataArray
        }
    };

    let response = await gsapi.spreadsheets.values.update(updateOptions);
}

async function changeValue(fn, ln, monies, reason, note) {
    sheetId = fileId[`${fn} ${ln} Accounting Sheet`];
    const opt = {
        spreadsheetId: sheetId,
        range: "Sheet1!C2:G"
    };
    let history = await gsapi.spreadsheets.values.get(opt);
    let dataArray = history.data.values;

    var prevFinal;

    if (dataArray[dataArray.length - 1].length == 4)
        prevFinal =
            dataArray[dataArray.length - 1][
                dataArray[dataArray.length - 1].length - 1
            ];
    else
        prevFinal =
            dataArray[dataArray.length - 1][
                dataArray[dataArray.length - 1].length - 2
            ];

    let newMoney;
    if (monies == "/2") {
        monies = "-" + parseFloat(prevFinal) / 2;
        newMoney = parseFloat(prevFinal) / 2;
    } else if (monies == "*2") {
        monies = parseFloat(prevFinal);
        newMoney = parseFloat(prevFinal) * 2;
    } else newMoney = parseFloat(prevFinal) + parseFloat(monies);

    monies = Math.round(parseFloat(monies));
    newMoney = Math.round(parseFloat(newMoney));

    dataArray.push([prevFinal, monies, reason, newMoney, note]);

    const updateOptions = {
        spreadsheetId: sheetId,
        range: "Sheet1!C2:G",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: dataArray
        }
    };
    let response = await gsapi.spreadsheets.values.update(updateOptions);
}

// function removeGhost() {
//     gdapi.files.list(
//         {
//             pageSize: 1000,
//             fields: "nextPageToken, files(id, name, parents)"
//         },
//         (err, res) => {
//             if (err) return console.log("The API returned an error: " + err);
//             const files = res.data.files;
//             if (files.length) {
//                 files.map(file => {
//                     if (
//                         !file.name.includes(".") ||
//                         file.name != "Example Accounting Sheet" ||
//                         file.name != "Master Accounting Sheet" ||
//                         !file.name.length > 1 ||
//                         file.parents == null
//                     ) {
//                         gdapi.files.delete({
//                             fileId: `${file.id}`
//                         });
//                     }
//                 });
//             } else {
//                 console.log("No files found.");
//             }
//         }
//     );
// }

async function leaderboards() {
    const opt = {
        spreadsheetId: "10T8oLOKDj-C6Y4sGdfjxm-84qxikrKNv5hfByF8Cx-4",
        range: "Sheet1!A2:B"
    };

    const values = await gsapi.spreadsheets.values.get(opt);

    values.data.values.sort(function(a, b) {
        if (parseFloat(a[1]) === parseFloat(b[1])) {
            return 0;
        } else {
            return parseFloat(a[1]) < parseFloat(b[1]) ? 1 : -1;
        }
    });

    var ind = -1;

    var msg = "\nLEADERBOARDS:\t\t\tPOINTS:\n";
    for (var i = 0; i < 12; i++) {
        msg += values.data.values[i][0];
        for (var j = 0; j < 4 - values.data.values[i][0].length / 8; j++)
            msg += "\t";
        msg += values.data.values[i][1] + "\n";
    }

    for (var i = 0; i < values.data.values.length; i++)
        if (values.data.values[i][0] == "Justin Chang") ind = i + 1;

    console.log(msg);
    console.log("Me " + ind);
}

// async function newCopyy() {
//     const opt = {
//         spreadsheetId: "10T8oLOKDj-C6Y4sGdfjxm-84qxikrKNv5hfByF8Cx-4",
//         range: "Sheet1!A2:D"
//     };

//     const values = await gsapi.spreadsheets.values.get(opt);
//     let dataArray = values.data.values;

//     for (var i = 0; i < dataArray.length; i++) {
//         if (dataArray[i][3] == 1) {
//             var name = dataArray[i][0].trim();
//             var fileName = `${name} Accounting Sheet`;
//             var body = {
//                 name: `${fileName}`,
//                 parents: [`${fileId[name.charAt(0)]}`]
//             };
//             let ph = await gdapi.files.copy({
//                 fileId: `${fileId["Example Accounting Sheet"]}`,
//                 resource: body
//             });
//         }
//     }
// }

// async function newSharee() {
//     const opt = {
//         spreadsheetId: "10T8oLOKDj-C6Y4sGdfjxm-84qxikrKNv5hfByF8Cx-4",
//         range: "Sheet1!A76:D"
//     };

//     const values = await gsapi.spreadsheets.values.get(opt);
//     let dataArray = values.data.values;

//     for (var i = 0; i < dataArray.length; i++) {
//         if (dataArray[i][3] == 1) {
//             var name = dataArray[i][0].trim();
//             var fileName = `${name} Accounting Sheet`;
//             var email = dataArray[i][2];

//             let ph2 = await gdapi.permissions.create({
//                 fileId: `${fileId[fileName]}`,
//                 resource: {
//                     role: "reader",
//                     type: "user",
//                     emailAddress: email
//                 }
//             });
//         }
//     }
// }

async function fixA2() {
    const opt = {
        spreadsheetId: "10T8oLOKDj-C6Y4sGdfjxm-84qxikrKNv5hfByF8Cx-4",
        range: "Sheet1!A47:A75"
    };

    const values = await gsapi.spreadsheets.values.get(opt);
    let dataArray = values.data.values;

    for (var i = 0; i < dataArray.length; i++) {
        var name = dataArray[i][0].trim();
        var fileName = `${name} Accounting Sheet`;
        console.log(fileName);
        const totalOptions = {
            spreadsheetId: `${fileId[fileName]}`,
            range: "Sheet1!A2:A2",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [["=INDEX(F:F,COUNTA(F:F),1)"]]
            }
        };
        let response2 = await gsapi.spreadsheets.values.update(totalOptions);
    }
}

bot.client.on("ready", () => {
    serv = bot.client.guilds.get(cfg.serv);
    spam = serv.channels.get(cfg.spam);
    dump = serv.channels.get(cfg.dump);
    flex = serv.channels.get(cfg.flex);
    missed = serv.channels.get(cfg.missed);
});

bot.client.on("message", message => {
    if (message.author.id == cfg.pokecord && message.channel.id == cfg.spam)
        if (message.content.includes("This is the wrong pokémon!"))
            missed.send("", {
                file: lastImageLink
            });
    try {
        var link = message.embeds[0].image.url;
        lastImageLink = link;
        if (
            link.includes("PokecordSpawn") &&
            !message.content.includes("You caught a level")
        ) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open(
                "GET",
                `http://images.google.com/searchbyimage?image_url=${link}`,
                false
            );
            xmlHttp.send(null);
            var link2 = xmlHttp.responseText.toString();
            link2 = link2.substring(
                link2.indexOf("http://"),
                link2.indexOf('">here</A>.')
            );
            var link3 =
                "https://" + link2.substring(link2.indexOf("google.com"));
            example(link3);
        }
    } catch (e) {}
});

async function example(url) {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get(url);
    var namess = await driver.findElement(By.name("q")).getAttribute("value");
    driver.close();
    for (var i = 0; i < removes.length; i++)
        namess = namess.replace(removes[i].toString(), "");
    console.log(namess);
    spam.send(namess);
}
