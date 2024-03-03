<template>
    <div class="back-ground" ref="back">
    </div>
</template>

<script setup>
import * as THREE from 'three'
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AmbientLight } from 'three/src/lights/AmbientLight.js';
import { DirectionalLight } from 'three/src/lights/DirectionalLight.js';
import { ref, onMounted, reactive, onUnmounted } from 'vue';

// 获取DOM元素
const back = ref(null)

// 配置UI
// const gui = new dat.GUI();

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 设置相机位置和目标
camera.position.set(0,5,5);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
// renderer.setClearColor(new THREE.Color('#a2593a'),0.1) 

// 环境光
const ambientlight = new AmbientLight(0xffffff, 1);
scene.add(ambientlight);

//定向光
const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);


//轨道控制器
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

//随机颜色
const getRandomHexColor = () => {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return new THREE.Color(color);
}

//粒子配置
const parameters = {
    count: 10000,
    size: 0.02,
    radius: 5,
    branches: 3,
    spin: 3,
    randomness: 0.2,
    randomnessPower: 2,
}
let points = []
const generateGalaxy = () => {

    // 创建几何体
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = getRandomHexColor();
    const colorOutside = getRandomHexColor();

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        //位置
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = 0 + randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        //颜色
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    // 位置信息
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );
    // 颜色信息
    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    );

    //材质
    const material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    //创建粒子
    const point = new THREE.Points(geometry, material);
    point.scale.set(Math.random() * 5 + 1, Math.random() * 5 + 1, Math.random() * 5 + 1);
    point.position.set(Math.random() * 100 - 50, Math.random() * 25 - 25, Math.random() * 25 - 25);
    point.rotation.set(Math.random() * 1, Math.random() * 1, 0);
    return point;
}
for (let i = 0; i < 30; i++) {
    points.push(generateGalaxy());
}
scene.add(...points);
// gui.add(parameters, 'count').min(5000).max(20000).step(100).onFinishChange(generateGalaxy);
// gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
// gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
// gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
// gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
// gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
// gui.add(parameters, 'randomnessPower').min(0).max(10).step(0.001).onFinishChange(generateGalaxy);

// 动画
let animationId; // 存储动画帧标识符
const animate = () => {
    animationId = requestAnimationFrame(animate);
    // 计算相机的新旋转角度
    const speed = 0.1; // 旋转速度
    camera.lookAt(scene.position);
    points.forEach((point) => {
        point.rotation.x += speed * 0.001;
        point.rotation.y += speed * 0.001;
        point.rotation.z += speed * 0.001;
    })
    // controls.update();
    // 渲染场景
    renderer.render(scene, camera);
}

// 重新渲染
const screenRender = () => {
    renderer.setSize(window.innerWidth, window.innerHeight - 1);
    renderer.render(scene, camera)
}

onMounted(() => {
    back.value.appendChild(renderer.domElement);
    screenRender()
    animate()
    window.addEventListener('resize', screenRender)
})

onUnmounted(()=>{
    window.removeEventListener('resize', screenRender)
    cancelAnimationFrame(animationId)
})

</script>

<style scoped lang='scss'>
.back-ground {
    overflow: hidden;
}
</style>