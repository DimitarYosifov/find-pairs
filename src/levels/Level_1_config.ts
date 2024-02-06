export const lvl1 = {

    "validate": () => {

        let totalCards = lvl1.dimentions.map(x => x.filter(e => e === 1).length).reduce((a, b) => a + b);
        let totalCardIds = lvl1.in_lvl_card_ids.map(x => x.count).reduce((a, b) => a + b);
        if (totalCards !== totalCardIds) {
            // elements set as "ones" in dimention arrays
            // do not match in_lvl_card_ids count
            alert("cards defined in dimention arrays do not match cards count");
            return false;
        }



    },
    "dimentions": [
        // [1, 1, 1, 1],
        // [1, 1, 1, 1],
        // [1, 1, 1, 1],

        [0, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 0]
    ],
    "completionTime": 60,
    "totalCardFieldsCount": () => { return lvl1.dimentions[0].length * lvl1.dimentions.length },
    "in_lvl_card_ids": [
        {
            "type": "ace",
            "count": 6
        },
        {
            "type": "J",
            "count": 10
        },
        {
            "type": "K",
            "count": 10
        },
        {
            "type": "Q",
            "count": 10
        }
    ]
}