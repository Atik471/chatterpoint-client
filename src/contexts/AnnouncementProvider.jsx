import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const AnnouncementContext = createContext()

const AnnouncementProvider = ({ children }) => {
    const [announcementnum, setAnnouncementnum] = useState(0);

    const announcementInfo = {
        announcementnum, 
        setAnnouncementnum
    }
    return (
        <AnnouncementContext.Provider value={announcementInfo}>
            {children}
        </AnnouncementContext.Provider>
    );
};

AnnouncementProvider.propTypes = {
    children: PropTypes.object.isRequired,
}

export default AnnouncementProvider;