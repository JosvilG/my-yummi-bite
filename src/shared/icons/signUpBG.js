import * as React from "react"
import { Dimensions } from "react-native"
import Svg, {
  G,
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from "react-native-svg"

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function SignUpBG(props) {
  return (
    <Svg
      width={screenWidth}
      height={screenHeight}
      viewBox="0 0 375 812"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G>
        <Path
          d="M-50 450C50 550 150 650 300 600C450 550 420 350 380 250C340 150 200 100 100 150C0 200 -150 350 -50 450Z"
          fill="url(#prefix__paint0_radial)"
        />
      </G>
      
      <G>
        <Circle
          cx={80}
          cy={120}
          r={70}
          fill="url(#prefix__paint1_linear)"
          opacity={0.9}
        />
      </G>
      
      <G>
        <Circle
          cx={320}
          cy={80}
          r={35}
          fill="url(#prefix__paint2_linear)"
          opacity={0.85}
        />
      </G>
      
      <G>
        <Circle
          cx={30}
          cy={220}
          r={25}
          fill="url(#prefix__paint4_linear)"
          opacity={0.75}
        />
      </G>
      
      <G>
        <Circle
          cx={350}
          cy={400}
          r={40}
          fill="url(#prefix__paint5_linear)"
          opacity={0.7}
        />
      </G>

      <Defs>
        <LinearGradient
          id="prefix__paint1_linear"
          x1={80}
          y1={50}
          x2={80}
          y2={190}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFD4D4" />
          <Stop offset={0.5} stopColor="#FFB5C0" />
          <Stop offset={1} stopColor="#FF8A9B" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint2_linear"
          x1={320}
          y1={45}
          x2={320}
          y2={115}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFE0E5" />
          <Stop offset={0.5} stopColor="#FFB5C0" />
          <Stop offset={1} stopColor="#FF8A9B" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint3_linear"
          x1={220}
          y1={20}
          x2={220}
          y2={80}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFD4D4" />
          <Stop offset={0.6} stopColor="#FFCAB8" />
          <Stop offset={1} stopColor="#FFB5C0" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint4_linear"
          x1={30}
          y1={195}
          x2={30}
          y2={245}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFE0E5" />
          <Stop offset={0.5} stopColor="#FFB5C0" />
          <Stop offset={1} stopColor="#FF7A8A" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint5_linear"
          x1={350}
          y1={140}
          x2={350}
          y2={220}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFD4D4" />
          <Stop offset={0.5} stopColor="#FFCAB8" />
          <Stop offset={1} stopColor="#FF8A9B" />
        </LinearGradient>
        <RadialGradient
          id="prefix__paint0_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-300 200 -250 -400 350 350)"
        >
          <Stop stopColor="#FFD4D4" />
          <Stop offset={0.3} stopColor="#FFCAB8" />
          <Stop offset={0.6} stopColor="#FFB5C0" />
          <Stop offset={0.85} stopColor="#FF8A9B" />
          <Stop offset={1} stopColor="#FF7A8A" />
        </RadialGradient>
      </Defs>
    </Svg>
  )
}

export default SignUpBG
