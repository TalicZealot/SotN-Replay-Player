import { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Circle, Path } from 'react-konva';
import DynamicImage from './DynamicImage';
import PropTypes from 'prop-types';
import Tracker from "./Tracker";
import './player.css';

const startingX = 68;
const startingY = 1180;

let relicImages = [
    '../images/SoulOfBat.png',
    '../images/FireOfBat.png',
    '../images/EchoOfBat.png',
    '../images/ForceOfEcho.png',
    '../images/SoulOfWolf.png',
    '../images/PowerOfWolf.png',
    '../images/SkillOfWolf.png',
    '../images/FormOfMist.png',
    '../images/PowerOfMist.png',
    '../images/GasCloud.png',
    '../images/CubeOfZoe.png',
    '../images/SpiritOrb.png',
    '../images/GravityBoots.png',
    '../images/LeapStone.png',
    '../images/HolySymbol.png',
    '../images/FaerieScroll.png',
    '../images/JewelOfOpen.png',
    '../images/MermanStatue.png',
    '../images/BatCard.png',
    '../images/GhostCard.png',
    '../images/FaerieCard.png',
    '../images/DemonCard.png',
    '../images/SwordCard.png',
    '../images/SpriteCard.png',
    '../images/NoseDevilCard.png',
    '../images/HeartOfVlad.png',
    '../images/ToothOfVlad.png',
    '../images/RibOfVlad.png',
    '../images/RingOfVlad.png',
    '../images/EyeOfVlad.png',
    '../images/GoldRing.png',
    '../images/SilverRing.png',
    '../images/SpikeBreaker.png',
    '../images/HolyGlasses.png',
    '../images/Claymore.png'
];

function approach(object, point, playbackSpeed) {
    const MinimumDifference = 0.6;
    const DifferenceSpeedMultiplier = 0.15;
    const SpeedMultiplier = 0.4;

    let currentXpos = object.x;
    let currentYpos = object.y;

    if (point.x < 1 || point.y < 1) {
        return;
    }

    if (Math.abs(currentXpos - point.x) < MinimumDifference) {
        object.x = point.x;
    } else if (currentXpos < point.x) {
        object.x = (currentXpos + ((SpeedMultiplier * playbackSpeed) + ((DifferenceSpeedMultiplier * playbackSpeed) * (point.x - currentXpos))));
    } else if (currentXpos > point.x) {
        object.x = (currentXpos - ((SpeedMultiplier * playbackSpeed) + ((DifferenceSpeedMultiplier * playbackSpeed) * (currentXpos - point.x))));
    }

    if (Math.abs(currentYpos - point.y) < MinimumDifference) {
        object.y = point.y;
    } else if (currentYpos < point.y) {
        object.y = (currentYpos + ((SpeedMultiplier * playbackSpeed) + ((DifferenceSpeedMultiplier * playbackSpeed) * (point.y - currentYpos))));
    } else if (currentYpos > point.y) {
        object.y = (currentYpos - ((SpeedMultiplier * playbackSpeed) + ((DifferenceSpeedMultiplier * playbackSpeed) * (currentYpos - point.y))));
    }
}

function initializePlayers(replays) {
    let colorSets = [
        { fill: '#FCFC38', stroke: '#b0b027', colorName: "Yellow" },
        { fill: '#CCE0D0', stroke: '#879489', colorName: "White" },
        { fill: '#703014', stroke: '#240f06', colorName: "Brown" },
        { fill: '#88409C', stroke: '#45204f', colorName: "Purple" },
        { fill: '#F88C14', stroke: '#ab610e', colorName: "Orange" },
        { fill: '#2CB494', stroke: '#196956', colorName: "Teal" },
        { fill: '#0C48CC', stroke: '#082e80', colorName: "Blue" },
        { fill: '#F40404', stroke: '#a80303', colorName: "Red" },
    ];
    let players = [];
    replays.forEach(replay => {
        let combinedSet = replay.relics;
        combinedSet = combinedSet.concat(replay.items);
        let player = {
            username: replay.username,
            seed: replay.seed,
            colors: colorSets.pop(),
            indicator: {
                x: startingX,
                y: startingY,
                opacity: 1
            },
            trailIndex: 0,
            replay: replay.frames,
            replaySvgData: replay.svgPathData,
            relics: Array(35).fill(false),
            relicTimes: combinedSet
        };
        if (player.username === "") {
            player.username = player.colors.colorName;
        }
        players.push(player);
    });
    return players;
}

