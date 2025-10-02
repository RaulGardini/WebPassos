import { useState, useRef, useEffect } from "react";
import { IoIosMenu } from "react-icons/io";
import { MdCalendarMonth } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { gerarChamadasMes } from "../../services/chamadaService";
import type { Usuario } from '../../Models/chamada';
import {
    HeaderContainer,
    Menu,
    Title,
    Logout,
    Options,
    DropdownMenu,
    DropdownItem,
} from "./style";

function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Buscar dados do usuário logado
    useEffect(() => {
        const usuarioLogado = localStorage.getItem("usuario");
        if (usuarioLogado) {
            const dadosUsuario = JSON.parse(usuarioLogado);
            setUsuario(dadosUsuario);
        }
    }, []);

    const handleToggleMenu = () => {
        setDropdownOpen((prev) => !prev);
    };

    // Detecta clique fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleGerarChamadas = async () => {
        if (!usuario?.colaborador_id) {
            alert("Usuário não autenticado");
            return;
        }

        try {
            const response = await gerarChamadasMes(usuario.colaborador_id);
            alert(response.message);
        } catch (error) {
            alert(
                "Erro ao gerar chamadas: " +
                (error instanceof Error ? error.message : "Erro desconhecido")
            );
        }
    };

    return (
        <HeaderContainer>
            <Menu>
                <Options ref={menuRef} style={{ position: "relative" }}>
                    <IoIosMenu onClick={handleToggleMenu} />
                    {dropdownOpen && (
                        <DropdownMenu>
                            <DropdownItem onClick={() => navigate("/listChamadaProfessor")}>
                                <MdCalendarMonth style={{ fontSize: "1.5rem" }} /> Chamadas do mês
                            </DropdownItem>
                            <DropdownItem onClick={handleGerarChamadas}>
                                <MdCalendarMonth style={{ fontSize: "1.5rem" }} /> Gerar Chamadas
                                do Mês
                            </DropdownItem>
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