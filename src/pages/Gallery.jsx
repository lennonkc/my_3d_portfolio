import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'

const GOLDENRATIO = 1.61803398875

export const Gallery = ({ images }) => (
  <div className="gallery-wrapper"> 
  <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
    <color attach="background" args={['#dcdce0']} />  //白色背景
    <fog attach="fog" args={['#dcdce0', 0, 15]} />   //白色雾效果
    <group position={[0, -0.5, 0]}>
      <Frames images={images} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh>
    </group>
    <Environment preset="city" />
  </Canvas>
  </div>
)

function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/gallery/:id')
  const [, setLocation] = useLocation()
  const [screenWidth, setScreenWidth] = useState(window.innerWidth) //适配屏幕宽度

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.50))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
        // 🔹 根据屏幕宽度调整相机默认位置
        if (screenWidth < 768) { // 适配小屏幕
          p.set(0, 0, 7.0) // 适当拉远
        } else if (screenWidth < 1024) {
          p.set(0, 0.2, 5.5) // 平板稍微近一些
        } else {
          p.set(0, 0.2, 5.0) // 适配大屏幕
        }
        q.identity()
      }
  })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })
  return (
    <group
      ref={ref}
      onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/gallery/' + e.object.name))}
      onPointerMissed={() => setLocation('/')}>
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef()
  const frame = useRef()
  const [, params] = useRoute('/gallery/:id')
  const [hovered, hover] = useState(false)
  const [, setLocation] = useLocation();
  const [rnd] = useState(() => Math.random())
  const name = props.idname
  const isActive = params?.id === name

  useCursor(hovered)

  useFrame((state, dt) => {
    // 当 isActive 为 true => 显示 GIF => 不执行放大/悬停动画
    if (isActive) {
      // 强制 scale 和颜色复位，不要动态
      image.current.scale.set(0.85, 0.9, 0.9);
      frame.current.material.color.set('white'); 
      // 也可以设定 frame.current.material.color.set('#151515')，看你想不想让相框也恢复别的颜色
      
    } else {
      // 原本的动态特效
      const time = state.clock.elapsedTime;
      const hue = 0.55 + 0.02 * Math.sin(time);
      const lightness = 0.5 + 0.02 * Math.sin(time);
      const flowingBlue = new THREE.Color().setHSL(hue, 1, lightness);

      // 放大缩小
      image.current.material.zoom = Math.min(
        1.5 + Math.sin(rnd * 10000 + time / 5) / 2,
        1.8
      );
      // 当 hovered 时缩小一点点
      easing.damp3(
        image.current.scale,
        [0.85 * (hovered ? 0.85 : 1), 0.9 * (hovered ? 0.905 : 1), 1],
        0.1,
        dt
      );
      // 边框颜色
      easing.dampC(
        frame.current.material.color,
        hovered ? flowingBlue : new THREE.Color('white'),
        0.1,
        dt
      );
    }
  });

  // 点击相框/图片 => 如果是激活状态 => 回 '/', 否则 => '/item/:id'
  const handleClick = (e) => {
    e.stopPropagation(); // 不让事件冒泡到父 group
    setLocation(isActive ? '/' : `/gallery/${props.idname}`);
  };

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
          {/* 🔹 关键改动：根据 isActive 切换 url */}
          <Image
          onClick={handleClick}
          ref={image}
          scale={[1, 1.6, 1]}
          position={[0, 0, 0.7]}
          url={isActive ? props.idurl : url}
        />
      </mesh>

      {isActive && (<Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} 
      fontSize={0.025} color="black"
      outlineWidth={0.002}  // 加一点外轮廓增强对比度
      outlineColor="white">
        {props.title}{/* {name.split('-').join(' ')} */}
      </Text>)}
    </group>
  )
}
