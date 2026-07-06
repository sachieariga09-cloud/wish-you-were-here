import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Frame1Wrapper from './Frame1Wrapper';
import { ScaledDesignFrame } from './ScaledDesignFrame';
import Frame2, {
  SEND_POSTCARD_BTN,
  sendPostcardButtonLeft,
} from '../../imports/Frame2/Frame2';

interface PostcardLandingProps {
  onSend: () => void;
}

export function PostcardLanding({ onSend }: PostcardLandingProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSendClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onSend();
  };

  const handleButtonInteraction = (hovering: boolean) => {
    setIsHoveringButton(hovering);
  };

  /** Same box for front/back: sharp corners, light drop shadow (not on the flip container). */
  const postcardFace =
    'absolute size-full overflow-hidden rounded-none shadow-[0_10px_28px_rgba(0,0,0,0.14)] [backface-visibility:hidden]';

  return (
    <div
      className="relative flex size-full flex-col items-center justify-center gap-4 overflow-auto px-[min(40px,5vw)] pb-[min(40px,5vw)] pt-20"
      style={{
        backgroundColor: '#F7F5F2',
        touchAction: 'pan-y pinch-zoom',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <p className="font-instrument-serif shrink-0 text-center text-[23px] leading-snug text-black md:text-[24px]">
        Tap postcard to flip.
      </p>

      <div
        className="w-full max-w-[800px] shrink-0 px-1 py-4 [perspective:1000px] md:[perspective:1600px]"
        onClick={handleFlip}
      >
        <motion.div
          className="mx-auto w-full max-w-[800px] [transform-style:preserve-3d] [will-change:transform]"
          style={{
            position: 'relative',
            aspectRatio: '1.492',
            cursor: 'pointer',
          }}
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className={`${postcardFace} [transform:translateZ(1px)]`}>
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ScaledDesignFrame>
                <Frame1Wrapper />
              </ScaledDesignFrame>
            </motion.div>
          </div>

          <div className={`${postcardFace} [transform:rotateY(180deg)_translateZ(1px)]`}>
            <ScaledDesignFrame>
              <Frame2 blurBackground={isHoveringButton} />
              <div
                onClick={handleSendClick}
                onTouchStart={() => handleButtonInteraction(true)}
                onTouchEnd={() => handleButtonInteraction(false)}
                onMouseEnter={() => handleButtonInteraction(true)}
                onMouseLeave={() => handleButtonInteraction(false)}
                style={{
                  position: 'absolute',
                  left: sendPostcardButtonLeft(),
                  top: SEND_POSTCARD_BTN.top,
                  width: SEND_POSTCARD_BTN.width,
                  height: SEND_POSTCARD_BTN.height,
                  cursor: 'pointer',
                  zIndex: 10,
                }}
              />
            </ScaledDesignFrame>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
