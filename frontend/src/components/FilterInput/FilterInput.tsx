import { DynamicIcon } from "lucide-react/dynamic";
import React, { useCallback } from "react";
import styled from "styled-components";
import ButtonComp from "../Button/Button";
import { Colors } from "../../shared/utils/color";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";

const FilterInput = () => {
    const { vacanciesStore } = useRootStore();

    const handleSearchPress = useCallback(() => {
        vacanciesStore.getVacanciesByQuery();
    }, [vacanciesStore]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        vacanciesStore.setFilter("search", e.target.value);
    };

    return (
        <Container>
            <div className="input">
                <DynamicIcon name="search" size={24} color={Colors.textGray} />
                <input
                    type="text"
                    placeholder="Profession, position or company"
                    value={vacanciesStore.filters.search}
                    onChange={handleChange}
                />
            </div>
            <ButtonComp
                title="Search"
                primary
                className="searchBtn"
                onPress={handleSearchPress}
            />
        </Container>
    );
};

export default observer(FilterInput);

const Container = styled.div`
    display: grid;
    grid-template-columns: auto 150px;
    gap: 20px;

    .input {
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 10px;
        padding: 12px;
        border: 1px solid ${Colors.lineColor};

        input {
            border: none;
            outline: none;
            background-color: transparent;
            width: 100%;
            font-size: 16px;
            color: ${Colors.textBlack};
            font-family: "Epilogue-Regular";
        }
    }

    .searchBtn {
        border-radius: 10px;
        display: flex;
        justify-content: center;
    }

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
        gap: 10px;

        .input {
            width: 100%;
        }

        .searchBtn {
            width: 100%;
        }
    }
`;
