// note: Hyrule Hood (Down) can be aqcuired by wearing Hyrule Hood and talking to Cece after doing her quests (and being rewarded with Cece Hat)
// apparently she switches ALL your hyrule hoods every time you switch, so to get both at once, buy one, put it down, buy a new one and never switch states again
// since you can have both different states at once, I'll keep them both in the list

// todo: pregenerate the page (fill #armor-list and #material-table in the HTML instead of dynamically generating on every page load)
//   (not sure if it's worth the increase in file size from 11kB to 281kB, holding off on it, but I already made the 2 functions slightly less efficient for this)

// const variables [armorCounts, armorList, materialInfo] declared in totkarmorlists.js
const levels = {};
let manualCompletedMaterials = new Set(); // click row in #material-table to mark it as "complete", even if they haven't all been used yet (when you have enough in inventory)

let filters = {
	"toggles": {
		"armorbodypart": {"Head": true, "Torso": true, "Legs": true, "Full Body": true},
		"armorlevel": {"-1of0": true, "0of0": true, "-1of4": true, "0of4": true, "1of4": true, "2of4": true, "3of4": true, "4of4": true},
		"materialcolumn": {"order": false, "lvl1": true, "lvl2": true, "lvl3": true, "lvl4": true, "group": false},
		"materialgroup": {"Monster": true, "Dragon": true, "Creature": true, "Plant": true, "Other": true}
	},
	"checkbox": {
		"chk-hidecompletedlevelcosts": true,
		"chk-showmattotalremaining": true,
		"chk-showarmorcounts": true,
		"chk-hidecompletedmaterials": false,
		"chk-hidewelcomemodal": false
	},
	"text": {
		"txt-armor-name": "",
		"txt-material-name": ""
	},
	"dropdown": {
		"dd-sortarmor": "id,1",
		"dd-sortmaterials": "order_inventory,1",
		"dd-effectfilter": "all"
	},
	"settings-icons": { // if true, add the HIDDEN class to these elements (false = visible)
		"#armor-settings .filters": true,
		"#armor-settings .settings": true,
		"#material-settings .filters": true,
		"#material-settings .settings": true
	}
};

function saveLevels() {
	localStorage.setItem("totk_armor_levels", JSON.stringify(levels));
}
function loadLevels() {
	if (localStorage.getItem("totk_armor_levels") === null) return;

	const loadedLevels = JSON.parse(localStorage.getItem("totk_armor_levels"));
	for (let armor of armorList) {
		if (loadedLevels[armor.name] === undefined) {
			console.warn(`loadLevels() - could not find loadedLevels[${armor.name}] - skipping to next armor`);
			continue;
		}
		setArmorLevel(armor.id, loadedLevels[armor.name], true, false);
	}
}
function saveFilters() {
	localStorage.setItem("totk_armor_filters", JSON.stringify(filters));
}
function loadFilters() {
	if (localStorage.getItem("totk_armor_filters") === null) return;

	filters = JSON.parse(localStorage.getItem("totk_armor_filters"));
	
	for (let chkId in filters.checkbox) {
		document.getElementById(chkId).checked = filters.checkbox[chkId];
	}
	for (let txtId in filters.text) {
		document.getElementById(txtId).value = filters.text[txtId];
	}
	for (let ddId in filters.dropdown) {
		document.getElementById(ddId).value = filters.dropdown[ddId];
	}
	for (let query in filters["settings-icons"]) {
		document.querySelector(query)?.classList.toggle("hidden", filters["settings-icons"][query]);
	}
	
	for (let filterName in filters.toggles) {
		for (let val in filters.toggles[filterName]) {
			document.querySelector(`.togglebutton[data-filtername='${filterName}'][data-filtervalue='${val}']`)?.classList.toggle("selected", filters.toggles[filterName][val]);
			if (filterName === "materialcolumn") {
				document.getElementById("material-table").classList.toggle("hide" + val, !filters.toggles.materialcolumn[val]);
			}
		}
	}
	
	filterArmorList(false);
	filterMaterialList(false);
}

