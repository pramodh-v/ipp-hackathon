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
import { setGroups } from "../../state" 
import { useDispatch, useSelector } from 'react-redux';
import WidgetWrapper from '../../components/CustomStyledComponents/WidgetWrapper';

import { groupSchema } from '../../utils/Schemas';
import axios from 'axios';

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

    const handleCreate = async (e) => {  
        const fd = {}
        
        const formData = new FormData();
        formData.append('groupname', groupname);
        formData.append('groupdescription', groupdescription);
        formData.append('admin', username);

        fd.admin = username;
        fd.groupname = groupname;
        fd.groupdescription = groupdescription;

        // const serverUrl =  process.env.REACT_APP_ENV === "Development" ? "http://localhost:3001/" : process.env.REACT_APP_SERVER_URL 
        const serverUrl = 'http://localhost:3001/'
        
        axios.post(`${serverUrl}g`,{admin:username,groupname:groupname,groupdescription:groupdescription},{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            dispatch(setGroups({ groups: res.data }))
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })


        setLoading(false);  

        // dispatch(setGroups({ groups }));
        setGroupname("")
        setGroupdescription("")

    }
    
    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        setLoading(true)
        await groupSchema.validate({ groupName: groupname,groupDescription:groupdescription }, { abortEarly: false });
        console.log("validated");
        setErrors({});
        handleCreate();
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

    const handleChangeName = async(e) => {
      setGroupname(e.target.value);
    }
    
    const handleChangeDesc = async(e) => {
        setGroupdescription(e.target.value);
    }
  
  return (
    <WidgetWrapper m="0 0 2rem 0" sx={{ textAlign: "center"}}>
      <FlexBetween gap="1.5rem">
        <InputBase 
          placeholder="Create a new Group"
          onChange={handleChangeName}
          onBlur={handleBlur}
          value={groupname}
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
          onChange={handleChangeDesc}
          onBlur={handleBlur}
          value={groupdescription}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem"
          }}
        />
      </FlexBetween>
        <br/>
        <Button
                disabled={loading}
                onClick={handleSubmit}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem"
                }}
              >
                {loading ? <CircularProgress sx={{ color: palette.neutral.dark}} size={15}/> : 'Create'}
              </Button>
    </WidgetWrapper>
  )
}

export default CreateGroupWidget