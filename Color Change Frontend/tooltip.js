// tooltip.js


// بيانات التلميحات لكل زر
const tooltipData = {
    // أزرار الألوان
    'redBtn'                    : { title: 'Red Color' },
    'blueBtn'                   : { title: 'Blue Color' },
    'greenBtn'                  : { title: 'Green Color' },
    'orangeBtn'                 : { title: 'Orange Color' },
    'yellowBtn'                 : { title: 'Yellow Color' },
    'purpleBtn'                 : { title: 'Purple Color' },
    'whiteBtn'                  : { title: 'White Color' },
    'offBtn'                    : { title: 'Turn Off' },
    'off2Btn'                   : { title: 'Turn Off'},
    
    // أزرار الأنيميشن الأساسية

    'lightOneBtn'               : { title: 'Fade Colors' },
    'WaveEffectBtn'             : { title: 'Wave Effect' },
    'RainbowFlowBtn'            : { title: 'Rainbow Flow' },
    'BlinkingPatternBtn'        : { title: 'Blinking Pattern' },
    'RunningLightsBtn'          : { title: 'Running Lights' },
    'BreathingEffectBtn'        : { title: 'Breathing Effect' },
    'MeteorShowerBtn'           : { title: 'Snakes Chasing' },
    'RandomColorsBtn'           : { title: 'Random Colors' },
    'PulseSyncBtn'              : { title: 'Pulse Sync' },
    'FireworksBurstBtn'         : { title: 'Fireworks Burst' },
    'MeteorShowerNewBtn'        : { title: 'Meteor Shower' },
    

    // أزرار الأنيميشن المخصصة  
    'customFadeBtn'             : { title: 'Custom Fade'},
    'customBlinkBtn'            : { title: 'Custom Blink'},
    'customBreathingBtn'        : { title: 'Custom Breathing' },
    'customMeteorShowerBtn'     : { title: 'Custom Meteor Shower' },
    'customPulseSyncBtn'        : { title: 'Custom Pulse Sync' },
    'customGlitchFlashBtn'      : { title: 'Custom Glitch Flash' },
    'customHeartBeatBtn'        : { title: 'Custom Heart Beat' },
    'customTunnelEffectBtn'     : { title: 'Custom Tunnel Effect' },
    'customLaserShotBtn'        : { title: 'Custom Laser Shot' },
    'customSparklingStarsBtn'   : { title: 'Custom Sparkling Stars' },
    'customStrobeFlashBtn'      : { title: 'Custom Strobe Flash' },
    'customKnightRiderBtn'      : { title: 'Custom Knight Rider' },
    'customBounceBackBtn'       : { title: 'Custom Bounce Back' },
    'customRippleTouchBtn'      : { title: 'Custom Ripple Touch' },
    'customFireFlickerBtn'      : { title: 'Custom Fire Flicker' },
    'customColorWipeBtn'        : { title: 'Custom Color Wipe' },
    'customStaticGlowBtn'       : { title: 'Custom Static Glow' },
    'customColorEchoBtn'        : { title: 'Custom Color Echo' },
    'customTimeWarpBtn'         : { title: 'Custom Time Warp' },
    'customQuantumFlickerBtn'   : { title: 'Custom Quantum Flicker' },
    'customRunningLightsBtn'    : { title: 'Custom Running Lights' },
    'customFireworksBurstBtn'   : { title: 'Custom Fireworks Burst' }
};

const fadeDescriptions = [
    'Colors appear, then vanish—tweak the brightness, set your vibe.',
    'Random shades flash in and out, never settling. Adjust the glow to match your mood.',
    'It feels like controlled chaos—one moment the light is here, the next it’s gone, returning differently each time. You can dial the brightness to your liking.',
    'A hypnotic rhythm of colors fading in and out, syncing only with their own unpredictable flow. Control the intensity and let it breathe in your space.',
    'The LEDs move gently, swapping shades, disappearing, then returning like they were never gone. Adjust the brightness—make it subtle or let it shine boldly.',
    'A cycle of presence and absence—colors vanish before you even get used to them, only to reappear in new shades. You control the glow, the mood, the flow.',
    'Think of it as meditative light—colors show up, fade, and renew endlessly. Brightness is yours to command.',
    
];

const waveDescriptions = [
    'Waves of light moving through the strip—control the glow, set your pace.',
    'Colors travel in rhythm, sweeping LED by LED. Adjust brightness to match the flow.',
    'Imagine a pulse of color stretching and shifting forward, one LED at a time. You decide how strong it shines.',
    'CoA continuous wave of motion—colors ripple through the strip, alive and flowing. Dial the brightness to suit your vibe.',
    'It’s more than movement; it’s choreography in light. Each LED joins the wave at the perfect moment. Control the glow to make it yours.',
    'Every shift feels like momentum—a tide of color rolling endlessly. Adjust brightness, let it be subtle or striking.',
    'Think of it as energy made visible—waves of light flowing in sequence. Brightness is in your hands.'
];

