import './App.css';
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Menu from './components/Menu';
import NavBar from './components/NavBar';
import { darkTheme, lightTheme } from './utils/Theme';
import {useState } from 'react';
import Home from './pages/Home';
import Video from './pages/Video';
import SignIn from './pages/SignIn';
import { useSelector } from 'react-redux';
import Search from './pages/Search';

const Container = styled.div`
  display: flex;
`;
const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;
const Wrapper = styled.div``;


function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
      <BrowserRouter>
        <Menu darkMode={darkMode} setDarkMode={setDarkMode}/>
        <Main>
          <NavBar/>
          <Wrapper>
          <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path="subscriptions" element={currentUser ? <Home type='sub'/> : <Navigate to='/'/>} />
                  <Route path="search" element={<Search />} />
                  <Route
                    path="signin"
                    element={currentUser ? <Home /> : <SignIn />}
                  />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
          </Wrapper>
        </Main>
      </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
