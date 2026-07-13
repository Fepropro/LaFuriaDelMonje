import './style.css'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111111)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const menuScreen = document.createElement('div')

menuScreen.style.position = 'fixed'
menuScreen.style.top = '0'
menuScreen.style.left = '0'
menuScreen.style.width = '100%'
menuScreen.style.height = '100%'

menuScreen.style.backgroundColor = 'black'

menuScreen.style.display = 'flex'
menuScreen.style.flexDirection = 'column'

menuScreen.style.justifyContent = 'center'
menuScreen.style.alignItems = 'center'

document.body.appendChild(menuScreen)

const menuTitle = document.createElement('h1')

menuTitle.innerText = 'LA FURIA DEL MONJE'

menuTitle.style.color = 'white'

menuScreen.appendChild(menuTitle)

const playButton =
  document.createElement('button')

playButton.innerText = 'JUGAR'

playButton.style.fontSize = '32px'

playButton.onclick = () => {

  gameStarted = true

  menuScreen.style.display = 'none'

  controls.lock()

}

menuScreen.appendChild(playButton)

const hud = document.createElement('div')

hud.style.position = 'absolute'
hud.style.top = '20px'
hud.style.left = '20px'
hud.style.color = 'white'
hud.style.fontSize = '32px'
hud.style.fontFamily = 'Arial'
hud.style.fontWeight = 'bold'

hud.innerText = 'Objetos: 0 / 7'

document.body.appendChild(hud)

const gameOverScreen = document.createElement('div')

gameOverScreen.style.position = 'fixed'
gameOverScreen.style.top = '0'
gameOverScreen.style.left = '0'
gameOverScreen.style.width = '100%'
gameOverScreen.style.height = '100%'

gameOverScreen.style.backgroundColor =
  'rgba(0,0,0,0.9)'

gameOverScreen.style.display = 'none'

gameOverScreen.style.justifyContent = 'center'
gameOverScreen.style.alignItems = 'center'
gameOverScreen.style.flexDirection = 'column'

gameOverScreen.style.color = 'white'
gameOverScreen.style.fontSize = '64px'
gameOverScreen.style.fontFamily = 'Arial'

document.body.appendChild(gameOverScreen)

const gameOverText = document.createElement('div')

gameOverText.innerText = 'GAME OVER'

gameOverScreen.appendChild(gameOverText)

const retryButton =
  document.createElement('button')

retryButton.innerText = 'REINTENTAR'

retryButton.style.fontSize = '32px'
retryButton.style.padding = '15px'

retryButton.onclick = () => {

  location.reload()

}

gameOverScreen.appendChild(retryButton)

const controls = new PointerLockControls(
  camera,
  document.body
)

document.addEventListener('click', () => {
  controls.lock()
})

const menuButton =
  document.createElement('button')

menuButton.innerText = 'MENU'

menuButton.style.fontSize = '32px'
menuButton.style.padding = '15px'

menuButton.onclick = () => {

  location.reload()

}

gameOverScreen.appendChild(menuButton)

const colliders = []

let gameStarted = false

const keys = {}

const collectibles = []

let objetosEncontrados = 0

const raycaster = new THREE.Raycaster()

let monje

let gameEnded = false

let exitDoor

let monjeSpeed = 0.02

document.addEventListener('keydown', (event) => {
  keys[event.code] = true
})

document.addEventListener('keyup', (event) => {
  keys[event.code] = false
})

// Piso

function createFloor(width, height, color, x = 0, z = 0) {

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide
    })
  )

  floor.rotation.x = Math.PI / 2

  floor.position.set(x, 0, z)

  scene.add(floor)

  return floor

}

// Patio

createFloor(
  40,
  40,
  0x707070
)

// Galería superior

createFloor(
  50,
  10,
  0x505050,
  -5,
  -25
)

// Galería inferior

createFloor(
  50,
  10,
  0xffff00,
  -5,
  25
)

// Galería izquierda

createFloor(
  10,
  40,
  0xff0000,
  -25,
  0
)

