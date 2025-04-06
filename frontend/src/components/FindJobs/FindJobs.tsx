import React, { useCallback } from "react";
import styled from "styled-components";
import useRootStore from "../../shared/hooks/UseRootStore";
import { observer } from "mobx-react-lite";
import FindJobCard from "../FindJobCard/FindJobCard";

const FindJobs = () => {
    const { vacanciesStore } = useRootStore();

    const renderJobs = useCallback(() => {
        if (!vacanciesStore.vacancies?.vacancies?.length) return null;
        return vacanciesStore.vacancies.vacancies.map((job, index) => {
            return <FindJobCard key={index} vacancy={job} />;
        });
    }, [vacanciesStore.vacancies]);

    return <Container>{renderJobs()}</Container>;
};

export default observer(FindJobs);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;
