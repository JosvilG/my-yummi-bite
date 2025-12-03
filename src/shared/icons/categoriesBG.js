import * as React from "react"
import { Dimensions } from "react-native"
import Svg, { G, Path, Defs, LinearGradient, Stop } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const customViewBox = `0 0 ${screenWidth} 200`

function categoriesBG(props) {
  return (
    <Svg
      width={screenWidth}
      height={screenHeight} 
      viewBox={customViewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#prefix__filter0_d)">
        <Path
          d="M375 470V42.827C345.333 24.523 274 10 187.5 10S29.333 23.572 0 42.827V470h375z"
          fill="url(#prefix__paint0_linear)"
        />
      </G>
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={409}
          y1={10}
          x2={-6.896}
          y2={332.301}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F23838" />
          <Stop offset={1} stopColor="#FCB13A" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default categoriesBG