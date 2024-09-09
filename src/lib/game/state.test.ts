import { expect, test } from "vitest";
import { computeState } from "./state";
import type { Ruleset } from "@prisma/client";

test("test", () => {
    const players = [
        {
            "id": "458123701766979596",
            "avatar": "b24a7169a7dadb441b74e0d2965c46ba",
            "username": "bakarinya"
        },
        {
            "id": "675931009140654121",
            "avatar": "24ac76f4a5f6946dd11356685de0485d",
            "username": "nursewitchkomugi"
        },
        {
            "id": "308692828739993600",
            "avatar": "09944573b1fce6bb880c7dae93ea33b5",
            "username": "kaiiste"
        },
        {
            "id": "358232083531038720",
            "avatar": "3e20a22bf0607ad2d23bc119c6ff3c95",
            "username": "akadora3"
        }
    ]

    const ruleset: Ruleset = {
        "id": 1,
        "name": "test",
        "startScore": 25000,
        "returnScore": 30000,
        "uma": {
            "uma": [
                10,
                5,
                -5,
                -10
            ],
            "type": "simple"
        },
        "honba": 300,
        "tenpaiFee": 3000,
        "endgamePot": "TOP",
        "tiebreaker": "WIND",
        "renchan": "TENPAI",
        "allLast": "AGARIYAME",
        "doubleRon": true,
        "tripleRon": true,
        "nagashi": "Mangan",
        "nagashiIsTsumo": false,
        "oyaNagashi": false,
        "suddenDeath": null,
        "tobi": true,
        "tobiAtZero": false,
        "calledGame": null,
        "riichiBelow1000": true,
        "scores": {
            "dealer": {
                "ron": [
                    [
                        "1 Han",
                        [
                            [
                                "30 Fu",
                                1500
                            ],
                            [
                                "40 Fu",
                                2000
                            ],
                            [
                                "50 Fu",
                                2400
                            ],
                            [
                                "60 Fu",
                                2900
                            ],
                            [
                                "70 Fu",
                                3400
                            ],
                            [
                                "80 Fu",
                                3900
                            ],
                            [
                                "90 Fu",
                                4400
                            ],
                            [
                                "100 Fu",
                                4800
                            ],
                            [
                                "110 Fu",
                                5300
                            ]
                        ]
                    ],
                    [
                        "2 Han",
                        [
                            [
                                "30 Fu",
                                2900
                            ],
                            [
                                "40 Fu",
                                3900
                            ],
                            [
                                "50 Fu",
                                4800
                            ],
                            [
                                "60 Fu",
                                5800
                            ],
                            [
                                "70 Fu",
                                6800
                            ],
                            [
                                "80 Fu",
                                7700
                            ],
                            [
                                "90 Fu",
                                8700
                            ],
                            [
                                "100 Fu",
                                9600
                            ],
                            [
                                "110 Fu",
                                10600
                            ]
                        ]
                    ],
                    [
                        "3 Han",
                        [
                            [
                                "25 Fu",
                                4800
                            ],
                            [
                                "30 Fu",
                                5800
                            ],
                            [
                                "40 Fu",
                                7700
                            ],
                            [
                                "50 Fu",
                                9600
                            ]
                        ]
                    ],
                    [
                        "4 Han",
                        [
                            [
                                "25 Fu",
                                9600
                            ]
                        ]
                    ],
                    [
                        "Mangan",
                        12000
                    ],
                    [
                        "Haneman",
                        18000
                    ],
                    [
                        "Baiman",
                        24000
                    ],
                    [
                        "Sanbaiman",
                        36000
                    ],
                    [
                        "Yakuman",
                        32000
                    ]
                ],
                "tsumo": [
                    [
                        "1 Han",
                        [
                            [
                                "30 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 500
                                }
                            ],
                            [
                                "40 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 700
                                }
                            ],
                            [
                                "50 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 800
                                }
                            ],
                            [
                                "60 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1000
                                }
                            ],
                            [
                                "70 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1200
                                }
                            ],
                            [
                                "80 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1300
                                }
                            ],
                            [
                                "90 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1500
                                }
                            ],
                            [
                                "100 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1600
                                }
                            ],
                            [
                                "110 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1800
                                }
                            ]
                        ]
                    ],
                    [
                        "2 Han",
                        [
                            [
                                "20 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 700
                                }
                            ],
                            [
                                "30 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1000
                                }
                            ],
                            [
                                "40 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1300
                                }
                            ],
                            [
                                "50 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1600
                                }
                            ],
                            [
                                "60 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 2000
                                }
                            ],
                            [
                                "70 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 2300
                                }
                            ],
                            [
                                "80 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 2600
                                }
                            ],
                            [
                                "90 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 2900
                                }
                            ],
                            [
                                "100 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 3200
                                }
                            ],
                            [
                                "110 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 3600
                                }
                            ]
                        ]
                    ],
                    [
                        "3 Han",
                        [
                            [
                                "20 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1300
                                }
                            ],
                            [
                                "25 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 1600
                                }
                            ],
                            [
                                "30 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 2000
                                }
                            ],
                            [
                                "40 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 2600
                                }
                            ],
                            [
                                "50 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 3200
                                }
                            ]
                        ]
                    ],
                    [
                        "4 Han",
                        [
                            [
                                "20 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 2600
                                }
                            ],
                            [
                                "25 Fu",
                                {
                                    "fromDealer": 0,
                                    "fromNonDealer": 3200
                                }
                            ]
                        ]
                    ],
                    [
                        "Mangan",
                        {
                            "fromDealer": 0,
                            "fromNonDealer": 4000
                        }
                    ],
                    [
                        "Haneman",
                        {
                            "fromDealer": 0,
                            "fromNonDealer": 6000
                        }
                    ],
                    [
                        "Baiman",
                        {
                            "fromDealer": 0,
                            "fromNonDealer": 8000
                        }
                    ],
                    [
                        "Sanbaiman",
                        {
                            "fromDealer": 0,
                            "fromNonDealer": 12000
                        }
                    ],
                    [
                        "Yakuman",
                        {
                            "fromDealer": 0,
                            "fromNonDealer": 16000
                        }
                    ]
                ]
            },
            "nonDealer": {
                "ron": [
                    [
                        "1 Han",
                        [
                            [
                                "30 Fu",
                                1000
                            ],
                            [
                                "40 Fu",
                                1300
                            ],
                            [
                                "50 Fu",
                                1600
                            ],
                            [
                                "60 Fu",
                                2000
                            ],
                            [
                                "70 Fu",
                                2300
                            ],
                            [
                                "80 Fu",
                                2600
                            ],
                            [
                                "90 Fu",
                                2900
                            ],
                            [
                                "100 Fu",
                                3200
                            ],
                            [
                                "110 Fu",
                                3600
                            ]
                        ]
                    ],
                    [
                        "2 Han",
                        [
                            [
                                "30 Fu",
                                2000
                            ],
                            [
                                "40 Fu",
                                2600
                            ],
                            [
                                "50 Fu",
                                3200
                            ],
                            [
                                "60 Fu",
                                3900
                            ],
                            [
                                "70 Fu",
                                4500
                            ],
                            [
                                "80 Fu",
                                5200
                            ],
                            [
                                "90 Fu",
                                5800
                            ],
                            [
                                "100 Fu",
                                6400
                            ],
                            [
                                "110 Fu",
                                7100
                            ]
                        ]
                    ],
                    [
                        "3 Han",
                        [
                            [
                                "25 Fu",
                                3200
                            ],
                            [
                                "30 Fu",
                                3900
                            ],
                            [
                                "40 Fu",
                                5200
                            ],
                            [
                                "50 Fu",
                                6400
                            ]
                        ]
                    ],
                    [
                        "4 Han",
                        [
                            [
                                "25 Fu",
                                6400
                            ]
                        ]
                    ],
                    [
                        "Mangan",
                        8000
                    ],
                    [
                        "Haneman",
                        12000
                    ],
                    [
                        "Baiman",
                        16000
                    ],
                    [
                        "Sanbaiman",
                        24000
                    ],
                    [
                        "Yakuman",
                        32000
                    ]
                ],
                "tsumo": [
                    [
                        "1 Han",
                        [
                            [
                                "30 Fu",
                                {
                                    "fromDealer": 500,
                                    "fromNonDealer": 300
                                }
                            ],
                            [
                                "40 Fu",
                                {
                                    "fromDealer": 700,
                                    "fromNonDealer": 400
                                }
                            ],
                            [
                                "50 Fu",
                                {
                                    "fromDealer": 800,
                                    "fromNonDealer": 400
                                }
                            ],
                            [
                                "60 Fu",
                                {
                                    "fromDealer": 1000,
                                    "fromNonDealer": 500
                                }
                            ],
                            [
                                "70 Fu",
                                {
                                    "fromDealer": 1200,
                                    "fromNonDealer": 600
                                }
                            ],
                            [
                                "80 Fu",
                                {
                                    "fromDealer": 1300,
                                    "fromNonDealer": 700
                                }
                            ],
                            [
                                "90 Fu",
                                {
                                    "fromDealer": 1500,
                                    "fromNonDealer": 800
                                }
                            ],
                            [
                                "100 Fu",
                                {
                                    "fromDealer": 1600,
                                    "fromNonDealer": 800
                                }
                            ],
                            [
                                "110 Fu",
                                {
                                    "fromDealer": 1800,
                                    "fromNonDealer": 900
                                }
                            ]
                        ]
                    ],
                    [
                        "2 Han",
                        [
                            [
                                "20 Fu",
                                {
                                    "fromDealer": 700,
                                    "fromNonDealer": 400
                                }
                            ],
                            [
                                "30 Fu",
                                {
                                    "fromDealer": 1000,
                                    "fromNonDealer": 500
                                }
                            ],
                            [
                                "40 Fu",
                                {
                                    "fromDealer": 1300,
                                    "fromNonDealer": 700
                                }
                            ],
                            [
                                "50 Fu",
                                {
                                    "fromDealer": 1600,
                                    "fromNonDealer": 800
                                }
                            ],
                            [
                                "60 Fu",
                                {
                                    "fromDealer": 2000,
                                    "fromNonDealer": 1000
                                }
                            ],
                            [
                                "70 Fu",
                                {
                                    "fromDealer": 2300,
                                    "fromNonDealer": 1200
                                }
                            ],
                            [
                                "80 Fu",
                                {
                                    "fromDealer": 2600,
                                    "fromNonDealer": 1300
                                }
                            ],
                            [
                                "90 Fu",
                                {
                                    "fromDealer": 2900,
                                    "fromNonDealer": 1500
                                }
                            ],
                            [
                                "100 Fu",
                                {
                                    "fromDealer": 3200,
                                    "fromNonDealer": 1600
                                }
                            ],
                            [
                                "110 Fu",
                                {
                                    "fromDealer": 3600,
                                    "fromNonDealer": 1800
                                }
                            ]
                        ]
                    ],
                    [
                        "3 Han",
                        [
                            [
                                "20 Fu",
                                {
                                    "fromDealer": 1300,
                                    "fromNonDealer": 700
                                }
                            ],
                            [
                                "25 Fu",
                                {
                                    "fromDealer": 1600,
                                    "fromNonDealer": 800
                                }
                            ],
                            [
                                "30 Fu",
                                {
                                    "fromDealer": 2000,
                                    "fromNonDealer": 1000
                                }
                            ],
                            [
                                "40 Fu",
                                {
                                    "fromDealer": 2600,
                                    "fromNonDealer": 1300
                                }
                            ],
                            [
                                "50 Fu",
                                {
                                    "fromDealer": 3200,
                                    "fromNonDealer": 1600
                                }
                            ]
                        ]
                    ],
                    [
                        "4 Han",
                        [
                            [
                                "20 Fu",
                                {
                                    "fromDealer": 2600,
                                    "fromNonDealer": 1300
                                }
                            ],
                            [
                                "25 Fu",
                                {
                                    "fromDealer": 3200,
                                    "fromNonDealer": 1600
                                }
                            ]
                        ]
                    ],
                    [
                        "Mangan",
                        {
                            "fromDealer": 4000,
                            "fromNonDealer": 2000
                        }
                    ],
                    [
                        "Haneman",
                        {
                            "fromDealer": 6000,
                            "fromNonDealer": 3000
                        }
                    ],
                    [
                        "Baiman",
                        {
                            "fromDealer": 8000,
                            "fromNonDealer": 4000
                        }
                    ],
                    [
                        "Sanbaiman",
                        {
                            "fromDealer": 12000,
                            "fromNonDealer": 6000
                        }
                    ],
                    [
                        "Yakuman",
                        {
                            "fromDealer": 16000,
                            "fromNonDealer": 8000
                        }
                    ]
                ]
            }
        },
        "note": "",
        "parlorId": 1,
        "allLastPlacement": 1,
        "multiRonHonbaPolicy": "ATAMAHANE",
        "multiRonPotPolicy": "ATAMAHANE",
        "length": "HANCHAN",
        "player": "FOUR",
        "record": "HAND",
        "chonbo": {
            "name": "Mangan",
            "type": "score",
            "affectsScore": true
        }
    }

    const actions: PrismaJson.Actions = [
        {
            "at": "2024-08-19T19:24:53.034-07:00",
            "type": "start",
        },
        {
            "type": "tsumo",
            "scores": {
                "308692828739993600": 300,
                "358232083531038720": 300,
                "458123701766979596": 500
            },
            "winner": "675931009140654121"
        },
        {
            "type": "riichi",
            "player": "358232083531038720"
        },
        {
            "type": "tsumo",
            "scores": {
                "308692828739993600": 3000,
                "458123701766979596": 3000,
                "675931009140654121": 6000
            },
            "winner": "358232083531038720"
        },
        {
            "type": "tsumo",
            "scores": {
                "308692828739993600": 2000,
                "358232083531038720": 1000,
                "675931009140654121": 1000
            },
            "winner": "458123701766979596"
        },
        {
            "type": "riichi",
            "player": "458123701766979596"
        },
        {
            "type": "ron",
            "loser": "358232083531038720",
            "scores": {
                "458123701766979596": 8000
            }
        },
        {
            "type": "riichi",
            "player": "675931009140654121"
        },
        {
            "type": "ron",
            "loser": "458123701766979596",
            "scores": {
                "308692828739993600": 8000
            }
        },
        {
            "type": "riichi",
            "player": "358232083531038720"
        },
        {
            "type": "ron",
            "loser": "675931009140654121",
            "scores": {
                "358232083531038720": 3900
            }
        },
        {
            "type": "riichi",
            "player": "675931009140654121"
        },
        {
            "type": "tsumo",
            "scores": {
                "308692828739993600": 2000,
                "358232083531038720": 1000,
                "458123701766979596": 1000
            },
            "winner": "675931009140654121"
        },
        {
            "type": "riichi",
            "player": "675931009140654121"
        },
        {
            "type": "riichi",
            "player": "458123701766979596"
        },
        {
            "type": "ron",
            "loser": "675931009140654121",
            "scores": {
                "458123701766979596": 3900
            }
        },
        {
            "type": "riichi",
            "player": "308692828739993600"
        }
    ]

    const state = computeState({
        players,
        actions,
        ruleset,
    })

    if (!state.ok) {
        console.log(state.error)
    } else {
        console.log(state.value)
    }
})