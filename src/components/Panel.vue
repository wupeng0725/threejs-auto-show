<template>
  <div class="home-content">
    <div class="home-content-title">
      <h1>宝马I8-801 汽车选配</h1>
    </div>
    <div v-for="item in colorItems" :key="item.value">
      <h4>{{ item.title }}</h4>
      <div class="select">
        <div class="select-item" v-for="(k, index) in colors" :key="index" @click="changeColor(k.color, item.value)">
          <div class="select-item-color" :style="{ backgroundColor: k.color }"></div>
        </div>
      </div>
    </div>
    <h4>贴膜材质</h4>
    <div class="select">
      <div class="select-item" v-for="(item, index) in materials" :key="index" @click="changeMaterials(item.value)">
        <button class="select-item-btn">{{ item.text }}</button>
      </div>
    </div>
    <h4>挡风玻璃材质</h4>
    <div class="select">
      <div class="select-item" v-for="(item, index) in glasses" :key="index" @click="changeGlasses(item.value)">
        <button class="select-item-btn">{{ item.text }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['changeColor', 'changeMaterials', 'changeGlasses'])

const colorItems = [
  { title: '车身颜色', value: 'carBodyMaterial' },
  { title: '引擎盖颜色', value: 'hoodCarMaterial' },
  { title: '前脸颜色', value: 'frontCarMaterial' },
  { title: '轮毂颜色', value: 'wheelsMaterial' },
  { title: '刹车片颜色', value: 'brakePadMaterial' },
]
const colors = [
  { text: '红色', color: '#ff0000' },
  { text: '青色', color: '#00ffff' },
  { text: '紫罗兰色', color: '#ee82ee' },
  { text: '深绿色', color: '#006400' },
  { text: '橙色', color: '#ffa500' },
  { text: '粉色', color: '#ff69b4' },
  { text: '紫色', color: '#800080' },
  { text: '银色', color: '#c0c0c0' },
  { text: '黑色', color: '#000000' },
  { text: '白色', color: '#ffffff' },
]
const changeColor = (color, type) => {
  emit('changeColor', color, type)
}
// 设置车身材质
const materials = [
  { text: '磨砂', value: 1 },
  { text: '冰晶', value: 0 },
]
const changeMaterials = (roughness) => {
  emit('changeMaterials', roughness)
}
// 设置挡风玻璃材质
const glasses = [
  { text: '普通', value: 0.95 },
  { text: '透亮', value: 1 },
]
const changeGlasses = (transmission) => {
  emit('changeGlasses', transmission)
}
</script>

<style scoped>
.home-content {
  position: fixed;
  top: 0;
  right: 20px;
}

.select-item-color {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin: 10px;
  display: inline-block;
  cursor: pointer;
}

.select-item-btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin: 10px;
  cursor: pointer;
}

.select {
  display: flex;
  flex-wrap: wrap;
  width: 280px;
}
</style>