function loadManualCompletedMaterials() {
	if (localStorage.getItem("totk_armor_manualCompletedMaterials") === null) return;
	manualCompletedMaterials = new Set(JSON.parse(localStorage.getItem("totk_armor_manualCompletedMaterials")));
	
	for (let mat of manualCompletedMaterials) {
		document.querySelector(`#material-table tr[data-material="${mat}"]`).classList.add("manualcompleted");
	}
}

function sortArmor(sortby) {
	sortby = sortby.split(",");
	const key = sortby[0];
	const dir = Number(sortby[1]);
	
	const armorsClone = structuredClone(armorList);
	armorsClone.sort(function(a, b) {
		if (a[key] < b[key]) {return -1*dir;}
		else if (a[key] > b[key]) {return 1*dir;}
		else {return 0;}
	});
	
	const armorDiv = document.getElementById("armor-list");
	for (const armor of armorsClone) {
		const ele = armorDiv.querySelector(`.armor[data-id="${armor.id}"]`);
		if (!ele) {
			console.warn(`sortArmor() - could not find .armor[data-id="${armor.id}"] - skipping to next armor`);
			continue;
		}
		armorDiv.insertAdjacentElement("beforeend", ele);
	}
}
function sortMaterials(sortby) {
	sortby = sortby.split(",");
	const key = sortby[0];
	const dir = Number(sortby[1]);
	
	const matsArray = [];
	for (const mat in materialInfo) {
		matsArray.push({"name": mat, "order_inventory": materialInfo[mat].order_inventory});
	}
	matsArray.sort(function(a, b) {
		if (a[key] < b[key]) {return -1*dir;}
		else if (a[key] > b[key]) {return 1*dir;}
		else {return 0;}
	});
	
	const matsTbody = document.querySelector("#material-table tbody");
	for (const mat of matsArray) {
		const ele = matsTbody.querySelector(`tr[data-material="${mat.name}"]`);
		if (!ele) {
			console.warn(`sortMaterials() - could not find tr[data-material="${mat.name}"] - skipping to next material`);
			continue;
		}
		matsTbody.insertAdjacentElement("beforeend", ele);
	}
}

function updateArmorCountsTable() {
	const tbody = document.querySelector("#armorcounts-table tbody")
	for (let lvl in armorCounts.current) {
		tbody.querySelector(`td[data-level="${lvl}"]`).innerHTML = `${armorCounts.current[lvl]} / ${armorCounts.total[lvl]}`;
	}
}

function fillMaterialTable(action = "insert") {
	const tbody = document.querySelector("#material-table tbody");
	tbody.innerHTML = "";
	
	let txt = "";
	for (let mat in materialInfo) {
		txt += `<tr data-material="${mat}"><td data-column="order">${materialInfo[mat].order_inventory}</td><td>${mat}</td>`;
		for (let lvl of [1, 2, 3, 4]) {
			const amt = getMaterialCount(mat, lvl, true);
			txt += `<td data-level="${lvl}">${amt}</td>`;
			if (lvl === 4) {
				document.querySelectorAll(`#armor-list li[data-material="${mat}"]`).forEach(li => li.setAttribute("data-mattotalremaining", amt));
			}
		}
		txt += `<td data-column="group">${materialInfo[mat].group}</td></tr>`;
	}
	
	if (action === "insert") tbody.innerHTML = txt;
	else if (action === "return") return txt;
}

function updateMaterialTable(mat) {
	const row = document.querySelector(`#material-table tbody tr[data-material="${mat}"]`);
	for (let lvl of [1, 2, 3, 4]) {
		const amt = getMaterialCount(mat, lvl, true);
		row.querySelector(`td[data-level="${lvl}"]`).innerHTML = amt;
		if (lvl === 4) {
			row.classList.toggle("complete", (amt > 0 ? false : true));
		
			document.querySelectorAll(`#armor-list li[data-material="${mat}"]`).forEach(li => li.setAttribute("data-mattotalremaining", amt));
		}
	}
}

