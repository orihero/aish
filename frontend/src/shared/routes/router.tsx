import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeView from "../../screens/home/HomeView";
import NotfoundView from "../../screens/notfound/NotfoundView";
import VacancyPreview from "../../screens/vacancyPreview/VacancyPreview";
import VacanciesView from "../../screens/vacancies/VacanciesView";

const AppNavigation = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/vacancy/:id" element={<VacancyPreview />} />
                <Route path="/vacancies" element={<VacanciesView />} />
                <Route path="/*" element={<NotfoundView />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppNavigation;
