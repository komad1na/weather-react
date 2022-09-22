import React from "react";

export default function TableData({ color, text }) {
    return (
        <td
            style={{
                backgroundColor: color
            }}
        >
            {text}
        </td>
    );
}
