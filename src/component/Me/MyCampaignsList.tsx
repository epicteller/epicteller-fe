import { Avatar, Button, Card, CardActionArea, CardContent, Chip, Grid, Link, makeStyles, Paper, Tooltip, Typography } from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { indigo } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';
import epAPI from '../../api';
import { Campaign } from '../../store/campaign';
import { globalNotification } from '../../store/globalNotification';
import TimeChip from '../TimeChip';
import MemberChip from '../Member/MemberChip';
import CampaignListSkeleton from '../Skeleton/CampaignListSkeleton';
import { useMe } from '../../hook';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2, 3, 4, 3),
  },
  description: {
  },
  creatorDesc: {
    display: 'flex',
    alignItems: 'center',
  },
  noDescription: {
    fontStyle: 'italic',
  },
  charactersGroup: {
  },
  characters: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    border: '0px',
    backgroundColor: indigo[300],
    color: theme.palette.getContrastText(indigo[300]),
  },
  noCampaigns: {
    marginTop: theme.spacing(4),
  },
}));

const MyCampaignsList = () => {
  const me = useMe();
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      try {
        const response = await epAPI.get('/me/campaigns');
        setCampaigns((response.data?.data as Campaign[]));
        setIsLoading(false);
      } catch (e) {
        const err = e as AxiosError;
        if (err.response?.status! === 401) {
          history.push({ pathname: '/' });
        } else if (err.response?.status! < 500) {
          globalNotification.error(err.response?.data?.message);
        } else {
          globalNotification.error('出错了，请稍后再试');
        }
      }
    };
    fetchMyCampaigns();
  }, []);

  return (
    <Paper className={classes.paper}>
      <Grid container justify="space-between">
        <Typography variant="h6" gutterBottom>我参与的战役</Typography>
        <Tooltip title="咕咕咕.jpg">
          <Button variant="contained" color="primary">
            <AddIcon />
            创建新战役
          </Button>
        </Tooltip>

      </Grid>
      <Grid container spacing={3}>
        {!isLoading && campaigns && campaigns.map((campaign) => (
          <Grid item xs sm={6} md={3}>
            <Card elevation={3}>
              <CardActionArea component={RouterLink} to={`/campaign/${campaign.id}`}>
                <CardContent>
                  <Typography className={classes.creatorDesc} noWrap gutterBottom variant="body2" color="textSecondary">
                    由
                    <MemberChip human={campaign.owner} />
                    创建于
                    <TimeChip timestamp={campaign.created} />
                  </Typography>
                  <Typography noWrap variant="h6">{campaign.name}</Typography>
                  {campaign.description ? (
                    <Typography className={classes.description} noWrap paragraph variant="body2" color="textSecondary">
                      {campaign.description}
                    </Typography>
                  ) : (
                    <Typography className={classes.noDescription} noWrap paragraph variant="body2" color="textSecondary">
                      无描述
                    </Typography>
                  )}
                  <Grid container justify="space-between" alignItems="center">
                    <AvatarGroup className={classes.charactersGroup} max={5} spacing="medium">
                      {campaign.characters?.map((character) => (
                        <Avatar className={classes.characters} src={character.avatar}>
                          <Typography variant="body2" color="textSecondary">
                            {character.name[0]}
                          </Typography>
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    {campaign.relationship?.isGm && (
                      <Chip size="small" label="DM" />
                    )}
                    {!campaign.relationship?.isGm && campaign.relationship?.usingCharacter && (
                      <Chip
                        size="small"
                        avatar={(
                          <Avatar src={campaign.relationship?.usingCharacter?.avatar}>
                            {campaign.relationship?.usingCharacter?.name[0]}
                          </Avatar>
                        )}
                        label={campaign.relationship?.usingCharacter?.name}
                      />
                    )}
                  </Grid>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        {!isLoading && campaigns.length === 0 && (
          <Grid className={classes.noCampaigns} container direction="column" justify="center" alignItems="center">
            <Grid item>
              <Typography variant="h2">🤔</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                看起来你还没有参与过战役
                {!me?.externalInfo?.qq && (
                <>
                  <Typography variant="inherit">，不如先</Typography>
                  <Link component={RouterLink} to="/settings/external">
                    去绑定
                  </Link>
                  <Typography variant="inherit">
                    一下外部帐号？
                  </Typography>
                </>
                )}
              </Typography>
            </Grid>
          </Grid>
        )}
        {isLoading && (
          <CampaignListSkeleton />
        )}
      </Grid>
    </Paper>
  );
};

export default MyCampaignsList;