// Galería derecha

createFloor(
  25,
  60,
  0xff0000,
  32.5,
  0
)

function createWall(x, y, z, width, height, depth, color = 0x888888) {

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshBasicMaterial({ color })
  )

  wall.position.set(x, y, z)

  scene.add(wall)

  colliders.push(wall)

  return wall

}

// pared de adelante
createWall(
  7.5,
  2.5,
  -30,
  75,
  5,
  1,
  0x888888
)

// pared de atras
createWall(
  7.5,
  2.5,
  30,
  75,
  5,
  1,
  0x888888
)

//pared de la izquierda
createWall(
  -30,
  2.5,
  0,
  1,
  5,
  60,
  0x888888
)

//pared de la derecha
createWall(
  45,
  2.5,
  0,
  1,
  5,
  60,
  0x888888
)

function createCeiling(width, height, x = 0, z = 0, y = 5, color = 0x333333) {

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide
    })
  )

  ceiling.rotation.x = Math.PI / 2

  ceiling.position.set(x, y, z)

  scene.add(ceiling)

  return ceiling

}

// techo de adelante

createCeiling(
  60,
  10,
  0,
  -25
)

// techo de atras
createCeiling(
  60,
  10,
  0,
  25
)

// techo de la izquierda
createCeiling(
  10,
  60,
  -25,
  0
)

// techo de la derecha
createCeiling(
  25,
  60,
  32.5,
  0
)

function createPillar(x, z, size = 1.5, color = 0xcccccc) {

  const pillar = new THREE.Mesh(
    new THREE.BoxGeometry(size, 5, size),
    new THREE.MeshBasicMaterial({ color })
  )

  pillar.position.set(
    x,
    2.5, // centro de una columna de 4 metros
    z
  )

  scene.add(pillar)

  colliders.push(pillar)

  return pillar

}

createPillar(-21, -21)
createPillar(-21, 21)
createPillar(21, -21)
createPillar(21, 21)
createPillar(-21, 0)
createPillar(21, 0)
createPillar(0, -21)
createPillar(0, 21)
createPillar(-21, 10.5)
createPillar(21, 10.5)
createPillar(-21, -10.5)
createPillar(21, -10.5)
createPillar(-10.5, -21)
createPillar(-10.5, 21)
createPillar(10.5, -21)
createPillar(10.5, 21)

function createDoor(x, z, rotation = 0) {

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 3, 2),
    new THREE.MeshBasicMaterial({
      color: 0x5a381e
    })
  )

  door.position.set(
    x,
    1.5,
    z
  )

  door.rotation.y = rotation

  scene.add(door)

  return door

}

function createExitDoor(x, z) {

  exitDoor = createDoor(x, z)

  return exitDoor

}

createDoor(-29.5, -20)
createDoor(-29.5, 0)
createDoor(-29.5, 20)
createExitDoor(44.5, 0)
createDoor(44.5, -20)
createDoor(44.5, 20)
createDoor(20, -29.5, Math.PI / 2)
createDoor(0, -29.5, Math.PI / 2)
createDoor(-20, -29.5, Math.PI / 2)
createDoor(20, 29.5, Math.PI / 2)
createDoor(0, 29.5, Math.PI / 2)
createDoor(-20, 29.5, Math.PI / 2)

function createCollectible(x, y, z, color = 0x00ff00) {

  const item = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color })
  )

  item.position.set(x, y, z)

  scene.add(item)

  collectibles.push(item)

  return item

}

createCollectible(0, 0.5, 0)
createCollectible(10, 0.5, -10)
createCollectible(-15, 0.5, 22)
createCollectible(30, 0.5, 0)
createCollectible(-22, 0.5, -18)
createCollectible(22, 0.5, 18)
createCollectible(0, 0.5, 25)

function createMonje(x, y, z) {

  const textureLoader = new THREE.TextureLoader()

  const texture =
    textureLoader.load('/monje.png')

  const material =
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    })

  monje = new THREE.Sprite(material)

  monje.position.set(x, y, z)

  monje.scale.set(6, 9, 1)

  scene.add(monje)

}

