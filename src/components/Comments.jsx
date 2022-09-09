import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import SendIcon from '@mui/icons-material/Send';
import Comment from "./Comment";
import io from 'socket.io-client';
var socket, selectedChatCompare;

const Container = styled.div`
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;
const Buttons = styled.input`
color: ${({ theme }) => theme.text};
`;

const Comments = ({videoId}) => {

  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState('');
  const [channel, setChannel] = useState('');
  var type = 0;

  useEffect(() => {
    const ENDPOINT = 'http://localhost:5000';
      socket = io(ENDPOINT);
  })

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/comments/${videoId}`);
        const videoRes = await axios.get(`http://localhost:5000/api/videos/find/${videoId}`);
        const channelRes = await axios.get(
          `http://localhost:5000/api/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data)
        setComments(res.data);
        console.log(comments);
      } catch (err) {}
    };
    fetchComments();
  }, [videoId]);

  //TODO: ADD NEW COMMENT FUNCTIONALITY
  const CreateComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/comments`, {desc, videoId});
      setComments([...comments, res.data]);
      socket.emit('NewNotification', channel._id, currentUser._id, currentUser.name, videoId, type = 2, currentUser.subscribers);
    } catch (err) {}
    setDesc('');
  };
  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser.img} />
      <Input placeholder="Add a comment..." name="desc" value={desc} onChange={(e) => (setDesc(e.target.value))}/>
        <SendIcon onClick={CreateComment} style={{color:'#cc1a00', cursor:'pointer'}}/>
      </NewComment>
      {comments.slice(0).reverse().map(comment=>(
        <Comment key={comment._id} comment={comment}/>
      ))}
    </Container>
  );
};

export default Comments;