/* function UNUSED_recalculateMaterialCounts(reset = true) {
	//note: IF deciding to use this in the future - probably don't remake the material table :)
	if (reset === true) {
		for (let mat in materialInfo) {
			materialInfo[mat].counts = [0,0,0,0,0];
		}
	}
	for (let armor of armorList) {
		if (armor.maxlevel === 0) continue;
		for (let lvl = getArmorLevel(armor.id)+1; lvl <= armor.maxlevel; lvl++) {
			for (let mat in armor.upgrade[lvl]) {
				materialInfo[mat].counts[lvl] += armor.upgrade[lvl][mat];
			}
		}
	}
	
	// fillMaterialTable();
} */

function setArmorLevel(armorId, levelTo, updateMats = true, enableSave = true) {
	if (updateMats === true) {
		const levelFrom = getArmorLevel(armorId);
		const diff = levelTo - levelFrom;
		const dir = (diff !== 0 ? diff / Math.abs(diff) : 0); //evaluates to 1 if diff is positive; to -1 if diff is negative; to 0 if diff=0
		
		for (let i = levelFrom; i !== levelTo; i += dir) {
			const lvl = (dir === 1 ? i+1 : i); //when increasing the level, you should remove the next (+1) levels' materials (the levels you're increasing to) / when decreasing the level, you re-add the materials for the levels you previously had
			adjustMaterialCount(armorId, lvl, dir*-1); //flip dir's sign because INCREASING an armor's levels DECREASES the remaining required materials, and vice versa

			// 1 > 2 = add(2)
			// 1 > 3 = add(2), add(3)
			// 2 > 1 = remove(2)
			// 3 > 1 = remove(3), remove(2)
			
			if (armorList[armorId].maxlevel === 0) armorCounts.current.upgradeless += dir;
			else armorCounts.current[lvl] += dir;
		}
	}
	levels[armorList[armorId].name] = levelTo;
	document.querySelector(`.armor[data-id="${armorId}"]`)?.setAttribute("data-currentlevel", levelTo);
	
	if (enableSave === true) {
		saveLevels();
		updateArmorCountsTable();
	}
}
function getArmorLevel(armorId) {
	const armorName = armorList[armorId].name;
	if (levels[armorName] === undefined) setArmorLevel(armorId, -1, false, false);
	return levels[armorName];
}
function adjustMaterialCount(armorId, lvl, dir) {
	const mats = armorList[armorId].upgrade[lvl];
	for (let mat in mats) {
		materialInfo[mat].counts[lvl] += mats[mat] * dir;
		updateMaterialTable(mat);
	}
}
function getMaterialCount(mat, lvl, countLowerLevels = true) {
	let count = 0;
	for (let i = (countLowerLevels ? 1 : lvl); i <= lvl; i++) {
		count += materialInfo[mat].counts[i];
	}
	return count;
}

function hideShowArmorMaterialCosts(box, hideCompleted = filters.checkbox["chk-hidecompletedlevelcosts"]) {
	const armor = armorList[Number(box.getAttribute("data-id"))];
	const armorLevel = getArmorLevel(armor.id);
	box.querySelectorAll(".armor_upgrade-row").forEach(row => {
		const rowLevel = Number(row.getAttribute("data-level"));
		const hideMats = ((hideCompleted === true && armorLevel >= rowLevel) ? true : false);
		row.classList.toggle("hidematerials", hideMats);
	});
}
function filterArmorList(enableSave = true) {
	function checkArmorRequirements(armor) {
		if (filters.toggles.armorbodypart[armor.bodypart] === false) return false;
		
		const levelstring = getArmorLevel(armor.id) + "of" + armor.maxlevel;
		if (filters.toggles.armorlevel[levelstring] === false) return false;
		
		const effect = filters.dropdown["dd-effectfilter"];
		if ((effect === "any" && !armor.effect) || (effect === "no" && armor.effect) || (!["all", "any", "no"].includes(effect) && effect !== armor.effect)) return false;
		
		const rE = new RegExp(filters.text["txt-armor-name"], "i");
		if (rE.test(armor.name) === false) return false;
	
		return true;
	}
	
	let found = false;
	document.querySelectorAll("#armor-list .armor").forEach(box => {
		const passed = checkArmorRequirements(armorList[Number(box.getAttribute("data-id"))]);
		box.classList.toggle("hidden", !passed);
		if (passed) found = true;
	});
	document.getElementById("armor-list").classList.toggle("noresults", !found);
	
	if (enableSave === true) saveFilters();
}



