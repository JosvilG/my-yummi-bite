import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function Camera({size}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...size}
    >
      <G clipPath="url(#prefix__clip0)" fill="#FF8A9B">
        <Path d="M22.313 18.063a5.312 5.312 0 11-10.625 0 5.312 5.312 0 0110.624 0z" />
        <Path d="M4.25 8.5A4.25 4.25 0 000 12.75V25.5a4.25 4.25 0 004.25 4.25h25.5A4.25 4.25 0 0034 25.5V12.75a4.25 4.25 0 00-4.25-4.25h-2.49a4.25 4.25 0 01-3.005-1.245l-1.76-1.76A4.25 4.25 0 0019.49 4.25h-4.98a4.25 4.25 0 00-3.005 1.245l-1.76 1.76A4.25 4.25 0 016.741 8.5H4.25zm1.063 4.25a1.062 1.062 0 110-2.125 1.062 1.062 0 010 2.125zm19.125 5.313a7.438 7.438 0 11-14.876 0 7.438 7.438 0 0114.876 0z" />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path fill="#fff" d="M0 0h34v34H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default Camera
