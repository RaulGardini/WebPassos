import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { IoSchoolOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoTimeOutline } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import {
  HeaderContainer,
  LeftMenu,
  RightMenu,
  Title,
  Logout,
  Menu,
  DropdownMenu,
  DropdownItem
} from "./style";

function Header() {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <LeftMenu>
        <Menu
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
          style={{ position: "relative" }}
        >
          <IoIosMenu />
          {dropdownOpen && (
            <DropdownMenu>
              <DropdownItem onClick={() => navigate("/listAlunos")}><CiUser style={{fontSize: "1.5rem"}}/> Alunos</DropdownItem>
              <DropdownItem onClick={() => navigate("/listColaboradores")}><CiUser style={{fontSize: "1.5rem"}}/> Colaboradores</DropdownItem>
              <DropdownItem onClick={() => navigate("/listEscolas")}><IoSchoolOutline style={{fontSize: "1.5rem"}}/> Escolas</DropdownItem>
              <DropdownItem onClick={() => navigate("/listHorarios")}><IoTimeOutline style={{fontSize: "1.5rem"}}/> Horários</DropdownItem>
              <DropdownItem onClick={() => navigate("/listTurmas")}><SiGoogleclassroom style={{fontSize: "1.5rem"}}/> Turmas</DropdownItem>
            </DropdownMenu>
          )}
        </Menu>
        <Title>WebPassos</Title>
      </LeftMenu>
      <RightMenu>
        <Logout onClick={() => navigate("/")}>
          logout<IoIosArrowBack />
        </Logout>
      </RightMenu>
    </HeaderContainer>
  );
}

export default Header;