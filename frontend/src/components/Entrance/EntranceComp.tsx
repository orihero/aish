import React from "react";
import styled from "styled-components";
import { Colors } from "../../shared/utils/color";
import Text from "../Text/Text";
import { Images } from "../../shared/assets";
import ButtonComp from "../Button/Button";
import SearchInput from "../SearchInput/SearchInput";

const EntranceComp = () => {
    return (
        <EntranceContainer>
            <div className="left">
                <div>
                    <Text
                        text="Discover more than"
                        textSize="seventy"
                        color={Colors.black}
                        family="ClashDisplay-Semibold"
                    />
                    <Text
                        text="5000+ Jobs"
                        textSize="seventy"
                        color={Colors.secondBlue}
                        family="ClashDisplay-Semibold"
                    />
                    <img src={Images.line} alt="Line" />
                </div>
                <Text
                    text="Great platform for the job seeker that searching for new career heights and passionate about startups."
                    textSize="fourteen"
                    color={Colors.textColor}
                    family="Epilogue-Regular"
                    lineHeight={24}
                />
                <div className="searchBx">
                    <SearchInput
                        placeholder="Job title or keyword"
                        width="60%"
                    />
                    <ButtonComp title="Search my job" primary />
                </div>
                <Text
                    text="Popular : UI Designer, UX Researcher, Android, Admin"
                    textSize="fourteen"
                    color={Colors.textBlack}
                    family="Epilogue-Regular"
                />
            </div>
            <img className="pattern" src={Images.walcomePatter} alt="" />
            <img className="pic" src={Images.welcomePic} alt="" />
        </EntranceContainer>
    );
};

export default EntranceComp;

const EntranceContainer = styled.div`
    background-color: ${Colors.light};
    padding: 0 5%;
    height: 100vh;
    display: flex;
    align-items: center;

    .left {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 500px;
        position: relative;
        z-index: 2;
    }
    .pattern {
        position: absolute;
        top: 0;
        right: 0;
        width: 75%;
        z-index: 0;
        height: 100%;
    }
    .pic {
        position: absolute;
        bottom: 0;
        right: 0;
        /* width: 50%; */
        /* height: 80%; */
        z-index: 1;
    }

    .searchBx {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: auto;
        height: 70px;
        background-color: ${Colors.white};
        padding: 0 10px;
    }
`;
