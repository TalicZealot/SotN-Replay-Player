const width = 904;
const height = 1414;
const defaultPlaybackSpeed = 0.04;
const validExtension = "sotnr";

const scrollContainer = document.getElementById('scroll-container');
const replayFileA = $('#replay-file-A');
const replayFileB = $('#replay-file-B');
const uploadBox = $('#upload-box');
const playButton = $('#play-button');
const rewindButton = $("#rewind-button");
const progressBar = $('#progress-bar');
const speedButton = $('#speed-button');
const speedButtonText = $('#speed-button-text');
const speedSelectPanel = $('#speed-select-panel');
const speedSelectHalf = $('#speed-select-half');
const speedSelectNormal = $('#speed-select-normal');
const speedSelectDouble = $('#speed-select-double');
const speedSelectTripple = $('#speed-select-tripple');

var stage = new Konva.Stage({
    container: 'main-map',
    width: width,
    height: height
});

var playerA = {
    indicator: new Konva.Circle({
        x: 8,
        y: 1240,
        radius: 5,
        fill: '#fd5123',
        stroke: 'white',
        strokeWidth: 2
    }),
    trail: new Konva.Path({
        x: 0,
        y: 0,
        stroke: '#de542f',
        strokeWidth: 4,
        opacity: 0.8,
        shadowColor: 'black',
        shadowBlur: 0,
        shadowOffset: { x: 1, y: 1 },
        shadowOpacity: 0.6
    }),
    replay: null,
    replaySvgData: []
};

var playerB = {
    indicator: new Konva.Circle({
        x: 8,
        y: 1240,
        radius: 5,
        fill: '#345fff',
        stroke: 'white',
        strokeWidth: 2
    }),
    trail: new Konva.Path({
        x: 0,
        y: 0,
        stroke: '#0b1291',
        strokeWidth: 4,
        opacity: 0.8
    }),
    replay: null,
    replaySvgData: []
};

var background = new Konva.Layer();
var relicsLayer = new Konva.Layer();
var foreground = new Konva.Layer();
foreground.add(playerB.trail);
foreground.add(playerA.trail);
foreground.add(playerB.indicator);
foreground.add(playerA.indicator);
stage.add(background);
stage.add(relicsLayer);
stage.add(foreground);

var tweents = {
    warpOutPlayerA: new Konva.Tween({
        node: playerA.indicator,
        duration: 0.4,
        fill: 'white',
        opacity: 0.3,
        scaleX: 2,
    }),
    warpOutPlayerB: new Konva.Tween({
        node: playerB.indicator,
        duration: 0.4,
        fill: 'white',
        opacity: 0.3,
        scaleX: 2
    }),
    isWarpingPlayerB: false,
    isWarpingPlayerA: false
};

var relics = {
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
    BatCard: false,
    GhostCard: false,
    FaerieCard: false,
    DemonCard: false,
    SwordCard: false,
    SpriteCard: false,
    NoseDevilCard: false,
    HeartOfVlad: false,
    ToothOfVlad: false,
    RibOfVlad: false,
    RingOfVlad: false,
    EyeOfVlad: false,
    GoldRing: false,
    SilverRing: false,
    SpikeBreaker: false,
    HolyGlasses: false
        //ThrustSword: false,
};

var mapElement = new Image();
mapElement.src = './images/map.png';
mapElement.onload = function() {
    var mapImage = new Konva.Image({
        x: 0,
        y: 0,
        image: mapElement,
        width: 904,
        height: 1414
    });

    background.add(mapImage);
    background.batchDraw();
};

mapRelics = new Array(relics.length);

var speedsPanelShown = false;
var animation;
var playbackSpeed = 1;
var animationIndex = 0;
var oldIndex = 0;
var castle = 1;
var animationEnded = false;

function getManhattanDistance(pointA, pointB) {
    let xdifference = Math.abs(pointA.x - pointB.x);
    let ydifference = Math.abs(pointA.y - pointB.y);
    return (xdifference + ydifference);
}

function rewind() {
    pause();
    showFirstCastle();
    animationIndex = 0;
    oldIndex = 0;
    castle = 1;

    if (playerA.replay) {
        playerA.trail.data(playerA.replaySvgData[0]);
        playerA.indicator.x(playerA.replay[0].x);
        playerA.indicator.y(playerA.replay[0].y);
    }

    if (playerB.replay) {
        playerB.trail.data(playerB.replaySvgData[0]);
        playerB.indicator.x(playerB.replay[0].x);
        playerB.indicator.y(playerB.replay[0].y);
    }

    foreground.batchDraw();
}

