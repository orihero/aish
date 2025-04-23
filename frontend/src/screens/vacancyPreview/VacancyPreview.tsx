import React from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FrontendInternCard from "../../components/VacancyPreviewCard/VacancyPreviewCard";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import ApplyModal from "../../components/ApplyModal/ApplyModal";

const VacancyPreview = () => {
    const { vacanciesStore, visibleStore } = useRootStore();
    return (
        <Container>
            <Header />
            <div className="body">
                <FrontendInternCard vacancy={vacanciesStore.previewVacancy} />
            </div>
            <ApplyModal isShow={visibleStore.visible.applyModal} />
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
