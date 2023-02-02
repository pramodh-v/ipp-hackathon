import { useState } from 'react'

import {
    EditOutlined
    ,DeleteOutlined
    ,AttachFileOutlined
    ,GifBoxOutlined
    ,ImageOutlined
    ,MicOutlined
    ,MoreHorizOutlined
} from '@mui/icons-material';

import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
    CircularProgress,
} from '@mui/material';

import FlexBetween from '../../components/CustomStyledComponents/FlexBetween';
import Dropzone from 'react-dropzone'
import UserAvatar from '../../components/CustomStyledComponents/UserAvatar';
import { setPosts } from "../../state" 
import { useDispatch, useSelector } from 'react-redux';
import WidgetWrapper from '../../components/CustomStyledComponents/WidgetWrapper';

import { groupSchema } from '../../utils/Schemas';

const CreateGroupWidget = () => {
    const dispatch = useDispatch()
    const [imageUrls, setImageUrls] = useState([]);
    const [errors, setErrors] = useState({});
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] =useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { username } = useSelector((state) => state.user)
    const token = useSelector((state) => state.token);
    const [loading, setLoading] = useState(false);
    const [groupname, setGroupname] = useState("");
    const [groupdescription, setGroupdescription] = useState("");

    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const { mediumMain, medium} = palette.neutral;

    const handleDrop = (acceptedFiles) => {
        acceptedFiles = acceptedFiles.slice(0,isNonMobileScreens ? 5 : 4)

        setImageUrls(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));

        setImage(acceptedFiles)
        
    };
   

    const handlePost = async (e) => {

      
        const formData = new FormData();
        // formData.append("username", username);
        formData.append("admin",username);
        formData.append("groupname", groupname);
        formData.append("groupdescription", groupdescription);

        // const serverUrl =  process.env.REACT_APP_ENV === "Development" ? "http://localhost:3001/" : process.env.REACT_APP_SERVER_URL 
        const serverUrl = 'http://localhost:3001/'
        
        const response = await fetch( serverUrl + `g`,{
          method: "POST",
          headers: { Authorization: `Bearer ${token}`},
          body:formData
        })

        const posts = await response.json();

        
        setLoading(false);  

        dispatch(setPosts({ posts }));
        setImage(null);
        setPost("")
    }
    
    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        setLoading(true)
        await groupSchema.validate({ caption: post, images: imageUrls }, { abortEarly: false });
        setErrors({});
        handlePost();
        } catch (err) {
        const validationErrors = {};
        err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        }
    }

    const handleBlur = async() => {
      setErrors({});
    }

    const handleChange = async(e) => {
      setPost(e.target.value)
      if(post.length > 2){
        try {
          await groupSchema.validate({  }, { abortEarly: false });
          setErrors({});
          } catch (err) {
          const validationErrors = {};
          err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
          });
          setErrors(validationErrors);
          }
        return;
      }
    }
  
  return (
    <WidgetWrapper m="0 0 2rem 0" sx={{ textAlign: "center"}}>
      <FlexBetween gap="1.5rem">
        <InputBase 
          placeholder="Create a new Group"
          onChange={handleChange}
          onBlur={handleBlur}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem"
          }}
        />
      </FlexBetween>
      <br/>
      <FlexBetween gap="1.5rem">
        <InputBase 
          placeholder="Group Description"
          onChange={handleChange}
          onBlur={handleBlur}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem"
          }}
        />
      </FlexBetween>
        <Divider sx={{margin: "1.25rem 0"}} />
    </WidgetWrapper>
  )
}

export default CreateGroupWidget