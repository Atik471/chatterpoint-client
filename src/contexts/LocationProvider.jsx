import PropTypes from "prop-types";
import { createContext } from "react";

export const LocationContext = createContext()

const LocationProvider = ({ children }) => {

    const API = "http://localhost:5000"
    // const API = "https://chatter-point-api.vercel.app"
    return (
        <LocationContext.Provider value={API}>
            {children}
        </LocationContext.Provider>
    );
};

LocationProvider.propTypes = {
    children: PropTypes.object.isRequired,
}

export default LocationProvider;