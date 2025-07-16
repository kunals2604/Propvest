import { useContext, useState } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import useAuthCheck from '../../hooks/useAuthCheck';
import { toFav } from '../../utils/api';
import UserDetailContext from '../../context/UserDetailContext';
import { checkFavourites, updateFavourites } from '../../utils/common';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from 'react-query';
import { useEffect } from 'react';

const Heart = ({ id }) => {
    const [heartColor, setHeartColor] = useState("white");
    const { validateLogin } = useAuthCheck();
    const { user } = useAuth0();
    const {
        userDetails: { favourites, token },
        setUserDetails
    } = useContext(UserDetailContext);

    useEffect(() =>{
        setHeartColor(()=>checkFavourites(id, favourites))
    },[favourites])

    const { mutate } = useMutation({
        mutationFn: async () => {
            console.log("🧪 Inside mutationFn: about to call toFav");
            return toFav(id, user?.email, token);
        },
        onSuccess: () => {
            console.log("✅ Mutation succeeded");
            setUserDetails((prev) => ({
                ...prev,
                favourites: updateFavourites(id, prev.favourites),
            }));
        },
        onError: (err) => {
            console.error("❌ Mutation failed:", err);
        }
    });


    const handleLike = () => {
        console.log("heart clicked");
        if (validateLogin()) {
            mutate();
            setHeartColor((prev) => prev === "fa3e5f" ? "white" : "fa3e5f");
        }
    }
    return (
        <AiFillHeart size={24} color={heartColor} onClick={(e) => {
            e.stopPropagation();
            handleLike();
        }} />
    )
}


export default Heart