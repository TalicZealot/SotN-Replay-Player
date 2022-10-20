import JSZip from 'jszip';

const relicBytes = 30 * 4;
const itemBytes = 5 * 4;

function bitesToUint16(byte1, byte2) {
    return ((byte2 * 256) + byte1);
}

function getManhattanDistance(pointA, pointB) {
    let xdifference = Math.abs(pointA.x - pointB.x);
    let ydifference = Math.abs(pointA.y - pointB.y);
    return (xdifference + ydifference);
}

function getXpos(val) {
    if (val == 0) {
        return 0;
    }
    let adjusted = val > 100 ? val - 100 : val;
    return (((adjusted - 1) * 15) - 7);
}

function getYpos(secondCastle, val) {
    if (val == 0) {
        return 0;
    }

    if (secondCastle) {
        return ((val * 15) - 170);
    } else {
        return (640 + (val * 15));
    }
}

function getReplayData(dataArrays, fileNames) {
    let replays = [];

    for (let i = 0; i < dataArrays.length; i++) {
        replays.push(getReplay(dataArrays[i], fileNames[i]));
    }

    return replays;
}

function getReplay(data, name) {
    let frames = [];
    let relics = [];
    let items = [];
    let username = '';
    let seed = '';
    let svgPathData = [];
    let currentIndex = 0;
    let targetIndex = 0;
    let match = name.match(/([a-zA-Z0-9(]{5,50})([-]){1}([a-zA-Z0-9 -]{0,30})(.sotnr)$/i);
    if (match && match.length == 5) {
        username = match[3];
        seed = match[1] + ")";
    }

    let totalSeconds = bitesToUint16(data[0], data[1]);

    currentIndex = 2;
    targetIndex = currentIndex + relicBytes;
    for (let i = currentIndex; i < targetIndex; i += 4) {
        let secondCastle = data[i] > 100;
        let x = getXpos(data[i]);
        let y = getYpos(secondCastle, data[i + 1]);
        let index = bitesToUint16(data[i + 2], data[i + 3]);
        currentIndex += 4;

        relics.push({
            x: x,
            y: y,
            index: index
        });
    }

    targetIndex = currentIndex + itemBytes;
    for (let i = currentIndex; i < targetIndex; i += 4) {
        let secondCastle = data[i] > 100;
        let x = getXpos(data[i]);
        let y = getYpos(secondCastle, data[i + 1]);
        let index = bitesToUint16(data[i + 2], data[i + 3]);
        currentIndex += 4;

        items.push({
            x: x,
            y: y,
            index: index
        });
    }

    let stateIndex = 0;
    for (let i = currentIndex; i < data.length; i += 4) {
        let time = bitesToUint16(data[i + 2], data[i + 3]);
        let warp = false;
        let secondCastle = data[i] > 100;
        let x = getXpos(data[i]);
        let y = getYpos(secondCastle, data[i + 1]);
        currentIndex += 4;
        stateIndex++;

        if (frames.length > 0 && x > 1 && y > 1 && getManhattanDistance({ x: x, y: y }, frames[frames.length - 1]) > 30) {
            warp = true;
        }
        
        relics.forEach(relic => {
            if (relic.index === stateIndex) {
                relic.index = frames.length;
            }
        });

        items.forEach(item => {
            if (item.index === stateIndex) {
                item.index = frames.length;
            }
        });

        let frame = {
            x: x,
            y: y,
            warp: warp,
            secondCastle: secondCastle
        };
        if (time === 0) {
            frames.push(frame);
        }
        for (let i = 0; i < time; i++) {
            frames.push(frame);
        }
    }
    svgPathData = generateSvgPathData(frames);

    let replayData = {
        seed: seed,
        totalSeconds: totalSeconds,
        frames: frames,
        relics: relics,
        items: items,
        username: username,
        svgPathData: svgPathData
    };

    return replayData;
}

function generateSvgPathData(frames) {
    let pathData = [];
    let startNode = 'M' + frames[0].x + ',' + frames[0].y + ' ';
    pathData.push(startNode);
    for (let i = 1; i < frames.length; i++) {
        let node = pathData[i - 1];

        if (i > 0 && frames[i].warp) {
            node += 'M';
        } else {
            node += 'L';
        }

        node += (frames[i].x + 2) + ',' + (frames[i].y) + ' ';
        pathData.push(node);
    }

    return pathData;
}

async function unzipFile(zipFile, fileNames, dataArrays) {
    return new Promise((resolve, reject) => {
        JSZip.loadAsync(zipFile)
        .then(function (zip) {
            zip.forEach(function (relativePath, file) {
                file.async("uint8array")
                .then(function success(content) {
                    fileNames.push(file.name);
                    dataArrays.push(content);
                    if (fileNames.length === Object.keys(zip.files).length) {
                        resolve("Unzipped all");
                    }
                }, function (e) {
                    reject('Error : ' + e.type);
                });
            });
        }, function (e) {
            console.error('Error : ' + e.type);
        });
    });
}

async function parseFiles(files) {
    let dataArrays = [];
    let filePromises = [];
    let fileNames = [];

    if (files[0].type === "application/x-zip-compressed") {
        await unzipFile(files[0], fileNames, dataArrays);
    } else {
        files.forEach(file => {
            let filePromise = new Promise((resolve, reject) => {
                var reader = new FileReader();
                reader.onload = function (e) {
                    let replayArray = new Uint8Array(e.target.result);
                    dataArrays.push(replayArray);
                    resolve();
                };
                reader.onerror = function (e) {
                    reject('Error : ' + e.type);
                };
                reader.readAsArrayBuffer(file);
            });
            filePromises.push(filePromise);
            fileNames.push(file.name);
        });
    }

    await Promise.all(filePromises);
    return getReplayData(dataArrays, fileNames);
}

export { parseFiles };