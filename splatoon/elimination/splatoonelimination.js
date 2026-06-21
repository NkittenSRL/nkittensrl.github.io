const weapons = weaponlist.weapons;
const banhistory = [];
const lasthover = {id: 0, current: false, enableWeaponTooltip: true};
const draftstatus = { currentteam: false, alpha: [-1, -1, -1, -1], bravo: [-1, -1, -1, -1] };
const weaponmap = {};
const settings = {
	"nr-banrandom": 8,
	"chk-enabledraft": true,
	"dd-draftpattern": "snake",
	"chk-draftpattern_swapwhenbothfull": true,
	"chk-draft_onkeydraftweapon": false,
	"chk-draft_onkeyselectteam": true,
	"chk-showbanhistory": true,
	"chk-showstory": true,
	"chk-showreskins": false,
	"chk-mirrorbanreskin": true,
	"chk-mirrorbanscope": true,
	"chk-displaymode_keyboardshortcuts": true,
	"dd-displaymode": "threshold",
	"nr-displaymodethreshold": 30
};
const allowsave = {
	"settings": false,
	"weapons": false
};

function randMinMax(min,max) {
	return Math.floor((Math.random()*((max+1)-min))+min);
}

function startingFunc() {
	const multiban = [ //every array should contain scoped and unscoped chargers with the same kit (and the hero skin for regular splat charger)
		["Splat Charger", "Hero Charger Replica", "Splatterscope"],
		["Kelp Splat Charger", "Kelp Splatterscope"],
		["Bento Splat Charger", "Bento Splatterscope"],
		["E-liter 3K", "E-liter 3K Scope"],
		["Custom E-liter 3K", "Custom E-liter 3K Scope"]
	];
	
	for (let i = 0; i < weapons.length; i++) {
		weapons[i].id = i;
		weapons[i].elimstatus = "available";
		weaponmap[weapons[i].name] = i;
	}
	
	for (let i = 0; i < multiban.length; i++) {
		for (let w = 0; w < multiban[i].length; w++) {
			const arr = multiban[i].slice(0);
			weapons[weaponmap[arr.splice(w, 1)]].scopeclones = arr;
		}
	}
}

function displayWeaponList() {
	let txt = "";
	
	for (let i = 0; i < weapons.length; i++) {
		let extra = "";
		if (weapons[i].story === true) { extra += " story"; }
		if (weapons[i].amiibo === true || weapons[i].name === "Octoshot Replica") { extra += " reskin"; }
		txt += `<span class='weapon ${weapons[i].elimstatus}${extra}' data-id='${weapons[i].id}'><span class='weaponpic ${weapons[i].pic}'></span><span class='weaponname'>${weapons[i].name}</span><span class='weaponsubspecial'>${weapons[i].sub} + ${weapons[i].special}</span></span>`;
	}
	document.getElementById("weapons").innerHTML = txt;
}

function showHoveredInfo(wpn = false) {
	const wpnInfo = document.getElementById("weaponInfo");
	if (wpn === false) { 
		wpnInfo.classList.add("hidden");
		return;
	}
	
	if (typeof wpn === "number") {
		if (lasthover.enableWeaponTooltip !== true) return;
		
		const w = weapons[wpn];
		wpnInfo.innerHTML = `<span><span class="weaponInfo_name">${w.name}</span><br />${w.sub}<br />${w.special}</span>`;
	} else {
		const explainers = {
			"savesettings": "To restore default settings: uncheck this and refresh the page,<br />you'll need to recheck this option after refreshing to save settings again.",
			"saveweapons": "Will remember whether weapons are available, banned, or drafted to a team.<br /><br />To delete saved weapon states: uncheck this and refresh the page,<br />you'll need to recheck this option after refreshing to save weapon states again.",
			"enabledraft": "When enabled, click on a team's box to select/unselect that team.<br />Clicking on a weapon while a team is selected drafts the weapon to that team.",
			"draftpattern": "Conditions for automatically switching teams upon drafting a weapon:<br /><br /><span class='weaponInfo_name'>None:</span> Never switch teams automatically<br /><span class='weaponInfo_name'>Snake:</span> Follows an [A]-[B]-[B]-[A] pattern<br />(if the current team now has more weapons, switch teams)<br /><span class='weaponInfo_name'>Alternate:</span> Switch teams every time a weapon is drafted<br /><span class='weaponInfo_name'>Fill Team:</span> Switch teams if the current team is full"
		};
		wpnInfo.innerHTML = (explainers[wpn] !== undefined ? explainers[wpn] : `Tooltip "<span class="weaponInfo_name">${wpn}</span>" not found...`);
	}
	
	wpnInfo.classList.remove("hidden");
}

