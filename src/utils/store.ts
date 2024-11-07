import { createStore } from 'tinybase';
import { Player, PlayerData } from './dataTypes';

const positions = ['QB', 'RB', 'WR', 'TE', 'DEF', 'K'];

const defaultDataHandler = (pos: string, data: { players: Array<PlayerData>},) => {
    //@ts-ignore
    window.DraftTool.fRankedLists[pos] = data.players;
}

async function fetchPositionData(year:number, dataCallback = defaultDataHandler) {
    return Promise.all(positions.map(
        (pos) => fetch(import.meta.env.BASE_URL + `data/rankings/${year}/${pos}.json`, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then(
            async (response) => { 
                if (!response.ok) {
                    throw new Error(`${response.url}:${response.status}`);
                }
                return await response.json();
            }
        ).then((data) => {
            dataCallback(pos, data);
        })
    ));
}


function addPlayerProperties(player:PlayerData):Player {
    return Object.assign(player, { drafted: false })
}

export function createAndSeedStore(seededCallback:Function, year = new Date().getFullYear()) {
    const store = createStore();
    const localData = localStorage?.DraftTool;
    if(localData) {
        store.setJson(localData);
        seededCallback();
        console.log('Store is Seeded by localStorage');
    } else {
        fetchPositionData(year, (pos, data) => {
            const players = data.players;
            for (let player of players) {
                const playerId = `${pos}${player.rank}`;
                const sPlayer:any = addPlayerProperties(player);
                store.setRow(pos, playerId, sPlayer);
            }
        }).then(() => {
            seededCallback();
        });

        console.log('Store is Seeded by script data');
    }

    // @ts-ignore
    window.draftStore = store;
    
    return store;
}