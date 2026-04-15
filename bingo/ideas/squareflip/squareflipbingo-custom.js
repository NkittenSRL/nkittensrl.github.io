const saveinputs = {
	"nr-board-cols": "5",
	"nr-board-rows": "5",
	"txt-seed": "",
	"chk-saveboardstate": true,
	"txt-default-1": "Slot {#}",
	"txt-default-2": "Back {#}",
	"textarea-list-1": "",
	"textarea-list-2": "",
	"chk-repeat-1": false,
	"chk-repeat-2": false,
	"radio-1": "inorder",
	"radio-2": "random"
};
let goallists = [];
let defaultvalues = [];
let myRNG;

function randMinMax(min,max,useSEED = true) {
	return Math.floor((myRNG.quick()*((max+1)-min))+min);
}

function saveBoardState() {
	if (!document.getElementById("chk-saveboardstate").checked) return;
	localStorage.bingo_squareflip_custom_boardState = JSON.stringify(goallists);
}

function createEmptyBoard(cols = 5, rows = 5) {
	let board = "";
	for (let r = 1; r <= rows; r++) {
		for (let c = 1; c <= cols; c++) {
			board += `<div class="cell-wrapper"><div class="cell" data-cell="${((r-1)*cols) + c}" data-row="${r}" data-col="${c}" data-shownside="front"><div class="cell_front"></div><div class="cell_back"></div></div></div>`;
		}
	}
	const boardEle = document.getElementById("bingoBoard");
	boardEle.innerHTML = board;
	boardEle.setAttribute("data-cols", cols);
	boardEle.setAttribute("data-rows", rows);
	boardEle.style.setProperty("--cols", cols);
}

function setCellContent(cell, side, content) {
	const listNr = (side === "front" ? 1 : 2);
	let defaultValue = defaultvalues[listNr];
	if (content === false) {
		content = defaultValue.replaceAll("{#}", cell);
	}
	document.querySelector(`#bingoBoard [data-cell="${cell}"] .cell_${side}`).innerHTML = content;
}

function makeGoalList(list = [], count = list.length, listType = "random", repeat = false) {
	let result = [];
	let remaininglist = structuredClone(list);
	if (repeat === true) {
		let safetyX = 0;
		while (remaininglist.length < count) {
			remaininglist = remaininglist.concat(structuredClone(list));
			safetyX++;
			if (safetyX >= 100) {
				console.warn("SAFETY BREAK");
				break;
			}
		}
	}
	else {
		for (let i = remaininglist.length; i < count; i++) {
			remaininglist.push(false);
		}
	}
	
	if (listType === "inorder") {
		result = remaininglist.slice(0, count);
	}
	// because of the way remaininglist is filled pre-emptively, it's possible to have some goals show up more than others
	// eg. [1,2,3] with 4 slots => choose 4 out of [1,2,3,1,2,3] => could end up with one option never chosen (like [1,3,3,1])
	// keep in mind if I want to change it later - when filling the list only after it's empty, you need to randomize which slots they go to (could randomize the slots at the end simply by re-randomizing the first results)
	// or else in this example [1,2,3] would always randomize between the first 3 slots, and then one of [1,2,3] goes in slot 4
	else if (listType === "random") {
		for (let i = 0; i < count; i++) {
			const RNG = randMinMax(0, remaininglist.length-1);
			result.push(remaininglist.splice(RNG, 1)[0]);
		}
	}
	result.unshift("** FILLER **");
	return result;
}

/* function randomTest(SEED) {
	myRNG = new Math.seedrandom(SEED);
	console.log(myRNG.quick());
	console.log(myRNG.quick());
	myRNG = new Math.seedrandom(SEED);
	console.log(myRNG.quick());
	console.log(myRNG.quick());
	myRNG = new Math.seedrandom();
	console.log(myRNG.quick());
	console.log(myRNG.quick());
	myRNG = new Math.seedrandom();
	console.log(myRNG.quick());
	console.log(myRNG.quick());
} */

