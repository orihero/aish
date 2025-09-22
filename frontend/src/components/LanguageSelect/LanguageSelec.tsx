import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import { useTranslation } from "react-i18next";
import { Colors } from "../../shared/utils/color";
import Flag from "../Flag/Flag";
import { FiChevronDown } from "react-icons/fi";

const SelectWrapper = styled.div`
    display: inline-block;
    position: relative;
`;

const DropdownButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
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
    min-width: 90px;
    
    &:hover {
        border-color: ${Colors.mainBlue};
        box-shadow: 0 2px 8px rgba(70, 64, 222, 0.1);
    }
    
    &:focus {
        border-color: ${Colors.mainBlue};
        box-shadow: 0 0 0 3px ${Colors.mainBlueLight};
    }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${Colors.white};
    border: 1px solid ${Colors.lineColor};
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: ${props => props.isOpen ? 'block' : 'none'};
    margin-top: 4px;
`;

const DropdownItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-family: 'Epilogue-Medium', sans-serif;
    color: ${Colors.textBlack};
    
    &:hover {
        background-color: ${Colors.mainBlueLight};
    }
    
    &:first-child {
        border-radius: 12px 12px 0 0;
    }
    
    &:last-child {
        border-radius: 0 0 12px 12px;
    }
    
    &:only-child {
        border-radius: 12px;
    }
`;

const ChevronIcon = styled.span<{ isOpen: boolean }>`
    margin-left: auto;
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const LanguageSelect = () => {
    const { t } = useTranslation();
    const { visibleStore } = useRootStore();
    const [isOpen, setIsOpen] = React.useState(false);

    const languages = [
        { code: 'en', name: t("en") || 'En' },
        { code: 'uz', name: t("uz") || 'Uz' },
        { code: 'ru', name: t("ru") || 'Ru' }
    ];

    const currentLanguage = languages.find(lang => lang.code === visibleStore.currentLang) || languages[0];

    const handleLanguageSelect = (langCode: string) => {
        visibleStore.setLang(langCode);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('[data-language-select]')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <SelectWrapper data-language-select>
            <DropdownButton onClick={toggleDropdown}>
                <Flag countryCode={currentLanguage.code} size={20} />
                <span>{currentLanguage.name}</span>
                <FiChevronDown size={20} />
            </DropdownButton>
            <DropdownMenu isOpen={isOpen}>
                {languages.map((language) => (
                    <DropdownItem
                        key={language.code}
                        onClick={() => handleLanguageSelect(language.code)}
                    >
                        <Flag countryCode={language.code} size={20} />
                        <span>{language.name}</span>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </SelectWrapper>
    );
};

export default observer(LanguageSelect);