const RainbomDescriptions = [
    'A spectrum that never stops—adjust the brightness, set your vibe.',
    'Colors chase each other endlessly. You decide how bright or soft they shine.',
    'Every shade flows into the next, never pausing. Dial the brightness to match your mood.',
    'It’s less about the rainbow, more about the journey—colors fading, blending, shifting endlessly. Control the glow and make it yours.',
    'Not just colors—it’s a cycle that refuses to settle, each shade slipping into the next before you can even name it. You can tweak the brightness to set the room’s energy exactly how you like.',
    'Think of it as a story of motion and color—light traveling, shifting, never repeating itself. Push the brightness up or keep it subtle; it’s your scene to control.',
    'A continuous flow of color, alive and unpredictable. Adjust the glow to make the effect your own.'
]

const BlinkingDescriptions = [
    'Fast flashes, random, gone in an instant.',
    'LEDs blink sharp and sudden, each color a quick spark that disappears before you catch it—brightness stays in your hands.',
    'No rhythm, no pattern—just a restless storm of colors flashing in and out, like the strip is alive with hidden energy. One moment bright, the next completely gone, leaving you waiting for the next unpredictable strike.',
    'Sudden sparks of light—blink and you’ll miss it.',
    'A strobe-like effect, but wilder—random flashes that feel like coded signals only your eyes can decode.',
    'This isn’t gentle or calm—it’s electricity in motion. The LEDs erupt in quick bursts, each blink random and impatient, as if the strip is trying to get your attention with every flash. You decide how blinding or subtle it gets with brightness control.',
    'Flashes of color hit at random, then vanish as quickly as they came, keeping the whole effect tense and alive.'
]

const RunningLightsDescriptions = [
  'Colors racing down the strip—fast, random, alive.',
  'Tiny sparks keep running, one after another, colors changing as they fall—like light chasing itself. Brightness? You’re in charge.',
  'It feels like streaks of energy are being released from hidden points, racing endlessly toward the bottom. Each spark dies only to be reborn in a new shade, creating an endless cycle of movement. With brightness control, you choose if it’s a quiet run or a blinding chase.',
  'Flashes on the run—never stopping, never the same color twice.',
  'Random bursts of light keep dropping in sequence, like rain made of neon sparks, looping forever.',
  'The strip becomes a track for colors—each light sprinting downward, resetting, and starting over. It’s chaotic but rhythmic, infinite but always new. Dial the brightness, and the race feels either calm or explosive.',
  'Running sparks—falling, resetting, glowing again. It never really stops, just keeps moving in its own strange rhythm.'
]

const BreathingEffectDescriptions = [
  'Lights that inhale and exhale—slow, soft, alive.',
  'Colors fade in and fade out at their own pace, like the strip itself is breathing. Adjust the brightness, and you control how gentle or intense each breath feels.',
  'It’s not a blink, not a flash—it’s a rhythm of presence and absence. Each shade appears slowly, settles in the room, then dissolves as if the LEDs are sighing. The cycle never repeats the same way twice, and with brightness in your hands, you decide if it feels like calm meditation or something deeper.',
  'Random tones emerge quietly, glow for a moment, then slip away like they were never there.',
  'Think of it as heartbeat energy—soft pulses of color flowing in and out, too slow to chase, too real to ignore.',
  'The effect feels alive, like the LEDs are syncing with a hidden rhythm you can’t quite catch. Lower the brightness and it whispers; raise it, and it feels like the room itself is breathing fire.',
  'Colors dissolve into nothing, only to return smoother and slower, like a light practicing patience.'
]

const SnakesChasingDescriptions = [
  'Snakes of light racing after each other, never stopping.',
  'Each LED forms a serpent—random colors sliding forward, one chasing the next. Adjust the brightness to decide if they slither smooth or strike sharp.',
  'It’s a hunt made of color—multiple snakes twisting through the strip, every body a random shade, every chase endless. They don’t move in chaos but in pursuit, like coded signals of light chasing their own reflections. You choose if the scene glows faint like whispers or burns hot like fire with brightness control.',
  'Fast trails of color that look alive, like light has found its own prey.',
  'Think of it as neon serpents, each with its own shade, weaving across the strip in an endless pursuit.',
  'The effect isn’t static—it’s alive, serpents of color looping through the LEDs, chasing endlessly but never catching. Lower the brightness for subtle motion, raise it and the chase becomes electric.',
  'Lines of light slither forward, random in color but unified in motion, like snakes racing into the dark.'
]

