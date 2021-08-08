import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../../api/Api';
import LeagueAdminApi from '../../../../api/LeagueAdminApi';
import SlotsFilled from './SlotsFilled/SlotsFilled';
import { Icon } from '@iconify/react';
import androidFilled from '@iconify/icons-ant-design/android-filled';
import hourglassOutlined from '@iconify/icons-ant-design/hourglass-outlined';
import userAddOutline from '@iconify/icons-ant-design/user-add-outline';
import userGroupAddOutline from '@iconify/icons-ant-design/usergroup-add-outline';

export default function LeagueTiles() {
  const [slotsAvailable, setSlotsAvailable] = useState(0);
  const [slotsFilled, setslotsFilled] = useState(0);
  const [daysRemaining, setdaysRemaining] = useState(0);
  const params = useParams();

  const getLeagueStats = async () => {
    try {
      const leagueStatRequest = LeagueAdminApi.getLeaugeStats(params.leagueId);
      const leagueStatResponse = await Api.performRequest(leagueStatRequest);
      setSlotsAvailable(leagueStatResponse?.data?.slotsAvailable || 0);
      setslotsFilled(leagueStatResponse?.data?.slotsFilled || 0);
      setdaysRemaining(leagueStatResponse?.data?.daysRemaining || 0);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getLeagueStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <SlotsFilled data={slotsAvailable} text="Slots available">
          <Icon icon={userAddOutline} width={24} height={24} />
        </SlotsFilled>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SlotsFilled data={slotsFilled} text="Slots filled">
          <Icon icon={userGroupAddOutline} width={24} height={24} />
        </SlotsFilled>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SlotsFilled data={daysRemaining} text="Days remaining">
          <Icon icon={hourglassOutlined} width={24} height={24} />
        </SlotsFilled>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SlotsFilled>
          <Icon icon={androidFilled} width={24} height={24} />
        </SlotsFilled>
      </Grid>
    </>
  );
}
