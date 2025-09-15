import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import { useTranslation } from "react-i18next";
import { Colors } from "../../shared/utils/color";

const SelectWrapper = styled.div`
    display: inline-block;
    position: relative;
`;

const StyledSelect = styled.select`
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid ${Colors.lineColor};
    background-color: ${Colors.white};
    border-radius: 12px;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    font-family: 'Epilogue-Medium', sans-serif;
    color: ${Colors.textBlack};
    min-width: 80px;
    
    &:hover {
        border-color: ${Colors.mainBlue};
        box-shadow: 0 2px 8px rgba(70, 64, 222, 0.1);
    }
    
    &:focus {
        border-color: ${Colors.mainBlue};
        box-shadow: 0 0 0 3px ${Colors.mainBlueLight};
    }
    
    option {
        padding: 8px;
        background-color: ${Colors.white};
        color: ${Colors.textBlack};
    }
`;

const LanguageSelect = () => {
    const { t } = useTranslation();
    const { visibleStore } = useRootStore();
    const handleChange = (e: any) => {
        const lang = e.target?.value;
        visibleStore.setLang(lang);
    };

    return (
        <SelectWrapper>
            <StyledSelect
                value={visibleStore.currentLang}
                onChange={handleChange}
            >
                <option value="en">🇬🇧 {t("en")}</option>
                <option value="uz">🇺🇿 {t("uz")}</option>
                <option value="ru">🇷🇺 {t("ru")}</option>
                <option value="uk">🇺🇦 {t("uk")}</option>
            </StyledSelect>
        </SelectWrapper>
    );
};

export default observer(LanguageSelect);
