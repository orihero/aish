import React from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FrontendInternCard from "../../components/VacancyPreviewCard/VacancyPreviewCard";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";

const VacancyPreview = () => {
    const { vacanciesStore } = useRootStore();
    return (
        <Container>
            <Header />
            <div className="body">
                <FrontendInternCard vacancy={vacanciesStore.previewVacancy} />
            </div>
            <Footer />
        </Container>
    );
};

export default observer(VacancyPreview);

const Container = styled.div`
    .body {
        padding: 12vh 5%;
    }
`;
