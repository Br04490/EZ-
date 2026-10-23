import * as THREE from 'three';

/**
 * Procedural 3D Character Rigging & Models for Ezra & Lennox
 * Built with Three.js composite hierarchical groups according to strict identity lock.
 */

// Helper to create rounded rectangular canvas texture for jerseys
function createJerseyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base white jersey
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);

  // Blue collar & arm trim
  ctx.fillStyle = '#117dc4';
  ctx.fillRect(0, 0, 512, 40);
  ctx.fillStyle = '#fbc548';
  ctx.fillRect(0, 40, 512, 16);

  // ROLLINS arched text
  ctx.fillStyle = '#117dc4';
  ctx.font = '900 58px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ROLLINS', 256, 170);

  // Number 4 with gold outline
  ctx.font = '900 190px Arial, sans-serif';
  ctx.strokeStyle = '#fbc548';
  ctx.lineWidth = 18;
  ctx.strokeText('4', 256, 320);
  ctx.fillText('4', 256, 320);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLennoxShirtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Charcoal shirt
  ctx.fillStyle = '#333338';
  ctx.fillRect(0, 0, 512, 512);

  // Yellow logo text
  ctx.fillStyle = '#ffd570';
  ctx.font = '900 44px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LENNOX DIANN', 256, 190);
  ctx.fillText('ROLLINS', 256, 310);

  // Three colorful circles
  ctx.beginPath();
  ctx.arc(210, 250, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#fa9956';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(256, 250, 28, 0, Math.PI * 2);
  ctx.fillStyle = '#9cd4ff';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(302, 250, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#ffcf56';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createBasketballTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Orange pebbled base
  ctx.fillStyle = '#ea6a1b';
  ctx.fillRect(0, 0, 512, 256);

  // Black seam lines
  ctx.strokeStyle = '#2d1607';
  ctx.lineWidth = 12;

  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(0, 128);
  ctx.lineTo(512, 128);
  ctx.stroke();

  // Vertical lines
  ctx.beginPath();
  ctx.moveTo(128, 0);
  ctx.lineTo(128, 256);
  ctx.moveTo(384, 0);
  ctx.lineTo(384, 256);
  ctx.stroke();

  // Arched ribs
  ctx.beginPath();
  ctx.ellipse(256, 128, 90, 110, 0, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export interface EzraRig {
  root: THREE.Group;
  head: THREE.Group;
  torso: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  ball: THREE.Mesh;
  mouth: THREE.Mesh;
  eyes: THREE.Group;
}

export function createEzraModel(): EzraRig {
  const root = new THREE.Group();
  root.name = 'Ezra';

  // Materials
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0x9e5b38,
    roughness: 0.6,
    metalness: 0.05,
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x221815,
    roughness: 0.9,
    metalness: 0.0,
  });

  const jerseyTex = createJerseyTexture();
  const jerseyMaterial = new THREE.MeshStandardMaterial({
    map: jerseyTex,
    roughness: 0.5,
    metalness: 0.05,
  });

  const shortsMaterial = new THREE.MeshStandardMaterial({
    color: 0x1d75d2,
    roughness: 0.55,
    metalness: 0.05,
  });

  const shoeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f9ff,
    roughness: 0.4,
    metalness: 0.1,
  });

  const shoeTrim = new THREE.MeshStandardMaterial({
    color: 0x1767b6,
    roughness: 0.35,
    metalness: 0.2,
  });

  // Pelvis / Center
  const pelvis = new THREE.Group();
  pelvis.position.y = 1.05;
  root.add(pelvis);

  // Shorts
  const shortsGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.45, 16);
  const shorts = new THREE.Mesh(shortsGeo, shortsMaterial);
  shorts.position.y = 0;
  pelvis.add(shorts);

  // Torso
  const torsoGeo = new THREE.CylinderGeometry(0.36, 0.34, 0.62, 16);
  const torso = new THREE.Mesh(torsoGeo, jerseyMaterial);
  torso.position.y = 0.52;
  pelvis.add(torso);

  // Head Group (pivot at neck)
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.96;
  pelvis.add(headGroup);

  // Head Sphere (toddler shape, slightly wider cheeks)
  const headGeo = new THREE.SphereGeometry(0.36, 24, 24);
  headGeo.scale(1.0, 1.08, 0.96);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  headGroup.add(head);

  // Hair - Stylized toddler curls / fade cap
  const hairGeo = new THREE.SphereGeometry(0.38, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55);
  hairGeo.scale(1.02, 1.08, 0.98);
  const hair = new THREE.Mesh(hairGeo, hairMaterial);
  hair.position.y = 0.03;
  headGroup.add(hair);

  // Hair bun / afro texture details
  for (let i = 0; i < 18; i++) {
    const curlGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const curl = new THREE.Mesh(curlGeo, hairMaterial);
    const phi = Math.random() * Math.PI * 0.45;
    const theta = Math.random() * Math.PI * 2;
    curl.position.setFromSphericalCoords(0.38, phi, theta);
    headGroup.add(curl);
  }

  // Ears
  const earGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12);
  const leftEar = new THREE.Mesh(earGeo, skinMaterial);
  leftEar.rotation.z = Math.PI / 2;
  leftEar.position.set(0.36, 0, 0);
  headGroup.add(leftEar);

  const rightEar = leftEar.clone();
  rightEar.position.set(-0.36, 0, 0);
  headGroup.add(rightEar);

  // Eyes Group
  const eyesGroup = new THREE.Group();
  eyesGroup.position.set(0, 0.04, 0.32);
  headGroup.add(eyesGroup);

  const eyeGeo = new THREE.SphereGeometry(0.055, 12, 12);
  eyeGeo.scale(1, 1.3, 0.6);
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x1f1615 });

  const leftEyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMat);
  leftEyeWhite.position.x = 0.13;
  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), pupilMat);
  leftPupil.position.set(0.13, 0, 0.03);
  eyesGroup.add(leftEyeWhite, leftPupil);

  const rightEyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMat);
  rightEyeWhite.position.x = -0.13;
  const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), pupilMat);
  rightPupil.position.set(-0.13, 0, 0.03);
  eyesGroup.add(rightEyeWhite, rightPupil);

  // Cute toddler button nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), skinMaterial);
  nose.position.set(0, -0.05, 0.35);
  headGroup.add(nose);

  // Mouth (curved smiling capsule)
  const mouthGeo = new THREE.TorusGeometry(0.065, 0.02, 8, 12, Math.PI);
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x5a2417 });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.position.set(0, -0.16, 0.32);
  mouth.rotation.x = Math.PI * 0.15;
  headGroup.add(mouth);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.42, 12);

  // Left Arm (pivot at shoulder)
  const leftArm = new THREE.Group();
  leftArm.position.set(0.42, 0.72, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, skinMaterial);
  leftArmMesh.position.y = -0.21;
  leftArm.add(leftArmMesh);
  pelvis.add(leftArm);

  // Right Arm
  const rightArm = new THREE.Group();
  rightArm.position.set(-0.42, 0.72, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, skinMaterial);
  rightArmMesh.position.y = -0.21;
  rightArm.add(rightArmMesh);
  pelvis.add(rightArm);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.55, 12);

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(0.18, -0.25, 0);
  const leftLegMesh = new THREE.Mesh(legGeo, skinMaterial);
  leftLegMesh.position.y = -0.28;
  leftLeg.add(leftLegMesh);

  // Left Shoe
  const shoeGeo = new THREE.BoxGeometry(0.18, 0.16, 0.34);
  const leftShoe = new THREE.Mesh(shoeGeo, shoeMaterial);
  leftShoe.position.set(0, -0.58, 0.06);
  leftLeg.add(leftShoe);

  const leftTrimMesh = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.04, 0.35), shoeTrim);
  leftTrimMesh.position.set(0, -0.63, 0.06);
  leftLeg.add(leftTrimMesh);
  pelvis.add(leftLeg);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(-0.18, -0.25, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, skinMaterial);
  rightLegMesh.position.y = -0.28;
  rightLeg.add(rightLegMesh);

  // Right Shoe
  const rightShoe = leftShoe.clone();
  rightShoe.position.set(0, -0.58, 0.06);
  rightLeg.add(rightShoe);

  const rightTrimMesh = leftTrimMesh.clone();
  rightTrimMesh.position.set(0, -0.63, 0.06);
  rightLeg.add(rightTrimMesh);
  pelvis.add(rightLeg);

  // Basketball
  const ballGeo = new THREE.SphereGeometry(0.24, 24, 24);
  const ballMat = new THREE.MeshStandardMaterial({
    map: createBasketballTexture(),
    roughness: 0.45,
    metalness: 0.05,
  });
  const ball = new THREE.Mesh(ballGeo, ballMat);
  ball.position.set(0, 0.5, 0.48);
  pelvis.add(ball);

  return {
    root,
    head: headGroup,
    torso,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    ball,
    mouth,
    eyes: eyesGroup,
  };
}