const PulseSyncDescriptions = [
  'A serpent runs right to left, then another returns—endless back-and-forth.',
  'Light travels across the strip like a pulse: one snake slides to the end, then a new one rises from the other side in a fresh random shade. Brightness control makes it either smooth or intense.',
  'It’s symmetry in motion—snakes of color taking turns crossing the strip, first one direction, then the other. Each carries a random hue, disappearing as soon as it arrives. The pattern loops like a heartbeat, but you decide if it glows soft like breath or burns sharp like lightning with brightness control.',
  'One path forward, another back—an infinite chase between colors.',
  'Every run feels like a reply: a serpent crosses, then another answers from the opposite side in its own tone.',
  'The strip becomes a corridor of movement—light snakes sliding right, then left, endlessly. The flow is balanced, yet unpredictable in color. Lower brightness for subtle dialogue, raise it to watch the strip scream with energy.',
  'A constant rhythm of departure and return—color snakes moving in opposite directions, never the same shade twice.'
]

const FireworksBurstDescriptions = [
  'A rocket of light, gone in a flash, exploding where you least expect.',
  'Colors launch fast, racing up the strip before bursting into random sparks. Brightness decides if it’s a quiet pop or a blinding explosion.',
  'It feels like celebration coded into LEDs—single rockets darting forward, each in its own shade, before erupting in bursts of light at random spots. Every explosion is different, unpredictable, alive. With brightness under your hand, it shifts from subtle shimmer to firework chaos.',
  'One second it’s a streak, the next it’s gone—only sparks left behind.',
  'Think of it as neon fireworks—fast, random, always surprising.',
  'The strip becomes a sky for digital rockets—colors shooting, exploding, fading away. Dial down the brightness for gentle sparks, or push it up and flood the strip with wild energy.',
  'Unpredictable bursts of color, each one short-lived but impossible to ignore.'
]

const MeteorShowerDescriptions = [
  'Sudden streaks of light, blazing across the strip—each meteor unique in color, length, and speed.',
  'Random meteors shoot fast, unpredictable, each one a different flash. Brightness controls whether it’s a soft glow or a blinding streak.',
  'The LEDs become a night sky—meteors appear when they feel like it, some short, some long, all racing across with their own random colors and speeds. You never know which one will hit next.',
  'Fast, fleeting, random flashes—blink and a meteor is gone.',
  'Like a digital night sky in motion—chaotic, vibrant, and alive.',
  'Every meteor is its own story: color, speed, length all randomized. Tweak the brightness to make them whisper past or scream across the strip.',
  'Unpredictable streaks of light, zipping across at random intervals—keeping the whole effect tense, alive, and hypnotic.'
]


const FadeColorsCustomDescriptions = [
  'Pick your vibe, let it fade—smooth transitions, one chosen color drifting across the strip.',
  'Your color, your rhythm. LEDs breathe slowly in and out, like the strip itself is alive, whispering your chosen shade.',
  'Custom color fades in a hypnotic loop—slow, deliberate, mesmerizing. Brightness in your hands, every blink is controlled by you.',
  'One color takes over, flowing gently across the strip, fading in and out as if it has a mind of its own.',
  'It’s not random, it’s personal—select your color and watch it pulse, fade, and glow, perfectly synced with your mood.',
  'A single hue, endless possibilities. Smooth, slow fades that let you control the intensity and make the strip feel alive.',
  'Fade in, fade out, repeat. Your color, your rules. The LEDs obey, moving in rhythm with your choice and brightness.'
]

const BlinkingCustomDescriptions = [
  'Your color, your chaos—LEDs blink sharp and sudden, controlled by your choice.',
  'Pick a shade, watch it pop. Random flashes, but now you decide the hue and intensity.',
  'Blink in your style—your color dances across the strip in unpredictable bursts, brightness in your hands.',
  'LEDs obey your color command, flashing in short bursts, long pulses, or anything in between.',
  'This isn’t random anymore—it’s your custom blink, each spark chosen by you, every flash a signature.',
  'Short, long, medium—your color sets the pace. Quick bursts or slow blinks, the strip listens.',
  'Blinking isn’t just a pattern—it’s your vibe. You pick the hue, the LEDs do the magic, fading in and out as you like.'
]

