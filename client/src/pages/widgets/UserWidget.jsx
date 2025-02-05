import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
    Twitter,
    LinkedIn
} from '@mui/icons-material';

import { Box, Typography, Divider, useTheme} from "@mui/material";
import MyPostWidget from '../widgets/MyPostWidget';
import io from 'socket.io-client'

//Custom components
import UserAvatar from "../../components/CustomStyledComponents/UserAvatar";
import FlexBetween from "../../components/CustomStyledComponents/FlexBetween";
import WidgetWrapper from '../../components/CustomStyledComponents/WidgetWrapper';

import UserWidgetSkeleton from '../../components/Skeletons/UserWidgetSkeleton';

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { setFollowers, setPerson, setPersonFollowers } from '../../state';
import CreateGroupWidget from './CreateGroupWidget';

const UserWidget = ({ username, profilePhotoUrl}) => {


    const dispatch = useDispatch();


    const [user, setUser] = useState(null);
    const { palette } = useTheme();
    const navigate = useNavigate();

    //state
    const token = useSelector((state) => state.token);

    const { followers, followings, username:signedInUsername } = useSelector((state) => state.user)

    const { followers:personFollowers, followings:personFollowings} = useSelector((state) => state.person)
    
    //colors
    const { dark, medium, main } = palette.neutral;

    // const serverUrl =  process.env.REACT_APP_ENV === "Development" ? "http://localhost:3001/" : process.env.REACT_APP_SERVER_URL 
    const serverUrl = 'http://localhost:3001/'

 //Check if we're currently viewing the signedInuser's username

    const isSignedInUserProfile = username === signedInUsername
 // If so, we can manipulate the state of the followings
 //else we cannot


    const getFollowers = async () => {
        // Retrieve the updated followers list from the server
        const response = await fetch(
          serverUrl + `u/${username}/followers`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = await response.json();

        
        if(isSignedInUserProfile){
          // Update the followers list in the redux store
          dispatch(setFollowers({ followers: data }));
        } else{
          dispatch(setPersonFollowers({ followers: data}))
        }
    }



    const getUser = async() => {
        const response = await fetch( serverUrl + `u/${username}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const userData = await response.json();

        setUser(userData);
        setPerson(userData)
    }

    useEffect(() => {
         // Create a socket connection
         const socket = io(serverUrl);
         // Set up a listener for the ADD_REMOVE_FOLLOWER event
         socket.on('ADD_REMOVE_FOLLOWER', async () => {
           // Retrieve the updated followers list from the server
           const response = await fetch(
             serverUrl + `u/${username}/followers`,
             {
               method: "GET",
               headers: { Authorization: `Bearer ${token}` }
             }
           );
           const data = await response.json();
            
           if(isSignedInUserProfile){
             // Update the followers list in the redux store
             dispatch(setFollowers({ followers: data }));
           } else{
             dispatch(setPersonFollowers({ followers: data}))
           }
         });

        getUser();
        getFollowers();
    },[])


    if(!user){
        return (
           <UserWidgetSkeleton/>
        )
    }



    const { 
            location,
            occupation,
            viewedProfile,
            impressions,
            } = user

   

    return (
        <WidgetWrapper>
           <FlexBetween
               gap="0.5rem"
               pb="1.1rem"
           >
               <FlexBetween>
                   <UserAvatar image={profilePhotoUrl} />
                       <Box marginLeft="1rem">
                           <Typography
                               variant='h4'
                               color={dark}
                               fontWeight="500"
                               sx={{
                                   "&:hover": {
                                       color: palette.primary.light,
                                       cursor: "pointer"
                                   }
                               }} 
                               onClick={() => navigate('/profile')}

                           >
                               {username}
                           </Typography>
                           <FlexBetween paddingTop="0.4rem" width="11rem">
                                    <FlexBetween>
                                        <Typography color={dark} marginRight="0.25rem">{isSignedInUserProfile ? followers.length : personFollowers.length}</Typography> 
                                        <Typography color={medium}>{isSignedInUserProfile ? followers.length > 1 ? 'followers' : 'follower' : personFollowers.length > 1 ? 'followers' : 'follower'}</Typography>
                                    </FlexBetween>
                                
                                
                                    <FlexBetween>
                                        <Typography color={dark} >{isSignedInUserProfile ? followings.length : personFollowings.length}</Typography>
                                        <Typography color={medium} marginLeft="0.25rem">following</Typography>                                       
                                    </FlexBetween>
                           </FlexBetween>
                       </Box>
               </FlexBetween>

               <ManageAccountsOutlined/>

              </FlexBetween>

               <Divider/>

               <Box p="1rem 0">
                   <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                       <LocationOnOutlined fontSize='large' sx={{ color: main }}/>
                       <Typography color={medium}>{location}</Typography>
                   </Box>
                   <Box display="flex" alignItems="center" gap="1rem">
                       <WorkOutlineOutlined fontSize="large" sx={{ color: main }}/>
                       <Typography color={medium}>{occupation}</Typography>
                   </Box>
               </Box>

               <Box p="1rem 0">
                   <FlexBetween mb="0.5rem">
                       <Typography color={medium}>Who viewed your profile</Typography>
                       <Typography color={main} fontWeight="500">{viewedProfile}</Typography>
                   </FlexBetween>

                   <FlexBetween>
                      <Typography color={medium}>Impressions of your post</Typography>
                       <Typography color={main} fontWeight="500">{impressions}</Typography>
                   </FlexBetween>
               </Box>
               {user && occupation.toLowerCase() === 'village head' ?
               <CreateGroupWidget/>
               : null}
        </WidgetWrapper>
      )


}

export default UserWidget