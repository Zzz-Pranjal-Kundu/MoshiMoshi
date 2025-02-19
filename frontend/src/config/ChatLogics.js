export const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) return "Unknown";
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};

// for displaying the pfp of the other user at with the most recent / last message they have sent (check if the message was sent by the other user of not)
export const isSameSender = (messages, currMessage, i, userId) => {   //all messages, curr messages, index of the curr message, current logged in user
    return (
        i<messages.length-1 && 
        (messages[i+1].sender._id !== currMessage.sender._id || messages[i+1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};

// for cheking if it is the last message of the other user or not.
export const isLastMessage = (messages, i, userId) => {   //all messages, index of the curr message, current logged in user
    return (
        i===messages.length-1 &&
        messages[messages.length-1].sender._id !== userId &&
        messages[messages.length-1].sender._id
    );
};

export const isSameSenderMargin = (messages, currMessage, i, userId) => {
    if(
        i<messages.length-1 &&
        messages[i+1].sender._id === currMessage.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if(
        (i<messages.length-1 &&
        messages[i+1].sender._id !== currMessage.sender._id &&
        messages[i].sender._id !== userId) ||
        (i === messages.length-1 && messages[i].sender._id !== userId)
    )
        return 0;
    else
        return "auto";
};

export const isSameUser = (messages, currMessage, i) => {
    return i>0 && messages[i-1].sender._id === currMessage.sender._id;
};