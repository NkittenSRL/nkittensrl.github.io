const weapons = weaponlist.weapons;
const customScroll = {"enabled": true, "ms-types": 0, "ms-subs": 0, "ms-specials": 0};

function multiselectValues(ms_id) {
	const selected = document.getElementById(ms_id)?.selectedOptions;
	if (selected === undefined) return [];

	const vals = [];
	for (let ele of selected) {
		vals.push(ele.value);
	}

	return vals;
}

function fillMultiselects() {
	const types = [], subs = [], specials = [];
	for (let wpn of weapons) {
		if (!types.includes(wpn.type)) types.push(wpn.type);
		if (!subs.includes(wpn.sub)) subs.push(wpn.sub);
		if (!specials.includes(wpn.special)) specials.push(wpn.special);
	}

	const msTypes = document.getElementById("ms-types");
	msTypes.innerHTML = "";
	const msSubs = document.getElementById("ms-subs");
	msSubs.innerHTML = "";
	const msSpecials = document.getElementById("ms-specials");
	msSpecials.innerHTML = "";

	for (let val of types) {
		const opt = document.createElement("option");
		opt.value = val;
		opt.innerText = (weaponlist.types?.[val] ? weaponlist.types?.[val] : val);
		if (weaponlist.types?.[val] === undefined) console.warn(`No full name found for weapon type "${val}".`);
		msTypes.append(opt);
	}
	subs.sort();
	for (let val of subs) {
		const opt = document.createElement("option");
		opt.value = val;
		opt.innerText = val;
		msSubs.append(opt);
	}
	specials.sort();
	for (let val of specials) {
		const opt = document.createElement("option");
		opt.value = val;
		opt.innerText = val;
		msSpecials.append(opt);
	}
}

function checkWeaponRequirements(wpn) {
	const name = document.getElementById("txt-name").value;

	const types = multiselectValues("ms-types");
	const subs = multiselectValues("ms-subs");
	const specials = multiselectValues("ms-specials");

	// const sheldononly = document.getElementById("chk-sheldon").checked;
	// const sheldonlist = ["Sploosh-o-matic 7", "Aerospray PG", "N-ZAP '83", "Grim Range Blaster", "Cherry H-3 Nozzlenose", "CoroCoro Splat Roller", "Bento Splat Charger", "Bento Splatterscope", "Heavy Splatling Remix"];

	const costMin = Number(document.getElementById("nr-mincost").value);
	const costMax = Number(document.getElementById("nr-maxcost").value);
	const levelMin = Number(document.getElementById("nr-minlevel").value);
	const levelMax = Number(document.getElementById("nr-maxlevel").value);

	// if (sheldononly === true && sheldonlist.length > 0 && !sheldonlist.includes(wpn.name)) return false;

	if (types.length > 0 && !types.includes(wpn.type)) return false;
	if (subs.length > 0 && !subs.includes(wpn.sub)) return false;
	if (specials.length > 0 && !specials.includes(wpn.special)) return false;

	if (wpn.level < levelMin || wpn.level > levelMax) return false;
	if (wpn.price < costMin || wpn.price > costMax) return false;

	const rE = new RegExp(name, "i");
	if (rE.test(wpn.name) === false) return false;

	return true;
}

function weaponBox(wpn) {
	let txt = "<div class='weapon' data-id='" + wpn.id + "'>";
	txt += "<span class='weaponpic " + wpn.pic + "'></span><div class='weaponname'>" + wpn.name + "</div>";
	txt += "<span class='subpic " + wpn.sub.toLowerCase().replace(/ /g, "-") + "'></span><span class='weaponsub'>" + wpn.sub + "</span>"
	txt += "<span class='specialpic " + ((wpn.special.toLowerCase() == "bomb rush") ? wpn.sub.split(" ")[0].toLowerCase() + "-" : "") + wpn.special.toLowerCase().replace(/ /g, "-") + "'></span>"
	txt += "<span class='weaponspecial'>" + wpn.special + "</span>";
	txt += "<span class='level'><span class='levelcolor'>Level</span> <span class='levelnumber'>" + wpn.level + "</span></span><span class='cost'>" + wpn.price + "</span>";
	txt += "<div class='DepletionContainer'><span class='depletionTxt'>Special<br />Depletion:</span> <span class='depletion'>" + ((wpn.depletion === "" || wpn.depletion === undefined) ? "Unknown" : wpn.depletion) + "</span></div>";
	txt += "</div>";
	return txt;
}

