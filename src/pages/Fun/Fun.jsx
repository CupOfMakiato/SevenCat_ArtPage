import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import zzz2Sound from "../../assets/zipzapzop2.ogg";
import zzzSound from "../../assets/zipzapzop.ogg";
import clickYRUGSound from "../../assets/whyareyougei.mp3";
import { Howl } from "howler";

const Fun = () => {
  const zzz2SoundRef = useRef(null);
  const zzzSoundRef = useRef(null);
  const clickYRUGSoundRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false);
  const [buttonPositions, setButtonPositions] = useState([]);

  useEffect(() => {
    // Generate random positions for 3 buttons
    const generateRandomPositions = () => {
      const positions = [];
      for (let i = 0; i < 3; i++) {
        positions.push({
          top: Math.random() * 70 + 10, // 10% to 80% from top
          left: Math.random() * 70 + 10, // 10% to 80% from left
        });
      }
      setButtonPositions(positions);
    };

    generateRandomPositions();

    // Initialize all sounds
    zzz2SoundRef.current = new Howl({
      src: [zzz2Sound],
      volume: 0.5,
      html5: true,
      preload: true,
    });

    zzzSoundRef.current = new Howl({
      src: [zzzSound],
      volume: 0.5,
      html5: true,
      preload: true,
    });

    clickYRUGSoundRef.current = new Howl({
      src: [clickYRUGSound],
      volume: 0.5,
      html5: true,
      preload: true,
    });

    const markAudioReady = () => {
      setAudioReady(true);
    };

    const events = ["click", "touchstart", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, markAudioReady, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, markAudioReady);
      });
      if (zzz2SoundRef.current) zzz2SoundRef.current.unload();
      if (zzzSoundRef.current) zzzSoundRef.current.unload();
      if (clickYRUGSoundRef.current) clickYRUGSoundRef.current.unload();
    };
  }, []);

  const playZzz2Sound = () => {
    if (zzz2SoundRef.current && audioReady) {
      // Check if sound is currently playing
      if (!zzz2SoundRef.current.playing()) {
        zzz2SoundRef.current.play();
      }
    }
  };

  const playZzzSound = () => {
    if (zzzSoundRef.current && audioReady) {
      // Check if sound is currently playing
      if (!zzzSoundRef.current.playing()) {
        zzzSoundRef.current.play();
      }
    }
  };

  const playClickYRUGSound = () => {
    if (clickYRUGSoundRef.current && audioReady) {
      // Check if sound is currently playing
      if (!clickYRUGSoundRef.current.playing()) {
        clickYRUGSoundRef.current.play();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MainLayout>
        <div className="relative w-full h-screen">
          {buttonPositions.length > 0 && (
            <>
              <button
                onClick={playZzz2Sound}
                style={{
                  position: "absolute",
                  top: `${buttonPositions[0].top}%`,
                  left: `${buttonPositions[0].left}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="bg-window-500 hover:bg-[#FE5359] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-110 shadow-lg text-xl"
              >
                ?!
              </button>

              <button
                onClick={playZzzSound}
                style={{
                  position: "absolute",
                  top: `${buttonPositions[1].top}%`,
                  left: `${buttonPositions[1].left}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="bg-window-500 hover:bg-[#FE5359] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-110 shadow-lg text-xl"
              >
                ?
              </button>

              <button
                onClick={playClickYRUGSound}
                style={{
                  position: "absolute",
                  top: `${buttonPositions[2].top}%`,
                  left: `${buttonPositions[2].left}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="bg-window-500 hover:bg-[#FE5359] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-110 shadow-lg text-xl"
              >
                !?@#?!@
              </button>
            </>
          )}
        </div>
      </MainLayout>
    </div>
  );
};

export default Fun;
