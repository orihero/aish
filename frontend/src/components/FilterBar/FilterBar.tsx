import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import { observer } from "mobx-react-lite";
import IconComp from "../../shared/constants/iconBtn";
import { DynamicIcon } from "lucide-react/dynamic";
import useRootStore from "../../shared/hooks/UseRootStore";
import { toKebabCase2 } from "../../shared/helper/replicate";
import ButtonComp from "../Button/Button";

const FilterBar = () => {
    const { vacanciesStore } = useRootStore();
    const [isShowFilter, setIsShowFilter] = React.useState(true);
    const [salary, setSalary] = React.useState(500);
    const [currency, setCurrency] = React.useState("$");

    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        if (currency === "so'm") {
            if (salary > 200000000) setSalary(200000000);
        } else {
            if (salary > 200000) setSalary(200000);
        }
    }, [currency, salary]);

    const handleShowFilter = () => {
        setIsShowFilter(!isShowFilter);
    };

    const formatSalary = (value: number) => {
        if (currency === "so'm") {
            return `${value?.toLocaleString("ru-RU").replaceAll(",", " ")}`;
        } else {
            return value?.toLocaleString("en-US");
        }
    };

    const handleEmploymentTypeChange = (type: string) => {
        const existing = vacanciesStore.filters.employmentType;
        if (existing.includes(type)) {
            vacanciesStore.setFilter(
                "employmentType",
                existing.filter((item: string) => item !== type)
            );
        } else {
            vacanciesStore.setFilter("employmentType", [...existing, type]);
        }
    };

    const handleWorkTypeChange = (type: string) => {
        const existing = vacanciesStore.filters.workType;
        if (existing.includes(type)) {
            vacanciesStore.setFilter(
                "workType",
                existing.filter((item: string) => item !== type)
            );
        } else {
            vacanciesStore.setFilter("workType", [...existing, type]);
        }
    };

    const handleSearchPress = useCallback(() => {
        vacanciesStore.getVacanciesByQuery();
    }, [vacanciesStore]);

    return (
        <FilterBarContainer>
            <div className="content">
                <div className="title">
                    <Text
                        text="Filter"
                        textSize="eighteen"
                        color={Colors.textBlack}
                    />
                    <div className="arrowDown">
                        <IconComp
                            onClick={handleShowFilter}
                            icon={
                                <DynamicIcon
                                    name={
                                        isShowFilter
                                            ? "chevron-up"
                                            : "chevron-down"
                                    }
                                />
                            }
                        />
                    </div>
                </div>

                {/* Employment Type */}
                <div
                    className="item"
                    style={{
                        display: !isMobile || isShowFilter ? "flex" : "none",
                    }}
                >
                    <Text
                        text="Employment Type"
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                    {["Full Time", "Part Time", "Contract"].map((type) => (
                        <label
                            className="emplymentType"
                            key={type}
                            htmlFor={type}
                        >
                            <input
                                type="checkbox"
                                id={type}
                                checked={vacanciesStore.filters.employmentType.includes(
                                    toKebabCase2(type)
                                )}
                                onChange={() =>
                                    handleEmploymentTypeChange(
                                        toKebabCase2(type)
                                    )
                                }
                            />
                            <Text
                                text={type}
                                textSize="sixteen"
                                color={Colors.textBlack}
                                family="Epilogue-Regular"
                            />
                        </label>
                    ))}
                </div>

                {/* Work Type */}
                <div
                    className="item"
                    style={{
                        display: !isMobile || isShowFilter ? "flex" : "none",
                    }}
                >
                    <Text
                        text="Work Type"
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                    {["Remote", "Hybrid", "Onsite"].map((type) => (
                        <label
                            className="emplymentType"
                            key={type}
                            htmlFor={type}
                        >
                            <input
                                type="checkbox"
                                id={type}
                                checked={vacanciesStore.filters.workType.includes(
                                    toKebabCase2(type)
                                )}
                                onChange={() =>
                                    handleWorkTypeChange(toKebabCase2(type))
                                }
                            />
                            <Text
                                text={type}
                                textSize="sixteen"
                                color={Colors.textBlack}
                                family="Epilogue-Regular"
                            />
                        </label>
                    ))}
                </div>

                {/* Salary Range */}
                <div
                    className="item"
                    style={{
                        display: !isMobile || isShowFilter ? "flex" : "none",
                    }}
                >
                    <div className="salaryInputWrapper">
                        <Text
                            text="Salary Range"
                            textSize="sixteen"
                            color={Colors.textBlack}
                            margin="5px 0 0 0"
                        />
                        <div>
                            <select
                                className="currencySelect"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <option value="$">$ USD</option>
                                <option value="so'm">so'm UZS</option>
                                <option value="€">€ EUR</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <input
                            type="range"
                            className="range"
                            min={0}
                            max={currency === "so'm" ? 200000000 : 200000}
                            step={10}
                            value={`${vacanciesStore.filters.salaryMax}`}
                            onChange={(e) =>
                                vacanciesStore.setFilter(
                                    "salaryMax",
                                    e.target.value
                                        ? Number(e.target.value)
                                        : null
                                )
                            }
                        />
                        <div className="salaryValue">
                            <Text
                                text={`${currency} 0`}
                                textSize="sixteen"
                                color={Colors.textBlack}
                                family="Epilogue-Regular"
                            />
                            <Text
                                text={`${currency} ${formatSalary(
                                    vacanciesStore.filters.salaryMax as never
                                )}`}
                                textSize="sixteen"
                                color={Colors.textBlack}
                                family="Epilogue-Regular"
                            />
                        </div>
                    </div>
                </div>
                <ButtonComp
                    title="Apply"
                    primary
                    className="applyBtn"
                    onPress={handleSearchPress}
                />
            </div>
        </FilterBarContainer>
    );
};

export default observer(FilterBar);

const FilterBarContainer = styled.div`
    .content {
        display: flex;
        flex-direction: column;
        background-color: ${Colors.white};
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        padding: 20px;
        gap: 25px;
    }

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .arrowDown {
        display: none;
    }

    .item {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .emplymentType {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }

    .range {
        -webkit-appearance: none;
        width: 100%;
        height: 8px;
        background: ${Colors.lineColor};
        border-radius: 5px;
        outline: none;
    }

    .salaryValue {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 10px;
    }

    .salaryInputWrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: relative;
    }

    .currencySelect {
        position: absolute;
        right: 0;
        top: 0;
        padding: 2px 5px;
        border-radius: 5px;
        border: 1px solid ${Colors.lineColor};
        background-color: ${Colors.white};
        font-size: 14px;
        color: ${Colors.textBlack};
        outline: none;
        width: 70px;
    }

    .applyBtn {
        width: 100%;
        display: flex;
        justify-content: center;
        border-radius: 10px;
    }

    @media (max-width: 768px) {
        .arrowDown {
            display: block;
        }
    }
`;
