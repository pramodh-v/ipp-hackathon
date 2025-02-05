import {
    PersonAddOutlined,
    PersonRemoveOutlined
} from "@mui/icons-material";

import { useState } from 'react';


import { useNavigate } from "react-router-dom";
import { Box, IconButton, Typography, useTheme, CircularProgress  } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { setFollowing } from "../../state";
import FlexBetween from '../CustomStyledComponents/FlexBetween';
import UserAvatar from '../CustomStyledComponents/UserAvatar';

import io from 'socket.io-client'

const Following = ({
  followingId,
  name='',
  subtitle='',
  isAuthor,
  userProfilePhotoUrl}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { username, _id:userId } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const followings = useSelector((state) => state.user.followings);
    const [loading, setLoading] = useState(false)

    
    const { palette } = useTheme();
    const { light, dark } = palette.primary;
    const { main, medium } = palette.neutral;


    const isFollowing = followings.find(person => person._id === followingId)


    // const serverUrl =  process.env.REACT_APP_ENV === "Development" ? "http://localhost:3001/" : process.env.REACT_APP_SERVER_URL 
    
    const serverUrl = 'http://localhost:3001/'
    const socket = io(serverUrl);



    const updateFollowing = async() => {

          if(isAuthor){
            return
          }

          setLoading(true)

          try{
            const response = await fetch(
              serverUrl + `u/${username}/following`,
             {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ followingId })
             }
            );
 
            if (response.status === 200) {
             const data = await response.json();
             dispatch(setFollowing({ followings: data }));
             socket.emit("ADD_REMOVE_FOLLOWER", { followerId: userId, followingId });
           }
          } catch (err) {
            console.error(err.message);
          }
          
          setLoading(false)
        
    }


    return (
      <FlexBetween>
        <FlexBetween gap="1rem">
          <UserAvatar image={userProfilePhotoUrl} size="55px" />
          <Box
            onClick={() => {
              navigate(`/profile${name !== username ? '/' + name : ''}`);
              navigate(0);
            }}
          >
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {name.length > 17 ?`${name.substring(0, 17)}...` : name}
            </Typography>
            <Typography color={medium} fontSize="0.75rem">
              {subtitle.length > 17 ?`${subtitle.substring(0, 17)}...` : subtitle}
            </Typography>
          </Box>
        </FlexBetween>
         {!isAuthor && (
          <IconButton
          onClick={() => updateFollowing()}
          disabled={loading}
          sx={{ backgroundColor: light , p: "0.6rem" }}
        > 
          {loading ? <CircularProgress size={20}/> : (isFollowing ? 
              <PersonRemoveOutlined sx={{ color: dark }}/> :
              <PersonAddOutlined sx={{ color: dark }}/>
          )}
        </IconButton>
        )}
    </FlexBetween>
    )


}

export default Following