export interface LennoxRig {
  root: THREE.Group;
  head: THREE.Group;
  braids: THREE.Group;
  torso: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  mouth: THREE.Mesh;
  mic: THREE.Group;
  bicycle: THREE.Group;
  frontWheel: THREE.Mesh;
  rearWheel: THREE.Mesh;
  pedals: THREE.Group;
}

export function createLennoxModel(): LennoxRig {
  const root = new THREE.Group();
  root.name = 'Lennox';

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0x965437,
    roughness: 0.6,
    metalness: 0.05,
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x241a15,
    roughness: 0.85,
    metalness: 0.0,
  });

  const shirtMat = new THREE.MeshStandardMaterial({
    map: createLennoxShirtTexture(),
    roughness: 0.55,
    metalness: 0.05,
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x2a3138,
    roughness: 0.7,
    metalness: 0.05,
  });

  // Older sister proportions (taller, longer limbs, 8 years old)
  const pelvis = new THREE.Group();
  pelvis.position.y = 1.35;
  root.add(pelvis);

  // Torso
  const torsoGeo = new THREE.CylinderGeometry(0.34, 0.32, 0.76, 16);
  const torso = new THREE.Mesh(torsoGeo, shirtMat);
  torso.position.y = 0.48;
  pelvis.add(torso);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.05;
  pelvis.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.34, 24, 24);
  headGeo.scale(0.96, 1.15, 0.98);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  headGroup.add(head);

  // Braided Hair - signature long braids
  const braidsGroup = new THREE.Group();
  headGroup.add(braidsGroup);

  const hairCapGeo = new THREE.SphereGeometry(0.36, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.52);
  const hairCap = new THREE.Mesh(hairCapGeo, hairMaterial);
  hairCap.position.y = 0.04;
  braidsGroup.add(hairCap);

  // Hanging braids down the shoulders
  const braidPoints = [
    { x: 0.28, z: 0.05 },
    { x: 0.24, z: -0.1 },
    { x: -0.28, z: 0.05 },
    { x: -0.24, z: -0.1 },
    { x: 0.16, z: 0.24 },
    { x: -0.16, z: 0.24 },
  ];

  braidPoints.forEach((pt) => {
    const braidCurve = new THREE.CylinderGeometry(0.04, 0.025, 0.75, 8);
    const braidMesh = new THREE.Mesh(braidCurve, hairMaterial);
    braidMesh.position.set(pt.x, -0.32, pt.z);
    braidsGroup.add(braidMesh);
  });

  // Eyes (expressive big eyes)
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x331e18 });

  const eyeGeo = new THREE.SphereGeometry(0.065, 12, 12);
  eyeGeo.scale(1, 1.25, 0.5);

  const leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
  leftEye.position.set(0.14, 0.05, 0.32);
  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), pupilMat);
  leftPupil.position.set(0.14, 0.05, 0.355);
  headGroup.add(leftEye, leftPupil);

  const rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
  rightEye.position.set(-0.14, 0.05, 0.32);
  const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), pupilMat);
  rightPupil.position.set(-0.14, 0.05, 0.355);
  headGroup.add(rightEye, rightPupil);

  // Big confident smile
  const mouthGeo = new THREE.TorusGeometry(0.08, 0.022, 8, 14, Math.PI);
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x6e2b1e });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.position.set(0, -0.16, 0.32);
  mouth.rotation.x = Math.PI * 0.18;
  headGroup.add(mouth);

  // Left Arm holding Microphone
  const leftArm = new THREE.Group();
  leftArm.position.set(0.42, 0.76, 0);
  const armGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.52, 12);
  const leftArmMesh = new THREE.Mesh(armGeo, skinMaterial);
  leftArmMesh.position.y = -0.26;
  leftArm.add(leftArmMesh);

  // Microphone (Gold + Blue)
  const micGroup = new THREE.Group();
  micGroup.position.set(0, -0.5, 0.15);
  const micHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.025, 0.28, 12),
    new THREE.MeshStandardMaterial({ color: 0x127ce6, roughness: 0.3, metalness: 0.7 })
  );
  const micHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xffca28, roughness: 0.2, metalness: 0.85 })
  );
  micHead.position.y = 0.14;
  micGroup.add(micHandle, micHead);
  micGroup.rotation.x = Math.PI * 0.25;
  leftArm.add(micGroup);
  pelvis.add(leftArm);

  // Right Arm (free / gesturing)
  const rightArm = new THREE.Group();
  rightArm.position.set(-0.42, 0.76, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, skinMaterial);
  rightArmMesh.position.y = -0.26;
  rightArm.add(rightArmMesh);
  pelvis.add(rightArm);

  // Legs (Pants)
  const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.82, 12);
  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.position.set(0.18, -0.48, 0);
  pelvis.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.position.set(-0.18, -0.48, 0);
  pelvis.add(rightLeg);

  // Sneakers (Red, white, black)
  const sneakerMat = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.4 });
  const sneakerGeo = new THREE.BoxGeometry(0.19, 0.15, 0.38);

  const leftShoe = new THREE.Mesh(sneakerGeo, sneakerMat);
  leftShoe.position.set(0.18, -0.92, 0.08);
  pelvis.add(leftShoe);

  const rightShoe = leftShoe.clone();
  rightShoe.position.set(-0.18, -0.92, 0.08);
  pelvis.add(rightShoe);

  // Bicycle Model (Red frame, blue rims, silver spokes)
  const bikeGroup = new THREE.Group();
  bikeGroup.position.set(0, -0.3, -0.45);

  const wheelGeo = new THREE.TorusGeometry(0.44, 0.05, 12, 24);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x18243b, roughness: 0.8 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xeb3b30, roughness: 0.3, metalness: 0.4 });

  const rearWheel = new THREE.Mesh(wheelGeo, tireMat);
  rearWheel.position.set(0, 0, -0.6);
  rearWheel.rotation.y = Math.PI / 2;

  const frontWheel = new THREE.Mesh(wheelGeo, tireMat);
  frontWheel.position.set(0, 0, 0.6);
  frontWheel.rotation.y = Math.PI / 2;

  bikeGroup.add(rearWheel, frontWheel);

  // Bike Frame tubes
  const frameTube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.1, 8), frameMat);
  frameTube.position.set(0, 0.3, 0);
  frameTube.rotation.x = Math.PI / 2;
  bikeGroup.add(frameTube);

  // Pedals
  const pedalsGroup = new THREE.Group();
  pedalsGroup.position.set(0, 0, 0);
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), frameMat);
  pedalsGroup.add(crank);
  bikeGroup.add(pedalsGroup);

  pelvis.add(bikeGroup);

  return {
    root,
    head: headGroup,
    braids: braidsGroup,
    torso,
    leftArm,
    rightArm,
    mouth,
    mic: micGroup,
    bicycle: bikeGroup,
    frontWheel,
    rearWheel,
    pedals: pedalsGroup,
  };
}