function filterMaterialList(enableSave = true) {
	function checkMaterialRequirements(matname) {
		if (filters.toggles.materialgroup[materialInfo[matname].group] === false) return false;
		
		if (filters.checkbox["chk-hidecompletedmaterials"] === true && (manualCompletedMaterials.has(matname) || getMaterialCount(matname, 4, true) === 0)) return false;
	
		const rE = new RegExp(filters.text["txt-material-name"], "i");
		if (rE.test(matname) === false) return false;
	
		return true;
	}
	
	let found = false;
	document.querySelectorAll("#material-table tbody tr").forEach(row => {
		const passed = checkMaterialRequirements(row.getAttribute("data-material"));
		row.classList.toggle("hidden", !passed);
		if (passed) found = true;
	});
	document.getElementById("material-list").classList.toggle("noresults", !found);
	
	if (enableSave === true) saveFilters();
}

function fillArmorList(action = "insert") {
	function armorBox(armor) {
		function makeEffectImage(effect) {
			const effectImages = {
				"Attack Up": "attack-up",
				"Charge Atk. Stamina Up": "attack-up",
				"Disguise; Bone Weap. Prof.": "attack-up-set",
				"Attack Up (Set)": "attack-up-set",
				"Master Sword Beam Up": "attack-up-set",
				"Night Speed Up (Set)": "attack-up-set",
				"Climb Speed Up": "climb-speed-up",
				"Climbing Jump Stamina Up": "climb-speed-up",
				"Cold Resistance": "cold-resistance",
				"Unfreezable (Set)": "cold-resistance",
				"Cold Weather Attack": "cold-weather-attack",
				"Cold Weather Charge": "cold-weather-attack",
				"Energy Up": "energy-up",
				"Energy Recharge Up": "energy-up",
				"Flame Guard": "flame-guard",
				"Fireproof": "flame-guard",
				"Gloom Resistance": "gloom-resistance",
				"Gloom Attack Resist": "gloom-resistance",
				"Glow": "glow",
				"Shining Steps": "glow",
				"Heat Resistance": "heat-resistance",
				"Shock Damage Resist": "heat-resistance",
				"Hot Weather Attack": "hot-weather-attack",
				"Hot Weather Charge": "hot-weather-attack",
				"Rupee Padding": "rupee-padding",
				"Sand Speed Up": "sand-speed-up-saturated",
				"Shock Resistance": "shock-resistance",
				"Lightning Proof (Set)": "shock-resistance",
				"Skydive Mobility Up": "skydive-mobility-up-lightness30",
				"Impact Proof": "skydive-mobility-up-lightness30",
				"Slip Resistance": "slip-resistance",
				"Slip Proof": "slip-resistance",
				"Snow Speed Up": "snow-speed-up-saturated",
				"Stealth Up": "stealth-up-lightness30",
				"Night Speed Up": "stealth-up-lightness30",
				"Stormy Weather Attack": "stormy-weather-attack",
				"Stormy Weather Charge": "stormy-weather-attack",
				"Swim Speed Up": "swim-speed-up",
				"Swim Dash Stamina Up": "swim-speed-up",
				"Lightning Proof": "lightning-proof-white",
				"Unfreezable": "unfreezable-white"
			};
			return (effectImages[effect] ? `<img class="effect-icon" src="icons/effects/${effectImages[effect]}.png" />` : "");
		}
		function upgradeRow(level, mats, def) {
			let txt = `<div class="armor_upgrade-level">Level ${level}</div><div class="armor_upgrade-def">${def}</div>`;
			let LIs = "";
			for (let mat in mats) {
				if (mat === "Rupees") txt += `<div class="armor_upgrade-rupeecost"><img class="rupee" src="icons/totk-rupee.svg" />${mats[mat]}</div>`;
				else LIs += `<li data-material="${mat}" data-mattotalremaining="${getMaterialCount(mat, 4, true)}">${mats[mat]}×${mat}</li>`;
			}
			txt += `<div class="armor_upgrade-materials"><ul>${LIs}</ul></div>`;
			return `<div class="armor_upgrade-row" data-level="${level}">${txt}</div>`;
		}
		
		let txt = `<div class="armor_header">`;
		txt += `<div class="armor_name">${armor.name}</div>`;
		txt += `<div class="armor_def">${armor.def[0]}</div>`;
		txt += `<div class="armor_effect">${(armor.effect ? makeEffectImage(armor.effect) + armor.effect : "")}</div>`;
		txt += "</div>"
		
		if (armor.maxlevel > 0) {
			txt += "<div class='armor_upgrade'>";
			for (let lvl = 1; lvl <= armor.maxlevel; lvl++) {
				txt += upgradeRow(lvl, armor.upgrade[lvl], armor.def[lvl]);
			}
			txt += "</div>";
		}
		
		return `<div class="armor" data-id="${armor.id}" data-currentlevel="-1" data-maxlevel="${armor.maxlevel}">${txt}</div>`;
	}
	
	let html = "";
	for (const armor of armorList) {
		if (action === "insert") document.getElementById("armor-list").insertAdjacentHTML("beforeend", armorBox(armor));
		else if (action === "return") html += armorBox(armor);
	}
	if (action === "return") return html;
}

