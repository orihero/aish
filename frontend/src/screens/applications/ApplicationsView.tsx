import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header/Header";
import Text from "../../components/Text/Text";
import { Colors } from "../../shared/utils/color";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import ApplicationCard from "../../components/ApplicationCard/ApplicationCard";
import { useNavigate } from "react-router-dom";
import MessageBox from "../../components/MessageBox/MessageBox";
import SpinLoading from "../../components/SpinLoading/SpinLoading";
import { ApplicationType } from "../../types";
import LoginModal from "../../components/LoginModal/LoginModal";

const ApplicationsView = () => {
    const { applicationStore, chatStore, visibleStore } = useRootStore();
    const navigation = useNavigate();

    useEffect(() => {
        applicationStore.getMyApplications();
    }, [applicationStore]);

    const getChats = useCallback(
        (id: string) => {
            chatStore.getMyChats();
            navigation(`/chat/${id}`);
        },
        [chatStore, navigation]
    );

    const renderApplicationCard = useCallback(() => {
        return applicationStore.loadings.isGettingMyApplicationsLoading ? (
            <SpinLoading size="large" />
        ) : applicationStore.myApplications?.length === 0 ? (
            <MessageBox title="No applications yet" />
        ) : (
            applicationStore.myApplications?.map(
                (item: ApplicationType, index) => {
                    return (
                        <ApplicationCard
                            key={index}
                            application={item}
                            goToChat={() => getChats(item.chat._id)}
                        />
                    );
                }
            )
        );
    }, [
        applicationStore.loadings.isGettingMyApplicationsLoading,
        applicationStore.myApplications,
        getChats,
    ]);

    return (
        <ApplicationsViewContainer>
            <Header />
            <div className="box">
                <div className="bItem">
                    <Text
                        text="Applications and invitations"
                        textSize="twentyEight"
                        color={Colors.textBlack}
                    />
                </div>
                <div className="apps">{renderApplicationCard()}</div>
            </div>
            <LoginModal isShow={visibleStore.visible.loginModal} />
        </ApplicationsViewContainer>
    );
};

export default observer(ApplicationsView);

const ApplicationsViewContainer = styled.div`
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

    .apps {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
`;
