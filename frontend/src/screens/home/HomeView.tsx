import React from "react";
import Header from "../../components/Header/Header";
import EntranceComp from "../../components/Entrance/EntranceComp";
import Companies from "../../components/Companies/Companies";
import Categories from "../../components/Categories/Categories";
import AdminBanner from "../../components/AdminBanner/AdminBanner";
import FeaturesJobs from "../../components/FeaturedJobs/FeaturesJobs";
import Footer from "../../components/Footer/Footer";
import LatestJobs from "../../components/LatestJobs/LatestJobs";

const HomeView = () => {
    return (
        <div>
            <Header />
            <EntranceComp />
            <Companies />
            <Categories />
            <AdminBanner />
            <FeaturesJobs />
            <LatestJobs />
            <Footer />
        </div>
    );
};

export default HomeView;
