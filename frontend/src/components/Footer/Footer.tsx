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

const Footer = () => {
    return (
        <FooterContainer>
            <FooterContent>
                <LogoSection>
                    <Logo>
                        <img src={Images.logo2} alt="JobHuntly" />
                    </Logo>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="Great platform for the job seeker that passionate about startups. Find your dream job easier."
                        lineHeight={20}
                    ></Text>
                </LogoSection>
                <LinkSection>
                    <Text
                        textSize="eighteen"
                        color={Colors.white}
                        text="About"
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="Companies"
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="Pricing"
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="Terms"
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="Advice"
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="Privacy Policy"
                    ></Text>
                </LinkSection>

                <LinkSection>
                    <Text
                        textSize="eighteen"
                        color={Colors.white}
                        text="Resources"
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="Help Docs"
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="Guide"
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="Updates"
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="Contact Us"
                    ></Text>
                </LinkSection>

                <SubscribeSection>
                    <Text
                        textSize="eighteen"
                        color={Colors.white}
                        text="Get job notifications"
                    ></Text>
                    <Text
                        textSize="fourteen"
                        color={Colors.lineColor}
                        family="Epilogue-Regular"
                        text="The latest job news, articles, sent to your inbox weekly."
                        lineHeight={20}
                    ></Text>
                    <div className="inputBtn">
                        <Input type="email" placeholder="Email Address" />
                        <ButtonComp title="Subscribe" primary />
                    </div>
                </SubscribeSection>
            </FooterContent>
            <Copyright>
                <Text
                    textSize="fourteen"
                    color={Colors.lineColor}
                    family="Epilogue-Regular"
                    text="2025 @Aish. All rights reserved."
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
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 2fr;
    gap: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        text-align: center;
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
`;
