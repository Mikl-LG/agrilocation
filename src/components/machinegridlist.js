import React from 'react';
import 'typeface-roboto';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DeleteIcon from '@material-ui/icons/Delete';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Axios from 'axios';


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

export default function Machinegridlist({dealerColor,dealerBackgroundColor,handleMachineAction,machine_catalog,setActionState,returnHomeInformUser,updateCatalogMachine}) {
  const classes = useStyles();

  /**DELETE MACHINE FUNCTION */
  const deleteMachine = async(machine) => {
    const axiosResponse = await Axios({
      method:"post",
      url:'https://agrilocation.herokuapp.com/post/deleteMachine',
      data:machine
    })
  
    console.log('deleteMachine : ',deleteMachine);
    const {status,data} = axiosResponse;
  
    if(status === 201){
      returnHomeInformUser('Votre machine est supprimée','success')
      updateCatalogMachine();
    }
  }

  return (
    <div className={classes.root}>
      
        {
        machine_catalog&&machine_catalog.length
        ?<GridList cellHeight={180} className={classes.gridList}>
        {
          machine_catalog.map((machine) => (
          
            <GridListTile key={machine.id} cols={1}>
              <img src={machine.image_url} alt={machine.type} />
              <GridListTileBar
                title={machine.nature.toUpperCase()}
                subtitle={<span>{machine.brand.toUpperCase()+' '+machine.type.toUpperCase()}</span>}
                actionIcon={
                  <div>
                    <IconButton aria-label={`Informations sur ${machine.type.toUpperCase()}`} className={classes.icon}  onClick={()=>deleteMachine(machine)}>
                      <DeleteIcon/>
                    </IconButton>
                    <IconButton aria-label={`Informations sur ${machine.type.toUpperCase()}`} className={classes.icon}  onClick={()=>alert('En développement : les contrats seront affichés dans un calendrier')}>
                      <DateRangeIcon/>
                    </IconButton>
                    <IconButton aria-label={`Informations sur ${machine.type.toUpperCase()}`} className={classes.icon}  onClick={()=>handleMachineAction(machine,'bookinglist')}>
                      <DescriptionIcon/>
                    </IconButton>
                    <IconButton aria-label={`Informations sur ${machine.type.toUpperCase()}`} className={classes.icon}  onClick={()=>handleMachineAction(machine,'booking')}>
                      <AddCircleOutlineIcon/>
                    </IconButton>
                  </div>
                }
              />
            </GridListTile>
          
          ))
        }
        </GridList>
        :(
          <div style={{height:'50vh',display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <Button
              variant="contained"
              style={{color:dealerColor,backgroundColor:dealerBackgroundColor,padding:'30px'}}
              className={classes.button}
              startIcon={<AddCircleOutlineIcon />}
              onClick={()=>setActionState('new_machine')}
            >
              Créez votre première machine
            </Button>
          </div>
        )
        }
      
    </div>
  );
}