function displayDraftedWeapons(team = "all") {
	let teams = ["alpha", "bravo"];
	if (team !== "all") { teams = [team]; }
	
	for (let TEAM of teams) {
		let txt = "";
		for (let i in draftstatus[TEAM]) {
			txt += "<span class='draftedweapon weaponpic " + (draftstatus[TEAM][i] < 0 ? "any-weapon" : weapons[draftstatus[TEAM][i]].pic) + "' data-team='" + TEAM + "' data-draftid='" + i +"'></span>";
		}
		document.querySelector("#" + TEAM + "team .teamweapons").innerHTML = txt;
	}
}

function setDisplayMode(mode) {
	const cList = document.body.classList;
	if (mode === "detailed") {
		cList.add("detailed");
		cList.remove("compact");
		lasthover.enableWeaponTooltip = false;
	} else {
		cList.add("compact");
		cList.remove("detailed");
		lasthover.enableWeaponTooltip = true;
	}
}

function getWeaponList(includeBanned = true, includeUnbanned = true, includeDrafted = true, allowReskin = "auto", allowScope = "auto", includeHidden = false) {
	const arr = [];
	const encountered = {};
	const storyVisible = document.getElementById("chk-showstory").checked;
	const reskinsVisible = document.getElementById("chk-showreskins").checked;
	if (allowReskin === "auto") { allowReskin = !document.getElementById("chk-mirrorbanreskin").checked };
	if (allowScope === "auto") { allowScope = !document.getElementById("chk-mirrorbanscope").checked };
	
	outerloop:
	for (let wpn of weapons) {
		encountered[wpn.name] = true;
		
		if (wpn.story === true && storyVisible === false && includeHidden === false) {
			continue; //skip the rest of the loop for this current weapon, and move on to the next wpn
		}
		else if (wpn.clone !== false){
			if (encountered[wpn.clone] === true && ((reskinsVisible === false && includeHidden === false) || allowReskin === false)) {
				continue; //skip the rest of the loop for this current weapon, and move on to the next wpn
			}
		} else if (wpn.scopeclones !== undefined) {
			for (let scopeclone of wpn.scopeclones) {
				if (encountered[scopeclone] === true && allowScope === false) {
					continue outerloop; //continue at the "outerloop" label (break out of both loops and move on to the next wpn)
				}
			}
		}
		
		// reskins/scopeclones will only get to this point if they're allowed to be in the list, so run the elimstatus checks now
		if (includeBanned === true && wpn.elimstatus === "banned") { arr.push(wpn); }
		else if (includeUnbanned === true && wpn.elimstatus === "available") { arr.push(wpn); }
		else if (includeDrafted === true && (wpn.elimstatus === "alpha" || wpn.elimstatus === "bravo")) { arr.push(wpn); }
	}
	
	return arr;
}

function getWeaponCount() {
	const counts = {
		"available": {"main": 0, "reskin": 0, "scopeclone": 0, "total": 0},
		"banned": {"main": 0, "reskin": 0, "scopeclone": 0, "total": 0},
		"alpha": {"main": 0, "reskin": 0, "scopeclone": 0, "total": 0},
		"bravo": {"main": 0, "reskin": 0, "scopeclone": 0, "total": 0},
		"anydraft": {"main": 0, "reskin": 0, "scopeclone": 0, "total": 0},
		"hidden": {"main": 0, "reskin": 0, "scopeclone": 0, "total": 0}
	};
	const counted = {};
	const storyVisible = document.getElementById("chk-showstory").checked;
	const reskinsVisible = document.getElementById("chk-showreskins").checked;
	
	for (let wpn of weapons) {
		let elimstatus = wpn.elimstatus;
		let category = "main";
		if (wpn.story === true && storyVisible === false) {
			elimstatus = "hidden";
		}
		else if (wpn.clone !== false) {
			if (counted[wpn.clone] === true) {
				category = "reskin";
				if (reskinsVisible === false) { elimstatus = "hidden"; }
			}
		} else if (wpn.scopeclones !== undefined) {
			for (let scopeclone of wpn.scopeclones) {
				if (counted[scopeclone] === true) {
					category = "scopeclone";
					break; //if it finds a weapon that's alread counted in its scopeclones list, you don't need to look at the rest of the scopeclones list
				}
			}
		}
		counted[wpn.name] = true;
		
		counts[elimstatus][category] += 1;
		counts[elimstatus].total += 1;
		if (elimstatus === "alpha" || elimstatus === "bravo") {
			counts.anydraft[category] += 1;
			counts.anydraft.total += 1;
		}
	}
	
	return counts;
}

