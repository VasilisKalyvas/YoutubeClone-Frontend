import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import YouTubeIcon from '@mui/icons-material/YouTube';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import io from 'socket.io-client';
var socket, selectedChatCompare;
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

const Login = styled.div``;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
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
  const [read, setRead] = useState(false);

  useEffect(() => {
    const ENDPOINT = 'https://mern-clonetube.herokuapp.com/';
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
    await axios.get(`https://mern-clonetube.herokuapp.com/api/auth/logout`, {withCredentials: true}); 
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
          <Item>
            <NotificationsIcon onClick={HandleNotification} /> {notification.length}
          </Item></>
          :
          null
        }
        {open && (
        <>
          <Notification>
            {notification.length == 0 ?
            <> <Notif>There is 0 Notifications</Notif></>:<>
            {notification.map((data, i)=> {
              if(data.type == 1)
              {
                return <><Notif key={i}><Avatar/>{data.name} just Subscribed your Channel</Notif><Hr/></>
              }
              if(data.type == 2)
              {
                return <><Notif  key={i}><Avatar/>{data.name} comment your <Link to={`/video/${data.videoId}`}>video</Link></Notif><Hr/></>
              }
              if(data.type == 3)
              {
                return <><Notif  key={i}><Avatar/>{data.name} liked your <Link to={`/video/${data.videoId}`}>video</Link></Notif><Hr/></>
              }
              if(data.type == 4)
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
        <Item>
          <HistoryOutlinedIcon />
          <Navs>History</Navs>
        </Item>
        <Hr />
        <Item>
          <SettingsOutlinedIcon />
          <Navs>Settings</Navs>
        </Item>
        <Item>
          <FlagOutlinedIcon />
          <Navs>Report</Navs>
        </Item>
        <Item>
          <HelpOutlineOutlinedIcon />
          <Navs>Help</Navs>
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