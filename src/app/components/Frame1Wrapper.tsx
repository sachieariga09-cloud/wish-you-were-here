import imgImg5824R010201 from '../../imports/Frame1/722429ffed9b27707ef0cdffe37620c09a8981b0.png';
import imgHelloFromTheBigAppleCurrentlyDodgingYellowCabsEatingMyWayThroughPizzaSlicesAndPretendingImInAMovieSceneThisCityNeverSleeps1 from '../../imports/Frame1/8c87be2db946e661abe8f178c6b1f79f2cdd974a.png';
import {
  POSTCARD_DESIGN_HEIGHT,
  POSTCARD_DESIGN_WIDTH,
} from './ScaledDesignFrame';
import { NewYorkStamp } from './NewYorkStamp';
import { TypingText } from './TypingText';

export default function Frame1Wrapper() {
  const lines = [
    'This place reminded me of',
    'how far away you are.',
    'How are things there?',
    'Did summer reach you yet?',
    'Wish You Were Here.',
  ];

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: POSTCARD_DESIGN_WIDTH, height: POSTCARD_DESIGN_HEIGHT }}
    >
      <div className="absolute inset-0 leading-[0]" data-name="IMG5824-R01-020 1">
        <img
          alt=""
          className="pointer-events-none block size-full max-w-none object-cover"
          src={imgImg5824R010201}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="absolute inset-0 leading-[0]" data-name="Hello from the Big Apple overlay">
        <img
          alt=""
          className="pointer-events-none block size-full max-w-none object-cover"
          src={imgHelloFromTheBigAppleCurrentlyDodgingYellowCabsEatingMyWayThroughPizzaSlicesAndPretendingImInAMovieSceneThisCityNeverSleeps1}
          loading="lazy"
          decoding="async"
        />
      </div>
      <NewYorkStamp
        className="pointer-events-none absolute"
        style={{
          left: 990,
          top: 198,
          width: 166,
          height: 122,
        }}
      />
      <TypingText
        lines={lines}
        speed={50}
        className="font-la-belle-aurore absolute left-[766px] top-[550px] w-[598px] text-[52px] not-italic text-black"
      />
      <div className="font-instrument-serif absolute left-[245px] top-[274px] w-[326px] text-[88px] not-italic text-black">
        <p className="mb-0 leading-[77px]">To...</p>
        <p className="leading-[77px]">From...</p>
      </div>
      <div className="absolute h-0 left-[261px] top-[492px] w-[377px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 377 1">
            <line id="Line 1" stroke="var(--stroke-0, black)" x2="377" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[261px] top-[550px] w-[377px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 377 1">
            <line id="Line 1" stroke="var(--stroke-0, black)" x2="377" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[261px] top-[608px] w-[377px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 377 1">
            <line id="Line 1" stroke="var(--stroke-0, black)" x2="377" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