function displayWeaponCount(counts = getWeaponCount()) {
	//bug: when [Splat Charger & Hero Charger Replica are both banned/drafted AND mirrorbanreskin is UNchecked AND mirrorbanscope is checked] then [Banned weapon count is 1 too high and Remaining 1 too low]
	const includeReskin = !document.getElementById("chk-mirrorbanreskin").checked;
	const includeScope = !document.getElementById("chk-mirrorbanscope").checked;
	
	const remain = counts.available.main + (includeReskin ? counts.available.reskin : 0) + (includeScope ? counts.available.scopeclone : 0);
	const banned = counts.banned.main + (includeReskin ? counts.banned.reskin : 0) + (includeScope ? counts.banned.scopeclone : 0);
	const drafted = counts.anydraft.main + (includeReskin ? counts.anydraft.reskin : 0) + (includeScope ? counts.anydraft.scopeclone : 0);
	
	document.getElementById("weaponcounts").innerHTML = `Remaining weapons: ${remain}<br /><span class="draftcomponent">Drafted weapons: ${drafted}<br /></span>Banned weapons: ${banned}`;
	
	if (document.getElementById("dd-displaymode").value === "threshold") {
		const threshold = Number(document.getElementById("nr-displaymodethreshold").value);
		if (threshold > 0 && (counts.available.total + counts.anydraft.total) <= threshold) {
			setDisplayMode("detailed");
		} else {
			setDisplayMode("compact");
		}
	}
	
	const cList = document.getElementById("noweapons").classList;
	cList.add("hidden");
	if ((counts.available.total + counts.anydraft.total) === 0 && document.body.classList.contains("detailed")) {
		cList.remove("hidden");
	}
	saveWeapons();
}

function displayBanHistory(max = banhistory.length) {
	let txt = "";
	for (let i = (banhistory.length - 1); i >= Math.max((banhistory.length - max), 0); i--) {
		if (txt.length > 0) { txt += "<br />"; }
		let txtW = "";
		for (let w = 0; w < banhistory[i].ids.length; w++) {
			if (w > 0) { txtW += ", "; }
			txtW += weapons[banhistory[i].ids[w]].name;
		}
		txt += "<span class='weaponban " + banhistory[i].type + "'>" + txtW + "</span>";
	}
	document.getElementById("banhistory").innerHTML = txt;
}

function getWeaponClones(id, includeOwnId = false, forceReskin = false, forceScope = false) {
	const ids = [];
	id = Number(id);
	if (includeOwnId) { ids.unshift(id); }
	
	if (weapons[id].clone !== false && (document.getElementById("chk-mirrorbanreskin").checked === true || forceReskin === true)) {
		ids.push(weaponmap[weapons[id].clone]);
	}
	if (weapons[id].scopeclones !== undefined && (document.getElementById("chk-mirrorbanscope").checked === true || forceScope === true)) {
		for (let i in weapons[id].scopeclones) {
			const wpn = weaponmap[weapons[id].scopeclones[i]];
			if (ids.indexOf(wpn) === -1) {ids.push(wpn)}; //push *wpn* if it's not already in *ids* array
		}
	}
	
	return ids;
}

function changeWeaponState(id, state) {
	const states = {"banned": "banned", "ban": "banned", "available": "available", "unban": "available", "alpha": "alpha", "bravo": "bravo"};
	if (states[state] === undefined) { return; }
	
	const wpn = document.querySelector(`.weapon[data-id='${id}']`);
	const wpnpic = document.querySelector(`.weapon[data-id='${id}'] .weaponpic`);
	
	wpn.classList.remove(weapons[id].elimstatus);
	weapons[id].elimstatus = states[state];
	wpn.classList.add(states[state]);
}
function changeWeaponArrayStates(ids, bantype, addToHistory = true) {
	if (ids.length === 0) { return; }
	
	for (i = 0; i < ids.length; i++) {
		if (bantype === "ban") {
			changeWeaponState(ids[i], "ban");
		}
		else if (bantype === "unban") {
			changeWeaponState(ids[i], "unban");
		}
		else {
			changeWeaponState(ids[i], bantype);
		}
	}
	if (addToHistory === true) { banhistory.push({type: bantype, ids: ids}); }
}

