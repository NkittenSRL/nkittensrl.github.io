window.trackerData = [
  {
    regex: /Win all 3 Market minigames/,
    options: {
      tokens: {
        rows: [["slingshot", "bombchu", "lens"]],
      },
    },
  },
  {
    regex: /Destroy 13 unique beehives/,
    options: {
      counter: {
        denominator: 13,
        icon: "beehive",
      },
    },
  },
  {
    regex: /Open a small chest from every adult dungeon/,
    options: {
      tokens: {
        rows: [["forest", "fire", "water", "shadow", "spirit"]],
      },
    },
  },
  {
    regex: /18 blue-warp dungeon skulls/,
    options: {
      counter: {
        denominator: 18,
        icon: "skull",
      },
    },
  },
  {
    regex: /2 elemental arrows/,
    options: {
      tokens: {
        rows: [["fire-arrow", "ice-arrow", "light-arrow"]],
      },
    },
  },
  {
    regex: /Gossip Stones/,
    options: {
      counter: {
        denominator: 13,
        icon: "gossip-stone",
      },
    },
  },
  {
    regex: /3 Shields/,
    options: {
      tokens: {
        rows: [
          ["deku-shield", "hylian-shield", "mirror-shield"],
          ["bottle", "bottle", "bottle"],
        ],
      },
      replaceText: "3 Shields + 3 bottle slots",
    },
  },
  {
    regex: /overworld/,
    options: {
      counter: {
        denominator: 20,
        icon: "chest",
      },
    },
  },
  {
    regex: /Enter 3 adult/,
    options: {
      tokens: {
        rows: [["forest", "fire", "water", "shadow", "spirit"]],
      },
    },
  },
  {
    regex: /Talk to Ruto/,
    options: {
      tokens: {
        rows: [["jabu", "water"]],
      },
    },
  },
  {
    regex: /Heart Containers/,
    options: {
      counter: {
        denominator: 4,
        icon: "hc",
      },
    },
  },
  {
    regex: /Big Poes/,
    options: {
      counter: {
        denominator: 3,
        icon: "big-poe",
      },
    },
  },
  {
    regex: /small keys in GTG/,
    options: {
      counter: {
        icon: "key",
        denominator: 5,
      },
    },
  },
  {
    regex: /fairy spells/,
    options: {
      tokens: {
        rows: [["dins-fire", "farores-wind", "nayrus-love"]],
      },
    },
  },
  {
    regex: /Heart Pieces/,
    options: {
      counter: {
        icon: "hp",
        denominator: 12,
      },
    },
  },
];