const BreathingCustomDescriptions = [
  'Your color, your chill—LEDs breathe slowly, fading in and out like they’re alive, all in the hue you picked.',
  'Pick a shade, watch it inhale and exhale. Slow, hypnotic pulses that you control.',
  'Breathing in your vibe—LEDs swell and fade, rhythm set by your chosen color and brightness.',
  'Soft glow, long fade, short pulse—your color dances through the strip, calm but alive.',
  'The strip isn’t just breathing, it’s syncing to your color choice. Each fade a signature of your style.',
  'Choose the color, adjust the brightness, let the LEDs take their slow, hypnotic ride across the strip.',
  'Breathing effect but make it yours—your hue, your intensity, your mood, all wrapped in a smooth pulse.'
]

const MeteorShowerCustomDescriptions = [
  'Random meteors, now in your color—zap across the strip at insane speeds, each streak unique, brightness under your control.',
  'You pick the hue, the meteor decides the chaos—fast, bright, and fleeting. Colors chase, vanish, repeat.',
  'A cosmic storm, but you hold the palette. Meteors shoot in random timing, length, and speed, leaving a trail that’s all yours.',
  'Speedy streaks explode in your chosen color, unpredictable yet under your command.',
  'It’s your color, your chaos—meteors appear when they want, fly fast, fade fast, and keep the strip alive.',
  'Blink, and you’ll miss it. Each meteor bursts in the color you picked, racing across the LEDs in random flashes.'
]

const PulseSyncCustomDescriptions = [
  'Your color, your pulse—fades in and out unpredictably, each blink arriving like it owns its own timeline.',
  'Fade-in, fade-out, random beats—but all in your chosen hue. The strip breathes your color in chaotic harmony.',
  'Each pulse dances alone, yet part of the flow, fading up and down at random times. You control the shade, not the chaos.',
  'Colors rise and vanish at their own pace, synced in randomness—your chosen hue runs the show.',
  'It’s like the LEDs are breathing your color, each fade coming when it wants, unpredictable but hypnotic.',
  'Your hue takes center stage. Pulses fade-in and fade-out at random intervals, creating a living rhythm across the strip.'
]

const CustomGlitchFlashDescriptions = [
  'Your color, but unpredictable—LEDs glitch on and off like they’ve got a mind of their own.',
  'No pause, no repeat, just chaotic flashes of your chosen hue, like the strip is alive and rebellious.',
  'Random pops of your color—blink and it’s gone, only to reappear somewhere else, always moving, never static.',
  'Feels like digital static in your hue, LEDs jumping on and off in a glitchy rhythm you control.',
  'Endless flashes, no loop to catch—your color explodes in bursts, then vanishes before you even blink.',
  'Like the strip is trolling your eyes—your chosen shade flickers unpredictably, chaos in control.'
]


const CustomHeartBeatDescriptions = [
  'Two quick pulses of your color, then a moment to breathe—repeat endlessly.',
  'Your hue beats like a hidden heart, quick and fleeting, pausing before the next thump.',
  'Heart pulses in neon rhythm, bright then dim, a living LED heartbeat under your control.',
  'Blink, blink—then pause. A heartbeat you can see and tweak.',
  'Rapid twin pulses, color you pick, then silence; hypnotic, alive, yours.',
  'Each beat like a secret signal, fading fast, waiting for the next.',
  'Your color throbs twice, then stillness—LEDs keeping time with invisible rhythm.'
]

const CustomTunnelEffectDescriptions = [
  'Snakes from edges slither to the center, fading in your chosen color, then explode midstrip.',
  'Your color rushes inward, trails fading gracefully, bursts of light like a tunnel vision.',
  'LED snakes converge, then vanish in an epic center flash, pause, repeat unpredictably.',
  'Colors collide at the center, fading tails chasing, your control over chaos.',
  'Center-bound snakes, slow build, dramatic fade-out—your color runs the show.',
  'Inward-moving trails, fading as they go, meeting at midline and bursting into brilliance.',
  'From edges to center, your shade dances, fades, then vanishes—hypnotic, alive.'
]

const CustomLaserShotDescriptions = [
  'Bright laser streaks forward and backward, fading trails like neon whispers of your color.',
  'Your color zips with velocity, trailing shadows, a laser dance you control.',
  'Flash, fade, reverse—laser pulses slice the strip in your hue.',
  'Neon streaks, fading trails, forward and back, hypnotic in rhythm and color.',
  'Laser trail in your chosen shade, fast, bright, relentless.',
  'Moving light, fading behind, bouncing back—your color, your tempo.',
  'Forward surge, backward echo, a sleek laser of your making.'
]

const CustomSparklingStarsDescriptions = [
  'Stars in your color twinkle randomly, no pattern, endless sparkle chaos.',
  'Random flickers of your hue, like cosmic whispers across the LED strip.',
  'Twinkle, fade, pause, repeat—LED constellations you command.',
  'Your color bursts as tiny stars, scattered unpredictably, hypnotic shimmer.',
  'LEDs sparkle like a galaxy you can color, fade, and orchestrate.',
  'Random shimmer, fading in and out, your hue dancing like starlight.',
  'Controlled chaos of twinkling LEDs, each sparkle a secret in your chosen color.'
]

