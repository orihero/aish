import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeView from "../../screens/home/HomeView";
import NotfoundView from "../../screens/notfound/NotfoundView";

const AppNavigation = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/*" element={<NotfoundView />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppNavigation;
