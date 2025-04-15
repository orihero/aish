import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import { useTranslation } from "react-i18next";

const SelectWrapper = styled.div`
    display: inline-block;
`;

const StyledSelect = styled.select`
    padding: 5px;
    font-size: 16px;
    border: none;
    background-color: transparent;
    border-radius: 8px;
    cursor: pointer;
    outline: none;
    &:focus {
        border-color: #4a90e2;
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
                {/* <option value="en">🇬🇧 {t("en")}</option>
                <option value="uz">🇺🇿 {t("uz")}</option>
                <option value="ru">🇷🇺 {t("ru")}</option>
                <option value="uk">🇺🇦 {t("uk")}</option> */}
            </StyledSelect>
        </SelectWrapper>
    );
};

export default observer(LanguageSelect);
