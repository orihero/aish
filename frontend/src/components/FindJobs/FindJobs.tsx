import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import useRootStore from "../../shared/hooks/UseRootStore";
import { observer } from "mobx-react-lite";
import FindJobCard from "../FindJobCard/FindJobCard";
import { useNavigate } from "react-router-dom";
import { DynamicIcon } from "lucide-react/dynamic";
import { VacancyType } from "../../types";
import SpinLoading from "../SpinLoading/SpinLoading";
import MessageBox from "../MessageBox/MessageBox";
import { useTranslation } from "react-i18next";
import { toJS } from "mobx";

const FindJobs = () => {
    const { vacanciesStore, visibleStore, applicationStore } = useRootStore();
    const navigation = useNavigate();
    const { page } = vacanciesStore.filters;
    const { t } = useTranslation();
    console.log("vacanciesStore.vacancies", toJS(vacanciesStore.vacancies));

    // Load data when component mounts
    useEffect(() => {
        applicationStore.getMyApplications();
        vacanciesStore.getVacanciesByQuery();
    }, [applicationStore, vacanciesStore]);

    const onApplyHandle = useCallback(
        (vacancy: VacancyType) => {
            applicationStore.respondHandle(vacancy);
            visibleStore.show("applyModal");
        },
        [applicationStore, visibleStore]
    );

    const handleGetVacancy = useCallback(
        (id: string) => {
            navigation(`/vacancy/${id}`);
            vacanciesStore.findVacancyById(id, "findJobs", () =>
                vacanciesStore.getVacancyById(id)
            );
        },
        [navigation, vacanciesStore]
    );

    const renderJobs = useCallback(() => {
        // Show loading if we're fetching data
        if (vacanciesStore.loadings.getVacanciesByQuery) {
            return <SpinLoading size="large" />;
        }
        
        // Show empty state only if we have no data and we're not loading
        // Also check if we have actually tried to load data (vacancies object exists)
        if (!vacanciesStore.vacancies?.vacancies || vacanciesStore.vacancies.vacancies.length === 0) {
            // Only show empty state if we have a vacancies object (meaning we've made at least one request)
            if (vacanciesStore.vacancies && Object.keys(vacanciesStore.vacancies).length > 0) {
                return <MessageBox title={t("noVacanciesYet")} />;
            }
            // If we don't have vacancies object yet, show loading (initial state)
            return <SpinLoading size="large" />;
        }
        
        // Render jobs
        return vacanciesStore.vacancies.vacancies.map((job, index) => {
            return (
                <FindJobCard
                    key={index}
                    vacancy={job}
                    onPress={() => handleGetVacancy(job._id)}
                    respondPress={() => onApplyHandle(job)}
                />
            );
        });
    }, [handleGetVacancy, onApplyHandle, t, vacanciesStore.loadings.getVacanciesByQuery, vacanciesStore.vacancies]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= vacanciesStore.vacancies.totalPages) {
            vacanciesStore.setFilter("page", newPage);
            vacanciesStore.getVacanciesByQuery();
        }
    };

    const renderPagination = () => {
        if (
            vacanciesStore.vacancies.totalPages <= 1 ||
            !vacanciesStore.vacancies?.vacancies?.length
        )
            return null;

        const maxVisiblePages = 8;
        const pageNumbers = [];

        // Always show 1st page
        pageNumbers.push(1);

        if (page > 4) {
            pageNumbers.push("...");
        }

        // Middle pages
        let startPage = Math.max(2, page - 2);
        let endPage = Math.min(vacanciesStore.vacancies.totalPages - 1, page + 2);

        if (page <= 4) {
            endPage = Math.min(
                vacanciesStore.vacancies.totalPages - 1,
                maxVisiblePages - 1
            );
        }

        if (page >= vacanciesStore.vacancies.totalPages - 3) {
            startPage = Math.max(
                2,
                vacanciesStore.vacancies.totalPages - (maxVisiblePages - 2)
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < vacanciesStore.vacancies.totalPages - 1) {
            pageNumbers.push("...");
        }

        // Always show last page
        if (vacanciesStore.vacancies.totalPages > 1) {
            pageNumbers.push(vacanciesStore.vacancies.totalPages);
        }

        return (
            <StyledPagination>
                <PageButton
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                >
                    <DynamicIcon name="chevron-left" size={18} />
                </PageButton>

                {pageNumbers.map((p, i) =>
                    p === "..." ? (
                        <Ellipsis key={`ellipsis-${i}`}>...</Ellipsis>
                    ) : (
                        <PageButton
                            key={p}
                            className={p === page ? "active" : ""}
                            onClick={() => handlePageChange(p as number)}
                        >
                            {p}
                        </PageButton>
                    )
                )}

                <PageButton
                    disabled={page === vacanciesStore.vacancies.totalPages}
                    onClick={() => handlePageChange(page + 1)}
                >
                    <DynamicIcon name="chevron-right" size={18} />
                </PageButton>
            </StyledPagination>
        );
    };

    return (
        <Container>
            {renderJobs()}
            {renderPagination()}
        </Container>
    );
};

export default observer(FindJobs);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const StyledPagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
`;

const PageButton = styled.button`
    padding: 8px 12px;
    border-radius: 999px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    color: #374151;
    font-weight: 500;
    transition: all 0.2s ease;

    &.active {
        background: #e5e7eb;
        font-weight: bold;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const Ellipsis = styled.span`
    padding: 0 6px;
    color: #9ca3af;
`;
