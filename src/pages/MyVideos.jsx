import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from 'axios';
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchVideos = async () => {

      const res = await axios.get(`http://localhost:5000/api/videos/myvideos/${currentUser._id}`, {withCredentials: true});
      setVideos(res.data);
    };
    fetchVideos();
  })

  return (
    <Container>
      {videos?.map((video) => (
        <Card key={video._id} video={video}/>
      ))}
    </Container>
  );
};

export default MyVideos