kaboom({
	root: document.querySelector("#canva"),
    font: "league gothic",
	background: [25, 90, 25],
})

const FLOOR_HEIGHT = 48
// const JUMP_FORCE = 900
const JUMP_FORCE = 1000
const SPEED = 348
const MAX_LEVEL = 3

loadSound("win", "audio/win.wav")
loadSound("die", "audio/die.wav")

loadSprite("bg", "sprites/background.jpg")

loadSprite("monster1", "sprites/monster/monster1.png", {
	sliceX: 4,
	sliceY: 2,
	anims: {
		idle: {
			from: 4,
			to: 7,
			speed: 4,
			loop: true
		}
	}
})

loadSprite("monster2", "sprites/monster/monster2.png", {
	sliceX: 6,
	sliceY: 2,
	anims: {
		idle: {
			from: 6,
			to: 11,
			loop: true
		}
	}
})

loadSprite("monster3", "sprites/monster/monster3.png", {
	sliceX: 6,
	sliceY: 2,
	anims: {
		idle: {
			from: 6,
			to: 11,
			loop: true
		}
	}
})

loadSprite("violett", "sprites/violett_haze.png", {
	sliceX: 16,
	sliceY: 16,
	anims: {
		run: {
			from: 0,
			to: 8,
			loop: true,
			speed: 30
		},
		jump: {
			from: 9*16 + 1,
			to: 9*16 + 5
		},
		fall: {
			from: 9*16 + 6,
			to: 9*16 + 8
		},
		dead: 9,
		ghost: 10*16 + 9
	}
});

let level = 1

scene("next-level", () => {
	play("win")

	add([
		pos(0, height()),
		anchor("botleft"),
		area(),
		sprite("bg"),
		"bg"
	])

	add([
		pos(width() / 2 - 65, height() / 2 - 120),
		scale(0.9),
		sprite("violett", {
			anim: "ghost",
		}),
	])

	add([
		text(`Parabéns, você recuperou um fantasminha!`),
		pos(width() / 2, height() / 2 + 40),
		scale(1.25),
		anchor("center"),
	])

	add([
		text("Clique ou pressione espaço para continuar..."),
		pos(width() / 2, height() / 2 + 100),
		scale(1.1),
		anchor("center"),
	])

	wait(0.6, () => onKeyPress("space", () => go("game")))
	wait(0.6, () => onClick(() => go("game")))
})

scene("win", () => {
	play("win")

	add([
		pos(0, height()),
		anchor("botleft"),
		area(),
		sprite("bg"),
		"bg"
	])

	add([
		pos(width() / 2 - 65, height() / 2 - 80),
		scale(0.5),
		anchor("center"),
		sprite("violett", {
			anim: "ghost",
		}),
	])

	add([
		pos(width() / 2, height() / 2 - 80),
		scale(0.5),
		anchor("center"),
		sprite("violett", {
			anim: "ghost",
		})
	])

	add([
		pos(width() / 2 + 65, height() / 2 - 80),
		scale(0.5),
		anchor("center"),
		sprite("violett", {
			anim: "ghost",
		})
	])

	add([
		text("Parabéns, você resgatou todos os fantasminhas!"),
		pos(width() / 2, height() / 2 + 10),
		scale(1.5),
		anchor("center"),
	])

	add([
		text("Clique ou pressione espaço para voltar ao início..."),
		pos(width() / 2, height() / 2 + 100),
		scale(1),
		anchor("center"),
	])

	wait(0.6, () => onKeyPress("space", () => go("start")))
	wait(0.6, () => onClick(() => go("start")))
})

scene("start", () => {
	add([
		pos(0, height()),
		anchor("botleft"),
		area(),
		sprite("bg"),
		"bg"
	])

	add([
		pos(width(), height()),
		anchor("botleft"),
		area(),
		sprite("bg"),
		"bg"
	])

	onUpdate("bg", (bg) => {
		bg.move(-100, 0)
		if (bg.pos.x <= -1000) {
			bg.pos.x += 2*1000 - 5
		}
	})

	add([
		text("ViolettHaze"),
		pos(width() / 2, height() / 2 - 30),
		scale(3),
		anchor("center"),
	])

	add([
		text("Clique ou pressione espaço para prosseguir..."),
		pos(width() / 2, height() / 2 + 40),
		scale(1),
		anchor("center"),
	])

	onKeyPress("space", () => go("instructions"))
	onClick(() => go("instructions"))
})