function setDraftTeam(team, unselectIfCurrent = true) {
	document.querySelector(".teambox.active")?.classList.remove("active");
	if (team !== undefined) {
		if (team !== draftstatus.currentteam || unselectIfCurrent === false) {
			document.querySelector(".teambox[data-team='" + team + "']").classList.add("active");
			draftstatus.currentteam = team;
			saveWeapons();
			return;
		}
	}
	//only reached if no team was set
	draftstatus.currentteam = false;
	saveWeapons();
}

function teamDraft(team, id, actionOnClear = "unban") {
	if (id !== undefined) {
		if (id < 0) { //if the supplied id is less than 0, clear this team's weapons
			for (let i = 0; i < draftstatus[team].length; i++) {
				if (draftstatus[team][i] >= 0) { //check if the weapon id is at least 0 (negative ids are unknown)
					changeWeaponArrayStates(getWeaponClones(draftstatus[team][i], true), actionOnClear, (actionOnClear === "ban" ? true : false)); //if clearing team without banning the weapons, don't log it in the ban history
				}
			}
			draftstatus[team] = [-1, -1, -1, -1]; //set all weapons on the team to be unknown
			
			//clean up any stray drafted weapons, this should only happen when changing mirrorban checkboxes after having drafted weapons with clones - probably not needed anymore since cleanDraftedWeapons(), but keeping it for safety
			const ids = [];
			document.querySelectorAll(".weapon." + team).forEach(function(ele) {
				ids.push(ele.getAttribute("data-id"));
				
			});
			changeWeaponArrayStates(ids, actionOnClear, false);
		}
		else {
			const x = draftstatus[team].indexOf(-1); //index of the first -1 value (-1 means no weapon has been drafted for that slot yet, so after drafting 1 weapon a team might look like [25,-1,-1,-1])
			if (x !== -1) { draftstatus[team].splice(x,1,id); } //replace the -1 value with the weapon id that got drafted
			else { draftstatus[team].push(id); }
			if (draftstatus[team].length > 4) { //if a team has more than 4 weapons, cut the oldest weapon
				const cut = draftstatus[team].splice(0,1)[0];
				if (cut >= 0) { changeWeaponArrayStates(getWeaponClones(cut, true), "unban", false); } //unbans (undrafts) the weapon that's no longer on the team, without logging it in the ban history
			}
			changeWeaponArrayStates(getWeaponClones(id, true), team, false)
		}
	}
	
	displayDraftedWeapons(team);
	
	const draftpattern = document.getElementById("dd-draftpattern").value;
	const swapwhenbothfull = document.getElementById("chk-draftpattern_swapwhenbothfull").checked;
	const teams = ["alpha", "bravo"];
	const otherTeam = teams[(teams.indexOf(team) + 1) % 2];
	
	let curTeamCount = draftstatus[team].indexOf(-1);
	if (curTeamCount === -1) { curTeamCount = 4; }
	let otherTeamCount = draftstatus[otherTeam].indexOf(-1);
	if (otherTeamCount === -1) { otherTeamCount = 4; }
	
	if (draftpattern === "snake") {
		if (curTeamCount > otherTeamCount || (swapwhenbothfull === true && curTeamCount + otherTeamCount === 8)) {
			setDraftTeam(otherTeam, false);
		}
	}
	if (draftpattern === "fill") {
		if (curTeamCount === 4 && (otherTeamCount < 4 || swapwhenbothfull === true)) {
			setDraftTeam(otherTeam, false);
		}
	}
	if (draftpattern === "alternate") {
		setDraftTeam(otherTeam, false);
	}
}

