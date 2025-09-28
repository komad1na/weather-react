import React from "react";

export default function Text({ frontText, dataText, unit }) {
    return (
        <div className="textholder">
            {frontText}{" "}
            <b>
                {dataText} {unit}
            </b>
        </div>
    );
}