function seek() {
    if (!playerA.replay) {
        return;
    }
    let progress = progressBar.val();
    let index;

    if (playerB.replay && playerB.replay.length > playerA.replay.length) {
        index = Math.round((playerB.replay.length - 1) * (progress / 1000));
    } else {
        index = Math.round((playerA.replay.length - 1) * (progress / 1000));
    }

    animationIndex = index;
    oldIndex = index;
    let indexA = index;
    if (indexA > playerA.replay.length - 1) {
        indexA = playerA.replay.length - 1;
    }

    playerA.indicator.x(playerA.replay[indexA].x);
    playerA.indicator.y(playerA.replay[indexA].y);

    playerA.trail.data(playerA.replaySvgData[indexA]);

    if (playerB.replay) {
        if (index > playerB.replay.length - 1) {
            index = playerB.replay.length - 1;
        }
        playerB.indicator.x(playerB.replay[index].x);
        playerB.indicator.y(playerB.replay[index].y);

        playerB.trail.data(playerB.replaySvgData[index]);
    }

    foreground.batchDraw();
}

function getReplayData(replayRows) {
    var pathCoords = [];
    replayRows.forEach(step => {
        let values = step.split(":");
        let thrust = 0;
        let warp = false;

        if (!values[0] || values[0] > 100 || !values[1] || values[1] > 100) {
            return;
        }

        if (values[37]) {
            thrust = values[37];
        }

        let secondCastle = values[2] > 0;
        let x = (((values[0] - 1) * 15) - 7);
        let y;
        if (secondCastle) {
            y = ((values[1] * 15) - 170);
        } else {
            y = (640 + (values[1] * 15));
        }

        if (pathCoords.length > 0 && getManhattanDistance({ x: x, y: y }, pathCoords[pathCoords.length - 1]) > 30) {
            warp = true;
        }

        pathCoords.push({
            x: x,
            y: y,
            warp: warp,
            secondCastle: secondCastle,
            relics: {
                SoulOfBat: values[3],
                FireOfBat: values[4],
                EchoOfBat: values[5],
                ForceOfEcho: values[6],
                SoulOfWolf: values[7],
                PowerOfWolf: values[8],
                SkillOfWolf: values[9],
                FormOfMist: values[10],
                PowerOfMist: values[11],
                GasCloud: values[12],
                CubeOfZoe: values[13],
                SpiritOrb: values[14],
                GravityBoots: values[15],
                LeapStone: values[16],
                HolySymbol: values[17],
                FaerieScroll: values[18],
                JewelOfOpen: values[19],
                MermanStatue: values[20],
                BatCard: values[21],
                GhostCard: values[22],
                FaerieCard: values[23],
                DemonCard: values[24],
                SwordCard: values[25],
                SpriteCard: values[26],
                NoseDevilCard: values[27],
                HeartOfVlad: values[28],
                ToothOfVlad: values[29],
                RibOfVlad: values[30],
                RingOfVlad: values[31],
                EyeOfVlad: values[32],
                GoldRing: values[33],
                SilverRing: values[34],
                SpikeBreaker: values[35],
                HolyGlasses: values[36],
                ThrustSword: thrust
            }
        });
    });
    return pathCoords;
}

function getRelicLocations(replayData) {
    let relicKeys = Object.getOwnPropertyNames(relics);
    for (let i = 1; i < replayData.length; i++) {
        for (let j = 0; j < relicKeys.length; j++) {
            if (replayData[i].relics[relicKeys[j]] > 0 && replayData[i - 1].relics[relicKeys[j]] == 0) {
                relicKeys.splice(j, 1);
                if (!mapRelics[j]) {
                    continue;
                }
                mapRelics[j].x(replayData[i].x);
                mapRelics[j].y(replayData[i].y - 8);
            }
        }
    }
    relicsLayer.batchDraw();
}

function generateSvgPathData(replayData, pathData, offset) {
    let startNode = 'M' + replayData[0].x + ',' + replayData[0].y + ' ';
    pathData.push(startNode);
    for (let i = 1; i < replayData.length; i++) {
        let node = pathData[i - 1];

        if (i > 0 && replayData[i].warp) {
            node += 'M';
        } else {
            node += 'L';
        }

        node += (replayData[i].x + offset.x) + ',' + (replayData[i].y + offset.y) + ' ';
        pathData.push(node);
    }
}

