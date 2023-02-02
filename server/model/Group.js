const { Schema, model } = require('mongoose');

const groupSchema = new Schema({
    name: {
        type: String,
        required: 'Group name is required',
        trim: true,
        unique: true,
        maxLength: 50,
        minlength: [8, 'Group name must be at least 8 characters long'],
        match: [
            /^[a-zA-Z0-9!\(\)\-\.\?\[\]\_\`\~\;\:\!\@\#\$\%\^\&\*\+\=]+$/,
            'Group name can only contain letters, numbers, and the following special characters: !()-.[]_`~;:!@#$%^&*+='
        ]
    },
    description: {
        type: String,
        required: 'Group description is required',
        trim: true,
        maxLength: 500,
        minlength: [8, 'Group description must be at least 8 characters long'],
        match: [
            /^[a-zA-Z0-9!\(\)\-\.\?\[\]\_\`\~\;\:\!\@\#\$\%\^\&\*\+\=]+$/,
            'Group description can only contain letters, numbers, and the following special characters: !()-.[]_`~;:!@#$%^&*+='
        ]
    },
    members: {
        type: Array,
        default: []
    },
    posts: {
        type: Array,
        default: []
    },
    profilePhotoUrl: {
        type: String,
        match: [
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(\/[\w, \.-]*)*\/?(?:\.png)?$/,
            'Link is invalid'
        ],
        default: 'https://i.stack.imgur.com/l60Hf.png'
    },
    admin: {
        type: String,
        required: 'Admin is required',
        trim: true,
        match: [
            /^[a-zA-Z0-9,\- ]+$/,
            'Admin can only contain letters, numbers, commas, spaces and -'
        ]
    }
});

const Group = model('Group', groupSchema);
module.exports = Group;