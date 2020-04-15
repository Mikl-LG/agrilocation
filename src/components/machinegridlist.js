import React from 'react';
import 'typeface-roboto';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  icon: {
    color: 'white',
  },
}));

export default function Machinegridlist({handleMachineAction,machine_catalog}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto',textAlign:'left' }}>
        </GridListTile>
        {
        machine_catalog&&machine_catalog.map((machine) => (
          <GridListTile key={machine.id} cols={1}>
            <img src={machine.image_url} alt={machine.type} />
            <GridListTileBar
              title={machine.nature.toUpperCase()}
              subtitle={<span>{machine.brand.toUpperCase()+' '+machine.type.toUpperCase()}</span>}
              actionIcon={
                <div>
                  <IconButton aria-label={`Informations sur ${machine.type.toUpperCase()}`} className={classes.icon}  onClick={()=>handleMachineAction(machine,'information')}>
                    <InfoIcon/>
                  </IconButton>
                  <IconButton aria-label={`Informations sur ${machine.type.toUpperCase()}`} className={classes.icon}  onClick={()=>handleMachineAction(machine,'calendar')}>
                    <DateRangeIcon/>
                  </IconButton>
                  <IconButton aria-label={`Informations sur ${machine.type.toUpperCase()}`} className={classes.icon}  onClick={()=>handleMachineAction(machine,'booking')}>
                    <DescriptionIcon/>
                  </IconButton>
                </div>
              }
            />
          </GridListTile>
        ))
        }
      </GridList>
    </div>
  );
}
