/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*  SPLATOON RANDOMIZER BY NKITTEN  */
/*                                  */
/*      GET THE HECK AWAY           */
/*           FROM MY BAD CODE!      */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var allowsave = true;
//sets up resulthistory - keep same as at the top of randomizeAll() function
var resulthistory = {combined: true, textonly: false, includeteamnames: true, includeplayernames: true, stages: [], weapons: [], uploaded: {}};
var modes = stagesmodes.modes;
var stages = stagesmodes.stages;
stages.sort(function(a,b) {
	if (a.name < b.name) { return -1;}
	else if (a.name > b.name) { return 1;}
	else { return 0; }
});
var weapons = weaponlist.weapons;
var settings = {
	"version": 1.2,
	"stages": [],
	"weapons": [],
	"input": {
		"txt-stagesets": "5",
		"txt-weaponsets": "5",
		"chk-combinesets": true,
		"chk-textonly": false,
		"chk-otherversionlink": true,
		"chk-allowstagedupe": false,
		"chk-rotatestages": true,
		"chk-rotatemodes": true,
		"chk-allowstagerepeat": true,
		"dd-team1": 0,
		"dd-team2": 0,
		"chk-includeteamnames": true,
		"txt-teamnames": "Alpha Team, Bravo Team",
		"chk-includeplayernames": true,
		"txt-playernames": "Player 1, Player 2, Player 3, Player 4, Player 5, Player 6, Player 7, Player 8",
		"chk-randomizeteams": false,
		"chk-keeprandomizedteams": false,
		"chk-allowoctoshot": false,
		"chk-allowstoryweapons": true,
		"chk-allowamiiboweapons": false,
		"chk-allowenemydupe": true,
		"chk-allowallydupe": false,
		"chk-mirrorweapons": false,
		"chk-balanceteams": false,
		"txt-freepick": "0.00",
		"chk-equalfreepicks": true,
		"chk-showsubspecial": true
	}
};
var imgur = {"pass": "", "enabled": false};
var stageConversionCodes = {};

function setupStageCodes() {
	for (i = 0; i < modes.length; i++) {
		stageConversionCodes[modes[i].name] = modes[i].id;
		stageConversionCodes[modes[i].id] = modes[i].name;
	}
	for (i = 0; i < stages.length; i++) {
		stageConversionCodes[stages[i].name] = stages[i].id;
		stageConversionCodes[stages[i].id] = stages[i].name;
	}
}

function gup(name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if (results == null) {
		return "";
	}
	else {
		return results[1];
	}
}

function randMinMax(min,max) {
	return Math.floor((Math.random()*((max+1)-min))+min);
}

function convertStageCode(code) { //conversion codes used to be in this function, moved the codes to "stagesmodes.js" when updating for splatoon 2 and have a new function build an object out of those ids instead - kept this function because it's called 20 times
	return stageConversionCodes[code];
}

function makeStageTable(list) {
	var i = 0, m = 0, s = 0;
	var listnotempty = false;
	if (list && list.length > 0) { listnotempty = true; }
	var txt = "<table id='stageTable'><thead><tr><th class='big'>(<span class='stageselectall'>all</span> / <span class='stageselectnone'>none</span>)</th>";
	for (m = 0; m < modes.length; m++) {
		txt = txt + "<th class='modecell' data-mode='" + convertStageCode(modes[m].name) + "'>" + modes[m].name + "<br /><span class='allnone'>(<span class='colselectall' data-mode='" + convertStageCode(modes[m].name) + "'>all</span> / <span class='colselectnone' data-mode='" + convertStageCode(modes[m].name) + "'>none</span>)</span></th>";
	}
	txt = txt + "</tr></thead><tbody>";
	for (s = 0; s < stages.length; s++) {
		if (stages[s].released !== false) {
			txt = txt + "<tr><td class='stagecell' data-stage='" + convertStageCode(stages[s].name) + "'><span class='allnone'>(<span class='rowselectall' data-stage='" + convertStageCode(stages[s].name) + "'>all</span> / <span class='rowselectnone' data-stage='" + convertStageCode(stages[s].name) + "'>none</span>)</span><span class='stagecellname'>" + stages[s].name + "</span></td>";
			for (m = 0; m < modes.length; m++) {
				if (listnotempty) {
					var matched = false;
					for (i = 0; i < list.length; i++) {
						if ((stages[s].name == list[i].stage) && (modes[m].name == list[i].mode)) {
							list.splice(i, 1);
							matched = true;
							break;
						}
					}
					if (matched === true) { txt = txt + "<td class='stageselect selected' data-mode='" + convertStageCode(modes[m].name) + "' data-stage='" + convertStageCode(stages[s].name) + "'><span class='checkcross'>&#10003;</span></td>"; }
					else { txt = txt + "<td class='stageselect' data-mode='" + convertStageCode(modes[m].name) + "' data-stage='" + convertStageCode(stages[s].name) + "'><span class='checkcross'>&#10007;</span></td>"; }
				}
				else {
					txt = txt + "<td class='stageselect" + ((modes[m].ranked === true) ? " selected" : "") + "' data-mode='" + convertStageCode(modes[m].name) + "' data-stage='" + convertStageCode(stages[s].name) + "'>" + ((modes[m].ranked === true) ? "<span class='checkcross'>&#10003;</span>" : "<span class='checkcross'>&#10007;</span>") + "</td>";
				}
			}
			txt = txt + "</tr>";
		}
	}
	txt = txt + "</tbody></table>";
	$("div#stageSettingsTable").html(txt);
	stageCount(getStageList());
}

function getStageList() {
	var arr = [];
	$(".stageselect.selected").each(function(i) {
		arr.push({mode: convertStageCode($(this).attr("data-mode")), stage: convertStageCode($(this).attr("data-stage"))});
	});
	return arr;
}

