import * as React from "react"
import Svg, { Path } from "react-native-svg"

function AddCategory(props) {
    return (
        <Svg
            width={29}
            height={28}
            viewBox="0 0 29 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M15 14H1.667M15 27.333V14v13.333zM15 14V.667 14zm0 0h13.333H15z"
                stroke="#F55939"
                strokeWidth={2.333}
                strokeLinecap="round"
            />
        </Svg>
    )
}

export default AddCategory;