function generateBoard(savedBoard) {
	if (savedBoard !== undefined) {
		goallists = savedBoard;
		defaultvalues = goallists[0][0].defaultvalues;
		createEmptyBoard(goallists[0][0].cols, goallists[0][0].rows);
		for (let i = 1; i < goallists[0].length; i++) {
			const listNr = goallists[0][i];
			const sideTo = [0, "front", "back"][listNr];
			
			setCellContent(i, sideTo, goallists[listNr][i]);
			document.querySelector(`#bingoBoard [data-cell="${i}"]`).setAttribute("data-shownside", sideTo);
		}
		return;
	}
	
	goallists = [];
	
	const cols = Number(document.getElementById("nr-board-cols").value);
	const rows = Number(document.getElementById("nr-board-rows").value);
	const count = cols * rows;
	createEmptyBoard(cols, rows);
	
	const SEED = document.getElementById("txt-seed").value;
	// The standard ARC4 key scheduler cycles short keys, which means that seedrandom('ab') is equivalent to seedrandom('abab') and 'ababab'. Therefore it is a good idea to add a terminator to avoid trivial equivalences on short string seeds, e.g., Math.seedrandom(str + '\0').
	if (SEED !== "") myRNG = new Math.seedrandom(SEED + "\0");
	else myRNG = new Math.seedrandom(); //no seed = random seed, make sure not to pass in an empty string, as that would produce the same result each time
	
	document.querySelectorAll("#settings fieldset").forEach(fset => {
		const nr = fset.getAttribute("data-listid");
		const radio = fset.querySelector(`input[name="radio-${nr}"]:checked`)?.value;
		const repeat = fset.querySelector(`#chk-repeat-${nr}`).checked;
		const list_in = fset.querySelector(`.textarea-list`).value.trim().split("\n").map(val => val.trim()).filter(val => val !== "");
		
		goallists[nr] = makeGoalList(list_in, count, radio, repeat);
		defaultvalues[nr] = fset.querySelector(".txt-default-value").value;
	});
	goallists[0] = Array(count).fill(1);
	goallists[0].unshift({cols: cols, rows: rows, defaultvalues: defaultvalues, note: "rest of array stores which side of the cells is showing (1=front, 2=back)"});
	
	for (let i = 1; i < goallists[1].length; i++) {
		setCellContent(i, "front", goallists[1][i]);
	}
	saveBoardState();
}

document.addEventListener("DOMContentLoaded", function() {
	if (localStorage.bingo_squareflip_custom !== undefined) {
        const saved = JSON.parse(localStorage.bingo_squareflip_custom);
        for (let inp in saved) {
			const isRADIO = inp.slice(0,6) === "radio-";
            let ele = document.querySelector("#" + inp);
			if (isRADIO) ele = document.querySelector(`input[name="${inp}"][value="${saved[inp]}"]`);
			
            if (ele) {
				if (isRADIO) ele.checked = true;
				else if (inp.slice(0,4) === "chk-") ele.checked = saved[inp];
				else ele.value = saved[inp];
			}
            else console.warn(`input "${inp}" not found.`);
            if (saveinputs[inp] !== undefined) saveinputs[inp] = saved[inp];
            else console.warn(`saveinputs[${inp}] not defined.`);
        }
    }
	
	document.querySelectorAll("input[type='number'][min][max]").forEach(ele => ele.addEventListener("change", function () {
		const min = Number(this.getAttribute("min"));
		const max = Number(this.getAttribute("max"));
		const val = Number(this.value);

		if (val < min) {
			this.value = min;
		} else if (val > max) {
			this.value = max;
		}
	}));
	document.getElementById("btn-generateboard").addEventListener("click", function(evt) {
		generateBoard();
	});
	
	document.getElementById("bingoBoard").addEventListener("click", function(evt) {
		const cell = evt.target.closest(".cell");
		if (cell) {
			const cellNr = Number(cell.getAttribute("data-cell"));
			const sideTo = (cell.getAttribute("data-shownside") === "front" ? "back" : "front");
			const listNr = (sideTo === "front" ? 1 : 2);
			
			setCellContent(cellNr, sideTo, (goallists[listNr][cellNr]));
			cell.setAttribute("data-shownside", sideTo);
			goallists[0][cellNr] = listNr;
			saveBoardState();
		}
	});
	
	document.querySelectorAll("input, textarea").forEach(ele => ele.addEventListener("change", function () {
        this.value = this.value.trim().split("\n").map(val => val.trim()).join("\n");
		let IDorNAME = this.id;
		let VALUE = this.value;
		if (this.id.slice(0,6) === "radio-") {
			IDorNAME = this.getAttribute("name");
			//this.value from above should be fine, but just in case the change event triggers on a radio button that isn't checked (in some way I haven't thought of)
			//just using a dropdown would be easier :3
			VALUE = document.querySelector(`input[name="${IDorNAME}"]:checked`)?.value;
		}
		else if (this.id.slice(0,4) === "chk-") VALUE = this.checked;
		
        if (saveinputs[IDorNAME] === undefined) return;
		saveinputs[IDorNAME] = VALUE;
        localStorage.bingo_squareflip_custom = JSON.stringify(saveinputs);
		
		if (this.id === "chk-saveboardstate") {
			if (VALUE === true) saveBoardState();
			else localStorage.removeItem("bingo_squareflip_custom_boardState");
		}
    }));
	
	if (localStorage.bingo_squareflip_custom_boardState !== undefined) {
		generateBoard(JSON.parse(localStorage.bingo_squareflip_custom_boardState));
	}
	else generateBoard();
});