const CustomStrobeFlashDescriptions = [
  'All LEDs blink fast in your color—pulse, vanish, repeat relentlessly.',
  'Rapid strobe, your hue flashing, hypnotic bursts with no mercy.',
  'Flash and disappear, a color beat that controls your strip.',
  'Light pulses in your shade, sharp and edgy, a visual heartbeat.',
  'Relentless blink-fest, your color, your rhythm, shocking and crisp.',
  'Rapid on/off bursts, LEDs obeying your color command.',
  'Strobe chaos, bright, fleeting, alive with your chosen hue.'
]

const CustomKnightRiderDescriptions = [
  'Pulses dance inwards and outwards, your color bouncing across the strip.',
  'LED pairs glide like a sci-fi chase, fading trails in your hue.',
  'Inward, outward, rhythmical dance, hypnotic color movement.',
  'Center-to-edge pulses, your chosen shade painting motion.',
  'LED beats moving in symmetry, alive with your color choice.',
  'Dancing pulses, inward then outward, hypnotic loop of light.',
  'Your color chasing itself, LED pairs racing the strip in endless flow.'
]

const CustomBounceBackDescriptions = [
  'Segments appear, move, fade, randomly spaced—your color in motion.',
  'LED blocks parade endlessly, gaps and moves, a chaotic color march.',
  'Bounce, fade, repeat—your chosen hue runs wild across the strip.',
  'Segments sprint forward, fade behind, unpredictable but mesmerizing.',
  'LED fragments in your shade, spacing random, alive, breathing color.',
  'Motion, fade, restart—segments showing your color in kinetic art.',
  'Your hue jumps, flows, fades, an endless parade of light chaos.'
]

const RedDescriptions = [
    'Red… because drama is mandatory.',
    'Warning: not for beginners.',
    'Red vibes only—stand out or go home.',
    'Red… the color that says ‘watch me.’',
    'When you’re mad but make it visual.',
    'Red: because black is basic and blue is boring.',
    'Red… the official color of overthinkers.'
]


const CustomFireworksBurstDescriptions = [
  'Launch your color rocket—blasts randomly across the strip, colors explode in chaos.',
  'Your chosen hue shoots skyward, then bursts in neon chaos—each explosion unique.',
  'Firework streaks in your shade, flying fast, detonating bright and random.',
  'Pick a color, ignite, watch LEDs explode in unpredictable brilliance.',
  'Rocket launch! Your color arcs, explodes, fades—every burst alive.',
  'Color rockets zoom, explode, vanish—controlled chaos at your fingertips.',
  'Random explosions of your hue, dazzling, fast, ephemeral—a visual symphony.'
]


const BlueDescriptions = [
    'Blue… because apparently you have bad taste.',
    'I’m cooler than your life choices.',
    'Blue vibes… like your mood, I guess.',
    'I chill… unlike your chaotic brain.',
    'Try choosing me, maybe you’ll finally get it right.',
    'I’m literally carrying this strip while you scroll.',
    'Blue, smarter than you, obviously.',
    'Go ahead… stare. I see your poor taste'

]

const GreenDescriptions = [
    'Green… because you’re basic like that.',
    'Green vibes… because you can’t decide.',
    'I’m the color of envy, just like your life choices.',
    'Green… because you’re too indecisive for red or blue.',
    'I’m the color of money, which you clearly need more of.',
    'I’m the color of money, which you clearly need more of.',
    'I’m the color of money, which you clearly need more of.',
    'I’m the color of money, which you clearly need more of.',
    'Green… because you’re trying to be different but failing.',
    'I’m the color of nature, which is ironic for your tech obsession.',
    'I’m the grass you’ll never step on… careful.',
    'Yeah, I’m green… look at me, maybe you’ll learn patience.',
    'I’m nature’s flex… and you’re just staring.',
    'Try picking me… but don’t mess it up like usual.',
    'I’m fresh, alive… unlike your choices. Who am I?',
    'Leaf it alone? Nah… I dare you to try.',
    'Go touch some grass…',
    'Yeah, I’m green… unlike your decision-making.',
    'Fresh, alive… just not like your brain. who am I?'

]