function randomizeStages(amount) {
	var i = 0, p = 0;
	var fulllist = getStageList();
	var remaininglist = fulllist.slice(0);
	var possiblelist = [];
	var chosenlist = [];
	var checks = { stages: {count: 0, last: "none"}, modes: {count: 0, last: "none"} };
	
	var allowdupe = $("input#chk-allowstagedupe").is(':checked');
	var repeatifneeded = $("input#chk-allowstagerepeat").is(':checked');
	var rotatestages = $("input#chk-rotatestages").is(':checked');
	var rotatemodes = $("input#chk-rotatemodes").is(':checked');
	
	// use old behaviour if allowing repeated duplicates or not rotating stages/modes
	if (allowdupe === true || !(rotatestages === true || rotatemodes === true)) {
		for (i = 0; i < amount; i++) {
			if (remaininglist.length < 1) {
				if (repeatifneeded === true) { remaininglist = fulllist.slice(0); }
				else { break; }
			}
			var RNG = randMinMax(0, remaininglist.length-1);
			chosenlist.push(remaininglist.slice(RNG, (RNG+1))[0]);
			if (allowdupe === false) { remaininglist.splice(RNG, 1); }
		}
		return chosenlist;
	}
	// rotate stages and/or modes
	else {
		//get the stages and modes and how many different ones there are at the moment
		for (i = 0; i < remaininglist.length; i++) {
			if (rotatestages === true) {
				if (checks.stages[remaininglist[i].stage] === undefined) {
					checks.stages[remaininglist[i].stage] = true;
					checks.stages.count++;
				}
			}
			if (rotatemodes === true) {
				if (checks.modes[remaininglist[i].mode] === undefined) {
					checks.modes[remaininglist[i].mode] = true;
					checks.modes.count++;
				}
			}
		}
		
		for (i = 0; i < amount; i++) {
			if (remaininglist.length < 1) {
				if (repeatifneeded === true) { remaininglist = fulllist.slice(0); }
				else { break; }
			}
			possiblelist = [];
			
			//set up checks.stages
			if (rotatestages === true && checks.stages.count < 1) {
				for (p = 0; p < remaininglist.length; p++) {
					if (checks.stages[remaininglist[p].stage] === false) {
						checks.stages[remaininglist[p].stage] = true;
						checks.stages.count++;
					}
				}
			}
			//set up checks.modes
			if (rotatemodes === true && checks.modes.count < 1) {
				for (p = 0; p < remaininglist.length; p++) {
					if (checks.modes[remaininglist[p].mode] === false) {
						checks.modes[remaininglist[p].mode] = true;
						checks.modes.count++;
					}
				}
			}
			
			//make list of allowed stages
			//checks.stages example: {"Kelp Dome": true, "Walleye Warehouse": false }
			//when a map gets chosen (for chosenlist), it gets set to *false* until all maps are *false* -> only maps that are currently *true* are allowed
			for (p = 0; p < remaininglist.length; p++) {
				if (rotatestages === false || (checks.stages.count === 1 && checks.stages[remaininglist[p].stage] === true) || (checks.stages[remaininglist[p].stage] === true && checks.stages.last !== remaininglist[p].stage)) {
					if (rotatemodes === false || (checks.modes.count === 1 && checks.modes[remaininglist[p].mode] === true) || (checks.modes[remaininglist[p].mode] === true && checks.modes.last !== remaininglist[p].mode)) {
						possiblelist.push(remaininglist[p]);
					}
				}
			}
			
			//no combo met all requirements, ignore mode
			if (possiblelist.length === 0) {
				for (p = 0; p < remaininglist.length; p++) {
					if (rotatestages === false || (checks.stages.count === 1 && checks.stages[remaininglist[p].stage] === true) || (checks.stages[remaininglist[p].stage] === true && checks.stages.last !== remaininglist[p].stage)) {
						possiblelist.push(remaininglist[p]);
					}
				}
			}
			
			//pick random option from possiblelist, add to chosenlist, set the stage to false in checks.stages, for rotation
			var RNG = randMinMax(0, possiblelist.length-1);
			if (rotatestages === true) {
				checks.stages.last = possiblelist[RNG].stage;
				checks.stages[possiblelist[RNG].stage] = false;
				checks.stages.count--;
			}
			if (rotatemodes === true) {
				checks.modes.last = possiblelist[RNG].mode;
				checks.modes[possiblelist[RNG].mode] = false;
				checks.modes.count--;
			}
			chosenlist.push(possiblelist.slice(RNG, (RNG+1))[0]);
			
			//remove the chosen map from the list of remaining maps
			for (r = 0; r < remaininglist.length; r++) {
				if (remaininglist[r] === chosenlist[chosenlist.length-1]) {
					remaininglist.splice(r, 1);
					break;
				}
			}
		}
	}
	return chosenlist;
}

function stageCount(list) {
	var counts = {stages: {total: 0}, modes: {total: 0}};
	for (var i = 0; i < list.length; i++) {
		if (counts.stages[list[i].stage] === undefined) {
			counts.stages[list[i].stage] = 1;
			counts.stages.total++;
		}
		else { counts.stages[list[i].stage] += 1; }
		
		if (counts.modes[list[i].mode] === undefined) {
			counts.modes[list[i].mode] = 1;
			counts.modes.total++;
		}
		else { counts.modes[list[i].mode] += 1; }
	}
	$("#stagecounts").html("Unique stages: <b>" + counts.stages.total + "</b><br />Unique modes: <b>" + counts.modes.total + "</b><br />Total combinations: <b>" + list.length + "</b>");
	return counts;
}

