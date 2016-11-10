const si = require('systeminformation');
const extIP = require('external-ip');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const config = require(path.join(__dirname, "config.json"));

var getIP = extIP({
    replace: true,
    services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
    timeout: 600,
    getIP: 'parallel'
});

var bot = new TelegramBot(config.telegram_token, { polling: true });

bot.onText(/\/state(.*)/, function(msg, match) {

	getIP(function (err, ip) {
	si.cpuTemperature(function(temps) {
	si.currentLoad(function(cpuLoad) {
	si.mem(function(memLoad) {
	si.fsSize(function (fsSpace) {
	si.osInfo(function (osInfo) {
		var ramUsed = (memLoad.free/1073741824).toFixed(2);
		var ramTotal = (memLoad.total/1073741824).toFixed(2);
		var temp = ''
		if(temps.max !== -1) { temp = "Temps->"+temps.cores+"\n" }
       		bot.sendMessage(msg.chat.id,
			"===="+osInfo.hostname+"====\n"+
			"Cpu ->"+cpuLoad.currentload.toFixed(2)+"%\n"+
			"Ram->"+ramUsed+"/"+ramTotal+"Gb\n"+
			"Disk->"+fsSpace.filter(function(x){return x.mount=="/"})[0].use+"%\n"+
			"IP->"+ip+"\n"+
			temp+
			"=============="
		);
	});});});});});});
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

bot.onText(/\/disks(.*)/, function(msg, match) {

        si.fsSize(function(fsSpace) {
		var response = "";
		filteredFs = fsSpace.filter(function(x){return x.fs.match(/^((?!loop).)*$/gi)});
		for (i in filteredFs) {
			response = response+"===="+filteredFs[i].fs+"====\n"+
			"Mount: "+filteredFs[i].mount+"\n"+
			"Total: "+(filteredFs[i].size/1073741824).toFixed(2)+"GB\n"+
			"Use: "+filteredFs[i].use+"%\n"
		};
		response = response+"============";
                bot.sendMessage(msg.chat.id, response);
        });
});