const YellowDescriptions = [
    'Pick me… if your brain even remembers how.',
    'I shine brighter than your life choices.',
    'Yeah, I’m golden… unlike your decision-making.',
    'Go on… pick me, maybe I’ll save you from boring.',
    'I’m the only thing lighting up while your ideas stay dim.',
    'Try me, you might learn something for once.',
    'I glow… because clearly, you need guidance.',
    'Yes, me. Don’t overthink it… or do, whatever.',
    'Choose me, or live with regret… your call, human.'
]


const OrangeDescriptions = [
    'I shine bright… unlike your ability to choose wisely.',
    'Orange doesn’t panic… you, on the other hand, can’t even pick me right.',
    'Bold, unapologetic… unlike your last 10 failed decisions.',
    'I’m alive, vivid… you’re just buffering.',
    'I burn with purpose… you burn with regret.',
    'Orange rules the scene… you just follow the wrong crowd.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.',
    'I’m just here, being orange… not like you.'
]

const PurpleDescriptions = [
    'I’m mysterious, powerful… you’re just confused.',
    'Purple owns the vibe… you barely own your choices.',
    'Deep, rich, timeless… unlike your last 3 decisions.',
    'I rule quietly… you trip over your own thoughts.',
    'Elegant, rare… your logic? Common and lost.',
    'I’m the secret you’ll never figure out… keep trying, champ'
]

const WhiteDescriptions = [
    'I’m clear, simple… you’re still confused.',
    'White shines… you just stumble in the dark.',
    'Pure, obvious… your logic? Not so much.',
    'I’m everywhere… you barely exist.',
    'Bright, calm… you’re still lost.',
    'I’m basic, essential… you’re just extra.',
    'I reflect everything… but you reflect nothing.'
]


const OffDescriptions = [
    'Off? Yeah, that’s just black. You want darkness, you got it… obviously, you can’t handle colors anyway.',
    'Black = off. Simple. Not like you, who can’t keep it simple.',
    'This is the end… literally. Off = black. W dev.',
    'You chose nothing. Classic. ',
    'Off is black. Black is nothing. Nothing… like your choices. W smart dev.',
    'Off is black. Black is nothing. Nothing… like your choices. W dev.',
    'Off is black. Black is nothing. Nothing… like your choices. W smart dev.',
    'Off is black. Black is nothing. Nothing… like your choices. W dev.',
]

const RandomColorsDescriptions = [
    'Nothing yet'
]

