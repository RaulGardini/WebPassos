import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { IoSchoolOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import {
    HeaderContainer,
    Menu,
    Title,
    Logout,
    Options,
    DropdownMenu,
    DropdownItem,
    SubButton,
    CadastroMenu,
    CadastroItem,
} from "./style";

function Header() {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <HeaderContainer>
            <Menu>
                <Options
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                    style={{ position: "relative" }}
                >
                    <IoIosMenu />
                    {dropdownOpen && (
                        <DropdownMenu>
                            <DropdownItem onClick={() => navigate("/listEscolas")}><IoSchoolOutline style={{ fontSize: "1.5rem" }} /> Escolas</DropdownItem>
                        </DropdownMenu>
                    )}
                </Options>
                <Title onClick={() => navigate("/professor")}>WebPassos</Title>
                <Logout onClick={() => navigate("/")}>
                    <BiLogOut />
                </Logout>
            </Menu>
        </HeaderContainer>
    );
}

export default Header;