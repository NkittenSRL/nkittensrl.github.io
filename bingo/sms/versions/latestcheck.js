const bingoVersions = [
	{vNR: 1, version: "blue coin bingo (joke, not balanced)", date: "2026", isBeta: false, url: "https://nkittensrl.github.io/bingo/sms/archive/bluecoin/"},
	{vNR: 1, version: "v1 (on the new layout with popout functionality)", date: "2026", isBeta: false, url: "https://nkittensrl.github.io/bingo/sms/archive/v1popout/"},
	{vNR: 1, version: "v1", date: "2012", isBeta: false, url: "https://nkittensrl.github.io/bingo/sms/archive/v1/"},
	{vNR: 1, version: "v1new", date: "2012", isBeta: false, url: "https://nkittensrl.github.io/bingo/sms/archive/v1new/"},
	{vNR: 1, version: "v1c", date: "2012", isBeta: false, url: "https://nkittensrl.github.io/bingo/sms/archive/v1c/"},
	{vNR: 2, version: "v2test 2", date: "12/12/2013", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/archive/testv2/dec12/"},
	{vNR: 2, version: "v2test 3", date: "16/01/2014", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/archive/testv2/jan16/"},
	{vNR: 2, version: "v2", date: "01/11/2014", isBeta: false, url: "https://nkittensrl.github.io/bingo/sms/v2/"},
	{vNR: 3, version: "v3 beta 1", date: "19/02/2015", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/beta/3/"},
	{vNR: 3, version: "v3 beta 2", date: "20/02/2015", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/beta/3b/"},
	{vNR: 3, version: "v3 beta 3", date: "22/02/2015", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/beta/3c/"},
	{vNR: 3, version: "v3 beta 4", date: "24/02/2015", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/beta/3d/"},
	{vNR: 3, version: "v3 beta 5", date: "27/03/2015", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/beta/3e/"},
	{vNR: 3, version: "v3 beta 6", date: "03/02/2016", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/beta/3f/"},
	{vNR: 3, version: "v3 beta 7", date: "11/12/2016", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/beta/3g/"},
	{vNR: 3, version: "v3 beta 8", date: "05/06/2018", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/beta/3h/"},
	{vNR: 3, version: "v3 beta 9", date: "29/08/2018", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/beta/3i/"},
	{vNR: 3, version: "v3 beta 10", date: "04/07/2019", isBeta: true, url: "https://nkittensrl.github.io/bingo/sms/beta/3j/"}
];

document.addEventListener("DOMContentLoaded", function() {
	// comparing to an undeclared variable throws an error, so check with typeof first
	if (typeof thisVersion === "undefined" || bingoVersions[bingoVersions.length-1].version !== thisVersion) {
		document.getElementById("results").insertAdjacentHTML("afterbegin", "<div class='infoboxRed'><span class='big'>This version is outdated!</span><br /><br />Please use the <a href='" + bingoVersions[bingoVersions.length-1].url + "'>latest version</a>.</div>");
	}
});