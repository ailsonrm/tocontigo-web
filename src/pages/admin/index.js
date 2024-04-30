import React, { useState, useContext, useEffect } from 'react';
import { Col, Row, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/page';
import { ContextUser } from '../../providers/ContextUser';
import PageVoter from '../../components/voter';
import Pillar from '../../components/page/pillar';
import Leader from '../../components/page/leader';
import GenderChart from '../../components/gender-chart';
import NeighborhoodChart from '../../components/neighborhood-chart';
import SchoolChart from '../../components/zone-chart';
import { MdGroups } from 'react-icons/md';
import { FaPercent, FaHandshake, FaUserCheck } from 'react-icons/fa';
import { api } from '../../providers/apiClient';
import styled from 'styled-components';

const CustomCounter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 470px) {
    flex-direction: column;
  }
`;

const CustomChartsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (max-width: 470px) {
    flex-direction: column;
  }
`;

const PageAdmin = () => {
  const { currentUser } = useContext(ContextUser);
  const navigate = useNavigate();
  const [tab, setTab] = useState('pillars');
  const [isFetching, setIsFetching] = useState(true);
  const [groupMeta, setGroupMeta] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);

  const genderData = [
    dashboardData?.genderInfo?.maleVoters || 0,
    dashboardData?.genderInfo?.femaleVoters || 0
  ];

  const neighborhoodData = {
    labels: ['Primavera', 'São João', 'Paraíso', 'Soberana'],
    values: [8, 16, 21, 27]
  };

  const zoneData = {
    labels: dashboardData?.zoneInfo?.labels || [],
    values: dashboardData?.zoneInfo?.values || []
  };

  async function fetchDashboardData() {
    await api
      .get(`/votersTC/dashboard`)
      .then(response => {
        setDashboardData(response.data);
      })
      .catch(() => {})
      .finally(() => {});
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <Page title="Admin">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <CustomCounter>
            <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: '#ef7878',
                minWidth: '250px',
                height: '50px',
                borderRadius: '10px',
                padding: '0 10px',
                color: 'white',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}
            >
              <MdGroups style={{ height: '100%', width: '50px' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: '800', fontSize: '24px' }}>
                  {dashboardData?.metaInfo?.groupMeta || 0}
                </span>
                <span style={{ fontSize: '14px' }}>Meta do grupo</span>
              </div>
            </div>

            <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: '#dda700',
                minWidth: '250px',
                height: '50px',
                borderRadius: '10px',
                padding: '0 10px',
                color: 'white',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}
            >
              <FaPercent style={{ height: '100%', width: '25px' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: '800', fontSize: '24px' }}>
                  {`${dashboardData?.metaInfo?.percentMeta || 0}%`}
                </span>
                <span style={{ fontSize: '14px' }}>Meta atingida</span>
              </div>
            </div>

            <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: '#70bf3b',
                minWidth: '250px',
                height: '50px',
                borderRadius: '10px',
                padding: '0 10px',
                color: 'white',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}
            >
              <FaUserCheck style={{ height: '100%', width: '34px' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: '800', fontSize: '24px' }}>
                  {dashboardData?.votersInfo?.totalValidatedVoters || 0}
                </span>
                <span style={{ fontSize: '14px' }}>Apoiadores validados</span>
              </div>
            </div>

            <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: '#6795f3',
                minWidth: '250px',
                height: '50px',
                borderRadius: '10px',
                padding: '0 10px',
                color: 'white',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}
            >
              <FaHandshake style={{ height: '100%', width: '45px' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: '800', fontSize: '24px' }}>
                  {dashboardData?.votersInfo?.totalActiveVoters || 0}
                </span>
                <span style={{ fontSize: '14px' }}>Votos possíveis</span>
              </div>
            </div>
          </CustomCounter>

          <CustomChartsContainer>
            <GenderChart data={genderData} />
            <NeighborhoodChart data={neighborhoodData} />
            <SchoolChart data={zoneData} />
          </CustomChartsContainer>
        </div>

        <div>
          <Tabs
            id="controlled-tabs"
            activeKey={tab}
            onSelect={currentTab => setTab(currentTab)}
          >
            <Tab
              eventKey="pillars"
              title="Pilares"
              style={{
                padding: '10px',
                border: '1px solid #dee2e6',
                borderTop: '0px',
                marginTop: 0,
                marginBottom: '10px',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px'
              }}
            >
              <Pillar
                managedBy={currentUser?.id}
                fetchDashboardData={fetchDashboardData}
              />
            </Tab>
            <Tab
              eventKey="leaders"
              title="Lideranças"
              style={{
                padding: '10px',
                border: '1px solid #dee2e6',
                borderTop: '0px',
                marginTop: 0,
                marginBottom: '10px',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px'
              }}
            >
              <Leader
                managedBy={currentUser?.id}
                fetchDashboardData={fetchDashboardData}
              />
            </Tab>
            <Tab
              eventKey="voters"
              title="Apoiadores"
              style={{
                padding: '10px',
                border: '1px solid #dee2e6',
                borderTop: '0px',
                marginTop: 0,
                marginBottom: '10px',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px'
              }}
            >
              <PageVoter
                ownerId={currentUser?.id}
                fetchDashboardData={fetchDashboardData}
              />
            </Tab>
          </Tabs>
        </div>
      </Page>
    </>
  );
};

export default PageAdmin;
