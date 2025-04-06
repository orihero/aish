import React from "react";
import styled from "styled-components";
import ButtonComp from "../Button/Button";
import { Colors } from "../../shared/utils/color";
import { Images } from "../../shared/assets";
import Text from "../Text/Text";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const Header = () => {
    const handleMenu = () => {
        const menu = document.querySelector(".menu") as HTMLElement;
        if (menu) {
            menu.style.right = menu.style.right === "-100%" ? "0" : "-100%";
        }
    };

    return (
        <HeaderContainer>
            <div className="left">
                <a href="/">
                    <img className="logo" src={Images.logo} alt="Logo" />
                </a>
                <div className="nav">
                    <Text
                        text="Find Jobs"
                        textSize="fourteen"
                        color={Colors.textColor}
                    />
                    <Text
                        text="Browse Companies"
                        textSize="fourteen"
                        color={Colors.textColor}
                    />
                </div>
            </div>
            <div className="right">
                <ButtonComp title="Login" />
                <img src={Images.divider} alt="Divider" height={30} />
                <ButtonComp title="Sign Up" primary />
            </div>
            <button className="menuIcon" onClick={handleMenu}>
                <HiMenuAlt2 size={24} color={Colors.textBlack} />
            </button>
            <div className="menu">
                <div className="menuTop">
                    <button className="menuIcon" onClick={handleMenu}>
                        <IoClose size={24} color={Colors.textBlack} />
                    </button>
                    <img src={Images.logo} alt="logo" />
                </div>
                <div className="menuNav">
                    <Text
                        text="Find Jobs"
                        textSize="fourteen"
                        color={Colors.textColor}
                    />
                    <Text
                        text="Browse Companies"
                        textSize="fourteen"
                        color={Colors.textColor}
                    />
                </div>
            </div>
        </HeaderContainer>
    );
};

export default Header;

const HeaderContainer = styled.div`
    background-color: ${Colors.light};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5%;
    height: 10vh;
    width: 100%;
    position: fixed;
    z-index: 10;

    .logo {
        height: 100%;
        object-fit: contain;
    }

    .left {
        display: flex;
        gap: 30px;
        align-items: center;
    }

    .nav {
        display: flex;
        align-items: center;
        gap: 30px;
    }

    .right {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .menuIcon {
        display: none;
        background-color: ${Colors.white};
        color: ${Colors.light};
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
    }

    .menu {
        position: absolute;
        width: 320px;
        height: 100vh;
        top: 0;
        right: -100%;
        background-color: ${Colors.light};
        gap: 20px;
        z-index: 11;
        transition: all 0.5s ease-in-out;
    }

    .menuTop {
        display: flex;
        align-items: center;
        height: 10vh;
        gap: 20px;
        padding: 0 20px;
    }

    .menuNav {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }

    @media (max-width: 768px) {
        .right {
            display: none;
        }

        .nav {
            display: none;
        }

        .menuIcon {
            display: flex;
        }
    }

    @media (max-width: 425px) {
        padding: 0 4%;
    }

    @media (max-width: 375px) {
        padding: 0 3%;
    }
`;
