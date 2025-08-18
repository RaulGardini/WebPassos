import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
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
              <DropdownItem onClick={() => navigate("/listAlunos")}><CiUser style={{fontSize: "1.5rem"}}/>Alunos</DropdownItem>
              <DropdownItem>Botão 2</DropdownItem>
              <DropdownItem>Botão 3</DropdownItem>
            </DropdownMenu>
          )}
        </Menu>
        <Title>WebPassos</Title>
      </LeftMenu>
      <RightMenu>
        <Logout>
          logout<IoIosArrowBack />
        </Logout>
      </RightMenu>
    </HeaderContainer>
  );
}

export default Header;