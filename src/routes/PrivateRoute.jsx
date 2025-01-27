import PropTypes from "prop-types";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext)

    if(!user && !loading) return  <Navigate to="/login" replace />

    if(loading) <div>Loading...</div>

    return (
        children
    );
};

PrivateRoute.propTypes = {
    children: PropTypes.object.isRequired,
}

export default PrivateRoute;