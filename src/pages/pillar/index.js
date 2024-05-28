import React, { useState, useContext } from 'react';
import { Col, Row, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/page';
import { ContextUser } from '../../providers/ContextUser';
import PageVoter from '../../components/voter';
import Leader from '../../components/page/leader';
import { api } from '../../providers/apiClient';

const PagePillar = () => {
  const { currentUser } = useContext(ContextUser);
  const navigate = useNavigate();
  const [tab, setTab] = useState('leaders');
  const [isFetching, setIsFetching] = useState(true);
  const [voters, setVoters] = useState([]);

  function fetchVoters() {
    api
      .get('/votersTC')
      .then(response => {
        setVoters([]);
        setVoters(response.data);
        setSearchVoterResult(response.data);
      })
      .catch(() => {})
      .finally(() => {});
  }

  return (
    <>
      <Page title="Pilar">
        <div>
          <Tabs
            id="controlled-tabs"
            activeKey={tab}
            onSelect={currentTab => setTab(currentTab)}
          >
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
              <Leader managedBy={currentUser?.id} />
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
                voters={voters}
                fetchVoters={fetchVoters}
                ownerId={currentUser?.id}
              />
            </Tab>
          </Tabs>
        </div>
      </Page>
    </>
  );
};

export default PagePillar;