createMonje(
  35,
  2,
  25
)

function gameOver() {

  gameEnded = true

  controls.unlock()

  hud.style.display = 'none'

  gameOverScreen.style.display = 'flex'

}

function victory() {

  gameEnded = true

  controls.unlock()

  hud.style.display = 'none'

  gameOverText.innerText =
    '¡GANASTE!'

  retryButton.innerText =
    'JUGAR OTRA VEZ'

  gameOverScreen.style.display =
    'flex'

}

camera.position.set(0, 1.7, 29)

function updatePlayer() {

  if (!gameStarted) return

  if (gameEnded) return

  const speed = 0.1

  let moveX = 0
  let moveZ = 0

  if (keys['KeyW']) moveZ -= speed
  if (keys['KeyS']) moveZ += speed

  if (keys['KeyA']) moveX -= speed
  if (keys['KeyD']) moveX += speed

  const direction = new THREE.Vector3()

  camera.getWorldDirection(direction)

  direction.y = 0

  direction.normalize()

  const right = new THREE.Vector3()

  right.crossVectors(
    direction,
    new THREE.Vector3(0, 1, 0)
  )

  const moveVector =
    direction.clone().multiplyScalar(-moveZ)
      .add(
        right.multiplyScalar(moveX)
      )

  const newX =
    camera.position.x + moveVector.x

  const newZ =
    camera.position.z + moveVector.z

  if (!checkCollision(newX, newZ)) {

    camera.position.x = newX

    camera.position.z = newZ

  }

}

function checkCollision(newX, newZ) {

  const playerRadius = 0.5

  for (const object of colliders) {

    const dx =
      Math.abs(newX - object.position.x)

    const dz =
      Math.abs(newZ - object.position.z)

    const limitX =
      object.geometry.parameters.width / 2 +
      playerRadius

    const limitZ =
      object.geometry.parameters.depth / 2 +
      playerRadius

    if (
      dx < limitX &&
      dz < limitZ
    ) {
      return true
    }

  }

  return false

}

function checkCollectibles() {

  raycaster.setFromCamera(
    new THREE.Vector2(0, 0),
    camera
  )

  const intersections =
    raycaster.intersectObjects(collectibles)

  if (intersections.length > 0) {

    const item = intersections[0]

    if (item.distance < 3) {

      scene.remove(item.object)

      const index =
        collectibles.indexOf(item.object)

      if (index > -1) {
        collectibles.splice(index, 1)
      }
      objetosEncontrados++

      monjeSpeed += 0.012

      hud.innerText =
        `Objetos: ${objetosEncontrados} / 7 | Furia: ${Math.floor(monjeSpeed * 100)}`

      console.log(
        "Objetos:",
        objetosEncontrados
      )

    }

  }

}

function checkVictory() {

  if (!exitDoor) return

  const dx =
    camera.position.x - exitDoor.position.x

  const dz =
    camera.position.z - exitDoor.position.z

  const distance =
    Math.sqrt(dx * dx + dz * dz)

  if (
    distance < 1 &&
    objetosEncontrados >= 7
  ) {

    victory()

  }

}


function updateMonje() {

  if (!gameStarted) return

  if (gameEnded) return

  if (!monje) return

  const playerPos = camera.position

  const dx =
    playerPos.x - monje.position.x

  const dz =
    playerPos.z - monje.position.z

  const distance =
    Math.sqrt(dx * dx + dz * dz)

  if (distance > 1) {

    monje.position.x +=
      (dx / distance) * monjeSpeed

    monje.position.z +=
      (dz / distance) * monjeSpeed

  }
  
  if (distance < 2) {

    gameOver()

  }
}

function animate() {

  requestAnimationFrame(animate)

  updatePlayer()

  checkCollectibles()

  checkVictory()

  updateMonje()

  renderer.render(scene, camera)

}

animate()