function startPlayback() {

    if (playerA.replay) {
        playerA.trail.data(playerA.replaySvgData[0]);
        playerA.indicator.x(playerA.replay[0].x);
        playerA.indicator.y(playerA.replay[0].y);
    }
    if (playerB.replay) {
        playerB.trail.data(playerB.replaySvgData[0]);
        playerB.indicator.x(playerB.replay[0].x);
        playerB.indicator.y(playerB.replay[0].y);
    }

    animation = new Konva.Animation(function(frame) {
        let index = Math.round(animationIndex);
        let indexA = index;
        let indexB = index;

        if (playerA.replay && index >= playerA.replay.length) {
            indexA = playerA.replay.length - 1;
        }

        if (playerB.replay && index >= playerB.replay.length) {
            indexB = playerB.replay.length - 1;
        }

        let animationSpeed = playbackSpeed * defaultPlaybackSpeed;

        if ((playerA.replay && indexA < playerA.replay.length - 1 && playerA.replay[indexA + 1].warp) ||
            (playerA.replay && playerA.replay[indexA].warp)) {
            animationSpeed = defaultPlaybackSpeed / 4;

            if (!tweents.isWarpingPlayerA) {
                tweents.warpOutPlayerA.play();
                tweents.isWarpingPlayerA = true;
            }

        } else if (tweents.isWarpingPlayerA) {
            tweents.warpOutPlayerA.reverse();
            tweents.isWarpingPlayerA = false;
        }

        if ((playerB.replay && indexB < playerB.replay.length - 1 && playerB.replay[indexB + 1].warp) ||
            (playerB.replay && playerB.replay[indexB].warp)) {
            animationSpeed = defaultPlaybackSpeed / 4;
            if (!tweents.isWarpingPlayerB) {
                tweents.warpOutPlayerB.play();
                tweents.isWarpingPlayerB = true;
            }
        } else if (tweents.isWarpingPlayerB) {
            tweents.warpOutPlayerB.reverse();
            tweents.isWarpingPlayerB = false;
        }

        animationIndex += animationSpeed;
        index = Math.round(animationIndex);
        indexA = index;
        indexB = index;

        if (playerA.replay && index >= playerA.replay.length) {
            indexA = playerA.replay.length - 1;
        }

        if (playerB.replay && index >= playerB.replay.length) {
            indexB = playerB.replay.length - 1;
        }

        if (playerA.replay && playerA.replay[indexA].secondCastle) {
            if (castle == 1) {
                castle = 2;
                showSecondtCastle();
            }
        } else if (playerA.replay && !playerA.replay[indexA].secondCastle) {
            if (castle == 2) {
                castle = 1;
                showFirstCastle();
            }
        } else if (playerB.replay && playerB.replay[indexB].secondCastle) {
            if (castle == 1) {
                castle = 2;
                showSecondtCastle();
            }
        } else if (playerB.replay && !playerB.replay[indexB].secondCastle) {
            if (castle == 2) {
                castle = 1;
                showFirstCastle();
            }
        }

        if (playerA.replay) {
            approach(playerA.indicator, playerA.replay[indexA]);
        }

        if (playerB.replay) {
            approach(playerB.indicator, playerB.replay[indexB]);
            if (index > oldIndex) {
                playerB.trail.data(playerB.replaySvgData[indexB - 1]);
            }
        }

        if (index > oldIndex) {
            playerA.trail.data(playerA.replaySvgData[indexA - 1]);
            oldIndex = index;
            if (playerB.replay && playerA.replay && playerB.replay.length > playerA.replay.length) {
                progressBar.val(Math.round((indexB / playerB.replay.length) * 1000));
            } else if (playerA.replay) {
                progressBar.val(Math.round((indexA / playerA.replay.length) * 1000));
            } else {
                progressBar.val(Math.round((indexB / playerB.replay.length) * 1000));
            }
            if (playerA.replay) {
                setRelics(indexA, playerA.replay);
            } else {
                setRelics(indexB, playerB.replay);
            }
            displayRelics();
        }

        if ((playerB.replay && playerA.replay && playerB.replay.length > playerA.replay.length && index == playerB.replay.length - 1) ||
            (playerB.replay && playerA.replay && playerA.replay.length > playerB.replay.length && index == playerA.replay.length - 1) ||
            (!playerB.replay && (index == playerA.replay.length - 1)) || (!playerA.replay && (index == playerB.replay.length - 1))) {
            animationEnded = true;
            animation.stop();
            playButton.removeClass('pause-icon');
            playButton.addClass('play-icon');
        }
    }, foreground);

    animation.start();
}

