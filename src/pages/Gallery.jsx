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
  const [isDirectAccess, setIsDirectAccess] = useState(true) // 新增：标记是否是直接访问

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // 如果是直接访问且有ID参数，重定向到/gallery
    if (isDirectAccess && params?.id) {
      setLocation('/gallery')
      return
    }

    // 设置为非直接访问，后续点击将正常工作
    if (isDirectAccess) {
      setIsDirectAccess(false)
    }

    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      if (screenWidth < 768) {
        clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 3.0)) // 小屏幕更远
      } else if (screenWidth < 1024) {
        clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 2.5)) // 中等屏幕
      } else {
        clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 2.0)) // 大屏幕
      }
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      // 🔹 根据屏幕宽度调整相机默认位置
      if (screenWidth < 768) { // 适配小屏幕
        p.set(0, 0.4, 8.2) // 适当拉远
      } else if (screenWidth < 1024) {
        p.set(0, 0.2, 6.5) // 平板稍微近一些
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
  const [rnd] = useState(() => Math.random())
  const name = props.idname
  const isActive = params?.id === name
  useCursor(hovered)
  useFrame((state, dt) => {
    const time = state.clock.elapsedTime;
    // 限制 hue (色相) 在 0.55 - 0.65 之间（蓝色范围）
    const hue = 0.55 + 0.02 * Math.sin(time * 1); // 0.05 控制流动幅度，2 控制速度
    // 让亮度（L）做微小变化，让渐变更自然
    const lightness = 0.5 + 0.02 * Math.sin(time * 1); // 让亮度在 0.4 - 0.6 之间波动
    // 生成动态蓝色
    const flowingBlue = new THREE.Color().setHSL(hue, 1, lightness); // 饱和度固定 1

    image.current.material.zoom = Math.min(1.4 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 5) * 0.2, 1.5);
    easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)
    easing.dampC(frame.current.material.color, hovered ? flowingBlue : new THREE.Color('white'), 0.1, dt);
  });
  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1.1, GOLDENRATIO, 0.05]} // 👈 这里控制了整体外框大小
        position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        //下面的scale调整相框内图片大小
        <Image raycast={() => null} ref={image} scale={[1, 1.5, 1]} position={[0, 0, 0.7]} url={url} />
      </mesh>
      {isActive && (
        <>
          {/* 文字 */}
          <Text
            maxWidth={0.5}
            anchorX="left"
            anchorY="top"
            position={[0.60, GOLDENRATIO, 0]}
            fontSize={0.025}
            color="black"
            outlineWidth={0.002}
            outlineColor="white"
          >
            {props.title+"\n"+props.introduce}
          </Text>

          {/* 3D 按钮 */}
          <group
            // 位置可自行调试，让它在 Image 底部
            position={[0, 0.04, 0.1]}
            onClick={(e) => {
              e.stopPropagation()
              console.log("Button clicked! Opening:", props.videoUrl)
              window.open(props.videoUrl, '_blank')
            }}
            onPointerOver={(e) => {
              document.body.style.cursor = 'pointer';
              e.object.material.color.set('#00a3fa'); // 🔹 悬停变浅蓝色
            }}
            onPointerOut={(e) => {
              document.body.style.cursor = 'default';
              e.object.material.color.set('white'); // 🔹 离开恢复深蓝色
            }}
          >
            {/* 按钮外观：一个 plane */}
            <mesh raycast={() => null}>
              <planeGeometry args={[0.4, 0.08]} />
              <meshStandardMaterial
                color="#e4e6e9" //
                transparent
                opacity={0.1} // ✅ 半透明
                roughness={0.3} // ✅ 轻微光泽
              />
            </mesh>

            {/* 按钮文字：和 plane 稍微错开 Z，避免重叠闪烁 */}
            <Text
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
              // position={[0, 0, 2]} // 往前 0.01
              fontSize={0.04}
              color="white"
              // outlineWidth={0.004} // ✅ 加白色轮廓
              // outlineColor="black" // ✅ 轮廓颜色
            >
                🎥 VIDEO
            </Text>
          </group>
        </>
      )}
    </group>
  )
}
