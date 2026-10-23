import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createEzraModel,
  createLennoxModel,
  updateEzraPose,
  updateLennoxPose,
  EzraRig,
  LennoxRig,
} from '../three/characterModels';

interface CharacterApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterApprovalModal: React.FC<CharacterApprovalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'ezra' | 'lennox' | 'report'>('ezra');
  const [ezraAnim, setEzraAnim] = useState<'idle' | 'prepare' | 'shoot' | 'celebrate' | 'miss'>('idle');
  const [lennoxAnim, setLennoxAnim] = useState<'idle' | 'commentary' | 'cheer' | 'bicycle'>('idle');
  const [cameraView, setCameraView] = useState<'full' | 'face'>('full');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ezraRigRef = useRef<EzraRig | null>(null);
  const lennoxRigRef = useRef<LennoxRig | null>(null);
  const animFrameRef = useRef<number>(0);

  // Initialize Three.js scene
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 360;
    const height = canvas.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x051b42);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 1.3, 3.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    // Lighting rig
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    keyLight.position.set(2, 4, 3);
    const fillLight = new THREE.HemisphereLight(0x4ca3fd, 0x1d3557, 1.4);
    const rimLight = new THREE.DirectionalLight(0xffdd44, 1.2);
    rimLight.position.set(-2, 2, -2);
    scene.add(keyLight, fillLight, rimLight);

    // Ground platform shadow
    const groundGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.08, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a2858,
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.04;
    scene.add(ground);

    // Create models
    const ezraRig = createEzraModel();
    const lennoxRig = createLennoxModel();

    scene.add(ezraRig.root);
    scene.add(lennoxRig.root);

    ezraRigRef.current = ezraRig;
    lennoxRigRef.current = lennoxRig;

    let startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      if (ezraRigRef.current) {
        updateEzraPose(ezraRigRef.current, ezraAnim, elapsed);
      }
      if (lennoxRigRef.current) {
        updateLennoxPose(lennoxRigRef.current, lennoxAnim, elapsed);
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      ezraRigRef.current = null;
      lennoxRigRef.current = null;
    };
  }, [isOpen]);

  // Handle Tab and Camera toggles
  useEffect(() => {
    if (!ezraRigRef.current || !lennoxRigRef.current || !cameraRef.current) return;

    if (activeTab === 'ezra') {
      ezraRigRef.current.root.visible = true;
      lennoxRigRef.current.root.visible = false;
      if (cameraView === 'full') {
        cameraRef.current.position.set(0, 1.25, 3.4);
        cameraRef.current.lookAt(0, 1.0, 0);
      } else {
        cameraRef.current.position.set(0, 1.9, 1.4);
        cameraRef.current.lookAt(0, 1.9, 0);
      }
    } else if (activeTab === 'lennox') {
      ezraRigRef.current.root.visible = false;
      lennoxRigRef.current.root.visible = true;
      if (cameraView === 'full') {
        cameraRef.current.position.set(0, 1.35, 4.0);
        cameraRef.current.lookAt(0, 1.1, 0);
      } else {
        cameraRef.current.position.set(0, 2.3, 1.5);
        cameraRef.current.lookAt(0, 2.3, 0);
      }
    }
  }, [activeTab, cameraView]);

  if (!isOpen) return null;

  return (
    <div className="modal-shade" style={{ zIndex: 100 }}>
      <div
        className="modal-card"
        style={{
          maxWidth: 510,
          maxHeight: '94vh',
          overflowY: 'auto',
          padding: '18px 16px',
          textAlign: 'left',
          background: 'linear-gradient(180deg, #0d3670 0%, #06183a 100%)',
          border: '3px solid #ffcc24',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 24, margin: 0, color: '#ffdc2e' }}>
              🔒 CHARACTER APPROVAL GATE
            </h2>
            <small style={{ color: '#b8dcff', fontSize: 11, fontWeight: 600 }}>
              Section 10 Review: 2D Original vs. Rigged 3D Fidelity
            </small>
          </div>
          <button
            type="button"
            className="back-btn"
            style={{ width: 34, height: 34, fontSize: 28 }}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: 6, margin: '14px 0 10px' }}>
          <button
            type="button"
            className={`arcade-btn ${activeTab === 'ezra' ? 'gold' : 'blue'}`}
            style={{ minHeight: 40, fontSize: 14, flex: 1 }}
            onClick={() => setActiveTab('ezra')}
          >
            👦 EZRA (3 YO)
          </button>
          <button
            type="button"
            className={`arcade-btn ${activeTab === 'lennox' ? 'gold' : 'blue'}`}
            style={{ minHeight: 40, fontSize: 14, flex: 1 }}
            onClick={() => setActiveTab('lennox')}
          >
            👧 LENNOX (8 YO)
          </button>
          <button
            type="button"
            className={`arcade-btn ${activeTab === 'report' ? 'gold' : 'purple'}`}
            style={{ minHeight: 40, fontSize: 14, flex: 1 }}
            onClick={() => setActiveTab('report')}
          >
            📋 REPORT
          </button>
        </div>

        {activeTab !== 'report' ? (
          <>
            {/* View Mode Switcher */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '6px 0',
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid #4db5ff',
                    background: cameraView === 'full' ? '#1767b6' : 'transparent',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                  onClick={() => setCameraView('full')}
                >
                  Full Body
                </button>
                <button
                  type="button"
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid #4db5ff',
                    background: cameraView === 'face' ? '#1767b6' : 'transparent',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                  onClick={() => setCameraView('face')}
                >
                  Face Close-Up
                </button>
              </div>

              <span
                style={{
                  background: '#ff444433',
                  border: '1px solid #ff4444',
                  color: '#ffaaaa',
                  fontSize: 10,
                  padding: '3px 7px',
                  borderRadius: 6,
                  fontWeight: 'bold',
                }}
              >
                Awaiting User Approval
              </span>
            </div>

            {/* Side-by-side Visual Comparison Canvas & Reference */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                background: '#030f28',
                padding: 8,
                borderRadius: 14,
                border: '2px solid #1f5ca6',
              }}
            >
              {/* Approved 2D Reference */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: '#041838',
                  borderRadius: 10,
                  padding: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: '#76d6ff',
                    marginBottom: 4,
                  }}
                >
                  ORIGINAL APPROVED 2D
                </span>
                <div
                  style={{
                    width: '100%',
                    height: 230,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={
                      activeTab === 'ezra'
                        ? '/assets/characters/ezra.svg'
                        : '/assets/characters/lennox.svg'
                    }
                    alt={activeTab}
                    style={{
                      maxHeight: '95%',
                      maxWidth: '95%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 8px #000)',
                    }}
                  />
                </div>
                <small style={{ color: '#a2c8f2', fontSize: 10, textAlign: 'center' }}>
                  {activeTab === 'ezra'
                    ? 'White Rollins #4 Jersey · 3 yo Proportions'
                    : 'Charcoal Tee · Signature Braids · Bike'}
                </small>
              </div>

              {/* Proposed 3D Rigged Model */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: '#041838',
                  borderRadius: 10,
                  padding: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: '#ffd024',
                    marginBottom: 4,
                  }}
                >
                  PROPOSED 3D RIGGED MODEL
                </span>
                <div style={{ width: '100%', height: 230, position: 'relative' }}>
                  <canvas
                    ref={canvasRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 8,
                      display: 'block',
                    }}
                  />
                </div>
                <small style={{ color: '#ffe668', fontSize: 10, textAlign: 'center' }}>
                  Real-time Three.js PBR · Skeletal Animation
                </small>
              </div>
            </div>

            {/* Animation Previews Controls */}
            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: '#fff',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Animation Previews:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {activeTab === 'ezra' ? (
                  <>
                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: ezraAnim === 'idle' ? '#ff9a00' : '#143e74',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                      onClick={() => setEzraAnim('idle')}
                    >
                      Idle Breathing
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: ezraAnim === 'prepare' ? '#ff9a00' : '#143e74',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                      onClick={() => setEzraAnim('prepare')}
                    >
                      Prepare Shot
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: ezraAnim === 'shoot' ? '#ff9a00' : '#143e74',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                      onClick={() => setEzraAnim('shoot')}
                    >
                      Shooting Arc
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: ezraAnim === 'celebrate' ? '#ff9a00' : '#143e74',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                      onClick={() => setEzraAnim('celebrate')}
                    >
                      Celebrate ("GREEN!")
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: ezraAnim === 'miss' ? '#ff9a00' : '#143e74',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                      onClick={() => setEzraAnim('miss')}
                    >
                      Miss Reaction
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: lennoxAnim === 'idle' ? '#ff9a00' : '#143e74',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                      onClick={() => setLennoxAnim('idle')}
                    >
                      Idle Courtside
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: lennoxAnim === 'commentary' ? '#ff9a00' : '#143e74',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                      onClick={() => setLennoxAnim('commentary')}
                    >
                      Commentary (Mic)
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: lennoxAnim === 'cheer' ? '#ff9a00' : '#143e74',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                      onClick={() => setLennoxAnim('cheer')}
                    >
                      Cheer
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: lennoxAnim === 'bicycle' ? '#ff9a00' : '#143e74',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                      onClick={() => setLennoxAnim('bicycle')}
                    >
                      Bicycle Riding
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Detailed Section 10 Fidelity Audit Report */
          <div
            style={{
              background: '#041838',
              padding: 12,
              borderRadius: 12,
              border: '1px solid #1a5296',
              fontSize: 12,
              lineHeight: 1.5,
              color: '#d4ebff',
            }}
          >
            <h3 style={{ margin: '0 0 6px', color: '#ffdc2e', fontSize: 15 }}>
              Section 10 Comparison & Fidelity Report
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>
                <b>Ezra (Age 3):</b> Stylized toddler head-to-body ratio (1:3.2), warm brown skin
                tone (<code style={{ color: '#ffd570' }}>#9e5b38</code>), white jersey with blue
                trim and gold outlined number 4, blue shorts, white sneakers. Shooting animation
                preserves release trajectory and celebration.
              </li>
              <li style={{ marginTop: 6 }}>
                <b>Lennox (Age 8):</b> Older sister proportions clearly taller and larger than Ezra,
                flowing braids over shoulders, charcoal "LENNOX DIANN ROLLINS" t-shirt, microphone
                with gold/blue accents, red bike frame with turning wheels.
              </li>
              <li style={{ marginTop: 6 }}>
                <b>Approval Gate Enforcement:</b> As mandated by Section 10 ("Wait for my explicit
                visual approval before integrating replacement character models into the existing
                game"), the active game continues to display the approved 2D original artwork.
              </li>
            </ul>
          </div>
        )}

        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="arcade-btn gold"
            style={{ minHeight: 44, fontSize: 16, flex: 1 }}
            onClick={onClose}
          >
            ✓ RETURN TO GAME
          </button>
        </div>
      </div>
    </div>
  );
};
