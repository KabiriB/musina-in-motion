// Musina in Motion — Narrated Journeys
// Editable content file. Keep story prose and route metadata here, not inside UI components.
// Source audit completed 24 August 2026 against Bella's supplied R/Leaflet HTML exports.

export const journeyStoryMeta = {
  "title": "Narrated Journeys",
  "source": "Selected R/Leaflet story-map exports supplied by the research team.",
  "governanceNote": "These are interpretive journey maps based on selected in-depth interviews. They are not representative statistical claims and they are not individual respondent traces. Place names are used to show broad route geographies; no household-level locations are shown.",
  "readingNote": "The survey interface shows patterns across Musina. The narrated journeys show how movement is lived as sequence: origin, stop points, border crossing, delay, work, risk, waiting, settlement, and adaptation.",
  "publicationNote": "MAP267 currently contains the richest stop-by-stop narration. The other published journeys are explicitly labelled route sketches until fuller interview narration is added.",
  "unpublishedSources": [
    {
      "id": "MAP460",
      "sourceFile": "MAP460 webpage.html",
      "note": "Present in Bella’s uploaded source-map bundle but not included in the previously agreed nine-story reader. Retained in the research source bundle for team confirmation before publication; the raw source HTML is not copied into the public deployment repository."
    }
  ]
};

