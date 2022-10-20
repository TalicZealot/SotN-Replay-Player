import PropTypes from 'prop-types';

function Tracker({ relics, seed, username, playerIndex }) {
    return (
        <div className="relic-tracker">
            <div>
            <span className={"player-indicator player-" + (playerIndex + 1) + "-indicator"}></span><span>{username}</span>
            </div>
            <div>
                <span>{seed}</span>
            </div>
            <div>
                <img className={"relic " + (relics[0] ? "" : "uncollected")} src="../images/SoulOfBat.png" alt="SoulOfBat" id="SoulOfBat" />
                <img className={"relic " + (relics[1] ? "" : "uncollected")} src="../images/FireOfBat.png" alt="FireOfBat" id="FireOfBat" />
                <img className={"relic " + (relics[2] ? "" : "uncollected")} src="../images/EchoOfBat.png" alt="EchoOfBat" id="EchoOfBat" />
                <img className={"relic " + (relics[3] ? "" : "uncollected")} src="../images/ForceOfEcho.png" alt="ForceOfEcho" id="ForceOfEcho" />
                <img className={"relic " + (relics[4] ? "" : "uncollected")} src="../images/SoulOfWolf.png" alt="SoulOfWolf" id="SoulOfWolf" />
                <img className={"relic " + (relics[5] ? "" : "uncollected")} src="../images/PowerOfWolf.png" alt="PowerOfWolf" id="PowerOfWolf" />
            </div>
            <div>
                <img className={"relic " + (relics[6] ? "" : "uncollected")} src="../images/SkillOfWolf.png" alt="SkillOfWolf" id="SkillOfWolf" />
                <img className={"relic " + (relics[7] ? "" : "uncollected")} src="../images/FormOfMist.png" alt="FormOfMist" id="FormOfMist" />
                <img className={"relic " + (relics[8] ? "" : "uncollected")} src="../images/PowerOfMist.png" alt="PowerOfMist" id="PowerOfMist" />
                <img className={"relic " + (relics[9] ? "" : "uncollected")} src="../images/GasCloud.png" alt="GasCloud" id="GasCloud" />
                <img className={"relic " + (relics[10] ? "" : "uncollected")} src="../images/CubeOfZoe.png" alt="CubeOfZoe" id="CubeOfZoe" />
                <img className={"relic " + (relics[11] ? "" : "uncollected")} src="../images/SpiritOrb.png" alt="SpiritOrb" id="SpiritOrb" />
            </div>
            <div>
                <img className={"relic " + (relics[12] ? "" : "uncollected")} src="../images/GravityBoots.png" alt="GravityBoots" id="GravityBoots" />
                <img className={"relic " + (relics[13] ? "" : "uncollected")} src="../images/LeapStone.png" alt="LeapStone" id="LeapStone" />
                <img className={"relic " + (relics[14] ? "" : "uncollected")} src="../images/HolySymbol.png" alt="HolySymbol" id="HolySymbol" />
                <img className={"relic " + (relics[15] ? "" : "uncollected")} src="../images/FaerieScroll.png" alt="FaerieScroll" id="FaerieScroll" />
                <img className={"relic " + (relics[16] ? "" : "uncollected")} src="../images/JewelOfOpen.png" alt="JewelOfOpen" id="JewelOfOpen" />
                <img className={"relic " + (relics[17] ? "" : "uncollected")} src="../images/MermanStatue.png" alt="MermanStatue" id="MermanStatue" />
            </div>
            <div>
                <img className={"relic " + (relics[18] ? "" : "uncollected")} src="../images/BatCard.png" alt="BatCard" id="BatCard" />
                <img className={"relic " + (relics[19] ? "" : "uncollected")} src="../images/GhostCard.png" alt="GhostCard" id="GhostCard" />
                <img className={"relic " + (relics[20] ? "" : "uncollected")} src="../images/FaerieCard.png" alt="FaerieCard" id="FaerieCard" />
                <img className={"relic " + (relics[21] ? "" : "uncollected")} src="../images/DemonCard.png" alt="DemonCard" id="DemonCard" />
                <img className={"relic " + (relics[22] ? "" : "uncollected")} src="../images/SwordCard.png" alt="SwordCard" id="SwordCard" />
                <img className={"relic " + (relics[23] ? "" : "uncollected")} src="../images/SpriteCard.png" alt="SpriteCard" id="SpriteCard" />
            </div>
            <div>
                <img className={"relic " + (relics[24] ? "" : "uncollected")} src="../images/NoseDevilCard.png" alt="NoseDevilCard" id="NoseDevilCard" />
                <img className={"relic " + (relics[25] ? "" : "uncollected")} src="../images/Claymore.png" alt="ThrustSword" id="ThrustSword" />
            </div>
            <div>
                <img className={"relic " + (relics[26] ? "" : "uncollected")} src="../images/HeartOfVlad.png" alt="HeartOfVlad" id="HeartOfVlad" />
                <img className={"relic " + (relics[27] ? "" : "uncollected")} src="../images/ToothOfVlad.png" alt="ToothOfVlad" id="ToothOfVlad" />
                <img className={"relic " + (relics[28] ? "" : "uncollected")} src="../images/RibOfVlad.png" alt="RibOfVlad" id="RibOfVlad" />
                <img className={"relic " + (relics[29] ? "" : "uncollected")} src="../images/RingOfVlad.png" alt="RingOfVlad" id="RingOfVlad" />
                <img className={"relic " + (relics[30] ? "" : "uncollected")} src="../images/EyeOfVlad.png" alt="EyeOfVlad" id="EyeOfVlad" />
            </div>
            <div>
                <img className={"relic " + (relics[31] ? "" : "uncollected")} src="../images/GoldRing.png" alt="GoldRing" id="GoldRing" />
                <img className={"relic " + (relics[32] ? "" : "uncollected")} src="../images/SilverRing.png" alt="SilverRing" id="SilverRing" />
                <img className={"relic " + (relics[33] ? "" : "uncollected")} src="../images/SpikeBreaker.png" alt="SpikeBreaker" id="SpikeBreaker" />
                <img className={"relic " + (relics[34] ? "" : "uncollected")} src="../images/HolyGlasses.png" alt="HolyGlasses" id="HolyGlasses" />
            </div>
        </div>
    )
}

Tracker.propTypes = {
    seed: PropTypes.string,
    username: PropTypes.string,
    playerIndex: PropTypes.number,
    relics: PropTypes.arrayOf(PropTypes.bool)
}

export default Tracker;