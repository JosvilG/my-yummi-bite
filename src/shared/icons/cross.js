import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function Cross(props) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#prefix__clip0)">
        <Path
          d="M23.715 1.074L15 9.789 6.284 1.074c-3.36-3.361-8.57 1.85-5.212 5.212 2.905 2.903 5.812 5.81 8.715 8.715-2.904 2.907-5.81 5.812-8.715 8.715-3.359 3.36 1.852 8.57 5.212 5.213L15 20.213l8.716 8.716c3.36 3.36 8.572-1.852 5.212-5.213L20.21 15c2.906-2.905 5.81-5.811 8.717-8.716 3.36-3.36-1.851-8.571-5.212-5.208"
          fill="#FC633A"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path fill="#fff" d="M0 0h30v30H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default Cross