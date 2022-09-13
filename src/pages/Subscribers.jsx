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
const Subscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchSubscribers = async () => {
    
          const res = await axios.get(`http://localhost:5000/api/users/subscribers/${currentUser._id}`, {withCredentials: true});
          setSubscribers(res.data);
        };
        fetchSubscribers();
      })
  return (
    <div>
        <Title>Subscribers</Title>
            {
                subscribers.map((user) => {
                    return <Items key={user._id}>{user.name}</Items>
                })
            }
    </div>
  )
}

export default Subscribers