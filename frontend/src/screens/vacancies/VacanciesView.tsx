import React from "react";
import styled from "styled-components";
import Text from "../../components/Text/Text";
import { Colors } from "../../shared/utils/color";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FilterBar from "../../components/FilterBar/FilterBar";
import FindJobs from "../../components/FindJobs/FindJobs";

const VacanciesView = () => {
    return (
        <Container>
            <Header />
            <Text
                text="Vacancies"
                textSize="thirtySix"
                color={Colors.textBlack}
                family="ClashDisplay-Semibold"
            />
            <div className="body">
                <FilterBar />
                <FindJobs />
            </div>
            <Footer />
        </Container>
    );
};

export default VacanciesView;

const Container = styled.div`
    .body {
        padding: 12vh 5%;
        display: grid;
        grid-template-columns: 1fr 4fr;
        gap: 30px;
    }
`;
