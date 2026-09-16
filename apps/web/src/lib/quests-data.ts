export interface QuestStep {
  readonly id: string;
  readonly order: number;
  readonly title: string;
  readonly location: string;
  readonly description: string;
  readonly flagId: number;
  readonly altFlagIds?: readonly number[];
  readonly graceFlagIds?: readonly number[];
  readonly bossFlagIds?: readonly number[];
  readonly itemNames?: readonly string[];
  readonly missable?: boolean;
  readonly requiresBefore?: string;
  readonly lockoutFlagId?: number;
  readonly rewards?: readonly string[];
}

export interface Questline {
  readonly id: string;
  readonly name: string;
  readonly character: string;
  readonly category: 'Major Ending' | 'Companion' | 'Side Quest';
  readonly summary: string;
  readonly endingLink?: string;
  readonly steps: readonly QuestStep[];
}

// Global world flags for lockout detection
export const WORLD_FLAGS = {
  GODRICK_DEFEATED: 10000800,
  RADAHN_DEFEATED: 310,
  MORGOTT_DEFEATED: 11000800,
  FIRE_GIANT_DEFEATED: 11000800,
  MALIKETH_DEFEATED: 13000800,
  ERDTREE_BURNING: 1039500900,
} as const;

export const QUESTLINES: readonly Questline[] = [
  {
    id: 'ranni',
    name: 'Ranni the Witch',
    character: 'Ranni',
    category: 'Major Ending',
    endingLink: 'Age of Stars Ending',
    summary:
      'Aid Lunar Princess Ranni in forging an age free from the Greater Will, unlocking the iconic Dark Moon Greatsword and the Age of Stars ending.',
    steps: [
      {
        id: 'ranni-1',
        order: 1,
        title: 'Receive Spirit Calling Bell',
        location: 'Limgrave — Church of Elleh',
        description:
          'Encounter Ranni introducing herself as Renna at night at Church of Elleh. She grants the Spirit Calling Bell and Lone Wolf Ashes.',
        flagId: 101061,
        itemNames: ['Spirit Calling Bell', 'Lone Wolf Ashes'],
        rewards: ['Spirit Calling Bell', 'Lone Wolf Ashes'],
      },
      {
        id: 'ranni-2',
        order: 2,
        title: "Pledge Service at Ranni's Rise",
        location: 'Liurnia — Three Sisters',
        description:
          "Clear Carian Manor and speak to Ranni atop her tower. Agree to enter her service. Talk to the spectral projections of Blaidd, Iji, and Seluvis downstairs, then speak to Ranni once more to lift the barrier.",
        flagId: 1034500735,
        graceFlagIds: [76228], // Ranni's Rise grace
        requiresBefore: 'Do before giving Amber Starlight draught',
      },
      {
        id: 'ranni-3',
        order: 3,
        title: 'Meet Blaidd in Siofra & Consult Sellen',
        location: 'Siofra River / Waypoint Ruins',
        description:
          'Meet Blaidd near the cliff edge in Siofra River. Consult Seluvis at his Rise for a letter of introduction, then take it to Sorceress Sellen in Waypoint Ruins. She reveals that Radahn holds the stars in place.',
        flagId: 1034500737,
        altFlagIds: [1034500738, 1034500739],
      },
      {
        id: 'ranni-4',
        order: 4,
        title: 'Slay Starscourge Radahn',
        location: 'Caelid — Redmane Castle',
        description:
          'Defeat General Radahn in the Radahn Festival. The falling star strikes Limgrave, opening the pathway to the sunken city of Nokron.',
        flagId: 310,
        bossFlagIds: [310],
        itemNames: ["Radahn's Great Rune", 'Remembrance of the Starscourge'],
        rewards: ["Radahn's Great Rune", 'Remembrance of the Starscourge'],
      },
      {
        id: 'ranni-5',
        order: 5,
        title: 'Retrieve the Fingerslayer Blade',
        location: "Nokron — Night's Sacred Ground",
        description:
          "Descend into Nokron via the crater in Mistwood. Navigate to Night's Sacred Ground and open the grand chest beneath the giant skeleton throne.",
        flagId: 1034500740,
        itemNames: ['Fingerslayer Blade'],
        rewards: ['Fingerslayer Blade'],
      },
      {
        id: 'ranni-6',
        order: 6,
        title: 'Deliver Blade & Receive Carian Inverted Statue',
        location: "Liurnia — Ranni's Rise",
        description:
          'Deliver the Fingerslayer Blade to Ranni. She thanks you, gifts the Carian Inverted Statue, and departs on her journey. (Warning: Seluvis dies upon this step).',
        flagId: 1034500745,
        itemNames: ['Carian Inverted Statue'],
        graceFlagIds: [71214], // Ainsel River Main (unlocked via Renna's Rise teleporter)
        rewards: ['Carian Inverted Statue'],
      },
      {
        id: 'ranni-7',
        order: 7,
        title: 'Miniature Ranni & The Baleful Shadow',
        location: 'Ainsel River Main / Nokstella Waterfall Basin',
        description:
          'Climb Renna’s Rise and use the waygate to Ainsel River. Pick up Miniature Ranni and talk to her 3 times at the Site of Grace. Proceed through Nokstella and defeat the Baleful Shadow invader.',
        flagId: 1034500750,
        itemNames: ['Miniature Ranni', 'Discarded Palace Key'],
        graceFlagIds: [71215, 71216, 71219], // Nokstella, Lake of Rot, Nokstella Waterfall Basin
        rewards: ['Discarded Palace Key'],
      },
      {
        id: 'ranni-8',
        order: 8,
        title: 'Unlock Dark Moon Ring & Slay Astel',
        location: 'Raya Lucaria Grand Library / Lake of Rot',
        description:
          'Use the Discarded Palace Key to unlock the ornate chest beside Rennala in the Grand Library to claim the Dark Moon Ring. Then cross the Lake of Rot and defeat Astel, Naturalborn of the Void.',
        flagId: 12040800,
        bossFlagIds: [12040800],
        itemNames: ['Dark Moon Ring', 'Remembrance of the Naturalborn'],
        graceFlagIds: [71240], // Astel, Naturalborn of the Void
        rewards: ['Dark Moon Ring', 'Remembrance of the Naturalborn'],
      },
      {
        id: 'ranni-9',
        order: 9,
        title: 'The Moonlight Altar & Wedding',
        location: 'Moonlight Altar — Cathedral of Manus Celes',
        description:
          "Ride the elevator behind Astel up to Moonlight Altar. Drop into the cavern beneath the Cathedral of Manus Celes. Place the Dark Moon Ring onto Ranni's doll. Receive the Dark Moon Greatsword.",
        flagId: 1034500770,
        itemNames: ['Dark Moon Greatsword'],
        graceFlagIds: [76250, 76251, 76247], // Moonlight Altar, Cathedral of Manus Celes, Ranni's Chamber
        rewards: ['Dark Moon Greatsword'],
      },
    ],
  },
  {
    id: 'fia',
    name: 'Fia, Deathbed Companion',
    character: 'Fia',
    category: 'Major Ending',
    endingLink: 'Age of the Duskborn Ending',
    summary:
      'Uncover the conspiracy of the Night of the Black Knives, reclaim the Cursemark of Death, and forge the Mending Rune of the Death-Prince.',
    steps: [
      {
        id: 'fia-1',
        order: 1,
        title: 'Receive the Weathered Dagger',
        location: 'Roundtable Hold',
        description:
          'After reaching Altus Plateau, let Fia hold you in private at Roundtable Hold. She will entrust you with the Weathered Dagger to return to its rightful owner.',
        flagId: 1040529256,
        itemNames: ['Weathered Dagger'],
      },
      {
        id: 'fia-2',
        order: 2,
        title: 'Deliver Dagger to D',
        location: 'Roundtable Hold',
        description:
          'Hand the Weathered Dagger to D, Hunter of the Dead sitting in the central hub. Reload the area; the back door past Hewg opens to reveal D murdered and Fia departed.',
        flagId: 1040529260,
        itemNames: [
          'Twinned Helm',
          'Twinned Armor',
          'Twinned Gauntlets',
          'Twinned Greaves',
          "D's Bell Bearing",
          'Inseparable Sword',
        ],
        rewards: ['Twinned Armor Set', "D's Bell Bearing"],
      },
      {
        id: 'fia-3',
        order: 3,
        title: 'Claim Cursemark of Death',
        location: 'Liurnia — Divine Tower of Liurnia',
        description:
          "Use Ranni's Carian Inverted Statue inside Carian Study Hall to traverse the inverted library and reach the Divine Tower summit. Loot the Cursemark of Death from Ranni's discarded empyrean body.",
        flagId: 1034500780,
        itemNames: ['Cursemark of Death', 'Stargazer Heirloom'],
        rewards: ['Cursemark of Death', 'Stargazer Heirloom'],
      },
      {
        id: 'fia-4',
        order: 4,
        title: "Defeat Fia's Champions",
        location: "Deeproot Depths — Prince of Death's Throne",
        description:
          "Journey through Deeproot Depths (via Nokron Aqueduct coffin or Leyndell sewers). Slay Fia's Champions at the colossal root face.",
        flagId: 12030800,
        bossFlagIds: [12030800],
        itemNames: ["Fia's Mist"],
        graceFlagIds: [71230], // Prince of Death's Throne
        rewards: ["Fia's Mist"],
      },
      {
        id: 'fia-5',
        order: 5,
        title: 'Slay Fortissax & Claim Mending Rune',
        location: 'Deeproot Depths — Deathbed Dream',
        description:
          'Give Fia the Cursemark of Death. Exhaust dialogue, reload until she sleeps, and enter the Deathbed Dream to defeat Lichdragon Fortissax. Claim the Mending Rune of the Death-Prince from her corpse.',
        flagId: 12030850,
        bossFlagIds: [12030850],
        itemNames: [
          'Mending Rune of the Death-Prince',
          'Remembrance of the Lichdragon',
          "Fia's Robe",
        ],
        rewards: ['Mending Rune of the Death-Prince', 'Remembrance of the Lichdragon'],
      },
    ],
  },
  {
    id: 'goldmask',
    name: 'Brother Corhyn & Goldmask',
    character: 'Goldmask',
    category: 'Major Ending',
    endingLink: 'Age of Order Ending',
    summary:
      'Track the ascetic prophet Goldmask across the Lands Between, decode the deepest secret of Queen Marika and Radagon, and manifest the Mending Rune of Perfect Order.',
    steps: [
      {
        id: 'goldmask-1',
        order: 1,
        title: 'Corhyn Leaves Roundtable Hold',
        location: 'Roundtable Hold / Altus Plateau',
        description:
          'After reaching Altus Plateau, talk to Corhyn in Roundtable Hold. He will depart to find Goldmask. Meet him on the road north of Altus Highway Junction.',
        flagId: 1038500200,
        altFlagIds: [1038500201, 1038500500, 1038507000, 1038507010],
        graceFlagIds: [76201, 76202, 76230],
      },
      {
        id: 'goldmask-2',
        order: 2,
        title: 'Locate Goldmask on the Greatbridge',
        location: 'Altus Plateau — Forest-Spanning Greatbridge',
        description:
          "Find Goldmask standing silently at the broken north tip of the Forest-Spanning Greatbridge. Return to Corhyn and tell him Goldmask's location, then visit them together.",
        flagId: 1038500210,
        altFlagIds: [
          1038500215,
          1038517070,
          1038517080,
          1038518500,
          1038518540,
        ],
        itemNames: ['Discus of Light'],
        graceFlagIds: [76230],
        rewards: ['Discus of Light available for purchase'],
      },
      {
        id: 'goldmask-3',
        order: 3,
        title: 'Solve "Radagon is Marika" Puzzle',
        location: 'Leyndell — Erdtree Sanctuary',
        description:
          'Obtain the Golden Order Principia from the sanctuary rafters. Learn Law of Regression (37 INT). Cast it while standing on the message reading "Regression alone reveals secrets" below the sanctuary, then report the truth to Goldmask.',
        flagId: 1038500230,
        altFlagIds: [
          1038547000,
          1038547010,
          1038547020,
          1038547050,
          1038547060,
          1038547700,
        ],
        itemNames: [
          "Radagon's Rings of Light",
          'Golden Order Principia',
          'Law of Regression',
        ],
        graceFlagIds: [71110, 71101],
        requiresBefore: 'Must solve BEFORE defeating Maliketh in Farum Azula',
        missable: true,
      },
      {
        id: 'goldmask-4',
        order: 4,
        title: 'Stargazer’s Ruins in Mountaintops',
        location: 'Mountaintops of the Giants',
        description:
          'Find Goldmask and Corhyn on the bridge southwest of Stargazer’s Ruins. Talk to Corhyn about his growing doubts regarding Goldmask’s calculations.',
        flagId: 1038500250,
        itemNames: ['Immutable Shield'],
        graceFlagIds: [76332, 76321],
      },
      {
        id: 'goldmask-5',
        order: 5,
        title: 'Claim Mending Rune of Perfect Order',
        location: 'Leyndell, Capital of Ash',
        description:
          'After defeating Maliketh and turning Leyndell to ash, find Goldmask’s body at the cliff base below the Colosseum. Collect the Mending Rune of Perfect Order.',
        flagId: 1038500270,
        itemNames: [
          'Mending Rune of Perfect Order',
          'Radiant Gold Mask',
          "Goldmask's Rags",
          "Corhyn's Bell Bearing",
        ],
        rewards: ['Mending Rune of Perfect Order', "Goldmask's Armor Set"],
      },
    ],
  },
  {
    id: 'millicent',
    name: 'Millicent & Sage Gowry',
    character: 'Millicent',
    category: 'Companion',
    summary:
      "Help a young woman afflicted by Scarlet Rot uncover her true lineage to Malenia, culminating in the retrieval of Miquella's Needle to cure the Frenzied Flame.",
    steps: [
      {
        id: 'millicent-1',
        order: 1,
        title: 'Unalloyed Gold Needle in Caelid',
        location: 'Caelid — Swamp of Aeonia',
        description:
          "Speak to Sage Gowry in his shack south of Sellia. Defeat Commander O'Neil in the Swamp of Aeonia to retrieve the broken needle, then return it to Gowry for repair.",
        flagId: 1041500110,
        bossFlagIds: [1049380800], // Commander O'Neil defeat flag
        itemNames: ['Unalloyed Gold Needle'],
      },
      {
        id: 'millicent-2',
        order: 2,
        title: 'Cure Millicent at Church of the Plague',
        location: 'Caelid — Church of the Plague',
        description:
          'Deliver the repaired needle to Millicent dying of rot in Church of the Plague. Rest at grace, speak to her again to receive the Prosthesis-Wearer Heirloom, then visit her at Gowry’s Shack.',
        flagId: 1041500120,
        itemNames: ['Prosthesis-Wearer Heirloom'],
        rewards: ['Prosthesis-Wearer Heirloom'],
      },
      {
        id: 'millicent-3',
        order: 3,
        title: 'Retrieve Valkyrie’s Prosthesis',
        location: 'Altus Plateau — The Shaded Castle',
        description:
          "Meet Millicent near Erdtree-Gazing Hill. Travel to The Shaded Castle, retrieve the Valkyrie’s Prosthesis from a chest guarded by a Cleanrot Knight, and deliver it to her.",
        flagId: 1041500135,
        itemNames: ["Valkyrie's Prosthesis"],
      },
      {
        id: 'millicent-4',
        order: 4,
        title: 'Windmill Village Godskin Defeat',
        location: 'Altus Plateau — Dominula, Windmill Village',
        description:
          'Defeat the Godskin Apostle at the summit of Dominula. Rest at the Windmill Heights grace and speak to Millicent admiring the landscape.',
        flagId: 1041500140,
        bossFlagIds: [1042550800, 34130800], // Godskin Apostle in Dominula
        itemNames: ['Godskin Peeler', 'Scouring Black Flame'],
        graceFlagIds: [76231], // Windmill Heights grace
      },
      {
        id: 'millicent-5',
        order: 5,
        title: 'Mountaintops & Haligtree Prayer Room',
        location: 'Ancient Snow Valley Ruins / Haligtree',
        description:
          'Talk to Millicent at the Ancient Snow Valley Ruins grace in Mountaintops. Later, meet her in the Prayer Room inside Elphael, Brace of the Haligtree.',
        flagId: 1041500155,
        graceFlagIds: [71501, 71502], // Prayer Room, Elphael
      },
      {
        id: 'millicent-6',
        order: 6,
        title: 'The Drainage Canal Decision',
        location: 'Haligtree — Drainage Canal',
        description:
          'Defeat the Ulcerated Tree Spirit in the rot pool near the drainage canal. Choose the GOLD summon sign to assist Millicent against her four sisters. Speak to her on the shoreline to receive the Unalloyed Gold Needle.',
        flagId: 1041500170,
        itemNames: [
          'Rotten Winged Sword Insignia',
          "Millicent's Prosthesis",
          'Unalloyed Gold Needle',
          "Miquella's Needle",
        ],
        rewards: ['Rotten Winged Sword Insignia', 'Unalloyed Gold Needle'],
        missable: true,
      },
    ],
  },
  {
    id: 'alexander',
    name: 'Iron Fist Alexander',
    character: 'Alexander',
    category: 'Companion',
    summary:
      'Journey alongside the jovial warrior jar from a muddy ditch in Limgrave all the way to a legendary duel in Crumbling Farum Azula.',
    steps: [
      {
        id: 'alexander-1',
        order: 1,
        title: 'Free Alexander in Northern Limgrave',
        location: 'Limgrave — Saintsbridge',
        description:
          'Find Alexander stuck in a hole on the hillside above Saintsbridge. Strike his rear with heavy attacks to pop him free.',
        flagId: 1032500100,
        itemNames: ['Triumphant Delight Gesture', 'Exalted Flesh'],
        rewards: ['Triumphant Delight Gesture', 'Exalted Flesh'],
      },
      {
        id: 'alexander-2',
        order: 2,
        title: 'Meet in Gael Tunnel',
        location: 'Caelid — Gael Tunnel',
        description:
          'Encounter Alexander inside the rear entrance of Gael Tunnel on the Caelid border heading toward the festival.',
        flagId: 1032500115,
        graceFlagIds: [76140, 76141],
      },
      {
        id: 'alexander-3',
        order: 3,
        title: 'The Radahn Festival',
        location: 'Caelid — Redmane Castle',
        description:
          'Summon Alexander during the battle against Starscourge Radahn. Speak to him scavenging warrior remains on the battlefield after the victory.',
        flagId: 1032500125,
        bossFlagIds: [310], // Radahn defeat
      },
      {
        id: 'alexander-4',
        order: 4,
        title: 'Oil Pot in Liurnia',
        location: 'Liurnia — South of Carian Study Hall',
        description:
          'Find Alexander stuck again in a hole south of the study hall. Craft and throw an Oil Pot at him, then hit him with heavy attacks to dislodge him.',
        flagId: 1032500135,
      },
      {
        id: 'alexander-5',
        order: 5,
        title: 'Magma Bath in Mt. Gelmir',
        location: 'Mt. Gelmir — Seethewater Terminus',
        description:
          'Behind the Magma Wyrm lava lake near Seethewater Terminus, speak to Alexander soaking in molten rock to temper his ceramic body.',
        flagId: 1032500150,
        itemNames: ['Jar Helm'],
        graceFlagIds: [76241],
        rewards: ['Jar Helm'],
      },
      {
        id: 'alexander-6',
        order: 6,
        title: 'Duel in Crumbling Farum Azula',
        location: 'Crumbling Farum Azula — Dragon Temple Lift',
        description:
          'Past the Stonesword Key fog door, meet Alexander on the floating ruins. Engage in an honorable duel to the death to claim his innards and legendary shard.',
        flagId: 1032500170,
        itemNames: ['Shard of Alexander', "Alexander's Innards"],
        graceFlagIds: [71308], // Dragon Temple Lift
        rewards: ['Shard of Alexander', "Alexander's Innards"],
      },
    ],
  },
  {
    id: 'nepheli',
    name: 'Nepheli Loux & Kenneth Haight',
    character: 'Nepheli',
    category: 'Companion',
    summary:
      'Restore the warrior spirit of Nepheli Loux with the ashes of the ancient Stormhawk King and seat her upon the throne of Stormveil as rightful Lord of Limgrave.',
    steps: [
      {
        id: 'nepheli-1',
        order: 1,
        title: 'Stormveil Castle Ally',
        location: 'Stormveil Castle',
        description:
          'Meet Nepheli in a room before Godrick’s arena. Summon her to assist in slaying Godrick the Grafted. Afterwards, meet her at Roundtable Hold for the Arsenal Charm.',
        flagId: 1035500100,
        altFlagIds: [1035500510, 1035500511, 1035500514],
        itemNames: ['Arsenal Charm'],
        rewards: ['Arsenal Charm'],
      },
      {
        id: 'nepheli-2',
        order: 2,
        title: 'Clear Fort Haight for Kenneth',
        location: 'Limgrave — Fort Haight',
        description:
          'Meet Kenneth Haight atop the ruined arch in Mistwood. Slay the blood knight commander at Fort Haight. Return to Kenneth and pledge your service.',
        flagId: 1031500100,
        itemNames: ['Erdsteel Dagger'],
        graceFlagIds: [76107],
        rewards: ['Erdsteel Dagger'],
      },
      {
        id: 'nepheli-3',
        order: 3,
        title: 'Village of the Albinaurics Slaughter',
        location: 'Liurnia — Village of the Albinaurics',
        description:
          'Find Nepheli beneath the village bridge grieving the massacre. Summon her to slay the Omenkiller boss. Afterwards, find her disowned by Gideon downstairs in Roundtable Hold.',
        flagId: 1035500120,
        altFlagIds: [1035500560],
        graceFlagIds: [76212],
      },
      {
        id: 'nepheli-4',
        order: 4,
        title: 'Gift The Stormhawk King',
        location: 'Chapel of Anticipation / Roundtable Hold',
        description:
          'Use an Imbued Sword Key at the Four Belfries to reach the Chapel of Anticipation. Loot The Stormhawk King spirit ashes and deliver them to Nepheli. (WARNING: Do NOT give her Seluvis’s Potion!).',
        flagId: 1035500140,
        altFlagIds: [1035500570, 1035500571],
        missable: true,
        requiresBefore: 'Do NOT give Seluvis potion to Nepheli!',
      },
      {
        id: 'nepheli-5',
        order: 5,
        title: 'Coronation in Stormveil Throne Room',
        location: "Stormveil Castle — Godrick's Throne Room",
        description:
          'After slaying Morgott in Leyndell and satisfying Kenneth/Nepheli steps, rest at Godrick’s grace. Nepheli ascends the throne as Lord of Limgrave, with Kenneth and Gostoc present.',
        flagId: 1035500160,
        altFlagIds: [1035500900, 1035500920],
        rewards: ['Ancient Dragon Smithing Stone x2'],
      },
    ],
  },
  {
    id: 'frenzy',
    name: 'Hyetta & The Three Fingers',
    character: 'Hyetta',
    category: 'Major Ending',
    endingLink: 'Lord of the Frenzied Flame Ending',
    summary:
      'Deliver Shabriri Grapes to the blind maiden Hyetta and descend beneath the Subterranean Shunning-Grounds to be embraced by the Three Fingers.',
    steps: [
      {
        id: 'frenzy-1',
        order: 1,
        title: 'Edgar the Revenger’s Grape',
        location: 'Weeping Peninsula / Liurnia',
        description:
          'Complete Irina’s letter delivery to Edgar at Castle Morne. Slay Edgar the Revenger when he invades at Revenger’s Shack in western Liurnia to collect the first Shabriri Grape.',
        flagId: 1036500110,
        itemNames: ['Shabriri Grape'],
        rewards: ['Shabriri Grape'],
      },
      {
        id: 'frenzy-2',
        order: 2,
        title: 'Feed Hyetta Three Grapes',
        location: 'Church of Irith / Purified Ruins / Gate Town',
        description:
          'Feed Hyetta Shabriri Grapes at Church of Irith, Purified Ruins, and Gate Town Bridge. Reveal the truth about the grapes to her.',
        flagId: 1036500130,
        graceFlagIds: [76200, 76205, 76211],
      },
      {
        id: 'frenzy-3',
        order: 3,
        title: 'Fingerprint Grape from Vyke',
        location: 'Liurnia — Bellum Church',
        description:
          'Defeat Festering Fingerprint Vyke near Church of Inhibition to claim the Fingerprint Grape. Hand it to Hyetta waiting at Bellum Church.',
        flagId: 1036500145,
        itemNames: ['Fingerprint Grape', "Vyke's War Spear", 'Fingerprint Armor'],
        rewards: ['Fingerprint Grape'],
      },
      {
        id: 'frenzy-4',
        order: 4,
        title: 'Descent to the Frenzied Flame Proscription',
        location: 'Leyndell — Cathedral of the Forsaken',
        description:
          'Defeat Mohg the Omen beneath Leyndell sewers. Strike the altar to reveal the secret passage and descend the gravestone platforms to the bottom.',
        flagId: 1036500160,
        bossFlagIds: [35000800], // Mohg the Omen
        graceFlagIds: [73500, 73504], // Cathedral of the Forsaken, Frenzied Flame Proscription
      },
      {
        id: 'frenzy-5',
        order: 5,
        title: 'Embrace of the Three Fingers',
        location: 'Frenzied Flame Proscription',
        description:
          'Strip off all armor and weapons completely. Open the scorching door to receive the embrace of the Three Fingers. (WARNING: Locks all other endings unless cured with Miquella’s Needle!).',
        flagId: 1036500180,
        itemNames: ['Frenzied Flame Seal'],
        rewards: ['Frenzied Flame Seal'],
        missable: true,
      },
    ],
  },
];
