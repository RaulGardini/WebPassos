import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { IoSchoolOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoTimeOutline } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import { RiUserSettingsLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import {
  HeaderContainer,
  LeftMenu,
  RightMenu,
  Title,
  Logout,
  Menu,
  DropdownMenu,
  DropdownItem,
  SubButton,
  CadastroMenu,
  CadastroItem,
} from "./style";

function Header() {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cadastroOpen, setCadastroOpen] = useState(false);
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
              <DropdownItem onClick={() => navigate("/listEscolas")}><IoSchoolOutline style={{ fontSize: "1.5rem" }} /> Escolas</DropdownItem>
              <DropdownItem onClick={() => navigate("/listHorarios")}><IoTimeOutline style={{ fontSize: "1.5rem" }} /> Horários</DropdownItem>
              <DropdownItem onClick={() => navigate("/listTurmas")}><SiGoogleclassroom style={{ fontSize: "1.5rem" }} /> Turmas</DropdownItem>
              <DropdownItem onClick={() => navigate("/gerenciarUsuarios")}><RiUserSettingsLine style={{ fontSize: "1.5rem" }} /> Usuarios</DropdownItem>
            </DropdownMenu>
          )}
        </Menu>
        <Title onClick={() => navigate("/home")}>WebPassos</Title>
        <SubButton onClick={() => navigate("/turmasHoje")}>Turmas hoje <IoIosArrowDown /></SubButton>
        <SubButton
          onMouseEnter={() => setCadastroOpen(true)}
          onMouseLeave={() => setCadastroOpen(false)}
          style={{ position: "relative" }}
        >Cadastro <IoIosArrowDown />
          {cadastroOpen && (
            <CadastroMenu>
              <CadastroItem onClick={() => navigate("/listAlunos")}><CiUser style={{ fontSize: "1.5rem" }} /> Alunos</CadastroItem>
              <CadastroItem onClick={() => navigate("/listColaboradores")}><CiUser style={{ fontSize: "1.5rem" }} /> Colaboradores</CadastroItem>
              <CadastroItem onClick={() => navigate("/listFornecedores")}><CiUser style={{ fontSize: "1.5rem" }} /> Fornecedores</CadastroItem>
            </CadastroMenu>
          )}
        </SubButton>
      </LeftMenu>
      <RightMenu>
        <Logout onClick={() => navigate("/")}>
          <BiLogOut />
        </Logout>
        <div style={{position: 'absolute', right: '1rem', fontSize: '0.8rem', color: '#ffffffaa', fontFamily: 'arial'}}>
          <p>v 1.0.0</p>
        </div>
      </RightMenu>
    </HeaderContainer>
  );
}

export default Header;