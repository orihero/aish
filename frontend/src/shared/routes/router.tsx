import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import HomeView from "../../screens/home/HomeView";
import NotfoundView from "../../screens/notfound/NotfoundView";
import VacancyPreview from "../../screens/vacancyPreview/VacancyPreview";
import VacanciesView from "../../screens/vacancies/VacanciesView";
import useRootStore from "../hooks/UseRootStore";
import ResumePreview from "../../screens/resumePreview/ResumePreview";
import MyProfile from "../../screens/myProfile/MyProfile";
import ApplicationsView from "../../screens/applications/ApplicationsView";
import ChatsView from "../../screens/chats/ChatsView";

const AppNavigation = () => {
    const { session } = useRootStore().localStore;
    const navigation = useNavigate();

    // useEffect(() => {
    //     if (!session.accessToken) {
    //         navigation("/");
    //     }
    // }, [navigation, session.accessToken]);

    return (
        <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/vacancy/:id" element={<VacancyPreview />} />
            <Route path="/vacancies" element={<VacanciesView />} />
            <Route path="/resumePreview" element={<ResumePreview />} />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path="/applications" element={<ApplicationsView />} />
            <Route path="/" element={<ChatsView />} />
            <Route path="/chat/:id" element={<ChatsView />} />
            <Route path="/*" element={<NotfoundView />} />
        </Routes>
    );
};

export default AppNavigation;
