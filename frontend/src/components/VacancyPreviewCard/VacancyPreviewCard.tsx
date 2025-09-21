// FrontendInternCard.js
import React, { FC, useCallback, useEffect } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import { VacancyType } from "../../types";
import { observer } from "mobx-react-lite";
import ButtonComp from "../Button/Button";
import ShortInfoJobCard from "../ShortInfoJobCard/ShortInfoJobCard";
import { useNavigate } from "react-router-dom";
import useRootStore from "../../shared/hooks/UseRootStore";
import { DynamicIcon } from "lucide-react/dynamic";
import IconComp from "../../shared/constants/iconBtn";
import { Tag } from "../Tag/Tag";
import Avatar from "../Avatar/Avatar";
import { useTranslation } from "react-i18next";
import { getTranslatedEmploymentType, getTranslatedWorkType, getTranslatedValue } from "../../shared/utils/translationHelpers";

type Props = {
    vacancy: VacancyType;
};

const FrontendInternCard: FC<Props> = ({ vacancy }) => {
    const { vacanciesStore, visibleStore, applicationStore } = useRootStore();
    const navigation = useNavigate();
    const { t } = useTranslation();
    const path = window.location.pathname;
    
    // Check if user has already applied to this vacancy
    const hasApplied = applicationStore.hasAppliedToVacancy(vacancy._id);
    const chatId = applicationStore.getChatIdForVacancy(vacancy._id);

    useEffect(() => {
        const pathArray = path.split("/");
        const id = pathArray[pathArray.length - 1];
        if (id) {
            vacanciesStore.getVacancyById(id);
        }
        window.scrollTo(0, 0);
    }, [path, vacanciesStore]);

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
        if (!vacanciesStore.vacancies?.vacancies?.length) return null;
        return vacanciesStore.vacancies?.vacancies
            .slice(0, 5)
            ?.map((job, index) => {
                return (
                    <ShortInfoJobCard
                        isborder
                        key={index}
                        vacancy={job}
                        onPress={() => handleGetVacancy(job._id)}
                    />
                );
            });
    }, [handleGetVacancy, vacanciesStore.vacancies?.vacancies]);

    return (
        <Container>
            <div className="info-card">
                <div className="work-info">
                    <div className="job-header">
                        <Text
                            text={vacancy.title}
                            textSize="twentyEight"
                            color="#000"
                            family="ClashDisplay-Semibold"
                        />
                        <div className="job-meta">
                            <div className="meta-item">
                                <DynamicIcon name="dollar-sign" size={18} color={Colors.mainBlue} />
                                <span className="meta-label">{t("theSalary")}</span>
                                <span className="meta-value">{vacancy?.salary?.min}-{vacancy?.salary?.max} {vacancy?.salary?.currency}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="job-details">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <DynamicIcon name="briefcase" size={20} color={Colors.mainBlue} />
                            </div>
                            <div className="detail-content">
                                <span className="detail-label">{t("workExperience")}</span>
                                <div>
                                    <Tag text={t("notRequired")} tagType="experience" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <div className="detail-icon">
                                <DynamicIcon name="clock" size={20} color={Colors.mainBlue} />
                            </div>
                            <div className="detail-content">
                                <span className="detail-label">{t("employment")}</span>
                                <div>
                                <Tag text={getTranslatedEmploymentType(vacancy?.employmentType, visibleStore.currentLang)} tagType="employment" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <div className="detail-icon">
                                <DynamicIcon name="map-pin" size={20} color={Colors.mainBlue} />
                            </div>
                            <div className="detail-content">
                                <span className="detail-label">{t("workFormat")}</span>
                                <div>
                                    <Tag text={getTranslatedWorkType(vacancy?.workType, visibleStore.currentLang)} tagType="workFormat" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <div className="detail-icon">
                                <DynamicIcon name="tag" size={20} color={Colors.mainBlue} />
                            </div>
                            <div className="detail-content">
                                <span className="detail-label">{t("category")}</span>
                                <div>
                                    <Tag
                                        text={getTranslatedValue(
                                            vacancy?.category?.title,
                                            visibleStore.currentLang
                                        )}
                                        tagType="category"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="applyBox">
                        <ButtonComp
                            title={hasApplied ? t("goToChat") : t("apply")}
                            onPress={() => {
                                if (hasApplied && chatId) {
                                    // Navigate to chat if already applied
                                    navigation(`/chat/${chatId}`);
                                } else {
                                    // Show apply modal if not applied
                                    applicationStore.respondHandle(vacancy);
                                    visibleStore.show("applyModal");
                                }
                            }}
                            primary
                            className="apply"
                        />
                        <div className="views">
                            <div className="viewsCount">
                                <Text
                                    text={`${vacancy.views}`}
                                    textSize="sixteen"
                                    family="Epilogue-Regular"
                                    color={Colors.textGray}
                                    paddingTop="3px"
                                />
                                <DynamicIcon
                                    name={"file-check"}
                                    size={18}
                                    color={Colors.textGray}
                                />
                            </div>
                            <div className="viewsCount">
                                <Text
                                    text={`${vacancy.views}`}
                                    textSize="sixteen"
                                    family="Epilogue-Regular"
                                    color={Colors.textGray}
                                    paddingTop="3px"
                                />
                                <DynamicIcon
                                    name={"eye"}
                                    size={20}
                                    color={Colors.textGray}
                                />
                            </div>
                            <IconComp
                                icon={
                                    <DynamicIcon
                                        name={"heart"}
                                        size={24}
                                        color={Colors.textGray}
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="company">
                    <div className="company-card">
                        <div className="company-header">
                            <div className="company-logo">
                                <Avatar imageUrl={vacancy?.company?.logo} />
                            </div>
                            <div className="company-info">
                                <Text
                                    text={`${vacancy?.company?.name}`}
                                    textSize="eighteen"
                                    color={Colors.textBlack}
                                    family="ClashDisplay-Semibold"
                                />
                                <div className="company-location">
                                    <DynamicIcon name="map-pin" size={14} color={Colors.textGray} />
                                    <Text
                                        text={`${vacancy?.company?.location.address} ${vacancy?.company?.location.city} ${vacancy?.company?.location.country}`}
                                        textSize="twelve"
                                        color={Colors.textGray}
                                        family="Epilogue-Regular"
                                        margin="0 0 0 4px"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {vacancy?.company?.benefits && vacancy?.company?.benefits.length > 0 && (
                            <div className="company-benefits">
                                <div className="benefits-header">
                                    <DynamicIcon name="gift" size={16} color={Colors.mainBlue} />
                                    <span className="benefits-title">{t("benefits")}</span>
                                </div>
                                <div className="benefits-list">
                                    {vacancy?.company?.benefits?.map((benefit, index) => (
                                        <div key={index} className="benefit-item">
                                            <DynamicIcon name="check-circle" size={14} color={Colors.green} />
                                            <span className="benefit-text">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="job-description">
                <div className="description-header">
                    <DynamicIcon name="file-text" size={20} color={Colors.mainBlue} />
                    <Text
                        text={t("jobDescription")}
                        textSize="twenty"
                        color={Colors.textBlack}
                        family="ClashDisplay-Semibold"
                    />
                </div>
                <div className="description-content">
                    <div className="description-text">
                        {vacancy?.description ? (
                            vacancy.description
                                .split('\n')
                                .filter(paragraph => paragraph.trim() !== '')
                                .map((paragraph, index) => (
                                    <p key={index}>
                                        {paragraph.trim()}
                                    </p>
                                ))
                        ) : (
                            <p className="no-description">
                                {t("noDescriptionAvailable")}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="other-vacancies">
                <Text
                    text={t("theseVacancies")}
                    textSize="twenty"
                    color={Colors.textBlack}
                />
                <div className="other-vacancies-cards">{renderJobs()}</div>
            </div>
        </Container>
    );
};

export default observer(FrontendInternCard);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;

    .info-card {
        display: flex;
        gap: 50px;
    }

    .work-info {
        display: flex;
        flex-direction: column;
        padding: 24px;
        gap: 20px;
        border: 1px solid ${Colors.lineColor};
        border-radius: 20px;
        width: 55%;
        background: ${Colors.white};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .job-header {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 20px;
        border-bottom: 1px solid ${Colors.lineColor};
    }

    .job-meta {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: ${Colors.mainBlueLight};
        border-radius: 12px;
        border: 1px solid rgba(70, 64, 222, 0.1);
    }

    .meta-label {
        font-size: 14px;
        font-weight: 500;
        color: ${Colors.textGray};
    }

    .meta-value {
        font-size: 16px;
        font-weight: 600;
        color: ${Colors.textBlack};
        margin-left: auto;
    }

    .job-details {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .detail-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: ${Colors.light};
        border-radius: 12px;
        border: 1px solid ${Colors.lineColor};
        transition: all 0.2s ease;
        
        &:hover {
            border-color: ${Colors.mainBlue};
            box-shadow: 0 2px 8px rgba(70, 64, 222, 0.1);
        }
    }

    .detail-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: ${Colors.mainBlueLight};
        border-radius: 10px;
        flex-shrink: 0;
    }

    .detail-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
    }

    .detail-label {
        font-size: 14px;
        font-weight: 500;
        color: ${Colors.textGray};
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .company {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 40%;
    }

    .company-card {
        display: flex;
        flex-direction: column;
        border: 1px solid ${Colors.lineColor};
        border-radius: 20px;
        padding: 24px;
        background: ${Colors.white};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        gap: 20px;
    }

    .company-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding-bottom: 20px;
        border-bottom: 1px solid ${Colors.lineColor};
    }

    .company-logo {
        flex-shrink: 0;
    }

    .company-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
    }

    .company-location {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .company-benefits {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .benefits-header {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .benefits-title {
        font-size: 16px;
        font-weight: 600;
        color: ${Colors.textBlack};
    }

    .benefits-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .benefit-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: ${Colors.lightGreen};
        border-radius: 8px;
        border: 1px solid rgba(86, 205, 173, 0.2);
    }

    .benefit-text {
        font-size: 14px;
        color: ${Colors.textBlack};
        font-weight: 500;
    }

    .job-description {
        width: 100%;
        padding: 24px;
        background: ${Colors.white};
        border: 1px solid ${Colors.lineColor};
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        margin: 20px 0;
    }

    .description-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid ${Colors.lineColor};
    }

    .description-content {
        line-height: 1.6;
    }

    .description-text {
        font-size: 16px;
        color: ${Colors.textBlack};
        line-height: 1.6;
        font-family: 'Epilogue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 400;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        
        p {
            margin: 0 0 16px 0;
            
            &:last-child {
                margin-bottom: 0;
            }
        }
        
        ul, ol {
            margin: 0 0 16px 0;
            padding-left: 20px;
            
            li {
                margin-bottom: 8px;
                
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
        
        strong, b {
            font-weight: 600;
        }
        
        em, i {
            font-style: italic;
        }
        
        h1, h2, h3, h4, h5, h6 {
            margin: 20px 0 12px 0;
            font-weight: 600;
            color: ${Colors.textBlack};
            
            &:first-child {
                margin-top: 0;
            }
        }
        
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 18px; }
        h4 { font-size: 16px; }
        h5 { font-size: 14px; }
        h6 { font-size: 12px; }
        
        blockquote {
            margin: 16px 0;
            padding: 12px 16px;
            background: ${Colors.light};
            border-left: 4px solid ${Colors.mainBlue};
            border-radius: 0 8px 8px 0;
        }
        
        code {
            background: ${Colors.light};
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
        }
        
        pre {
            background: ${Colors.light};
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 16px 0;
            
            code {
                background: none;
                padding: 0;
            }
        }
        
        .no-description {
            color: ${Colors.textGray};
            font-style: italic;
            text-align: center;
            padding: 20px;
            background: ${Colors.light};
            border-radius: 8px;
            border: 1px dashed ${Colors.lineColor};
        }
    }

    .apply {
        display: flex;
        justify-content: center;
        width: 200px;
        border-radius: 10px;
    }


    .other-vacancies {
        display: flex;
        flex-direction: column;
        width: 55%;
        margin-top: 50px;
        gap: 20px;
    }

    .other-vacancies-cards {
        display: grid;
        grid-template-columns: 1fr;
        gap: 30px;
        z-index: 1;
    }

    .applyBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin-top: 20px;
    }

    .views {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    .viewsCount {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    @media (max-width: 768px) {
        .other-vacancies {
            width: 100%;
        }

        .info-card {
            flex-direction: column;
            gap: 20px;
        }
        
        .work-info {
            width: 100%;
            padding: 20px;
        }
        
        .company {
            width: 100%;
        }
        
        .company-card {
            padding: 20px;
        }
        
        .job-description {
            width: 100%;
            padding: 20px;
            margin: 16px 0;
        }
        
        .apply {
            width: 100%;
        }

        .company-header {
            gap: 12px;
        }

        .detail-item {
            padding: 12px;
            gap: 12px;
        }

        .detail-icon {
            width: 36px;
            height: 36px;
        }

        .meta-item {
            padding: 10px 12px;
        }
    }
`;