function cleanDraftedWeapons(team = "all") {
	let teams = ["alpha", "bravo"];
	if (team !== "all") { teams = [team]; }
	
	for (let TEAM of teams) {
		for (let i = draftstatus[TEAM].length - 1; i >= 0; i--) {
			const id = draftstatus[TEAM][i];
			if (id >= 0) {
				if (weapons[id].elimstatus !== TEAM) { //get rid of weapons that are still on the team/teambox, whose elimstatus no longer matches the team
					draftstatus[TEAM].splice(i,1);
					draftstatus[TEAM].push(-1);
				} else { //draft any missing weapon clones based on current mirrorban settings
					changeWeaponArrayStates(getWeaponClones(id, true), TEAM, false);
				}
			}
		}
		displayDraftedWeapons(TEAM);
	}
	
	let selector = ".weapon." + team;
	if (team === "all") { selector = ".weapon.alpha, .weapon.bravo"; }
	document.querySelectorAll(selector).forEach(ele => {
		const id = ele.getAttribute("data-id");
		const TEAM = weapons[id].elimstatus;
		const ids = getWeaponClones(id, true);
		
		let nr = -1;
		for (let x of ids) {
			nr = draftstatus[TEAM].indexOf(x);
			if (nr > -1) { break; }
		}
		
		if (nr < 0) { //clear (unban) weapons that are still considered to be part of the team in the weapons list, but aren't actually on the ream anymore
			changeWeaponArrayStates(ids, "unban", false);
		}
	});
}

function banRandomWeapons(amount = 1, bantype = "ban") {
	const includeBanned = (bantype === "unban" ? true : false); //if unbanning weapons, only choose from list of banned weapons
	const includeUnbanned = !includeBanned; //you want the banned OR the unbanned weapons, so use invert includeBanned
	const remaininglist = getWeaponList(includeBanned, includeUnbanned, false).slice(0);
	
	for (let i = 0; i < amount; i++) {
		if (remaininglist.length <= 0) { break; }
		const RNG = randMinMax(0, remaininglist.length-1); //choose a random index on remaininglist
		const id = remaininglist[RNG].id; //get the weapon's index in the actual weapon list, rather than the index in list of remaining weapons
		const ids = getWeaponClones(id, true);
		
		changeWeaponArrayStates(ids, bantype); //ban chosen weapon (including clones, if applicable)
		
		remaininglist.splice(RNG, 1);
	}
	
	//update ban count and history (search for this sentence when changing stuff below it, and change it whereever you find this piece of code)
	displayWeaponCount();
	displayBanHistory(24);
}

function handleWeaponClick(id) {
	if (weapons[id].elimstatus === "available") {
		if (draftstatus.currentteam !== false) {
			teamDraft(draftstatus.currentteam, id);
		} else {
			changeWeaponArrayStates(getWeaponClones(id, true), "ban");
		}
	} else if (weapons[id].elimstatus === "banned") {
		changeWeaponArrayStates(getWeaponClones(id, true), "unban");
	} else { //else the weapon is drafted - undraft it
		const team = weapons[id].elimstatus;
		const ids = getWeaponClones(id, true);
		
		let nr = -1;
		for (let x of ids) {
			nr = draftstatus[team].indexOf(x);
			if (nr > -1) { break; }
		}
		
		if (nr >= 0) { //you clicked a weapon that's still properly on the team, so cut it from the team
			const cut = draftstatus[team].splice(nr,1)[0];
			if (cut >= 0) { changeWeaponArrayStates(getWeaponClones(cut, true), "unban", false); } //unbans (undrafts) the weapon that's no longer on the team, without logging it in the ban history
			draftstatus[team].push(-1);
			displayDraftedWeapons(team);
		} else { //you clicked a stray drafted weapon (no longer on the team, but never got undrafted), undraft based on current mirrorban settings
			// (shouldn't ever happen anymore, but keeping for safety)
			console.warn("uh-oh! looks like you found a stray drafted weapon!");
			changeWeaponArrayStates(getWeaponClones(id, true), "unban", false);
		}
	}
	
	//update ban count and history (search for this sentence when changing stuff below it, and change it whereever you find this piece of code)
	displayWeaponCount();
	displayBanHistory(24);
}

function saveSettings() {
	if (allowsave.settings !== true || document.getElementById("chk-savesettings").checked === false) return;
	
	for (let id in settings) {
		const ele = document.getElementById(id);
		if (!ele) {
			console.warn(`saveSettings() -> element with id "${id}" not found, skipping`);
			continue;
		}
		
		let val;
		const kind = id.split("-")[0];
		if (kind === "chk") {
			val = ele.checked;
		} else if (kind === "nr") {
			val = Number(ele.value);
		} else {
			val = ele.value;
		}
		settings[id] = val;
	}
	
	localStorage.setItem("splatoon_elim_settings", JSON.stringify(settings));
}

