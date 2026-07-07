import imgImg5824R010201 from '../../imports/Frame1/722429ffed9b27707ef0cdffe37620c09a8981b0.png';
import {
  POSTCARD_DESIGN_HEIGHT,
  POSTCARD_DESIGN_WIDTH,
} from '../../app/components/ScaledDesignFrame';

/** Design-space hit target; keep in sync with PostcardLanding overlay. */
export const SEND_POSTCARD_BTN = {
  width: 560,
  height: 149,
  top: 793,
} as const;

export function sendPostcardButtonLeft(): number {
  return (POSTCARD_DESIGN_WIDTH - SEND_POSTCARD_BTN.width) / 2;
}

interface Frame2Props {
  blurBackground?: boolean;
}

export default function Frame2({ blurBackground = false }: Frame2Props) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: POSTCARD_DESIGN_WIDTH, height: POSTCARD_DESIGN_HEIGHT }}
    >
      <div
        className="absolute inset-0 leading-[0]"
        data-name="IMG5824-R01-020 1"
        style={{
          filter: blurBackground ? 'blur(10px)' : 'blur(0px)',
          transition: 'filter 0.3s ease',
        }}
      >
        <img
          alt=""
          className="pointer-events-none block size-full max-w-none object-cover"
          src={imgImg5824R010201}
          width={POSTCARD_DESIGN_WIDTH}
          height={POSTCARD_DESIGN_HEIGHT}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div
        className="absolute flex items-center justify-center rounded-[76px] border border-white/50 bg-[#edeae4]/40 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md"
        style={{
          left: sendPostcardButtonLeft(),
          top: SEND_POSTCARD_BTN.top,
          width: SEND_POSTCARD_BTN.width,
          height: SEND_POSTCARD_BTN.height,
        }}
      >
        <p className="font-instrument-serif whitespace-nowrap text-center text-[85px] leading-none not-italic text-white">
          Send Postcard
        </p>
      </div>
    </div>
  );
}