// Ezra Animation Driver
export function updateEzraPose(
  rig: EzraRig,
  mode: 'idle' | 'prepare' | 'shoot' | 'celebrate' | 'miss',
  time: number
) {
  const breath = Math.sin(time * 2.5) * 0.03;
  const bounce = Math.abs(Math.sin(time * 3)) * 0.02;

  if (mode === 'idle') {
    rig.torso.position.y = 0.52 + breath;
    rig.head.rotation.y = Math.sin(time * 0.8) * 0.15;
    rig.head.rotation.x = breath * 0.5;

    // Small arm sway
    rig.leftArm.rotation.z = 0.35 + Math.sin(time * 1.5) * 0.05;
    rig.rightArm.rotation.z = -0.35 - Math.sin(time * 1.5) * 0.05;
    rig.ball.position.set(0, 0.5 + breath, 0.48);
    rig.ball.rotation.y = time * 0.5;

    rig.mouth.scale.set(1, 1, 1);
  } else if (mode === 'prepare') {
    // Crouch down slightly, bring ball up
    rig.torso.position.y = 0.42;
    rig.leftLeg.rotation.x = -0.25;
    rig.rightLeg.rotation.x = -0.25;

    rig.leftArm.rotation.x = -Math.PI * 0.45;
    rig.rightArm.rotation.x = -Math.PI * 0.45;
    rig.leftArm.rotation.z = 0.2;
    rig.rightArm.rotation.z = -0.2;

    rig.ball.position.set(0, 0.82, 0.4);
    rig.head.rotation.x = -0.25; // looking up at rim
  } else if (mode === 'shoot') {
    // Upward extension, follow-through
    rig.torso.position.y = 0.65;
    rig.leftLeg.rotation.x = 0.1;
    rig.rightLeg.rotation.x = 0.1;

    rig.leftArm.rotation.x = -Math.PI * 0.85;
    rig.rightArm.rotation.x = -Math.PI * 0.85;
    rig.leftArm.rotation.z = 0.15;
    rig.rightArm.rotation.z = -0.15;

    // Ball released into flight
    const shootT = (time * 2) % 1;
    rig.ball.position.set(0, 0.9 + shootT * 1.8, 0.4 + shootT * 2.2);
    rig.ball.rotation.x = shootT * Math.PI * 6;
  } else if (mode === 'celebrate') {
    // Big happy celebration jump, hands raised high
    const jump = Math.abs(Math.sin(time * 7)) * 0.25;
    rig.root.position.y = jump;

    rig.head.rotation.y = Math.sin(time * 4) * 0.2;
    rig.head.rotation.x = -0.15;

    rig.leftArm.rotation.z = 1.4 + Math.sin(time * 6) * 0.2;
    rig.rightArm.rotation.z = -1.4 - Math.sin(time * 6) * 0.2;
    rig.leftArm.rotation.x = 0.3;
    rig.rightArm.rotation.x = 0.3;

    // Big happy mouth
    rig.mouth.scale.set(1.4, 1.5, 1);
    rig.ball.position.set(0, 0.4, 0.5);
  } else if (mode === 'miss') {
    // Little cute shrug
    rig.root.position.y = 0;
    rig.head.rotation.z = Math.sin(time * 2) * 0.15;
    rig.head.rotation.x = 0.15;

    rig.leftArm.rotation.z = 0.8;
    rig.rightArm.rotation.z = -0.8;
    rig.leftArm.rotation.x = 0.4;
    rig.rightArm.rotation.x = 0.4;

    rig.ball.position.set(0, 0.35, 0.45);
    rig.mouth.scale.set(0.8, 0.7, 1);
  }
}

