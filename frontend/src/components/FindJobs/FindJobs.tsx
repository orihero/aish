import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import useRootStore from "../../shared/hooks/UseRootStore";
import { observer } from "mobx-react-lite";
import FindJobCard from "../FindJobCard/FindJobCard";
import { useNavigate } from "react-router-dom";
import { DynamicIcon } from "lucide-react/dynamic";

const FindJobs = () => {
    const { vacanciesStore } = useRootStore();
    const navigation = useNavigate();
    const { page } = vacanciesStore.filters;

    const renderJobs = useCallback(() => {
        if (!vacanciesStore.vacancies.vacancies?.length)
            return <p>No jobs found.</p>;

        return vacanciesStore.vacancies.vacancies.map((job, index) => (
            <FindJobCard
                key={index}
                vacancy={job}
                onPress={() =>
                    vacanciesStore.getVacancyById(job._id, () =>
                        navigation(`/vacancy/${job._id}`)
                    )
                }
            />
        ));
    }, [navigation, vacanciesStore]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= vacanciesStore.vacancies.pages) {
            vacanciesStore.setFilter("page", newPage);
            vacanciesStore.getVacanciesByQuery();
        }
    };

    const renderPagination = () => {
        if (vacanciesStore.vacancies.pages <= 1) return null;

        const maxVisiblePages = 8;
        const pageNumbers = [];

        // Always show 1st page
        pageNumbers.push(1);

        if (page > 4) {
            pageNumbers.push("...");
        }

        // Middle pages
        let startPage = Math.max(2, page - 2);
        let endPage = Math.min(vacanciesStore.vacancies.pages - 1, page + 2);

        if (page <= 4) {
            endPage = Math.min(
                vacanciesStore.vacancies.pages - 1,
                maxVisiblePages - 1
            );
        }

        if (page >= vacanciesStore.vacancies.pages - 3) {
            startPage = Math.max(
                2,
                vacanciesStore.vacancies.pages - (maxVisiblePages - 2)
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < vacanciesStore.vacancies.pages - 1) {
            pageNumbers.push("...");
        }

        // Always show last page
        if (vacanciesStore.vacancies.pages > 1) {
            pageNumbers.push(vacanciesStore.vacancies.pages);
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
                    disabled={page === vacanciesStore.vacancies.pages}
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

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;

    button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #eee;

        &.active {
            background-color: #333;
            color: white;
        }

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    }
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
