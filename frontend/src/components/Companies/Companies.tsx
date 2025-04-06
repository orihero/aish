import React from "react";
import { Logos } from "../../shared/assets";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";

const Companies = () => {
    return (
        <CompaniesContainer>
            <Text
                text="Companies we helped grow"
                textSize="sixteen"
                color={Colors.textGray}
            />
            <div className="logos">
                <img src={Logos.fodafone} alt="Company logo" />
                <img src={Logos.intel} alt="Company logo" />
                <img src={Logos.tesla} alt="Company logo" />
                <img src={Logos.amd} alt="Company logo" />
                <img src={Logos.talkit} alt="Company logo" />
            </div>
        </CompaniesContainer>
    );
};

export default Companies;

const CompaniesContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 60px 5%;
    gap: 30px;

    .logos {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }

    @media (max-width: 768px) {
        padding: 60px 4%;

        .logos {
            justify-content: center;
            gap: 30px;
        }
    }

    @media (max-width: 425px) {
        padding: 60px 3%;
    }
`;
