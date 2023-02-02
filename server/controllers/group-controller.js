const Group = require('../model/Group');
const { authMiddleware } = require('../middleware/jwt-config');
const { createPost } = require('../controllers/post-controller');

async function getGroups(req, res){
    try{
        const groups = await Group.find({});
        res.status(200).json(groups)
    } catch(err){
        res.status(404).json({ message: err.message })
    }
}
async function getGroupByName({params},res){
    try{
        const group = await Group.find({name: params.name});
        res.status(200).json(group)
    } catch(err){
        res.status(404).json({ message: err.message });
    }
}
async function getPosts({params},res){
    try{
        const group = await Group.find({name: params.name});
        res.status(200).json(group[0].posts)
    } catch(err){
        res.status(404).json({ message: err.message });
    }
}
async function getMembers({params},res){
    try{
        const group = await Group.find({name: params.name});
        res.status(200).json(group[0].members);
    } catch(err){
        res.status(404).json({ message: err.message });
    }
}
async function getPost({params},res){
    try{
        const group = await Group.find({name: params.name});
        const post = group[0].posts.find(post => post._id == params.id);
    } catch(err){
        res.status(404).json({ message: err.message });
    }
}
async function addGroup(req,res){
    try{
        console.log(req.body);
        const {admin,groupname,groupdescription} = req.body;
        const group = await Group.create(
            {
                name: groupname,
                description: groupdescription,
                members: [admin],
                posts: [],
                admin: admin
            })
        res.status(201).json(group);
    }
    catch(err){
        console.log(err.message);
        res.status(409).json({ message: err.message });
    }
}
async function addPost({body, params},res){
    try{
        createPost({body},res);
    }
    catch(err){
        res.status(409).json({ message: err.message });
    }
}
async function joinGroup({params},res){
    try{
        const group = await Group.find({name: params.name});
        const member = group[0].members.find(member => member.username == params.username);
        if(member){
            return res.status(409).json({ message: "You are already a member of this group" });
        }
        else{
            group[0].members.push({username: params.username});
            await group[0].save();
            res.status(201).json(group[0]);
        }
    } catch(err){
        res.status(409).json({ message: err.message });
    }
}
async function leaveGroup({params},res){
    try{
        const group = await Group.find({name: params.name});
        const member = group[0].members.find(member => member.username == params.username);
        if(!member){
            return res.status(409).json({ message: "You are not a member of this group" });
        }
        else{
            group[0].members = group[0].members.filter(member => member.username !== params.username);
            await group[0].save();
            res.status(201).json(group[0]);
        }
    } catch(err){
        res.status(409).json({ message: err.message });
    }
}
module.exports = {
    getGroups,
    getGroupByName,
    getPosts,
    getMembers,
    getPost,
    addGroup,
    addPost,
    joinGroup,
    leaveGroup
}