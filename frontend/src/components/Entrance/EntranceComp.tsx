import React, { useCallback } from "react";
import styled from "styled-components";
import { Colors } from "../../shared/utils/color";
import Text from "../Text/Text";
import { Images } from "../../shared/assets";
import ButtonComp from "../Button/Button";
import SearchInput from "../SearchInput/SearchInput";
import useRootStore from "../../shared/hooks/UseRootStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EntranceComp = () => {
    const { t } = useTranslation();
    const { vacanciesStore } = useRootStore();
    const navigation = useNavigate();

    const handleSearchPress = useCallback(() => {
        navigation("/vacancies");
        vacanciesStore.getVacanciesByQuery();
    }, [navigation, vacanciesStore]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        vacanciesStore.setFilter("search", e.target.value);
    };
    return (
        <EntranceContainer>
            <div className="left">
                <div>
                    <Text
                        text={t("discoverMoreThan")}
                        textSize="seventy"
                        color={Colors.black}
                        family="ClashDisplay-Semibold"
                    />
                    <Text
                        text={t("jobsCount")}
                        textSize="seventy"
                        color={Colors.secondBlue}
                        family="ClashDisplay-Semibold"
                    />
                    <img src={Images.line} alt="Line" className="line" />
                </div>
                <Text
                    text={t("welcomeMessage")}
                    textSize="fourteen"
                    color={Colors.textColor}
                    family="Epilogue-Regular"
                    lineHeight={24}
                />
                <div className="searchBx">
                    <SearchInput
                        placeholder={t("jobTitleOrKeyword")}
                        className="searchInput"
                        onChange={handleChange}
                    />
                    <ButtonComp
                        title={t("searchMyJob")}
                        primary
                        className="searchBtn"
                        onPress={handleSearchPress}
                    />
                </div>
                <Text
                    text={t("popularSearches")}
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
        background-color: ${Colors.white};
        padding: 10px;
    }

    .line {
        width: 100%;
    }

    .searchInput {
        width: 60%;
    }

    @media (max-width: 768px) {
        .left {
            width: 100%;
        }
        .pattern {
            display: none;
        }
        .pic {
            display: none;
        }
    }

    @media (max-width: 425px) {
        .searchBx {
            flex-direction: column;
            justify-content: center;
            gap: 10px;
        }

        .searchInput {
            width: 100%;
        }

        .searchBtn {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 45px;
        }
    }
`;
