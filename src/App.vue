<template>
  <div class="home">
    <img src="./assets/logo.webp" alt="4sLogo" class="logo" />
    <canvas ref="canvasRef"></canvas>
    <Panel @changeColor="changeColor" @changeMaterials="changeMaterials" @changeGlasses="changeGlasses" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { withBase } from './utils'
import Panel from './components/Panel.vue'

const canvasRef = ref(null)
let scene, camera, renderer, controls

let wheels = []
let carBody, frontCar, hoodCar, glassCar, brakePad

// 创建材质
const carBodyMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ff0000',
  metalness: 1, // 金属度
  roughness: 0.5, // 粗糙度
  clearcoat: 1, // 清漆度
  clearcoatRoughness: 0, // 清漆粗糙度
})
const frontCarMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ff0000',
  metalness: 1, // 金属度
  roughness: 0.5, // 粗糙度
  clearcoat: 1, // 清漆度
  clearcoatRoughness: 0, // 清漆粗糙度
})
const hoodCarMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ff0000',
  metalness: 1, // 金属度
  roughness: 0.5, // 粗糙度
  clearcoat: 1, // 清漆度
  clearcoatRoughness: 0, // 清漆粗糙度
})
const wheelsMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ff0000',
  metalness: 1, // 金属度
  roughness: 0.1, // 粗糙度
})
const brakePadMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ff0000',
  metalness: 1, // 金属度
  roughness: 0.1, // 粗糙度
})
const glassCarMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  metalness: 0, // 金属度
  roughness: 0, // 粗糙度
  transmission: 1, // 透光度
  transparent: true, // 透明度
})
const materials = { carBodyMaterial, frontCarMaterial, hoodCarMaterial, wheelsMaterial, brakePadMaterial }
const changeColor = (color, type) => {
  materials[type].color.set(color)
}
const changeMaterials = (roughness) => {
  // 设置车身材质
  carBodyMaterial.clearcoatRoughness = roughness
  frontCarMaterial.clearcoatRoughness = roughness
  hoodCarMaterial.clearcoatRoughness = roughness
}
const changeGlasses = (transmission) => {
  // 设置挡风玻璃材质
  glassCarMaterial.transmission = transmission
}

function main() {
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 开启场景中的阴影贴图
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap // 柔和阴影

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color('#ccc')

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 2, 6)

  // 添加网格地图
  const gridHelper = new THREE.GridHelper(10, 10)
  gridHelper.material.opacity = 0.2
  gridHelper.material.transparent = true
  scene.add(gridHelper)

  {
    // 添加轨道控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true // 自动旋转
    controls.autoRotateSpeed = 1 // 旋转速度
  }
  {
    // 添加灯光
    function createLight(position, intensity) {
      const light = new THREE.DirectionalLight(0xffffff, intensity)
      light.position.set(...position)
      light.castShadow = true
      scene.add(light)
    }
    createLight([0, 0, 10], 1)
    createLight([0, 0, -10], 1)
    createLight([10, 0, 0], 1)
    createLight([-10, 0, 0], 1)
    createLight([0, 10, 0], 1)
    createLight([5, 10, 0], 2)
    createLight([0, 10, 5], 2)
    createLight([0, 10, -5], 2)
    createLight([-5, 10, 0], 2)
  }

  // 添加gltf汽车模型
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath(withBase('/draco/'))
  loader.setDRACOLoader(dracoLoader)

  loader.load(
    withBase('/model/bmw.glb'),
    (gltf) => {
      const bmw = gltf.scene
      bmw.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          // 判断是否是轮毂
          if (child.name.includes('轮毂')) {
            child.material = wheelsMaterial
            wheels.push(child)
          }
          // 判断是否是刹车片
          if (child.name.includes('Line02' || 'Line03' || 'Line04' || 'Line05')) {
            child.material = brakePadMaterial
            brakePad = child
          }
          // 判断是否是车身
          if (child.name.includes('Mesh002')) {
            carBody = child
            carBody.material = carBodyMaterial
          }
          // 判断是否是前车身
          if (child.name.includes('前脸')) {
            child.material = frontCarMaterial
            frontCar = child
          }
          // 判断是否是引擎盖
          if (child.name.includes('引擎盖_1')) {
            child.material = hoodCarMaterial
            hoodCar = child
          }
          // 判断是挡风玻璃
          if (child.name.includes('挡风玻璃')) {
            child.material = glassCarMaterial
            glassCar = child
          }
        }
      })

      scene.add(bmw)
    },
    undefined,
    (error) => {
      console.error('Error loading model:', error)
    }
  )

  // 添加圆形平面
  const planeGeometry = new THREE.PlaneGeometry(5, 5)
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -Math.PI / 2
  scene.add(plane)
}
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement
  // 处理分辨率显示--应对HD-DPI显示器
  const pixelRatio = window.devicePixelRatio
  const width = Math.floor(canvas.clientWidth * pixelRatio)
  const height = Math.floor(canvas.clientHeight * pixelRatio)
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

function animate() {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

onMounted(() => {
  main()
  animate()
})
</script>

<style scoped>
.logo {
  position: absolute;
  top: 50px;
  left: 100px;
  width: 100px;
  height: 100px;
  z-index: 9999;
}
</style>
