import styled from "styled-components";

export const HeaderContainer = styled.header`
  width: 100%;
  height: 8vh;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LeftMenu = styled.div`
  width: 35%;
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: white;
  font-family: arial;
`;

export const RightMenu = styled.div`
  width: 20%;
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const Menu = styled.div`
  width: 20%;
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
            font-weight: 900;
            font-family: 'Arial', sans-serif;
            letter-spacing: 0.1em;
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.18) 0%,
                rgba(255, 255, 255, 0.30) 40%,
                rgba(255, 255, 255, 0.30) 60%,
                rgba(255, 255, 255, 0.30) 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
            text-shadow: 0 1px 3px rgba(255, 255, 255, 0.1);
            position: relative;
            cursor: pointer;
`;

export const Logout = styled.p`
  font-size: 1.5rem;
  font-family: 'Arial', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    color: #ca2222ff;
  }
`;

export const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 80%;
  left: 0;
  background-color: white;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1000;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;

export const DropdownItem = styled.button`
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 14px;
  transition: background-color 0.3s ease;
  
  &:hover {
    color: #ca2222ff;
  }
  
  &:first-child {
    border-top: none;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const SubButton = styled.h5`
  margin-top: 1.7rem;
  cursor: pointer;
`;

export const CadastroMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1000;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;

export const CadastroItem = styled.button`
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 14px;
  transition: background-color 0.3s ease;
  
  &:hover {
    color: #ca2222ff;
  }
  
  &:first-child {
    border-top: none;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;