// تهيئة الـ Tooltip
function initTooltips() {
    const tooltip = document.getElementById('animationTooltip');
    const tooltipTitle = document.getElementById('tooltipTitle');
    const tooltipDescription = document.getElementById('tooltipDescription');

    // دالة لتوليد ألوان عشوائية زاهية 
    function generateRandomColors() {
        const hue1 = Math.floor(Math.random() * 360);
        const hue2 = (hue1 + 120 + Math.floor(Math.random() * 60) - 30) % 360;
        const hue3 = (hue2 + 120 + Math.floor(Math.random() * 60) - 30) % 360;

        return [
            `hsl(${hue1}, 100%, 60%)`,
            `hsl(${hue2}, 100%, 60%)`,
            `hsl(${hue3}, 100%, 60%)`
        ];
    }

    function getRandomDescriptionFor(buttonId) {
        if (buttonId === 'lightOneBtn') {
            if (Array.isArray(fadeDescriptions) && fadeDescriptions.length) {
                return fadeDescriptions[Math.floor(Math.random() * fadeDescriptions.length)];
            }
        }
        if (buttonId === 'WaveEffectBtn') {
            if (Array.isArray(waveDescriptions) && waveDescriptions.length) {
                return waveDescriptions[Math.floor(Math.random() * waveDescriptions.length)];
            }
        }
        if (buttonId === 'RainbowFlowBtn') {
            if (Array.isArray(RainbomDescriptions) && RainbomDescriptions.length) {
                return RainbomDescriptions[Math.floor(Math.random() * RainbomDescriptions.length)];
            }
        }
        if (buttonId === 'BlinkingPatternBtn') {
            if (Array.isArray(BlinkingDescriptions) && BlinkingDescriptions.length) {
                return BlinkingDescriptions[Math.floor(Math.random() * BlinkingDescriptions.length)];
            }
        }

        if (buttonId === 'RunningLightsBtn') {
            if (Array.isArray(RunningLightsDescriptions) && RunningLightsDescriptions.length) {
                return RunningLightsDescriptions[Math.floor(Math.random() * RunningLightsDescriptions.length)];
            }
        }
        if (buttonId === 'BreathingEffectBtn') {
            if (Array.isArray(BreathingEffectDescriptions) && BreathingEffectDescriptions.length) {
                return BreathingEffectDescriptions[Math.floor(Math.random() * BreathingEffectDescriptions.length)];
            }
        }

        if (buttonId === 'MeteorShowerBtn') {
            if (Array.isArray(SnakesChasingDescriptions) && SnakesChasingDescriptions.length) {
                return SnakesChasingDescriptions[Math.floor(Math.random() * SnakesChasingDescriptions.length)];
            }
        }

        if (buttonId === 'PulseSyncBtn') {
            if (Array.isArray(PulseSyncDescriptions) && PulseSyncDescriptions.length) {
                return PulseSyncDescriptions[Math.floor(Math.random() * PulseSyncDescriptions.length)];
            }
        }

        if (buttonId === 'FireworksBurstBtn') {
            if (Array.isArray(FireworksBurstDescriptions) && FireworksBurstDescriptions.length) {
                return FireworksBurstDescriptions[Math.floor(Math.random() * FireworksBurstDescriptions.length)];
            }
        }

        if (buttonId === 'MeteorShowerNewBtn') {
            if (Array.isArray(MeteorShowerDescriptions) && MeteorShowerDescriptions.length) {
                return MeteorShowerDescriptions[Math.floor(Math.random() * MeteorShowerDescriptions.length)];
            }
        }

        if (buttonId === 'customFadeBtn') {
            if (Array.isArray(FadeColorsCustomDescriptions) && FadeColorsCustomDescriptions.length) {
                return FadeColorsCustomDescriptions[Math.floor(Math.random() * FadeColorsCustomDescriptions.length)];
            }
        }

        if (buttonId === 'customBlinkBtn') {
            if (Array.isArray(BlinkingCustomDescriptions) && BlinkingCustomDescriptions.length) {
                return BlinkingCustomDescriptions[Math.floor(Math.random() * BlinkingCustomDescriptions.length)];
            }
        }

        if (buttonId === 'customBreathingBtn') {
            if (Array.isArray(BreathingCustomDescriptions) && BreathingCustomDescriptions.length) {
                return BreathingCustomDescriptions[Math.floor(Math.random() * BreathingCustomDescriptions.length)];
            }
        }

        if (buttonId === 'customMeteorShowerBtn') {
            if (Array.isArray(MeteorShowerCustomDescriptions) && MeteorShowerCustomDescriptions.length) {
                return MeteorShowerCustomDescriptions[Math.floor(Math.random() * MeteorShowerCustomDescriptions.length)];
            }
        }

        if (buttonId === 'customPulseSyncBtn') {
            if (Array.isArray(PulseSyncCustomDescriptions) && PulseSyncCustomDescriptions.length) {
                return PulseSyncCustomDescriptions[Math.floor(Math.random() * PulseSyncCustomDescriptions.length)];
            }
        }

        if (buttonId === 'customGlitchFlashBtn') {
            if (Array.isArray(CustomGlitchFlashDescriptions) && CustomGlitchFlashDescriptions.length) {
                return CustomGlitchFlashDescriptions[Math.floor(Math.random() * CustomGlitchFlashDescriptions.length)];
            }
        }

        if (buttonId === 'customHeartBeatBtn') {
            if (Array.isArray(CustomHeartBeatDescriptions) && CustomHeartBeatDescriptions.length) {
                return CustomHeartBeatDescriptions[Math.floor(Math.random() * CustomHeartBeatDescriptions.length)];
            }
        }

        if (buttonId === 'customTunnelEffectBtn') {
            if (Array.isArray(CustomTunnelEffectDescriptions) && CustomTunnelEffectDescriptions.length) {
                return CustomTunnelEffectDescriptions[Math.floor(Math.random() * CustomTunnelEffectDescriptions.length)];
            }
        }

        if (buttonId === 'customLaserShotBtn') {
            if (Array.isArray(CustomLaserShotDescriptions) && CustomLaserShotDescriptions.length) {
                return CustomLaserShotDescriptions[Math.floor(Math.random() * CustomLaserShotDescriptions.length)];
            }
        }

        if (buttonId === 'customSparklingStarsBtn') {
            if (Array.isArray(CustomSparklingStarsDescriptions) && CustomSparklingStarsDescriptions.length) {
                return CustomSparklingStarsDescriptions[Math.floor(Math.random() * CustomSparklingStarsDescriptions.length)];
            }
        }

        if (buttonId === 'customStrobeFlashBtn') {
            if (Array.isArray(CustomStrobeFlashDescriptions) && CustomStrobeFlashDescriptions.length) {
                return CustomStrobeFlashDescriptions[Math.floor(Math.random() * CustomStrobeFlashDescriptions.length)];
            }   
        }

        if (buttonId === 'customKnightRiderBtn') {
            if (Array.isArray(CustomKnightRiderDescriptions) && CustomKnightRiderDescriptions.length) {
                return CustomKnightRiderDescriptions[Math.floor(Math.random() * CustomKnightRiderDescriptions.length)];
            }
        }

        if (buttonId === 'customBounceBackBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customRippleTouchBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customFireFlickerBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }


        if (buttonId === 'customColorWipeBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customStaticGlowBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customColorEchoBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customTimeWarpBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customQuantumFlickerBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customRunningLightsBtn') {
            if (Array.isArray(CustomBounceBackDescriptions) && CustomBounceBackDescriptions.length) {
                return CustomBounceBackDescriptions[Math.floor(Math.random() * CustomBounceBackDescriptions.length)];
            }
        }

        if (buttonId === 'customFireworksBurstBtn') {
            if (Array.isArray(CustomFireworksBurstDescriptions) && CustomFireworksBurstDescriptions.length) {
                return CustomFireworksBurstDescriptions[Math.floor(Math.random() * CustomFireworksBurstDescriptions.length)];
            }
        }

        if (buttonId === 'redBtn') {
            if (Array.isArray(RedDescriptions) && RedDescriptions.length) {
                return RedDescriptions[Math.floor(Math.random() * RedDescriptions.length)];
            }
        }

        if (buttonId === 'blueBtn') {
            if (Array.isArray(BlueDescriptions) && BlueDescriptions.length) {
                return BlueDescriptions[Math.floor(Math.random() * BlueDescriptions.length)];
            }
        }

        if (buttonId === 'greenBtn') {
            if (Array.isArray(GreenDescriptions) && GreenDescriptions.length) {
                return GreenDescriptions[Math.floor(Math.random() * GreenDescriptions.length)];
            }
        }

        if (buttonId == 'yellowBtn') {
            if (Array.isArray(YellowDescriptions) && YellowDescriptions.length) {
                return YellowDescriptions[Math.floor(Math.random() * YellowDescriptions.length)];
            }
        }

        if (buttonId == 'orangeBtn') {
            if (Array.isArray(OrangeDescriptions) && OrangeDescriptions.length) {
                return OrangeDescriptions[Math.floor(Math.random() * OrangeDescriptions.length)];
            }
        }

        if (buttonId == 'purpleBtn') {
            if (Array.isArray(PurpleDescriptions) && PurpleDescriptions.length) {
                return PurpleDescriptions[Math.floor(Math.random() * PurpleDescriptions.length)];
            }
        }

        if (buttonId == 'whiteBtn') {
            if (Array.isArray(WhiteDescriptions) && WhiteDescriptions.length) {
                return WhiteDescriptions[Math.floor(Math.random() * WhiteDescriptions.length)]
            }
        }

        if (buttonId == 'offBtn') {
            if (Array.isArray(OffDescriptions) && OffDescriptions.length) {
                return OffDescriptions[Math.floor(Math.random() * OffDescriptions.length)]
            }
        }

        if (buttonId == 'off2Btn') {
            if (Array.isArray(OffDescriptions) && OffDescriptions.length) {
                return OffDescriptions[Math.floor(Math.random() * OffDescriptions.length)]
            }
        }
        
        if (buttonId == 'RandomColorsBtn') {
            if (Array.isArray(RandomColorsDescriptions) && RandomColorsDescriptions.length) {
                return RandomColorsDescriptions[Math.floor(Math.random() * RandomColorsDescriptions.length)]
            }
        }

        return (tooltipData[buttonId] && tooltipData[buttonId].description) || '';
    }

    // إضافة حدث لجميع الأزرار
    document.querySelectorAll('button').forEach(button => {
        const buttonId = button.id;

        if (tooltipData[buttonId]) {
            // mouseenter
            button.addEventListener('mouseenter', (e) => {
                const rect = button.getBoundingClientRect();

                tooltipTitle.textContent = tooltipData[buttonId].title || '';

                tooltipDescription.textContent = getRandomDescriptionFor(buttonId);

                // توليد ألوان عشوائية جديدة
                const [color1, color2, color3] = generateRandomColors();

                tooltip.style.setProperty('--random-color-1', color1);
                tooltip.style.setProperty('--random-color-2', color2);
                tooltip.style.setProperty('--random-color-3', color3);

                tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
                tooltip.style.top = `${rect.top - 10}px`;
                tooltip.style.transform = 'translate(-50%, -100%)';

                tooltip.classList.add('show');

                const buttonColor = window.getComputedStyle(button).backgroundColor;
                if (buttonColor && buttonColor !== 'rgba(0, 0, 0, 0)') {
                    tooltip.style.setProperty('--ui-color', buttonColor);
                }
            });

            // mouseleave
            button.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        }
    });
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initTooltips);