function getLongest(replays) {
    const lengths = replays.map(a => a.frames.length);
    let longestReplayIndex = lengths.indexOf(Math.max(...lengths));
    return lengths[longestReplayIndex];
}

function getTimeString(totalSeconds) {
    let hours = Math.floor((totalSeconds / 3600)).toString().padStart(2, "0");
    let minutes = Math.floor(((totalSeconds - (hours * 3600)) / 60)).toString().padStart(2, "0");
    let seconds = Math.floor((totalSeconds - (hours * 3600) - (minutes * 60))).toString().padStart(2, "0");

    return hours + ":" + minutes + ":" + seconds;
}

function getMaxTime(replays) {
    const lengths = replays.map(a => a.frames.length);
    let longestReplayIndex = lengths.indexOf(Math.max(...lengths));
    let totalSeconds = replays[longestReplayIndex].totalSeconds;
    return totalSeconds;
}

function getRelicCoordinates(replays) {
    let combinedSet = replays[0].relics;
    combinedSet = combinedSet.concat(replays[0].items);

    for (let i = 1; i < replays.length; i++) {
        let nextSet = replays[i].relics;
        nextSet = nextSet.concat(replays[i].items);

        for (let j = 0; j < combinedSet.length; j++) {
            if (combinedSet[j].x == 0) {
                combinedSet[j] = nextSet[j];
            }
        }
    }

    return combinedSet;
}

