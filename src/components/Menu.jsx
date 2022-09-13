import React, { useEffect, useState } from "react";
import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import SlideshowIcon from '@mui/icons-material/Slideshow';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleIcon from '@mui/icons-material/People';
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import YouTubeIcon from '@mui/icons-material/YouTube';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import io from 'socket.io-client';
var socket;
axios.defaults.withCredentials = true;


const Container = styled.div`
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  left: 0;

  @media(max-width: 559px){
    position: sticky;
    top: 0;
    left:0;
    width: 60px;
    height: 100vh;
  }

  @media(max-width: 321px){
    height: auto;
  }
`;

const Wrapper = styled.div`
  padding: 18px 15px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const Title = styled.div`
  @media(max-width: 559px){
    visibility:hidden;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Navs = styled.div`
  @media(max-width: 559px){
    display:none;
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;


const NotifItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0px;
  cursor: pointer;
  padding: 7.5px 0px;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;
const Notification = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 250px;
    background-color: ${({ theme }) => theme.bgLighter};
    max-height: 400px;
    top:190px;
    left: 100%;
    overflow: hidden scroll;
    overflow-y: auto;
    border: 3px solid ${({ theme }) => theme.soft};
`;

const Notif = styled.p`
  display: flex;
  gap: 8px;
  font-size: 15px;
  color: ${({ theme }) => theme.text};
  padding: 10px;
`;

const NotifNumber = styled.p`
  position: relative;
  right: 5px;
  bottom :10px;
  color: white;
  text-align: center;
  background-color: red;
  width: 18px;
  height: 20px;
  border-radius: 50%;

  @media(max-width: 559px){
    background-color: inherit;
    color: red;
  }

  @media(max-width: 321px){
    background-color: inherit;
    color: red;
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const Menu = ({ darkMode, setDarkMode }) => {
  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [OnlineCount, setOnlineCount] = useState(0);
  const [notification, setNotification] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ENDPOINT = 'http://localhost:5000';
      socket = io(ENDPOINT);
      if(currentUser){
        socket.emit("addUser", currentUser._id);
      }
      socket.on("Count Online", (count) =>{setOnlineCount(count)});
      socket.on("GetNotification", (data) => { setNotification((prev) => [...prev, data]);});
      console.log(notification);
  })
  const HandleNotification = () => {
    setOpen(!open);
    if(open){
      setNotification([]);
    }
  }

  const handleLogout = async () => {
    await axios.get(`http://localhost:5000/api/auth/logout`, {withCredentials: true}); 
    dispatch(logout());
    localStorage.removeItem('persist:root');
    socket.emit('logout', currentUser._id);
    navigate('/signin')
  };
  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
           <YouTubeIcon style={{color: 'red'}}/>
           <Title>CloneTube</Title>
          </Logo>
        </Link>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <HomeIcon />
            <Navs>Home</Navs>
          </Item>
        </Link>
        <Link to="trends" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <ExploreOutlinedIcon />
            <Navs>Explore</Navs>
          </Item>
        </Link>
        {
          currentUser ?<>
          <Link to="subscriptions" style={{ textDecoration: "none", color: "inherit" }}>
            <Item>
              <SubscriptionsOutlinedIcon />
              <Navs>Subscriptions</Navs>
            </Item>
          </Link>
          <Link to={`myvideos/${currentUser._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Item>
              <SlideshowIcon />
              <Navs>My Videos</Navs>
            </Item>
          </Link>
          <Link to={`subscribers/${currentUser._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Item>
              <PeopleIcon />
              <Navs>My Subscribers</Navs>
            </Item>
          </Link>
          <Link to={`subscriptions/${currentUser._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Item>
              <GroupAddIcon />
              <Navs>Subscriptions</Navs>
            </Item>
          </Link>
          { notification.length > 0 
            ?  <NotifItem>
                <NotificationsIcon onClick={HandleNotification} /> 
                <NotifNumber>{notification.length}</NotifNumber>
                <Navs>Notifications</Navs>
              </NotifItem>
            :
              <Item>
                <NotificationsIcon onClick={HandleNotification} /> 
                <Navs>Notifications</Navs>
              </Item>
          }
         
          </>
          :
          null
        }
        {open && (
        <>
          <Notification>
            {notification.length === 0 ?
            <> <Notif>There is 0 Notifications</Notif></>:<>
            {notification.map((data, i)=> {
              if(data.type === 1)
              {
                return <><Notif key={i}><Avatar/>{data.name} just Subscribed your Channel</Notif><Hr/></>
              }
              if(data.type === 2)
              {
                return <><Notif  key={i}><Avatar/>{data.name} comment your <Link to={`/video/${data.videoId}`}>video</Link></Notif><Hr/></>
              }
              if(data.type === 3)
              {
                return <><Notif  key={i}><Avatar/>{data.name} liked your <Link to={`/video/${data.videoId}`}>video</Link></Notif><Hr/></>
              }
              if(data.type === 4)
              {
                return <><Notif  key={i}><Avatar/>{data.name} upload a new <Link to={`/video/${data.videoId}`}>video</Link></Notif><Hr/></>
              }
            })}</>}
          </Notification>
        </>
      )}
        <Hr/>
        <Item>
          <VideoLibraryOutlinedIcon />
          <Navs>Library</Navs>
        </Item>
        <Hr />
        <Item>
          <SettingsOutlinedIcon />
          <Navs>Settings</Navs>
        </Item>
        <Item onClick={() => setDarkMode(!darkMode)}>
          <SettingsBrightnessOutlinedIcon />
          <Navs>{darkMode ? "Light" : "Dark"} Mode</Navs>
        </Item>
        { currentUser ? <>
        <Item onClick={handleLogout}>
          <LogoutIcon />
          <Navs>Logout</Navs>
        </Item>
        <Item>
          On: {OnlineCount}
        </Item>
        </>
        : 
        <>
        </>
        }
      </Wrapper>
    </Container>
  );
};

export default Menu;