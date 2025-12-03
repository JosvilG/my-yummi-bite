import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ReturnIcon(props) {
  return (
    <Svg
      width={22}
      height={20}
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.167 2L2 10.167l8.167 8.166M2 10.167h18.667"
        stroke="#FC633A"
        strokeWidth={2.333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default ReturnIcon