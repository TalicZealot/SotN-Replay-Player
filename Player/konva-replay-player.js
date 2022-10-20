import Konva from 'konva';

const width = 904;
const height = 1414;
const defaultPlaybackSpeed = 0.15;
let scrollContainer;
let progressBar;

let mapRelics = [];
let playbackSpeed = 1;
let animationIndex = 0;
let oldIndex = 0;
let castle = 1;
let animationEnded = false;
let mapRelicsLoaded = false;
let stage = null;
let animation = null;
let players = [];
let longestReplay = 0;
let initialized = false;

let relicImages = [
    './images/SoulOfBat.png',
    './images/FireOfBat.png',
    './images/EchoOfBat.png',
    './images/ForceOfEcho.png',
    './images/SoulOfWolf.png',
    './images/PowerOfWolf.png',
    './images/SkillOfWolf.png',
    './images/FormOfMist.png',
    './images/PowerOfMist.png',
    './images/GasCloud.png',
    './images/CubeOfZoe.png',
    './images/SpiritOrb.png',
    './images/GravityBoots.png',
    './images/LeapStone.png',
    './images/HolySymbol.png',
    './images/FaerieScroll.png',
    './images/JewelOfOpen.png',
    './images/MermanStatue.png',
    './images/FaerieCard.png',
    './images/DemonCard.png',
    './images/HeartOfVlad.png',
    './images/ToothOfVlad.png',
    './images/RibOfVlad.png',
    './images/RingOfVlad.png',
    './images/GoldRing.png',
    './images/SilverRing.png',
    './images/SpikeBreaker.png',
    './images/HolyGlasses.png',
    './images/Claymore.png'
];

stage = null;
animation = null;
players = [];
var relicsLayer = new Konva.Layer();
var foregroundLayer = new Konva.Layer();

var colorSets = [
    { fill: '#FCFC38', stroke: '#b0b027' },
    { fill: '#CCE0D0', stroke: '#879489' },
    { fill: '#703014', stroke: '#240f06' },
    { fill: '#F88C14', stroke: '#ab610e' },
    { fill: '#88409C', stroke: '#45204f' },
    { fill: '#2CB494', stroke: '#196956' },
    { fill: '#0C48CC', stroke: '#082e80' },
    { fill: '#F40404', stroke: '#a80303' },
];

function createProgressBar(parent) {
    let input = document.createElement("input");
    input.setAttribute("type", "range");
    input.setAttribute("value", 1);
    input.setAttribute("step", 1);
    input.setAttribute("min", 1);
    input.setAttribute("max", 1000);
    input.setAttribute("id", "progress-bar");

    parent.append(input);
}

function approach(object, point) {
    let currentXpos = object.x();
    let currentYpos = object.y();

    if (point.x < 1 || point.y < 1) {
        return;
    }

    if (Math.abs(currentXpos - point.x) < 0.2) {
        object.x(point.x);
    } else if (currentXpos < point.x) {
        object.x(currentXpos + ((0.4 * playbackSpeed) + ((0.05 * playbackSpeed) * (point.x - currentXpos))));
    } else if (currentXpos > point.x) {
        object.x(currentXpos - ((0.4 * playbackSpeed) + ((0.05 * playbackSpeed) * (currentXpos - point.x))));
    }

    if (Math.abs(currentYpos - point.y) < 0.2) {
        object.y(point.y);
    } else if (currentYpos < point.y) {
        object.y(currentYpos + ((0.4 * playbackSpeed) + ((0.05 * playbackSpeed) * (point.y - currentYpos))));
    } else if (currentYpos > point.y) {
        object.y(currentYpos - ((0.4 * playbackSpeed) + ((0.05 * playbackSpeed) * (currentYpos - point.y))));
    }
}

function setRelics(index, source, destination) {
    let relicKeys = Object.getOwnPropertyNames(destination);
    for (let i = 0; i < relicKeys.length; i++) {
        destination[relicKeys[i]] = source[index].relics[relicKeys[i]] > 0;
    }
}