export const journeyStories = [
  {
    "id": "MAP159",
    "title": "Buhera to Musina via Beitbridge",
    "subtitle": "A Zimbabwe–Musina route through Chivhu and Beitbridge",
    "status": "route sketch",
    "routeLabel": "Buhera → Chivhu → Beitbridge → Musina",
    "routeType": "Cross-border route",
    "themes": [
      "rural origin",
      "border crossing",
      "arrival in Musina"
    ],
    "stops": [
      {
        "order": 1,
        "name": "Buhera",
        "type": "origin",
        "longitude": 31.4379339806133,
        "latitude": -19.3213030006074,
        "narrative": "Origin place shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 2,
        "name": "Chivhu",
        "type": "transit",
        "longitude": 30.895909366919,
        "latitude": -19.0097009828347,
        "narrative": "Intermediate stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 3,
        "name": "Beitbridge",
        "type": "border",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "Border-crossing stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 4,
        "name": "Musina",
        "type": "arrival",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Musina endpoint shown in Bella’s source map. Fuller interview narration still needs to be added."
      }
    ],
    "interpretationNote": "This route sketch places Musina within a wider Zimbabwean movement corridor. It should be read as a narrated route geography, not as a precise trace of movement.",
    "needsNarration": true,
    "sourceFile": "MAP159 webpage.html"
  },
  {
    "id": "MAP267",
    "title": "Blantyre to Musina via Johannesburg",
    "subtitle": "A longer narrated journey from Malawi into South Africa",
    "status": "full narrative",
    "routeLabel": "Blantyre → Nyamapanda → Beitbridge → Johannesburg → Musina",
    "routeType": "Multi-stage cross-border journey",
    "themes": [
      "poverty",
      "family support",
      "border crossing",
      "policing",
      "xenophobia",
      "work",
      "belonging"
    ],
    "stops": [
      {
        "order": 1,
        "name": "Blantyre",
        "type": "origin",
        "longitude": 35.0142726731302,
        "latitude": -15.780771893612,
        "narrative": "The participant grew up very poor in Blantyre, Malawi. His mother died when he was young. He decided to move to South Africa so that he could earn money to send back to his brothers and sisters in order for them to eat and finish school. His brother paid for him and his uncle to travel from Malawi to South Africa for the first time. They paid someone to drive them in a bakkie with ten others for the entire journey."
      },
      {
        "order": 2,
        "name": "Nyamapanda",
        "type": "transit",
        "longitude": 32.857288188194,
        "latitude": -16.9663533841789,
        "narrative": "Passed through Nyamapanda on his way to South Africa."
      },
      {
        "order": 3,
        "name": "Beitbridge",
        "type": "border",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "The police stopped the bakkie and asked to see everyone’s passports because there were many people in a small truck. The driver had connections, so the police let them pass."
      },
      {
        "order": 4,
        "name": "Johannesburg",
        "type": "transit",
        "longitude": 28.0331456823893,
        "latitude": -26.207164665869,
        "narrative": "He arrived in Johannesburg in 2016 and worked in a spaza shop. Life there was difficult. He spent nights in police custody for not carrying his passport and was targeted by xenophobic violence. He felt far away from home."
      },
      {
        "order": 5,
        "name": "Musina",
        "type": "arrival",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "He likes living in Musina and owns his own barbershop. He can catch a straight bus to his family in Malawi for R700. He does not feel the same threat from police here and even cuts their hair or gives them directions. When he first arrived, finding work and somewhere to sleep was hard, and he still struggles to make enough money. Despite this, he feels welcome in the community and hopes to own a spaza."
      }
    ],
    "interpretationNote": "This story shows movement as a sequence of obligation, risk, work, policing, distance from home, and eventual attachment to Musina. It is one of the richer interview narratives in the current story-map set.",
    "needsNarration": false,
    "sourceFile": "MAP267 webpage.html"
  },
  {
    "id": "MAP308",
    "title": "Kakhu to Musina through local stops",
    "subtitle": "A localised route through Domboni, Masea and Makonde",
    "status": "route sketch",
    "routeLabel": "Kakhu → Domboni → Masea → Makonde → Musina",
    "routeType": "Local/regional movement route",
    "themes": [
      "local movement",
      "settlement geography",
      "arrival in Musina"
    ],
    "stops": [
      {
        "order": 1,
        "name": "Kakhu",
        "type": "origin",
        "longitude": 30.2479958965165,
        "latitude": -22.8362395161819,
        "narrative": "Origin place shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 2,
        "name": "Domboni",
        "type": "transit",
        "longitude": 30.7423258294219,
        "latitude": -22.4845609499956,
        "narrative": "Intermediate stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 3,
        "name": "Masea",
        "type": "transit",
        "longitude": 30.6009000909658,
        "latitude": -22.4716438582098,
        "narrative": "Intermediate stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 4,
        "name": "Makonde",
        "type": "transit",
        "longitude": 30.5818960932404,
        "latitude": -22.8057646581561,
        "narrative": "Intermediate stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 5,
        "name": "Musina",
        "type": "arrival",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Musina endpoint shown in Bella’s source map. Fuller interview narration still needs to be added."
      }
    ],
    "interpretationNote": "This route sketch is more localised than the long-distance cross-border journeys. It helps keep the interface attentive to movement within the wider Musina/Vhembe field geography.",
    "needsNarration": true,
    "sourceFile": "MAP308 webpage.html"
  },
  {
    "id": "MAP434",
    "title": "Near Masvingo to Musina",
    "subtitle": "A Zimbabwe–Musina route via Masvingo and Beitbridge",
    "status": "route sketch",
    "routeLabel": "Village near Masvingo → Masvingo → Beitbridge → Musina",
    "routeType": "Cross-border route",
    "themes": [
      "rural origin",
      "urban stop",
      "border crossing",
      "arrival in Musina"
    ],
    "stops": [
      {
        "order": 1,
        "name": "Village near Masvingo",
        "type": "origin",
        "longitude": 30.8459600268921,
        "latitude": -20.1872481135225,
        "narrative": "Origin place shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 2,
        "name": "Masvingo",
        "type": "transit",
        "longitude": 30.8235225035423,
        "latitude": -20.0701456888706,
        "narrative": "Intermediate stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 3,
        "name": "Beitbridge",
        "type": "border",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "Border-crossing stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 4,
        "name": "Musina",
        "type": "arrival",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Musina endpoint shown in Bella’s source map. Fuller interview narration still needs to be added."
      }
    ],
    "interpretationNote": "This route sketch shows movement from a village near Masvingo through a recognised urban stop and the Beitbridge crossing before arrival in Musina.",
    "needsNarration": true,
    "sourceFile": "MAP434 webpage.html"
  },
  {
    "id": "MAP446",
    "title": "Gokwe to Musina via Bulawayo and Tzaneen",
    "subtitle": "A route that bends through Zimbabwe and Limpopo before Musina",
    "status": "route sketch",
    "routeLabel": "Gokwe → Bulawayo → Tzaneen → Musina",
    "routeType": "Regional movement route",
    "themes": [
      "multi-stop movement",
      "work corridor",
      "arrival in Musina"
    ],
    "stops": [
      {
        "order": 1,
        "name": "Gokwe",
        "type": "origin",
        "longitude": 28.9438669481492,
        "latitude": -18.2167499655059,
        "narrative": "Origin place shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 2,
        "name": "Bulawayo",
        "type": "transit",
        "longitude": 28.5895775145455,
        "latitude": -20.1377856887127,
        "narrative": "Intermediate stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 3,
        "name": "Tzaneen",
        "type": "transit",
        "longitude": 30.1538044233553,
        "latitude": -23.8386936316355,
        "narrative": "Intermediate stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 4,
        "name": "Musina",
        "type": "arrival",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Musina endpoint shown in Bella’s source map. Fuller interview narration still needs to be added."
      }
    ],
    "interpretationNote": "This route sketch is useful because it does not reduce movement into Musina to a simple Zimbabwe–Beitbridge–Musina line. It suggests a more indirect regional pathway.",
    "needsNarration": true,
    "sourceFile": "MAP446 webpage.html"
  },
  {
    "id": "MAP451",
    "title": "Chivi to Musina via Beitbridge",
    "subtitle": "A short Zimbabwe–Musina route through the border crossing",
    "status": "route sketch",
    "routeLabel": "Chivi → Beitbridge → Musina",
    "routeType": "Cross-border route",
    "themes": [
      "rural origin",
      "border crossing",
      "arrival in Musina"
    ],
    "stops": [
      {
        "order": 1,
        "name": "Chivi",
        "type": "origin",
        "longitude": 30.5507610124435,
        "latitude": -20.5933932892213,
        "narrative": "Origin place shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 2,
        "name": "Beitbridge",
        "type": "border",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "Border-crossing stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 3,
        "name": "Musina",
        "type": "arrival",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Musina endpoint shown in Bella’s source map. Fuller interview narration still needs to be added."
      }
    ],
    "interpretationNote": "This route sketch presents a compact cross-border movement sequence into Musina.",
    "needsNarration": true,
    "sourceFile": "MAP451 webpage.html"
  },
  {
    "id": "MAP514",
    "title": "Mberengwa to Musina via Beitbridge",
    "subtitle": "A Zimbabwe–Musina route through Beitbridge",
    "status": "route sketch",
    "routeLabel": "Mberengwa → Beitbridge → Musina",
    "routeType": "Cross-border route",
    "themes": [
      "rural origin",
      "border crossing",
      "arrival in Musina"
    ],
    "stops": [
      {
        "order": 1,
        "name": "Mberengwa",
        "type": "origin",
        "longitude": 29.9034133927085,
        "latitude": -20.4383472113538,
        "narrative": "Origin place shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 2,
        "name": "Beitbridge",
        "type": "border",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "Border-crossing stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 3,
        "name": "Musina",
        "type": "arrival",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Musina endpoint shown in Bella’s source map. Fuller interview narration still needs to be added."
      }
    ],
    "interpretationNote": "This route sketch places Musina within a repeated Zimbabwe–Beitbridge arrival corridor.",
    "needsNarration": true,
    "sourceFile": "MAP514 webpage.html"
  },
  {
    "id": "MAP612",
    "title": "Rumonge to Musina through Kigoma and Zambia",
    "subtitle": "A multi-country route from Burundi toward Musina",
    "status": "route sketch",
    "routeLabel": "Rumonge → Kigoma → Zambia → Musina",
    "routeType": "Multi-country route",
    "themes": [
      "long-distance movement",
      "multi-country passage",
      "arrival in Musina"
    ],
    "stops": [
      {
        "order": 1,
        "name": "Rumonge",
        "type": "origin",
        "longitude": 29.4408718602686,
        "latitude": -3.97574074206648,
        "narrative": "Origin place shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 2,
        "name": "Kigoma",
        "type": "transit",
        "longitude": 29.630382495861,
        "latitude": -4.88073459639866,
        "narrative": "Intermediate stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 3,
        "name": "Zambia",
        "type": "transit",
        "longitude": 27.2191542010959,
        "latitude": -13.5631225079765,
        "narrative": "Intermediate stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 4,
        "name": "Musina",
        "type": "arrival",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Musina endpoint shown in Bella’s source map. Fuller interview narration still needs to be added."
      }
    ],
    "interpretationNote": "This route sketch is important because it widens the interface beyond South Africa–Zimbabwe mobility and shows Musina in a broader continental movement geography.",
    "needsNarration": true,
    "sourceFile": "MAP612 webpage.html"
  },
  {
    "id": "MAP617",
    "title": "Masvingo to Musina via Beitbridge",
    "subtitle": "A Zimbabwe–Musina route through Beitbridge",
    "status": "route sketch",
    "routeLabel": "Masvingo → Beitbridge → Musina",
    "routeType": "Cross-border route",
    "themes": [
      "urban origin",
      "border crossing",
      "arrival in Musina"
    ],
    "stops": [
      {
        "order": 1,
        "name": "Masvingo",
        "type": "origin",
        "longitude": 30.8235225035423,
        "latitude": -20.0701456888706,
        "narrative": "Origin place shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 2,
        "name": "Beitbridge",
        "type": "border",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "Border-crossing stop shown in Bella’s source map. Fuller interview narration still needs to be added."
      },
      {
        "order": 3,
        "name": "Musina",
        "type": "arrival",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Musina endpoint shown in Bella’s source map. Fuller interview narration still needs to be added."
      }
    ],
    "interpretationNote": "This route sketch presents one of the repeated Zimbabwe–Beitbridge–Musina pathways in the interview story-map set.",
    "needsNarration": true,
    "sourceFile": "MAP617 webpage.html"
  }
];
