function initializeMapRelics() {
    var mapSoulOfBat = new Image();
    mapSoulOfBat.src = './images/SoulOfBat.png';
    mapSoulOfBat.onload = function() {
        var mapSoulOfBatImage = new Konva.Image({
            x: mapRelics[0].x,
            y: mapRelics[0].y,
            image: mapSoulOfBat,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapSoulOfBatImage);
    };
    var mapFireOfBat = new Image();
    mapFireOfBat.src = './images/FireOfBat.png';
    mapFireOfBat.onload = function() {
        var mapFireOfBatImage = new Konva.Image({
            x: mapRelics[1].x,
            y: mapRelics[1].y,
            image: mapFireOfBat,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapFireOfBatImage);
    };
    var mapEchoOfBat = new Image();
    mapEchoOfBat.src = './images/EchoOfBat.png';
    mapEchoOfBat.onload = function() {
        var mapEchoOfBatImage = new Konva.Image({
            x: mapRelics[2].x,
            y: mapRelics[2].y,
            image: mapEchoOfBat,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapEchoOfBatImage);
    };
    var mapForceOfEcho = new Image();
    mapForceOfEcho.src = './images/ForceOfEcho.png';
    mapForceOfEcho.onload = function() {
        var mapForceOfEchoImage = new Konva.Image({
            x: mapRelics[3].x,
            y: mapRelics[3].y,
            image: mapForceOfEcho,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapForceOfEchoImage);
    };
    var mapSoulOfWolf = new Image();
    mapSoulOfWolf.src = './images/SoulOfWolf.png';
    mapSoulOfWolf.onload = function() {
        var mapSoulOfWolfImage = new Konva.Image({
            x: mapRelics[4].x,
            y: mapRelics[4].y,
            image: mapSoulOfWolf,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapSoulOfWolfImage);
    };
    var mapPowerOfWolf = new Image();
    mapPowerOfWolf.src = './images/PowerOfWolf.png';
    mapPowerOfWolf.onload = function() {
        var mapPowerOfWolfImage = new Konva.Image({
            x: mapRelics[5].x,
            y: mapRelics[5].y,
            image: mapPowerOfWolf,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapPowerOfWolfImage);
    };
    var mapSkillOfWolf = new Image();
    mapSkillOfWolf.src = './images/SkillOfWolf.png';
    mapSkillOfWolf.onload = function() {
        var mapSkillOfWolfImage = new Konva.Image({
            x: mapRelics[6].x,
            y: mapRelics[6].y,
            image: mapSkillOfWolf,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapSkillOfWolfImage);
    };
    var mapFormOfMist = new Image();
    mapFormOfMist.src = './images/FormOfMist.png';
    mapFormOfMist.onload = function() {
        var mapFormOfMistImage = new Konva.Image({
            x: mapRelics[7].x,
            y: mapRelics[7].y,
            image: mapFormOfMist,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapFormOfMistImage);
    };
    var mapPowerOfMist = new Image();
    mapPowerOfMist.src = './images/PowerOfMist.png';
    mapPowerOfMist.onload = function() {
        var mapPowerOfMistImage = new Konva.Image({
            x: mapRelics[8].x,
            y: mapRelics[8].y,
            image: mapPowerOfMist,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapPowerOfMistImage);
    };
    var mapGasCloud = new Image();
    mapGasCloud.src = './images/GasCloud.png';
    mapGasCloud.onload = function() {
        var mapGasCloudImage = new Konva.Image({
            x: mapRelics[9].x,
            y: mapRelics[9].y,
            image: mapGasCloud,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapGasCloudImage);
    };
    var mapCubeOfZoe = new Image();
    mapCubeOfZoe.src = './images/CubeOfZoe.png';
    mapCubeOfZoe.onload = function() {
        var mapCubeOfZoeImage = new Konva.Image({
            x: mapRelics[10].x,
            y: mapRelics[10].y,
            image: mapCubeOfZoe,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapCubeOfZoeImage);
    };
    var mapSpiritOrb = new Image();
    mapSpiritOrb.src = './images/SpiritOrb.png';
    mapSpiritOrb.onload = function() {
        var mapSpiritOrbImage = new Konva.Image({
            x: mapRelics[11].x,
            y: mapRelics[11].y,
            image: mapSpiritOrb,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapSpiritOrbImage);
    };
    var mapGravityBoots = new Image();
    mapGravityBoots.src = './images/GravityBoots.png';
    mapGravityBoots.onload = function() {
        var mapGravityBootsImage = new Konva.Image({
            x: mapRelics[12].x,
            y: mapRelics[12].y,
            image: mapGravityBoots,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapGravityBootsImage);
    };
    var mapLeapStone = new Image();
    mapLeapStone.src = './images/LeapStone.png';
    mapLeapStone.onload = function() {
        var mapLeapStoneImage = new Konva.Image({
            x: mapRelics[13].x,
            y: mapRelics[13].y,
            image: mapLeapStone,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapLeapStoneImage);
    };
    var mapHolySymbol = new Image();
    mapHolySymbol.src = './images/HolySymbol.png';
    mapHolySymbol.onload = function() {
        var mapHolySymbolImage = new Konva.Image({
            x: mapRelics[14].x,
            y: mapRelics[14].y,
            image: mapHolySymbol,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapHolySymbolImage);
    };
    var mapFaerieScroll = new Image();
    mapFaerieScroll.src = './images/FaerieScroll.png';
    mapFaerieScroll.onload = function() {
        var mapFaerieScrollImage = new Konva.Image({
            x: mapRelics[15].x,
            y: mapRelics[15].y,
            image: mapFaerieScroll,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapFaerieScrollImage);
    };
    var mapJewelOfOpen = new Image();
    mapJewelOfOpen.src = './images/JewelOfOpen.png';
    mapJewelOfOpen.onload = function() {
        var mapJewelOfOpenImage = new Konva.Image({
            x: mapRelics[16].x,
            y: mapRelics[16].y,
            image: mapJewelOfOpen,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapJewelOfOpenImage);
    };
    var mapMermanStatue = new Image();
    mapMermanStatue.src = './images/MermanStatue.png';
    mapMermanStatue.onload = function() {
        var mapMermanStatueImage = new Konva.Image({
            x: mapRelics[17].x,
            y: mapRelics[17].y,
            image: mapMermanStatue,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapMermanStatueImage);
    };
    var mapBatCard = new Image();
    mapBatCard.src = './images/BatCard.png';
    mapBatCard.onload = function() {
        var mapBatCardImage = new Konva.Image({
            x: mapRelics[18].x,
            y: mapRelics[18].y,
            image: mapBatCard,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapBatCardImage);
    };
    var mapGhostCard = new Image();
    mapGhostCard.src = './images/GhostCard.png';
    mapGhostCard.onload = function() {
        var mapGhostCardImage = new Konva.Image({
            x: mapRelics[19].x,
            y: mapRelics[19].y,
            image: mapGhostCard,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapGhostCardImage);
    };
    var mapFaerieCard = new Image();
    mapFaerieCard.src = './images/FaerieCard.png';
    mapFaerieCard.onload = function() {
        var mapFaerieCardImage = new Konva.Image({
            x: mapRelics[20].x,
            y: mapRelics[20].y,
            image: mapFaerieCard,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapFaerieCardImage);
    };
    var mapDemonCard = new Image();
    mapDemonCard.src = './images/DemonCard.png';
    mapDemonCard.onload = function() {
        var mapDemonCardImage = new Konva.Image({
            x: mapRelics[21].x,
            y: mapRelics[21].y,
            image: mapDemonCard,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapDemonCardImage);
    };
    var mapSwordCard = new Image();
    mapSwordCard.src = './images/SwordCard.png';
    mapSwordCard.onload = function() {
        var mapSwordCardImage = new Konva.Image({
            x: mapRelics[22].x,
            y: mapRelics[22].y,
            image: mapSwordCard,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapSwordCardImage);
    };
    var mapSpriteCard = new Image();
    mapSpriteCard.src = './images/SpriteCard.png';
    mapSpriteCard.onload = function() {
        var mapSpriteCardImage = new Konva.Image({
            x: mapRelics[23].x,
            y: mapRelics[23].y,
            image: mapSpriteCard,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapSpriteCardImage);
    };
    var mapNoseDevilCard = new Image();
    mapNoseDevilCard.src = './images/NoseDevilCard.png';
    mapNoseDevilCard.onload = function() {
        var mapDevilCardImage = new Konva.Image({
            x: mapRelics[24].x,
            y: mapRelics[24].y,
            image: mapNoseDevilCard,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapDevilCardImage);
    };
    var mapHeartOfVlad = new Image();
    mapHeartOfVlad.src = './images/HeartOfVlad.png';
    mapHeartOfVlad.onload = function() {
        var mapHeartOfVladImage = new Konva.Image({
            x: mapRelics[25].x,
            y: mapRelics[25].y,
            image: mapHeartOfVlad,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapHeartOfVladImage);
    };
    var mapToothOfVlad = new Image();
    mapToothOfVlad.src = './images/ToothOfVlad.png';
    mapToothOfVlad.onload = function() {
        var mapToothOfVladImage = new Konva.Image({
            x: mapRelics[26].x,
            y: mapRelics[26].y,
            image: mapToothOfVlad,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapToothOfVladImage);
    };
    var mapRibOfVlad = new Image();
    mapRibOfVlad.src = './images/RibOfVlad.png';
    mapRibOfVlad.onload = function() {
        var mapRibOfVladImage = new Konva.Image({
            x: mapRelics[27].x,
            y: mapRelics[27].y,
            image: mapRibOfVlad,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapRibOfVladImage);
    };
    var mapRingOfVlad = new Image();
    mapRingOfVlad.src = './images/RingOfVlad.png';
    mapRingOfVlad.onload = function() {
        var mapRingOfVladImage = new Konva.Image({
            x: mapRelics[28].x,
            y: mapRelics[28].y,
            image: mapRingOfVlad,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapRingOfVladImage);
    };
    var mapEyeOfVlad = new Image();
    mapEyeOfVlad.src = './images/EyeOfVlad.png';
    mapEyeOfVlad.onload = function() {
        var mapEyeOfVladImage = new Konva.Image({
            x: mapRelics[29].x,
            y: mapRelics[29].y,
            image: mapEyeOfVlad,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapEyeOfVladImage);
    };
    var mapGoldRing = new Image();
    mapGoldRing.src = './images/GoldRing.png';
    mapGoldRing.onload = function() {
        var mapGoldRingImage = new Konva.Image({
            x: mapRelics[30].x,
            y: mapRelics[30].y,
            image: mapGoldRing,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapGoldRingImage);
    };
    var mapSilverRing = new Image();
    mapSilverRing.src = './images/SilverRing.png';
    mapSilverRing.onload = function() {
        var mapSilverRingImage = new Konva.Image({
            x: mapRelics[31].x,
            y: mapRelics[31].y,
            image: mapSilverRing,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapSilverRingImage);
    };
    var mapSpikeBreaker = new Image();
    mapSpikeBreaker.src = './images/SpikeBreaker.png';
    mapSpikeBreaker.onload = function() {
        var mapSpikeBreakerImage = new Konva.Image({
            x: mapRelics[32].x,
            y: mapRelics[32].y,
            image: mapSpikeBreaker,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapSpikeBreakerImage);
    };
    var mapHolyGlasses = new Image();
    mapHolyGlasses.src = './images/HolyGlasses.png';
    mapHolyGlasses.onload = function() {
        var mapHolyGlassesImage = new Konva.Image({
            x: mapRelics[33].x,
            y: mapRelics[33].y,
            image: mapHolyGlasses,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapHolyGlassesImage);
    };
    var mapThrustSword = new Image();
    mapThrustSword.src = './images/Claymore.png';
    mapThrustSword.onload = function() {
        var mapThrustSwordImage = new Konva.Image({
            x: mapRelics[34].x,
            y: mapRelics[34].y,
            image: mapThrustSword,
            width: 14,
            height: 14
        });
        relicsLayer.add(mapThrustSwordImage);
        relicsLayer.batchDraw();
    };
}