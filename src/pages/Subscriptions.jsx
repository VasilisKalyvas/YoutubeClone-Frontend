import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import styled from "styled-components";

const Title = styled.p`
  display: flex;
  color: white;
  justify-content: center;
  font-size: 30px;
`;

const Items = styled.p`
  display: flex;
  color: white;
  justify-content: center;
`;
const Subscriptions = () => {
    const [subscribedUsers, setSubscribedUsers] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchSubscribedUsers = async () => {
    
          const res = await axios.get(`http://localhost:5000/api/users/subscriptions/${currentUser._id}`, {withCredentials: true});
          setSubscribedUsers(res.data);
        };
        fetchSubscribedUsers();
      })
  return (
    <div>
        <Title>Subscriptions</Title>
            {
                subscribedUsers?.map((user) => {
                    return <Items key={user._id}>{user.name}</Items>
                })
            }
    </div>
  )
}


export default Subscriptions