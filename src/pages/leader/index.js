import React, { useState, useContext } from 'react';
import { Col, Row, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/page';
import { ContextUser } from '../../providers/ContextUser';
import PageVoter from '../../components/voter';
import { api } from '../../providers/apiClient';

const PageLeader = () => {
  const { currentUser } = useContext(ContextUser);
  const navigate = useNavigate();
  const [tab, setTab] = useState('voters');
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
      <Page title="Liderança">
        <div>
          <Tabs
            id="controlled-tabs"
            activeKey={tab}
            onSelect={currentTab => setTab(currentTab)}
          >
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

export default PageLeader;