function makeWeaponList(wpns = weapons) {
	let txt = "";
	if (wpns.length > 0) {
		for (let i in wpns) {
			txt = txt + weaponBox(wpns[i]);
		}
	}
	const weaponsDiv = document.getElementById("weapons");
	weaponsDiv.innerHTML = txt;
	weaponsDiv.classList.toggle("noweapons", (wpns.length > 0 ? false : true));
}

function filterWeaponList() {
	let found = false;
	document.querySelectorAll(".weapon").forEach(ele => {
		const id = Number(ele.getAttribute("data-id"));
		const passed = checkWeaponRequirements(weapons[id]);
		ele.classList.toggle("hidden", !passed);
		if (passed) found = true;
	});
	document.getElementById("weapons").classList.toggle("noweapons", !found);
}

function clearSettings(sel) {
	if (sel === "types" || sel === "all") {
		document.querySelectorAll("#ms-types option:checked").forEach(ele => ele.selected = false);
	}
	if (sel === "subs" || sel === "all") {
		document.querySelectorAll("#ms-subs option:checked").forEach(ele => ele.selected = false);
	}
	if (sel === "specials" || sel === "all") {
		document.querySelectorAll("#ms-specials option:checked").forEach(ele => ele.selected = false);
	}

	if (sel === "all") {
		document.getElementById("nr-mincost").value = 0;
		document.getElementById("nr-maxcost").value = 9999999;
		document.getElementById("nr-minlevel").value = 1;
		document.getElementById("nr-maxlevel").value = 99;
		document.getElementById("txt-name").value = "";
		// document.getElementById("chk-sheldon").checked = false;
	}
}

document.addEventListener("DOMContentLoaded", function () {
	fillMultiselects();
	for (let i in weapons) {
		weapons[i].id = i;
	}
	makeWeaponList();

	//, #chk-sheldon
	document.querySelectorAll("#ms-types, #ms-subs, #ms-specials").forEach(ele => ele.addEventListener("change", function () {
		filterWeaponList();
	}));

	document.getElementById("txt-name").addEventListener("keyup", function () {
		filterWeaponList();
	});

	document.querySelectorAll("#nr-mincost, #nr-maxcost, #nr-minlevel, #nr-maxlevel").forEach(ele => ele.addEventListener("change", function () {
		const min = Number(this.getAttribute("min"));
		const max = Number(this.getAttribute("max"));
		const val = Number(this.value);

		if (val < min) {
			this.value = min;
		} else if (val > max) {
			this.value = max;
		}

		filterWeaponList();
	}));

	document.querySelectorAll(".clearselection").forEach(ele => ele.addEventListener("click", function () {
		clearSettings(this.getAttribute("data-clear"));
		filterWeaponList();
	}));

	document.getElementById("chk-customscroll").addEventListener("change", function () {
		customScroll.enabled = this.checked;
		if (this.checked === true) {
			for (let ele of ["ms-types", "ms-subs", "ms-specials"]) {
				customScroll[ele] = document.getElementById(ele).scrollTop;
			}
		}
	});
	document.querySelectorAll("select").forEach(ele => ele.addEventListener("scroll", function (evt) {
		// idk, I tried my best..
		if (customScroll.enabled === true) {
			const option_h = ele.children[0].getBoundingClientRect().height;
			const max = option_h * (Number(ele.getAttribute("size")) - 1);

			let top = ele.scrollTop;
			const diff = top - customScroll[ele.id];

			if (Math.abs(diff) > max) {
				top = customScroll[ele.id] + max * (diff < 0 ? -1 : 1);
			}

			const mod = top % option_h;
			if (mod !== 0) top += (diff < 0 ? option_h - mod : -1 * mod);

			ele.scrollTop = top;
			customScroll[ele.id] = top;
		}
	}));
});