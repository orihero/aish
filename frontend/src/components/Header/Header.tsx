import React from "react";
import styled from "styled-components";
import ButtonComp from "../Button/Button";
import { Colors } from "../../shared/utils/color";
import { Images } from "../../shared/assets";
import Text from "../Text/Text";

const Header = () => {
    return (
        <HeaderContainer>
            <div className="left">
                <img className="logo" src={Images.logo} alt="Logo" />
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
            <div className="right">
                <ButtonComp title="Login" />
                <img src={Images.divider} alt="Divider" height={30} />
                <ButtonComp title="Sign Up" primary />
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

    .right {
        display: flex;
        align-items: center;
        gap: 20px;
    }
`;