function loadSettings() {
	if (localStorage.getItem("splatoon_elim_settings") === null) return;
	if (localStorage.getItem("splatoon_elim_settings") === "disabled") {
		document.getElementById("chk-savesettings").checked = false;
		return;
	}
	const savedSettings = JSON.parse(localStorage.getItem("splatoon_elim_settings"));
	
	for (let id in savedSettings) {
		if (settings[id] !== undefined) {
			const ele = document.getElementById(id);
			if (!ele) {
				console.warn(`loadSettings() -> element with id "${id}" not found, skipping`);
				continue;
			}
			
			const kind = id.split("-")[0];
			if (kind === "chk") {
				ele.checked = savedSettings[id];
			} else {
				ele.value = savedSettings[id];
			}
			settings[id] = savedSettings[id];
		}
	}
}

function saveWeapons() {
	if (allowsave.weapons !== true || document.getElementById("chk-saveweapons").checked === false) return;
	
	const weaponstates = {};
	for (let wpn of weapons) {
		weaponstates[wpn.name] = wpn.elimstatus;
	}
	localStorage.setItem("splatoon_elim_weapons", JSON.stringify({"draft": draftstatus, "weapons": weaponstates}));
}

function loadWeapons() {
	if (localStorage.getItem("splatoon_elim_weapons") === null) return true;
	if (localStorage.getItem("splatoon_elim_weapons") === "disabled") {
		document.getElementById("chk-saveweapons").checked = false;
		return true;
	}
	
	const savedWeapons = JSON.parse(localStorage.getItem("splatoon_elim_weapons"));
	const newweapons = [];
	
	draftstatus.alpha = savedWeapons.draft.alpha;
	draftstatus.bravo = savedWeapons.draft.bravo;
	setDraftTeam(savedWeapons.draft.currentteam);
	
	for (let wpn of weapons) {
		if (savedWeapons.weapons[wpn.name] !== undefined) {
			changeWeaponState(wpn.id, savedWeapons.weapons[wpn.name]);
		} else {
			newweapons.push(wpn);
		}
	}
	if (newweapons.length === 0) return true;
	
	const tablebody = document.querySelector("#table-newweapons tbody");
	for (let wpn of newweapons) {
		tablebody.insertAdjacentHTML("beforeend", `<tr class="newweapon-row" data-id="${wpn.id}"><td>${wpn.name}</td><td>${wpn.sub}</td><td>${wpn.special}</td><td class="includewpn"></td></tr>`);
	}
	
	document.querySelectorAll(".setallnew").forEach(ele => ele.addEventListener("click", function() {
		const state = this.getAttribute("data-state");
		
		document.querySelectorAll(".newweapon-row").forEach(row => {
			const id = Number(row.getAttribute("data-id"));
			row.classList.toggle("banned", (state === "ban" ? true : false));
			changeWeaponState(id, state);
			displayWeaponCount();
		});
	}));
	
	document.querySelectorAll(".newweapon-row").forEach(ele => ele.addEventListener("click", function() {
		const id = Number(this.getAttribute("data-id"));
		const cList = this.classList;
		
		cList.toggle("banned");
		changeWeaponState(id, (cList.contains("banned") ? "ban" : "unban"));
		displayWeaponCount();
	}));
	
	const modal = document.getElementById("modal-newweapons");
	const modalbtn = document.getElementById("btn-newweaponsmodal");
	
	modal.addEventListener("close", function() {
		allowsave.weapons = true;
		saveWeapons();
	});
	modalbtn.addEventListener("click", function() {
		modal.close();
	});
	
	modal.showModal();
	modal.scrollTop = 0; //if there are so many new weapons that they can't fit on screen, this scrolls the modal's scrollbar to the top, where the explaining text is :)
	return false;
}


