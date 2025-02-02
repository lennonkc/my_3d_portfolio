/**
 * IMPORTANT: Loading glTF models into a Three.js scene is a lot of work.
 * Before we can configure or animate our model’s meshes, we need to iterate through
 * each part of our model’s meshes and save them separately.
 *
 * But luckily there is an app that turns gltf or glb files into jsx components
 * For this model, visit https://gltf.pmnd.rs/
 * And get the code. And then add the rest of the things.
 * YOU DON'T HAVE TO WRITE EVERYTHING FROM SCRATCH
 */

import { a } from "@react-spring/three";
import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import islandScene from "../assets/3d/building.glb";

export function Island({
  isRotating,
  setIsRotating,
  setCurrentStage,
  currentFocusPoint,
  ...props
}) {
  const islandRef = useRef();
  // Get access to the Three.js renderer and viewport
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  // Use a ref for the last mouse x position
  const lastX = useRef(0);
  // Use a ref for rotation speed
  const rotationSpeed = useRef(0);
  // Define a damping factor to control rotation damping
  const dampingFactor = 0.95;

  // Handle pointer (mouse or touch) down event
  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    // Store the current clientX position for reference
    lastX.current = clientX;
  };

  // Handle pointer (mouse or touch) up event
  const handlePointerUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  // Handle pointer (mouse or touch) move event
  const handlePointerMove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isRotating) {
      // If rotation is enabled, calculate the change in clientX position
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      const delta = (clientX - lastX.current) / viewport.width;

      // Update the island's rotation based on the mouse/touch movement
      islandRef.current.rotation.y += delta * 0.01 * Math.PI;

      // Update the reference for the last clientX position
      lastX.current = clientX;

      // Update the rotation speed
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  // Touch events for mobile devices
  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
  
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  }
  
  const handleTouchEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  }
  
  const handleTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
  
    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;
  
      islandRef.current.rotation.y += delta * 0.01 * Math.PI;
      lastX.current = clientX;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  }

  useEffect(() => {
    // Add event listeners for pointer and keyboard events
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);

    // Remove event listeners when component unmounts
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

  // This function is called on each frame update
  useFrame(() => {
    // If not rotating, apply damping to slow down the rotation (smoothly)
    if (!isRotating) {
      // Apply damping factor
      rotationSpeed.current *= dampingFactor;

      // Stop rotation when speed is very small
      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }

      islandRef.current.rotation.y += rotationSpeed.current;
    } else {
      // When rotating, determine the current stage based on island's orientation
      const rotation = islandRef.current.rotation.y;

      /**
       * Normalize the rotation value to ensure it stays within the range [0, 2 * Math.PI].
       * The goal is to ensure that the rotation value remains within a specific range to
       * prevent potential issues with very large or negative rotation values.
       *  Here's a step-by-step explanation of what this code does:
       *  1. rotation % (2 * Math.PI) calculates the remainder of the rotation value when divided
       *     by 2 * Math.PI. This essentially wraps the rotation value around once it reaches a
       *     full circle (360 degrees) so that it stays within the range of 0 to 2 * Math.PI.
       *  2. (rotation % (2 * Math.PI)) + 2 * Math.PI adds 2 * Math.PI to the result from step 1.
       *     This is done to ensure that the value remains positive and within the range of
       *     0 to 2 * Math.PI even if it was negative after the modulo operation in step 1.
       *  3. Finally, ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) applies another
       *     modulo operation to the value obtained in step 2. This step guarantees that the value
       *     always stays within the range of 0 to 2 * Math.PI, which is equivalent to a full
       *     circle in radians.
       */
      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          setCurrentStage(1);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.5:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage(2);
          break;
        default:
          setCurrentStage(null);
      }
    }
  });

  return (
    // {Island 3D model from: https://sketchfab.com/3d-models/foxs-islands-163b68e09fcc47618450150be7785907}
    <a.group ref={islandRef} {...props}>
        <group position={[0, -0.06, 0]} scale={0.5}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_41.geometry}
          material={materials['Material 12113']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_42.geometry}
          material={materials.Standard_1_003}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_43.geometry}
          material={materials['mat_05 - Default_016']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_44.geometry}
          material={materials['mat_01 - Default_004']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_45.geometry}
          material={materials['mat_04- Default']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_46.geometry}
          material={materials['mat_02 - Default_003']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_47.geometry}
          material={materials['mat_03 - DefaultEE']}
        />
      </group>
      <group position={[0, -0.06, 0]} scale={0.5}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_49.geometry}
          material={materials.Standard_1_003}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_50.geometry}
          material={materials['Material 12117_004']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_51.geometry}
          material={materials['Material 40']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_52.geometry}
          material={materials['Material 12107_008']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_53.geometry}
          material={materials['Material 95_004']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_54.geometry}
          material={materials['Material 10']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_55.geometry}
          material={materials['Material 9_001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_56.geometry}
          material={materials['Material 8_001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_57.geometry}
          material={materials['Material 7']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_58.geometry}
          material={materials['mat_04 - Default_006']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_59.geometry}
          material={materials['Material 3_007']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_60.geometry}
          material={materials['Material 12115_007']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_61.geometry}
          material={materials['Material 12114_002']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_62.geometry}
          material={materials['Material 3_010']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_63.geometry}
          material={materials['Material 96_002']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_64.geometry}
          material={materials['Material 7400']}
        />
      </group>
      <group position={[-1.358, -0.11, 2.099]} rotation={[Math.PI, -1.355, Math.PI]} scale={1.266}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[2.287, 0.142, 1.488]} rotation={[Math.PI, -1.538, Math.PI]} scale={0.767}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[3.17, 0.045, -1.999]} rotation={[Math.PI, -1.355, Math.PI]} scale={1.617}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[1.873, 0.007, -2.124]} rotation={[Math.PI, -1.355, Math.PI]} scale={1.369}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[1.317, 0.011, 3.272]} rotation={[Math.PI, -1.355, Math.PI]} scale={0.866}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[-2.031, -0.018, 2.69]} rotation={[0, -1.464, 0]} scale={1.122}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[2.604, -0.058, 2.631]} rotation={[0, -1.28, 0]} scale={1.186}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[-3.353, -0.106, 0.919]} scale={1.686}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[-2.617, -0.061, 2.303]} rotation={[Math.PI, -0.967, Math.PI]} scale={1.152}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[3.314, -0.375, -0.446]} rotation={[Math.PI, -0.741, Math.PI]} scale={0.795}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[1.483, 0.058, 2.251]} rotation={[Math.PI, -1.538, Math.PI]} scale={0.767}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <group position={[2.259, -0.159, -0.271]} scale={1.337}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_1.geometry}
          material={materials['green tree']}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock012.geometry}
        material={nodes.Rock012.material}
        position={[2.762, -0.239, -2.383]}
        rotation={[1.803, 1.471, -1.858]}
        scale={0.887}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock011.geometry}
        material={nodes.Rock011.material}
        position={[3.202, -0.36, -2.619]}
        rotation={[0.401, 0.314, -1.625]}
        scale={0.887}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock010.geometry}
        material={nodes.Rock010.material}
        position={[2.62, 0.346, -3.16]}
        rotation={[-2.708, -1.108, 0.157]}
        scale={1.207}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock009.geometry}
        material={nodes.Rock009.material}
        position={[-0.404, -0.72, -2.85]}
        rotation={[-0.174, 0.216, -0.365]}
        scale={1.513}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock008.geometry}
        material={nodes.Rock008.material}
        position={[0.43, -0.136, -2.896]}
        rotation={[-2.744, -0.631, 0.562]}
        scale={0.793}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock007.geometry}
        material={nodes.Rock007.material}
        position={[-1.006, -0.554, 3.266]}
        rotation={[-3.115, 0.553, -0.053]}
        scale={0.793}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock006.geometry}
        material={nodes.Rock006.material}
        position={[0.743, -0.908, 3.343]}
        rotation={[2.825, -0.282, 1.031]}
        scale={0.793}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock005.geometry}
        material={nodes.Rock005.material}
        position={[3.742, -0.908, -0.367]}
        rotation={[2.825, -0.282, 1.031]}
        scale={0.793}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock004.geometry}
        material={nodes.Rock004.material}
        position={[3.26, -0.541, 2.126]}
        rotation={[2.825, -0.282, 1.031]}
        scale={0.793}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock003.geometry}
        material={nodes.Rock003.material}
        position={[3.656, -0.649, 2.439]}
        rotation={[0.037, 0.669, 0.074]}
        scale={0.793}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock002.geometry}
        material={nodes.Rock002.material}
        position={[3.358, -0.649, 1.627]}
        rotation={[0.037, 0.669, 0.074]}
        scale={0.793}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock001.geometry}
        material={nodes.Rock001.material}
        position={[2.78, -0.269, 1.076]}
        rotation={[-2.744, -0.631, 0.562]}
        scale={0.793}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rock.geometry}
        material={nodes.Rock.material}
        position={[3.441, -0.756, 0.731]}
        rotation={[-0.102, 0.236, -0.354]}
        scale={1.207}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cloud002.geometry}
        material={materials.clouds}
        position={[5.381, 4.334, -3.492]}
        rotation={[1.728, 0, 0]}
        scale={0.846}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cloud001.geometry}
        material={materials.clouds}
        position={[-2.085, 4.895, -0.413]}
        scale={0.83}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cloud.geometry}
        material={materials.clouds}
        position={[3.565, 2.721, 2.5]}
        rotation={[-2.773, 0.077, 3.112]}
        scale={0.531}
      />
      <group position={[-1.822, -0.029, 3.32]} rotation={[Math.PI, -1.031, Math.PI]} scale={1.123}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane010.geometry}
          material={materials['Wood-tree']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane010_1.geometry}
          material={materials.Tree}
        />
      </group>
      <group position={[2.109, 0.011, 3.713]} rotation={[-Math.PI, 0.283, -Math.PI]} scale={1.48}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane010.geometry}
          material={materials['Wood-tree']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane010_1.geometry}
          material={materials.Tree}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane069.geometry}
        material={materials['Ground-pasture']}
        position={[-0.004, -0.017, 0.043]}
        scale={[8, 1, 8]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder036.geometry}
        material={materials['Base-pasture']}
        position={[-0.01, -0.325, 0.012]}
        scale={[8, 1, 8]}
      />
      <group position={[0, -0.06, 0]} scale={0.5}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_66.geometry}
          material={materials['mat_05 - Default_018']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_67.geometry}
          material={materials.Standard_1_003}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_68.geometry}
          material={materials['Material 12124']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_69.geometry}
          material={materials['Material 12123']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_70.geometry}
          material={materials['Material 12121']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_71.geometry}
          material={materials['Material 12120']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_72.geometry}
          material={materials['Material 12119']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_73.geometry}
          material={materials['Material 98_005']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_74.geometry}
          material={materials['Material 12416']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_75.geometry}
          material={materials['Material 12116']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_76.geometry}
          material={materials['Material 12115_002']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_77.geometry}
          material={materials['Material 12114_004']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.gujian_78.geometry}
          material={materials['Material 12113']}
        />
      </group>
    </a.group>
  );
}
