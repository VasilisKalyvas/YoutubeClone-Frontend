import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { format } from "timeago.js";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import io from 'socket.io-client';
var socket, selectedChatCompare;

axios.defaults.withCredentials = true;

const Container = styled.div`
  display: flex;
  gap: 24px;
  padding: 5px;
  @media(max-width: 559px){
   flex-wrap: wrap;
  }
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div`
@media(max-width: 559px){
    iframe{
      width: 300px;
      height: 350px;
    }
  }
  @media(max-width: 321px){
    iframe{
      width: 260px;
      height: 250px;
    }
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media(max-width: 559px){
    flex-wrap: wrap;
  }
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  @media(max-width: 559px){
    font-size:10px;
  }

  @media(max-width: 321px){
    font-size:8px;
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Recommendation = styled.div`
  flex: 2;
`;
const Channel = styled.div`
  display: flex;
  justify-content: space-between;

  @media(max-width: 321px){
    width:230px;
  }
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
 
`;

const Description = styled.p`
  font-size: 14px;
  @media(max-width: 321px){
    width:50px;
  }
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 8px 18px;
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background-color: #cc1a00;
    border: 2px solid black;
  }
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  var type = 0;
  const path = useLocation().pathname.split("/")[2];
  console.log(path);
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const ENDPOINT = 'http://localhost:5000';
      socket = io(ENDPOINT);
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`http://localhost:5000/api/videos/find/${path}`);
        const channelRes = await axios.get(
          `http://localhost:5000/api/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {}
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    await axios.put(`http://localhost:5000/api/users/like/${currentVideo._id}`);
    dispatch(like(currentUser._id));
    socket.emit('NewNotification', channel._id, currentUser._id, currentUser.name, currentVideo._id, type = 3, currentUser.subscribers);
  };
  const handleDislike = async () => {
    await axios.put(`http://localhost:5000/api/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };

  const handleSub = async () => {
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`http://localhost:5000/api/users/unsub/${channel._id}`)
      :
      await axios.put(`http://localhost:5000/api/users/sub/${channel._id}`)
      dispatch(subscription(channel._id));
    if(!currentUser.subscribedUsers.includes(channel._id)){
      socket.emit('NewNotification', channel._id, currentUser._id, currentUser.name, currentVideo._id, type = 1, currentUser.subscribers);
    }
  };

  //TODO: DELETE VIDEO FUNCTIONALITY

  return (
  <>
    <Container>
      { currentVideo && ( 
      <>
        <Content>
          <VideoWrapper>
            <VideoFrame src={currentVideo.videoUrl} controls />
          </VideoWrapper>
          <Title>{currentVideo.title}</Title>
          <Details>
            <Info>
              {currentVideo.views} views • {format(currentVideo.createdAt)}
            </Info>
            <Buttons>
              <Button onClick={handleLike}>
                {currentVideo.likes?.includes(currentUser?._id) ? (
                  <ThumbUpIcon />
                ) : (
                  <ThumbUpOutlinedIcon />
                )}{" "}
                {currentVideo.likes?.length}
              </Button>
              <Button onClick={handleDislike}>
                {currentVideo.dislikes?.includes(currentUser?._id) ? (
                  <ThumbDownIcon />
                ) : (
                  <ThumbDownOffAltOutlinedIcon />
                )}{" "}
                Dislike
              </Button>
              <Button>
                <ReplyOutlinedIcon /> Share
              </Button>
              <Button>
                <AddTaskOutlinedIcon /> Save
              </Button>
            </Buttons>
          </Details>
          <Hr />
          <Channel>
            <ChannelInfo>
              <Image src={channel.img} />
              <ChannelDetail>
                <ChannelName>{channel.name}</ChannelName>
                <ChannelCounter>{channel.subscribers?.length} subscribers</ChannelCounter>
                <Description>{currentVideo.desc}</Description>
              </ChannelDetail>
            </ChannelInfo>
            <Subscribe onClick={handleSub}>
              {currentUser.subscribedUsers?.includes(channel._id)
                ? "SUBSCRIBED"
                : "SUBSCRIBE"}
            </Subscribe>
          </Channel>
          <Hr />
          <Comments videoId={currentVideo._id} />
        </Content>
        <Recommendation tags={currentVideo.tags} /> 
      </>
      )}
    </Container>
  </>
  );
};

export default Video;