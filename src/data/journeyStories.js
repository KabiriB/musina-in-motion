// Musina in Motion — Narrated Journeys v2
// Editable research content. Keep narrative prose and route metadata here, outside rendering logic.
// Source refresh: 3 September 2026, using the research team’s updated narrated-map materials.
// Publication copy edited for grammar, clarity and British English; substantive meaning retained.

export const journeyStoryMeta = {
  "title": "Narrated Journeys",
  "readingNote": "Ten selected interview accounts trace movement as lived sequence: origin, transit, border crossing, temporary settlement, work, return and adaptation.",
  "governanceNote": "These maps are interpretive reconstructions from selected in-depth interviews. They are not representative statistical claims or GPS traces. Named places show broad journey geography; no household-level locations are displayed.",
  "sourceNote": "Narrative and stop geography are derived from team-supplied interview story-map materials. Public-facing names use approved pseudonyms; internal source identifiers remain only as provenance metadata."
};

export const journeyStories = [
  {
    "sourceId": "MAP159",
    "name": "Michaela",
    "title": "Buhera to Musina",
    "subtitle": "A cross-border journey through Chivhu and Beitbridge",
    "routeLabel": "Buhera → Chivhu → Beitbridge → Musina",
    "stops": [
      {
        "order": 1,
        "name": "Buhera",
        "role": "origin",
        "label": "Origin",
        "longitude": 31.4379339806133,
        "latitude": -19.3213030006074,
        "narrative": "Michaela grew up in Buhera, Zimbabwe. Her husband moved to Musina in 2015, and she followed him in 2020 to look for better work opportunities."
      },
      {
        "order": 2,
        "name": "Chivhu",
        "role": "transit",
        "label": "Transit / stop",
        "longitude": 30.895909366919,
        "latitude": -19.0097009828347,
        "narrative": "Michaela took a bus from her village to Chivhu, and from there continued to Beitbridge."
      },
      {
        "order": 3,
        "name": "Beitbridge",
        "role": "border",
        "label": "Border crossing",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "As Michaela did not have a passport, she crossed the border on foot, pretending to be a mazalawi (border porter) so that the border police would not ask her for a passport. She bribed police officers to let her pass."
      },
      {
        "order": 4,
        "name": "Musina",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Michaela describes the journey as having gone smoothly, without difficulties. After arriving in Musina, she spent two years without a passport. She returns home twice a year, in April and December, bringing food and money to her mother and children and paying her children’s school fees. When she first arrived in Musina, she had no money and struggled to find work. It took her three months to find a job. Her two children still live with her mother in Buhera, Zimbabwe."
      }
    ],
    "sourceFile": "MAP159 webpage.html"
  },
  {
    "sourceId": "MAP267",
    "name": "Wayne",
    "title": "Blantyre to Musina via Johannesburg",
    "subtitle": "A multi-stage journey from Malawi through Johannesburg to Musina",
    "routeLabel": "Blantyre → Nyamapanda → Beitbridge → Johannesburg → Musina",
    "stops": [
      {
        "order": 1,
        "name": "Blantyre",
        "role": "origin",
        "label": "Origin",
        "longitude": 35.0142726731302,
        "latitude": -15.780771893612,
        "narrative": "Wayne grew up very poor in Blantyre, Malawi. His mother died when he was young. He decided to move to South Africa so that he could earn money to send back to his brothers and sisters, helping them to eat and finish school. His brother paid for him and his uncle to travel from Malawi to South Africa for the first time. They paid someone to drive them in a bakkie (pick-up truck) with ten others for the entire journey."
      },
      {
        "order": 2,
        "name": "Nyamapanda",
        "role": "transit",
        "label": "Transit / stop",
        "longitude": 32.857288188194,
        "latitude": -16.9663533841789,
        "narrative": "Wayne passed through Nyamapanda on his way to South Africa."
      },
      {
        "order": 3,
        "name": "Beitbridge",
        "role": "border",
        "label": "Border crossing",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "The police stopped the bakkie and asked to see everyone’s passports because there were many people in a small truck. However, the driver had connections, and the police let them pass."
      },
      {
        "order": 4,
        "name": "Johannesburg",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 28.0331456823893,
        "latitude": -26.207164665869,
        "narrative": "Wayne arrived in Johannesburg in 2016 and worked in a spaza shop. However, he found life difficult there. He would spend nights in police custody for not carrying his passport and was targeted by xenophobic violence. He felt far away from home."
      },
      {
        "order": 5,
        "name": "Musina",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Wayne likes living in Musina and owns his own barbershop. He can catch a direct bus to his family in Malawi for R700. He does not feel the same threat from police in Musina and even cuts their hair or gives them directions. That does not mean it was always easy. When he first arrived without a job, it was hard to find somewhere to sleep, and he still struggles to make enough money. Despite this, he feels welcome and likes the people in the community. Wayne’s goal is to own a spaza shop."
      }
    ],
    "sourceFile": "MAP267 webpage.html"
  },
  {
    "sourceId": "MAP308",
    "name": "Munyadziwa",
    "title": "Kakhu to Musina through Limpopo",
    "subtitle": "A life course of movement within Limpopo before settlement in Musina",
    "routeLabel": "Kakhu → Masea → Makonde → Musina",
    "stops": [
      {
        "order": 1,
        "name": "Kakhu",
        "role": "origin",
        "label": "Origin",
        "longitude": 30.2479958965165,
        "latitude": -22.8362395161819,
        "narrative": "Munyadziwa was born in the small village of Kakhu in Limpopo Province, South Africa. Throughout her childhood, she moved between different villages in Limpopo and returned to Kakhu for the final couple of years of her schooling."
      },
      {
        "order": 2,
        "name": "Masea",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.6009000909658,
        "latitude": -22.4716438582098,
        "narrative": "When Munyadziwa got married, she moved to Masea in Limpopo Province."
      },
      {
        "order": 3,
        "name": "Makonde",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.5818960932404,
        "latitude": -22.8057646581561,
        "narrative": "Munyadziwa and her husband then moved to Makonde, where she worked as a tailor and had her own workshop. After being evicted from the building, she decided to move to Musina."
      },
      {
        "order": 4,
        "name": "Musina",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Munyadziwa took a taxi to Musina with her portable sewing machine so that she could continue her sewing business there. She had no problems during the journey. One month later, her son brought her another sewing machine by car. She found the move to Musina difficult at first because she did not yet have a client base. Munyadziwa returns to Makonde once every few months, or every month if she is not busy at work. Despite this, she still refers to Makonde as the place where she lives."
      }
    ],
    "sourceFile": "MAP308 webpage.html"
  },
  {
    "sourceId": "MAP434",
    "name": "Tatenda",
    "title": "Masvingo to Musina",
    "subtitle": "A cross-border journey shaped by family rupture, informal work and survival",
    "routeLabel": "Village near Masvingo → Masvingo → Beitbridge → Musina",
    "stops": [
      {
        "order": 1,
        "name": "Village near Masvingo",
        "role": "origin",
        "label": "Origin",
        "longitude": 30.8459600268921,
        "latitude": -20.1872481135225,
        "narrative": "Tatenda grew up and got married in the Masvingo area of Zimbabwe. After having two children, her marriage began to break down, and she and her husband separated. She realised that it would be difficult to support her children financially if she stayed in Zimbabwe, so she decided to go to South Africa and send money home for food and school costs."
      },
      {
        "order": 2,
        "name": "Masvingo",
        "role": "work",
        "label": "Work / preparation",
        "longitude": 30.8235225035423,
        "latitude": -20.0701456888706,
        "narrative": "First, Tatenda went to Masvingo and did piece jobs to save enough money to travel to South Africa. Then, with her youngest child, she hitchhiked on trucks from Masvingo to Beitbridge."
      },
      {
        "order": 3,
        "name": "Beitbridge",
        "role": "border",
        "label": "Border crossing",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "Because she did not have a passport, Tatenda paid someone to take her across the river with a group of people. The group was targeted by thieves who did not believe her when she said she had no money, so they searched her. Once on the other side, she went to a taxi rank and had to ask for a lift because she had no money to pay for transport."
      },
      {
        "order": 4,
        "name": "Musina",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "As she knew no one, Tatenda went to a women’s meeting place at a church for support. Although she found shelter, she struggled to get enough food and nappies for her child. She started by doing piece jobs until she found more permanent work. Tatenda describes the journey as difficult because she had neither a passport nor money. She says police officers seeking bribes would sometimes make her wait for 45 minutes until they realised she had nothing to give them and let her go."
      }
    ],
    "sourceFile": "MAP434 webpage.html"
  },
  {
    "sourceId": "MAP446",
    "name": "Rhoda",
    "title": "Gokwe to Musina via Tzaneen",
    "subtitle": "A journey interrupted in Musina, extended through Tzaneen, then returned to Musina",
    "routeLabel": "Gokwe → Bulawayo → Musina¹ → Tzaneen → Musina²",
    "stops": [
      {
        "order": 1,
        "name": "Gokwe",
        "role": "origin",
        "label": "Origin",
        "longitude": 28.9438669481492,
        "latitude": -18.2167499655059,
        "narrative": "Rhoda grew up in the village of Gokwe, Zimbabwe, where she lived with her father and stepmother. As a child, she often did not have enough money for school fees and would therefore be sent away from school."
      },
      {
        "order": 2,
        "name": "Bulawayo",
        "role": "work",
        "label": "Work / preparation",
        "longitude": 28.5895775145455,
        "latitude": -20.1377856887127,
        "narrative": "When she was old enough, Rhoda moved to Bulawayo. She worked there for three months to save enough money to go to Cape Town, South Africa, where her uncle lived. Because she did not have a passport, she paid someone US$70 to take her from Bulawayo to Cape Town."
      },
      {
        "order": 3,
        "name": "Musina",
        "role": "arrival",
        "label": "First arrival",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "After crossing the South African border, the person Rhoda was travelling with said there were problems with the journey and left her in Musina. Her phone was not working, and she did not know anyone, so she waited in the Wholesale Mall until some men working there asked her to help at their stall for the day in exchange for taking her to the women’s shelter afterwards. She stayed at the shelter for three months until a man offered her work in Tzaneen."
      },
      {
        "order": 4,
        "name": "Tzaneen",
        "role": "work",
        "label": "Work / preparation",
        "longitude": 30.1538044233553,
        "latitude": -23.8386936316355,
        "narrative": "Rhoda worked in Tzaneen for eight months and then returned to Musina to look for further work."
      },
      {
        "order": 5,
        "name": "Musina",
        "role": "return",
        "label": "Return after Tzaneen",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "After the work in Tzaneen ended, Rhoda returned to the women’s shelter in Musina until she found more work. She sent her child back to Gokwe to live with her stepmother because she could not afford rent and childcare. She is only allowed to take time off work in December to visit her home and child."
      }
    ],
    "sourceFile": "MAP446 webpage.html",
    "intendedDestination": {
      "name": "Cape Town",
      "longitude": 18.4459023580113,
      "latitude": -33.923076061929,
      "fromStopOrder": 2,
      "label": "Intended destination · not reached",
      "narrative": "Rhoda originally intended to migrate to Cape Town, where her uncle lives. However, the person she paid to take her left her unexpectedly in Musina, and she never reached Cape Town."
    }
  },
  {
    "sourceId": "MAP451",
    "name": "Rudo",
    "title": "Chivi to Musina",
    "subtitle": "A short cross-border route followed by frequent movement between Musina and Zimbabwe",
    "routeLabel": "Chivi → Beitbridge → Musina",
    "stops": [
      {
        "order": 1,
        "name": "Chivi",
        "role": "origin",
        "label": "Origin",
        "longitude": 30.5507610124435,
        "latitude": -20.5933932892213,
        "narrative": "Rudo was born in Chivi, Zimbabwe, and followed her husband to Musina to look for work."
      },
      {
        "order": 2,
        "name": "Beitbridge",
        "role": "border",
        "label": "Border crossing",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "Rudo did not explain how she travelled to the border, only that she paid smugglers R50 to help her and her two-month-old child cross the river. The river was dry when she crossed, so they used stepping stones. She did not encounter any problems during the journey."
      },
      {
        "order": 3,
        "name": "Musina",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "When Rudo first arrived, she did not have a passport, but she now does. Every week, she crosses the border to have her passport stamped and stays with her sister in Beitbridge. Because she stays overnight in Zimbabwe, she can normally receive a stamp allowing a seven-day stay in South Africa without paying. Rudo returns to Chivi two to three times a year. She describes being shocked when she first arrived in Musina because her husband was living in a chicken coop. She lived with him there for two months before they moved. She has recently left her job because the pay was too low and instead intends to sell goods in Zimbabwe while keeping Musina as her base."
      }
    ],
    "sourceFile": "MAP451 webpage.html"
  },
  {
    "sourceId": "MAP460",
    "name": "Morgan",
    "title": "Kivu to Musina via Pretoria and Durban",
    "subtitle": "A forced migration journey through displacement, refugee documentation and repeated relocation",
    "routeLabel": "Kivu → Pretoria West → Durban → Musina",
    "stops": [
      {
        "order": 1,
        "name": "Kivu",
        "role": "origin",
        "label": "Origin",
        "longitude": 28.9047396121001,
        "latitude": -2.09667600579315,
        "narrative": "Morgan grew up south of Kivu in the Democratic Republic of the Congo. In 2008, because of civil unrest and fear for his safety, he fled the DRC. He travelled on foot and by hitchhiking."
      },
      {
        "order": 2,
        "name": "Pretoria West",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 28.1563046868229,
        "latitude": -25.749999577712,
        "narrative": "Morgan did not intend to travel to South Africa, but found himself there after a truck driver gave him a lift. The driver took him to Pretoria to obtain refugee papers. Morgan experienced homelessness in Pretoria West while he waited for his papers and reports being chased in the streets by people telling him to ‘go back to where he’s from’. He decided he could no longer stay in Pretoria because of this treatment."
      },
      {
        "order": 3,
        "name": "Durban",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 31.0321387195435,
        "latitude": -29.8606300721835,
        "narrative": "Morgan then moved to Durban, where he says he experienced treatment similar to what he had faced in Pretoria."
      },
      {
        "order": 4,
        "name": "Musina",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "In 2015, Morgan moved from Durban to Musina. His wife and six children later moved from the DRC to join him there. The family lives in one room. They do not receive assistance from the government or NGOs. Morgan works as a barber to earn money. He still witnesses violence in Musina, but says he experiences it less than when he lived in Pretoria and Durban."
      }
    ],
    "sourceFile": "MAP460 webpage.html"
  },
  {
    "sourceId": "MAP514",
    "name": "Shingi",
    "title": "Mberengwa to Musina",
    "subtitle": "A cross-border work journey with repeated returns to Zimbabwe",
    "routeLabel": "Mberengwa → Beitbridge → Musina",
    "stops": [
      {
        "order": 1,
        "name": "Mberengwa",
        "role": "origin",
        "label": "Origin",
        "longitude": 29.9034133927085,
        "latitude": -20.4383472113538,
        "narrative": "Shingi grew up and got married in Mberengwa, Zimbabwe. He arrived in South Africa in 2008 and in Musina in 2023, in search of better job opportunities."
      },
      {
        "order": 2,
        "name": "Beitbridge",
        "role": "border",
        "label": "Border crossing",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "Shingi travelled by bus from Zimbabwe with his older brother, who knew the route. They were dropped near the bridge and, because they did not have passports, crossed the border via the river. He describes the journey as having gone smoothly."
      },
      {
        "order": 3,
        "name": "Musina",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Shingi visits Mberengwa three to four times a year. He chose Musina because he already knew the area from trading with nearby farms. For work, he helps people cross the river border, either by boat or by going through the river. He says he knows some police officers, so he rarely encounters problems, but will hide if he sees someone who causes problems. Although he knows people who have experienced difficulties with the police, he says he has not experienced such challenges himself."
      }
    ],
    "sourceFile": "MAP514 webpage.html"
  },
  {
    "sourceId": "MAP612",
    "name": "Benjamin",
    "title": "Rumonge to Musina",
    "subtitle": "A protracted forced migration journey through Tanzania, Zambia and Zimbabwe",
    "routeLabel": "Rumonge → Kigoma → Zambia → Musina",
    "stops": [
      {
        "order": 1,
        "name": "Rumonge",
        "role": "origin",
        "label": "Origin",
        "longitude": 29.4408718602686,
        "latitude": -3.97574074206648,
        "narrative": "Benjamin was born in Rumonge, Burundi, to a Rwandan mother and a Tanzanian father. He holds two engineering degrees, worked as a soldier and later became a politician. In 2015, he joined protests against the government, which responded violently. He fled Burundi on 12 December 2017, fearing for his life. He felt that he could not seek protection from the police because they supported the government. He wanted to come to South Africa because, as a child, he had known South African soldiers who were kind to him and gave him food."
      },
      {
        "order": 2,
        "name": "Kigoma",
        "role": "transit",
        "label": "Transit / stop",
        "longitude": 29.630382495861,
        "latitude": -4.88073459639866,
        "narrative": "Benjamin walked from Rumonge along Lake Tanganyika to Kigoma, Tanzania. However, men came looking for him in Kigoma, so he had to flee from there as well."
      },
      {
        "order": 3,
        "name": "Zambia",
        "role": "transit",
        "label": "Transit / stop",
        "longitude": 27.2191542010959,
        "latitude": -13.5631225079765,
        "narrative": "Benjamin had no money, food or documents, and walked through Tanzania, Zambia and Zimbabwe until he reached South Africa. He says he has tried to block out much of the journey because it was so difficult, and that the only border crossing he clearly remembers is the Tanzania–Zambia border. Sometimes he found shelter in a Muslim church, but he often slept outside. At times he hitchhiked with truck drivers. He describes language barriers as another difficulty and often used sign language to communicate with people along the way."
      },
      {
        "order": 4,
        "name": "Musina",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "On 14 April 2018, Benjamin arrived in South Africa. Although he says he will never feel completely safe as a foreigner in South Africa, he feels safe from Burundian soldiers. In Musina, he is often subjected to verbal abuse and says that people do not trust him. He has been robbed several times. He currently does piece jobs, such as welding, and also works as a barber. His family is still in Burundi, but he cannot return."
      }
    ],
    "sourceFile": "MAP612 webpage.html"
  },
  {
    "sourceId": "MAP617",
    "name": "Arnold",
    "title": "Masvingo to Musina",
    "subtitle": "A direct work journey sustained through repeated three-month stays",
    "routeLabel": "Masvingo → Beitbridge → Musina",
    "stops": [
      {
        "order": 1,
        "name": "Masvingo",
        "role": "origin",
        "label": "Origin",
        "longitude": 30.8235225035423,
        "latitude": -20.0701456888706,
        "narrative": "Arnold is from Masvingo, Zimbabwe. In 2017, he travelled to Musina in search of better job opportunities."
      },
      {
        "order": 2,
        "name": "Beitbridge",
        "role": "border",
        "label": "Border crossing",
        "longitude": 29.9947693144267,
        "latitude": -22.2027541672894,
        "narrative": "Arnold’s older brother, who already worked in Musina, brought him and gave him money for transport. Arnold got off at Beitbridge and took another car across the border. He had his passport stamped on both sides of the border and says he did not encounter any problems during the journey."
      },
      {
        "order": 3,
        "name": "Musina",
        "role": "settlement",
        "label": "Settlement",
        "longitude": 30.0480568615134,
        "latitude": -22.3607517343753,
        "narrative": "Arnold comes to Musina for three months at a time to work and save money, then returns home to his wife and children. He does this so that he can send his children to school, feed them and make sure they have clothes to wear. He works every day without rest."
      }
    ],
    "sourceFile": "MAP617 webpage.html"
  }
];
