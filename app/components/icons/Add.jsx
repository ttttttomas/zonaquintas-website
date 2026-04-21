export default function Add({ className }) {
  return (
    <svg
      className={className}
      height="20"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd_82_30233)">
        <rect
          x="3"
          y="-0.000976562"
          width="30"
          height="30"
          rx="7.35387"
          fill="black"
        />
      </g>
      <path
        d="M17.5 7.99902V21.999M25 15.0138H10"
        stroke="white"
        strokeWidth="3"
      />
      <defs>
        <filter
          id="filter0_dd_82_30233"
          x="0.325864"
          y="-0.000976562"
          width="35.3483"
          height="35.3483"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2.67414" />
          <feGaussianBlur stdDeviation="1.33707" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          {/* <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_82_30233"/> */}
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2.67414" />
          <feGaussianBlur stdDeviation="1.33707" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          {/* <feBlend mode="normal" in2="effect1_dropShadow_82_30233" result="effect2_dropShadow_82_30233"/> */}
          <feBlend
            mode="normal"
            in="SourceGraphic"
            // in2="effect2_dropShadow_82_30233"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
