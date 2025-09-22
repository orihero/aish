import React from "react";
import Header from "../../components/Header/Header";
import EntranceComp from "../../components/Entrance/EntranceComp";
import Companies from "../../components/Companies/Companies";
import Categories from "../../components/Categories/Categories";
import AdminBanner from "../../components/AdminBanner/AdminBanner";
import FeaturesJobs from "../../components/FeaturedJobs/FeaturesJobs";
import Footer from "../../components/Footer/Footer";
import LatestJobs from "../../components/LatestJobs/LatestJobs";
import { observer } from "mobx-react-lite";
import UploadResumeModal from "../../components/UploadResumeModal/UploadResumeModal";
import useRootStore from "../../shared/hooks/UseRootStore";
import RegisterModal from "../../components/RegisterModal/RegisterModal";
import ApplyModal from "../../components/ApplyModal/ApplyModal";
import LoginModal from "../../components/LoginModal/LoginModal";
import ForgotPasswordModal from "../../components/ForgotPasswordModal/ForgotPasswordModal";
import ResetPasswordModal from "../../components/ResetPasswordModal/ResetPasswordModal";

const HomeView = () => {
    const { visibleStore } = useRootStore();
    return (
        <div>
            <Header />
            <EntranceComp />
            {/* <Companies /> */}
            <Categories />
            <AdminBanner />
            <FeaturesJobs />
            <LatestJobs />
            <Footer />
            <UploadResumeModal
                isShow={visibleStore.visible.createResumeModal}
            />
            <RegisterModal isShow={visibleStore.visible.registerModal} />
            <ApplyModal isShow={visibleStore.visible.applyModal} />
            <LoginModal isShow={visibleStore.visible.loginModal} />
            <ForgotPasswordModal isShow={visibleStore.visible.forgotPasswordModal} />
            <ResetPasswordModal isShow={visibleStore.visible.resetPasswordModal} />
        </div>
    );
};

export default observer(HomeView);
