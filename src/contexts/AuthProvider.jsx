import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import auth from "../../firebase.init";
import axios from "axios";
import { LocationContext } from "./LocationProvider";
import { useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = useContext(LocationContext);

  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if (currentuser) setUser(currentuser);
      // refetch();

      if(user){
        setLoading(true);
        queryClient
        .fetchQuery({
          queryKey: ["user"],
          queryFn: async () => {
            const response = await axios.get(`${API}/user/${user?.email}`);
            return response.data;
          },
        })
        .then((res) => {
          user.objectId = res._id;
          user.badges = res.badges;
          user.role = res.role;
        })
        .catch(() => {
          //console.log(err);
          //skip
        });
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, API, queryClient]);

  const googleProvider = new GoogleAuthProvider();
  const createWithGoogle = async () => {
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, googleProvider);
    return result;
  };

  const signInWithEmail = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    //const user = userCredential.user;

    /*
    if (photoURL) {
      await updateProfile(user, { photoURL });
    }*/

    return userCredential;
  };

  const createWithEmail = async (email, password, displayName, photoURL) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: displayName,
      photoURL: photoURL,
    });

    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const authInfo = {
    user,
    setUser,
    createWithGoogle,
    signInWithEmail,
    logout,
    createWithEmail,
    loading,
    setLoading,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-28 h-28 border-8 border-primary border-solid rounded-full animate-spin border-t-transparent"></div>
          <p className="absolute inset-0 flex items-center justify-center text-primary font-semibold text-xl">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default AuthProvider;
