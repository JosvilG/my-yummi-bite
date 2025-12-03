import * as React from "react"
import { Dimensions } from "react-native";
import Svg, { G, Path, Defs, LinearGradient, Stop } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function InfoDetalladaBG(props) {
    const screenHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get("window").width;

  return (
    <Svg
      width={screenWidth}
      height={2000}
      viewBox="0 0 375 2000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#prefix__filter0_d)">
        <Path
          d="M149.5 82c96 28.8 212.333 28.667 258.5 25v1243H-33V0c20.833 15.333 86.5 53.2 182.5 82z"
          fill="url(#prefix__paint0_linear)"
        />
      </G>
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={56.031}
          y1={86.634}
          x2={469.304}
          y2={451.767}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FCB13A" />
          <Stop offset={0.707} stopColor="#FC633A" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default InfoDetalladaBG
