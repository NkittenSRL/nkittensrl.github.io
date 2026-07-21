const saveinputs = {
	"txt-playername": "",
	"dd-gamemode": "regular"
};

function make_hs_url(playername, gm = "regular") {
	const url_base1 = "https://secure.runescape.com/m=";
	const url_base2 = "/index_lite.json?player=";
	const gamemodes = {
		"regular": "hiscore_oldschool", 
		"ironman": "hiscore_oldschool_ironman",
		"ultimate": "hiscore_oldschool_ultimate",
		"hardcore": "hiscore_oldschool_hardcore_ironman",
		"deadman": "hiscore_oldschool_deadman",
		"seasonal": "hiscore_oldschool_seasonal",
		"tournament": "hiscore_oldschool_tournament",
		"freshstart": "hiscore_oldschool_fresh_start"
	};
	
	if (gamemodes[gm] !== undefined) { gm = gamemodes[gm]; }
	else { gm = gamemodes["regular"]; }
	
	return url_base1 + gm + url_base2 + playername;
}

function sortHighscores(stats, separateLvls = true) {
	function sepThousands(num, separator = ",") {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
	}
	
	stats.sort(function(a, b) {
		if (Number(a.xp) < Number(b.xp)) {return -1;}
		else if (Number(a.xp) > Number(b.xp)) {return 1;}
		else if (a.name < b.name) {return -1;}
		else if (a.name > b.name) {return 1;}
		else {return 0;}
	});

	let txt = "";
	let prevLvl = 0;
	for (let STAT of stats) {
		if (STAT.name === "Overall") {
			txt += "<br>"; //add an extra line break before total level
		}
		else if (separateLvls === true && prevLvl > 0 && prevLvl < STAT.level) {
			txt += `<div class="big">===== Level ${STAT.level} (+${(STAT.level - prevLvl)}) =====</div>`;
		}
		else if (separateLvls === true && prevLvl === 0) {
			txt += `<div class="big">======= Level ${STAT.level} =======</div>`;
		}
		txt += `<b>${STAT.name}${(separateLvls !== true || STAT.name === "Overall" ? ` - ${STAT.level}` : "")}</b> (${sepThousands(STAT.xp)} XP)<br>`;
		
		prevLvl = STAT.level;
	}

	return txt;
}

document.addEventListener("DOMContentLoaded", function() {
	if (localStorage.getItem("osrs_highscores_sort") !== null) {
        const saved = JSON.parse(localStorage.getItem("osrs_highscores_sort"));
        for (let inp in saved) {
            const ele = document.querySelector("#" + inp);
            if (ele) ele.value = saved[inp];
            else console.warn(`#${inp} not found.`)
            if (saveinputs[inp] !== undefined) saveinputs[inp] = saved[inp];
            else console.warn(`saveinputs[${inp}] not defined.`)
        }
    }
	
	document.getElementById("btn-fetchHighscores").addEventListener("click", function() {
		const playername = document.getElementById("txt-playername").value;
		const gamemode = document.getElementById("dd-gamemode").value;
		const url = make_hs_url(playername, gamemode);
		
        /* fetch(url)
        .then(response => response.json() )
        .then(data => {
            // let str = JSON.stringify(data, null, '\t');
			document.getElementById("out").innerHTML = sortHighscores(data);
        })
        .catch(err => {
			document.getElementById("hs-url").setAttribute("href", url);
			document.getElementById("hs-url").innerText = url;
			document.getElementById("manual-input").classList.remove("hidden");
			
            let nm = err.name;  //Error Type
            let msg = err.message;  //The error message
            console.error(err);
            // alert(`CATCH: ${nm} - ${msg}`);
        }); */
		
		document.getElementById("hs-url").setAttribute("href", url);
		document.getElementById("hs-url").innerText = url;
		document.getElementById("manual-input").classList.remove("hidden");
	});
	
	document.getElementById("btn-manualparse").addEventListener("click", function() {
		document.getElementById("out").innerHTML = sortHighscores(JSON.parse(document.getElementById("txt-manual").value).skills);
		document.getElementById("txt-manual").value = "";
		document.getElementById("manual-input").classList.add("hidden");
	});
	
	document.querySelectorAll("input, select").forEach(ele => ele.addEventListener("change", function () {
        this.value = this.value.trim();
        if (saveinputs[this.id] === undefined) return;

        saveinputs[this.id] = this.value;
        localStorage.setItem("osrs_highscores_sort", JSON.stringify(saveinputs));
    }));
});