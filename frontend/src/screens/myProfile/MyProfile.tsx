import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Text from "../../components/Text/Text";
import { Colors } from "../../shared/utils/color";
import useRootStore from "../../shared/hooks/UseRootStore";
import { observer } from "mobx-react-lite";
import ResumeCard from "../../components/ResumeCard/ResumeCard";
import PersonalInfoCard from "../../components/PersonalInfoCard/PersonalInfoCard";
import SpinLoading from "../../components/SpinLoading/SpinLoading";
import MessageBox from "../../components/MessageBox/MessageBox";
import EditPersonalInfoModal from "../../components/EditPersonalInfoModal/EditPersonalInfoModal";
import { useTranslation } from "react-i18next";

const MyProfile = () => {
    const { resumeStore, authStore, visibleStore } = useRootStore();
    const { t } = useTranslation();

    useEffect(() => {
        resumeStore.getResumeMy();
    }, [resumeStore]);

    const renderResumeCards = useCallback(() => {
        return resumeStore.loadings.isGettingMyResumesLoading ? (
            <SpinLoading size="large" />
        ) : resumeStore.myResumesState?.length === 0 ? (
            <MessageBox title={t("noResumesYet")} />
        ) : (
            resumeStore.myResumesState?.map((item, index) => {
                return <ResumeCard resume={item} key={index} />;
            })
        );
    }, [resumeStore.loadings.isGettingMyResumesLoading, resumeStore.myResumesState, t]);

    return (
        <MyProfileContainer>
            <Header />
            <div className="box">
                <div className="bItem">
                    <Text
                        text={t("profile")}
                        textSize="twentyEight"
                        color={Colors.textBlack}
                    />
                    <Text
                        text={t("managePersonalInfo")}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                </div>
                <div className="bItem">
                    <Text
                        text={t("personalInformation")}
                        textSize="twenty"
                        color={Colors.textGray}
                    />
                    <PersonalInfoCard user={authStore.user} />
                </div>
                <div className="bItem">
                    <Text
                        text={t("resumes")}
                        textSize="twenty"
                        color={Colors.textGray}
                    />
                    {renderResumeCards()}
                </div>
            </div>
            <EditPersonalInfoModal 
                isShow={visibleStore.visible.editPersonalInfoModal} 
            />
        </MyProfileContainer>
    );
};

export default observer(MyProfile);

const MyProfileContainer = styled.div`
    padding: 10vh 0;
    .box {
        padding: 30px 5%;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    .bItem {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
`;
