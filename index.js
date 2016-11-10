var si = require('systeminformation');
var TelegramBot = require('node-telegram-bot-api');
var path = require('path');

const config = require(path.join(__dirname, "config.json"));

var bot = new TelegramBot(config.telegram_token, { polling: true });

bot.onText(/\/state(.*)/, function(msg, match) {

	si.currentLoad(function(cpuLoad) {
		si.mem(function(memLoad) {
			si.fsSize(function (fsSpace) {
				var ramUsed = (memLoad.free/1073741824).toFixed(2);
				var ramTotal = (memLoad.total/1073741824).toFixed(2);
       				bot.sendMessage(msg.chat.id,
					"Cpu ->"+cpuLoad.currentload.toFixed(2)+"%\n"+
					"Ram->"+ramUsed+"/"+ramTotal+"Gb\n"+
					"Disk->"+fsSpace.filter(function(x){return x.mount=="/"})[0].use+"%"
				);
			});
		});
	});
});

bot.onText(/\/dockers(.*)/, function(msg, match) {

        si.dockerContainers(function(containers) {
		var response = "";
		for (i in containers) {
			response = response+"===="+containers[i].name+"====\n"+
			"Image: "+containers[i].image+"\n"+
			"State: "+containers[i].state+"\n"
		};
		response = response+"============";
                bot.sendMessage(msg.chat.id, response);
        });
});
