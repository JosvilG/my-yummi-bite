import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RemoveCategory(props) {
    return (
        <Svg
            width={11}
            height={11}
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                stroke="#fff"
                strokeWidth={2}
                d="M1.707 1.293l8.485 8.485M1.293 9.778l8.485-8.485"
            />
        </Svg>
    )
}

export default RemoveCategory;