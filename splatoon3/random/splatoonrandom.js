/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*  SPLATOON RANDOMIZER BY NKITTEN  */
/*                                  */
/*      GET THE HECK AWAY           */
/*           FROM MY BAD CODE!      */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//Splat3 notes: there's a bunch of ["feststages" / "shifty"] stuff, I don't have the will or energy to remove it all (only to possibly have to re-add it later for tricolor), I just tried to hide it on the page by wrapping it in "#shiftyjunktohide"

let allowsave = true;
const modes = stagesmodes.modes;
const stages = stagesmodes.stages;
const feststages = stagesmodes.stages_splatfest;
stages.sort(function(a,b) {
	if (a.name < b.name) { return -1;}
	else if (a.name > b.name) { return 1;}
	else { return 0; }
});
const weapons = weaponlist.weapons;
let settings = {
	"version": "2.0",
	"stages": [],
	"feststages": [],
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
		//"chk-allowoctoshot": false,
		"chk-allowstoryweapons": false,
		//"chk-allowamiiboweapons": false,
		"chk-allowenemydupe": true,
		"chk-allowallydupe": false,
		"chk-mirrorweapons": false,
		"txt-freepick": "0.00",
		"chk-equalfreepicks": true,
		"chk-showsubspecial": true
	}
};
const stageConversionCodes = {"xx": "Shifty Station", "Shifty Station": "xx"};

function setupStageCodes() {
	for (let i in modes) {
		stageConversionCodes[modes[i].name] = modes[i].id;
		stageConversionCodes[modes[i].id] = modes[i].name;
	}
	for (let i in stages) {
		stageConversionCodes[stages[i].name] = stages[i].id;
		stageConversionCodes[stages[i].id] = stages[i].name;
	}
	// since Tricolor Turf War maps are just regular stages, this will overwrite regular stages (eg. [MakoMart = mk] becomes [MakoMart = 05]) - this never caused issues (actually, it mucked up the shareable stage codes), so this conversion PROBABLY only used IDs to get stage names (not the other way around), but keep this in mind if implementing tricolor later
	/* for (let i in feststages) {
		stageConversionCodes[feststages[i].name] = feststages[i].id;
		stageConversionCodes[feststages[i].id] = feststages[i].name;
	} */
}

function randMinMax(min,max) {
	return Math.floor((Math.random()*((max+1)-min))+min);
}

function convertStageCode(code) { //conversion codes used to be in this function, moved the codes to "stagesmodes.js" when updating for splatoon 2 and have a new function build an object out of those ids instead - kept this function because it's called 20 times
	return stageConversionCodes[code];
}

