const width = 904;
const height = 1414;
const defaultPlaybackSpeed = 0.04;

var scrollContainer = document.getElementById('scroll-container');
var replayFile = $('#replay-file');

var playButton = $('#play-button');
var rewindButton = $("#rewind-button");
var progressBar = $('#progress-bar');
var speedButton = $('#speed-button');
var speedButtonText = $('#speed-button-text');
var speedSelectPanel = $('#speed-select-panel');
var speedSelectHalf = $('#speed-select-half');
var speedSelectNormal = $('#speed-select-normal');
var speedSelectDouble = $('#speed-select-double');
var speedSelectTripple = $('#speed-select-tripple');

var playText = '▶';
var pauseText = '⏸';

var stage = new Konva.Stage({
    container: 'main-map',
    width: width,
    height: height
});

var alucard = new Konva.Circle({
    x: 8,
    y: 1240,
    radius: 5,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 2
});

var trail = new Konva.Path({
    x: 0,
    y: 0,
    stroke: '#2d14ae',
    strokeWidth: 4,
    opacity: 0.5
});

var mapObject = new Image();
mapObject.src = './images/map.png';

var background = new Konva.Layer();
var foreground = new Konva.Layer();
foreground.add(trail);
foreground.add(alucard);

var path;
var speedsPanelShown = false;
var svgData = [];
var pathLenght;
var distance;
var replay;
var animation;
var playbackSpeed = 1;
var animationIndex = 0;
var progress = 0;
var oldIndex = 0;
var castle = 1;

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
    //ThrustSword: false,
    HeartOfVlad: false,
    ToothOfVlad: false,
    RibOfVlad: false,
    RingOfVlad: false,
    EyeOfVlad: false,
    GoldRing: false,
    SilverRing: false,
    SpikeBreaker: false,
    HolyGlasses: false
};

function getManhattanDistance(pointA, pointB) {
    let xdifference = Math.abs(pointA.x - pointB.x);
    let ydifference = Math.abs(pointA.y - pointB.y);
    return (xdifference + ydifference);
}

function rewind() {
    pause();
    animationIndex = 0;
    oldIndex = 0;
    castle = 1;
    trail.data(svgData[0]);
    animation = null;
    alucard.x(replay[0].x);
    alucard.y(replay[0].y);
    foreground.batchDraw();
}

function seek() {
    if (!replay) {
        return;
    }
    let progress = progressBar.val();

    let index = Math.round(replay.length * (progress / 100));

    animationIndex = index;
    oldIndex = index;

    alucard.x(replay[index].x);
    alucard.y(replay[index].y);

    trail.data(svgData[index]);

    foreground.batchDraw();
}

function getReplayData(replayRows) {
    var pathCoords = [];
    replayRows.forEach(step => {
        let values = step.split(":");

        if (!values[0] || values[0] > 100 || !values[1] || values[1] > 100) {
            return;
        }

        let secondCastle = values[2] > 0;
        let x = (((values[0] - 1) * 15) - 7);
        let y;
        if (secondCastle) {
            y = ((values[1] * 15) - 170);
        } else {
            y = (640 + (values[1] * 15));
        }

        pathCoords.push({
            x: x,
            y: y,
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
                HolyGlasses: values[36]
                    //ThrustSword: values[37],
            }
        });
    });
    return pathCoords;
}

function getSvgData(replayData) {
    let startNode = 'M' + replayData[0].x + ',' + replayData[0].y + ' ';
    svgData.push(startNode);
    for (let i = 1; i < replayData.length; i++) {
        let node = '';
        if (i < replayData.length - 1) {
            node += 'L';
        }
        node += svgData[i - 1] + replayData[i].x + ',' + replayData[i].y + ' ';
        svgData.push(node);
    }
    return svgData;
}

function startPlayback() {
    trail.data(svgData[0]);

    alucard.x(replay[0].x);
    alucard.y(replay[0].y);

    animation = new Konva.Animation(function(frame) {
        animationIndex += playbackSpeed * defaultPlaybackSpeed;
        let index = Math.round(animationIndex);
        if (index >= replay.length) {
            index = replay.length - 1;
        }

        if (replay[index].secondCastle) {
            if (castle == 1) {
                castle = 2;
                showSecondtCastle();
            }
        } else {
            if (castle == 2) {
                castle = 1;
                showFirstCastle();
            }
        }

        approach(alucard, replay[index]);

        if (index > oldIndex) {
            trail.data(svgData[index]);
            oldIndex = index;
            progressBar.val(Math.round((index / replay.length) * 100));
        }

        setRelics(index);
        displayRelics();

        if (index == replay.length - 1) {
            animation.stop();
            playButton.text(playText);
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

function setRelics(index) {
    let relicKeys = Object.getOwnPropertyNames(relics);
    for (let i = 0; i < relicKeys.length; i++) {
        relics[relicKeys[i]] = replay[index].relics[relicKeys[i]] > 0;
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
    if (animation.isRunning()) {
        animation.stop();
        playButton.text(playText);
    }
}

function play() {
    if (animation) {
        if (animation.isRunning()) {
            pause();
        } else {
            animation.start();
            playButton.text(pauseText);
        }
    } else {
        startPlayback();
        playButton.text(pauseText);
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

mapObject.onload = function() {
    var mapImage = new Konva.Image({
        x: 0,
        y: 0,
        image: mapObject,
        width: 904,
        height: 1414
    });

    background.add(mapImage);
    background.batchDraw();
};

replayFile.change(function() {
    let loadedReplay = this.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let replayRows = event.target.result.split("\r\n");
        replay = getReplayData(replayRows);
        svgData = getSvgData(replay);
    });
    reader.readAsText(loadedReplay);
});

playButton.click(() => {
    if (svgData) {
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

stage.add(background);
stage.add(foreground);

scrollContainer.addEventListener('scroll', repositionStage);
repositionStage();
showFirstCastle();