import React, { useState, useContext, useEffect } from 'react';
import { Col, Row, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/page';
import { ContextUser } from '../../providers/ContextUser';
import PageVoter from '../../components/voter';
import Pillar from '../../components/page/pillar';
import GenderChart from '../../components/gender-chart';
import NeighborhoodChart from '../../components/neighborhood-chart';
import SchoolChart from '../../components/school-chart';
import { MdGroups } from 'react-icons/md';
import { FaPercent } from 'react-icons/fa';
import { FaHandshake } from 'react-icons/fa';
import { api } from '../../providers/apiClient';

const PageAdmin = () => {
  const { currentUser } = useContext(ContextUser);
  const navigate = useNavigate();
  const [tab, setTab] = useState('pillars');
  const [isFetching, setIsFetching] = useState(true);
  const [groupMeta, setGroupMeta] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);

  const genderData = [dashboardData?.maleVoters ||0, dashboardData?.femaleVoters ||0];
  const neighborhoodData = {
    labels: ['Primavera', 'São João', 'Paraíso', 'Soberana'],
    values: [8, 16, 21, 27]
  };
  const schollData = {
    labels: ['Escola 1', 'Escola 2', 'Escola 3'],
    values: [1, 2, 3]
  };

  async function fetchDashboardData() {
    await api
      .get(`/usersTC/dashboard`)
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: 'rgb(221 167 0)',
                width: '250px',
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
                <spam style={{ fontWeight: '800', fontSize: '24px' }}>
                  {dashboardData?.groupMeta || 0}
                </spam>
                <spam style={{ fontSize: '14px' }}>Meta do grupo</spam>
              </div>
            </div>

            <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: '#70bf3b',
                width: '250px',
                height: '50px',
                borderRadius: '10px',
                padding: '0 10px',
                color: 'white',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}
            >
              <FaPercent style={{ height: '100%', width: '30px' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <spam style={{ fontWeight: '800', fontSize: '24px' }}>
                  {`${dashboardData?.percentMeta || 0}%`}
                </spam>
                <spam style={{ fontSize: '14px' }}>Meta atingida</spam>
              </div>
            </div>
            <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: '#6795f3',
                width: '250px',
                height: '50px',
                borderRadius: '10px',
                padding: '0 10px',
                color: 'white',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}
            >
              <FaHandshake style={{ height: '100%', width: '50px' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <spam style={{ fontWeight: '800', fontSize: '24px' }}>
                  {dashboardData?.totalActiveVoters || 0}
                </spam>
                <spam style={{ fontSize: '14px' }}>Votos ganhos</spam>
              </div>
            </div>
            <div
              style={{
                border: '1px solid rgb(222, 226, 230)',
                backgroundColor: '#ef7878',
                width: '250px',
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
                <spam style={{ fontWeight: '800', fontSize: '24px' }}>
                {dashboardData?.totalActiveVoters || 0}
                </spam>
                <spam style={{ fontSize: '14px' }}>Votos possíveis</spam>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <GenderChart data={genderData} />
            <NeighborhoodChart data={neighborhoodData} />
            <SchoolChart data={schollData} />
          </div>
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
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px'
              }}
            >
              <Pillar managedBy={currentUser?.id} fetchDashboardData={fetchDashboardData}/>
            </Tab>
            <Tab
              eventKey="voters"
              title="Apoiadores"
              style={{
                padding: '10px',
                border: '1px solid #dee2e6',
                borderTop: '0px',
                marginTop: 0,
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px'
              }}
            >
              <PageVoter ownerId={currentUser?.id} fetchDashboardData={fetchDashboardData}/>
            </Tab>
          </Tabs>
        </div>
      </Page>
    </>
  );
};

export default PageAdmin;
