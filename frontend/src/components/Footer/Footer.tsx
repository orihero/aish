import styled from "styled-components";
import {
    FaFacebookF,
    FaInstagram,
    FaDribbble,
    FaLinkedinIn,
    FaTwitter,
} from "react-icons/fa";
import { Images } from "../../shared/assets";
import Text from "../Text/Text";
import ButtonComp from "../Button/Button";
import { Colors } from "../../shared/utils/color";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();
    return (
        <FooterContainer>
            <FooterContent>
                <LogoSection>
                    <Logo>
                        <img className="logo" src={Images.aish_logo} alt="JobHuntly" />
                    </Logo>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text={t("footerDescription")}
                        lineHeight={20}
                    ></Text>
                </LogoSection>
                <LinkSection>
                    <Text
                        textSize="eighteen"
                        color={Colors.white}
                        text={t("about")}
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text={t("terms")}
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text={t("privacyPolicy")}
                    ></Text>
                </LinkSection>

                <LinkSection>
                    <Text
                        textSize="eighteen"
                        color={Colors.white}
                        text={t("resources")}
                    ></Text>
                    <a href="/vacancies">
                        <Text
                            textSize="fourteen"
                            color={Colors.lineColor}
                            family="Epilogue-Regular"
                            text={t("findJobs")}
                        ></Text>
                    </a>
                    <a href="/#categories">
                        <Text
                            textSize="fourteen"
                            color={Colors.lineColor}
                            family="Epilogue-Regular"
                            text={t("categories")}
                        ></Text>
                    </a>
                </LinkSection>

                <SubscribeSection>
                    <Text
                        textSize="eighteen"
                        color={Colors.white}
                        text={t("getJobNotifications")}
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text={t("theLatestJobNews")}
                        lineHeight={20}
                    ></Text>
                    <div className="inputBtn">
                        <Input type="email" placeholder={t("emailAddress")} />
                        <ButtonComp title={t("subscribe")} primary />
                    </div>
                </SubscribeSection>
            </FooterContent>
            <Copyright>
                <Text
                    textSize="fourteen"
                    color={Colors.lineColor}
                    family="Epilogue-Regular"
                    text={t("copyrightText")}
                ></Text>
                <SocialIcons>
                    <IconLink href="#">
                        <FaFacebookF />
                    </IconLink>
                    <IconLink href="#">
                        <FaInstagram />
                    </IconLink>
                    <IconLink href="#">
                        <FaDribbble />
                    </IconLink>
                    <IconLink href="#">
                        <FaLinkedinIn />
                    </IconLink>
                    <IconLink href="#">
                        <FaTwitter />
                    </IconLink>
                </SocialIcons>
            </Copyright>
        </FooterContainer>
    );
};

export default Footer;

const FooterContainer = styled.footer`
    background-color: #1f2937;
    padding: 60px 5% 0 5%;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 60px;
`;

const FooterContent = styled.div`
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;

    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
`;

const LogoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
    font-size: 1.5rem;
    font-weight: bold;
    .logo {
        height: 6vh;
        width: 200px;
        object-fit: cover;
    }
`;

const LinkSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const SubscribeSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .inputBtn {
        display: flex;
        align-items: center;
        gap: 20px;
    }
`;

const Input = styled.input`
    border: 1px solid #374151;
    background-color: ${Colors.white};
    padding: 10px;
    font-family: "Epilogue-Regular";
    outline: none;
`;

const SocialIcons = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-start;

    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const IconLink = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${Colors.socialback};
    color: white;
    padding: 10px;
    width: 40px;
    height: 40px;
    transition: color 0.2s;
    border-radius: 50%;

    &:hover {
        color: #4f46e5;
    }
`;

const Copyright = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 10vh;
    border-top: 1px solid #374151;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        height: 15vh;
    }
`;