function makeStageTable(list) {
	let listnotempty = false;
	if (list && list.length > 0) { listnotempty = true; }
	let txt = "<table id='stageTable'><thead><tr><th class='big'>(<span class='stageselectall'>all</span> / <span class='stageselectnone'>none</span>)</th>";
	for (let m in modes) {
		txt = txt + "<th class='modecell' data-mode='" + convertStageCode(modes[m].name) + "'>" + modes[m].name + "<br /><span class='allnone'>(<span class='colselectall' data-mode='" + convertStageCode(modes[m].name) + "'>all</span> / <span class='colselectnone' data-mode='" + convertStageCode(modes[m].name) + "'>none</span>)</span></th>";
	}
	txt = txt + "</tr></thead><tbody>";
	for (let s in stages) {
		if (stages[s].released !== false) {
			txt = txt + "<tr><td class='stagecell' data-stage='" + convertStageCode(stages[s].name) + "'><span class='allnone'>(<span class='rowselectall' data-stage='" + convertStageCode(stages[s].name) + "'>all</span> / <span class='rowselectnone' data-stage='" + convertStageCode(stages[s].name) + "'>none</span>)</span><span class='stagecellname'>" + stages[s].name + "</span></td>";
			for (let m in modes) {
				if (listnotempty) {
					let matched = false;
					for (let i in list) {
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
	
	document.getElementById("stageSettingsTable").innerHTML = txt;
	stageCount(getStageList());
}
function makeShiftyTable(list) {
	let listnotempty = false;
	if (list && list.length > 0) { listnotempty = true; }
	let txt = "<table id='shiftyTable'><thead><tr><td>Shifty Station</td><td></td></tr></thead><tbody>";
	for (let s in feststages) {
		let matched = false;
		if (listnotempty) {
			for (let i in list.length) {
				if (feststages[s].name === list[i].stage) {
					list.splice(i, 1);
					matched = true;
					break;
				}
			}
		}
		txt += "<tr " + (matched === true ? "class='selected'" : "") + " data-stage='" + feststages[s].id + "'><td>" + feststages[s].name + "</td><td class='checkcross'></td></tr>";
	}
	txt += "</tbody></table>";
	
	document.getElementById("shiftySettingsTable").innerHTML = txt;
	shiftyCount();
}

function getStageList() {
	let arr = [];
	document.querySelectorAll(".stageselect.selected").forEach((stage) => {
		arr.push({mode: convertStageCode(stage.getAttribute("data-mode")), stage: convertStageCode(stage.getAttribute("data-stage")), shifty: false});
	});
	return arr;
}

function getShiftyList() {
	let arr = [];
	let i = 0;
	document.querySelectorAll("#shiftyTable tr.selected").forEach((stage) => {
		arr.push({mode: "Turf War", stage: stage.children[0].textContent, shifty: true});
	});
	return arr;
}

function randomizeStages(amount) {
	let fulllist = getStageList();
	let shiftylist = getShiftyList();
	fulllist = fulllist.concat(shiftylist);
	let remaininglist = fulllist.slice(0);
	let possiblelist = [];
	let chosenlist = [];
	let checks = { stages: {count: 0, last: "none"}, modes: {count: 0, last: "none"} };
	
	let allowdupe = document.getElementById("chk-allowstagedupe").checked;
	let repeatifneeded = document.getElementById("chk-allowstagerepeat").checked;
	let rotatestages = document.getElementById("chk-rotatestages").checked;
	let rotatemodes = document.getElementById("chk-rotatemodes").checked;
	
	// use old behaviour if allowing repeated duplicates or not rotating stages/modes
	if (allowdupe === true || !(rotatestages === true || rotatemodes === true)) {
		for (let i = 0; i < amount; i++) {
			if (remaininglist.length < 1) {
				if (repeatifneeded === true) { remaininglist = fulllist.slice(0); }
				else { break; }
			}
			let RNG = randMinMax(0, remaininglist.length-1);
			chosenlist.push(remaininglist.slice(RNG, (RNG+1))[0]);
			if (allowdupe === false) { remaininglist.splice(RNG, 1); }
		}
		return chosenlist;
	}
	// rotate stages and/or modes
	else {
		//get the stages and modes and how many different ones there are at the moment
		for (let i in remaininglist) {
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
		
		for (let i = 0; i < amount; i++) {
			if (remaininglist.length < 1) {
				if (repeatifneeded === true) { remaininglist = fulllist.slice(0); }
				else { break; }
			}
			possiblelist = [];
			
			//set up checks.stages
			if (rotatestages === true && checks.stages.count < 1) {
				for (let p in remaininglist) {
					if (checks.stages[remaininglist[p].stage] === false) {
						checks.stages[remaininglist[p].stage] = true;
						checks.stages.count++;
					}
				}
			}
			//set up checks.modes
			if (rotatemodes === true && checks.modes.count < 1) {
				for (let p in remaininglist) {
					if (checks.modes[remaininglist[p].mode] === false) {
						checks.modes[remaininglist[p].mode] = true;
						checks.modes.count++;
					}
				}
			}
			
			//make list of allowed stages
			//checks.stages example: {"Kelp Dome": true, "Walleye Warehouse": false }
			//when a map gets chosen (for chosenlist), it gets set to *false* until all maps are *false* -> only maps that are currently *true* are allowed
			for (let p in remaininglist) {
				if (rotatestages === false || (checks.stages.count === 1 && checks.stages[remaininglist[p].stage] === true) || (checks.stages[remaininglist[p].stage] === true && checks.stages.last !== remaininglist[p].stage)) {
					if (rotatemodes === false || (checks.modes.count === 1 && checks.modes[remaininglist[p].mode] === true) || (checks.modes[remaininglist[p].mode] === true && checks.modes.last !== remaininglist[p].mode)) {
						possiblelist.push(remaininglist[p]);
					}
				}
			}
			
			//no combo met all requirements, ignore mode
			if (possiblelist.length === 0) {
				for (let p in remaininglist) {
					if (rotatestages === false || (checks.stages.count === 1 && checks.stages[remaininglist[p].stage] === true) || (checks.stages[remaininglist[p].stage] === true && checks.stages.last !== remaininglist[p].stage)) {
						possiblelist.push(remaininglist[p]);
					}
				}
			}
			
			//pick random option from possiblelist, add to chosenlist, set the stage to false in checks.stages, for rotation
			let RNG = randMinMax(0, possiblelist.length-1);
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
			for (let r in remaininglist) {
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
	let counts = {stages: {total: 0}, modes: {total: 0}};
	for (let i in list) {
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
	document.getElementById("stagecounts").innerHTML = "Unique stages: <b>" + counts.stages.total + "</b><br />Unique modes: <b>" + counts.modes.total + "</b><br />Total combinations: <b>" + list.length + "</b>";
	return counts;
}

function shiftyCount() {
	const c = document.querySelectorAll("#shiftyTable tr.selected").length;
	document.getElementById("shiftycounts").innerHTML = "Selected Shifty Stations: " + c;
	return c;
}

function stageBox(stage) {
	if (document.getElementById("chk-textonly").checked) {
		return "<span class='stage text clickable'><span class='modename'>" + (stage.shifty === true ? "Shifty Station" : stage.mode) + "</span> - <span class='stagename'>" + stage.stage.replace(/'/g, "&#39;") + "</span></span>";
	}
	else {
		return "<div class='stage fancy clickable'><span class='stagepic " + stage.stage.toLowerCase().replace(/[^a-z]/g, "") + "'></span><span class='modename'>" + (stage.shifty === true ? "Shifty Station" : stage.mode) + "</span><br /><span class='stagename'>" + stage.stage.replace(/'/g, "&#39;") + "</span></div>";
	}
}

function weaponBox(wpn, player) {
	if (document.getElementById("chk-textonly").checked) {
		return (player ? "<span class='playername'>" + player.replace(/</g, "&lt;").replace(/>/g, "&gt;") + ": </span>" : "") + wpn.name + ((document.getElementById("chk-showsubspecial").checked) ? " (" + wpn.sub + "/" + wpn.special + ")" : "");
	}
	else {
		let txt = "";
		txt = txt + "<div class='weapon fancy'><span class='weaponpic " + wpn.pic + "'></span>";
		txt = txt + "<div class='PlrWpnContainer'>" + (player ? "<div class='playername'>" + player.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</div><div class='weaponname'>" + wpn.name + "</div>" : "<span class='weaponname mid'>" + wpn.name + "</span>") + "</div>";
		if (document.getElementById("chk-showsubspecial").checked) {
			txt = txt + "<div class='SubSpcPicContainer'><span class='subpic " + wpn.sub.toLowerCase().replace(/ /g, "-") + "'></span><br />";
			txt = txt + "<span class='specialpic " + ((wpn.special.toLowerCase() == "bomb rush") ? wpn.sub.split(" ")[0].toLowerCase() + "-" : "") + wpn.special.toLowerCase().replaceAll(/[ \.]/g, "-") + "'></span></div>";
			txt = txt + "<div class='SubSpcContainer'><span class='weaponsub'>" + wpn.sub + "</span><span class='weaponspecial" + ((wpn.special.toLowerCase().slice(-13) == "bomb launcher") ? " twoline" : "") + "'>" + wpn.special + "</span></div>";
		}
		txt = txt + "</div><div class='clear'></div>";
		
		return txt;
	}
}

function makeWeaponTable(list) {
	let listnotempty = false;
	if (list && list.length > 0) { listnotempty = true; }
	let txt = "<table id='weaponTable'><thead><tr><th></th><th>Weapon</th><th>Sub</th><th>Special</th><th>Notes</th></tr></thead><tbody>";
	for (let w in weapons) {
		let note = "";
		if (weapons[w].amiibo === true) { note = "(amiibo Challenge)"; }
		else if (weapons[w].name === "Hero Shot Replica") { note = "(Story Mode)"; } //hardcoded quick hack to have the other story=true weapons note they're from Side Order, without needing to touch the terrible code below
		else if (weapons[w].name === "Plastic-Bottle Shot Replica") { note = "(Splatoon Raiders)"; } //another quick hack
		else if (weapons[w].story === true) { note = "(Side Order)"; }
		else if (weapons[w].released === false) { note = "(Unreleased)"; }
		
		
		if (listnotempty) {
			let matched = false;
			for (let i in list) {
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
	document.getElementById("weaponSettingsTable").innerHTML = txt;
	if (!document.getElementById("chk-allowoctoshot")?.checked) { document.querySelectorAll("#weaponTable tr[data-octoshot='true']").forEach(tr => tr.classList.add("locked")); }
	if (!document.getElementById("chk-allowstoryweapons")?.checked) { document.querySelectorAll("#weaponTable tr[data-story='true']").forEach(tr => tr.classList.add("locked")); }
	if (!document.getElementById("chk-allowamiiboweapons")?.checked) { document.querySelectorAll("#weaponTable tr[data-amiibo='true']").forEach(tr => tr.classList.add("locked")); }
	weaponCount();
}

function getWeaponNames(includeLocked = false) {
	let arr = [];
	document.querySelectorAll("#weaponTable tr.selected").forEach((tr) => {
		if (!tr.classList.contains("locked") || includeLocked === true) {
			arr.push(tr.children[1].textContent);
		}
	});
	return arr;
}

function getWeaponInfo(list) {
	let arr = [];
	let obj = {};
	for (let i in list) {
		obj[list[i]] = true;
	}
	for (let i in weapons) {
		if (obj[weapons[i].name] === true) { arr.push(weapons[i]); }
	}
	return arr;
}

function weaponCount() {
	const c = document.querySelectorAll("#weaponTable tr.selected:not(.locked)").length;
	document.querySelectorAll(".weaponcounts").forEach((ele) => ele.innerHTML = "Selected weapons: " + c);
	return c;
}

function getPlayerNames() {
	const a = Number(document.getElementById("dd-team1").value);
	const b = Number(document.getElementById("dd-team2").value);
	const playernames = document.getElementById("txt-playernames").value.split(",").map(val => val.trim()).filter(val => val.length > 0);
	
	const L = playernames.length;
	if (L < (a+b)) {
		for (let i = (L+1); i <= (a+b); i++) {
			playernames.push("Player " + i);
		}
	}
	
	return playernames;
}

function randomizeArray(arr = [], limit = 0) {
	if (limit === 0 || arr.length < limit) { limit = arr.length; }
	for (let i = 0; i < limit; i++) {
		const RNG = randMinMax(0, arr.length-1-i);
		arr.push(arr.splice(RNG, 1)[0]);
		// console.log(i + "/" + limit, "---", "RNG: 0-" + (arr.length-1-i) + " => " + RNG + " [" + arr.at(-1) + "]");
	}
	return arr.slice(-1 * limit);
}

function freePick() {
	return { name: "Any Weapon", pic: "any-weapon", type: "free", price: 9999999, level: 50, sub: "Any Sub", special: "Any Special", depletion: "Any", released: "29/05/2015", story: false, amiibo: false, clone: false, rangerank: 999 };
}

function randomizeWeapons(playernames, wpnlist) {
	const a = Number(document.getElementById("dd-team1").value);
	const b = Number(document.getElementById("dd-team2").value);
	const teamnames = document.getElementById("txt-teamnames").value.split(",").map(val => val.trim()).filter(val => val.length > 0);
	
	let teams = [{name: "Team 1", players: []}, {name: "Team 2", players: []}];
	if (teamnames.length > 0) { teams[0].name = teamnames.splice(0,1)[0]; } //set team 1's name, if there's names
	if (b === 0) { teams.splice(1,1); } //remove team 2 if it has 0 players
	else if (teamnames.length > 0) { teams[1].name = teamnames.splice(0,1)[0]; } //if team 2 wasn't removed, set its name, if there's names
	
	let i = 0;
	const playercount = a + b;
	while (i < playercount) {
		teams[(i < a ? 0 : 1)].players.push({ name: playernames.splice(0,1)[0].trim(), weapon: {} });
		i++;
	}
	
	const enemydupe = document.getElementById("chk-allowenemydupe").checked;
	const allydupe = document.getElementById("chk-allowallydupe").checked;
	
	let remaininglist = wpnlist.slice(0);
	const mirrorlist = []; //add any picked weapon to this list and at the end take the first X from the list for mirroring
	const fp = [0,0]; //(fp means freepicks) fp[0] = team 1, fp[1] = team 2
	
	const equalfreepicks = document.getElementById("chk-equalfreepicks").checked;
	for (let t in teams) {
		if (t > 0 && enemydupe === true) { remaininglist = wpnlist.slice(0); }
		for (let p in teams[t].players) {
			const freepickRNG = randMinMax(1, 10000);
			const freepickRange = Math.round(Number(document.getElementById("txt-freepick").value) * (equalfreepicks ? 50 : 100));
			if (freepickRNG <= freepickRange) {
				// console.log(freepickRNG + " IS between 1-" + freepickRange);
				teams[t].players[p].weapon = freePick();
				mirrorlist.push(teams[t].players[p].weapon);
				fp[t] += 1;
			}
			else {
				// console.log(freepickRNG + " is NOT between 1-" + freepickRange);
				const RNG = randMinMax(0, remaininglist.length-1);
				teams[t].players[p].weapon = remaininglist.slice(RNG, (RNG+1))[0];
				mirrorlist.push(teams[t].players[p].weapon);
				if (enemydupe === false || allydupe === false) { remaininglist.splice(RNG, 1); }
				// console.log(p + " " + teams[t].players[p].name + ": " + teams[t].players[p].weapon.name + " (" + remaininglist.length + " weapons left)");
			}
		}
	}
	//no need to check for >0, because if they're both 0 they're equal and if only one of them is 0, the total is above 0
	if (fp[0] !== fp[1] && teams[1] !== undefined && equalfreepicks) {
		const remainingplayers = []; //gets filled with the indices of which players on the team do not have a free pick yet
		let t = 0;
		if (fp[1] < fp[0]) { t = 1; }
		if (fp[t] !== teams[t].players.length) { //if the number of free picks on team "t" is equal to the number of players on the team, they already all have free picks - don't bother
			for (let p in teams[t].players) {
				if (teams[t].players[p].weapon.name !== "Any Weapon") { remainingplayers.push(p); }
			}
			const freepicksNeeded = (Math.max(fp[0],fp[1]) - Math.min(fp[0],fp[1])); //how many free picks need to be added to the team with fewer free picks
			for (let i = 0; i < Math.min(freepicksNeeded, (teams[t].players.length - fp[t])); i++) { //the second bit in Math.min(): (players on the team) - (free picks on that team)
				const RNG = randMinMax(0, remainingplayers.length-1);
				const p = remainingplayers.splice(RNG, 1);
				teams[t].players[p].weapon = freePick();
				const y = (t === 1 ? (teams[0].players.length + Number(p)) : p); //location in the mirrorlist of the weapon replaced by a freepick; replace with a freepick in mirrorlist to match
				mirrorlist[y] = freePick();
			}
		}
	}
	
	if (document.getElementById("chk-mirrorweapons").checked) {
		for (let i = 0; i < Math.max(a,b); i++) {
			if (i < a) { teams[0].players[i].weapon = mirrorlist[i]; }
			if (i < b) { teams[1].players[i].weapon = mirrorlist[i]; }
		}
	}
	
	/*for (i = 0; i < mirrorlist.length; i++) { console.log(i + ". " + mirrorlist[i].name + " (" + mirrorlist[i].rangerank + ")"); }
	console.log("-----");*/
	return teams;
}

function randomizeAll() {
	//check if enough stages
	let enoughStages = false;
	if (Number(document.getElementById("txt-stagesets").value) > 0) {
		enoughStages = (getStageList().length + getShiftyList().length) > 0;
	}
	//check if enough weapons
	let enoughWeapons = false;
	let requiredWeapons = 0;
	if (Number(document.getElementById("txt-weaponsets").value) > 0) {
		const enemydupe = document.getElementById("chk-allowenemydupe").checked;
		const allydupe = document.getElementById("chk-allowallydupe").checked;
		const mirrorweapons = document.getElementById("chk-mirrorweapons").checked;
		const a = Number(document.getElementById("dd-team1").value);
		const b = Number(document.getElementById("dd-team2").value);
		
		if (allydupe && enemydupe) { requiredWeapons = 1; }
		else if (enemydupe || mirrorweapons) { requiredWeapons = Math.max(a,b); }
		else { requiredWeapons = a + b; }
	}
	if (weaponCount() >= requiredWeapons) { enoughWeapons = true; }
	
	//display a warning if not enough stages/weapons
	if (!enoughStages || !enoughWeapons) {
		let txt = "<span class='warning'>";
		if (!enoughStages) { txt = txt + "Please select at least 1 stage."; }
		if (!enoughWeapons) { txt = txt + (!enoughStages ? "<br />" : "") + "Please select at least " + requiredWeapons + " weapon" + ((requiredWeapons === 1) ? "" : "s") + "."; }
		document.getElementById("result").innerHTML = txt + "</span>";
		return;
	}
	
	//enough stages and weapons - start randomizing!
	let txt = "";
	const stages = randomizeStages(Number(document.getElementById("txt-stagesets").value));
	const weaponresults = [];
	const originalplayernames = getPlayerNames();
	let playernames = originalplayernames.slice(0);
	if (document.getElementById("chk-randomizeteams").checked) { playernames = randomizeArray(originalplayernames.slice(0)); }
	
	const wpnlist = getWeaponInfo(getWeaponNames(false));
	for (let i = 0; i < Number(document.getElementById("txt-weaponsets").value); i++) {
		if (!document.getElementById("chk-keeprandomizedteams").checked && document.getElementById("chk-randomizeteams").checked) {
			playernames = randomizeArray(playernames);
		}
		weaponresults.push(randomizeWeapons(playernames.slice(0), wpnlist));
	}
	
	const includeteamnames = document.getElementById("chk-includeteamnames").checked;
	const includeplayernames = document.getElementById("chk-includeplayernames").checked;
	const showsubspecial = document.getElementById("chk-showsubspecial").checked;
	const textonly = document.getElementById("chk-textonly").checked;
	
	if (document.getElementById("chk-combinesets").checked && !document.getElementById("chk-combinesets").disabled) {
		if (textonly) { //text only, combine sets
			txt = txt + "<div class='textonly'>";
			for (let i in stages) {
				txt = txt + stageBox(stages[i]) + "<br /><br />";
				
				const teams = weaponresults[i];
				for (let t in teams) {
					if (includeteamnames) { txt = txt + "<span class='teamname'>" + teams[t].name.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</span><br />"; }
					for (let p in teams[t].players) {
						if (includeplayernames) { txt = txt + weaponBox(teams[t].players[p].weapon, teams[t].players[p].name); }
						else { txt = txt + weaponBox(teams[t].players[p].weapon); }
						txt = txt + "<br />";
					}
					txt = txt + "<br />";
				}
			}
			txt = txt + "</div>";
		}
		else { //images (not text only), combine sets
			for (let i in stages) {
				txt = txt + stageBox(stages[i]);

				const teams = weaponresults[i];
				txt = txt + "<div class='weaponscontainer'>";
				for (let t in teams) {
					txt = txt + "<div class='team" + (showsubspecial ? "" : " small") + "'>";
					if (includeteamnames) { txt = txt + "<div class='teamname'>" + teams[t].name.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</div>"; }
					for (let p in teams[t].players) {
						if (includeplayernames) { txt = txt + weaponBox(teams[t].players[p].weapon, teams[t].players[p].name); }
						else { txt = txt + weaponBox(teams[t].players[p].weapon); }
					}
					txt = txt + "</div>";
				}
				txt = txt + "</div>"
			}
		}
	}
	else {
		if (textonly) { //text only, don't combine sets
			txt = txt + "<div class='textonly'>";
			for (let i in stages) {
				txt = txt + stageBox(stages[i]) + "<br />";
			}
			txt = txt + "<br />";
			for (let i in weaponresults) {
				const teams = weaponresults[i];

				for (let t in teams) {
					if (includeteamnames) { txt = txt + "<span class='teamname'>" + teams[t].name.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</span><br />"; }
					for (let p in teams[t].players) {
						if (includeplayernames) { txt = txt + weaponBox(teams[t].players[p].weapon, teams[t].players[p].name); }
						else { txt = txt + weaponBox(teams[t].players[p].weapon); }
						txt = txt + "<br />";
					}
				}
				txt = txt + "<br />";
			}
			txt = txt + "</div>";
		}
		else { //images (not text only), don't combine sets
			for (let i in stages) {
				txt = txt + stageBox(stages[i]);
			}
			for (let i in weaponresults) {
				const teams = weaponresults[i];
				
				if (i > 0) { txt = txt + "<br />"; } //.weaponcontainer has display:inline-block, so without <br>, they get put beside eachother if team 2 has 0 players
				txt = txt + "<div class='weaponscontainer'>";
				for (let t in teams) {
					txt = txt + "<div class='team" + (showsubspecial ? "" : " small") + "'>";
					if (includeteamnames) { txt = txt + "<div class='teamname'>" + teams[t].name.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</div>"; }
					for (let p in teams[t].players) {
						if (includeplayernames) { txt = txt + weaponBox(teams[t].players[p].weapon, teams[t].players[p].name); }
						else { txt = txt + weaponBox(teams[t].players[p].weapon); }
					}
					txt = txt + "</div>";
				}
				txt = txt + "</div>";
			}
		}
	}
	document.getElementById("result").innerHTML = txt;
}

function saveLoadSettings(action) {
	if (action === "save" && allowsave === true) {
		settings.stages = getStageList();
		settings.feststages = getShiftyList();
		settings.weapons = getWeaponNames(true);
		for (let key in settings.input) {
			const k = key.split("-");
			if (k[0] === "txt") {
				settings.input[key] = document.getElementById(key).value;
			}
			else if (k[0] === "chk") {
				settings.input[key] = document.getElementById(key).checked;
			}
			else if (k[0] === "dd") {
				settings.input[key] = document.getElementById(key).selectedIndex;
			}
		}
		localStorage.setItem("splatoon3_random", JSON.stringify(settings));
	}
	else if (action == "load") {
		if (localStorage.getItem("splatoon3_random")) {
			const savedSettings = JSON.parse(localStorage.getItem("splatoon3_random"));
			if (savedSettings.version === undefined || settings.version !== savedSettings.version) { savedSettings.version = settings.version; }
			for (let key in settings.input) {
				if (savedSettings.input[key] === undefined) { savedSettings.input[key] = settings.input[key]; }
			}
			settings = savedSettings;
			for (let key in settings.input) {
				const k = key.split("-");
				if (k[0] === "txt") {
					document.getElementById(key).value = settings.input[key];
				}
				else if (k[0] === "chk") {
					document.getElementById(key).checked = settings.input[key];
				}
				else if (k[0] === "dd") {
					document.getElementById(key).selectedIndex = settings.input[key];
				}
			}
			document.getElementById("chk-savesettings").checked = true;
			makeStageTable(settings.stages);
			makeShiftyTable(settings.feststages);
			makeWeaponTable(settings.weapons);
			saveLoadSettings("save");
		}
		else {
			makeStageTable();
			makeShiftyTable();
			makeWeaponTable();
		}
	}
	else if (action == "delete") {
		localStorage.removeItem("splatoon3_random");
	}
}

document.addEventListener("DOMContentLoaded", function() {
	document.querySelectorAll(".showhidesettings, .showhideshifty, .showhideweapons").forEach(ele => ele.addEventListener("click", function() {
		const isHidden = ele.nextElementSibling.classList.toggle("hidden");
		ele.querySelector(".settingsplusminus").textContent = (isHidden ? "+" : "-");
	}));
	
	document.getElementById("btn-randomize").addEventListener("click", function() {
		randomizeAll();
	});
	
	document.getElementById("btn-stagestostring").addEventListener("click", function() {
		let txt = "";
		const list = getStageList();
		const list2 = getShiftyList();
		for (let i in list) {
			txt = txt + convertStageCode(list[i].mode);
			txt = txt + convertStageCode(list[i].stage);
		}
		for (let i in list2) {
			txt = txt + "xx" + convertStageCode(list2[i].stage);
		}
		document.getElementById("txt-stagestring").value = txt;
	});
	document.getElementById("btn-stringtostages").addEventListener("click", function() {
		const str = document.getElementById("txt-stagestring").value;
		const arr = [], arr2 = [];
		for (let i = 0; i < str.length; i = i + 4) {
			const m = convertStageCode(str.slice(i,i+2));
			const s = convertStageCode(str.slice(i+2,i+4));
			
			if (m !== undefined && s !== undefined) {
				if (m !== "Shifty Station") {
					arr.push({mode: m, stage: s});
				} else {
					arr2.push(convertStageCode(s));
				}
			}
		}
		makeStageTable(arr);
		
		document.querySelectorAll("#shiftyTable tbody tr").forEach(tr => tr.classList.remove("selected"));
		for (let stage of arr2) {
			document.querySelectorAll("#shiftyTable tbody tr[data-stage='" + stage + "'").forEach(tr => tr.classList.add("selected"));
		}
		shiftyCount();
		if (document.getElementById("chk-savesettings").checked) { saveLoadSettings("save"); }
	});
	document.getElementById("btn-copystagestring").addEventListener("click", function() {
		const ele = document.getElementById("txt-stagestring");
		ele.select();
		navigator.clipboard.writeText(ele.value);
	});
	
	document.querySelectorAll("input, select").forEach(ele => ele.addEventListener("change", function() {
		if (document.getElementById("chk-savesettings").checked) { saveLoadSettings("save"); }
		else if (this.id == "chk-savesettings") { saveLoadSettings("delete"); }
	}));
	
	document.querySelectorAll("#txt-stagesets, #txt-weaponsets, #txt-freepick").forEach(ele => ele.addEventListener("change", function() {
		const min = Number(this.getAttribute("min"));
		const max = Number(this.getAttribute("max"));
		const val = Number(this.value);
		
		if (val < min) {
			this.value = min;
		} else if (val > max) {
			this.value = max;
		}
		
		if (this.id === "txt-freepick") return; //following code is only for when changing stagesets/weaponsets
		
		const stagesets = Number(document.getElementById("txt-stagesets").value);
		const weaponsets = Number(document.getElementById("txt-weaponsets").value);
		const equalNumSets = stagesets === weaponsets && stagesets > 0;
		
		document.getElementById("chk-combinesets").disabled = !equalNumSets;
		document.querySelector("label[for='chk-combinesets']").classList.toggle("strike", !equalNumSets);
	}));	
	
	document.getElementById("chk-allowstagedupe").addEventListener("change", function() {
		const isChecked = this.checked;
		document.querySelectorAll("#chk-allowstagerepeat, #chk-rotatestages, #chk-rotatemodes").forEach(ele => ele.disabled = isChecked);
		document.querySelectorAll("label[for='chk-allowstagerepeat'], label[for='chk-rotatestages'], label[for='chk-rotatemodes']").forEach(ele => ele.classList.toggle("strike", isChecked));
	});
	
	document.getElementById("chk-includeteamnames").addEventListener("change", function() {
		document.getElementById("txt-teamnames").disabled = !this.checked;
	});
	
	document.getElementById("chk-includeplayernames").addEventListener("change", function() {
		const includeplayernames = this.checked;
		
		document.getElementById("txt-playernames").disabled = !includeplayernames;
		document.getElementById("chk-randomizeteams").disabled = !includeplayernames;
		document.querySelector("label[for='chk-randomizeteams']").classList.toggle("strike", !includeplayernames);
		
		if (includeplayernames) {
			const randomizeteams = document.getElementById("chk-randomizeteams").checked;
			document.getElementById("chk-keeprandomizedteams").disabled = !randomizeteams;
			document.querySelector("label[for='chk-keeprandomizedteams']").classList.toggle("strike", !randomizeteams);
		}
		else {
			document.getElementById("chk-keeprandomizedteams").disabled = true;
			document.querySelector("label[for='chk-keeprandomizedteams']").classList.add("strike");
		}
	});
	
	document.getElementById("chk-randomizeteams").addEventListener("change", function() {
		const isChecked = this.checked;
		document.getElementById("chk-keeprandomizedteams").disabled = !isChecked;
		document.querySelector("label[for='chk-keeprandomizedteams']").classList.toggle("strike", !isChecked);
	});
	
	document.getElementById("chk-allowenemydupe").addEventListener("change", function() {
		const isChecked = this.checked;
		document.getElementById("chk-allowallydupe").disabled = !isChecked;
		document.querySelector("label[for='chk-allowallydupe']").classList.toggle("strike", !isChecked);
	});
	
	document.getElementById("stageSettingsTable").addEventListener("click", function(evt) { //this is the div wrapping the stage table, as the stage table is dynamically added (perhaps it should already be there and just dynamically have its content added)
		const stageselectCell = evt.target.closest("td.stageselect");
		if (stageselectCell) {
			const isNowSelected = stageselectCell.classList.toggle("selected");
			stageselectCell.querySelector(".checkcross").innerHTML = (isNowSelected ? "&#10003;" : "&#10007;");
		}
		else if (evt.target.matches(".stageselectall")) {
			document.querySelectorAll("td.stageselect").forEach(ele => {
				ele.classList.add("selected");
				ele.querySelector(".checkcross").innerHTML = "&#10003;";
			});
		}
		else if (evt.target.matches(".stageselectnone")) {
			document.querySelectorAll("td.stageselect").forEach(ele => {
				ele.classList.remove("selected");
				ele.querySelector(".checkcross").innerHTML = "&#10007;";
			});
		}
		else if (evt.target.matches(".rowselectall")) {
			document.querySelectorAll("td[data-stage='" + evt.target.getAttribute("data-stage") + "'].stageselect").forEach(ele => {
				ele.classList.add("selected");
				ele.querySelector(".checkcross").innerHTML = "&#10003;";
			});
		}
		else if (evt.target.matches(".rowselectnone")) {
			document.querySelectorAll("td[data-stage='" + evt.target.getAttribute("data-stage") + "'].stageselect").forEach(ele => {
				ele.classList.remove("selected");
				ele.querySelector(".checkcross").innerHTML = "&#10007;";
			});
		}
		else if (evt.target.matches(".colselectall")) {
			document.querySelectorAll("td[data-mode='" + evt.target.getAttribute("data-mode") + "'].stageselect").forEach(ele => {
				ele.classList.add("selected");
				ele.querySelector(".checkcross").innerHTML = "&#10003;";
			});
		}
		else if (evt.target.matches(".colselectnone")) {
			document.querySelectorAll("td[data-mode='" + evt.target.getAttribute("data-mode") + "'].stageselect").forEach(ele => {
				ele.classList.remove("selected");
				ele.querySelector(".checkcross").innerHTML = "&#10007;";
			});
		}
		
		if (document.getElementById("chk-savesettings").checked) { saveLoadSettings("save"); }
		stageCount(getStageList());
	});	
	
	document.getElementById("stageSettingsTable").addEventListener("mouseenter", function(evt) {
		if (evt.target.matches(".stageselectall, .stageselectnone")) {
			this.querySelectorAll("td.stageselect, td.stagecell, th.modecell").forEach(ele => ele.classList.add("rowhover", "colhover"));
		}
		else if (evt.target.matches("th.modecell")) {
			this.querySelectorAll("td[data-mode='" + evt.target.getAttribute("data-mode") + "'], th[data-mode='" + evt.target.getAttribute("data-mode") + "']").forEach(ele => ele.classList.add("colhover"));
		}
		else if (evt.target.matches("td.stagecell")) { //todo: see if I can replace rowhover with tr:hover in CSS or something
			this.querySelectorAll("td[data-stage='" + evt.target.getAttribute("data-stage") + "']").forEach(ele => ele.classList.add("rowhover"));
		}
		else if (evt.target.matches("td.stageselect")) {
			this.querySelectorAll("td[data-stage='" + evt.target.getAttribute("data-stage") + "']").forEach(ele => ele.classList.add("rowhover"));
			this.querySelectorAll("td[data-mode='" + evt.target.getAttribute("data-mode") + "'], th[data-mode='" + evt.target.getAttribute("data-mode") + "']").forEach(ele => ele.classList.add("colhover"));
		}
	}, true); //useCapture = true
	document.getElementById("stageSettingsTable").addEventListener("mouseleave", function(evt) {
		if (evt.target.matches(".stageselectall, .stageselectnone")) {
			this.querySelectorAll("td.stageselect, td.stagecell, th.modecell").forEach(ele => ele.classList.remove("rowhover", "colhover"));
		}
		else if (evt.target.matches("th.modecell")) {
			this.querySelectorAll("td[data-mode='" + evt.target.getAttribute("data-mode") + "'], th[data-mode='" + evt.target.getAttribute("data-mode") + "']").forEach(ele => ele.classList.remove("colhover"));
		}
		else if (evt.target.matches("td.stagecell")) { //todo: see if I can replace rowhover with tr:hover in CSS or something
			this.querySelectorAll("td[data-stage='" + evt.target.getAttribute("data-stage") + "']").forEach(ele => ele.classList.remove("rowhover"));
		}
		else if (evt.target.matches("td.stageselect")) {
			this.querySelectorAll("td[data-stage='" + evt.target.getAttribute("data-stage") + "']").forEach(ele => ele.classList.remove("rowhover"));
			this.querySelectorAll("td[data-mode='" + evt.target.getAttribute("data-mode") + "'], th[data-mode='" + evt.target.getAttribute("data-mode") + "']").forEach(ele => ele.classList.remove("colhover"));
		}
	}, true); //useCapture = true
	
	document.getElementById("shiftySettingsTable").addEventListener("click", function(evt) { //this is the div wrapping the shifty stage table, as the shifty stage table is dynamically added
		const shiftyRow = evt.target.closest("tbody tr");
		if (!shiftyRow) return;
		
		shiftyRow.classList.toggle("selected");
		if (document.getElementById("chk-savesettings").checked) { saveLoadSettings("save"); }
		shiftyCount();
	});
	document.querySelector(".shiftyselectall").addEventListener("click", function() {
		document.querySelectorAll("#shiftyTable tbody tr").forEach(tr => tr.classList.add("selected"));
		if (document.getElementById("chk-savesettings").checked) { saveLoadSettings("save"); }
		shiftyCount();
	});
	document.querySelector(".shiftyselectnone").addEventListener("click", function() {
		document.querySelectorAll("#shiftyTable tbody tr").forEach(tr => tr.classList.remove("selected"));
		if (document.getElementById("chk-savesettings").checked) { saveLoadSettings("save"); }
		shiftyCount();
	});
	
	document.getElementById("weaponSettingsTable").addEventListener("click", function(evt) { //this is the div wrapping the weapon table, as the weapon table is dynamically added
		const weaponRow = evt.target.closest("tbody tr");
		if (!weaponRow) return;
		
		weaponRow.classList.toggle("selected");
		if (document.getElementById("chk-savesettings").checked) { saveLoadSettings("save"); }
		weaponCount();
	});
	
	document.getElementById("chk-allowoctoshot")?.addEventListener("change", function() {
		document.querySelectorAll("#weaponTable tr[data-octoshot='true']").forEach(tr => tr.classList.toggle("locked", !this.checked));
		weaponCount();
	});
	document.getElementById("chk-allowstoryweapons")?.addEventListener("change", function() {
		document.querySelectorAll("#weaponTable tr[data-story='true']").forEach(tr => tr.classList.toggle("locked", !this.checked));
		weaponCount();
	});
	document.getElementById("chk-allowamiiboweapons")?.addEventListener("change", function() {
		document.querySelectorAll("#weaponTable tr[data-amiibo='true']").forEach(tr => tr.classList.toggle("locked", !this.checked));
		weaponCount();
	});
	
	document.getElementById("weaponSettings").addEventListener("click", function(evt) {
		if (evt.target.matches(".weaponselect")) {
			let typesOff = evt.target.getAttribute("data-off");
			let typesOn = evt.target.getAttribute("data-on");
			
			if (typesOff === "all") document.querySelectorAll("#weaponTable tbody tr").forEach(tr => tr.classList.remove("selected"));
			else if (typesOn === "all") document.querySelectorAll("#weaponTable tbody tr").forEach(tr => tr.classList.add("selected"));
			else {
				if (typesOff) {
					typesOff = typesOff.split(",").map(val => val.trim());
					for (let wpnType of typesOff) {
						document.querySelectorAll("#weaponTable tbody tr[data-type='" + wpnType + "']").forEach(tr => tr.classList.remove("selected"));
					}
				}
				if (typesOn) {
					typesOn = typesOn.split(",").map(val => val.trim());
					for (let wpnType of typesOn) {
						document.querySelectorAll("#weaponTable tbody tr[data-type='" + wpnType + "']").forEach(tr => tr.classList.add("selected"));
					}
				}
			}
			
			if (document.getElementById("chk-savesettings").checked) { saveLoadSettings("save"); }
			weaponCount();
		}
	});
	document.querySelector(".showhideweaponsBottom").addEventListener("click", function() {
		document.querySelector(".showhideweapons").dispatchEvent(new Event("click"));
		// document.querySelector(".showhideweapons").click();
	});
	
	document.getElementById("result").addEventListener("click", function(evt) {
		const stagebox = evt.target.closest(".stage.clickable"); //simply by removing ".clickable" from this selector, it becomes toggleable both ways - but would ideally also update the state on other stageboxes with the same stage/mode combo
		if (!stagebox) return;
		
		const mode = convertStageCode(stagebox.querySelector(".modename").textContent);
		const stage = convertStageCode(stagebox.querySelector(".stagename").textContent);
		const isNowSelected = stagebox.classList.toggle("clickable");
		
		if (mode === "xx") {
			document.querySelector("#shiftyTable tbody tr[data-stage='" + stage + "'")?.classList.toggle("selected", isNowSelected);
			shiftyCount();
		} else {
			const stageselectCell = document.querySelector("td[data-mode='" + mode + "'][data-stage='" + stage + "'].stageselect");
			stageselectCell?.classList.toggle("selected", isNowSelected);
			stageselectCell.querySelector(".checkcross").innerHTML = (isNowSelected ? "&#10003;" : "&#10007;");
			stageCount(getStageList());
		}
		if (document.getElementById("chk-savesettings").checked) { saveLoadSettings("save"); }
	});
	
	document.getElementById("chk-otherversionlink").addEventListener("change", function() {
		document.querySelectorAll(".otherversionlink").forEach(ele => ele.classList.toggle("hidden", !this.checked));
	});
	
	setupStageCodes();
	saveLoadSettings("load");
	allowsave = false;
	document.querySelectorAll("#txt-stagesets, #txt-weaponsets, #chk-allowstagedupe, #chk-includeteamnames, #chk-includeplayernames, #chk-allowenemydupe, #chk-otherversionlink").forEach(ele => ele.dispatchEvent(new Event("change")));
	allowsave = true;
	
	/* for (let wpn of weapons) {
		document.getElementById("result").insertAdjacentHTML("beforeend", weaponBox(wpn));
	} */
	
	document.getElementById("version").innerHTML = "Version " + settings.version + " (<a href='../../splatoon/random/changelog'>changelog</a>)";
	document.getElementById("updated").innerHTML = "Last updated (dd/mm/yyyy):<br />Randomizer script: 31/05/2024<br />Stage list: " + stagesmodes.updated.date + ((stagesmodes.updated.note.length > 0) ? " (" + stagesmodes.updated.note.trim() + ")" : "") + "<br />Weapon list: " + weaponlist.updated.date + ((weaponlist.updated.note.length > 0) ? " (" + weaponlist.updated.note.trim() + ")" : "");
});