function showFirstCastle() {
    scrollContainer.scrollBy({
        top: 707,
        behavior: 'auto'
    });
}

function showSecondtCastle() {
    scrollContainer.scrollBy({
        top: -707,
        behavior: 'auto'
    });
}

/*
function displayRelics(relics, player) {
    let affix = player > 1 ? "2" : "";
    let relicKeys = Object.getOwnPropertyNames(relics);
    for (let i = 0; i < relicKeys.length; i++) {
        let currentRelic = $('#' + relicKeys[i] + affix);
        if (relics[relicKeys[i]] && currentRelic.hasClass('uncollected')) {
            currentRelic.removeClass('uncollected');
        } else if (!relics[relicKeys[i]] && !currentRelic.hasClass('uncollected')) {
            currentRelic.addClass('uncollected');
        }
    }
}
*/

const KonvaReplayPlayer = {
    initializeRelicImages: async function () {
        if (mapRelicsLoaded) {
            return;
        }
        mapRelicsLoaded = true;

        let imagePromises = [];
        for (let i = 0; i < relicImages.length; i++) {
            let imagePromise = new Promise((resolve) => {
                Konva.Image.fromURL(relicImages[i], function (relic) {
                    relic.setAttrs({
                        x: -20,
                        y: -20,
                        width: 14,
                        height: 14
                    });
                    relicsLayer.add(relic);
                    mapRelics.push(relic);
                    resolve();
                });
            });
            imagePromises.push(imagePromise);
        }

        await Promise.all(imagePromises);
    },
    initialize: function (replays) {
        if (initialized) {
            return;
        }
        initialized = true;
        scrollContainer = document.getElementById('scroll-container');
        let progressBarContainer = document.getElementById('progress-bar-container');
        createProgressBar(progressBarContainer);
        progressBar = document.getElementById('progress-bar');

        progressBar.addEventListener('mousedown', (e) => {
            this.pause();
        });
        progressBar.addEventListener('change', (e) => {
            progressBar.setAttribute("value", e.target.value);
            this.pause();
            this.seek();
        });

        stage = new Konva.Stage({
            container: 'main-map',
            width: width,
            height: height
        });

        const lengths = replays.map(a => a.frames.length);
        let longestReplayIndex = lengths.indexOf(Math.max(...lengths));
        longestReplay = lengths[longestReplayIndex];

        replays.forEach(replay => {
            let colorSet = colorSets.pop();
            let player = {
                indicator: new Konva.Circle({
                    x: 8,
                    y: 1240,
                    radius: 5,
                    fill: colorSet.fill,
                    stroke: 'white',
                    strokeWidth: 2
                }),
                trail: new Konva.Path({
                    x: 0,
                    y: 0,
                    stroke: colorSet.stroke,
                    strokeWidth: 4,
                    opacity: 0.8,
                    shadowColor: 'black',
                    shadowBlur: 0,
                    shadowOffset: { x: 1, y: 1 },
                    shadowOpacity: 0.8
                }),
                replay: replay.frames,
                onTop: true,
                replaySvgData: replay.svgPathData,
                relics: {
                    SoulOfBat: false,
                    FireOfBat: false,
                    EchoOfBat: false,
                    ForceOfEcho: false,
                    SoulOfWolf: false,
                    PowerOfWolf: false,
                    SkillOfWolf: false,
                    FormOfMist: false,
                    PowerOfMist: false,
                    GasCloud: false,
                    CubeOfZoe: false,
                    SpiritOrb: false,
                    GravityBoots: false,
                    LeapStone: false,
                    HolySymbol: false,
                    FaerieScroll: false,
                    JewelOfOpen: false,
                    MermanStatue: false,
                    FaerieCard: false,
                    DemonCard: false,
                    HeartOfVlad: false,
                    ToothOfVlad: false,
                    RibOfVlad: false,
                    RingOfVlad: false,
                    EyeOfVlad: false,
                    GoldRing: false,
                    SilverRing: false,
                    SpikeBreaker: false,
                    HolyGlasses: false,
                    ThrustSword: false
                }
            };
            players.push(player);

            console.log(mapRelics);

            for (let i = 0; i < replay.relics.length - 3; i++) {
                if (mapRelics[i].x > 0) {
                    mapRelics[i].setAttrs({
                        x: replay.relics[i].x,
                        y: replay.relics[i].y
                    })
                }
            }
        });

        for (let i = players.length - 1; i >= 0; i--) {
            players[i].trail.offsetX(0);
            players[i].trail.offsetY(0);
            foregroundLayer.add(players[i].trail);
        }

        for (let i = players.length - 1; i >= 0; i--) {
            foregroundLayer.add(players[i].indicator);
        }

        players.forEach(player => {
            player.warp = new Konva.Tween({
                node: player.indicator,
                duration: 0.4,
                fill: 'white',
                opacity: 0.3,
                scaleX: 2,
            });
            player.isWarping = false;
        });

        stage.add(foregroundLayer);
        stage.add(relicsLayer);

        animation = new Konva.Animation(function (frame) {
            let index = Math.round(animationIndex);
            let focusPlayer = players[0];

            let animationSpeed = playbackSpeed * defaultPlaybackSpeed;

            players.forEach(player => {
                if ((player.replay.length > (index + 1) && player.replay[index + 1].warp) || player.replay[index].warp) {
                    animationSpeed = defaultPlaybackSpeed / 4;
                    if (!player.isWarping) {
                        player.warp.play();
                        player.isWarping = true;
                    }

                } else if (player.isWarping) {
                    player.warp.reverse();
                    player.isWarping = false;
                }
            });

            animationIndex += animationSpeed;
            index = Math.round(animationIndex);

            if (focusPlayer.replay.length > index && focusPlayer.replay[index].secondCastle) {
                if (castle === 1) {
                    castle = 2;
                    showSecondtCastle();
                }
            } else {
                if (castle === 2) {
                    castle = 1;
                    showFirstCastle();
                }
            }

            players.forEach(player => {
                if (player.replay.length > index) {
                    approach(player.indicator, player.replay[index]);
                }
            });

            if (index > oldIndex) {
                players.forEach(player => {
                    if (player.replaySvgData.length > index) {
                        player.trail.data(player.replaySvgData[index - 1]);
                    }
                });
                oldIndex = index;

                let newProgress = Math.round((index / longestReplay) * 1000);
                progressBar.value = newProgress;

                /*
                if (playerA.replay) {
                    setRelics(indexA, playerA.replay, playerA.relics);
                    displayRelics(playerA.relics, 1);
                }
                if (playerB.replay) {
                    setRelics(indexB, playerB.replay, playerB.relics);
                    displayRelics(playerB.relics, 2);
                }
                */
            }

            if (index === longestReplay) {
                animationEnded = true;
                animation.stop();
            }
        }, foregroundLayer);
    },
    play: function () {
        if (animation.isRunning()) {
            animation.stop();
        } else {
            if (animationEnded) {
                animationEnded = false;
                this.rewind();
            }
            animation.start();
        }
    },
    pause: function () {
        animation.stop();
    },
    rewind: function () {
        this.pause();
        showFirstCastle();
        animationIndex = 0;
        oldIndex = 0;
        castle = 1;

        players.forEach(player => {
            player.trail.data(player.replaySvgData[0]);
            player.indicator.x(player.replay[0].x);
            player.indicator.y(player.replay[0].y);
        });

        foregroundLayer.batchDraw();
    },
    seek: function () {
        let progress = parseInt(progressBar.getAttribute("value"));
        let index;

        index = Math.round((longestReplay - 1) * (progress / 1000));

        animationIndex = index;
        oldIndex = index;

        players.forEach(player => {
            if (player.replay.length > index) {
                player.trail.data(player.replaySvgData[index]);
                player.indicator.x(player.replay[index].x);
                player.indicator.y(player.replay[index].y);
            }
        });

        foregroundLayer.batchDraw();
    },
    setPlaybackSpeed: function (speed) {
        playbackSpeed = speed;
    }
};

export { KonvaReplayPlayer };