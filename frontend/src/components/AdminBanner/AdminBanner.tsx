import React from "react";
import styled from "styled-components";
import { Images } from "../../shared/assets";

const AdminBanner = () => {
    return (
        <AdminBannerContainer>
            <img src={Images.adminBanner} alt="Admin banner" />
        </AdminBannerContainer>
    );
};

export default AdminBanner;

const AdminBannerContainer = styled.div`
    height: 60vh;
    padding: 0px 5%;
    margin: 50px 0;

    img {
        width: 100%;
    }

    @media (max-width: 992px) {
        height: 40vh;
    }

    @media (max-width: 768px) {
        height: 20vh;
    }
`;
