import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Upload from "./Upload";
import io from 'socket.io-client';
var socket, selectedChatCompare;

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;

  @media(max-width: 321px){
    width: 260px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  margin: auto;
  display: flex;
  position: relative;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;

  @media(max-width: 560px){
    width: 30%;
  }
`;
const SearchButton = styled.div`
  display: flex;
  @media(max-width: 560px){
    width: 30%;
  }
`;
const Input = styled.input`
  width: 100%;
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Navbar = () => {
  const {currentUser} = useSelector(state => state.user);
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  return (
    <>
    <Container>
      <Wrapper>
        <Search>
        <Input placeholder="Search"
          onChange={(e) => setQ(e.target.value)}/>
        <SearchButton>
          <SearchOutlinedIcon style={{cursor:'pointer'}} onClick={()=>navigate(`/search?q=${q}`)}/>
        </SearchButton>
        </Search>
        {currentUser ? 
          <User>
            <VideoCallOutlinedIcon cursor={'pointer'}  onClick={() => setOpen(true)}/>
            <Avatar src={currentUser.img}/>
            {currentUser.name}
          </User>
        : <Link to="signin" style={{ textDecoration: "none" }}>
          <Button>
            <AccountCircleOutlinedIcon />
            SIGN IN
          </Button>
        </Link>}
      </Wrapper>
    </Container>
          {open && <Upload setOpen={setOpen}/>}
  </>
  );
};

export default Navbar;