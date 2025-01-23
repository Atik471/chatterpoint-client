import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const AdminRoute = ({children}) => {
        const { user, loading } = useContext(AuthContext)

        if(!user && !loading) return  <Navigate to="/login" replace />

        if(user.role !== 'admin') return <Navigate to={"/"} />
    
    return (children);
};

AdminRoute.propTypes = {
    children: PropTypes.object
}

export default AdminRoute;