function approach(object, point) {
    let currentXpos = object.x();
    let currentYpos = object.y();

    if (currentXpos < point.x) {
        object.x(currentXpos + ((0.3 * playbackSpeed) + ((0.04 * playbackSpeed) * (point.x - currentXpos))));
    } else if (currentXpos > point.x) {
        object.x(currentXpos - ((0.3 * playbackSpeed) + ((0.04 * playbackSpeed) * (currentXpos - point.x))));
    }

    if (currentYpos < point.y) {
        object.y(currentYpos + ((0.3 * playbackSpeed) + ((0.04 * playbackSpeed) * (point.y - currentYpos))));
    } else if (currentYpos > point.y) {
        object.y(currentYpos - ((0.3 * playbackSpeed) + ((0.04 * playbackSpeed) * (currentYpos - point.y))));
    }
}

function setRelics(index, source) {
    let relicKeys = Object.getOwnPropertyNames(relics);
    for (let i = 0; i < relicKeys.length; i++) {
        relics[relicKeys[i]] = source[index].relics[relicKeys[i]] > 0;
    }
}

function displayRelics() {
    let relicKeys = Object.getOwnPropertyNames(relics);
    for (let i = 0; i < relicKeys.length; i++) {
        let currentRelic = $('#' + relicKeys[i]);
        if (relics[relicKeys[i]] && currentRelic.hasClass('uncollected')) {
            currentRelic.removeClass('uncollected');
        } else if (!relics[relicKeys[i]] && !currentRelic.hasClass('uncollected')) {
            currentRelic.addClass('uncollected');
        }
    }
}

function pause() {
    if (animation && animation.isRunning()) {
        animation.stop();
        playButton.removeClass('pause-icon');
        playButton.addClass('play-icon');
    }
}

function play() {
    if (animation) {
        if (animation.isRunning()) {
            pause();
        } else {
            if (animationEnded) {
                animationEnded = false;
                rewind();
            }
            animation.start();
            playButton.removeClass('play-icon');
            playButton.addClass('pause-icon');
        }
    } else {
        startPlayback();
        playButton.removeClass('play-icon');
        playButton.addClass('pause-icon');
    }
}

function repositionStage() {
    var dx = scrollContainer.scrollLeft;
    var dy = scrollContainer.scrollTop;
    stage.container().style.transform =
        'translate(' + dx + 'px, ' + dy + 'px)';
    stage.x(-dx);
    stage.y(-dy);
    stage.batchDraw();
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

replayFileA.change(function() {
    let loadedReplay = this.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let replayRows = event.target.result.split("\r\n");
        playerA.replay = null;
        playerA.replay = getReplayData(replayRows);
        playerA.replaySvgData = [];
        generateSvgPathData(playerA.replay, playerA.replaySvgData, { x: 0, y: -2 });
        rewind();
    });
    reader.readAsText(loadedReplay);
});

replayFileB.change(function() {
    let loadedReplay = this.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let replayRows = event.target.result.split("\r\n");
        playerB.replay = null;
        playerB.replay = getReplayData(replayRows);
        playerB.replaySvgData = [];
        generateSvgPathData(playerB.replay, playerB.replaySvgData, { x: 3, y: 1 });
        rewind();
    });
    reader.readAsText(loadedReplay);
});

playButton.click(() => {
    if (playerA.replay || playerB.replay) {
        play();
    }
});

rewindButton.click(() => {
    rewind();
});

progressBar.click(() => {
    pause();
});

progressBar.change(() => {
    pause();
    seek();
});

speedButton.click(() => {
    if (speedsPanelShown == false) {
        speedsPanelShown = true;
        speedSelectPanel.removeClass('hidden');
    } else {
        speedsPanelShown = false;
        speedSelectPanel.addClass('hidden');
    }
});

speedSelectHalf.click(() => {
    playbackSpeed = 0.5;
    speedButtonText.text("0.5x");
});

speedSelectNormal.click(() => {
    playbackSpeed = 1;
    speedButtonText.text("1x");
});

speedSelectDouble.click(() => {
    playbackSpeed = 2;
    speedButtonText.text("2x");
});

speedSelectTripple.click(() => {
    playbackSpeed = 3;
    speedButtonText.text("3x");
});

scrollContainer.scroll(() => {
    repositionStage();
});

repositionStage();
showFirstCastle();