function showWelcomeModal() {
	let showAfter = 0;
	if (localStorage.getItem("totk_armor_showWelcomeAfter")) showAfter = JSON.parse(localStorage.getItem("totk_armor_showWelcomeAfter"));
	const now = Date.now();
	const waitToShow = 7 * 1000*60*60*24; // 7 days
	
	if (now < showAfter) {
		localStorage.setItem("totk_armor_showWelcomeAfter", (now + waitToShow));
		return;
	}
	
	const modal = document.getElementById("modal-welcome");
	if (showAfter > 0) modal.querySelector(".modal-head").textContent = "Welcome back!";
	
	modal.addEventListener("close", function() {
		if (document.getElementById("chk-hidewelcomemodal").checked) localStorage.setItem("totk_armor_showWelcomeAfter", (now + waitToShow));
		else localStorage.setItem("totk_armor_showWelcomeAfter", 1);
	});
	modal.querySelector(".close-modal").addEventListener("click", function() {
		modal.close();
	});
	
	modal.showModal();
	modal.scrollTop = 0; //scroll the modal's scrollbar to the top, in case there's too much text to fit on screen
}

document.addEventListener("DOMContentLoaded", function() {
	// console.log(fillMaterialTable("return"));
	fillMaterialTable("insert");
	// console.log(fillArmorList("return"));
	fillArmorList("insert");
	document.getElementById("armor-list").addEventListener("click", function(evt) {
		const box = evt.target.closest(".armor");
		if (!box) return;

		const upgradeRow = evt.target.closest("[data-level]");
		const armorId = Number(box.getAttribute("data-id"));
		let levelFrom = getArmorLevel(armorId);
		let levelTo = Number(upgradeRow?.getAttribute("data-level"));
		if (Number.isNaN(levelTo)) levelTo = 0;
		
		if (levelFrom === levelTo) levelTo = -1;
		
		setArmorLevel(armorId, levelTo);
		filterArmorList(false);
		hideShowArmorMaterialCosts(box);
	});
	
	
	
	loadLevels();
	updateArmorCountsTable();
	document.getElementById("material-list").addEventListener("click", function(evt) {
		const row = evt.target.closest("tr[data-material]");
		if (!row) return;
		
		const isManualCompleted = row.classList.toggle("manualcompleted");
		const mat = row.getAttribute("data-material");
		if (isManualCompleted) manualCompletedMaterials.add(mat);
		else manualCompletedMaterials.delete(mat);
		
		localStorage.setItem("totk_armor_manualCompletedMaterials", JSON.stringify(Array.from(manualCompletedMaterials)));
		filterMaterialList(false);
	});
	loadManualCompletedMaterials();
	
	
	document.getElementById("armor-settings").addEventListener("click", function(evt) {
		const target = evt.target.closest(".togglebutton");
		if (!target) return;
		
		const isSelected = target.classList.toggle("selected");
		const filterName = target.getAttribute("data-filtername");
		const val = target.getAttribute("data-filtervalue");
		filters.toggles[filterName][val] = isSelected;
		filterArmorList(true);
	});
	document.getElementById("txt-armor-name").addEventListener("keyup", function () {
		filters.text["txt-armor-name"] = this.value;
		filterArmorList(true);
	});
	document.getElementById("dd-sortarmor").addEventListener("change", function () {
		filters.dropdown["dd-sortarmor"] = this.value;
		sortArmor(this.value);
		saveFilters();
	});
	document.getElementById("dd-effectfilter").addEventListener("change", function () {
		filters.dropdown["dd-effectfilter"] = this.value;
		filterArmorList(true);
	});
	
	
	document.getElementById("material-settings").addEventListener("click", function(evt) {
		const target = evt.target.closest(".togglebutton");
		if (!target) return;
		
		const isSelected = target.classList.toggle("selected");
		const filterName = target.getAttribute("data-filtername");
		const val = target.getAttribute("data-filtervalue");
		filters.toggles[filterName][val] = isSelected;
		if (filterName === "materialcolumn") {
			document.getElementById("material-table").classList.toggle("hide" + val, !isSelected);
			saveFilters();
			return;
		}
		filterMaterialList(true);
	});
	document.getElementById("txt-material-name").addEventListener("keyup", function () {
		filters.text["txt-material-name"] = this.value;
		filterMaterialList(true);
	});
	document.getElementById("dd-sortmaterials").addEventListener("change", function () {
		filters.dropdown["dd-sortmaterials"] = this.value;
		sortMaterials(this.value);
		saveFilters();
	});
	
	document.querySelectorAll("input[type='checkbox']").forEach(ele => ele.addEventListener("change", function() {
		filters.checkbox[this.id] = this.checked;
		
		if (this.id === "chk-hidecompletedlevelcosts") {
			document.querySelectorAll("#armor-list .armor").forEach(box => {
				hideShowArmorMaterialCosts(box, this.checked);
			});
		} else if (this.id === "chk-showmattotalremaining") {
			document.getElementById("armor-list").classList.toggle("showmattotalremaining", this.checked);
		} else if (this.id === "chk-hidecompletedmaterials") {
			filterMaterialList(false); //filters get saved below, no need to double save, so pass it a (false)
		} else if (this.id === "chk-showarmorcounts") {
			document.getElementById("pageContainer").classList.toggle("hidearmorcounts", !this.checked);
		}
		saveFilters();
	}));
	
	document.querySelectorAll(".settings-icons").forEach(ele => ele.addEventListener("click", function(evt) {
		const target = evt.target.closest(".icon");
		if (!target) return;
		
		let which;
		if (target.classList.contains("filters-icon")) which = ".filters";
		else if (target.classList.contains("settings-icon")) which = ".settings";
		if (!which) return;
		
		const wrapper = evt.target.closest(".settings-wrapper");
		const isSelected = wrapper.querySelector(which)?.classList.toggle("hidden");
		
		filters["settings-icons"]["#" + wrapper.id + " " + which] = isSelected;
		saveFilters();
	}));
	
	loadFilters();
	
	const heightObserver = new ResizeObserver(entries => {
		for (const entry of entries) {
			document.documentElement.style.setProperty(`--${entry.target.id}-height`, entry.borderBoxSize[0].blockSize + "px")
		}
	});
	heightObserver.observe(document.getElementById("material-settings"));
	heightObserver.observe(document.getElementById("armorcounts"));
	
	document.querySelectorAll("#chk-hidecompletedlevelcosts, #chk-showmattotalremaining, #chk-showarmorcounts, #dd-sortarmor, #dd-sortmaterials").forEach(ele => ele.dispatchEvent(new Event("change")));
	
	showWelcomeModal();
});