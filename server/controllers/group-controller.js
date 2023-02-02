const { Group } = require('../models');
const { authMiddleware } = require('../middleware/jwt-config');
const { createPost } = require('../controllers/post-controller');

module.exports = {
    async getGroups(req, res){
        try{
            const groups = await Group.find({});
            res.status(200).json(groups)
        } catch(err){
            res.status(404).json({ message: err.message })
        }
    },
    async getGroupByName({params},res){
        try{
            const group = await Group.find({name: params.name});
            res.status(200).json(group)
        } catch(err){
            res.status(404).json({ message: err.message });
        }
    },
    async getPosts({params},res){
        try{
            const group = await Group.find({name: params.name});
            res.status(200).json(group[0].posts)
        } catch(err){
            res.status(404).json({ message: err.message });
        }
    },
    async getMembers({params},res){
        try{
            const group = await Group.find({name: params.name});
            res.status(200).json(group[0].members);
        } catch(err){
            res.status(404).json({ message: err.message });
        }
    },
    async getPost({params},res){
        try{
            const group = await Group.find({name: params.name});
            const post = group[0].posts.find(post => post._id == params.id);
        } catch(err){
            res.status(404).json({ message: err.message });
        }
    },
    async addGroup({body},res){
        try{
            const group = await Group.create(body);
            res.status(201).json(group);
        }
        catch(err){
            res.status(409).json({ message: err.message });
        }
    },
    async addPost({body, params},res){
        try{
            createPost({body},res);
        }
        catch(err){
            res.status(409).json({ message: err.message });
        }
    },
    async joinGroup({params},res){
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
    },
    async leaveGroup({params},res){
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
}