scene("instructions", () => {
	add([
		pos(0, height()),
		anchor("botleft"),
		area(),
		sprite("bg"),
		"bg"
	])

	add([
		pos(width(), height()),
		anchor("botleft"),
		area(),
		sprite("bg"),
		"bg"
	])

	onUpdate("bg", (bg) => {
		bg.move(-100, 0)
		if (bg.pos.x <= -1000) {
			bg.pos.x += 2*1000 - 5
		}
	})

	add([
		text("• Corra com a Violett e pule sobre os monstros.\n• Finalize o nível para recuperar um fantasminha.\n• Recupere todos os 3 fantasminhas para ganhar o jogo!"),
		pos(width() / 2, height() / 2 - 30),
		scale(1),
		anchor("center"),
	])

	add([
		text("Clique ou pressione espaço para jogar..."),
		pos(width() / 2, height() / 2 + 100),
		scale(1.1),
		anchor("center"),
	])

	onKeyPress("space", () => go("game"))
	onClick(() => go("game"))
})

scene("game", () => {
	setGravity(2400)

	add([
		pos(0, height()),
		anchor("botleft"),
		area(),
		sprite("bg"),
		"bg"
	])

	add([
		pos(width(), height()),
		anchor("botleft"),
		area(),
		sprite("bg"),
		"bg"
	])

	onUpdate("bg", (bg) => {
		bg.move(-150 - (50 * level), 0)
		if (bg.pos.x <= -1000) {
			bg.pos.x += 2*1000 - 5
		}
	})

	const player = add([
		color(180, 180, 255),
		pos(80, 40),
		scale(0.75),
		area(),
		body(),
		sprite("violett"),
	])

	// floor
	add([
		rect(width(), FLOOR_HEIGHT),
		outline(4),
		pos(0, height()),
		anchor("botleft"),
		area(),
		body({ isStatic: true }),
		color(25, 90, 25),
	])


	function jump() {
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE)
			player.play("jump")
			wait(0.6, () => {
				if(!player.isGrounded()) player.play("fall")
				else player.play("run")
				wait(0.2, () => player.play("run"))
			})
		}
	}

	function down() {
		if (!player.isGrounded()) {
			player.jump(-650)
			player.play("fall")
		}
	}

	player.play("run")

	onKeyPress("space", jump)
	onKeyPress("w", jump)
	onKeyPress("s", down)
	onKeyPress("up", jump)
	onKeyPress("down", down)
	onClick(jump)

	function spawnMonster() {

		// monster_
		add([
			area({
				scale: 0.5
			}),
			scale(2),
			pos(width() + 80, height() - FLOOR_HEIGHT),
			anchor("botright"),
			color(255, 180, 255),
			move(LEFT, SPEED + SPEED*(.35*level)),
			offscreen({ destroy: true }),
			sprite("monster" + level, {
				anim: "idle",
			}),
			"monster",
		])

		wait(rand(0.7 - (0.075 * level), 1.6 - (0.1 * level)), spawnMonster)

	}

	spawnMonster()

	player.onCollide("monster", () => {
		go("lose")
		addKaboom(player.pos)
	})

	// keep track of score
	let score = 0

	// score in top and left
	let scoreLabel = add([
		text("Pontuação: " + score),
		scale(.75),
		pos(24, 24),
	])

	// level in top and right
	add([
		text(`Nível: ${level}`),
		scale(1),
		pos(width() - 100, 24),
	])

	onUpdate(() => {
		if(score >= 1000 + 500*level) {
			if(level < MAX_LEVEL) {
				go("next-level")
			} else {
				level = 0
				go("win")
			}

			level++
		}

		score++
		scoreLabel.text = `Pontuação: ${score}`
	})
})

scene("lose", () => {
	play("die")

	add([
		pos(0, height()),
		anchor("botleft"),
		area(),
		sprite("bg"),
		"bg"
	])

	add([
		pos(width() / 2 - 87, height() / 2 - 170),
		scale(1.3),
		sprite("violett", {
			anim: "dead",
		}),
	])

	add([
		text(`Violett bateu em um monstro!`),
		pos(width() / 2, height() / 2 + 40),
		scale(1.25),
		anchor("center"),
	])

	add([
		text("Clique ou pressione espaço para tentar novamente..."),
		pos(width() / 2, height() / 2 + 100),
		scale(1.1),
		anchor("center"),
	])

	wait(0.6, () => onKeyPress("space", () => go("game")))
	wait(0.6, () => onClick(() => go("game")))
})

go("start")
