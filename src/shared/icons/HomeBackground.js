import * as React from "react"
import { Dimensions } from "react-native"
import Svg, { Path, Defs, RadialGradient, Stop } from "react-native-svg"

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function HomeBackground(props) {
  return (
    <Svg
      width={screenWidth}
      height={screenHeight}
      viewBox="0 0 375 393"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M-16 248.737v160.04h406.5c0-192.012 108.5-511.533-47.615-375.265C201.456 156.959 54.333 237.7-16 248.737z"
        fill="url(#prefix__paint0_radial)"
      />
      <Defs>
        <RadialGradient
          id="prefix__paint0_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-366.59935 315.46993 -328.37249 -381.59307 369.5 72.481)"
        >
          <Stop stopColor="#FFBD00" />
          <Stop offset={1} stopColor="#F23838" />
        </RadialGradient>
      </Defs>
    </Svg>
  )
}

export default HomeBackground