document.addEventListener("DOMContentLoaded", function() {
	startingFunc();	 //adds .id, .elimstatus, and .scopeclones data to each weapon, as will as putting its name:id pair in the weaponmap variable
	displayWeaponList(); //fills the #weapons div with all the weapons
	
	loadSettings();
	allowsave.weapons = loadWeapons(); //loads weapons and returns true to allow saving, unless new weapons were found, then returns false (sets true on closing #modal-newweapons)
	
	displayWeaponCount(); //counts weapons, sets displays mode based on counts, shows "no weapons available" if applicable, saves weapons
	displayDraftedWeapons("all");
	
	document.getElementById("chk-savesettings").addEventListener("change", function() {
		if (this.checked === false) {
			localStorage.setItem("splatoon_elim_settings", "disabled");
			return;
		}
		saveSettings();
	});
	document.getElementById("chk-saveweapons").addEventListener("change", function() {
		if (this.checked === false) {
			localStorage.setItem("splatoon_elim_weapons", "disabled");
			return;
		}
		saveWeapons();
	});
	
	document.getElementById("chk-enabledraft").addEventListener("change", function() {
		const cList = document.body.classList;
		if (this.checked) {
			cList.remove("hidedraft");
		} else {
			cList.add("hidedraft");
			
			document.getElementById("btn-unbandrafted").dispatchEvent(new Event("click"));
			setDraftTeam();
			displayWeaponCount();
		}
	});
	
	document.querySelectorAll(".weapon").forEach(ele => ele.addEventListener("click", function() {
		handleWeaponClick(Number(this.getAttribute("data-id")));
	}));
	
	document.querySelectorAll(".weapon").forEach(ele => ele.addEventListener("mouseenter", function() {
		const id = Number(this.getAttribute("data-id"));
		const ids = getWeaponClones(id, false);
		lasthover.id = id;
		lasthover.current = true;
		
		for (let i in ids) {
			document.querySelectorAll(".weapon[data-id='" + ids[i] + "']").forEach(wpn => wpn.classList.add("hover"));
		}
		
		showHoveredInfo(id);
	}));
	document.querySelectorAll(".weapon").forEach(ele => ele.addEventListener("mouseleave", function() {
		const id = Number(this.getAttribute("data-id"));
		const ids = getWeaponClones(id, false);
		lasthover.current = false;
		
		for (let i in ids) {
			document.querySelectorAll(".weapon[data-id='" + ids[i] + "']").forEach(wpn => wpn.classList.remove("hover"));
		}
		
		showHoveredInfo(false);
	}));
	
	document.querySelectorAll(".explain").forEach(ele => ele.addEventListener("mouseenter", function() {
		const id = this.getAttribute("data-explain");
		showHoveredInfo(id);
	}));
	document.querySelectorAll(".explain").forEach(ele => ele.addEventListener("mouseleave", function() {
		showHoveredInfo(false);
	}));
	
	document.addEventListener("mousemove", function(evt) {
		const ele = document.getElementById("weaponInfo");
		//Math.min explanation: position infobox 12px right of cursor, but at least 20px away from the right edge of the screen (I believe the scrollbar is 17px wide)
		const arr = {"x": Math.min(evt.pageX + 12, window.scrollX + window.innerWidth - ele.getBoundingClientRect().width - 20), "y": evt.pageY + 22, "w": ele.getBoundingClientRect().width};
		ele.style.top = arr.y + "px";
		ele.style.left = arr.x + "px";
	});
	
	document.addEventListener("keyup", function(evt) {
		const key = evt.key.toLowerCase();
		const dd = document.getElementById("dd-displaymode");
		if (document.getElementById("chk-displaymode_keyboardshortcuts").checked === true) {
			if (key === "c") {
				dd.value = "compact";
				dd.dispatchEvent(new Event("change"));
				return;
			} else if (key === "d") {
				dd.value = "detailed";
				dd.dispatchEvent(new Event("change"));
				return;
			} else if (key === "t") {
				dd.value = "threshold";
				dd.dispatchEvent(new Event("change"));
				return;
			}
		}
		
		const enabledraft = document.getElementById("chk-enabledraft").checked;
		if (enabledraft === true) {
			const draftweapon = document.getElementById("chk-draft_onkeydraftweapon").checked;
			const selectteam = document.getElementById("chk-draft_onkeyselectteam").checked;
			const teams = {"a": "alpha", "b": "bravo"};
			const team = teams[key];
			
			if (team !== undefined) {
				if (draftweapon === true && lasthover.current === true && weapons[lasthover.id].elimstatus === "available") {
					teamDraft(team, lasthover.id);
				} else if (selectteam === true) {
					setDraftTeam(team);
				}
			}
		}
	});
	
	
	
	document.querySelectorAll(".teambox").forEach(ele => ele.addEventListener("click", function(evt) {
		const team = this.getAttribute("data-team");
		const cList = evt.target.classList;
		
		if (cList.contains("draftedweapon") && !cList.contains("any-weapon")) { //if clicking on a teambox's drafted weapon, remove clicked weapon from team (treating a click on a Question Mark (undrafted weapon slot) as a click on the team box itself - in the else statement)
			const nr = Number(evt.target.getAttribute("data-draftid"));
			const cut = draftstatus[team].splice(nr,1)[0];
			if (cut >= 0) { changeWeaponArrayStates(getWeaponClones(cut, true), "unban", false); } //unbans (undrafts) the weapon that's no longer on the team, without logging it in the ban history
			draftstatus[team].push(-1);
			displayDraftedWeapons(team);
			displayWeaponCount();
		} else {
			setDraftTeam(team, true); //set team or unselect the team if you clicked the current team
		}
	}));
	
	document.querySelectorAll("#nr-banrandom, #nr-displaymodethreshold").forEach(ele => ele.addEventListener("change", function() {
		const min = Number(this.getAttribute("min"));
		const max = Number(this.getAttribute("max"));
		const val = Number(this.value);
		
		if (val < min) {
			this.value = min;
		} else if (val > max) {
			this.value = max;
		}
		
		if (this.id === "nr-displaymodethreshold" && document.getElementById("dd-displaymode").value === "threshold") {
			displayWeaponCount();
		}
	}));
	document.getElementById("btn-banrandom").addEventListener("click", function() {
		banRandomWeapons(Number(document.getElementById("nr-banrandom").value), "ban");
	});
	document.getElementById("btn-unbanrandom").addEventListener("click", function() {
		banRandomWeapons(Number(document.getElementById("nr-banrandom").value), "unban");
	});
	document.getElementById("btn-banall").addEventListener("click", function() {
		banRandomWeapons(9999, "ban");
	});
	document.getElementById("btn-unbanall").addEventListener("click", function() {
		banRandomWeapons(9999, "unban");
	});
	document.getElementById("btn-bandrafted").addEventListener("click", function() {
		teamDraft("alpha", -1, "ban");
		teamDraft("bravo", -1, "ban");
		
		//update ban count and history (search for this sentence when changing stuff below it, and change it whereever you find this piece of code)
		displayWeaponCount();
		displayBanHistory(24);
	});
	document.getElementById("btn-unbandrafted").addEventListener("click", function() {
		teamDraft("alpha", -1, "unban");
		teamDraft("bravo", -1, "unban");
		
		//update ban count and history (search for this sentence when changing stuff below it, and change it whereever you find this piece of code)
		displayWeaponCount();
		displayBanHistory(24);
	});
	
	document.getElementById("chk-showbanhistory").addEventListener("change", function() {
		const cList = document.getElementById("banhistory").classList;
		if (this.checked) { cList.remove("hidden"); }
		else { cList.add("hidden"); }
	});
	
	document.querySelectorAll("#chk-mirrorbanreskin, #chk-mirrorbanscope").forEach(ele => ele.addEventListener("change", function() {
		cleanDraftedWeapons();
		displayWeaponCount();
	}));
	document.getElementById("chk-showstory").addEventListener("change", function() {
		const cList = document.body.classList;
		if (this.checked) { cList.remove("hidestory"); }
		else { cList.add("hidestory"); }
		
		displayWeaponCount();
	});
	document.getElementById("chk-showreskins").addEventListener("change", function() {
		const cList = document.body.classList;
		if (this.checked) { cList.remove("hidereskins"); }
		else { cList.add("hidereskins"); }
		
		displayWeaponCount();
	});
	
	document.getElementById("dd-displaymode").addEventListener("change", function() {
		const displaymode = this.value;
		const cList = document.getElementById("displaymodethreshold-wrapper").classList;
		
		if (displaymode === "threshold") {
			cList.remove("hidden");
		} else {
			setDisplayMode(displaymode);
			cList.add("hidden");
		}
		displayWeaponCount(); //also checks threshold, updates the displaymode and shows/hides the #noweapons div if needed
	});
	
	document.querySelectorAll("input, select").forEach(ele => ele.addEventListener("change", function() {
		saveSettings();
	}));
	document.querySelectorAll("#chk-enabledraft, #chk-showbanhistory, #chk-showstory, #chk-showreskins, #dd-displaymode").forEach(ele => ele.dispatchEvent(new Event("change")));
	
	allowsave.settings = true;
	saveSettings();
});