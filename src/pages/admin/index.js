import React, { useState, useContext, useEffect, useCallback } from 'react';
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
import { MdGroups } from 'react-icons/md';
import {
  FaPercent,
  FaHandshake,
  FaUserCheck,
  FaUserTimes,
  FaUserTag
} from 'react-icons/fa';
import Pillar from '../../components/page/pillar';

import { api } from '../../providers/apiClient';
import styled from 'styled-components';
import GridManagement from '../../components/grid-management';
import { CustomCounter, CustomChartsContainer } from './styles';
import MapWithDensity from '../../components/map';

const PageAdmin = () => {
  const { currentUser, showSnackbar } = useContext(ContextUser);
  const navigate = useNavigate();
  const [tab, setTab] = useState('management');
  const [lawyers, setLawyers] = useState([]);
  const [voters, setVoters] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(200);
  const [totalLawyers, setTotalLawyers] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  async function fetchDashboardData() {
    await api
      .get(`/lawyer/dashboard`)
      .then(response => {
        setDashboardData(response.data);
      })
      .catch(() => {})
      .finally(() => {});
  }

  async function fetchVoters() {
    await api
      .get(`/lawyer/findVoters`)
      .then(response => {
        setVoters(response.data);
      })
      .catch(() => {})
      .finally(() => {});
  }

  const fetchLawyers = useCallback(async () => {
    try {
      const response = await api.get('/lawyer/findLawyers', {
        params: { page, limit, searchQuery: debouncedSearchQuery }
      });
      setLawyers(response.data.lawyers);
      setTotalLawyers(response.data.total);
    } catch (error) {
      console.error('Error fetching lawyers', error);
    }
  }, [page, limit, debouncedSearchQuery]);

  const geocodeAddress = async address => {
    const api_key = '4ba77b554b1d439dbfe94d96e13aa56a';
    const api_url = 'https://api.opencagedata.com/geocode/v1/json';
    const request_url = `${api_url}?key=${api_key}&q=${encodeURIComponent(
      address
    )}&pretty=1&no_annotations=1`;

    try {
      const response = await fetch(request_url);
      if (response.status === 200) {
        const data = await response.json();
        return data.results[0].geometry;
      } else {
        const data = await response.json();
        console.error('Error in geocoding response:', data.status.message);
        return null;
      }
    } catch (error) {
      console.error('Error in geocoding request:', error);
      return null;
    }
  };

  const handleNewVoter = async selectedData => {
    const formattedValues = {
      ownerId: currentUser.id,
      observation: '',
      locations: [] // Adicionar array de localizações
    };

    try {
      for (const data of selectedData) {
        const location = await geocodeAddress(data.address);
        if (location) {
          formattedValues.locations.push({
            id: data.id,
            lat: location.lat,
            lng: location.lng
          });
        } else {
          formattedValues.locations.push({
            id: data.id,
            lat: null,
            lng: null
          });
        }
      }

      const response = await api.post('/lawyer/newVoterFCD', formattedValues);
      showSnackbar('Apoiadores cadastrados com sucesso!', 'success');
      fetchDashboardData();
      fetchLawyers(page, limit, debouncedSearchQuery);
    } catch (error) {
      console.error('Erro na API', error.response?.data?.error);
      showSnackbar(error.response?.data?.error || 'Erro desconhecido', 'error');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery === '') {
        setDebouncedSearchQuery(searchQuery);
        setPage(1);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchLawyers(page, limit, debouncedSearchQuery);
  }, [page, limit, debouncedSearchQuery]);

  const isAdmin = currentUser.role.name === 'ADMIN';

  return (
    <>
      <Page title={isAdmin ? 'Admin' : 'Coordenador'}>
        {isAdmin && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {dashboardData && (
              <MapWithDensity lawyerData={dashboardData.lawyerData} />
            )}
            <CustomCounter>
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
                    {dashboardData?.votersInfo?.totalAcceptedVoters || 0}
                  </span>
                  <span style={{ fontSize: '14px' }}>
                    Apoiadores confirmados
                  </span>
                </div>
              </div>

              <div
                style={{
                  border: '1px solid rgb(222, 226, 230)',
                  backgroundColor: '#e3833d',
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
                <FaUserTag style={{ height: '100%', width: '34px' }} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: '800', fontSize: '24px' }}>
                    {dashboardData?.votersInfo?.totalInProgressVoters || 0}
                  </span>
                  <span style={{ fontSize: '14px' }}>
                    Apoiadores em andamento
                  </span>
                </div>
              </div>

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
                    {dashboardData?.votersInfo?.totalRejectedVoters || 0}
                  </span>
                  <span style={{ fontSize: '14px' }}>Apoiadores recusados</span>
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
                    {dashboardData?.votersInfo?.totalAvailableVoters || 0}
                  </span>
                  <span style={{ fontSize: '14px' }}>Possíveis apoiadores</span>
                </div>
              </div>
            </CustomCounter>
          </div>
        )}

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
              <Form.Control
                type="text"
                placeholder="Buscar dados do apoiador"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                style={{ marginBottom: '10px' }}
              />
              <GridManagement
                lawyerList={lawyers}
                page={page}
                limit={limit}
                totalLawyers={totalLawyers}
                onPageChange={setPage}
                onLimitChange={setLimit}
                setSearchQuery={setSearchQuery}
                handleNewVoter={handleNewVoter}
                fetchDashboardData={fetchDashboardData}
                fetchLawyers={fetchLawyers}
              />
            </Tab>
            {isAdmin && (
              <Tab
                eventKey="managers"
                title="Coordenadores"
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
                <Pillar managedBy={currentUser?.id} />
              </Tab>
            )}
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
                voters={voters}
                fetchVoters={fetchVoters}
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
