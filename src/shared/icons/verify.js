import * as React from "react"
import Svg, { G, Path, Defs, filter } from "react-native-svg"

function Verify({size}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...size}
    >
      <G filter="url(#prefix__filter0_d)">
        <Path
          d="M39.601 14.586a4.664 4.664 0 00-6.346 1.813L24.59 31.99l-4.958-4.958a4.666 4.666 0 10-6.599 6.598l9.333 9.334a4.66 4.66 0 003.3 1.37l.646-.047a4.665 4.665 0 003.432-2.355l11.667-21a4.666 4.666 0 00-1.81-6.346z"
          fill="#FF8A9B"
          
        />
      </G>
      <Defs></Defs>
    </Svg>
  )
}

export default Verify

