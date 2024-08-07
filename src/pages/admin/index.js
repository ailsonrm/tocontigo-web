import React, { useState, useContext, useEffect } from 'react';
import {
  Col,
  Row,
  Tabs,
  Tab,
  ButtonGroup,
  Button,
  Form
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/page';
import { ContextUser } from '../../providers/ContextUser';
import PageVoter from '../../components/voter';
import Pillar from '../../components/page/pillar';
import Leader from '../../components/page/leader';
import GenderChart from '../../components/gender-chart';
import NeighborhoodChart from '../../components/neighborhood-chart';
import AgeChart from '../../components/age-chart';
import ZoneChart from '../../components/zone-chart';
import { MdGroups } from 'react-icons/md';
import {
  FaPercent,
  FaHandshake,
  FaUserCheck,
  FaUserTimes
} from 'react-icons/fa';
import { api } from '../../providers/apiClient';
import styled from 'styled-components';
import GridManagement from '../../components/grid-management';
import {
  CustomCounter,
  CustomChartsContainer,
  CustomTabTitle,
  CustomTabQuantity
} from './styles';

const PageAdmin = () => {
  const { currentUser } = useContext(ContextUser);
  const navigate = useNavigate();
  const [tab, setTab] = useState('management');
  const [isFetching, setIsFetching] = useState(true);
  const [groupMeta, setGroupMeta] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [voters, setVoters] = useState([]);
  const [qtdPillars, setQtdPillars] = useState(0);
  const [qtdLeaders, setQtdLeaders] = useState(0);
  const [qtdVoters, setQtdVoters] = useState(0);

  const handleShowCharts = () => {
    setShowCharts(!showCharts);
  };

  function fetchVoters() {
    api
      .get('/votersTC')
      .then(response => {
        setVoters([]);
        setVoters(response.data);
        setQtdVoters(response.data.length);
        setSearchVoterResult(response.data);
      })
      .catch(() => {})
      .finally(() => {});
  }

  const genderData = [
    dashboardData?.genderInfo?.maleVoters || 0,
    dashboardData?.genderInfo?.femaleVoters || 0
  ];

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
            gap: '10px'
          }}
        >
          <CustomCounter>
            <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: '#e3833d',
                width: '100%',
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
                width: '100%',
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

            {/* <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: '#70bf3b',
                width: '100%',
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
                backgroundColor: '#ef7878',
                width: '100%',
                height: '50px',
                borderRadius: '10px',
                padding: '0 10px',
                color: 'white',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}
            >
              <FaUserTimes style={{ height: '100%', width: '34px' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: '800', fontSize: '24px' }}>
                  {dashboardData?.votersInfo?.totalActiveVoters -
                    dashboardData?.votersInfo?.totalValidatedVoters || 0}
                </span>
                <span style={{ fontSize: '14px' }}>
                  Apoiadore não validados
                </span>
              </div>
            </div> */}

            <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: '#6795f3',
                width: '100%',
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
                <span style={{ fontSize: '14px' }}>Possíveis apoiadores</span>
              </div>
            </div>
          </CustomCounter>

          <CustomChartsContainer>
            <GenderChart data={genderData} />
            <AgeChart data={voters} />
            <ZoneChart data={zoneData} />
          </CustomChartsContainer>
        </div>

        <div>
          <Tabs
            id="controlled-tabs"
            activeKey={tab}
            onSelect={currentTab => setTab(currentTab)}
          >
            <Tab
              eventKey="management"
              title="Gestão"
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
              <GridManagement voterList={voters} />
            </Tab>
            <Tab
              eventKey="pillars"
              title={
                <CustomTabTitle>
                  {qtdPillars > 0 ? (
                    <CustomTabQuantity value={qtdPillars}>
                      {qtdPillars}
                    </CustomTabQuantity>
                  ) : null}
                  Pilares
                </CustomTabTitle>
              }
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
                setQtdPillars={setQtdPillars}
              />
            </Tab>
            <Tab
              eventKey="leaders"
              title={
                <CustomTabTitle>
                  {qtdLeaders > 0 ? (
                    <CustomTabQuantity value={qtdLeaders}>
                      {qtdLeaders}
                    </CustomTabQuantity>
                  ) : null}
                  Lideranças
                </CustomTabTitle>
              }
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
                setQtdLeaders={setQtdLeaders}
              />
            </Tab>
            <Tab
              eventKey="voters"
              title={
                <CustomTabTitle>
                  {qtdVoters > 0 ? (
                    <CustomTabQuantity value={qtdVoters}>
                      {qtdVoters}
                    </CustomTabQuantity>
                  ) : null}
                  Apoiadores
                </CustomTabTitle>
              }
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
                voters={voters}
                fetchVoters={fetchVoters}
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
