import React from "react";
import styled from "styled-components";
import ButtonComp from "../Button/Button";
import { Colors } from "../../shared/utils/color";
import { Images } from "../../shared/assets";
import Text from "../Text/Text";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import LanguageSelect from "../LanguageSelect/LanguageSelec";
import { useTranslation } from "react-i18next";
import useRootStore from "../../shared/hooks/UseRootStore";
import { useNavigate } from "react-router-dom";
import IconComp from "../../shared/constants/iconBtn";
import { DynamicIcon } from "lucide-react/dynamic";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

const Header = () => {
    const { t } = useTranslation();
    const { visibleStore, localStore } = useRootStore();

    const navigation = useNavigate();
    const handleMenu = () => {
        const menu = document.querySelector(".menu") as HTMLElement;
        if (menu) {
            menu.style.right = menu.style.right === "-100%" ? "0" : "-100%";
        }
    };

    const handleMyProfile = () => {
        navigation("/myProfile");
    };

    const handleMyApplications = () => {
        navigation("/applications");
    };

    return (
        <HeaderContainer>
            <div className="headerLeft">
                <a href="/">
                    <img className="logo" src={Images.logo} alt="Logo" />
                </a>
                <div className="nav">
                    <a href="/vacancies">
                        <Text
                            text={"Find Jobs"}
                            textSize="fourteen"
                            color={Colors.textColor}
                        />
                    </a>
                    <Text
                        text={"Browse Companies"}
                        textSize="fourteen"
                        color={Colors.textColor}
                    />
                    {localStore.session.accessToken && (
                        <Text
                            text={"Applications"}
                            textSize="fourteen"
                            color={Colors.textColor}
                            onPress={handleMyApplications}
                            cursor="pointer"
                        />
                    )}
                </div>
            </div>
            <div className="headerRight">
                {/* <LanguageSelect /> */}
                {!localStore.session.accessToken && <ButtonComp title="Hire" />}
                <img src={Images.divider} alt="Divider" height={30} />
                <ButtonComp
                    title="Create resume"
                    primary
                    onPress={() => visibleStore.show("createResumeModal")}
                />
                {localStore.session.accessToken && (
                    <div className="profile">
                        <IconComp
                            icon={
                                <DynamicIcon
                                    color={Colors.mainBlue}
                                    name="circle-user"
                                    size={32}
                                />
                            }
                            onClick={handleMyProfile}
                        />
                    </div>
                )}
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
                    <LanguageSelect />
                    <ButtonComp title="Hire" />
                    <ButtonComp title="Create Resume" primary />
                </div>
            </div>
        </HeaderContainer>
    );
};

export default observer(Header);

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
    top: 0;

    .profile {
        background-color: ${Colors.lineColor};
        padding: 5px;
        border-radius: 50%;
    }

    .logo {
        height: 100%;
        object-fit: contain;
    }

    .headerLeft {
        display: flex;
        gap: 30px;
        align-items: center;
    }

    .nav {
        display: flex;
        align-items: center;
        gap: 30px;
    }

    .headerRight {
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
