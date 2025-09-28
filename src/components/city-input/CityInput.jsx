import React, { useState } from "react";
import { toast } from "react-toastify";
import { getAPIData } from "../../redux/dataSlice/dataSlice.js";
import { useDispatch } from "react-redux";
import "./city-input-style.css";

export default function CityInput() {
    const [cityname, setCityName] = useState("");
    const dispatch = useDispatch();

    const errorFnc = () =>
        toast.error(`City name can't be empty.`, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            toastId: "error",
            theme: "dark"
        });

    const handleEnterKey = (e) => {
        if (e.keyCode === 13) {
            if (cityname === "") {
                errorFnc();
            } else {
                dispatch(getAPIData(cityname));
                setCityName("");
            }
        }
    };

    return (
        <input
            className="cityInput"
            type="text"
            placeholder="City name*"
            onKeyDown={handleEnterKey}
            value={cityname}
            onChange={(e) => {
                setCityName(e.target.value);
            }}
            required
        />
    );
}
