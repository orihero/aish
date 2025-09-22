import React, { useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FrontendInternCard from "../../components/VacancyPreviewCard/VacancyPreviewCard";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import ApplyModal from "../../components/ApplyModal/ApplyModal";
import LoginModal from "../../components/LoginModal/LoginModal";
import ForgotPasswordModal from "../../components/ForgotPasswordModal/ForgotPasswordModal";

const VacancyPreview = () => {
    const { vacanciesStore, visibleStore, applicationStore } = useRootStore();
    
    // Load applications when component mounts
    useEffect(() => {
        applicationStore.getMyApplications();
    }, [applicationStore]);
    
    return (
        <Container>
            <Header />
            <div className="body">
                <FrontendInternCard vacancy={vacanciesStore.previewVacancy} />
            </div>
            <ApplyModal isShow={visibleStore.visible.applyModal} />
            <LoginModal isShow={visibleStore.visible.loginModal} />
            <ForgotPasswordModal isShow={visibleStore.visible.forgotPasswordModal} />
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
