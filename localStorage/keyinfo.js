const pageOrder = [
	"Splatoon 3 - Randomizer",
	"Splatoon 3 - Elimination mode",
	"Splatoon 3 - Freshness tracker",
	"Splatoon 3 - BTS",
	
	"Splatoon 2 - Randomizer",
	"Splatoon 2 - Elimination mode",
	
	"Splatoon - Randomizer",
	"Splatoon - Elimination mode",
	
	"Zelda: Tears of the Kingdom - Armor tracker",
	"TotK - BTS",
	
	"OSRS - Highscores sorter",
	"OSRS - Gridmaster",
	"OSRS - Leagues 3: Shattered Relics",
	
	"Bingo - Squareflip",
	
	"Timestamps tool",
	
	"Unknown Keys"
];

const keyInfo = {
	"splatoon3_random": {"page": "Splatoon 3 - Randomizer", "desc": "Contains all randomizer settings, including which stages and weapons are enabled to be randomly selected."},
	"splatoon3_elim_settings": {"order": 1, "page": "Splatoon 3 - Elimination mode", "desc": "Contains saved settings."},
	"splatoon3_elim_weapons": {"order": 2, "page": "Splatoon 3 - Elimination mode", "desc": "Remembers the status of every weapon (available or banned) and the currently drafted teams."},
	"splatoon3_freshness_levels": {"order": 1, "page": "Splatoon 3 - Freshness tracker", "desc": "Contains the freshness level of each weapon."},
	"splatoon3_freshness_filters": {"order": 2, "page": "Splatoon 3 - Freshness tracker", "desc": "Contains saved filters (which freshness levels to show)."},
	"splatoon3_bts": {"page": "Splatoon 3 - BTS"},
	
	"splatoon2_random": {"page": "Splatoon 2 - Randomizer", "desc": "Contains all randomizer settings, including which stages and weapons are enabled to be randomly selected."},
	"splatoon2_elim_settings": {"order": 1, "page": "Splatoon 2 - Elimination mode", "desc": "Contains saved settings."},
	"splatoon2_elim_weapons": {"order": 2, "page": "Splatoon 2 - Elimination mode", "desc": "Remembers the status of every weapon (available or banned) and the currently drafted teams."},
	
	"splatoon_random": {"page": "Splatoon - Randomizer", "desc": "Contains all randomizer settings, including which stages and weapons are enabled to be randomly selected."},
	"splatoon_random_imgur": {"page": "Splatoon - Randomizer", "desc": "(no longer usable) Contained settings related to uploading images to imgur."},
	"splatoon_elim_settings": {"order": 1, "page": "Splatoon - Elimination mode", "desc": "Contains saved settings."},
	"splatoon_elim_weapons": {"order": 2, "page": "Splatoon - Elimination mode", "desc": "Remembers the status of every weapon (available or banned) and the currently drafted teams."},
	
	"totk_armor_levels": {"order": 1, "page": "Zelda: Tears of the Kingdom - Armor tracker", "desc": "Contains the levels of each piece of armor."},
	"totk_armor_manualCompletedMaterials": {"order": 2, "page": "Zelda: Tears of the Kingdom - Armor tracker", "desc": "Contains a list of all materials that were manually marked as completed."},
	"totk_armor_filters": {"order": 3, "page": "Zelda: Tears of the Kingdom - Armor tracker", "desc": "Contains all saved settings and filters."},
	"totk_armor_showWelcomeAfter": {"order": 4, "page": "Zelda: Tears of the Kingdom - Armor tracker", "desc": "Controls when to show the instructional welcome message again."},
	"totk_bts": {"page": "TotK - BTS"},
	
	"bingo_squareflip_settings": {"order": 1, "page": "Bingo - Squareflip", "desc": "Contains saved settings."},
	"bingo_squareflip_boardState": {"order": 2, "page": "Bingo - Squareflip", "desc": "Remembers your most recent board (goals and which squares are flipped)."},
	
	"osrs_highscores_sort": {"page": "OSRS - Highscores sorter", "desc": "Remembers your RuneScape name and selected game mode."},
	"osrs_gridmaster_tasks": {"order": 1, "page": "OSRS - Gridmaster", "desc": "Remembers when each task was completed."},
	"osrs_gridmaster_settings": {"order": 2, "page": "OSRS - Gridmaster", "desc": "Contains saved settings."},
	"osrs_leagues3": {"page": "OSRS - Leagues 3: Shattered Relics", "desc": "Contains the levels of each relic fragment."},
	
	"timestamps_autocopy": {"page": "Timestamps tool", "desc": "Remembers whether to automatically copy generated timestamps."}
};
const renameKeys = {
	// "from":"to"
	"nkSPLATOON2RANDOMIZER": "splatoon2_random",
	
	"nkSPLATOONRANDOMIZER": "splatoon_random",
	"nkSPLATOONRANDOMIZER_IMGUR": "splatoon_random_imgur",
	
	"bingo_squareflip_custom": "bingo_squareflip_settings",
	"bingo_squareflip_custom_boardState": "bingo_squareflip_boardState",
	
	"gridmaster": "osrs_gridmaster_tasks",
	"gridmaster_settings": "osrs_gridmaster_settings",
	"nkOSRS_leagues3": "osrs_leagues3"
};