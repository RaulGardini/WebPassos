import React, { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import {
  HeaderContainer,
  LeftMenu,
  RightMenu,
  Title,
  Logout,
  Menu,
  MenuContainer,
  DropdownMenu,
  DropdownItem
} from "./style";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
              <DropdownItem><CiUser style={{fontSize: "1.5rem"}}/>Alunos</DropdownItem>
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