function Player({ replays }) {
    const [frame, setFrame] = useState(0);
    const [speedPanel, setSpeedPanel] = useState(false);
    const scrollContainer = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [rewindQueued, setRewindQueued] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [progress, setProgress] = useState(1);
    const [animationIndex, setAnimationIndex] = useState(0);
    const [oldIndex, setOldIndex] = useState(0);
    const [castle, setCastle] = useState(1);
    const [longestReplay, setLongestReplay] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [players, setPlayers] = useState([]);
    const [seekActive, setSeekActive] = useState(false);
    const [focusPlayerIndex, setFocusPlayerIndex] = useState(0);
    const [secondaryPlayerIndex, setSecondaryPlayerIndex] = useState(1);
    const [relicCoordinates, setRelicCoordinates] = useState(Array(35).fill({ x: -20, y: -20 }));

    const width = 904;
    const height = 1414;
    const defaultPlaybackSpeed = 0.15;
    const indicatorRadius = 5;
    const indicatorStrokeWidth = 2;
    const trailStrokeWidth = 4;
    const trailOpacity = 1;
    const debug = false;

    const animation = () => {

        if (rewindQueued) {
            rewind();
            return;
        } else if (seekActive) {
            seek();
            return;
        }

        let framePlayers = players;
        let index = Math.round(animationIndex);
        let focusPlayer = players[focusPlayerIndex];

        let animationSpeed = playbackSpeed * defaultPlaybackSpeed;

        framePlayers.forEach(player => {
            if ((player.replay.length > (index + 1) && player.replay[index + 1].warp) || (player.replay.length > index && player.replay[index].warp)) {
                animationSpeed = defaultPlaybackSpeed / 2;
                if (!player.isWarping) {
                    let dim = player.indicator.opacity - 0.3;
                    player.indicator.opacity = dim < 0 ? 0 : dim;
                    player.isWarping = true;
                }

            } else if (player.isWarping) {
                player.indicator.opacity = 1;
                player.isWarping = false;
            }
        });

        setAnimationIndex(animationIndex + animationSpeed);
        index = Math.round(animationIndex);

        if (focusPlayer.replay.length > index && focusPlayer.replay[index].secondCastle) {
            if (castle === 1) {
                setCastle(2);
                showSecondtCastle();
            }
        } else {
            if (castle === 2) {
                setCastle(1);
                showFirstCastle();
            }
        }

        framePlayers.forEach(player => {
            if (player.replay.length > index) {
                approach(player.indicator, player.replay[index], playbackSpeed);
            }
            for (let i = 0; i < player.relics.length; i++) {
                if (!player.relics[i] && player.relicTimes[i].index > 0 && index >= player.relicTimes[i].index) {
                    player.relics[i] = true;
                }
            }
        });

        if (index > oldIndex) {
            framePlayers.forEach(player => {
                if (player.replaySvgData.length > index) {
                    player.trailIndex = index - 1;
                }
            });
            setOldIndex(index);

            let newProgress = Math.round((index / longestReplay) * 1000);
            setProgress(newProgress);
            if (totalTime > 0) {
                let newTime = Math.floor((index / longestReplay) * totalTime);
                setCurrentTime(newTime);
            }
        }

        if (index === longestReplay) {
            setPlaying(false);
        }

        setPlayers(framePlayers);
    };

    const showFirstCastle = () => {
        scrollContainer.current.scrollBy({
            top: 707,
            behavior: 'auto'
        });
    };

    const showSecondtCastle = () => {
        scrollContainer.current.scrollBy({
            top: -707,
            behavior: 'auto'
        });
    };

    const rewind = () => {
        let tempPlayers = players;
        tempPlayers.forEach(player => {
            player.trailIndex = 0;
            player.indicator.x = startingX;
            player.indicator.y = startingY;
            player.relics = Array(35).fill(false);
        });
        setPlayers(tempPlayers);
        setPlaying(false);
        setAnimationIndex(0);
        setOldIndex(0);
        setCastle(1);
        showFirstCastle();
        setRewindQueued(false);
    };

    const seek = () => {
        let newIndex = Math.round((longestReplay - 1) * (progress / 1000));
        let tempPlayers = players;
        tempPlayers.forEach(player => {
            player.trailIndex = newIndex;
            player.relics = Array(35).fill(false);
        });
        setOldIndex(newIndex - 1);
        setPlayers(tempPlayers);
        setAnimationIndex(newIndex);
        setSeekActive(false);
    };

    const showDebugData = () => {
        console.log("animationIndex: " + animationIndex);
        console.log(replays);
    }

    const selectPlayer = (index) => {
        if (index === secondaryPlayerIndex) {
            setFocusPlayerIndex(secondaryPlayerIndex);
            setSecondaryPlayerIndex(focusPlayerIndex);
        } else if (index !== focusPlayerIndex) {
            setSecondaryPlayerIndex(index);
        }
    }

    const handleProgressChange = (e) => {
        setProgress(e.target.value);
        setSeekActive(true);
    }

    useEffect(() => {
        setTimeout(() => {
            if (players.length < 1) {
                setPlayers(initializePlayers(replays));
                setLongestReplay(getLongest(replays));
                setTotalTime(getMaxTime(replays));
                setRelicCoordinates(getRelicCoordinates(replays));
                showFirstCastle();
            } else if (playing) {
                animation();
            }
            setFrame(frame + 1);
        }, 16);
    }, [frame]);

    return (
        <div className="player-container">
            <div className="main-player">
                <div className="scroll-container" ref={scrollContainer}>
                    <div className="large-container">
                        <Stage width={width} height={height}>
                            <Layer>
                                {players.length > 1 ?
                                    <Path
                                        key={"secondaryPath"}
                                        data={players[secondaryPlayerIndex].replaySvgData[players[secondaryPlayerIndex].trailIndex]}
                                        x={0} y={0}
                                        offsetX={2} offsetY={2}
                                        stroke={players[secondaryPlayerIndex].colors.stroke}
                                        strokeWidth={trailStrokeWidth}
                                        opacity={trailOpacity}
                                        shadowColor="black"
                                        shadowBlur={0}
                                        shadowOffsetX={-1}
                                        shadowOffsetY={-1}
                                        shadowOpacity={trailOpacity}
                                    />
                                    :
                                    null
                                }
                                {players.length > 0 ?
                                    <Path
                                        key={"focusPath"}
                                        data={players[focusPlayerIndex].replaySvgData[players[focusPlayerIndex].trailIndex]}
                                        x={0} y={0}
                                        offsetX={-2} offsetY={-2}
                                        stroke={players[focusPlayerIndex].colors.stroke}
                                        strokeWidth={trailStrokeWidth}
                                        opacity={trailOpacity}
                                        shadowColor="black"
                                        shadowBlur={0}
                                        shadowOffsetX={1}
                                        shadowOffsetY={1}
                                        shadowOpacity={trailOpacity}
                                    />
                                    :
                                    null
                                }
                            </Layer>
                            <Layer>
                                {relicImages.map((relicImage, index) => (
                                    <DynamicImage key={relicImage} src={relicImage} x={relicCoordinates[index].x > 0 ? relicCoordinates[index].x - 7 : -20} y={relicCoordinates[index].y > 0 ? relicCoordinates[index].y - 7 : -20} />
                                ))}
                            </Layer>
                            <Layer>
                                {players.map((player, index) => (
                                    <Circle key={index.toString() + "indic"} x={player.indicator.x} y={player.indicator.y} opacity={player.indicator.opacity} radius={indicatorRadius} fill={player.colors.fill} stroke="white" strokeWidth={indicatorStrokeWidth} />
                                ))}
                            </Layer>
                        </Stage>
                    </div>
                </div>
                <div className="progress-bar-container">
                    <input className="progress-bar" type="range" min="1" max="1000" value={progress} onChange={handleProgressChange} />
                </div>
                <div className="replay-controls">
                    {playing ?
                        <div className="player-button pause-icon" onClick={() => { setPlaying(false) }}></div>
                        :
                        <div className="player-button play-icon" onClick={() => { setPlaying(true) }}></div>
                    }
                    <div className="player-button rewind-icon" onClick={() => { setRewindQueued(true) }}></div>
                    <div className="player-button speed-button" onClick={() => { setSpeedPanel(!speedPanel) }}>
                        <span>{playbackSpeed}x</span>
                        {speedPanel ?
                            <div className="speed-select-panel">
                                <div className="speed-select-button" onClick={() => { setPlaybackSpeed(3); setSpeedPanel(false); }}>3x</div>
                                <div className="speed-select-button" onClick={() => { setPlaybackSpeed(2); setSpeedPanel(false); }}>2x</div>
                                <div className="speed-select-button" onClick={() => { setPlaybackSpeed(1); setSpeedPanel(false); }}>1x</div>
                                <div className="speed-select-button" onClick={() => { setPlaybackSpeed(0.5); setSpeedPanel(false); }}>0.5x</div>
                            </div>
                            :
                            null
                        }
                    </div>
                    {debug ?
                    <div className="player-button" onClick={showDebugData}>DBG</div>
                    :
                    null
                    }
                    <div className="replay-time">{getTimeString(currentTime) + " / " + getTimeString(totalTime)}</div>
                </div>
            </div>
            <div className="players-panel">
                <div className="player-selector-panel">
                    {players.map((player, index) => (
                        <div key={"player-selector" + index} className={"player-selector"} onClick={() => { selectPlayer(index) }}>
                            <span className={"player-indicator player-" + (index + 1) + "-indicator" + (index === focusPlayerIndex ? " selected-focus" : "") + (index === secondaryPlayerIndex ? " selected-secondary" : "")}></span>
                            <span className="unselectable">{player.username}</span>
                        </div>
                    ))}
                </div>
                <Tracker
                    relics={players[focusPlayerIndex] ? players[focusPlayerIndex].relics : Array(35).fill(false)}
                    seed={players[focusPlayerIndex] ? players[focusPlayerIndex].seed : "seed(preset)"}
                    username={players[focusPlayerIndex] ? players[focusPlayerIndex].username : "Player"}
                    playerIndex={focusPlayerIndex}
                />
            </div>
        </div>
    )
}

Player.propTypes = {
    replays: PropTypes.arrayOf(PropTypes.object)
}

export default Player;