function stageBox(stage) {
	if ($("input#chk-textonly").is(':checked')) {
		return "<span class='stage text clickable'><span class='modename'>" + stage.mode + "</span> - <span class='stagename'>" + stage.stage.replace(/'/g, "&#39;") + "</span></span>";
	}
	else {
		return "<div class='stage fancy clickable'><span class='stagepic " + stage.stage.toLowerCase().replace(/[^a-z]/g, "") + "'><span class='uncheckstage'>Uncheck this<br />stage+mode</span></span><span class='modename'>" + stage.mode + "</span><br /><span class='stagename'>" + stage.stage.replace(/'/g, "&#39;") + "</span></div>";
	}
}

function weaponBox(wpn, player) {
	if ($("input#chk-textonly").is(':checked')) {
		return (player ? "<span class='playername'>" + player.replace(/</g, "&lt;").replace(/>/g, "&gt;") + ": </span>" : "") + wpn.name + (($("input#chk-showsubspecial").is(':checked')) ? " (" + wpn.sub + "/" + wpn.special + ")" : "");
	}
	else {
		var txt = "";
		txt = txt + "<div class='weapon fancy'><span class='weaponpic " + wpn.pic + "'></span>";
		txt = txt + "<div class='PlrWpnContainer'>" + (player ? "<div class='playername'>" + player.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</div><div class='weaponname'>" + wpn.name + "</div>" : "<span class='weaponname mid'>" + wpn.name + "</span>") + "</div>";
		if ($("input#chk-showsubspecial").is(':checked')) {
			txt = txt + "<div class='SubSpcPicContainer'><span class='subpic " + wpn.sub.toLowerCase().replace(/ /g, "-") + "'></span><br />";
			txt = txt + "<span class='specialpic " + ((wpn.special.toLowerCase() == "bomb rush") ? wpn.sub.split(" ")[0].toLowerCase() + "-" : "") + wpn.special.toLowerCase().replace(/ /g, "-") + "'></span></div>";
			txt = txt + "<div class='SubSpcContainer'><span class='weaponsub'>" + wpn.sub + "</span><br /><span class='weaponspecial'>" + wpn.special + "</span></div>";
		}
		txt = txt + "</div><div class='clear'></div>";
		
		return txt;
	}
}

function makeWeaponTable(list) {
	var i = 0, w = 0;
	var listnotempty = false;
	if (list && list.length > 0) { listnotempty = true; }
	var txt = "<table id='weaponTable'><thead><tr><th></th><th>Weapon</th><th>Sub</th><th>Special</th><th>Notes</th></tr></thead><tbody>";
	for (w = 0; w < weapons.length; w++) {
		var note = "";
		if (weapons[w].amiibo === true) { note = "(amiibo Challenge)"; }
		else if (weapons[w].story === true) { note = "(Story Mode)"; }
		else if (weapons[w].released === false) { note = "(Unreleased)"; }
		
		
		if (listnotempty) {
			var matched = false;
			for (i = 0; i < list.length; i++) {
				if (weapons[w].name === list[i]) {
					list.splice(i, 1);
					matched = true;
					break;
				}
			}
			if (matched === true) { txt = txt + "<tr class='selected' data-type='" + weapons[w].type + "' data-octoshot='" + ((weapons[w].name === "Octoshot Replica") ? "true" : "false") + "' data-story='" + weapons[w].story + "' data-amiibo='" + weapons[w].amiibo + "'><td class='checkcross'></td><td>" + weapons[w].name + "</td><td>" + weapons[w].sub + "</td><td>" + weapons[w].special + "</td><td>" + note + "</td></tr>"; }
			else { txt = txt + "<tr data-type='" + weapons[w].type + "' data-octoshot='" + ((weapons[w].name === "Octoshot Replica") ? "true" : "false") + "' data-story='" + weapons[w].story + "' data-amiibo='" + weapons[w].amiibo + "'><td class='checkcross'></td><td>" + weapons[w].name + "</td><td>" + weapons[w].sub + "</td><td>" + weapons[w].special + "</td><td>" + note + "</td></tr>"; }
		}
		else { txt = txt + "<tr" + ((weapons[w].released !== false) ? " class='selected'" : "") + " data-type='" + weapons[w].type + "' data-octoshot='" + ((weapons[w].name === "Octoshot Replica") ? "true" : "false") + "' data-story='" + weapons[w].story + "' data-amiibo='" + weapons[w].amiibo + "'><td class='checkcross'></td><td>" + weapons[w].name + "</td><td>" + weapons[w].sub + "</td><td>" + weapons[w].special + "</td><td>" + note + "</td></tr>"; }
		
	}
	txt = txt + "</tbody></table>";
	$("div#weaponSettingsTable").html(txt);
	if (!$("input#chk-allowoctoshot").is(':checked')) { $("#weaponTable tr[data-octoshot='true']").addClass("locked"); }
	if (!$("input#chk-allowstoryweapons").is(':checked')) { $("#weaponTable tr[data-story='true']").addClass("locked"); }
	if (!$("input#chk-allowamiiboweapons").is(':checked')) { $("#weaponTable tr[data-amiibo='true']").addClass("locked"); }
	weaponCount();
}

function getWeaponNames(includeLocked) {
	var arr = [];
	var i = 0;
	$("#weaponTable tr.selected").each(function(i) {
		if (!$(this).hasClass("locked") || includeLocked === true) {
			arr.push($(this).children("td").eq(1).text());
		}
	});
	return arr;
}

function getWeaponInfo(list) {
	var arr = [];
	var obj = {};
	var i = 0;
	for (i = 0; i < list.length; i++) {
		obj[list[i]] = true;
	}
	for (i = 0; i < weapons.length; i++) {
		if (obj[weapons[i].name] === true) { arr.push(weapons[i]); }
	}
	return arr;
}

function weaponCount() {
	var c = $("#weaponTable tr.selected:not(.locked)").length;
	$(".weaponcounts").html("Selected weapons: " + c);
	return c;
}

function getPlayerNames() {
	var a = Number($("select#dd-team1").val()), b = Number($("select#dd-team2").val()), playernames;
	
	if ($("input#txt-playernames").val() !== "") { playernames = $("input#txt-playernames").val().split(",").filter(function(val) {return val.trim().length > 0}); }
	else { playernames = []; }
	
	var i = 0, L = playernames.length;
	if (L < (a+b)) {
		for (i = (L+1); i <= (a+b); i++) {
			playernames.push("Player " + i);
		}
	}
	
	return playernames;
}

function randomizeArray(arr, limit) {
	if (limit === undefined) { limit = 0; }
	var L = limit, temparr = arr;
	if (limit === 0 || arr.length < limit) { L = arr.length; }
	arr = [];
	for (i = 0; i < L; i++) {
		var RNG = randMinMax(0, temparr.length-1);
		arr.push(temparr.splice(RNG, 1)[0]);
	}
	return arr;
}

function freePick() {
	return { name: "Any Weapon", pic: "any-weapon", type: "free", price: 9999999, level: 50, sub: "Any Sub", special: "Any Special", depletion: "Any", released: "29/05/2015", story: false, amiibo: false, clone: false, rangerank: 999 };
}

function randomizeWeapons(playernames, wpnlist) {
	var a = Number($("select#dd-team1").val()), b = Number($("select#dd-team2").val()), teamnames;
	
	if ($("input#txt-teamnames").val() !== "") { teamnames = $("input#txt-teamnames").val().split(",").filter(function(val) {return val.trim().length > 0}); }
	else { teamnames = []; }
	
	var teams = [ {name: "Team 1", players: []}, {name: "Team 2", players: []}];
	if (teamnames.length > 0) { teams[0].name = teamnames.splice(0,1)[0].trim(); } //set team 1's name, if there's names
	if (b === 0) { teams.splice(1,1); } //remove team 2 if it has 0 players
	else if (teamnames.length > 0) { teams[1].name = teamnames.splice(0,1)[0].trim(); } //if team 2 wasn't removed, set its name, if there's names
	
	var teamsdone = false;
	var i = 1, p = 0;
	while (!teamsdone) {
		if (i <= a) {
			teams[0].players.push({ name: playernames.splice(0,1)[0].trim(), weapon: {} });
		}
		else if (i <= (a + b)) {
			teams[1].players.push({ name: playernames.splice(0,1)[0].trim(), weapon: {} });
		}
		else { teamsdone = true; }
		i++;
		
	}
	
	var enemydupe = $("input#chk-allowenemydupe").is(':checked');
	var allydupe = $("input#chk-allowallydupe").is(':checked');
	
	var remaininglist = wpnlist.slice(0);
	var mirrorlist = []; //add any picked weapon to this list and at the end take the first X from the list for mirroring
	var fp = [0,0]; //(fp means freepicks) fp[0] = team 1, fp[1] = team 2
	
	for (i = 0; i < teams.length; i++) {
		if (i > 0 && enemydupe === true) { remaininglist = wpnlist.slice(0); }
		for (p = 0; p < teams[i].players.length; p++) {
			var freepickRNG = randMinMax(1, 10000);
			var freepickRange = Math.round(Number($("#txt-freepick").val())*100);
			if (freepickRNG <= freepickRange) {
				//console.log(freepickRNG + " IS between 1-" + freepickRange);
				teams[i].players[p].weapon = freePick();
				mirrorlist.push(teams[i].players[p].weapon);
				fp[i] += 1;
			}
			else {
				//console.log(freepickRNG + " is NOT between 1-" + freepickRange);
				var RNG = randMinMax(0, remaininglist.length-1);
				teams[i].players[p].weapon = remaininglist.slice(RNG, (RNG+1))[0];
				mirrorlist.push(teams[i].players[p].weapon);
				if (enemydupe === false || allydupe === false) { remaininglist.splice(RNG, 1); }
				//console.log(p + " " + teams[i].players[p].name + ": " + teams[i].players[p].weapon.name + " (" + remaininglist.length + " weapons left)");
			}
		}
	}
	//no need to check for >0, because if they're both 0 they're equal and if only one of them is 0, the total is above 0
	if (fp[0] !== fp[1] && teams[1] !== undefined && $("input#chk-equalfreepicks").is(':checked')) {
		var remainingplayers = [];
		var t = 0;
		if (fp[1] < fp[0]) { t = 1; }
		if (fp[t] !== teams[t].players.length) { //if the number of free picks on team "t" is equal to the number of players on the team, they already all have free picks - don't bother
			for (p = 0; p < teams[t].players.length; p++) {
				if (teams[t].players[p].weapon.name !== "Any Weapon") { remainingplayers.push(p); }
			}
			var x = (Math.max(fp[0],fp[1]) - Math.min(fp[0],fp[1])); //how many free picks need to be added to the team with fewer free picks
			for (i = 0; i < Math.min(x, (teams[t].players.length - fp[t])); i++) { //the second bit in Math.min(): players on the team - free picks on that team
				var RNG = randMinMax(0, remainingplayers.length-1);
				var p = remainingplayers.splice(RNG, 1);
				teams[t].players[p].weapon = freePick();
				var y = (t === 1 ? (teams[0].players.length + Number(p)) : p); //location in the mirrorlist of the weapon replaced by a freepick; replace with a freepick in mirrorlist to match
				mirrorlist[y] = freePick();
			}
		}
	}
	
	if ($("input#chk-mirrorweapons").is(':checked')) {
		for (i = 0; i < Math.max(a,b); i++) {
			if (i < a) { teams[0].players[i].weapon = mirrorlist[i]; }
			if (i < b) { teams[1].players[i].weapon = mirrorlist[i]; }
		}
	}
	else if ($("input#chk-balanceteams").is(':checked') && (a+b) === 8) {
		mirrorlist.sort(function(A,B) {
			if (A.rangerank < B.rangerank) { return -1;}
			else if (A.rangerank > B.rangerank) { return 1;}
			else { return 0; }
		});
		var sets = [{seeds: randomizeArray([0,3,4,7]), assignTo: randMinMax(0,1)}];
		sets.push({seeds: randomizeArray([1,2,5,6]), assignTo: (sets[0].assignTo === 0 ? 1 : 0)});
		
		for (var s = 0; s < sets.length; s++) {
			var seedsL = sets[s].seeds.length;
			for (i = 0; i < seedsL; i++) {
				teams[sets[s].assignTo].players[i].weapon = mirrorlist[sets[s].seeds[i]];
			}
		}
	}
	
	/*for (i = 0; i < mirrorlist.length; i++) { console.log(i + ". " + mirrorlist[i].name + " (" + mirrorlist[i].rangerank + ")"); }
	console.log("-----");*/
	return teams;
}

function randomizeAll() {
	//resets resulthistory - keep same as at the very top
	resulthistory = {combined: true, textonly: false, includeteamnames: true, includeplayernames: true, stages: [], weapons: [], uploaded: {}};
	
	//check if enough stages
	var enoughStages = true;
	if (Number($("#txt-stagesets").val()) > 0) {
		enoughStages = getStageList().length > 0;
	}
	//check if enough weapons
	var enoughWeapons = false;
	var requiredWeapons = 0;
	if (Number($("#txt-weaponsets").val()) > 0) {
		var enemydupe = $("input#chk-allowenemydupe").is(':checked');
		var allydupe = $("input#chk-allowallydupe").is(':checked');
		var mirrorweapons = $("input#chk-mirrorweapons").is(':checked');
		var a = Number($("select#dd-team1").val()), b = Number($("select#dd-team2").val());
		
		if (allydupe && enemydupe) { requiredWeapons = 1; }
		else if (enemydupe || mirrorweapons) { requiredWeapons = Math.max(a,b); }
		else { requiredWeapons = a + b; }
	}
	if (weaponCount() >= requiredWeapons) { enoughWeapons = true; }
	
	//display a warning if not enough stages/weapons
	if (!enoughStages || !enoughWeapons) {
		var txt = "<span class='warning'>";
		if (!enoughStages) { txt = txt + "Please select at least 1 stage.<br />"; }
		if (!enoughWeapons) { txt = txt + "Please select at least " + requiredWeapons + " weapon" + ((requiredWeapons === 1) ? "" : "s") + "."; }
		$("div#result").html(txt + "</span>");
	}
	else { //start randomizing if enough stages and weapons
		var i = 0;
		var txt = "";
		var stages = randomizeStages(Number($("#txt-stagesets").val()));
		var weaponresults = [];
		var originalplayernames = getPlayerNames();
		var playernames = originalplayernames.slice(0);
		if ($("#chk-randomizeteams").is(':checked')) { playernames = randomizeArray(originalplayernames.slice(0)); }
		
		var wpnlist = getWeaponInfo(getWeaponNames(false));
		for (i = 0; i < Number($("#txt-weaponsets").val()); i++) {
			if (!($("#chk-keeprandomizedteams").is(':checked')) && $("#chk-randomizeteams").is(':checked')) {
				playernames = randomizeArray(playernames);
			}
			weaponresults.push(randomizeWeapons(playernames.slice(0), wpnlist));
		}
		
		resulthistory.includeteamnames = $("#chk-includeteamnames").is(':checked');
		resulthistory.includeplayernames = $("#chk-includeplayernames").is(':checked');
		resulthistory.showsubspecial = $("input#chk-showsubspecial").is(':checked');
		
		if ($("#chk-combinesets").is(':checked') && !($("#chk-combinesets").prop("disabled"))) {
			resulthistory.combined = true;
			if ($("#chk-textonly").is(':checked')) {
				resulthistory.textonly = true;
				txt = txt + "<div class='textonly'>";
				for (i = 0; i < stages.length; i++) {
					var teams = weaponresults[i];
					resulthistory.stages[i] = stages[i];
					resulthistory.weapons[i] = weaponresults[i];
					txt = txt + stageBox(stages[i]) + "<br /><br />";
					for (t = 0; t < teams.length; t++) {
						if ($("#chk-includeteamnames").is(':checked')) { txt = txt + "<span class='teamname'>" + teams[t].name.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</span><br />"; }
						for (p = 0; p < teams[t].players.length; p++) {
							if ($("#chk-includeplayernames").is(':checked')) { txt = txt + weaponBox(teams[t].players[p].weapon, teams[t].players[p].name); }
							else { txt = txt + weaponBox(teams[t].players[p].weapon); }
							txt = txt + "<br />";
						}
						txt = txt + "<br />";
					}
				}
				txt = txt + "</div>";
			}
			else {
				resulthistory.textonly = false;
				for (i = 0; i < stages.length; i++) {
					txt = txt + stageBox(stages[i]);
					if (imgur.enabled === true) {
						txt = txt + "<span class='imgur' data-imgur='combine:" + i + "'></span><br />";
					}
					var teams = weaponresults[i];
					resulthistory.stages[i] = stages[i];
					resulthistory.weapons[i] = weaponresults[i];
					txt = txt + "<div class='weaponscontainer'>";
					for (t = 0; t < teams.length; t++) {
						txt = txt + "<div class='team" + (!($("input#chk-showsubspecial").is(':checked')) ? " small" : "") + "'>";
						if ($("#chk-includeteamnames").is(':checked')) { txt = txt + "<div class='teamname'>" + teams[t].name.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</div>"; }
						for (p = 0; p < teams[t].players.length; p++) {
							if ($("#chk-includeplayernames").is(':checked')) { txt = txt + weaponBox(teams[t].players[p].weapon, teams[t].players[p].name); }
							else { txt = txt + weaponBox(teams[t].players[p].weapon); }
						}
						txt = txt + "</div>";
					}
					txt = txt + "</div>"
				}
			}
		}
		else {
			resulthistory.combined = false;
			if ($("#chk-textonly").is(':checked')) {
				resulthistory.textonly = true;
				txt = txt + "<div class='textonly'>";
				for (i = 0; i < stages.length; i++) {
					txt = txt + stageBox(stages[i]) + "<br />";
					resulthistory.stages[i] = stages[i];
				}
				txt = txt + "<br />";
				for (i = 0; i < weaponresults.length; i++) {
					var teams = weaponresults[i];
					resulthistory.weapons[i] = weaponresults[i];
	
					for (t = 0; t < teams.length; t++) {
						if ($("#chk-includeteamnames").is(':checked')) { txt = txt + "<span class='teamname'>" + teams[t].name.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</span><br />"; }
						for (p = 0; p < teams[t].players.length; p++) {
							if ($("#chk-includeplayernames").is(':checked')) { txt = txt + weaponBox(teams[t].players[p].weapon, teams[t].players[p].name); }
							else { txt = txt + weaponBox(teams[t].players[p].weapon); }
							txt = txt + "<br />";
						}
					}
					txt = txt + "<br />";
				}
				txt = txt + "</div>";
			}
			else {
				resulthistory.textonly = false;
				for (i = 0; i < stages.length; i++) {
					txt = txt + stageBox(stages[i]);
					resulthistory.stages[i] = stages[i];
				}
				for (i = 0; i < weaponresults.length; i++) {
					var teams = weaponresults[i];
					resulthistory.weapons[i] = weaponresults[i];
					
					if (i > 0) { txt = txt + "<br />"; } //.weaponcontainer has display:inline-block, so without <br>, they get put beside eachother if team 2 has 0 players
					txt = txt + "<div class='weaponscontainer'>";
					for (t = 0; t < teams.length; t++) {
						txt = txt + "<div class='team" + (!($("input#chk-showsubspecial").is(':checked')) ? " small" : "") + "'>";
						if ($("#chk-includeteamnames").is(':checked')) { txt = txt + "<div class='teamname'>" + teams[t].name.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</div>"; }
						for (p = 0; p < teams[t].players.length; p++) {
							if ($("#chk-includeplayernames").is(':checked')) { txt = txt + weaponBox(teams[t].players[p].weapon, teams[t].players[p].name); }
							else { txt = txt + weaponBox(teams[t].players[p].weapon); }
						}
						txt = txt + "</div>";
					}
					txt = txt + "</div>";
				}
			}
		}
		$("div#result").html(txt);
	}
}

function saveLoadSettings(action) {
	if (action === "save" && allowsave === true) {
		settings.stages = getStageList();
		settings.weapons = getWeaponNames(true);
		for (key in settings.input) {
			var k = key.split("-");
			if (k[0] === "txt") {
				settings.input[key] = $("#" + key).val();
			}
			else if (k[0] === "chk") {
				settings.input[key] = $("#" + key).is(':checked');
			}
			else if (k[0] === "dd") {
				settings.input[key] = $("#" + key).prop("selectedIndex");
			}
		}
		localStorage.nkSPLATOONRANDOMIZER = JSON.stringify(settings);
	}
	else if (action == "load") {
		if (localStorage.nkSPLATOONRANDOMIZER) {
			var i = 0, k;
			var tempsettings = JSON.parse(localStorage.nkSPLATOONRANDOMIZER);
			if (tempsettings.version === undefined || settings.version !== tempsettings.version) { tempsettings.version = settings.version; }
			for (key in settings.input) {
				if (tempsettings.input[key] === undefined) { tempsettings.input[key] = settings.input[key]; }
			}
			settings = tempsettings;
			for (key in settings.input) {
				k = key.split("-");
				if (k[0] === "txt") {
					$("#" + key).val(settings.input[key]);
				}
				else if (k[0] === "chk") {
					$("#" + key).prop("checked", settings.input[key]);
				}
				else if (k[0] === "dd") {
					$("#" + key).prop("selectedIndex", settings.input[key]);
				}
			}
			$("#chk-savesettings").prop("checked", true);
			makeStageTable(settings.stages);
			makeWeaponTable(settings.weapons);
			saveLoadSettings("save");
		}
		else {
			makeStageTable();
			makeWeaponTable();
		}
	}
	else if (action == "delete") {
		localStorage.removeItem("nkSPLATOONRANDOMIZER");
	}
}

function imgurSettings() {
	var imgurparam = gup("imgur");
	if (imgurparam.toLowerCase() === "disable") {
		//console.log("delete saved imgur pass");
		localStorage.removeItem("nkSPLATOONRANDOMIZER_IMGUR");
	}
	else if (imgurparam !== "") {
		//console.log("change + save imgur pass to: " + imgurparam);
		imgur.pass = imgurparam;
		imgur.enabled = true;
		localStorage.nkSPLATOONRANDOMIZER_IMGUR = JSON.stringify(imgur);
	}
	else if (localStorage.nkSPLATOONRANDOMIZER_IMGUR) {
		//console.log("load previously saved data");
		imgur = JSON.parse(localStorage.nkSPLATOONRANDOMIZER_IMGUR);
	}
	
	$("#chk-imgur").prop("checked", imgur.enabled);
	
	if (imgur.pass !== "") {
		$("#imgurSettings").removeClass("hidden");
	}
}

function imgurGetError(code) {
	var errors = {
		400: "Error 400: A required parameter is missing<br />OR a parameter has an incorrect value<br />OR the image is corrupt<br />OR the image does not meet the format requirements.<br /><br />This error can mean anything apparently!",
		401: "Error 401: The request requires user authentication.<br />You have no reason to see this error.. unless you're playing \"Error Go\" and you're trying to catch them all..<br />Let Nkitten know you caught a 401!",
		403: "Error 403: Forbidden.<br />Maybe you reached the daily upload limit.. or something really weird went wrong and you should tell Nkitten what you did to see this message.",
		404: "Error 404: Resource does not exist.<br />Not sure why you're seeing this error, but you found it! Congratulations! Your prize is that you don't get your image uploaded.. yay?",
		429: "Error 429: Upload limit reached,<br />you'll have to try again later.",
		500: "Error 500: Imgur is so broken right now that they returned 500 as their status code! Whoa!<br />You'll have to try again later."
	};
	if (errors[code] === undefined) {
		return  "Unknown error: " + code;
	}
	return errors[code];
}

function imgurError(msg) {
	$("#imgurresults").addClass("hidden");
	
	$("#imgurerror #imgurerrormessage").html(msg);
	$("#imgurerror").removeClass("hidden  animated").width(); // reading width() forces reflow
	$("#imgurerror").addClass("animated");
}

function imgurSuccess(url) {
	$("#imgurerror").addClass("hidden");
	
	$("#txt-imgur").val(url);
	$("#imgurresults").removeClass("hidden  animated").width(); // reading width() forces reflow
	$("#imgurresults").addClass("animated");
}

function imgurCreate(str, credits) {
	var tryupload = false;
	if (resulthistory.uploaded[str] !== undefined) {
		if (resulthistory.uploaded[str] === "working") {
			imgurError("Image is being created.. please have patience!");
		}
		else if (resulthistory.uploaded[str].status === 200) {
			imgurSuccess(resulthistory.uploaded[str].data.link);
		}
		else {
			tryupload = true;
		}
	}
	else {
		tryupload = true;
	}
	if (tryupload === true) {
		if (str.slice(0,8) === "combine:") {
			var i = str.slice(8);
			
			//{ stage: resulthistory.stages[i], teams: resulthistory.weapons[i] }
			var postdata = { type: "combine", imgurpass: imgur.pass, credits: credits, includeteamnames: resulthistory.includeteamnames, includeplayernames: resulthistory.includeplayernames, showsubspecial: resulthistory.showsubspecial, stage: resulthistory.stages[i], teams: resulthistory.weapons[i] };
			//console.log(JSON.stringify(postdata));
			
			resulthistory.uploaded[str] = "working";
			
			$.post( "../res/imgur/image_imgur.php", { randomresults: JSON.stringify(postdata) }, function( data ) {
				var response = JSON.parse(data);
				if (response.type === "ImgurResponse") {
					var d = response.data.imagedata;
					if (d.status === 200) {
						imgurSuccess(d.data.link);
					}
					else {
						imgurError(imgurGetError(d.status));
					}
					//save response so you don't need to keep making this post request for duplicate info (if it failed then it'll actually try again when you click the button again)
					resulthistory.uploaded[str] = d;
				}
				else if (response.type === "CustomError") {
					delete resulthistory.uploaded[str];
					imgurError(response.data.msg);
				}
				else {
					delete resulthistory.uploaded[str];
					imgurError("I'll be completely honest.. I have no idea what went wrong! Beep Boop!");
				}
			});
		}
		else {
			imgurError("Invalid code: \"" + str + "\"");
		}
	}
}

$(function()
{
	$(document.body).on("click", ".showhidesettings, .showhideweapons", function() {
		$(this).next().toggleClass("hidden");
		if ($(this).next().hasClass("hidden")) { $(this).children(".settingsplusminus").text("+"); }
		else { $(this).children(".settingsplusminus").text("-"); }
	});
	
	$(document.body).on("click", "button#btn-randomize", function() {
		randomizeAll();
	});
	
	$(document.body).on("click", "button#btn-stagestostring", function() {
		var txt = "";
		var list = getStageList();
		for (var i = 0; i < list.length; i++) {
			txt = txt + convertStageCode(list[i].mode);
			txt = txt + convertStageCode(list[i].stage);
		}
		$("input#txt-stagestring").val(txt);
	});
	$(document.body).on("click", "button#btn-stringtostages", function() {
		var str = $("input#txt-stagestring").val();
		var arr = [];
		var m, s;
		for (var i = 0; i < str.length; i = i + 4) {
			m = convertStageCode(str.slice(i,i+2));
			s = convertStageCode(str.slice(i+2,i+4));
			
			if (m !== undefined && s !== undefined) { arr.push({mode: m, stage: s}); }
		}
		makeStageTable(arr);
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
	});
	$(document.body).on("click", "button#btn-copystagestring", function() {
		document.getElementById("txt-stagestring").select();
		document.execCommand("copy");
	});
	
	$(document.body).on("click", "button#btn-imgur", function() {
		document.getElementById("txt-imgur").select();
		document.execCommand("copy");
	});
	
	$(document.body).on("change", "input, select", function() {
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
		else if (this.id == "chk-savesettings") { saveLoadSettings("delete"); }
	});
	
	$(document.body).on("change", "#txt-stagesets, #txt-weaponsets", function() {
		if ($(this).val() < 0) {
			$(this).val(0);
		}
		else if ($(this).val() > 99) {
			$(this).val(99);
		}
		if (($("#txt-stagesets").val() == $("#txt-weaponsets").val()) && (Number($("#txt-stagesets").val()) > 0)) {
			$("#chk-combinesets").prop("disabled", false);
			$("label[for='chk-combinesets']").removeClass("strike");
		}
		else {
			$("#chk-combinesets").prop("disabled", true);
			$("label[for='chk-combinesets']").addClass("strike");
		}
		
	});	
	
	$(document.body).on("change", "#chk-allowstagedupe", function() {
		if ($(this).is(':checked')) {
			$("#chk-allowstagerepeat, #chk-rotatestages, #chk-rotatemodes").prop("disabled", true);
			$("label[for='chk-allowstagerepeat'], label[for='chk-rotatestages'], label[for='chk-rotatemodes']").addClass("strike");
		}
		else {
			$("#chk-allowstagerepeat, #chk-rotatestages, #chk-rotatemodes").prop("disabled", false);
			$("label[for='chk-allowstagerepeat'], label[for='chk-rotatestages'], label[for='chk-rotatemodes']").removeClass("strike");
		}
	});
	
	$(document.body).on("change", "#chk-includeteamnames", function() {
		if ($(this).is(':checked')) { $("#txt-teamnames").prop("disabled", false); }
		else { $("#txt-teamnames").prop("disabled", true); }
	});
	
	$(document.body).on("change", "#chk-includeplayernames", function() {
		if ($(this).is(':checked')) {
			$("#txt-playernames").prop("disabled", false);
			$("#chk-randomizeteams").prop("disabled", false);
			$("label[for='chk-randomizeteams']").removeClass("strike");
			if ($("#chk-randomizeteams").is(':checked')) {
				$("#chk-keeprandomizedteams").prop("disabled", false);
				$("label[for='chk-keeprandomizedteams']").removeClass("strike");
			}
			else {
				$("#chk-keeprandomizedteams").prop("disabled", true);
				$("label[for='chk-keeprandomizedteams']").addClass("strike");
			}
		}
		else {
			$("#txt-playernames").prop("disabled", true);
			$("#chk-randomizeteams, #chk-keeprandomizedteams").prop("disabled", true);
			$("label[for='chk-randomizeteams'], label[for='chk-keeprandomizedteams']").addClass("strike");
		}
		
	});
	
	$(document.body).on("change", "#chk-randomizeteams", function() {
		if ($(this).is(':checked')) {
			$("#chk-keeprandomizedteams").prop("disabled", false);
			$("label[for='chk-keeprandomizedteams']").removeClass("strike");
		}
		else {
			$("#chk-keeprandomizedteams").prop("disabled", true);
			$("label[for='chk-keeprandomizedteams']").addClass("strike");
		}
	});
	
	$(document.body).on("change", "#chk-allowenemydupe", function() {
		if ($(this).is(':checked')) {
			$("#chk-allowallydupe").prop("disabled", false);
			$("label[for='chk-allowallydupe']").removeClass("strike");
		}
		else {
			$("#chk-allowallydupe").prop("disabled", true);
			$("label[for='chk-allowallydupe']").addClass("strike");
		}
	});
	
	$(document.body).on("click", "td.stageselect", function() {
		if ($(this).hasClass("selected")) {
			$(this).removeClass("selected").children(".checkcross").html("&#10007;");
		}
		else {
			$(this).addClass("selected").children(".checkcross").html("&#10003;");
		}
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
		stageCount(getStageList());
	});
	
	
	$(document.body).on("mouseenter", ".stageselectall, .stageselectnone", function() {
		$("td.stageselect, td.stagecell, th.modecell").addClass("rowhover colhover");
	});
	$(document.body).on("mouseleave", ".stageselectall, .stageselectnone", function() {
		$("td.stageselect, td.stagecell, th.modecell").removeClass("rowhover colhover");
	});
	$(document.body).on("mouseenter", "th.modecell", function() {
		$("td[data-mode='" + $(this).attr("data-mode") + "'], th[data-mode='" + $(this).attr("data-mode") + "']").addClass("colhover");
	});
	$(document.body).on("mouseleave", "th.modecell", function() {
		$("td[data-mode='" + $(this).attr("data-mode") + "'], th[data-mode='" + $(this).attr("data-mode") + "']").removeClass("colhover");
	});
	$(document.body).on("mouseenter", "td.stagecell", function() {
		$("td[data-stage='" + $(this).attr("data-stage") + "']").addClass("rowhover");
	});
	$(document.body).on("mouseleave", "td.stagecell", function() {
		$("td[data-stage='" + $(this).attr("data-stage") + "']").removeClass("rowhover");
	});
	$(document.body).on("mouseenter", "td.stageselect", function() {
		$("td[data-stage='" + $(this).attr("data-stage") + "']").addClass("rowhover");
		$("td[data-mode='" + $(this).attr("data-mode") + "'], th[data-mode='" + $(this).attr("data-mode") + "']").addClass("colhover");
	});
	$(document.body).on("mouseleave", "td.stageselect", function() {
		$("td[data-stage='" + $(this).attr("data-stage") + "']").removeClass("rowhover");
		$("td[data-mode='" + $(this).attr("data-mode") + "'], th[data-mode='" + $(this).attr("data-mode") + "']").removeClass("colhover");
	});	
	
	
	$(document.body).on("click", ".stageselectall", function() {
		$("td.stageselect").addClass("selected").children(".checkcross").html("&#10003;");
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
		stageCount(getStageList());
	});
	$(document.body).on("click", ".stageselectnone", function() {
		$("td.stageselect").removeClass("selected").children(".checkcross").html("&#10007;");
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
		stageCount(getStageList());
	});
	$(document.body).on("click", ".rowselectall", function() {
		$("td[data-stage='" + $(this).attr("data-stage") + "'].stageselect").addClass("selected").children(".checkcross").html("&#10003;");
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
		stageCount(getStageList());
	});
	$(document.body).on("click", ".rowselectnone", function() {
		$("td[data-stage='" + $(this).attr("data-stage") + "'].stageselect").removeClass("selected").children(".checkcross").html("&#10007;");
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
		stageCount(getStageList());
	});
	$(document.body).on("click", ".colselectall", function() {
		$("td[data-mode='" + $(this).attr("data-mode") + "'].stageselect").addClass("selected").children(".checkcross").html("&#10003;");
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
		stageCount(getStageList());
	});
	$(document.body).on("click", ".colselectnone", function() {
		$("td[data-mode='" + $(this).attr("data-mode") + "'].stageselect").removeClass("selected").children(".checkcross").html("&#10007;");
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
		stageCount(getStageList());
	});
	
	$(document.body).on("click", "#weaponTable tbody tr", function() {
		if ($(this).hasClass("selected")) { $(this).removeClass("selected"); }
		else { $(this).addClass("selected"); }
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
		weaponCount();
	});
	
	$(document.body).on("change", "#chk-allowoctoshot", function() {
		if ($(this).is(':checked')) { $("#weaponTable tr[data-octoshot='true']").removeClass("locked"); }
		else { $("#weaponTable tr[data-octoshot='true']").addClass("locked"); }
		weaponCount();
	});
	$(document.body).on("change", "#chk-allowstoryweapons", function() {
		if ($(this).is(':checked')) { $("#weaponTable tr[data-story='true']").removeClass("locked"); }
		else { $("#weaponTable tr[data-story='true']").addClass("locked"); }
		weaponCount();
	});
	$(document.body).on("change", "#chk-allowamiiboweapons", function() {
		if ($(this).is(':checked')) { $("#weaponTable tr[data-amiibo='true']").removeClass("locked"); }
		else { $("#weaponTable tr[data-amiibo='true']").addClass("locked"); }
		weaponCount();
	});
	
	$(document.body).on("change", "#txt-freepick", function() {
		if ($(this).val() < 0) {
			$(this).val(0);
		}
		else if ($(this).val() > 100) {
			$(this).val(100);
		}
	});
	
	$(document.body).on("click", ".weaponselect", function() {
		if ($(this).attr("data-off") === "all") { $("#weaponTable tbody tr").removeClass("selected"); }
		else if ($(this).attr("data-on") === "all") { $("#weaponTable tbody tr").addClass("selected"); }
		else {
			var i = 0;
			if ($(this).attr("data-off") !== undefined) {
				var typesOff = $(this).attr("data-off").split(",");
				for (i = 0; i < typesOff.length; i++) {
					$("#weaponTable tbody tr[data-type='" + typesOff[i].trim() + "']").removeClass("selected");
				}
			}
			if ($(this).attr("data-on") !== undefined) {
				var typesOn = $(this).attr("data-on").split(",");
				for (i = 0; i < typesOn.length; i++) {
					$("#weaponTable tbody tr[data-type='" + typesOn[i].trim() + "']").addClass("selected");
				}
			}
		}
		
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
		weaponCount();
	});
	$(document.body).on("click", ".showhideweaponsBottom", function() {
		$(".showhideweapons").click();
	});
	
	$(document.body).on("click", ".stage.clickable", function() {
		var m = convertStageCode($(this).children(".modename").text());
		var s = convertStageCode($(this).children(".stagename").text());
		$("td[data-mode='" + m + "'][data-stage='" + s + "'].stageselect").removeClass("selected").children(".checkcross").html("&#10007;");
		$(this).removeClass("clickable");
		if ($("input#chk-savesettings").is(':checked')) { saveLoadSettings("save"); }
	});
	
	$(document.body).on("change", "#chk-otherversionlink", function() {
		if ($(this).is(':checked')) { $(".otherversionlink").removeClass("hidden"); }
		else { $(".otherversionlink").addClass("hidden"); }
	});
	
	$(document.body).on("change", "#chk-imgur", function() {
		imgur.enabled = $("#chk-imgur").is(':checked');
		localStorage.nkSPLATOONRANDOMIZER_IMGUR = JSON.stringify(imgur);
	});
	
	
	/* $(document.body).on("click", ".imgur", function() {
		// I'll leave completely tearing out all the imgur stuff for a possible day in the future where I completely rewrite the code, but for now, I'll just make sure this function is never called
		// imgurCreate($(this).attr("data-imgur"), false);
	}); */
	
	$(document.body).on("click", ".hideimgurresults", function() {
		$("#imgurresults, #imgurerror").addClass("hidden");
	});
	
	setupStageCodes();
	saveLoadSettings("load");
	allowsave = false;
	$("#txt-stagesets, #txt-weaponsets, #chk-allowstagedupe, #chk-includeteamnames, #chk-includeplayernames, #chk-allowenemydupe, #chk-otherversionlink").change();
	allowsave = true;
	
	imgurSettings();	
	
	$("div#version").html("Version " + settings.version + " (<a href='../../splatoon/random/changelog'>changelog</a>)");
});