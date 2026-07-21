//store fragment levels based on "ingameorder" value (ingameorder: 1 = index [1], [0] stays unused)
let fragmentlevels = ["", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let fragments = [
	{"name": "Alchemaniac", "ingameorder": 36, "seteffects": ["Endless Knowledge", "Personal Banker"], "fragmenttype": "Skilling", "group": "?", "desc": ["High alchemy gives ", ["15%", "30%", "50%"], " bonus gold."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Arcane Conduit", "ingameorder": 6, "seteffects": ["Endless Knowledge", "Trailblazer"], "fragmenttype": "Combat", "group": "Magic Combat", "desc": ["Runes & magic weapon charges have a ", ["40%", "60%", "90%"], " chance to be saved."], "tier": 1, "level": 0, "XP": 0},
	{"name": "Armadylean Decree", "ingameorder": 18, "seteffects": ["Double Tap", "Absolute Unit"], "fragmenttype": "Combat", "group": "?", "desc": ["When wielding four Armadyl items, enchanted bolt effects have a ", ["25%", "50%", "100%"], " increased chance to activate."], "tier": 4, "level": 0, "XP": 0},
	{"name": "Bandosian Might", "ingameorder": 17, "seteffects": ["Twin Strikes", "Fast Metabolism"], "fragmenttype": "Combat", "group": "?", "desc": ["When wielding four Bandos items, your max melee hit is increased by ", ["1", "2", "4"], " for every attack speed a weapon has."], "tier": 4, "level": 0, "XP": 0},
	{"name": "Barbarian Pest Wars", "ingameorder": 51, "seteffects": ["Twin Strikes", "Knife's Edge"], "fragmenttype": "Miscellaneous", "group": "?", "desc": ["Reward currency received from Barbarian Assault, Pest Control and Soul Wars are increased by ", ["x2", "x3", "x4"], "."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Bottomless Quiver", "ingameorder": 4, "seteffects": ["Knife's Edge", "Trailblazer"], "fragmenttype": "Combat", "group": "Ranged", "desc": ["Ranged ammunition and ranged weapon charges have a ", ["40%", "60%", "90%"], " chance to be saved, excluding chinchompas. The chances to save ammunition and charges are rolled separately."], "tier": 1, "level": 0, "XP": 0},
	{"name": "Catch Of The Day", "ingameorder": 22, "seteffects": ["Personal Banker", "Unchained Talent"], "fragmenttype": "Harvesting", "group": "Fishing", "desc": ["All types of Fishing activities have a 1 in ", ["300", "200", "80"], " chance, per catch, to roll the rare drop table once."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Certified Farmer", "ingameorder": 41, "seteffects": ["Greedy Gatherer", "The Alchemist"], "fragmenttype": "Harvesting", "group": "Farming", "desc": ["Farming yields have a ", ["25%", "50%", "100%"], " chance to be doubled, and are converted to bank notes upon harvest."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Chef's Catch", "ingameorder": 21, "seteffects": ["Greedy Gatherer", "Trailblazer"], "fragmenttype": "Harvesting", "group": "Fishing", "desc": [["20%", "35%", "50%"], " chance that any fish caught is cooked. Cooking experience is granted, even if players do not have the level required to cook them normally."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Chinchonkers", "ingameorder": 39, "seteffects": ["Double Tap", "Last Recall"], "fragmenttype": "Harvesting", "group": "Hunter", "desc": ["Catching chinchompas grants ", ["50%", "100%", "100%"], " more Hunter experience. At level 3, players will receive two chinchompas per successful capture."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Clued In", "ingameorder": 49, "seteffects": ["Last Recall", "Drakan's Touch"], "fragmenttype": "Miscellaneous", "group": "?", "desc": ["The drop rate of scroll boxes from NPCs are increased to 1 in ", ["30", "25", "15"], "."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Deeper Pockets", "ingameorder": 24, "seteffects": ["Chain Magic", "Personal Banker"], "fragmenttype": "Skilling", "group": "Thieving", "desc": [["20%", "50%", "100%"], " chance to receive double loot when pickpocketing NPCs. This stacks with rogue equipment."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Dine & Dash", "ingameorder": 40, "seteffects": ["The Alchemist", "Unchained Talent"], "fragmenttype": "Production", "group": "Cooking", "desc": [["10%", "20%", "50%"], " chance to receive an extra piece of cooked food while cooking. Extra food is banked without granting Cooking experience."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Divine Restoration", "ingameorder": 9, "seteffects": ["Absolute Unit", "Twin Strikes"], "fragmenttype": "Combat", "group": "Prayer", "desc": ["Prayer points are restored by one every ", ["15", "9", "3.6"], " seconds."], "tier": 3, "level": 0, "XP": 0},
	{"name": "Dragon On A Bit", "ingameorder": 33, "seteffects": ["The Craftsman", "Absolute Unit"], "fragmenttype": "Production", "group": "?", "desc": ["When crafting dragonhide armour, ", ["10%", "20%", "40%"], " chance to save the materials. Saved materials are sent to the bank."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Enchanted Jeweler", "ingameorder": 35, "seteffects": ["Last Recall", "Endless Knowledge"], "fragmenttype": "Skilling", "group": "?", "desc": ["Each enchantment spell cast enchants up to ", ["5", "10", "25"], " pieces of jewellery, granting full Magic experience."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Golden Brick Road", "ingameorder": 45, "seteffects": ["The Alchemist", "Trailblazer"], "fragmenttype": "Skilling", "group": "Agility", "desc": ["When a Mark of Grace appears, ", ["4,000", "7,000", "15,000"], " coins will appear alongside it."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Grave Robber", "ingameorder": 46, "seteffects": ["Fast Metabolism", "The Craftsman"], "fragmenttype": "Skilling", "group": "Agility", "desc": ["The amount of hallowed marks received within the Hallowed Sepulchre is increased by ", ["50%", "150%", "300%"], "."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Homewrecker", "ingameorder": 26, "seteffects": ["The Alchemist", "Last Recall"], "fragmenttype": "Harvesting", "group": "Woodcutting", "desc": ["Players have a ", ["x2", "x3", "x4"], " chance of receiving bird nests when chopping trees, and nests are sent to the bank rather than falling to the ground."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Hot On The Trail", "ingameorder": 27, "seteffects": ["Fast Metabolism", "Chain Magic"], "fragmenttype": "Skilling", "group": "Firemaking", "desc": ["Players have a ", ["2%", "5%", "10%"], " chance to obtain a scroll box whilst lighting logs via Firemaking."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Imcando's Apprentice", "ingameorder": 34, "seteffects": ["The Craftsman", "Endless Knowledge"], "fragmenttype": "Production", "group": "?", "desc": ["Players have a ", ["20%", "50%", "75%"], " chance to craft an extra piece of gemmed jewellery, granting Crafting experience (requires spare inventory space)."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Just Druid!", "ingameorder": 44, "seteffects": ["The Alchemist", "Greedy Gatherer"], "fragmenttype": "Production", "group": "Herblore", "desc": ["Players will receive ", ["10%", "20%", "40%"], " extra Herblore experience for each grimy herb cleaned."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Larger Recharger", "ingameorder": 11, "seteffects": ["Fast Metabolism", "Drakan's Touch"], "fragmenttype": "Combat", "group": "?", "desc": ["Special attack energy is restored by 10% every ", ["25", "20", "10"], " seconds."], "tier": 3, "level": 0, "XP": 0},
	{"name": "Livin' On A Prayer", "ingameorder": 8, "seteffects": ["Knife's Edge", "Twin Strikes"], "fragmenttype": "Combat", "group": "Prayer", "desc": ["The drain rate of activated prayers is reduced by ", ["15%", "30%", "60%"], "."], "tier": 3, "level": 0, "XP": 0},
	{"name": "Message In A Bottle", "ingameorder": 50, "seteffects": ["Knife's Edge", "Greedy Gatherer"], "fragmenttype": "Miscellaneous", "group": "?", "desc": ["Clue geodes, nests and bottles are found ", ["3", "5", "10"], " times as often."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Mixologist", "ingameorder": 43, "seteffects": ["The Alchemist", "Unchained Talent"], "fragmenttype": "Production", "group": "Herblore", "desc": ["Players will have a ", ["25%", "50%", "100%"], " chance to mix a 4-dose potion rather than a 3-dose potion, with a ", ["20%", "50%", "100%"], " chance to save the secondary ingredient."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Molten Miner", "ingameorder": 30, "seteffects": ["Greedy Gatherer", "Personal Banker"], "fragmenttype": "Harvesting", "group": "Mining", "desc": [["20%", "50%", "100%"], " chance that mined ores will be smelted into bars (if applicable). Smithing experience is granted, even if players do not have the level required to smelt them normally."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Mother's Magic Fossils", "ingameorder": 53, "seteffects": ["Chain Magic", "Endless Knowledge"], "fragmenttype": "Miscellaneous", "group": "?", "desc": ["The chance of obtaining fossils on Fossil Island, Motherlode Mine gold nuggets and Mage Training Arena points are increased by ", ["x2", "x3", "x4"], "."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Plank Stretcher", "ingameorder": 28, "seteffects": ["Unchained Talent", "Endless Knowledge"], "fragmenttype": "Production", "group": "Construction", "desc": [["10%", "20%", "50%"], " chance to save planks whilst training Construction."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Praying Respects", "ingameorder": 10, "seteffects": ["Knife's Edge", "Drakan's Touch"], "fragmenttype": "Skilling", "group": "Prayer", "desc": ["Remains are automatically buried/scattered, granting ", ["50%", "100%", "200%"], " of the usual Prayer experience."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Pro Tips", "ingameorder": 38, "seteffects": ["The Craftsman", "Double Tap"], "fragmenttype": "Production", "group": "?", "desc": ["Players will receive ", ["30%", "50%", "100%"], " more bolt tips per gem whilst making them."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Profletchional", "ingameorder": 37, "seteffects": ["The Craftsman", "Last Recall"], "fragmenttype": "Production", "group": "?", "desc": ["Fletching logs and stringing bows grant ", ["30%", "50%", "100%"], " more Fletching experience."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Rock Solid", "ingameorder": 29, "seteffects": ["Greedy Gatherer", "Fast Metabolism"], "fragmenttype": "Harvesting", "group": "Mining", "desc": ["Iron, sandstone, and granite rocks have a ", ["25%", "50%", "75%"], " chance to not be depleted upon being mined."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Rogues' Chompy Farm", "ingameorder": 52, "seteffects": ["Double Tap", "Unchained Talent"], "fragmenttype": "Miscellaneous", "group": "?", "desc": ["Tithe Farm points are increased by ", ["x2", "x3", "x4"], ", chance to successfully crack the wall safe in Rogue's Den maze is increased by ", ["10%", "20%", "40%"], " and each chompy bird killed will count as ", ["2", "3", "4"], " kills."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Rooty Tooty 2x Runeys", "ingameorder": 47, "seteffects": ["Last Recall", "Chain Magic"], "fragmenttype": "Production", "group": "Runecrafting", "desc": ["Each time a rune is crafted, there is a ", ["20%", "40%", "80%"], " chance to get double the amount of runes."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Rumple-Bow-String", "ingameorder": 32, "seteffects": ["The Craftsman", "Double Tap"], "fragmenttype": "Production", "group": "?", "desc": ["The Spin Flax spell gives ", ["10", "15", "27"], " bow strings instead of the usual 5."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Rune Escape", "ingameorder": 48, "seteffects": ["Last Recall", "Absolute Unit"], "fragmenttype": "Production", "group": "Runecrafting", "desc": ["Players will no longer receive ", ["mind", "body", "elemental"], " runes when crafting runes at the Ourania Altar."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Saradominist Defence", "ingameorder": 20, "seteffects": ["Absolute Unit", "Knife's Edge"], "fragmenttype": "Combat", "group": "?", "desc": ["When wielding four Saradomin items, your max hit is increased by ", ["2", "5", "10"], " if you've taken damage in the last 3.6 seconds."], "tier": 4, "level": 0, "XP": 0},
	{"name": "Seedy Business", "ingameorder": 42, "seteffects": ["Personal Banker", "Trailblazer"], "fragmenttype": "Harvesting", "group": "Farming", "desc": ["Players have a ", ["10%", "25%", "50%"], " chance to save their seed upon planting it in a farming patch."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Slash & Burn", "ingameorder": 25, "seteffects": ["Greedy Gatherer", "Unchained Talent"], "fragmenttype": "Harvesting", "group": "Woodcutting", "desc": [["20%", "35%", "50%"], " chance of burning logs upon chopping them. Firemaking experience is granted, even if players do not have the level required to burn them normally."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Slay All Day", "ingameorder": 14, "seteffects": ["Knife's Edge", "The Alchemist"], "fragmenttype": "Combat", "group": "Slayer", "desc": ["Players will heal ", ["1", "2", "3"], " hitpoints for every monster killed as part of a slayer task."], "tier": 2, "level": 0, "XP": 0},
	{"name": "Slay 'n' Pay", "ingameorder": 16, "seteffects": ["Twin Strikes", "Last Recall"], "fragmenttype": "Combat", "group": "Slayer", "desc": ["Players will earn ", ["10%", "20%", "50%"], " more slayer reward points upon completing a slayer task."], "tier": 1, "level": 0, "XP": 0},
	{"name": "Smithing Double", "ingameorder": 31, "seteffects": ["Personal Banker", "Double Tap"], "fragmenttype": "Production", "group": "Smithing", "desc": ["Smithing at an anvil has a ", ["5%", "15%", "30%"], " chance to give two of the end product, granting full experience. Extra items will drop to the floor if players have no inventory space."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Smooth Criminal", "ingameorder": 23, "seteffects": ["Trailblazer", "Fast Metabolism"], "fragmenttype": "Skilling", "group": "Thieving", "desc": ["Chance to successfully pickpocket is increased by ", ["15%", "25%", "50%"], ", and you no longer take damage from being stunned (L2+). This stacks with the gloves of silence and Ardougne Diary bonus."], "tier": 0, "level": 0, "XP": 0},
	{"name": "Special Discount", "ingameorder": 12, "seteffects": ["Twin Strikes", "Drakan's Touch"], "fragmenttype": "Combat", "group": "?", "desc": ["Special attacks that cost more than ", ["50%", "40%", "25%"], " energy cost ", ["50%", "40%", "25%"], " instead."], "tier": 2, "level": 0, "XP": 0},
	{"name": "Superior Tracking", "ingameorder": 15, "seteffects": ["Last Recall", "Absolute Unit"], "fragmenttype": "Combat", "group": "Slayer", "desc": ["Superior slayer monsters have a 1 in ", ["150", "100", "30"], " chance of spawning during a slayer task for eligible slayer monsters."], "tier": 3, "level": 0, "XP": 0},
	{"name": "Tactical Duelist", "ingameorder": 2, "seteffects": ["Twin Strikes", "Absolute Unit"], "fragmenttype": "Combat", "group": "Melee", "desc": ["Melee weapon charges have a ", ["20%", "40%", "80%"], " chance to be saved."], "tier": 2, "level": 0, "XP": 0},
	{"name": "Thrall Damage", "ingameorder": 7, "seteffects": ["Chain Magic", "Endless Knowledge"], "fragmenttype": "Combat", "group": "Magic Combat", "desc": ["The max hit of thralls are increased by ", ["100%", "200%", "300%"], ". Damage is rounded up."], "tier": 2, "level": 0, "XP": 0},
	{"name": "Unholy Ranger", "ingameorder": 3, "seteffects": ["Double Tap", "Drakan's Touch"], "fragmenttype": "Combat", "group": "Ranged", "desc": ["Ranged weapon accuracy is increased by ", ["30%", "60%", "100%"], " with no prayer points remaining. Excludes the dwarf multicannon."], "tier": 1, "level": 0, "XP": 0},
	{"name": "Unholy Warrior", "ingameorder": 1, "seteffects": ["Knife's Edge", "Trailblazer"], "fragmenttype": "Combat", "group": "Melee", "desc": ["Melee weapon accuracy is increased by ", ["12%", "20%", "30%"], " with no prayer points remaining."], "tier": 1, "level": 0, "XP": 0},
	{"name": "Unholy Wizard", "ingameorder": 5, "seteffects": ["Chain Magic", "Drakan's Touch"], "fragmenttype": "Combat", "group": "Magic Combat", "desc": ["Magic attack accuracy is increased by ", ["40%", "70%", "125%"], " with no prayer points remaining."], "tier": 1, "level": 0, "XP": 0},
	{"name": "Venomaster", "ingameorder": 13, "seteffects": ["Fast Metabolism", "Absolute Unit"], "fragmenttype": "Combat", "group": "?", "desc": ["The player's attacks have a chance to inflict poison that starts at ", ["3", "5", "7"], " damage. Players will gain poison immunity at level 2, and venom immunity at level 3."], "tier": 1, "level": 0, "XP": 0},
	{"name": "Zamorakian Sight", "ingameorder": 19, "seteffects": ["Chain Magic", "Drakan's Touch"], "fragmenttype": "Combat", "group": "?", "desc": ["When wielding four Zamorak items, the player's accuracy for magic attacks is increased by ", ["50%", "125%", "250%"], "."], "tier": 4, "level": 0, "XP": 0}
];

function convertToClassname(n = "") {
	return n.toLowerCase().replace(/[^\w]/g, "");
}

function fragmentDesc(fragment) {
	let frag = fragment.slice(0); //probably unnecessary, I think it's the slice later on that's actually important
	let txt = "";
	for (let i = 0; i < frag.length; i++) {
		if (typeof frag[i] === "object") {
			let lvls = frag[i].slice(0); //why? -> https://stackoverflow.com/a/62597184
			for (let L = 0; L < lvls.length; L++) {
				lvls[L] = `<span class="leveleffect level-${L+1}">${lvls[L]}</span>`;
			}
			txt += lvls.join("/");
		} else {
			txt += frag[i];
		}
	}
	return txt;
}

function fragmentTable() {
	let txt = "<table><tr class='header_row'><th class='fragment_name' colspan='2'>Name</th><th class='fragment_level'>Lvl</th><th class='fragment_type'>Type</th><th class='fragment_seteffects' colspan='2'>Set Effects</th><th class='fragment_desc'>Fragment Level Effect / Description</th></tr>";
	for (let i = 0; i < fragments.length; i++) {
		let f = fragments[i];
		txt += `<tr class='fragment_row level-${f.level} ${convertToClassname(f.seteffects[0])} ${convertToClassname(f.seteffects[1])}' data-ingameorder='${f.ingameorder}'><td class='fragment_pic_cell'><span class='fragmentpic ${convertToClassname(f.name)}'></span><td class='fragment_name'>${f.name}</td><td class='fragment_level'>${f.level}</td><td class='fragment_type'>${f.fragmenttype + (f.tier > 0 ? " (T" + f.tier + ")" : "")}</td><td class='fragment_set' data-set='${convertToClassname(f.seteffects[0])}'>${f.seteffects[0]}</td><td class='fragment_set' data-set='${convertToClassname(f.seteffects[1])}'>${f.seteffects[1]}</td><td class='fragment_desc'>${fragmentDesc(f.desc)}</td></tr>`;
	}
	txt += "</table>";
	
	return txt;
}

function getFilters() {
	let filters = {levels: [], seteffects: []};
	document.querySelectorAll(".levelfilter").forEach(function(ele) {
		if (!ele.classList.contains("selected")) {
			filters.levels.push(ele.getAttribute("data-level"));
		}
	});
	let ms = document.getElementById("ms-seteffects").selectedOptions;
	for (let i = 0; i < ms.length ; i++) { filters.seteffects.push(ms[i].value); }
	return filters;
}

function applyFilters() {
	let filters = getFilters();
	let tableDiv = document.getElementById("fragmentTableDiv");
	
	tableDiv.className = "";
	
	for (let i = 0; i < filters.levels.length; i++) {
		tableDiv.classList.add("hidelevel-" + filters.levels[i]);
	}
	if (filters.seteffects.length > 0) {
		tableDiv.classList.add("filterbyset");
		for (let i = 0; i < filters.seteffects.length; i++) {
			tableDiv.classList.add("set-" + filters.seteffects[i]);
		}
	}
}

function saveLoad(action) {
	if (action === "save") {
		localStorage.setItem("osrs_leagues3", JSON.stringify(fragmentlevels));
	} else if (action === "load") {
		if (localStorage.getItem("osrs_leagues3")) {
			fragmentlevels = JSON.parse(localStorage.getItem("osrs_leagues3"));
			for (let i = 0; i < fragments.length; i++) {
				if (fragmentlevels[fragments[i].ingameorder] !== undefined && fragmentlevels[fragments[i].ingameorder] !== null) {
					fragments[i].level = fragmentlevels[fragments[i].ingameorder];
				} else {
					fragments[i].level = 0;
				}
			}
		}
	} else if (action === "delete") {
		localStorage.removeItem("osrs_leagues3");
	}
}

document.addEventListener("DOMContentLoaded", function() {
	saveLoad("load");
	
	fragments.sort(function(a, b) { return a.ingameorder - b.ingameorder; });
	document.getElementById("fragmentTableDiv").innerHTML = fragmentTable();
	
	document.querySelectorAll(".fragment_set").forEach(ele => ele.addEventListener("mouseenter", function() {
		let SET = ele.getAttribute("data-set");
		document.querySelectorAll(`.fragment_set[data-set='${SET}']`).forEach(el2 => el2.classList.add("sethover"));
	}));
	document.querySelectorAll(".fragment_set").forEach(ele => ele.addEventListener("mouseleave", function() {
		document.querySelectorAll(`.fragment_set.sethover`).forEach(el2 => el2.classList.remove("sethover"));
	}));
	
	document.querySelectorAll(".levelfilter").forEach(ele => ele.addEventListener("click", function() {
		this.classList.toggle("selected");
		applyFilters();
	}));
	
	document.getElementById("ms-seteffects").addEventListener("change", function() {
		applyFilters();
	});
	
	document.querySelectorAll(".fragment_level").forEach(ele => ele.addEventListener("click", function() {
		let papa = this.parentElement
		let lvl = Number(this.innerText);
		papa.classList.remove("level-" + lvl);
		lvl++;
		if (lvl > 3) { lvl = 0; }
		this.innerText = lvl;
		papa.classList.add("level-" + lvl);
		fragmentlevels[Number(papa.getAttribute("data-ingameorder"))] = lvl;
		
		saveLoad("save");
	}));
});