// Lennox Animation Driver
export function updateLennoxPose(
  rig: LennoxRig,
  mode: 'idle' | 'commentary' | 'cheer' | 'bicycle',
  time: number
) {
  const breath = Math.sin(time * 2.2) * 0.025;

  if (mode === 'idle') {
    rig.torso.position.y = 0.48 + breath;
    rig.head.rotation.y = Math.sin(time * 0.7) * 0.15;

    // Mic held naturally near chest
    rig.leftArm.rotation.x = -0.4;
    rig.leftArm.rotation.z = 0.2;
    rig.rightArm.rotation.z = -0.2 + Math.sin(time * 1.5) * 0.05;

    rig.mouth.scale.set(1, 1, 1);
    rig.bicycle.position.set(0, -0.3, -0.45);
  } else if (mode === 'commentary') {
    // Talking into mic
    rig.torso.position.y = 0.48 + breath;
    rig.head.rotation.y = Math.sin(time * 3) * 0.1;

    // Raise mic right to mouth
    rig.leftArm.rotation.x = -Math.PI * 0.55;
    rig.leftArm.rotation.z = 0.35;

    // Gesturing with right hand
    rig.rightArm.rotation.x = -0.4 + Math.sin(time * 4) * 0.3;
    rig.rightArm.rotation.z = -0.45 + Math.cos(time * 4) * 0.2;

    // Talking mouth shapes
    const talk = (Math.sin(time * 14) + 1) * 0.5;
    rig.mouth.scale.set(1.2, 0.6 + talk * 1.2, 1);
  } else if (mode === 'cheer') {
    // Cheering older sister
    rig.head.rotation.y = Math.sin(time * 5) * 0.2;
    rig.head.rotation.x = -0.2;

    rig.leftArm.rotation.x = -Math.PI * 0.7;
    rig.rightArm.rotation.z = -1.2 + Math.sin(time * 6) * 0.25;

    rig.mouth.scale.set(1.4, 1.4, 1);
  } else if (mode === 'bicycle') {
    // Riding bicycle!
    const rideSpeed = time * 6;
    rig.frontWheel.rotation.x = rideSpeed;
    rig.rearWheel.rotation.x = rideSpeed;
    rig.pedals.rotation.x = rideSpeed;

    // Subtle steering
    rig.head.rotation.y = Math.sin(time * 1.5) * 0.2;
    rig.bicycle.rotation.y = Math.sin(time * 1.5) * 0.15;
    rig.torso.rotation.x = 0.18; // leaning forward on bike
  }
}
