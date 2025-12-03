import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Grid(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M0 0h5v5H0V0zm7.5 0h5v5h-5V0zM15 0h5v5h-5V0zM0 7.5h5v5H0v-5zm7.5 0h5v5h-5v-5zm7.5 0h5v5h-5v-5zM0 15h5v5H0v-5zm7.5 0h5v5h-5v-5zm7.5 0h5v5h-5v-5z"
        fill="#FC633A"
      />
    </Svg>
  )
}

export default Grid