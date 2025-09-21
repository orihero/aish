import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import ResetPasswordModal from "../../components/ResetPasswordModal/ResetPasswordModal";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const ResetPasswordView = () => {
    const { visibleStore } = useRootStore();

    useEffect(() => {
        // Show the reset password modal when the page loads
        visibleStore.show("resetPasswordModal");
        
        // Cleanup: hide modal when component unmounts
        return () => {
            visibleStore.hide("resetPasswordModal");
        };
    }, [visibleStore]);

    return (
        <div>
            <Header />
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* This div provides a backdrop for the modal */}
            </div>
            <Footer />
            <ResetPasswordModal isShow={visibleStore.visible.resetPasswordModal} />
        </div>
    );
};

export default observer(ResetPasswordView);
