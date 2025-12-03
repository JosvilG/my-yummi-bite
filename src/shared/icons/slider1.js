import * as React from "react"
import Svg, { Rect, Circle } from "react-native-svg"


function Slider1(props) {
  return (
    <Svg
      width={45}
      height={20}
      viewBox="0 0 45 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
    <Rect width={45} height={20} rx={10} fill="#fff" />
    <Circle cx={11.5} cy={10.5} r={3.5} fill="#FC633A" />
    <Circle opacity={0.5} cx={22.5} cy={10.5} r={3.5} fill="#FC633A" />
    <Circle opacity={0.5} cx={33.5} cy={10.5} r={3.5} fill="#FC633A" />
      
    </Svg>
  )
}

export default Slider1