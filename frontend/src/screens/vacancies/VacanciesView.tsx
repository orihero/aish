import React, { useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FilterBar from "../../components/FilterBar/FilterBar";
import FindJobs from "../../components/FindJobs/FindJobs";
import FilterInput from "../../components/FilterInput/FilterInput";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import ApplyModal from "../../components/ApplyModal/ApplyModal";
import UploadResumeModal from "../../components/UploadResumeModal/UploadResumeModal";
import RegisterModal from "../../components/RegisterModal/RegisterModal";

const VacanciesView = () => {
    const { vacanciesStore, visibleStore } = useRootStore();
    useEffect(() => {
        vacanciesStore.getVacancies();
        window.scrollTo(0, 0);
    }, [vacanciesStore]);

    return (
        <Container>
            <Header />
            <div className="vacanciesBody">
                <FilterInput />
                <div className="filterAndJobs">
                    <FilterBar />
                    <FindJobs />
                </div>
            </div>
            <Footer />
            <ApplyModal isShow={visibleStore.visible.applyModal} />{" "}
            <UploadResumeModal
                isShow={visibleStore.visible.createResumeModal}
            />
            <RegisterModal isShow={visibleStore.visible.registerModal} />
            <ApplyModal isShow={visibleStore.visible.applyModal} />
        </Container>
    );
};

export default observer(VacanciesView);

const Container = styled.div`
    position: relative;

    .vacanciesBody {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 12vh 5%;
        gap: 30px;
        height: 100%;
    }

    .filterAndJobs {
        display: grid;
        gap: 50px;
        grid-template-columns: 2fr 5.5fr;
    }

    @media (max-width: 992px) {
        .vacanciesBody {
            gap: 20px;
        }
        .filterAndJobs {
            grid-template-columns: 1.2fr 3fr;
        }
    }

    @media (max-width: 768px) {
        .vacanciesBody {
            gap: 20px;
        }
        .filterAndJobs {
            grid-template-columns: 1fr;
        }
    }
`;
